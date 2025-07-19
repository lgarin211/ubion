"use client"

import { useState, useEffect } from "react"
import { BookingModal } from "@/components/ui/booking-modal"
import Image from "next/image"

const navItems = [
  { name: "About", href: "/#" },
  { name: "Tenants", href: "/#tenants" },
  { name: "Events", href: "/#events" },
  { name: "Sport Venue", href: "/sport-venue" },
  { name: "Riwayat Transaksi", href: "/transaction-history" }
];

export default function NavbarClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md' 
        : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 cobix">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/plazalogo.png"
              alt="Plaza Festival Logo"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#8BC34A] px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
              <button
                onClick={() => setBookingModalOpen(true)}
                className="bg-[#8BC34A] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#7CB342] transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
          
          {/* Hamburger button for mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#8BC34A] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] transition-all duration-200 ${
                mobileMenuOpen ? 'scale-95' : 'scale-100'
              }`}
              aria-label="Open main menu"
            >
              <svg className={`h-6 w-6 transition-transform duration-300 ${
                mobileMenuOpen ? 'rotate-90' : 'rotate-0'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </nav>
     {/* Mobile menu overlay */}
      <div className={`cobix fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible pointer-events-none'
      }`}>
        {/* Backdrop with darker background */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-all duration-300 ${
            mobileMenuOpen ? 'bg-opacity-50' : 'bg-opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Panel with slide animation */}
        <div className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl border-l border-gray-200 transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <Image
              src="/plazalogo.png"
              alt="Plaza Festival Logo"
              width={120}
              height={40}
              className="h-8"
              priority
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation Links */}
          <div className="px-4 py-6 bg-white">
            <div className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-gray-800 hover:text-[#8BC34A] hover:bg-gray-50 rounded-lg text-base font-semibold transition-all duration-200 border-l-4 border-transparent hover:border-[#8BC34A] transform hover:translate-x-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-[#8BC34A] rounded-full mr-3 opacity-60"></span>
                    {item.name}
                  </span>
                </a>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setBookingModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block w-full bg-[#8BC34A] text-white text-center px-4 py-4 rounded-lg font-bold text-lg hover:bg-[#7CB342] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Book Now
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
     {/* Booking Modal */}
     <BookingModal 
        isOpen={bookingModalOpen} 
        onClose={() => setBookingModalOpen(false)} 
      />
      </>
  );
}
