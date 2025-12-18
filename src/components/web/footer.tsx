import { Facebook, Linkedin, Twitter, Instagram } from "lucide-react"

const MessageCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-[#D8EFF5] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 relative">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5 L15 10 L15 20 L10 20 L20 30 L30 20 L25 20 L25 10 Z"
                    fill="#3B82F6"
                    stroke="#1E40AF"
                    strokeWidth="1.5"
                  />
                  <circle cx="20" cy="8" r="2" fill="#1E40AF" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">EZ RETURNS</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Empowering Women, Building Trust</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Email:</span> info@example.com
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                  Explore Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Other Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                  Terms Of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
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
