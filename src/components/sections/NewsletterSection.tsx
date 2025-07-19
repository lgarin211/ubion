import { Button } from "@/components/ui/button"

export function NewsletterSection() {
  return (
    <section className="py-14 bg-gradient-to-br from-[#f8fff3] to-[#e3f2fd] hidden">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-lg p-6 sm:p-10 flex flex-col items-center">
          <div className="mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#8BC34A] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1m8 0V7a4 4 0 00-8 0v5" /></svg>
            <h2 className="text-2xl font-bold text-gray-800">Gabung Newsletter Kami</h2>
          </div>
          <p className="text-gray-600 mb-6 text-center text-base sm:text-lg">Dapatkan update fitur & promo terbaru langsung ke email Anda.</p>
          <form className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="w-full sm:w-auto flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-base"
            />
            <Button className="w-full sm:w-auto px-6 py-2 rounded-lg bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold text-base">Subscribe</Button>
          </form>
        </div>
      </div>
    </section>
  )
}
