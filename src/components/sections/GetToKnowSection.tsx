import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"

interface GetToKnowSectionProps {
  data?: {
    title: string;
    big_banner: string[] | string;  // Updated to handle both array and string
    big_welcome: string;
  };
}

export function GetToKnowSection({ data }: GetToKnowSectionProps) {
  const [displayedImages, setDisplayedImages] = useState<string[]>([]);

  // Parse HTML content untuk mendapatkan text yang bersih
  const parseHtmlContent = (htmlString: string): string => {
    return htmlString.replace(/<[^>]*>/g, '').replace(/&mdash;/g, '—');
  };

  // Helper function untuk mendapatkan full URL gambar
  const getFullImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "https://images.pexels.com/photos/2861656/pexels-photo-2861656.jpeg";
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
    return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };

  // Default content jika API data belum tersedia
  const defaultTitle = "Get to know\nThe Plaza Festival";
  const defaultDescription = "Plaza Festival is a premiere mixed-use development combining dining, and sports facilities. Located in the city center, we offer a unique blend of shopping experience and recreational activities.";

  const title = data?.title ? parseHtmlContent(data.title) : defaultTitle;
  const description = data?.big_welcome ? parseHtmlContent(data.big_welcome) : defaultDescription;
  
  // Handle big_banner array - get all images
  const getBannerImages = (): string[] => {
    if (!data?.big_banner) return ["https://images.pexels.com/photos/2861656/pexels-photo-2861656.jpeg"];
    
    if (Array.isArray(data.big_banner)) {
      // If it's an array, return all images
      return data.big_banner.length > 0 
        ? data.big_banner.map(img => getFullImageUrl(img))
        : ["https://images.pexels.com/photos/2861656/pexels-photo-2861656.jpeg"];
    } else {
      // If it's a string, return as single item array
      return [getFullImageUrl(data.big_banner)];
    }
  };
  
  const bannerImages = getBannerImages();
  
  // Default fallback images for the right side gallery
  const defaultGalleryImages = useMemo(() => [
    "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg",
    "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg", 
    "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg"
  ], []);

  // Shuffle function
  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Update displayed images - auto shuffle disabled
  useEffect(() => {
    const allImages = [...bannerImages, ...defaultGalleryImages];
    
    const getRandomImages = (): string[] => {
      if (allImages.length <= 4) {
        return allImages;
      } else {
        const shuffled = shuffleArray(allImages);
        return shuffled.slice(0, 4);
      }
    };
    
    // Set initial images only (no auto shuffle)
    setInterval(() => {
          setDisplayedImages(getRandomImages());
    }, 10000);
    
  }, [bannerImages, defaultGalleryImages]);

  // Use displayed images or fallback
  const imagesToShow = displayedImages.length > 0 ? displayedImages : [...bannerImages, ...defaultGalleryImages].slice(0, 4);
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6" style={{ whiteSpace: 'pre-line',display:'none' }}>
              {title}
            </h2>
            
            {/* Render HTML content from big_welcome */}
            {data?.big_welcome ? (
              <div 
                className="text-gray-600 mb-8"
                dangerouslySetInnerHTML={{ __html: data.big_welcome }}
              />
            ) : (
              <p className="text-gray-600 mb-8">
                {description}
              </p>
            )}
            
            <Button variant="outline" className="mt-8">More About Us</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Display max 4 images - static display (no auto shuffle) */}
            {imagesToShow.length > 0 && (
              <div className="col-span-2 grid grid-cols-2 gap-4">
                {imagesToShow.map((image, index) => (
                  <div 
                    key={`${image}-${index}`} 
                    className="rounded-2xl overflow-hidden relative h-48"
                  >
                    <Image 
                      src={image}
                      alt={`${parseHtmlContent(data?.title || "Plaza Festival")} ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
