import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"

interface EventsSectionProps {
  data?: Array<{
    id: number;
    banner: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  }>;
}

export function EventsSection({ data }: EventsSectionProps) {
  // Default data jika API data belum tersedia
  const defaultEvents = [
    {
      id: 1,
      title: "Sport Venue Disc 10%",
      description: "Don't miss out on exciting sports activities",
      banner: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg"
    },
    {
      id: 2,
      title: "Pre-swim Preparation",
      description: "Get ready for your swimming session",
      banner: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg"
    },
    {
      id: 3,
      title: "Salad For Unique Dish",
      description: "Healthy and delicious food options",
      banner: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
    }
  ];

  const events = data && data.length > 0 ? data : defaultEvents;

  // Carousel state for mobile
  const [current, setCurrent] = useState(0);
  // Removed unused variable isMobile

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === events.length - 1 ? 0 : prev + 1));

  // Parse HTML content untuk mendapatkan text yang bersih
  const parseHtmlContent = (htmlString: string): string => {
    return htmlString.replace(/<[^>]*>/g, '').replace(/&mdash;/g, '—');
  };

  return (
    <section className="py-20 bg-gray-50" id="events">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-5">Event & Promotion Information</h2>
        <p className="text-gray-600 mb-8">Don&apos;t miss out on other exciting events and promos at Plaza Festival</p>
        {/* Mobile: Carousel, Desktop: Grid */}
        <div className="block md:hidden">
          <div className="relative">
            <Card key={events[current].id}>
              <CardContent className="p-0">
                <div className="relative group">
                  <div className="relative h-64">
                    <Image 
                      src={events[current].banner} 
                      alt={events[current].title}
                      fill
                      sizes="100vw"
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hidden">
                    <Button variant="secondary">More</Button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">{events[current].title}</h3>
                  <p className="text-sm text-gray-500">{parseHtmlContent(events[current].description || "")}</p>
                </div>
              </CardContent>
            </Card>
            {/* Carousel controls */}
            <div className="flex justify-between items-center mt-4">
              <button onClick={handlePrev} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-lg">&#8592;</button>
              <div className="flex gap-1">
                {events.map((_, idx) => (
                  <span key={idx} className={`w-2 h-2 rounded-full ${idx === current ? 'bg-[#8BC34A]' : 'bg-gray-300'}`}></span>
                ))}
              </div>
              <button onClick={handleNext} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-lg">&#8594;</button>
            </div>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <Card key={event.id}>
              <CardContent className="p-0">
                <div className="relative group">
                  <div className="relative h-64">
                    <Image 
                      src={event.banner} 
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" className="hidden">More</Button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500">{parseHtmlContent(event.description || "")}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
