import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plaza Festival",
  description: "Your premiere destination for dining, shopping and entertainment",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold">Plaza Festival</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {[
                    { name: "About", href: "#" },
                    { name: "Tenants", href: "#" },
                    { name: "Events", href: "#" },
                    { name: "Sport Venue", href: "/sport-venue" },
                    { name: "Riwayat Transaksi", href: "/transaction-history" }
                  ].map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.name}
                    </a>
                  ))}
                  <a
                    href="#"
                    className="bg-[#8BC34A] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#7CB342]"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Our Company</h3>
                <ul className="space-y-2">
                  {["About Us", "News", "Career"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-600 hover:text-gray-900">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Offer</h3>
                <ul className="space-y-2">
                  {["Event", "Promo", "Tenant Promo"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-600 hover:text-gray-900">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <ul className="space-y-2">
                  {["Facebook", "Instagram"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-600 hover:text-gray-900">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-600 hover:text-gray-900">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t">
              <p className="text-center text-gray-500">
                © 2025 Plaza Festival. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
