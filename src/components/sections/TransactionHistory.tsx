"use client";

import { useEffect, useState } from "react";

interface PaymentInfo {
  trxid: string;
  amount?: number;
  method?: string;
  status?: string;
  payment_url?: string;
  date?: string;
}

export default function TransactionHistory() {
  const [history, setHistory] = useState<PaymentInfo[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("transaction_history");
    if (data) {
      console.log("Transaction history loaded from localStorage", data);
      setHistory(JSON.parse(data));
    }
  }, []);

  // Helper for status badge
  const statusColor = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'success': return 'bg-green-100 text-green-700 border-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'failed':
      case 'deny':
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-400';
      case 'expired': return 'bg-gray-200 text-gray-700 border-gray-400';
      case 'refunded':
      case 'partial_refunded': return 'bg-blue-100 text-blue-700 border-blue-400';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4 bg-gray-50 pt-[6rem]">
      <h2 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-800">Riwayat Transaksi</h2>
      {history.length === 0 ? (
        <div className="text-gray-500 text-lg">Belum ada transaksi.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {history.map((trx) => (
            <div key={trx.trxid} className="border rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-gray-500">ID: {trx.trxid}</span>
                <span className={`px-2 py-1 rounded text-xs border font-semibold ${statusColor(trx.status)}`}>{trx.status}</span>
              </div>
              <div className="mb-1 text-sm text-gray-600">Tanggal: <span className="font-medium">{trx.date ? new Date(trx.date).toLocaleString() : '-'}</span></div>
              <div className="mb-1 text-lg">Jumlah: <span className="font-bold text-green-700">Rp {trx.amount?.toLocaleString() || '-'}</span></div>
              <div className="mb-1 text-sm">Metode: <span className="font-medium">{trx.method || '-'}</span></div>
              {trx.payment_url && (
                <a href={trx.payment_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold">Lihat/Bayar</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
