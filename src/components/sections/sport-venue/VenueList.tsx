import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/navigation";

const venues = [
	{
		id: 1,
		name: "Badminton Court",
		description: "Tempat bertanding dan berlatih untuk olahraga badminton.",
		image: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg",
	},
	{
		id: 2,
		name: "Swimming Pool",
		description: "A place to compete and train for the sport of swimming",
		image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg",
	},
	{
		id: 3,
		name: "Basketball Court",
		description:
			"Professional basketball court with high-quality flooring and equipment for training and matches.",
		image: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg",
	},
	{
		id: 4,
		name: "Volleyball Court",
		description:
			"Modern volleyball court with proper lighting and equipment for both indoor and beach volleyball.",
		image: "https://images.pexels.com/photos/2444852/pexels-photo-2444852.jpeg",
	},
];

export function VenueList() {
	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-6">
				<h2 className="text-4xl font-bold mb-12">Sport Venue</h2>
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
					{venues.map((venue) => (
						<SwiperSlide key={venue.id}>
							<div className="bg-white rounded-lg shadow-lg overflow-hidden">
								<div className="relative h-48">
									<Image
										src={venue.image}
										alt={venue.name}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
										className="object-cover"
									/>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-semibold mb-2">
										{venue.name}
									</h3>
									<p className="text-gray-600 mb-4">
										{venue.description}
									</p>
									<Button variant="outline" className="w-full">
										Check Detail
									</Button>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
}
