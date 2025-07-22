"use client";

import { useEffect, useState } from "react";
import { X, Download, Printer } from "lucide-react";
import Image from "next/image";

interface PaymentInfo {
  trxid: string;
  amount?: number;
  method?: string;
  status?: string;
  payment_url?: string;
  date?: string;
}

interface TransactionDetail {
  y_id: string;
  callback: string;
  barcode: string;
  barcode_expaired: string;
  time_callback: string;
  t_id: string;
  ut_id: string;
  time_start: string;
  status: string;
  tpoin_id: string;
  tpoin_idsubfacility: string;
  tpoin_time_start: string;
  tpoin_status: string;
  tpoin_timesuccess: string | null;
  tpoin_timeexpaired: string;
  tpoin_price: string;
  tpoin_transactionpoin: string;
  tpoin_date_start: string;
  tpoin_created_at: string;
  tpoin_updated_at: string;
  tpoin_deleted_at: string | null;
  tpoin_order_id: string;
  tpoin_payment_type: string;
  tpoin_snap_token: string;
  tpoin_snap_redirect_url: string;
  tpoin_additonaldata: string;
  tfas_id: string;
  tfas_name: string;
  tfas_pricehours: string;
  tfas_banner: string;
  tfas_description: string;
  tfas_additional: string;
  tfas_idfacility: string;
  tfas_created_at: string;
  tfas_updated_at: string;
}



