import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const promotions = [
  {
    id: 1,
    title: "Sport Venue Disc 10%",
    description: "Get disc for new member in venue sport",
    image: "https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg"
  },
  {
    id: 2,
    title: "Pre-swim Preparation",
    description: "Don't forget to prepare before swimming!",
    image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg"
  },
  {
    id: 3,
    title: "Salad For Uniqe Dish",
    description: "Healthy food is important",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
  }
]

export function PromotionSection() {
  return (
    <section className="py-20 bg-[#F0F9E8]">
      <div className="container mx-auto px-6">
        <div className="relative">
          <h2 className="text-4xl font-bold mb-2">ON PROMOTION</h2>
          <div className="absolute top-0 right-0 bg-[#8BC34A] text-white px-4 py-2 rounded-full transform -translate-y-1/2">
            don't miss it!
          </div>
        </div>
        
        <div className="mt-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {promotions.map((promo) => (
                <CarouselItem key={promo.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={promo.image}
                        alt={promo.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
                      <p className="text-gray-600 mb-4">{promo.description}</p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                      >
                        More
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white border-2 border-gray-200 hover:bg-gray-100" />
            <CarouselNext className="bg-white border-2 border-gray-200 hover:bg-gray-100" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
