"use client";

import { Button } from "@/components/ui/button";

interface AvailableTime {
  time: string;
  label: string;
  hour: number;
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

interface BookingSectionProps {
  loadingTimes: boolean;
  availableTimes: AvailableTime[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTimes: string[];
  handleTimeSlotClick: (time: string) => void;
  getTimeRangeDisplay: () => string;
  selectedSubFacility: FacilityDetail | null;
  calculateTotalPrice: () => number;
  onCheckout: () => void;
}

export function BookingSection({
  loadingTimes,
  availableTimes,
  selectedDate,
  setSelectedDate,
  selectedTimes,
  handleTimeSlotClick,
  getTimeRangeDisplay,
  selectedSubFacility,
  calculateTotalPrice,
  onCheckout,
}: BookingSectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-12">
      {/* Available Times Display */}
      {loadingTimes ? (
        <div className="bg-white rounded-lg p-6 text-black flex-1">
          <h2 className="font-bold text-lg mb-4 text-green-700">Available Times</h2>
          <div className="text-center py-4">Loading available times...</div>
        </div>
      ) : availableTimes.length > 0 ? (
        <>
          <div className="bg-white rounded-lg p-6 text-black flex-1">
            <h2 className="font-bold text-lg mb-4 text-green-700">Available Times</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Date:</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            
            <div>
              <div className="mb-3 text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span role="img" aria-label="info">ℹ️</span>
                  <span className="font-semibold text-blue-600">Persyaratan Booking:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 ml-6">
                  <li>Pilih minimal <strong>2 jam berturut-turut</strong></li>
                  <li>Klik slot waktu untuk memilih/membatalkan</li>
                  <li>Waktu yang dipilih harus berurutan tanpa jeda</li>
                </ul>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {availableTimes.map((timeSlot) => (
                  <button
                    key={timeSlot.time}
                    onClick={() => handleTimeSlotClick(timeSlot.time)}
                    className={`p-2 rounded text-xs transition-all ${
                      selectedTimes.includes(timeSlot.time)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="font-semibold">{timeSlot.time}</div>
                    <div className="text-xs">{timeSlot.label}</div>
                  </button>
                ))}
              </div>
              {selectedTimes.length > 0 && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  selectedTimes.length >= 2 
                    ? 'bg-green-100 border border-green-200' 
                    : 'bg-yellow-100 border border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span role="img" aria-label={selectedTimes.length >= 2 ? "check" : "warning"}>
                      {selectedTimes.length >= 2 ? "✅" : "⚠️"}
                    </span>
                    <strong>
                      {selectedTimes.length >= 2 ? "Waktu Terpilih:" : "Perhatian:"}
                    </strong>
                  </div>
                  <div className={selectedTimes.length >= 2 ? "text-green-700" : "text-yellow-700"}>
                    {getTimeRangeDisplay()} 
                    <span className="ml-1">({selectedTimes.length} jam)</span>
                  </div>
                  {selectedTimes.length < 2 && (
                    <div className="text-xs text-yellow-600 mt-1">
                      Anda perlu memilih minimal 2 jam berturut-turut untuk melanjutkan booking.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Form - Only show when there are available times */}
          <div className="bg-white rounded-lg p-6 text-black flex-1">
            <h2 className="font-bold text-lg mb-4 text-green-700">Booking Venue</h2>
            
            {/* Selected Sub-facility Info */}
            {selectedSubFacility && (
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <div className="font-semibold text-green-700">{selectedSubFacility.nama_fasilitas}</div>
                <div className="text-sm text-gray-600">{selectedSubFacility.f_type}</div>
                <div className="font-bold">Rp. {selectedSubFacility.pricehours.toLocaleString()}/hour</div>
              </div>
            )}
            
            <form 
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="block text-sm font-medium mb-1">Selected Date:</label>
                <input 
                  type="text" 
                  value={selectedDate}
                  readOnly
                  className="border rounded px-2 py-1 w-full bg-gray-50" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Selected Time(s):</label>
                <input 
                  type="text" 
                  value={getTimeRangeDisplay()}
                  readOnly
                  placeholder="Select time slot(s) from the left"
                  className="border rounded px-2 py-1 w-full bg-gray-50" 
                />
                {selectedTimes.length > 0 && (
                  <div className={`text-xs mt-1 ${
                    selectedTimes.length >= 2 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    <div className="flex items-center gap-1">
                      <span role="img" aria-label={selectedTimes.length >= 2 ? "check" : "warning"}>
                        {selectedTimes.length >= 2 ? "✅" : "⚠️"}
                      </span>
                      <span>
                        Durasi: {selectedTimes.length} jam 
                        {selectedTimes.length < 2 && " (minimal 2 jam)"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-green-700 text-sm">Promo: 10% discount available</div>
              <div className="font-bold">
                Total: Rp. {calculateTotalPrice().toLocaleString()}
              </div>
              
              <Button 
                type="button"
                className="bg-teal-400 text-black hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedTimes.length < 2 || !selectedDate}
                onClick={(e) => {
                  e.preventDefault();
                  onCheckout();
                }}
              >
                {selectedTimes.length === 0 
                  ? 'Pilih Waktu Terlebih Dahulu' 
                  : selectedTimes.length < 2 
                  ? `Pilih ${2 - selectedTimes.length} Jam Lagi (Min. 2 Jam)`
                  : 'Submit Payment'
                }
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 text-black flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏗️</div>
            <div className="text-gray-500 font-semibold text-lg mb-2"></div>
            <div className="text-gray-400 text-sm max-w-xs mx-auto">
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
