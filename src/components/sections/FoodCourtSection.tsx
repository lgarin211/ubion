import { Button } from "@/components/ui/button"
import { useState } from "react"
import { RestaurantModal } from "@/components/ui/restaurant-modal"

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

export function FoodCourtSection() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  const restaurants: Restaurant[] = [
    {
      name: "McDonalds",
      description: "The world's largest chain of fast food restaurants, serving burgers, fries, and more.",
      popularMenu: [
        {
          name: "Big Mac",
          image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
        },
        {
          name: "McNuggets",
          image: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg"
        },
        {
          name: "McFlurry",
          image: "https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg"
        }
      ]
    },
    {
      name: "KFC",
      description: "Kentucky Fried Chicken, famous for its Original Recipe fried chicken.",
      popularMenu: [
        {
          name: "Original Recipe Chicken",
          image: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg"
        },
        {
          name: "Zinger Burger",
          image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
        },
        {
          name: "Chicken Wings",
          image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg"
        }
      ]
    },
    {
      name: "Jolibee",
      description: "A Filipino multinational chain of fast food restaurants.",
      popularMenu: [
        {
          name: "Chickenjoy",
          image: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg"
        },
        {
          name: "Jolly Spaghetti",
          image: "https://images.pexels.com/photos/1087906/pexels-photo-1087906.jpeg"
        },
        {
          name: "Peach Mango Pie",
          image: "https://images.pexels.com/photos/2014693/pexels-photo-2014693.jpeg"
        }
      ]
    },
    {
      name: "HokBen",
      description: "Japanese fast food restaurant chain specializing in bento boxes.",
      popularMenu: [
        {
          name: "Chicken Teriyaki",
          image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg"
        },
        {
          name: "Ebi Furai",
          image: "https://images.pexels.com/photos/3926126/pexels-photo-3926126.jpeg"
        },
        {
          name: "Chicken Katsu",
          image: "https://images.pexels.com/photos/2741458/pexels-photo-2741458.jpeg"
        }
      ]
    },
    {
      name: "Mako",
      description: "Modern Asian fusion restaurant offering a diverse menu of Asian cuisines.",
      popularMenu: [
        {
          name: "Sushi Roll",
          image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg"
        },
        {
          name: "Ramen",
          image: "https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg"
        },
        {
          name: "Beef Bowl",
          image: "https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg"
        }
      ]
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12">Enjoy time with good quality food</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">{restaurant.name[0]}</span>
              </div>
              <h3 className="font-semibold mb-2">{restaurant.name}</h3>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                Check Detail
              </Button>
            </div>
          ))}
        </div>
      </div>

      {selectedRestaurant && (
        <RestaurantModal
          isOpen={!!selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          restaurant={selectedRestaurant}
        />
      )}
    </section>
  )
}
