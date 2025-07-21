import { Button } from "@/components/ui/button"
import React, { useState, useEffect } from "react"
import { RestaurantModal } from "@/components/ui/restaurant-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useRestaurantDetail } from "@/hooks/useRestaurantDetail"

interface Restaurant {
  name: string
  description?: string
  location?: string
  hours?: string
  popularMenu?: Array<{
    name: string
    image: string
  }>
}

interface FoodCourtSectionProps {
  data?: Array<{
    id: number;
    image: string;
    created_at: string;
    updated_at: string;
  }>;
  mapsImages?: string[];
}

// Modal component untuk preview gambar maps
const MapImageModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  imageUrl: string; 
  title: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl max-h-[90vh] w-full overflow-hidden shadow-2xl mx-auto">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Image Container */}
        <div className="p-4 bg-gray-50 overflow-auto max-h-[calc(90vh-100px)]">
          <div className="relative w-full">
            <Image
              src={imageUrl}
              alt={title}
              width={1200}
              height={900}
              className="w-full h-auto object-contain rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Klik di luar gambar atau tombol X untuk menutup
          </p>
        </div>
      </div>
    </div>
  );
};

export function FoodCourtSection({ data, mapsImages }: FoodCourtSectionProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [restaurantLocations, setRestaurantLocations] = useState<Map<number, string>>(new Map())
  const [restaurantNames, setRestaurantNames] = useState<Map<number, string>>(new Map())
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [activeTab, setActiveTab] = useState<'tenants' | 'maps'>('tenants')
  const [selectedMapIndex, setSelectedMapIndex] = useState(0)
  
  // State untuk modal gambar maps
  const [showMapModal, setShowMapModal] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  
  const { 
    data: restaurantDetail, 
    loading: detailLoading, 
    fetchRestaurantDetail,
    parseHtmlContent,
    getFullImageUrl
  } = useRestaurantDetail()

  // Default restaurants jika API data belum tersedia
  const defaultRestaurants = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
    }
  ];

  const restaurants = data && data.length > 0 ? data : defaultRestaurants;

  // Function untuk handle click pada gambar maps
  const handleMapImageClick = (imageUrl: string, index: number) => {
    const title = index === 0 ? 'Peta Lantai UG (Underground)' : 'Peta Lantai GF (Ground Floor)';
    setModalImageUrl(imageUrl);
    setModalTitle(title);
    setShowMapModal(true);
  };

  // Function to fetch location and name for a single restaurant
  const fetchRestaurantData = async (restaurantId: number): Promise<{location: string, name: string}> => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/menuresto/${restaurantId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return {
        location: result.data.component1.location || 'Unknown Location',
        name: result.data.component1.resto_name || `Restaurant ${restaurantId}`
      };
    } catch (error) {
      console.error(`Error fetching data for restaurant ${restaurantId}:`, error);
      return {
        location: 'Unknown Location',
        name: `Restaurant ${restaurantId}`
      };
    }
  };

  // Fetch all restaurant data when component mounts or data changes
  useEffect(() => {
    const fetchAllRestaurantData = async () => {
      if (restaurants.length === 0) return;
      
      setLoadingLocations(true);
      const locationMap = new Map<number, string>();
      const nameMap = new Map<number, string>();
      
      try {
        // Fetch data for all restaurants in parallel
        const dataPromises = restaurants.map(async (restaurant) => {
          const data = await fetchRestaurantData(restaurant.id);
          return { id: restaurant.id, ...data };
        });
        
        const restaurantData = await Promise.all(dataPromises);
        restaurantData.forEach(({ id, location, name }) => {
          locationMap.set(id, location);
          nameMap.set(id, name);
        });
        
        setRestaurantLocations(locationMap);
        setRestaurantNames(nameMap);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchAllRestaurantData();
  }, [restaurants]);

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(Array.from(restaurantLocations.values()))).filter(Boolean);

  // Filter restaurants based on selected location
  const filteredRestaurants = selectedLocation === "all" 
    ? restaurants 
    : restaurants.filter(restaurant => 
        restaurantLocations.get(restaurant.id) === selectedLocation
      );

  // Function untuk handle click detail restaurant
  const handleRestaurantDetail = async (restaurantId: number) => {
    setSelectedRestaurantId(restaurantId);
    try {
      await fetchRestaurantDetail(restaurantId);
    } catch (error) {
      console.error('Error fetching restaurant detail:', error);
      setSelectedRestaurantId(null);
    }
  };

  // Simple effect to handle modal opening when data is ready
  React.useEffect(() => {
    if (restaurantDetail && !detailLoading && selectedRestaurantId && !selectedRestaurant) {
      const component1 = restaurantDetail.data.component1;
      const component2 = restaurantDetail.data.component2;
      
      const restaurant: Restaurant = {
        name: component1.resto_name || 'Unknown Restaurant',
        description: parseHtmlContent(component1.about_resto || ''),
        location: component1.location || 'Unknown Location',
        hours: component1.timeopr || 'Unknown Hours',
        popularMenu: component2.map(menu => ({
          name: menu.title || 'Unknown Item',
          image: getFullImageUrl(menu.image || '')
        }))
      };
      
      setSelectedRestaurant(restaurant);
    }
  }, [restaurantDetail, detailLoading, selectedRestaurantId, selectedRestaurant, parseHtmlContent, getFullImageUrl]);

  return (
    <section className="py-20 bg-gray-50" id="tenants">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Food Court</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nikmati berbagai pilihan kuliner dari tenant-tenant terbaik
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'tenants'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              🍽️ Tenant Restoran
            </button>
            {mapsImages && mapsImages.length > 0 && (
              <button
                onClick={() => setActiveTab('maps')}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === 'maps'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                🗺️ Peta Lokasi
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'tenants' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h3 className="text-2xl font-bold mb-4 md:mb-0">Enjoy time with good quality food</h3>
              
              {/* Location Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filter by location:</span>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingLocations && (
                  <span className="text-xs text-gray-500">Loading locations...</span>
                )}
              </div>
            </div>
            
            {/* Restaurant Cards from API component4 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {filteredRestaurants.slice(0, 5).map((restaurant) => (
                <div key={restaurant.id} className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image 
                      src={getFullImageUrl(restaurant.image)}
                      alt={`Restaurant ${restaurant.id}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {restaurantNames.get(restaurant.id) || `Restaurant ${restaurant.id}`}
                  </h3>
                  {restaurantLocations.has(restaurant.id) && (
                    <p className="text-xs text-gray-600 mb-2">
                      {restaurantLocations.get(restaurant.id)}
                    </p>
                  )}
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => handleRestaurantDetail(restaurant.id)}
                    disabled={detailLoading && selectedRestaurantId === restaurant.id}
                  >
                    {detailLoading && selectedRestaurantId === restaurant.id ? "Loading..." : "Check Detail"}
                  </Button>
                </div>
              ))}
            </div>

            {/* No restaurants found message */}
            {filteredRestaurants.length === 0 && !loadingLocations && (
              <div className="text-center py-8">
                <p className="text-gray-600">No restaurants found for the selected location.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedLocation("all")}
                  className="mt-2"
                >
                  Show All Restaurants
                </Button>
              </div>
            )}
          </>
        )}

        {activeTab === 'maps' && mapsImages && mapsImages.length > 0 && (
          <div className="max-w-6xl mx-auto">
            {/* Map Filter Buttons */}
            <div className="flex justify-center mb-6 gap-4">
              <button
                onClick={() => setSelectedMapIndex(0)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedMapIndex === 0
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:text-blue-500 shadow'
                }`}
              >
                🏢 Lantai UG (Underground)
              </button>
              {mapsImages.length > 1 && (
                <button
                  onClick={() => setSelectedMapIndex(1)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedMapIndex === 1
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:text-blue-500 shadow'
                  }`}
                >
                  🏪 Lantai GF (Ground Floor)
                </button>
              )}
            </div>

            {/* Map Display */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <h3 className="text-xl font-bold text-center">
                  {selectedMapIndex === 0 ? 'Peta Lantai UG (Underground)' : 'Peta Lantai GF (Ground Floor)'}
                </h3>
              </div>
              <div className="relative aspect-[4/3] bg-gray-100 cursor-pointer group" 
                   onClick={() => handleMapImageClick(mapsImages[selectedMapIndex], selectedMapIndex)}>
                <Image
                  src={mapsImages[selectedMapIndex] || '/placeholder-map.jpg'}
                  alt={selectedMapIndex === 0 ? 'Peta Lantai UG' : 'Peta Lantai GF'}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                {/* Overlay untuk menunjukkan bahwa gambar dapat diklik */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white/90 text-black px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <span className="text-sm font-medium">🔍 Klik untuk memperbesar</span>
                  </div>
                </div>
              </div>
              <div className="p-4 text-center text-gray-600">
                <p className="text-sm">
                  Klik gambar untuk memperbesar atau tombol di atas untuk melihat peta lantai yang berbeda
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal
          isOpen={!!selectedRestaurant}
          onClose={() => {
            setSelectedRestaurant(null);
            setSelectedRestaurantId(null);
          }}
          restaurant={selectedRestaurant}
        />
      )}

      {/* Map Image Modal */}
      <MapImageModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        imageUrl={modalImageUrl}
        title={modalTitle}
      />
    </section>
  )
}
