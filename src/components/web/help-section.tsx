// import { Phone, MessageCircle, Mail, MessageCircleMore  } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"

// export default function HelpSection() {
//   return (
//   <section className="bg-[#E5F7FF] py-12 md:py-16 lg:py-10">
//   <div className="container mx-auto px-4">
//     {/* 12 column grid */}
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

//       {/* Left Illustration – col-span-4 */}
//       <div className="lg:col-span-5 flex justify-center lg:justify-start">
//         <div className="relative w-full h-[525px]">
//           <Image
//             src="/image/man.png"
//             alt="Return service truck"
//             width={1000}
//             height={1000}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>

//       {/* Right Content – col-span-8 */}
//       <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
//         <h2 className="text-3xl md:text-3xl lg:text-[40px] font-semibold text-[#131313] text-center !leading-[1.2]">
//           Need help selecting the right package before scheduling your pickup?
//         </h2>

//         <p className="text-sm md:text-base text-[#424242] text-balance text-center">
//           We&apos;re here to assist through Phone, Text, WhatsApp, Email, or Instagram: 1917-426-6655
//         </p>

//         <div className="pt-14">
//           <p className="text-lg font-midium text-[#424242] mb-4 text-center">
//             Contact us through
//           </p>

//           <div className="flex flex-wrap gap-3 justify-center lg:justify-center">
//             <Button className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full px-6 h-[51px] text-sm">
//               <Phone className="w-4 h-4 mr-2" />
//               1917-426-6655
//             </Button>

//             <Button
//               variant="outline"
//               className="border-[#31B8FA] text-[#31B8FA] hover:bg-[#31B8FA] hover:text-white rounded-full px-6 h-[51px] text-sm bg-transparent"
//             >
//               <MessageCircle className="w-4 h-4 mr-2" />
//               Whatsapp
//             </Button>

//             <Button
//               variant="outline"
//               className="border-[#31B8FA] text-[#31B8FA] hover:bg-[#31B8FA] hover:text-white rounded-full px-6 h-[51px] text-sm bg-transparent"
//             >
//               <Mail className="w-4 h-4 mr-2" />
//               ezreturn123@gmail.com
//             </Button>

//             <Button
//               variant="outline"
//               className="border-[#31B8FA] text-[#31B8FA] hover:bg-[#31B8FA] hover:text-white rounded-full px-6 h-[51px] text-sm bg-transparent"
//             >
//               <MessageCircleMore  className="w-4 h-4 mr-2" />
//                1917-426-6655
//             </Button>
//           </div>
//         </div>
//       </div>

//     </div>
//   </div>
// </section>

//   )
// }


import {
  Phone,
  MessageCircle,
  Mail,
  MessageCircleMore,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HelpSection() {
  return (
    <section className="bg-[#E5F7FF] py-12 md:py-16 lg:py-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Left Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full h-[525px]">
              <Image
                src="/image/man2.png"
                alt="Help illustration"
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
                
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl lg:text-[40px] font-semibold text-[#131313] leading-tight text-center">
              Need help selecting the right package before scheduling your pickup?
            </h2>

            <p className="text-sm md:text-base text-[#424242] text-center">
              We&apos;re here to assist through Phone, Text, WhatsApp, and Email
              <br />
              <strong>1917-426-6655</strong>
            </p>

            <div className="pt-14">
              <p className="text-lg font-medium text-[#424242] mb-4 text-center">
                Contact us through
              </p>

              <div className="flex flex-wrap gap-3 justify-center">

                {/* Phone Call */}
                <Button
                  asChild
                  className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full px-6 h-[51px] text-sm"
                >
                  <a href="tel:19174266655">
                    <Phone className="w-4 h-4 mr-2" />
                    1917-426-6655
                  </a>
                </Button>

                {/* WhatsApp */}
                <Button
                  asChild
                  variant="outline"
                  className="border-[#31B8FA] text-[#31B8FA] hover:bg-[#31B8FA] hover:text-white rounded-full px-6 h-[51px] text-sm bg-transparent"
                >
                  <a
                    href="https://wa.me/19174266655?text=Hello%20I%20need%20help%20with%20package%20selection"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>

                {/* Email */}
                <Button
                  asChild
                  variant="outline"
                  className="border-[#31B8FA] text-[#31B8FA] hover:bg-[#31B8FA] hover:text-white rounded-full px-6 h-[51px] text-sm bg-transparent"
                >
                  <a
                    href="mailto:ezreturn123@gmail.com?subject=Package%20Support&body=Hello%2C%20I%20need%20help%20with%20package%20selection."
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    ezreturn123@gmail.com
                  </a>
                </Button>

                {/* SMS */}
                <Button
                  asChild
                  variant="outline"
                  className="border-[#31B8FA] text-[#31B8FA] hover:bg-[#31B8FA] hover:text-white rounded-full px-6 h-[51px] text-sm bg-transparent"
                >
                  <div >
                    <MessageCircleMore className="w-4 h-4 mr-2" />
                    1917-426-6655
                  </div>
                </Button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
