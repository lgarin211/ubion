"use client"

import { HeroSection } from "@/components/sections/HeroSection"
import { GetToKnowSection } from "@/components/sections/GetToKnowSection"
import { EventsSection } from "@/components/sections/EventsSection"
import { SportsExperienceSection } from "@/components/sections/SportsExperienceSection"
import { FoodCourtSection } from "@/components/sections/FoodCourtSection"
import { NewsletterSection } from "@/components/sections/NewsletterSection"
import { useWelcomeData } from "@/hooks/useWelcomeData"
import { CacheDebug } from "@/components/ui/cache-debug"
import { ApiConfig } from "@/lib/sessionCache"

export default function Home() {
  const { data, loading, error } = useWelcomeData();

  // Show cache debug based on web status configuration
  const showDebug = ApiConfig.isDebugMode();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {showDebug && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <CacheDebug />
        </div>
      )}
      <HeroSection data={data.data.component0} />
      <GetToKnowSection data={data.data.component1} />
      <EventsSection data={data.data.component2} />
      <SportsExperienceSection data={data.data.component3} />
      <FoodCourtSection data={data.data.component4?.map(item => ({
        ...item,
        image: item.img
      }))} />
      <NewsletterSection />
    </main>
  )
}
