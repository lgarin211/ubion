"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { getBaseUrl } from "@/lib/imageUtils";

interface Facility {
  id: string;
  nama: string;
  benner: string[];
  additional: string | null;
  created_at: string;
  updated_at: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && facilities.length === 0) {
      fetchFacilities();
    }
  }, [isOpen, facilities.length]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/getlistFasility`);
      const data = await response.json();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityClick = (facilityId: string) => {
    window.location.href = `/sport-venue/${facilityId}`;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-7xl max-h-[88vh] w-full overflow-hidden shadow-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Pilih Fasilitas Olahraga</h3>
            <p className="text-gray-600 text-sm">Temukan fasilitas olahraga yang sesuai dengan kebutuhan Anda</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(88vh-140px)] bg-gradient-to-br from-gray-50 to-white">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8BC34A] mx-auto mb-6"></div>
                <p className="text-gray-600 text-lg">Memuat fasilitas...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  onClick={() => handleFacilityClick(facility.id)}
                  className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#8BC34A] transform hover:-translate-y-2 hover:scale-105 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={facility.benner[0] || '/placeholder-facility.jpg'}
                      alt={facility.nama}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                      <span className="text-xs font-semibold text-gray-700">
                        {facility.benner.length} foto
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-xl font-bold text-white drop-shadow-lg mb-1">{facility.nama}</h4>
                      <div className="flex items-center text-white/90 text-sm">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{facility.benner.length} foto tersedia</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-white">
                    <div className="text-center">
                      <button 
                        className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white py-3 rounded-xl text-sm font-bold hover:from-[#7CB342] hover:to-[#6BA32F] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFacilityClick(facility.id);
                        }}
                      >
                        🏃‍♂️ Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && facilities.length === 0 && (
            <div className="text-center py-24">
              <div className="text-gray-300 text-9xl mb-8">🏟️</div>
              <h4 className="text-3xl font-bold text-gray-700 mb-4">Tidak ada fasilitas tersedia</h4>
              <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">Maaf, saat ini belum ada fasilitas olahraga yang tersedia. Silakan coba lagi nanti atau hubungi customer service kami.</p>
              <button 
                onClick={onClose}
                className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-[#7CB342] hover:to-[#6BA32F] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ✨ Tutup Modal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
