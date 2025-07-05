"use client";

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

interface VenueInfoProps {
  venue: {
    name: string;
    description: string;
    facilities: Array<{ icon: string; name: string }>;
  };
  mainFacility: FacilityDetail | undefined;
  facilityData: FacilityDetail[];
  selectedSubFacility: FacilityDetail | null;
  onSubFacilitySelect: (facility: FacilityDetail) => void;
}

export function VenueInfo({
  venue,
  mainFacility,
  facilityData,
  selectedSubFacility,
  onSubFacilitySelect,
}: VenueInfoProps) {
  return (
    <>
      {/* Venue Info */}
      <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
      <div 
        className="mb-6 text-gray-200 max-w-2xl" 
        dangerouslySetInnerHTML={{ 
          __html: mainFacility?.description || "Exciting new sports facility coming soon!" 
        }} 
      />
      
      {/* Facility Type */}
      {mainFacility?.f_type && (
        <div className="mb-4">
          <span className="bg-teal-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
            {mainFacility.f_type}
          </span>
        </div>
      )}

      {/* Sub-facilities Selection */}
      {facilityData.length > 1 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-teal-400">Available Sub-Facilities:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {facilityData.map((facility) => (
              <div 
                key={facility.id} 
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedSubFacility?.id === facility.id 
                    ? 'bg-teal-400 text-black' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => onSubFacilitySelect(facility)}
              >
                <div className="font-semibold">{facility.nama_fasilitas}</div>
                <div className={`text-sm ${
                  selectedSubFacility?.id === facility.id ? 'text-black' : 'text-teal-400'
                }`}>
                  Rp. {facility.pricehours.toLocaleString()}/hour
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facilities */}
      <div className="flex flex-wrap gap-3 mb-8">
        {venue.facilities.map((f, i) => (
          <div key={i} className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg text-white">
            <span>{f.icon}</span> {f.name}
          </div>
        ))}
      </div>
    </>
  );
}
