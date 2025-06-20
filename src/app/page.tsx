"use client"

import { HeroSection } from "@/components/sections/HeroSection"
import { GetToKnowSection } from "@/components/sections/GetToKnowSection"
import { EventsSection } from "@/components/sections/EventsSection"
import { SportsExperienceSection } from "@/components/sections/SportsExperienceSection"
import { FoodCourtSection } from "@/components/sections/FoodCourtSection"
import { NewsletterSection } from "@/components/sections/NewsletterSection"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <GetToKnowSection />
      <EventsSection />
      <SportsExperienceSection />
      <FoodCourtSection />
      <NewsletterSection />
    </main>
  )
}