export default function TransactionHistory() {
  const [history, setHistory] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'expired' | 'success'>('all');
  const [showModal, setShowModal] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail | null>(null);
  const [loadingTrxId, setLoadingTrxId] = useState<string | null>(null);

  // Function to handle payment detail check
  const handleViewPayment = async (trxid: string) => {
    setLoadingTrxId(trxid);
    try {
      // First, check transaction status to update local storage
      const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment-status?order_id=${trxid}`);
      if (statusResponse.ok) {
        const statusResult = await statusResponse.json();
        
        // Update status in localStorage if changed
        const currentHistory = [...history];
        const transactionIndex = currentHistory.findIndex(t => t.trxid === trxid);
        if (transactionIndex !== -1 && statusResult.status && statusResult.status !== currentHistory[transactionIndex].status) {
          currentHistory[transactionIndex].status = statusResult.status;
          setHistory(currentHistory);
          localStorage.setItem("transaction_history", JSON.stringify(currentHistory));
        }
      }

      // Then, try to get detailed transaction data
      const detailResponse = await fetch(`https://brihub.progesio.my.id/api/getTransaction?id=${trxid}`);
      if (detailResponse.ok) {
        const data: TransactionDetail = await detailResponse.json();
        setTransactionDetail(data);
        setShowModal(true);
      } else {
        // If no detailed data found, redirect to payment URL
        const transaction = history.find(t => t.trxid === trxid);
        if (transaction?.payment_url) {
          window.open(transaction.payment_url, '_blank');
        }
      }
    } catch (error) {
      console.error('Error fetching transaction detail:', error);
      // If error, try to redirect to payment URL
      const transaction = history.find(t => t.trxid === trxid);
      if (transaction?.payment_url) {
        window.open(transaction.payment_url, '_blank');
      }
    } finally {
      setLoadingTrxId(null);
    }
  };

  // Function to parse additional data
  const parseAdditionalData = (additionalData: string) => {
    try {
      return JSON.parse(additionalData);
    } catch {
      return {};
    }
  };

  // Function to render HTML content for print (keep HTML tags)
  const renderHtmlForPrint = (htmlString: string): string => {
    if (!htmlString) return '-';
    // Clean up common HTML entities and format for print
    return htmlString
      .replace(/&mdash;/g, '—')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/<br\s*\/?>/gi, '<br>')
      .replace(/<p>/gi, '<p style="margin: 4px 0;">')
      .replace(/<strong>/gi, '<strong style="font-weight: bold;">')
      .replace(/<em>/gi, '<em style="font-style: italic;">')
      .replace(/<ul>/gi, '<ul style="margin: 4px 0; padding-left: 16px;">')
      .replace(/<ol>/gi, '<ol style="margin: 4px 0; padding-left: 16px;">')
      .replace(/<li>/gi, '<li style="margin: 2px 0;">');
  };

  // Function to truncate HTML content to max 10 words
  const truncateHtmlContent = (htmlString: string, maxWords: number = 10): string => {
    if (!htmlString) return '-';
    
    // Remove HTML tags to count words
    const textContent = htmlString.replace(/<[^>]*>/g, '').trim();
    const words = textContent.split(/\s+/);
    
    if (words.length <= maxWords) {
      return htmlString; // Return original if within limit
    }
    
    // If longer than maxWords, truncate and add ellipsis
    const truncatedText = words.slice(0, maxWords).join(' ') + '...';
    return truncatedText;
  };

  // Function to parse facility additional data
  const parseFacilityAdditional = (additional: string) => {
    try {
      if (!additional || additional.trim() === '') {
        return {};
      }
      const parsed = JSON.parse(additional);
      return parsed || {};
    } catch (error) {
      console.error('Error parsing facility additional data:', error);
      return {};
    }
  };

  // Function to download QR Code
  const downloadQRCode = async (qrUrl: string, filename: string) => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${filename}_QR.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  // Function to print receipt as PDF
  const printReceiptPDF = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Nota Pembayaran - ${transactionDetail?.t_id}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #222; }
            .receipt-container { max-width: 480px; margin: 32px auto; background: #fff; border-radius: 16px; box-shadow: 0 2px 8px #0001; padding: 32px 28px; }
            .receipt-title { text-align: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 12px; letter-spacing: 1px; }
            .status-badge { display: inline-block; font-size: 1rem; font-weight: bold; padding: 6px 18px; border-radius: 999px; margin-bottom: 18px; background: #e8f5e9; color: #388e3c; }
            .section-title { font-size: 1.1rem; font-weight: bold; margin: 28px 0 10px 0; border-bottom: 1.5px solid #e0e0e0; padding-bottom: 4px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 7px; align-items: flex-start; }
            .row-label { color: #666; min-width: 120px; flex-shrink: 0; }
            .row-value { font-weight: 500; text-align: right; flex: 1; word-wrap: break-word; }
            .amount { font-size: 2rem; font-weight: bold; color: #16a34a; margin: 18px 0 6px 0; text-align: center; }
            .subtext { text-align: center; color: #888; font-size: 0.95rem; margin-bottom: 18px; }
            .qr-section { text-align: center; margin: 32px 0 18px 0; }
            .qr-section img { max-width: 150px; margin-bottom: 8px; }
            .customer-details, .facility-details { margin-bottom: 18px; }
            .customer-details .row, .facility-details .row { margin-bottom: 4px; }
            .footer { text-align: center; color: #aaa; font-size: 0.9rem; margin-top: 32px; }
            @media print {
              body { margin: 0; background: #fff; }
              .no-print { display: none; }
              .receipt-container { box-shadow: none; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="receipt-title">Nota Pembayaran</div>
            <div class="status-badge">${transactionDetail?.tpoin_status?.toUpperCase() || '-'}</div>
            <div class="section-title">Transaksi</div>
            <div class="row"><span class="row-label">Transaction ID</span><span class="row-value">${transactionDetail?.t_id || '-'}</span></div>
            <div class="amount">Rp ${transactionDetail?.tpoin_price ? parseInt(transactionDetail.tpoin_price).toLocaleString() : '-'}</div>
            <div class="subtext">Total Pembayaran</div>
            <div class="section-title">Detail Fasilitas</div>
            <div class="facility-details">
              <div class="row"><span class="row-label">Nama Fasilitas</span><span class="row-value">${transactionDetail?.tfas_name || '-'}</span></div>
              <div class="row"><span class="row-label">Deskripsi</span><span class="row-value">${renderHtmlForPrint(transactionDetail?.tfas_description || '')}</span></div>
              <div class="row"><span class="row-label">Harga per Jam</span><span class="row-value">${transactionDetail?.tfas_pricehours ? 'Rp ' + parseInt(transactionDetail.tfas_pricehours).toLocaleString() : '-'}</span></div>
              ${(function() {
                try {
                  if (!transactionDetail?.tfas_additional) return '';
                  const facilityAdditional = JSON.parse(transactionDetail.tfas_additional);
                  if (facilityAdditional && facilityAdditional.start && facilityAdditional.end) {
                    return `<div class='row'><span class='row-label'>Jam Operasional</span><span class='row-value'>${facilityAdditional.start} - ${facilityAdditional.end}</span></div>`;
                  }
                } catch {}
                return '';
              })()}
            </div>
            <div class="section-title">Detail Pembayaran</div>
            <div class="row"><span class="row-label">Metode</span><span class="row-value">${transactionDetail?.tpoin_payment_type || '-'}</span></div>
            <div class="row"><span class="row-label">Tanggal Booking</span><span class="row-value">${transactionDetail?.tpoin_date_start ? new Date(transactionDetail.tpoin_date_start).toLocaleDateString('id-ID') : '-'}</span></div>
            <div class="row"><span class="row-label">Waktu Transaksi</span><span class="row-value">${transactionDetail?.tpoin_created_at ? new Date(transactionDetail.tpoin_created_at).toLocaleString('id-ID') : '-'}</span></div>
            ${transactionDetail?.tpoin_timesuccess ? `<div class='row'><span class='row-label'>Waktu Sukses</span><span class='row-value'>${new Date(transactionDetail.tpoin_timesuccess).toLocaleString('id-ID')}</span></div>` : ''}
            <div class="row"><span class="row-label">Kadaluarsa</span><span class="row-value">${transactionDetail?.tpoin_timeexpaired ? new Date(transactionDetail.tpoin_timeexpaired).toLocaleString('id-ID') : '-'}</span></div>
            <div class="section-title">Detail Pelanggan</div>
            <div class="customer-details">
              ${(function() {
                try {
                  const additionalData = transactionDetail?.tpoin_additonaldata ? JSON.parse(transactionDetail.tpoin_additonaldata) : {};
                  const c = additionalData.customer_details;
                  if (!c) return '';
                  return `
                    <div class='row'><span class='row-label'>Nama</span><span class='row-value'>${c.first_name || ''} ${c.last_name || ''}</span></div>
                    <div class='row'><span class='row-label'>Email</span><span class='row-value'>${c.email || ''}</span></div>
                    <div class='row'><span class='row-label'>Telepon</span><span class='row-value'>${c.phone || ''}</span></div>
                    <div class='row'><span class='row-label'>Alamat</span><span class='row-value'>${c.address || ''}, ${c.city || ''} ${c.postal_code || ''}</span></div>
                  `;
                } catch { return ''; }
              })()}
            </div>
            ${(transactionDetail?.tfas_idfacility === '1' && transactionDetail?.barcode && transactionDetail?.barcode_expaired && new Date(transactionDetail.barcode_expaired) > new Date()) ? `
              <div class='section-title'>QR Code Tiket</div>
              <div class='qr-section'>
                <img src='${transactionDetail.barcode}' alt='QR Code' />
                <div class='subtext'>Berlaku hingga: ${new Date(transactionDetail.barcode_expaired).toLocaleString('id-ID')}</div>
              </div>
            ` : ''}
            <div class="footer">Terima kasih telah melakukan transaksi.</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Load from localStorage only (no API check on load)
  useEffect(() => {
    const loadFromLocalStorage = () => {
      setLoading(true);
      const data = localStorage.getItem("transaction_history");
      if (data) {
        const arr: PaymentInfo[] = JSON.parse(data);
        setHistory(arr);
      }
      setLoading(false);
    };
    loadFromLocalStorage();
  }, []);

  // Helper for status badge
  const statusColor = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'success': return 'bg-green-100 text-green-700 border-green-400';
      case 'capture': return 'bg-green-100 text-green-700 border-green-400';
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

  // Filtered history
  const filteredHistory = filter === 'all'
    ? history
    : history.filter((trx) => {
        if (filter === 'pending') return (trx.status || '').toLowerCase() === 'pending';
        if (filter === 'expired') return (trx.status || '').toLowerCase() === 'expired';
        if (filter === 'success') return ['success', 'capture'].includes((trx.status || '').toLowerCase());
        return true;
      });

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4 bg-gray-50 pt-[6rem]">
      <h2 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-800">Riwayat Transaksi</h2>

      {/* Filter Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:justify-center gap-2 sm:gap-3 mb-8 w-full max-w-md sm:max-w-none">
        <button
          className={`px-3 sm:px-4 py-2 rounded-full font-semibold border transition-all text-xs sm:text-sm ${filter === 'all' ? 'bg-[#8BC34A] text-white border-[#8BC34A]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
          onClick={() => setFilter('all')}
        >
          Semua
        </button>
        <button
          className={`px-3 sm:px-4 py-2 rounded-full font-semibold border transition-all text-xs sm:text-sm ${filter === 'pending' ? 'bg-yellow-400 text-white border-yellow-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`px-3 sm:px-4 py-2 rounded-full font-semibold border transition-all text-xs sm:text-sm ${filter === 'expired' ? 'bg-gray-400 text-white border-gray-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
          onClick={() => setFilter('expired')}
        >
          Expired
        </button>
        <button
          className={`px-3 sm:px-4 py-2 rounded-full font-semibold border transition-all text-xs sm:text-sm ${filter === 'success' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
          onClick={() => setFilter('success')}
        >
          Success
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#8BC34A] mb-6"></div>
          <div className="text-gray-500 text-lg">Memuat riwayat transaksi...</div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-gray-500 text-lg">Tidak ada transaksi dengan filter ini.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-6xl">
          {filteredHistory.map((trx) => (
            <div key={trx.trxid} className="relative border border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all group overflow-hidden">
              {/* Status Ribbon */}
              <div className={`absolute top-2 right-2 md:top-3 md:right-3 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold ${statusColor(trx.status)} z-10`}>
                {trx.status?.toUpperCase() || '-'}
              </div>
              
              {/* Card Content */}
              <div className="p-3 pt-8 md:p-6 md:pt-12">
                {/* Header Info */}
                <div className="mb-3 md:mb-4">
                  <div className="font-mono text-xs text-gray-500 mb-1">ID: {trx.trxid}</div>
                  <div className="text-xs text-gray-400">{trx.date ? new Date(trx.date).toLocaleString() : '-'}</div>
                </div>
                
                {/* Amount */}
                <div className="text-xl md:text-3xl font-bold text-green-600 mb-3 md:mb-4">
                  Rp {trx.amount?.toLocaleString() || '-'}
                </div>
                
                {/* Method */}
                <div className="mb-4 md:mb-6">
                  <span className="text-xs md:text-sm text-gray-600">Metode: </span>
                  <span className="text-xs md:text-sm font-semibold text-gray-800">{trx.method || '-'}</span>
                </div>
                
                {/* Action Button */}
                {trx.payment_url && (
                  <button 
                    onClick={() => handleViewPayment(trx.trxid)}
                    disabled={loadingTrxId === trx.trxid}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 md:py-3 px-3 md:px-4 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loadingTrxId === trx.trxid ? 'Memuat...' : 'Lihat/Bayar'}
                  </button>
                )}
              </div>
              
              {/* Decorative background */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-5 transition-all duration-300 bg-gradient-to-br from-[#8BC34A] to-blue-400" />
            </div>
          ))}
        </div>
      )}

      {/* Payment Detail Modal */}
      {showModal && transactionDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">Nota Pembayaran</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6" id="receipt-content">
              {/* Transaction Status */}
              <div className="text-center mb-6">
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${statusColor(transactionDetail.tpoin_status)}`}>
                  {transactionDetail.tpoin_status.toUpperCase()}
                </div>
              </div>

              {/* Transaction ID */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Transaction ID</div>
                  <div className="font-mono text-lg font-bold text-gray-800">{transactionDetail.t_id}</div>
                </div>
              </div>

              {/* Amount */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600">
                  Rp {parseInt(transactionDetail.tpoin_price).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Pembayaran</div>
              </div>

              {/* Facility Details */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Detail Fasilitas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Fasilitas</span>
                    <span className="font-medium">{transactionDetail.tfas_name || '-'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 flex-shrink-0 mr-3">Deskripsi</span>
                    <div 
                      className="font-medium text-right flex-1"
                      dangerouslySetInnerHTML={{ 
                        __html: truncateHtmlContent(transactionDetail.tfas_description || '', 10)
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga per Jam</span>
                    <span className="font-medium">
                      {transactionDetail.tfas_pricehours ? `Rp ${parseInt(transactionDetail.tfas_pricehours).toLocaleString()}` : '-'}
                    </span>
                  </div>
                  {(() => {
                    try {
                      if (!transactionDetail.tfas_additional) return null;
                      
                      const facilityAdditional = parseFacilityAdditional(transactionDetail.tfas_additional);
                      if (facilityAdditional && facilityAdditional.start && facilityAdditional.end) {
                        return (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Jam Operasional</span>
                            <span className="font-medium">{facilityAdditional.start} - {facilityAdditional.end}</span>
                          </div>
                        );
                      }
                    } catch (error) {
                      console.error('Error parsing facility additional data:', error);
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Metode Pembayaran</span>
                  <span className="font-semibold">{transactionDetail.tpoin_payment_type}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tanggal Booking</span>
                  <span className="font-semibold">{new Date(transactionDetail.tpoin_date_start).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Waktu Transaksi</span>
                  <span className="font-semibold">{new Date(transactionDetail.tpoin_created_at).toLocaleString('id-ID')}</span>
                </div>
                {transactionDetail.tpoin_timesuccess && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Waktu Sukses</span>
                    <span className="font-semibold">{new Date(transactionDetail.tpoin_timesuccess).toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Kadaluarsa</span>
                  <span className="font-semibold">{new Date(transactionDetail.tpoin_timeexpaired).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Customer Details (if available) */}
              {(() => {
                const additionalData = parseAdditionalData(transactionDetail.tpoin_additonaldata);
                const customerDetails = additionalData.customer_details;
                if (customerDetails) {
                  return (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Detail Pelanggan</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nama</span>
                          <span className="font-medium">{customerDetails.first_name} {customerDetails.last_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email</span>
                          <span className="font-medium">{customerDetails.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Telepon</span>
                          <span className="font-medium">{customerDetails.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Alamat</span>
                          <span className="font-medium">{customerDetails.address}, {customerDetails.city} {customerDetails.postal_code}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* QR Code (if available and not expired) */}
              {transactionDetail.tfas_idfacility === "1" && transactionDetail.barcode && transactionDetail.barcode_expaired && 
               new Date(transactionDetail.barcode_expaired) > new Date() && (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <h4 className="font-semibold text-gray-800 mb-3">QR Code Tiket</h4>
                  <div className="mb-4">
                    <Image 
                      src={transactionDetail.barcode} 
                      alt="QR Code" 
                      width={150}
                      height={150}
                      className="mx-auto mb-2"
                    />
                    <div className="text-xs text-gray-600 mb-3">
                      Berlaku hingga: {new Date(transactionDetail.barcode_expaired).toLocaleString('id-ID')}
                    </div>
                    <button
                      onClick={() => downloadQRCode(transactionDetail.barcode, transactionDetail.t_id)}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm no-print"
                    >
                      <Download className="w-4 h-4" />
                      Download QR
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 justify-center no-print">
                <button 
                  onClick={printReceiptPDF}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  <Printer className="w-5 h-5" />
                  Print PDF
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
