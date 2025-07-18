


import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import NavbarClient from "./NavbarClient";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plaza Festival",
  description: "Your premiere destination for dining, shopping and entertainment",
}


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head></head>
      <body className={inter.className}>
        {/* Navigation */}
        <NavbarClient />

        {children}

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
  );
}
