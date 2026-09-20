import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

const STORAGE_KEY = "sakuin_fab_position";
const BUTTON_SIZE = 56; // 56px = w-14 h-14
const MARGIN = 16; // 16px from screen edge

export default function DraggableFAB({ onOpenQuickAdd }) {
   const [isReady, setIsReady] = useState(false);
   const [isDragging, setIsDragging] = useState(false);
   const pointerDownPos = useRef({ x: 0, y: 0, time: 0 });
   const currentPos = useRef({ x: 0, y: 0, side: "right" });
   const buttonRef = useRef(null);
   const controls = useAnimation();

   // Compute safe bounds inside viewport
   const getBounds = useCallback(() => {
      const maxX = Math.max(MARGIN, window.innerWidth - BUTTON_SIZE - MARGIN);
      // Keep within viewport, considering mobile bottom navigation (bottom ~80px) and top header (~70px)
      const minY = 70;
      const maxY = Math.max(minY, window.innerHeight - BUTTON_SIZE - 90);
      return { minX: MARGIN, maxX, minY, maxY };
   }, []);

   // Calculate snap to nearest edge (left or right)
   const calculateSnap = useCallback((x, y) => {
      const bounds = getBounds();
      const clampedY = Math.min(Math.max(y, bounds.minY), bounds.maxY);
      const isCloserToLeft = x + BUTTON_SIZE / 2 < window.innerWidth / 2;
      const targetX = isCloserToLeft ? bounds.minX : bounds.maxX;
      const side = isCloserToLeft ? "left" : "right";
      return { x: targetX, y: clampedY, side };
   }, [getBounds]);

   // Initialize position from localStorage or default
   useEffect(() => {
      const bounds = getBounds();
      const saved = localStorage.getItem(STORAGE_KEY);
      let initialPos;

      if (saved) {
         try {
            const parsed = JSON.parse(saved);
            initialPos = calculateSnap(parsed.x, parsed.y);
         } catch {
            initialPos = { x: bounds.maxX, y: bounds.maxY - 40, side: "right" };
         }
      } else {
         initialPos = { x: bounds.maxX, y: bounds.maxY - 40, side: "right" };
      }

      currentPos.current = initialPos;
      controls.set({ x: initialPos.x, y: initialPos.y });
      setIsReady(true);

      const handleResize = () => {
         const snap = calculateSnap(currentPos.current.x, currentPos.current.y);
         currentPos.current = snap;
         controls.start({ x: snap.x, y: snap.y, transition: { duration: 0.25, ease: "easeOut" } });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, [getBounds, calculateSnap, controls]);

   // Pointer Down (Mouse & Touch)
   const handlePointerDown = (e) => {
      // Only primary mouse button or touch
      if (e.button !== undefined && e.button !== 0) return;
      try {
         e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
         // ignore
      }

      pointerDownPos.current = {
         x: e.clientX,
         y: e.clientY,
         time: Date.now(),
         initialButtonX: currentPos.current.x,
         initialButtonY: currentPos.current.y,
         pointerId: e.pointerId,
         target: e.currentTarget,
      };
      setIsDragging(false);
   };

   // Pointer Move
   const handlePointerMove = (e) => {
      if (!pointerDownPos.current.time) return;

      const deltaX = e.clientX - pointerDownPos.current.x;
      const deltaY = e.clientY - pointerDownPos.current.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > 8) {
         if (!isDragging) setIsDragging(true);

         const bounds = getBounds();
         const newX = Math.min(Math.max(pointerDownPos.current.initialButtonX + deltaX, 0), window.innerWidth - BUTTON_SIZE);
         const newY = Math.min(Math.max(pointerDownPos.current.initialButtonY + deltaY, bounds.minY), bounds.maxY);

         currentPos.current.x = newX;
         currentPos.current.y = newY;
         controls.set({ x: newX, y: newY });
      }
   };

   // Pointer Up
   const handlePointerUp = (e) => {
      if (!pointerDownPos.current.time) return;

      const deltaX = e.clientX - pointerDownPos.current.x;
      const deltaY = e.clientY - pointerDownPos.current.y;
      const distance = Math.hypot(deltaX, deltaY);

      try {
         if (pointerDownPos.current.target && pointerDownPos.current.pointerId !== undefined) {
            pointerDownPos.current.target.releasePointerCapture(pointerDownPos.current.pointerId);
         }
      } catch (err) {
         // ignore
      }

      pointerDownPos.current.time = 0;

      // Tap detection (< 8px movement)
      if (distance <= 8) {
         setIsDragging(false);
         if (e.cancelable) {
            e.preventDefault();
         }
         e.stopPropagation();
         if (onOpenQuickAdd) {
            onOpenQuickAdd();
         }
         return;
      }

      // Drag ended -> Magnetic Snap to Nearest Edge (AssistiveTouch iOS)
      const snap = calculateSnap(currentPos.current.x, currentPos.current.y);
      currentPos.current = snap;

      try {
         localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
      } catch (err) {
         console.warn("Failed to persist FAB position", err);
      }

      controls.start({
         x: snap.x,
         y: snap.y,
         transition: { type: "spring", stiffness: 450, damping: 30 },
      });

      setTimeout(() => setIsDragging(false), 50);
   };

   if (!isReady) return null;

   return (
      <div
         className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
         style={{ touchAction: "none" }}
      >
         <motion.button
            ref={buttonRef}
            animate={controls}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            whileHover={{ scale: 1.08 }}
            onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
            }}
            className={`pointer-events-auto absolute top-0 left-0 w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-600/35 border-2 border-[var(--color-surface)] flex items-center justify-center cursor-pointer select-none transition-shadow ${
               isDragging ? "shadow-2xl shadow-emerald-500/50 scale-105" : ""
            }`}
            style={{
               touchAction: "none",
               userSelect: "none",
               WebkitUserSelect: "none",
               WebkitTouchCallout: "none",
            }}
            title="Catat Pengeluaran Sat-Set — Geser ke mana saja"
            aria-label="Catat Pengeluaran Cepat"
         >
            <Plus size={26} className="stroke-[2.8]" />
         </motion.button>
      </div>
   );
}
