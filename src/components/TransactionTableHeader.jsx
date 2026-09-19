import React from "react";

const TransactionTableHeader = () => {
   return (
      <thead>
         <tr className="bg-[var(--color-bg)] text-[var(--color-ink-muted)] text-[11px] font-semibold uppercase tracking-wider border-b border-[var(--color-border)]">
            <th className="py-3 px-3.5 text-center w-12">
               No
            </th>
            <th className="py-3 px-4 text-left">
               Tanggal
            </th>
            <th className="py-3 px-4 text-left">
               Nama Transaksi
            </th>
            <th className="py-3 px-4 text-left">
               Kategori
            </th>
            <th className="py-3 px-4 text-right">
               Nominal
            </th>
            <th className="py-3 px-4 text-center w-24">
               Aksi
            </th>
         </tr>
      </thead>
   );
};

export default TransactionTableHeader;
