
"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Define proper types based on your actual API response
interface Customer {
  firstName: string
  lastName: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    zipCode: string
  }
  pickupInstructions?: string
}

interface PackageItem {
  packageNumber: string
  barcodeImages: string[]
}

interface Store {
  store: string
  numberOfPackages: number
  packages: PackageItem[]
}

interface RushService {
  enabled: boolean
  fee: number
}

interface OptionItem {
  enabled: boolean
  fee?: number
  creditCardLast4?: string
  note?: string
}

interface Options {
  physicalReturnLabel: OptionItem
  physicalReceipt: OptionItem
  returnShippingLabel: OptionItem
  message: OptionItem & { note?: string }
}

interface Pricing {
  baseAmount: number
  extraFees: number
  totalAmount: number
}

interface OrderData {
  customer: Customer
  rushService: RushService
  stores: Store[]
  options: Options
  pricing: Pricing
  _id: string
}

interface SummaryReviewProps {
  orderData: OrderData          // Real data from backend
  status: "idle" | "success" | "error"
  message: string
  orderId: string
  totalAmount: number
}

export function SummaryReview({
  orderData,
  status,
  message,
  orderId,
  totalAmount,
}: SummaryReviewProps) {
  const { data: session } = useSession()
  const token = session?.accessToken as string | undefined
  const router = useRouter()

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!orderId) throw new Error("No order ID available")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/checkout/return-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ returnOrderId: orderId }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to create checkout session")
      }

      return response.json()
    },
    onSuccess: (data) => {
      if (data?.status && data?.data?.checkoutUrl) {
     
        
        router.push(data.data.checkoutUrl)

      } else {
        console.error("Invalid checkout response:", data)
      }
    },
    onError: (error) => {
      console.error("Checkout error:", error)
    },
  })

  const handlePayment = () => {
    checkoutMutation.mutate()
  }

  const { customer, stores, rushService, options } = orderData
  const { address } = customer

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {status === "success" && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{message}</span>
        </div>
      )}

  

      {/* Customer Information */}
      <div className="border rounded-lg p-6 bg-[#F8FAFC]">
        <h3 className="text-lg font-bold mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <p>
            <b>Name:</b> {customer.firstName} {customer.lastName}
          </p>
          <p>
            <b>Phone:</b> {customer.phone}
          </p>
          <p>
            <b>Email:</b> {customer.email}
          </p>
          <p className="md:col-span-3">
            <b>Address:</b> {address.street}, {address.city}, {address.zipCode}
          </p>
          {customer.pickupInstructions && (
            <p className="md:col-span-3">
              <b>Pickup Instructions:</b> {customer.pickupInstructions}
            </p>
          )}
        </div>
      </div>

      {/* Package Details */}
      <div className="border rounded-lg p-6 bg-[#F8FAFC]">
        <h3 className="text-lg font-bold mb-4">Package Details</h3>
        {stores.map((store, storeIdx) => (
          <div key={storeIdx} className="mb-8 last:mb-0">
            <h4 className="font-semibold text-lg mb-3 text-cyan-700">
              Store {storeIdx + 1}: {store.store}
            </h4>
            <p className="text-sm mb-4">
              <b>Number of Packages:</b> {store.numberOfPackages}
            </p>

            <div className="space-y-4">
              {store.packages.map((pkg, pkgIdx) => (
                <div
                  key={pkgIdx}
                  className="ml-4 bg-white p-4 rounded-lg border shadow-sm"
                >
                  <p className="font-medium">
                    Package {pkgIdx + 1}: {pkg.packageNumber}
                  </p>
                  {pkg.barcodeImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {pkg.barcodeImages.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`Barcode for package ${pkgIdx + 1}`}
                          width={1000}
                          height={1000}
                          className="w-40 h-24 object-contain rounded border bg-white p-2"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Options */}
      <div className="border rounded-lg p-6 bg-[#F8FAFC]">
        <h3 className="text-lg font-bold mb-4">Additional Options</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <li>
            <b>Rush Service:</b>{" "}
            {rushService.enabled ? `Yes (+$${rushService.fee})` : "No"}
          </li>
          <li>
            <b>Physical Return Label:</b>{" "}
            {options.physicalReturnLabel.enabled
              ? `Yes (+$${options.physicalReturnLabel.fee})`
              : "No"}
          </li>
          <li>
            <b>Physical Receipt:</b>{" "}
            {options.physicalReceipt.enabled
              ? `Yes (+$${options.physicalReceipt.fee}) - Last 4: ${options.physicalReceipt.creditCardLast4}`
              : "No"}
          </li>
          <li>
            <b>Return Shipping Label:</b>{" "}
            {options?.returnShippingLabel?.enabled
              ? `Yes (+$${options.returnShippingLabel?.fee})`
              : "No"}
          </li>
          <li>
            <b>Leave Message:</b> {options.message.enabled ? "Yes" : "No"}
          </li>
        </ul>

        {options.message.enabled && options.message.note && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <p className="font-medium">Customer Message:</p>
            <p className="mt-1 text-sm">{options.message.note}</p>
          </div>
        )}
      </div>

      {/* Total Amount */}
      <div className="border-1 border-[#31B8FA] rounded-xl p-3 bg-white shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-amber-900">
            Total Amount to Pay
          </h3>
          <p className="text-xl font-bold text-amber-900">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment Button */}
      <div className="flex justify-end">
        <Button
          onClick={handlePayment}
          disabled={checkoutMutation.isPending || totalAmount === 0 || !token}
          className="bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white font-medium px-12 py-6 text-lg rounded-lg disabled:opacity-60"
        >
          {checkoutMutation.isPending ? "Processing Payment..." : "Proceed to Payment"}
        </Button>
      </div>

      {/* Error Message */}
      {checkoutMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
          <p className="font-medium">
            {(checkoutMutation.error as Error)?.message || "Payment initiation failed. Please try again."}
          </p>
        </div>
      )}
    </div>
  )
}