"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/navigation";
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

export function VenueList() {
	const [facilities, setFacilities] = useState<Facility[]>([])
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		const fetchFacilities = async () => {
			try {
				const baseUrl = getBaseUrl();
				const response = await fetch(`${baseUrl}/api/getlistFasility`)
				const data = await response.json()
				setFacilities(data)
			} catch (error) {
				console.error('Error fetching facilities:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchFacilities()
	}, [])

	const handleViewDetail = (facilityId: string) => {
		router.push(`/sport-venue/${facilityId}`)
	}
	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-6">
				<h2 className="text-4xl font-bold mb-12">Sport Venue</h2>
				{loading ? (
					<div className="flex justify-center items-center h-48">
						<div className="text-lg">Loading venues...</div>
					</div>
				) : (
					<Swiper
						modules={[Navigation, Autoplay]}
						navigation
						autoplay={{ delay: 3000, disableOnInteraction: false }}
						loop={true}
						spaceBetween={24}
						slidesPerView={2}
						breakpoints={{
							640: { slidesPerView: 1 },
							1024: { slidesPerView: 3 },
						}}
						className="!pb-8"
					>
						{facilities.map((facility) => (
							<SwiperSlide key={facility.id}>
								<div className="bg-white rounded-lg shadow-lg overflow-hidden">
									<div className="relative h-48">
										{facility.benner && facility.benner.length > 0 && (
											<Image
												src={formatImageUrl(facility.benner[0])}
												alt={facility.nama}
												fill
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
												className="object-cover"
											/>
										)}
									</div>
									<div className="p-6">
										<h3 className="text-xl font-semibold mb-2">
											{facility.nama}
										</h3>
										<p className="text-gray-600 mb-4">
											Fasilitas olahraga berkualitas untuk pengalaman terbaik Anda
										</p>
										<Button 
											variant="outline" 
											className="w-full"
											onClick={() => handleViewDetail(facility.id)}
										>
											Check Detail
										</Button>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</div>
		</section>
	);
}
