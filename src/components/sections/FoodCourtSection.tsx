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
    img: string;
    created_at: string;
    updated_at: string;
  }>;
}

export function FoodCourtSection({ data }: FoodCourtSectionProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [restaurantLocations, setRestaurantLocations] = useState<Map<number, string>>(new Map())
  const [loadingLocations, setLoadingLocations] = useState(false)
  
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
      img: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
    },
    {
      id: 2,
      img: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg"
    },
    {
      id: 3,
      img: "https://images.pexels.com/photos/1087906/pexels-photo-1087906.jpeg"
    },
    {
      id: 4,
      img: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg"
    },
    {
      id: 5,
      img: "https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg"
    }
  ];

  const restaurants = data && data.length > 0 ? data : defaultRestaurants;

  // Function to fetch location for a single restaurant
  const fetchRestaurantLocation = async (restaurantId: number): Promise<string> => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/menuresto/${restaurantId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data.component1.location || 'Unknown Location';
    } catch (error) {
      console.error(`Error fetching location for restaurant ${restaurantId}:`, error);
      return 'Unknown Location';
    }
  };

  // Fetch all restaurant locations when component mounts or data changes
  useEffect(() => {
    const fetchAllLocations = async () => {
      if (restaurants.length === 0) return;
      
      setLoadingLocations(true);
      const locationMap = new Map<number, string>();
      
      try {
        // Fetch locations for all restaurants in parallel
        const locationPromises = restaurants.map(async (restaurant) => {
          const location = await fetchRestaurantLocation(restaurant.id);
          return { id: restaurant.id, location };
        });
        
        const locations = await Promise.all(locationPromises);
        locations.forEach(({ id, location }) => {
          locationMap.set(id, location);
        });
        
        setRestaurantLocations(locationMap);
      } catch (error) {
        console.error('Error fetching restaurant locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchAllLocations();
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-4xl font-bold mb-4 md:mb-0">Enjoy time with good quality food</h2>
          
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
            <div key={restaurant.id} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <Image 
                  src={getFullImageUrl(restaurant.img)}
                  alt={`Restaurant ${restaurant.id}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-semibold mb-2">Restaurant {restaurant.id}</h3>
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
      </div>

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
    </section>
  )
}
