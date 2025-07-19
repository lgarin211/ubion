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
import GmapsLocation from "@/components/sections/gmapsLocation"
import InstagramPoin from "@/components/sections/IntagramPoin"
import Testimony from "@/components/sections/Testimony"

export default function Home() {
  const { data, loading, error } = useWelcomeData();

  // Show cache debug based on web status configuration
  const showDebug = ApiConfig.isDebugMode();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-4">
        <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md py-12 rounded-2xl shadow-lg bg-white/80">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-500 mb-6"></div>
          <p className="text-lg text-gray-700 font-semibold">Memuat data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-yellow-100 px-4">
        <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md py-10 rounded-2xl shadow-lg bg-white/90">
          <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-red-600 font-bold mb-2">Terjadi Kesalahan</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Coba Lagi
          </button>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
        <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md py-10 rounded-2xl shadow-lg bg-white/90">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-gray-600 text-base">Data tidak tersedia</p>
        </div>
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
      <div className="container mx-auto px-4 py-8">
          <InstagramPoin />
      </div>
      <EventsSection data={data.data.component2} />
      <SportsExperienceSection data={data.data.component3} />
      <FoodCourtSection data={data.data.component4?.map(item => ({
        ...item,
        image: item.img
      }))} />
      <NewsletterSection />
      <GmapsLocation />
      <div className="container px-4 py-8 justify-center mx-auto">
          <Testimony />
      </div>
    </main>
  )
}
