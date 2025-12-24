'use client'

import { useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Copy, MapPin, Phone, Printer, Package, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Image from "next/image"

interface PackageInfo {
  id: string
  store: string
  barcodeImage: string
}

interface Customer {
  firstName: string
  lastName: string
  phone: string
  address?: { street: string; city: string; zipCode: string }
  pickupLocation?: { address: string }
}

interface ReturnOrderData {
  customer: Customer
  stores: {
    store: string
    packages: {
      packageNumber: string
      barcodeImages: string[]
    }[]
  }[]
  _id: string
  paymentStatus: string
}

const fetchReturnOrder = async (orderId: string, token: string): Promise<ReturnOrderData> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || "Failed to fetch order")
  }

  const result = await res.json()
  if (!result.status || !result.data) {
    throw new Error(result.message || "Invalid response format")
  }

  return result.data
}

export default function JobDetailsPage() {
  const { id: orderId } = useParams<{ id: string }>()
  const { data: session, status: sessionStatus } = useSession()
  const token = session?.accessToken as string | undefined

  const [selectedPkgForPrint, setSelectedPkgForPrint] = useState<string | null>(null)

  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["returnOrder", orderId],
    queryFn: () => fetchReturnOrder(orderId!, token!),
    enabled: !!orderId && sessionStatus === "authenticated" && !!token,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Flatten packages
  const allPackages: PackageInfo[] = orderData?.stores.flatMap(store =>
    store.packages.map(pkg => ({
      id: pkg.packageNumber,
      store: store.store,
      barcodeImage: pkg.barcodeImages[0] || "",
    }))
  ) || []

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`, {
      description: text,
      duration: 2000,
    })
  }

  const handlePrint = (pkgId?: string) => {
    setSelectedPkgForPrint(pkgId || null)
    setTimeout(() => {
      window.print()
      setSelectedPkgForPrint(null)
    }, 150)
  }

  const customer = orderData?.customer
  const fullName = customer ? `${customer.firstName} ${customer.lastName}`.trim() : "N/A"
  const address =
    customer?.pickupLocation?.address ||
    (customer?.address
      ? `${customer.address.street}, ${customer.address.city}, ${customer.address.zipCode}`
      : "N/A")

  // Loading State (Session + Query)
  if (sessionStatus === "loading" || isLoading) {
    return <JobDetailsSkeleton />
  }

  // Error State
  if (isError || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 print:hidden">
        <Card className="max-w-md w-full p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-8 w-8" />
            <div>
              <h3 className="font-bold text-lg">Error Loading Order</h3>
              <p className="text-sm text-gray-600 mt-1">
                {(error as Error)?.message || "Order not found or inaccessible"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* PRINT VIEW */}
      <div className="hidden print:block print:bg-white">
        {allPackages
          .filter(p => !selectedPkgForPrint || p.id === selectedPkgForPrint)
          .map(pkg => (
            <div key={pkg.id} className="p-10 border-4 border-black text-center page-break mb-8">
              <h2 className="text-3xl font-bold uppercase mb-8">Shipping Label</h2>
              {pkg.barcodeImage ? (
                <div className="flex justify-center mb-6">
                  <Image
                    src={pkg.barcodeImage}
                    alt={`Barcode ${pkg.id}`}
                    width={500}
                    height={140}
                    className="max-w-full h-auto"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gray-200 border-2 border-dashed rounded mb-6" />
              )}
              <p className="font-mono text-4xl font-bold tracking-wider">{pkg.id}</p>
              <p className="text-lg mt-4 text-gray-700">{pkg.store}</p>
            </div>
          ))}
      </div>

      {/* SCREEN VIEW */}
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 print:hidden">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Job Details</h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">Order # {orderData._id.slice(-8)}</p>
            </div>
            <span className="rounded-full bg-green-100 px-4 py-1.5 text-xs sm:text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
              {orderData.paymentStatus}
            </span>
          </div>

          {/* Customer Card */}
          <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
            <div className="p-5 sm:p-6">
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Customer Details
              </h2>
              <h3 className="mb-5 text-xl font-bold text-gray-900">{fullName}</h3>

              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span className="text-sm leading-relaxed text-gray-600">{address}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(address, "Address")}
                    className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 active:scale-95 transition-colors"
                  >
                    <Copy className="h-3 w-3" /> (copy)
                  </button>
                </div>

                {customer?.phone && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">{customer.phone}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(customer.phone, "Phone number")}
                      className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 active:scale-95 transition-colors"
                    >
                      <Copy className="h-3 w-3" /> (copy)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Packages */}
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-tight">
              Packages ({allPackages.length})
            </h2>
            <Button
              onClick={() => handlePrint()}
              variant="outline"
              size="sm"
              className="h-9 gap-2 border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden xs:inline">Print All Labels</span>
              <span className="xs:hidden">Print All</span>
            </Button>
          </div>

          <div className="space-y-4">
            {allPackages.map(pkg => (
              <Card key={pkg.id} className="border-none shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
                <div className="flex flex-col p-4 sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 border border-gray-200">
                      <Package className="h-7 w-7 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{pkg.store}</h3>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                        <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {pkg.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-gray-50 pt-4 sm:border-none sm:pt-0">
                    <button
                      onClick={() => handlePrint(pkg.id)}
                      className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-sky-400 hover:shadow-sm active:scale-95"
                    >
                      {pkg.barcodeImage ? (
                        <Image
                          src={pkg.barcodeImage}
                          alt={`Barcode ${pkg.id}`}
                          width={220}
                          height={70}
                          className="h-16 w-auto object-contain"
                        />
                      ) : (
                        <div className="h-16 w-56 bg-gray-200 border-2 border-dashed rounded" />
                      )}
                      <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-sky-500">
                        Print Label
                      </span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// Extracted Skeleton Component (reusable & clean)
function JobDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 print:hidden">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
          <div className="p-5 sm:p-6 space-y-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-7 w-64" />
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Skeleton className="mt-0.5 h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-8 w-20 ml-4" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-8 w-20 ml-4" />
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-4 flex items-center justify-between px-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="border-none shadow-sm ring-1 ring-gray-200">
              <div className="flex flex-col p-4 sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-6 border-t border-gray-50 pt-4 sm:border-none sm:pt-0">
                  <Skeleton className="h-14 w-48 rounded-lg" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}