import { Facebook, Linkedin, Twitter, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"



export default function Footer() {
  return (
    <footer className="bg-[#C0E8FF] py-12 md:pt-16 pb-5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <Link href="/">
              <div className="w-[100px] h-[80px] flex mb-4">
             <Image src="/logo.png" alt="Logo" width={1000} height={1000} className="w-full h-full object-cover" />
            </div>
            </Link>
            <p className="text-sm font-normal text-[#131313] mb-2">Empowering Women, Building Trust</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Email:</span> info@example.com
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-base font-semibold text-[#131313] mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#131313]">
                  Explore Service
                </a>
              </li>
              <li>
                <Link href="/about-us" className="text-sm text-gray-700 hover:text-[#131313]">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#131313]">
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-base font-semibold text-[#131313] mb-4">Other Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact-us" className="text-sm text-gray-700 hover:text-[#131313]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-700 hover:text-[#131313]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-condition" className="text-sm text-gray-700 hover:text-[#131313]">
                  Terms Of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-base font-semibold text-[#131313] mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-[#131313] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-[#131313] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-[#131313] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-[#131313] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="text-sm text-gray-600">@ 2025Jetset cares. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
