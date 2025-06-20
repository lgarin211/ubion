import { Button } from "@/components/ui/button"

export function NewsletterSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Join our newsletter to stay up to date on features and releases.</h2>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
          />
          <Button>Subscribe</Button>
        </div>
      </div>
    </section>
  )
}
