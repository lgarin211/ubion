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

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const { trxid } = params as { trxid: string };
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    // Fetch payment info from API or sessionStorage
    const info = sessionStorage.getItem(`payment_${trxid}`);
    if (info) {
      const parsed = JSON.parse(info);
      setPaymentInfo(parsed);
      // Remove from session if success
      sessionStorage.removeItem(`payment_${trxid}`);
      // Update transaction history in localStorage
      try {
        let history = JSON.parse(localStorage.getItem('transaction_history') || '[]');
        // Remove old trxid if exists
        history = history.filter((h: PaymentInfo) => h.trxid !== trxid);
        history.unshift({ ...parsed, trxid, status: 'success', date: new Date().toISOString() });
        localStorage.setItem('transaction_history', JSON.stringify(history.slice(0, 50)));
      } catch {}
    }
  }, [trxid]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-900">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-green-700">Pembayaran Berhasil!</h1>
        <p className="mb-2">Transaksi ID: <span className="font-mono">{trxid}</span></p>
        {paymentInfo ? (
          <>
            <p className="mb-2">Jumlah: <span className="font-semibold">Rp {paymentInfo.amount?.toLocaleString() || '-'}</span></p>
            <p className="mb-2">Metode: {paymentInfo.method || '-'}</p>
            <p className="mb-2">Status: <span className="text-green-700 font-semibold">Sukses</span></p>
          </>
        ) : (
          <p className="mb-2">Pembayaran berhasil. Terima kasih!</p>
        )}
        <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => router.push("/")}>Kembali ke Beranda</button>
      </div>
    </div>
  );
}
