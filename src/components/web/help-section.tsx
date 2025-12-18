import { Phone, MessageCircle, Mail, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HelpSection() {
  return (
    <section className="bg-[#D8EFF5] py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Illustration */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm">
              <img src="/images/image.png" alt="Return service truck" className="w-full h-auto" />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-balance">
              Need help selecting the right package before scheduling your pickup?
            </h2>
            <p className="text-sm md:text-base text-gray-700 text-balance">
              We're here to assist through Phone, Text, WhatsApp, Email, or Instagram: 1917-426-6655
            </p>

            <div>
              <p className="text-sm font-semibold text-gray-900 mb-4">Contact us through</p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button className="bg-[#3BBAEB] hover:bg-[#2BA5D6] text-white rounded-full px-6 py-5 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  1917-426-6655
                </Button>
                <Button
                  variant="outline"
                  className="border-[#3BBAEB] text-[#3BBAEB] hover:bg-[#3BBAEB] hover:text-white rounded-full px-6 py-5 text-sm bg-transparent"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Whatsapp
                </Button>
                <Button
                  variant="outline"
                  className="border-[#3BBAEB] text-[#3BBAEB] hover:bg-[#3BBAEB] hover:text-white rounded-full px-6 py-5 text-sm bg-transparent"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  className="border-[#3BBAEB] text-[#3BBAEB] hover:bg-[#3BBAEB] hover:text-white rounded-full px-6 py-5 text-sm bg-transparent"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
