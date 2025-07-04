import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SportsExperienceSectionProps {
  data?: Array<{
    id: number;
    image: string;
    description: string;
    created_at: string;
    updated_at: string;
  }>;
}

export function SportsExperienceSection({ data }: SportsExperienceSectionProps) {
  // Default images jika API data belum tersedia
  const defaultImages = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg",
      description: "Sports Activity 1"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg",
      description: "Sports Activity 2"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg",
      description: "Sports Activity 3"
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg",
      description: "Sports Activity 4"
    },
    {
      id: 5,
      image: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg",
      description: "Sports Activity 5"
    },
    {
      id: 6,
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg",
      description: "Sports Activity 6"
    },
    {
      id: 7,
      image: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg",
      description: "Sports Activity 7"
    },
    {
      id: 8,
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg",
      description: "Sports Activity 8"
    }
  ];

  const images = data && data.length > 0 ? data : defaultImages;

  // Parse HTML content untuk mendapatkan text yang bersih
  const parseHtmlContent = (htmlString: string): string => {
    return htmlString.replace(/<[^>]*>/g, '').replace(/&mdash;/g, '—');
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12">Make your sports<br />experience more energizing</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.slice(0, 8).map((item) => (
            <div key={item.id} className="aspect-square rounded-lg overflow-hidden relative group">
              <Image 
                src={item.image}
                alt={parseHtmlContent(item.description || `Sport ${item.id}`)}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-sm text-center px-2">
                  {parseHtmlContent(item.description || `Sport ${item.id}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline">See More</Button>
        </div>
      </div>
    </section>
  )
}
