import React from "react";


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

interface CheckoutTicketHourlyProps {
  onCheckout: (selected: { time: string; count: number }[], total: number, bookingDate?: string) => void;
  pricePerTicket: number;
  selectedSubFacility?: FacilityDetail | null;
  ticketCount: number;
  setTicketCount: (count: number) => void;
  onDateChange?: (date: string) => void;
}


export const CheckoutTicketHourly: React.FC<CheckoutTicketHourlyProps> = ({
  onCheckout,
  pricePerTicket,
  selectedSubFacility,
  ticketCount,
  setTicketCount,
  onDateChange
}) => {

  const [bookingDate, setBookingDate] = React.useState<string>(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  // Notify parent component about initial date
  React.useEffect(() => {
    if (onDateChange && bookingDate) {
      onDateChange(bookingDate);
    }
  }, [onDateChange, bookingDate]); // Run when onDateChange is available or bookingDate changes

  const total = ticketCount * pricePerTicket;

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-12">
      {/* Ticket Input */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-black flex-1 flex flex-col justify-between border border-green-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span role="img" aria-label="ticket">🎟️</span> Pesan Tiket
        </h2>
        <div className="flex flex-col gap-4 flex-1 justify-center">
          {/* Date Input */}
          <label className="flex flex-col gap-2">
            <span className="text-lg font-medium flex items-center gap-2">
              <span role="img" aria-label="calendar">📅</span> Tanggal Booking
            </span>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => {
                const newDate = e.target.value;
                setBookingDate(newDate);
                // Notify parent component about date change
                if (onDateChange) {
                  onDateChange(newDate);
                }
              }}
              min={today}
              className="px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none text-lg font-medium"
              required
            />
          </label>
          
          {/* Show message if no sub-facility available */}
          {!selectedSubFacility && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="text-yellow-700 font-medium flex items-center gap-2">
                <span role="img" aria-label="warning">⚠️</span> 
                Tidak ada fasilitas yang tersedia untuk tanggal yang dipilih
              </div>
              <div className="text-yellow-600 text-sm mt-1">
                Silakan pilih tanggal lain atau coba lagi nanti
              </div>
            </div>
          )}
          
          {/* Ticket Count - Only show if selectedSubFacility exists */}
          {selectedSubFacility && (
            <label className="flex items-center justify-between text-lg font-medium">
              <span>Jumlah Tiket</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Kurangi"
                  className="w-10 h-10 rounded-full bg-green-100 text-green-700 text-2xl font-bold flex items-center justify-center border-2 border-green-400 hover:bg-green-200 transition"
                  onClick={() => setTicketCount(Math.max(0, ticketCount - 1))}
                  disabled={ticketCount === 0}
                >
                  –
                </button>
                <span className="w-12 text-center text-2xl font-bold select-none">{ticketCount}</span>
                <button
                  type="button"
                  aria-label="Tambah"
                  className="w-10 h-10 rounded-full bg-green-100 text-green-700 text-2xl font-bold flex items-center justify-center border-2 border-green-400 hover:bg-green-200 transition"
                  onClick={() => setTicketCount(Math.min(20, ticketCount + 1))}
                  disabled={ticketCount === 20}
                >
                  +
                </button>
              </div>
            </label>
          )}
        </div>
        <button
          className="w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50"
          disabled={!selectedSubFacility || ticketCount === 0 || !bookingDate}
          onClick={() => {
            window.dispatchEvent(new CustomEvent('setSelectedTimesForTicket', { detail: ['TIKET'] }));
            onCheckout([{ time: '', count: ticketCount }], total, bookingDate);
          }}
        >
          <span role="img" aria-label="cart">🛒</span> Checkout
        </button>
      </div>
      {/* Detail Column */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-black flex-1 border border-green-100">
        <h2 className="font-bold text-2xl mb-6 text-green-700 flex items-center gap-2">
          <span role="img" aria-label="info">ℹ️</span> Detail Tiket
        </h2>
        {selectedSubFacility ? (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-green-200">
            <div className="font-semibold text-green-700 text-lg mb-1 flex items-center gap-2">
              <span role="img" aria-label="venue">🏟️</span> {selectedSubFacility.nama_fasilitas}
            </div>
            <div className="text-sm text-gray-600 mb-1">{selectedSubFacility.f_type}</div>
            <div className="font-bold text-lg">Rp. {selectedSubFacility.pricehours.toLocaleString()} <span className="text-sm font-normal">/tiket</span></div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-green-200">
            <div className="font-semibold text-green-700 text-lg mb-1 flex items-center gap-2">
              <span role="img" aria-label="venue">🏟️</span> Tiket Venue
            </div>
            <div className="text-sm text-gray-600 mb-1">Tiket Masuk</div>
            <div className="font-bold text-lg">Rp. {pricePerTicket.toLocaleString()} <span className="text-sm font-normal">/tiket</span></div>
          </div>
        )}
        
        {/* Booking Date Display */}
        {bookingDate && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-blue-700 font-medium flex items-center gap-2">
              <span role="img" aria-label="calendar">📅</span> Tanggal Booking: 
              <span className="font-bold">
                {new Date(bookingDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}
        
        <div className="text-green-700 text-base mb-2 flex items-center gap-2">
          <span role="img" aria-label="promo">💸</span> Promo: <span className="font-semibold">10% discount available</span>
        </div>
        <div className="font-bold text-xl mb-2 flex items-center gap-2">
          <span role="img" aria-label="total">🧾</span> Total: <span className="text-green-700">Rp. {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
