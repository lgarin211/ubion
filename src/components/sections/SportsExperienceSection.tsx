import { Button } from "@/components/ui/button"
import Image from "next/image"

export function SportsExperienceSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12">Make your sports<br />experience more energizing</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden relative">
              <Image 
                src={`https://images.pexels.com/photos/${[3076516, 863988, 3076516, 863988][i % 4]}/pexels-photo-${[3076516, 863988, 3076516, 863988][i % 4]}.jpeg`}
                alt={`Sport ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
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
