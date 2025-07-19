import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface RestaurantModalProps {
  isOpen: boolean
  onClose: () => void
  restaurant: {
    name: string
    description?: string
    location?: string
    hours?: string
    popularMenu?: Array<{
      name: string
      image: string
    }>
  }
}

export function RestaurantModal({ isOpen, onClose, restaurant }: RestaurantModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            Tenan
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-[#8BC34A]/10 px-2 py-1 rounded text-sm inline-block text-[#8BC34A]">
            Open
          </div>
          <h2 className="text-2xl font-bold mt-2">{restaurant.name}</h2>
          
          <div className="flex items-center gap-2 mt-4 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{restaurant.location || "Ground Floor"}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{"09.00 AM - 10.00 PM"}</span>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">About restaurant</h3>
            <p className="text-gray-600">
              {restaurant.description || "A restaurant that serves a diverse Asian food menu. Characterized by the presentation of residential food, at an affordable price."}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Popular Menu</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(restaurant.popularMenu || [
                {
                  name: "Ayam Goreng Kecap",
                  image: "https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg"
                },
                {
                  name: "Nasi Goreng Seafood",
                  image: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg"
                },
                {
                  name: "Mie Goreng Chilli Oil",
                  image: "https://images.pexels.com/photos/1087906/pexels-photo-1087906.jpeg"
                }
              ]).map((menu, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={menu.image}
                      alt={menu.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h4 className="font-medium mt-2">{menu.name}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342] hidden">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
