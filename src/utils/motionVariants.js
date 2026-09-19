/**
 * Sakuin Centralized Framer Motion Variants & Micro-Interactions
 * Konsistensi animasi: durasi 200-300ms, easing easeOut, spring damping 28-30.
 */

// Transisi halus antar rute / halaman
export const pageTransition = {
   initial: {
      opacity: 0,
      y: 12,
   },
   animate: {
      opacity: 1,
      y: 0,
      transition: {
         duration: 0.25,
         ease: [0.25, 1, 0.5, 1], // natural easeOut
      },
   },
   exit: {
      opacity: 0,
      y: -10,
      transition: {
         duration: 0.18,
         ease: [0.5, 0, 0.75, 0], // quick easeIn
      },
   },
};

// Animasi kemunculan kartu / elemen individual
export const fadeSlideUp = {
   initial: { opacity: 0, y: 16 },
   animate: {
      opacity: 1,
      y: 0,
      transition: {
         duration: 0.28,
         ease: "easeOut",
      },
   },
   exit: {
      opacity: 0,
      y: 10,
      transition: {
         duration: 0.18,
      },
   },
};

// Container untuk kemunculan bertahap (Stagger)
export const staggerContainer = (staggerDelay = 0.04, delayChildren = 0.02) => ({
   initial: {},
   animate: {
      transition: {
         staggerChildren: staggerDelay,
         delayChildren,
      },
   },
});

// Item di dalam container bertahap (Stagger Item)
export const staggerItem = {
   initial: { opacity: 0, y: 12 },
   animate: {
      opacity: 1,
      y: 0,
      transition: {
         duration: 0.25,
         ease: "easeOut",
      },
   },
};

// Micro-Interaction: Tap feedback
export const tapScale = {
   scale: 0.96,
   transition: { duration: 0.1 },
};

// Micro-Interaction: Tap feedback halus (icon buttons)
export const tapScaleSubtle = {
   scale: 0.92,
   transition: { duration: 0.08 },
};

// Micro-Interaction: Desktop hover feedback
export const hoverScale = {
   scale: 1.02,
   transition: { duration: 0.15 },
};

// Animasi Dropdown Menu (Navbar / Filter)
export const dropdownMenu = {
   initial: {
      opacity: 0,
      scale: 0.95,
      y: -6,
   },
   animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
         duration: 0.18,
         ease: "easeOut",
      },
   },
   exit: {
      opacity: 0,
      scale: 0.95,
      y: -6,
      transition: {
         duration: 0.14,
         ease: "easeIn",
      },
   },
};

// Animasi Bottom Sheet Drawer (Mobile)
export const drawerSpring = {
   initial: { y: "100%" },
   animate: {
      y: 0,
      transition: {
         type: "spring",
         damping: 28,
         stiffness: 300,
      },
   },
   exit: {
      y: "100%",
      transition: {
         duration: 0.22,
         ease: "easeIn",
      },
   },
};

// Backdrop modal transparan
export const backdropFade = {
   initial: { opacity: 0 },
   animate: { opacity: 1, transition: { duration: 0.2 } },
   exit: { opacity: 0, transition: { duration: 0.18 } },
};
