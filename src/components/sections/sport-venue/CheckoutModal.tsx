"use client";

import { Button } from "@/components/ui/button";

interface CustomerDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

interface PaymentMethods {
  success: boolean;
  payment_methods: {
    [key: string]: {
      type: string;
      name: string;
      description: string;
      enabled: boolean;
      icon: string;
      banks?: { [key: string]: { name: string; code: string } };
      providers?: { [key: string]: { name: string; code: string } };
      stores?: { [key: string]: { name: string; code: string } };
    };
  };
}

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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubFacility: FacilityDetail | null;
  selectedDate: string;
  selectedTimes: string[];
  getTimeRangeDisplay: () => string;
  calculateTotalPrice: () => number;
  customerDetails: CustomerDetails;
  handleCustomerDetailsChange: (field: keyof CustomerDetails, value: string) => void;
  paymentMethods: PaymentMethods | null;
  loadingPaymentMethods: boolean;
  selectedPaymentType: string;
  setSelectedPaymentType: (type: string) => void;
  selectedPaymentDetails: string;
  setSelectedPaymentDetails: (details: string) => void;
  submittingTransaction: boolean;
  onSubmitTransaction: () => void;
  ticketCount?: number;
  ticketTotal?: number;
}

export function CheckoutModal({
  isOpen,
  onClose,
  selectedSubFacility,
  selectedDate,
  selectedTimes,
  getTimeRangeDisplay,
  calculateTotalPrice,
  customerDetails,
  handleCustomerDetailsChange,
  paymentMethods,
  loadingPaymentMethods,
  selectedPaymentType,
  setSelectedPaymentType,
  selectedPaymentDetails,
  setSelectedPaymentDetails,
  submittingTransaction,
  onSubmitTransaction,
  ticketCount,
  ticketTotal,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-black">Checkout</h3>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 text-2xl font-bold"
            aria-label="Close checkout"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 text-black">
          {/* Booking Summary */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold text-lg mb-2">Booking Summary</h4>
            <div className="space-y-2">
              <div><strong>Facility:</strong> {selectedSubFacility?.nama_fasilitas}</div>
              <div><strong>Date:</strong> {selectedDate}</div>
              {typeof ticketCount === 'number' ? (
                <>
                  <div><strong>Jumlah Tiket:</strong> {ticketCount}</div>
                  <div><strong>Total:</strong> Rp. {(ticketTotal || 0).toLocaleString()}</div>
                </>
              ) : (
                <>
                  <div><strong>Time:</strong> {getTimeRangeDisplay()} ({selectedTimes.length} hour{selectedTimes.length > 1 ? 's' : ''})</div>
                  <div><strong>Total:</strong> Rp. {calculateTotalPrice().toLocaleString()}</div>
                </>
              )}
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="mb-6">
            <h4 className="font-bold text-lg mb-4">Customer Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  value={customerDetails.first_name}
                  onChange={(e) => handleCustomerDetailsChange('first_name', e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  value={customerDetails.last_name}
                  onChange={(e) => handleCustomerDetailsChange('last_name', e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => handleCustomerDetailsChange('email', e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => handleCustomerDetailsChange('phone', e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={customerDetails.address}
                  onChange={(e) => handleCustomerDetailsChange('address', e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={customerDetails.city}
                  onChange={(e) => handleCustomerDetailsChange('city', e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  value={customerDetails.postal_code}
                  onChange={(e) => handleCustomerDetailsChange('postal_code', e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h4 className="font-bold text-lg mb-4">Payment Method</h4>
            {loadingPaymentMethods ? (
              <div className="text-center py-4">Loading payment methods...</div>
            ) : paymentMethods?.payment_methods ? (
              <div className="space-y-4">
                {Object.entries(paymentMethods.payment_methods).map(([key, method]) => {
                  if (!method.enabled) return null;
                  
                  return (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <input
                          type="radio"
                          id={key}
                          name="paymentMethod"
                          value={key}
                          checked={selectedPaymentType === key}
                          onChange={(e) => {
                            setSelectedPaymentType(e.target.value);
                            setSelectedPaymentDetails('');
                          }}
                          className="w-4 h-4"
                        />
                        <label htmlFor={key} className="font-medium cursor-pointer">
                          {method.name}
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                      
                      {selectedPaymentType === key && (
                        <div className="ml-7">
                          {method.banks && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {Object.entries(method.banks).map(([bankKey, bank]) => (
                                <label key={bankKey} className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="paymentDetails"
                                    value={bank.code}
                                    checked={selectedPaymentDetails === bank.code}
                                    onChange={(e) => setSelectedPaymentDetails(e.target.value)}
                                    className="w-3 h-3"
                                  />
                                  <span className="text-sm">{bank.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          
                          {method.providers && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {Object.entries(method.providers).map(([providerKey, provider]) => (
                                <label key={providerKey} className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="paymentDetails"
                                    value={provider.code}
                                    checked={selectedPaymentDetails === provider.code}
                                    onChange={(e) => setSelectedPaymentDetails(e.target.value)}
                                    className="w-3 h-3"
                                  />
                                  <span className="text-sm">{provider.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          
                          {method.stores && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {Object.entries(method.stores).map(([storeKey, store]) => (
                                <label key={storeKey} className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="paymentDetails"
                                    value={store.code}
                                    checked={selectedPaymentDetails === store.code}
                                    onChange={(e) => setSelectedPaymentDetails(e.target.value)}
                                    className="w-3 h-3"
                                  />
                                  <span className="text-sm">{store.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-red-500">Failed to load payment methods</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={submittingTransaction}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-400 text-black hover:bg-teal-500"
              onClick={onSubmitTransaction}
              disabled={submittingTransaction || !customerDetails.first_name || !customerDetails.email || !selectedPaymentType}
            >
              {submittingTransaction ? 'Processing...' : 'Complete Payment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
