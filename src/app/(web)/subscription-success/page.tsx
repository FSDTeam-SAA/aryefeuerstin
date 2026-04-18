"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <div className="py-7 flex items-center justify-center bg-[#F5FBFF] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#31B8FA]/10 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-[#31B8FA]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-sm mb-6">
          Thank you for your payment. Your order has been successfully placed
          and is now being processed.
        </p>

        {/* Info Box */}
        <div className="bg-[#31B8FA]/10 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            You will receive a confirmation email shortly with your order
            details.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/return-package">
            <Button className="w-full bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white h-12">
                Return Orders
            </Button>
          </Link>

        
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          If you have any issues, please contact our support team.
        </p>
      </div>
    </div>
  )
}
