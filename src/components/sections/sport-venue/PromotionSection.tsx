"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatImageUrl, getBaseUrl } from "@/lib/imageUtils"

interface Facility {
  id: string
  nama: string
  benner: string[]
  additional: string | null
  created_at: string
  updated_at: string
}

interface PromotionSectionProps {
  facilityId?: number
}

export function PromotionSection({ facilityId = 1 }: PromotionSectionProps) {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/getlistFasility/${facilityId}`)
        const data = await response.json()
        setFacilities(data)
      } catch (error) {
        console.error('Error fetching facilities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [facilityId])

  const handleViewDetail = (facilityId: string) => {
    router.push(`/sport-venue/${facilityId}`)
  }

  console.log("PromotionSection Props:", { facilityId, facilities })

  return (
    <section className="py-20 bg-[#F0F9E8]">
      <div className="container mx-auto px-6">
        <div className="relative">
          <h2 className="text-4xl font-bold mb-2">ON PROMOTION</h2>
          <div className="absolute top-0 right-0 bg-[#8BC34A] text-white px-4 py-2 rounded-full transform -translate-y-1/2">
            don&apos;t miss it!
          </div>
        </div>
        
        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="text-lg">Loading facilities...</div>
            </div>
          ) : facilities.length === 0 ? (
            // Coming Soon content when no facilities are available
            <div className="flex justify-center items-center">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {[1, 2, 3].map((index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-2">🏗️</div>
                            <div className="text-gray-500 font-semibold">Coming Soon</div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2 text-gray-400">
                            New Sport Facility #{index}
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Exciting new sports facilities are coming soon! Stay tuned for amazing experiences.
                          </p>
                          <Button 
                            variant="outline" 
                            className="w-full bg-gray-100 text-gray-400 cursor-not-allowed"
                            disabled
                          >
                            Coming Soon
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* <CarouselPrevious className="bg-white border-2 border-gray-200 hover:bg-gray-100" />
                <CarouselNext className="bg-white border-2 border-gray-200 hover:bg-gray-100" /> */}
              </Carousel>
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {facilities.map((facility) => (
                  <CarouselItem key={facility.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="relative h-48">
                        {facility.benner && facility.benner.length > 0 && (
                          <Image
                            src={formatImageUrl(facility.benner[0])}
                            alt={facility.nama}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{facility.nama}</h3>
                        <p className="text-gray-600 mb-4">
                          Fasilitas olahraga berkualitas untuk pengalaman terbaik Anda
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleViewDetail(facility.id)}
                        >
                          More
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious className="bg-white border-2 border-gray-200 hover:bg-gray-100" />
              <CarouselNext className="bg-white border-2 border-gray-200 hover:bg-gray-100" /> */}
            </Carousel>
          )}
        </div>
      </div>
    </section>
  )
}
