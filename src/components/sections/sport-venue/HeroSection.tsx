import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[600px] bg-gradient-to-r from-black to-gray-800 mt">
      <div className="absolute inset-0 bg-black/60 pt-15 ">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3229927955354!2d106.82983687589116!3d-6.221071260931873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f6ddce3efd%3A0xea6830e6c82c7a18!2sPlaza%20Festival!5e0!3m2!1sen!2sid!4v1752939315543!5m2!1sen!2sid"
          title="Plaza Festival Location Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
      <div className="container mx-auto px-6 py-32 relative z-10 text-center bg-black/50 rounded-lg">
        <h1 className="text-5xl font-bold text-white mb-4 mt-10">Sport Venue<br />Locations</h1>
        <Button size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342] hidden">
          Book Now
        </Button>
      </div>
    </section>
  )
}
