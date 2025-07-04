import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function EventsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12">Event & Promotion Information</h2>
        <p className="text-gray-600 mb-8">Don&apos;t miss out on other exciting events and promos at Plaza Festival</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Sport Venue Disc 10%",
              category: "sport",
              image: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg"
            },
            {
              title: "Pre-swim Preparation",
              category: "swimming",
              image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg"
            },
            {
              title: "Salad For Unique Dish",
              category: "food",
              image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
            }
          ].map((event, index) => (
            <Card key={index}>
              <CardContent className="p-0">
                <div className="relative group">
                  <div className="relative h-64">
                    <Image 
                      src={event.image} 
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary">More</Button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{event.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
