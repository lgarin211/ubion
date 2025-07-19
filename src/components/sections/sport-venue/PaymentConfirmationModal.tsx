"use client";

import { Button } from "@/components/ui/button";

interface FacilityDetail {
  id: number;
  idfacility: number;
  nama_fasilitas: string;
  pricehours: number;
  description: string;
  list_sf: string;
  list_f: string;
  f_type: string;
  f_additional: string | null;
  sf_additional: string | null;
}

interface CustomerDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedSubFacility: FacilityDetail | null;
  selectedDate: string;
  selectedTimes: string[];
  getTimeRangeDisplay: () => string;
  calculateTotalPrice: () => number;
  customerDetails: CustomerDetails;
  selectedPaymentType: string;
  selectedPaymentDetails: string;
  submittingTransaction: boolean;
  ticketCount?: number;
  facilityId?: string;
}

export function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  selectedSubFacility,
  selectedDate,
  selectedTimes,
  getTimeRangeDisplay,
  calculateTotalPrice,
  customerDetails,
  selectedPaymentType,
  selectedPaymentDetails,
  submittingTransaction,
  ticketCount,
  facilityId,
}: PaymentConfirmationModalProps) {
  if (!isOpen) return null;

  const getPaymentMethodName = (type: string) => {
    switch (type) {
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'e_wallet':
        return 'E-Wallet';
      case 'convenience_store':
        return 'Convenience Store';
      case 'credit_card':
        return 'Credit Card';
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-black">Konfirmasi Pembayaran</h3>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 text-2xl font-bold"
            aria-label="Close confirmation"
            disabled={submittingTransaction}
          >
            ×
          </button>
        </div>
        
        <div className="p-6 text-black">
          {/* Booking Summary */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold text-lg mb-3">Detail Booking</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Fasilitas:</span>
                <span>{selectedSubFacility?.nama_fasilitas}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tanggal:</span>
                <span>{selectedDate}</span>
              </div>
              
              {/* Show different content based on facility type */}
              {facilityId === "1" && ticketCount ? (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Jumlah Tiket:</span>
                    <span>{ticketCount} tiket</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Harga per tiket:</span>
                    <span>Rp. {selectedSubFacility?.pricehours.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>Rp. {((selectedSubFacility?.pricehours || 0) * ticketCount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Diskon (10%):</span>
                    <span>- Rp. {(((selectedSubFacility?.pricehours || 0) * ticketCount) * 0.1).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Waktu:</span>
                    <span>{getTimeRangeDisplay()} ({selectedTimes.length} jam)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Harga per jam:</span>
                    <span>Rp. {selectedSubFacility?.pricehours.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>Rp. {((selectedSubFacility?.pricehours || 0) * selectedTimes.length).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Diskon (10%):</span>
                    <span>- Rp. {(((selectedSubFacility?.pricehours || 0) * selectedTimes.length) * 0.1).toLocaleString()}</span>
                  </div>
                </>
              )}
              
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>Rp. {calculateTotalPrice().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold text-lg mb-3">Detail Pelanggan</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Nama:</span>
                <span>{customerDetails.first_name} {customerDetails.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{customerDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Telepon:</span>
                <span>{customerDetails.phone}</span>
              </div>
              {customerDetails.address && (
                <div className="flex justify-between">
                  <span className="font-medium">Alamat:</span>
                  <span>{customerDetails.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold text-lg mb-3">Metode Pembayaran</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Metode:</span>
                <span>{getPaymentMethodName(selectedPaymentType)}</span>
              </div>
              {selectedPaymentDetails && (
                <div className="flex justify-between">
                  <span className="font-medium">Provider:</span>
                  <span>{selectedPaymentDetails}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h5 className="font-bold text-yellow-800 mb-2">⚠️ Konfirmasi Pembayaran</h5>
            <p className="text-yellow-700 text-sm">
              Pastikan semua detail di atas sudah benar. Setelah konfirmasi, booking akan diproses 
              dan Anda akan menerima instruksi pembayaran.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={submittingTransaction}
            >
              Batal
            </Button>
            <Button
              className="bg-teal-400 text-black hover:bg-teal-500"
              onClick={onConfirm}
              disabled={submittingTransaction}
            >
              {submittingTransaction ? 'Memproses...' : 'Konfirmasi & Bayar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
