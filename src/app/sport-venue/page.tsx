"use client"

import { HeroSection } from "@/components/sections/sport-venue/HeroSection"
import { VenueList } from "@/components/sections/sport-venue/VenueList"
import { PromotionSection } from "@/components/sections/sport-venue/PromotionSection"

export default function SportVenuePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <VenueList />
      {/* <PromotionSection /> */}
    </main>
  )
}
