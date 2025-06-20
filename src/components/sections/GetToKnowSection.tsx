import { Button } from "@/components/ui/button"
import Image from "next/image"

export function GetToKnowSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Get to know<br />The Plaza Festival</h2>
            <p className="text-gray-600 mb-8">
              Plaza Festival is a premiere mixed-use development combining dining, and sports facilities. Located in the city center, we offer a unique blend of shopping experience and recreational activities.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {["Retail Stores", "Restaurants", "Sport", "Venue"].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-8">More About Us</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/2861656/pexels-photo-2861656.jpeg" 
                  alt="Mall" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg" 
                  alt="Restaurant" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-2xl overflow-hidden relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg" 
                  alt="Sport" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg" 
                  alt="Swimming" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
