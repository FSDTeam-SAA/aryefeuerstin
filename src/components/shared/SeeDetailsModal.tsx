/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { Package, MapPin, User, Store, DollarSign, Clock, Truck, Star, FileText, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface SeeDetailsModalProps {
  orderId: string
}

export function SeeDetailsModal({ orderId }: SeeDetailsModalProps) {
  const { data: seeDetails, isLoading } = useQuery({
    queryKey: ["seeDetails", orderId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/see-details/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error("Failed to fetch details")
      return response.json()
    },
    // enabled: false, // Only fetch when modal is opened
  })

  const orderData = seeDetails?.data

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-300'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full border-[#33B8FF] text-[#33B8FF] hover:bg-blue-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          See Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#131313]">Return Order Details</DialogTitle>
          <DialogDescription>
            Complete information about your return order
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#31B8FA] border-t-transparent" />
          </div>
        ) : orderData ? (
          <div className="space-y-6">
            {/* Status Section */}
            <div className="flex flex-wrap gap-3">
              <Badge className={`${getStatusColor(orderData.status)} px-3 py-1.5`}>
                <Package className="mr-1.5 h-4 w-4" />
                Order: {orderData.status}
              </Badge>
              <Badge className={`${getStatusColor(orderData.assignmentStatus)} px-3 py-1.5`}>
                <Truck className="mr-1.5 h-4 w-4" />
                Assignment: {orderData.assignmentStatus}
              </Badge>
              <Badge className={`${getStatusColor(orderData.paymentStatus)} px-3 py-1.5`}>
                <DollarSign className="mr-1.5 h-4 w-4" />
                Payment: {orderData.paymentStatus}
              </Badge>
            </div>

            <Separator />

            {/* Customer Information */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-[#131313]">
                <User className="mr-2 h-5 w-5 text-[#31B8FA]" />
                Customer Information
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{orderData.customer.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{orderData.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{orderData.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unit</p>
                  <p className="font-medium">{orderData.customer.unit || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="rounded-lg border border-gray-200 bg-blue-50 p-4">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-[#131313]">
                <MapPin className="mr-2 h-5 w-5 text-[#31B8FA]" />
                Pickup Location
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{orderData.customer.pickupLocation.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{orderData.customer.address.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium">{orderData.customer.address.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ZIP Code</p>
                    <p className="font-medium">{orderData.customer.address.zipCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Street</p>
                    <p className="font-medium">{orderData.customer.address.street}</p>
                  </div>
                </div>
                {orderData.customer.pickupInstructions && (
                  <div className="mt-3 rounded-md bg-white p-3">
                    <p className="text-sm text-gray-500">Pickup Instructions</p>
                    <p className="font-medium">{orderData.customer.pickupInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stores & Packages */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-[#131313]">
                <Store className="mr-2 h-5 w-5 text-[#31B8FA]" />
                Store Information
              </h3>
              {orderData.stores.map((store: any, idx: number) => (
                <div key={idx} className="mb-4 rounded-md bg-white p-4 last:mb-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{store.store}</h4>
                    <Badge variant="outline" className="border-[#31B8FA] text-[#31B8FA]">
                      {store.numberOfPackages} Package{store.numberOfPackages > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {store.packages.map((pkg: any, pkgIdx: number) => (
                      <div key={pkgIdx} className="rounded border border-gray-200 bg-gray-50 p-3">
                        <p className="mb-2 text-sm font-medium text-gray-700">
                          Package #{pkg.packageNumber}
                        </p>
                        {pkg.barcodeImages.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {pkg.barcodeImages.map((img: string, imgIdx: number) => (
                              <div key={imgIdx} className="relative h-24 w-32 overflow-hidden rounded border">
                                <Image
                                  src={img}
                                  alt={`Barcode ${imgIdx + 1}`}
                                  fill
                                  className="object-cover"
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

            {/* Options */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-[#131313]">
                <FileText className="mr-2 h-5 w-5 text-[#31B8FA]" />
                Additional Options
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md bg-white p-3">
                  <p className="text-sm text-gray-500">Rush Service</p>
                  <p className="font-medium">
                    {orderData.rushService.enabled ? `Enabled ($${orderData.rushService.fee})` : 'Disabled'}
                  </p>
                </div>
                <div className="rounded-md bg-white p-3">
                  <p className="text-sm text-gray-500">Physical Return Label</p>
                  <p className="font-medium">
                    {orderData.options.physicalReturnLabel.enabled ? `Enabled ($${orderData.options.physicalReturnLabel.fee})` : 'Disabled'}
                  </p>
                </div>
                <div className="rounded-md bg-white p-3">
                  <p className="text-sm text-gray-500">Physical Receipt</p>
                  <p className="font-medium">
                    {orderData.options.physicalReceipt.enabled ? `Enabled ($${orderData.options.physicalReceipt.fee})` : 'Disabled'}
                  </p>
                </div>
              </div>
              {orderData.options.message.enabled && (
                <div className="mt-3 rounded-md bg-white p-3">
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="font-medium">{orderData.options.message.note}</p>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="rounded-lg border-2 border-[#31B8FA] bg-blue-50 p-4">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-[#131313]">
                <DollarSign className="mr-2 h-5 w-5 text-[#31B8FA]" />
                Pricing Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Amount</span>
                  <span className="font-medium">${orderData.pricing.baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Extra Fees</span>
                  <span className="font-medium">${orderData.pricing.extraFees.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-[#31B8FA]">${orderData.pricing.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            {orderData.assignedDriver && (
              <div className="rounded-lg border border-gray-200 bg-green-50 p-4">
                <h3 className="mb-3 flex items-center text-lg font-semibold text-[#131313]">
                  <Truck className="mr-2 h-5 w-5 text-green-600" />
                  Assigned Driver
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{orderData.assignedDriver.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{orderData.assignedDriver.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assigned At</p>
                    <p className="font-medium">
                      {new Date(orderData.assignedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-[#131313]">
                <Clock className="mr-2 h-5 w-5 text-[#31B8FA]" />
                Timeline
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">
                    {new Date(orderData.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(orderData.updatedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Review Section */}
            {orderData.review.rating && (
              <div className="rounded-lg border border-gray-200 bg-yellow-50 p-4">
                <h3 className="mb-3 flex items-center text-lg font-semibold text-[#131313]">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Review
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < orderData.review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {orderData.review.comment && (
                    <div>
                      <p className="text-sm text-gray-500">Comment</p>
                      <p className="font-medium">{orderData.review.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">No details available</div>
        )}
      </DialogContent>
    </Dialog>
  )
}