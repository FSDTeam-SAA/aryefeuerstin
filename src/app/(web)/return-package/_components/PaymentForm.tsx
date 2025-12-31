




"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, Image as ImageIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
  otherStoreName?: string  // ← Added this
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
  physicalReturnLabelFiles?: string[]
}

interface SummaryReviewProps {
  orderData: OrderData
  status: "idle" | "success" | "error"
  message: string
  orderId: string
  totalAmount: number
}

export function SummaryReview({
  orderData,
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

  const { customer, stores, rushService, options, physicalReturnLabelFiles = [] } = orderData
  const { address } = customer

  const isImageFile = (url: string) => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url)
  const isPdfFile = (url: string) => /\.pdf$/i.test(url)

  const isFreeOrder = totalAmount === 0

  // Helper to display store name correctly
  const getStoreDisplayName = (store: Store) => {
    if (store.store === "Other" && store.otherStoreName) {
      return `Other: ${store.otherStoreName}`
    }
    return store.store
  }

  return (
    <div className="space-y-8">
      {/* Customer Information */}
      <div className="border rounded-lg p-6 bg-[#F8FAFC]">
        <h3 className="text-lg font-bold mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <p><b>Name:</b> {customer.firstName} {customer.lastName}</p>
          <p><b>Phone:</b> {customer.phone}</p>
          <p><b>Email:</b> {customer.email}</p>
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
              Store {storeIdx + 1}: {getStoreDisplayName(store)}
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
                    Package {pkgIdx + 1}: {pkg.packageNumber || "Not specified"}
                  </p>
                  {pkg.barcodeImages.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {pkg.barcodeImages.map((img, i) => (
                        <div key={i} className="relative">
                          <Image
                            src={img}
                            alt={`Barcode for package ${pkgIdx + 1}`}
                            width={400}
                            height={300}
                            className="w-48 h-36 object-contain rounded-lg border bg-white shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Physical Return Label Files */}
      {options.physicalReturnLabel.enabled && physicalReturnLabelFiles.length > 0 && (
        <div className="border rounded-lg p-6 bg-[#F8FAFC]">
          <h3 className="text-lg font-bold mb-4">Physical Return Label Files</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {physicalReturnLabelFiles.map((fileUrl, idx) => {
              const fileName = fileUrl.split("/").pop() || `label-${idx + 1}`

              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col"
                >
                  {isImageFile(fileUrl) ? (
                    <div className="relative h-48 bg-gray-50">
                      <Image
                        src={fileUrl}
                        alt={`Physical return label ${idx + 1}`}
                        fill
                        className="object-contain p-3"
                      />
                    </div>
                  ) : isPdfFile(fileUrl) ? (
                    <div className="h-48 bg-red-50 flex items-center justify-center flex-col gap-2">
                      <FileText className="w-16 h-16 text-red-600" />
                      <span className="text-xs text-gray-600 px-2">PDF File</span>
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  <div className="p-3 border-t bg-gray-50">
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {fileName}
                    </p>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-600 hover:underline mt-1 inline-block"
                    >
                      View / Download
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Additional Options */}
      <div className="border rounded-lg p-6 bg-[#F8FAFC]">
        <h3 className="text-lg font-bold mb-4">Additional Options</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <li><b>Rush Service:</b> {rushService.enabled ? `Yes (+$${rushService.fee})` : "No"}</li>
          <li>
            <b>Physical Return Label:</b>{" "}
            {options.physicalReturnLabel.enabled
              ? `Yes (+$${options.physicalReturnLabel.fee || 3.5})`
              : "No"}
          </li>
          <li>
            <b>Physical Receipt:</b>{" "}
            {options.physicalReceipt.enabled
              ? `Yes (+$${options.physicalReceipt.fee || 8}) - Last 4: ${options.physicalReceipt.creditCardLast4}`
              : "No"}
          </li>
          <li>
            <b>Return Shipping Label:</b>{" "}
            {options?.returnShippingLabel?.enabled ? `Yes (+$${options?.returnShippingLabel?.fee})` : "No"}
          </li>
          <li><b>Leave Message:</b> {options.message.enabled ? "Yes" : "No"}</li>
        </ul>

        {options.message.enabled && options.message.note && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <p className="font-medium">Customer Message:</p>
            <p className="mt-1 text-sm">{options.message.note}</p>
          </div>
        )}
      </div>

      {/* Conditional Rendering Based on Total Amount */}
      {isFreeOrder ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Return Order Created Successfully!
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Thank you for using our service. Your return request has been submitted and will be processed soon.
          </p>
          <div className="mt-5">
            <Link href="/user/order-request">
              <Button className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-10 h-12">
                See Orders
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Total Amount */}
          <div className="border-2 border-[#31B8FA] rounded-xl p-6 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-[#31B8FA]">
                Total Amount to Pay
              </h3>
              <p className="text-3xl font-bold text-[#31B8FA]">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-end">
            <Button
              onClick={handlePayment}
              disabled={checkoutMutation.isPending || !token}
              className="bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white font-medium px-16 py-8 text-xl rounded-xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkoutMutation.isPending ? "Processing Payment..." : "Proceed to Payment"}
            </Button>
          </div>
        </>
      )}

      {/* Payment Error Message */}
      {!isFreeOrder && checkoutMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
          <p className="font-medium">
            {(checkoutMutation.error as Error)?.message ||
              "Payment initiation failed. Please try again."}
          </p>
        </div>
      )}
    </div>
  )
}