"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface PaymentInfo {
  trxid: string;
  amount?: number;
  method?: string;
  status?: string;
  payment_url?: string;
  date?: string;
}

export default function PaymentExpiredPage() {
  const params = useParams();
  const router = useRouter();
  const { trxid } = params as { trxid: string };
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    const info = sessionStorage.getItem(`payment_${trxid}`);
    if (info) {
      const parsed = JSON.parse(info);
      setPaymentInfo(parsed);
      sessionStorage.removeItem(`payment_${trxid}`);
      // Update transaction history in localStorage
      try {
        let history = JSON.parse(localStorage.getItem('transaction_history') || '[]');
        history = history.filter((h: PaymentInfo) => h.trxid !== trxid);
        history.unshift({ ...parsed, trxid, status: 'expired', date: new Date().toISOString() });
        localStorage.setItem('transaction_history', JSON.stringify(history.slice(0, 50)));
      } catch {}
    }
  }, [trxid]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">Pembayaran Expired</h1>
        <p className="mb-2">Transaksi ID: <span className="font-mono">{trxid}</span></p>
        {paymentInfo ? (
          <>
            <p className="mb-2">Jumlah: <span className="font-semibold">Rp {paymentInfo.amount?.toLocaleString() || '-'}</span></p>
            <p className="mb-2">Metode: {paymentInfo.method || '-'}</p>
            <p className="mb-2">Status: <span className="text-gray-700 font-semibold">Expired</span></p>
          </>
        ) : (
          <p className="mb-2">Pembayaran Anda telah expired. Silakan lakukan transaksi ulang.</p>
        )}
        <button className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={() => router.push("/")}>Kembali ke Beranda</button>
      </div>
    </div>
  );
}
