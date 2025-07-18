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
  console.log("VenueInfo Props:", {
    venue,
    mainFacility,
    facilityData,
    selectedSubFacility,
  });

  console.log("Selected Sub-Facility:", selectedSubFacility);
  return (
    <>
      {/* Venue Info */}
      <h1 className="text-3xl font-bold mb-2">
        {selectedSubFacility?.nama_fasilitas || mainFacility?.nama_fasilitas || venue.name}
      </h1>
      
      {/* Price Information */}
      {(selectedSubFacility || mainFacility) && (
        <div className="mb-4">
          <p className="text-xl text-teal-400 font-semibold">
            Rp. {(selectedSubFacility?.pricehours || mainFacility?.pricehours || 0).toLocaleString()}/hour
          </p>
        </div>
      )}
      
      <div 
        className="mb-6 text-gray-200 max-w-2xl" 
        dangerouslySetInnerHTML={{ 
          __html: (selectedSubFacility?.description || mainFacility?.description || "Exciting new sports facility coming soon!")
        }} 
      />
      
      {/* Facility Type */}
      {(selectedSubFacility?.f_type || mainFacility?.f_type) && (
        <div className="mb-4">
          <span className="bg-teal-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
            {selectedSubFacility?.f_type || mainFacility?.f_type}
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
                className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedSubFacility?.id === facility.id 
                    ? 'bg-teal-400 text-black border-teal-300' 
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => onSubFacilitySelect(facility)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{facility.nama_fasilitas}</div>
                  {selectedSubFacility?.id === facility.id && (
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
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

      {/* Additional Information
      {(selectedSubFacility?.f_additional || selectedSubFacility?.sf_additional) && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border-l-4 border-teal-400">
          <h4 className="text-lg font-semibold text-teal-400 mb-2">Additional Information:</h4>
          {selectedSubFacility?.f_additional && (
            <div className="mb-2">
              <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: selectedSubFacility.f_additional }} /> aaa
            </div>
          )}
          {selectedSubFacility?.sf_additional && (
            <div className="">
              <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: selectedSubFacility.sf_additional }} /> bbbb
            </div>
          )}
        </div>
      )} */}

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
