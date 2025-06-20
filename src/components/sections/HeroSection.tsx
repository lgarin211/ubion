import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[600px] bg-gradient-to-r from-black to-gray-800">
      <div className="absolute inset-0 bg-black/60">
        <div className="container mx-auto px-6 py-32">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome to<br />Plaza Festival</h1>
          <p className="text-gray-200 mb-8 max-w-xl">Your premiere destination for dining, shopping and entertainment in the city center.</p>
          <Button size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342]">
            Book Now
          </Button>
        </div>
      </div>
    </section>
  )
}
