"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MessageCircle, Send } from "lucide-react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

          {/* LEFT SIDE */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 gap-y-10">
              {/* Email */}
              <div className="flex items-start gap-4 ">
                <div className="w-12 h-12 rounded-full bg-[#E7E7E7] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#131313]" />
                </div>
                <div>
                  <h3 className="font-normal text-lg text-[#131313]">Email Address</h3>
                  <p className="text-base text-[#616161] break-all">info@analyticsocar.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E7E7E7] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#131313]" />
                </div>
                <div>
                  <h3 className="font-normal text-lg text-[#131313]">Phone Number</h3>
                  <p className="text-base text-[#616161]">+1954 549 6906</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E7E7E7] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#131313]" />
                </div>
                <div>
                  <h3 className="font-normal text-lg text-[#131313]">WhatsApp</h3>
                  <p className="text-base text-[#616161]">+1954 549 6906</p>
                </div>
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-[#F8F8F8] p-6 rounded-[8px] mt-[100px]">
              <p className="text-[#616161] text-base leading-relaxed">
               Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE — FORM */}
          <div className="bg-[#E4F6FF] p-6 md:p-8 lg:p-6 rounded-[8px] shadow-sm">
            <h2 className="text-2xl font-bold text-[#424242] mb-8">
              Contact Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-[#2A2A2A] mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-white h-[48px] rounded-[8px] text-[#929292] placeholder:text-[#929292] border-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-[#2A2A2A] mb-2">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="bg-white h-[48px] rounded-[8px] text-[#929292] placeholder:text-[#929292] border-none"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-medium text-[#2A2A2A] mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white h-[48px] rounded-[8px] text-[#929292] placeholder:text-[#929292] border-none"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-base font-medium text-[#2A2A2A] mb-2">
                  Your Message
                </label>
                <Textarea
                  placeholder="Tell us how we can help you"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white rounded-[8px] text-[#929292] placeholder:text-[#929292] border-none"
                  rows={5}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-xl text-white font-normal h-[50px] rounded-[8px]"
              >
                <Send className="w-5 h-5 mr-2 text-white" />
                Send Message
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
