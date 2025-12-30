// 'use client'

// import { useState } from "react"
// import { useParams } from "next/navigation"
// import { useSession } from "next-auth/react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { Copy, MapPin, Phone, Printer, Package, AlertCircle, CheckCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import Image from "next/image"
// import { JobDetailsSkeleton } from "./_components/skeleton"

// /* ================= TYPES ================= */

// type OrderStatus = "PENDING" | "ON_MY_WAY" | "PICKED_UP" | "COMPLETED"

// interface PackageItem {
//   packageNumber: string
//   barcodeImages: string[]
// }

// interface Store {
//   store: string
//   packages: PackageItem[]
// }

// interface Customer {
//   firstName: string
//   lastName: string
//   phone: string
//   address?: { street: string; city: string; zipCode: string }
//   pickupLocation?: { address: string }
// }

// interface ReturnOrderData {
//   _id: string
//   customer: Customer
//   stores: Store[]
//   status: OrderStatus
//   paymentStatus: string
// }

// /* ================= API ================= */

// const fetchReturnOrder = async (orderId: string, token: string): Promise<ReturnOrderData> => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/see-details/${orderId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   })
//   const result = await res.json()
//   if (!res.ok || !result.status) throw new Error(result.message || "Failed to fetch order")
//   return result.data
// }

// const updateOrderStatus = async ({ orderId, token, status }: { orderId: string; token: string; status: OrderStatus }) => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/${orderId}/driver-status`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ status }),
//   })
//   const result = await res.json()
//   if (!res.ok || !result.status) throw new Error(result.message || "Status update failed")
//   return result.data
// }

// /* ================= PAGE ================= */

// export default function JobDetailsPage() {
//   const { id: orderId } = useParams<{ id: string }>()
//   const { data: session, status: sessionStatus } = useSession()
//   const token = session?.accessToken as string
//   const queryClient = useQueryClient()
//   const [selectedPkgForPrint, setSelectedPkgForPrint] = useState<string | null>(null)

//   /* ---------- QUERY ---------- */
//   const { data: orderData, isLoading, isError, error } = useQuery<ReturnOrderData>({
//     queryKey: ["returnOrder", orderId],
//     queryFn: () => fetchReturnOrder(orderId!, token),
//     enabled: !!orderId && !!token && sessionStatus === "authenticated",
//   })

//   /* ---------- MUTATION ---------- */
//   const updateStatusMutation = useMutation({
//     mutationFn: updateOrderStatus,
//     onSuccess: (updated) => {
//       queryClient.setQueryData<ReturnOrderData>(["returnOrder", orderId], (old) =>
//         old ? { ...old, status: updated.status } : old
//       )
//       toast.success("Status updated")
//     },
//     onError: (err: Error) => toast.error(err.message),
//   })

//   /* ================= DATA ================= */
//   const allPackages =
//     orderData?.stores.flatMap((store) =>
//       store.packages.map((pkg) => ({
//         id: pkg.packageNumber,
//         store: store.store,
//         barcodeImage: pkg.barcodeImages?.[0] || null,
//       }))
//     ) || []

//   const customer = orderData?.customer
//   const fullName = `${customer?.firstName || ""} ${customer?.lastName || ""}`
//   const address =
//     customer?.pickupLocation?.address ||
//     (customer?.address ? `${customer.address.street}, ${customer.address.city}, ${customer.address.zipCode}` : "N/A")
//   const orderStatus = orderData?.status ?? "PENDING"

//   /* ================= BUTTON LOGIC ================= */
//   const getButtonConfig = () => {
//     switch (orderStatus) {
//       case "PENDING": return { text: "Start Job (On my way)", next: "ON_MY_WAY" }
//       case "ON_MY_WAY": return { text: "Confirm Pickup", next: "PICKED_UP" }
//       case "PICKED_UP": return { text: "Complete Job", next: "COMPLETED" }
//       case "COMPLETED": return { text: "COMPLETED", next: null, icon: <CheckCircle className="h-5 w-5 mr-2" /> }
//       default: return null
//     }
//   }
//   const buttonConfig = getButtonConfig()

//   const handleStatusUpdate = () => {
//     if (!buttonConfig?.next) return
//     updateStatusMutation.mutate({ orderId: orderId!, token, status: buttonConfig.next as OrderStatus })
//   }

//   /* ================= PRINT FUNCTION ================= */
//   const handlePrint = (pkgId?: string) => {
//     setSelectedPkgForPrint(pkgId || null)
//     setTimeout(() => {
//       window.print()
//       setSelectedPkgForPrint(null)
//     }, 150)
//   }

//   const handleCopy = (text: string, label: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success(`${label} copied!`, { description: text, duration: 2000 })
//   }

//   if (sessionStatus === "loading" || isLoading) return <JobDetailsSkeleton />
//   if (isError || !orderData)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Card className="p-6 flex gap-3 text-red-600">
//           <AlertCircle />
//           <span>{(error as Error)?.message}</span>
//         </Card>
//       </div>
//     )

//   /* ================= UI ================= */
//   return (
//     <>
//       {/* PRINT VIEW */}
//       <div className="hidden print:block print:bg-white">
//         {allPackages.filter(p => !selectedPkgForPrint || p.id === selectedPkgForPrint).map(pkg => (
//           <div key={pkg.id} className="p-10 border-4 border-black text-center page-break mb-8">
//             <h2 className="text-3xl font-bold uppercase mb-8">Shipping Label</h2>
//             {pkg.barcodeImage ? (
//               <div className="flex justify-center mb-6">
//                 <Image src={pkg.barcodeImage} alt={`Barcode ${pkg.id}`} width={500} height={140} className="max-w-full h-auto" />
//               </div>
//             ) : (
//               <div className="h-32 bg-gray-200 border-2 border-dashed rounded mb-6" />
//             )}
//             <p className="font-mono text-4xl font-bold tracking-wider">{pkg.id}</p>
//             <p className="text-lg mt-4 text-gray-700">{pkg.store}</p>
//           </div>
//         ))}
//       </div>

//       {/* SCREEN VIEW */}
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 print:hidden">
//         <div className="mx-auto max-w-5xl">
//           {/* HEADER */}
//           <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Job Details</h1>
//               <p className="text-sm text-gray-500 mt-1 font-medium">Order # {orderData._id.slice(-8)}</p>
//             </div>
//             <span className="rounded-full bg-green-100 px-4 py-1.5 text-xs sm:text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">{orderData.status}</span>
//           </div>

//           {/* CUSTOMER */}
//           <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
//             <div className="p-5 sm:p-6">
//               <h2 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Customer Details</h2>
//               <h3 className="mb-5 text-xl font-bold text-gray-900">{fullName}</h3>
//               <div className="space-y-4">
//                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
//                   <div className="flex items-start gap-3">
//                     <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
//                     <span className="text-sm leading-relaxed text-gray-600">{address}</span>
//                   </div>
//                   <button onClick={() => handleCopy(address, "Address")} className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 active:scale-95 transition-colors"><Copy className="h-3 w-3" /> (copy)</button>
//                 </div>
//                 {customer?.phone && (
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
//                     <div className="flex items-center gap-3">
//                       <Phone className="h-4 w-4 shrink-0 text-gray-400" />
//                       <span className="text-sm font-medium text-gray-600">{customer.phone}</span>
//                     </div>
//                     <button onClick={() => handleCopy(customer.phone, "Phone number")} className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 active:scale-95 transition-colors">
//                       <Copy className="h-3 w-3" /> (copy)
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {/* PACKAGES */}
//           <div className="mb-4 flex items-center justify-between px-1">
//             <h2 className="text-sm font-bold text-gray-500 uppercase tracking-tight">Packages ({allPackages.length})</h2>
//             <Button onClick={() => handlePrint()} variant="outline" size="sm" className="h-9 gap-2 border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
//               <Printer className="h-4 w-4" />
//               <span className="hidden xs:inline">Print All Labels</span>
//               <span className="xs:hidden">Print All</span>
//             </Button>
//           </div>

//           <div className="space-y-4">
//             {allPackages.map(pkg => (
//               <Card key={pkg.id} className="border-none shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
//                 <div className="flex flex-col p-4 sm:flex-row sm:items-center sm:justify-between gap-5">
//                   <div className="flex items-center gap-4">
//                     <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 border border-gray-200">
//                       <Package className="h-7 w-7 text-gray-400" />
//                     </div>
//                     <div>
//                       <h3 className="text-base font-bold text-gray-900">{pkg.store}</h3>
//                       <div className="mt-1.5 flex items-center gap-1.5">
//                         <div className="h-2 w-2 rounded-full bg-gray-300"></div>
//                         <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pkg.id}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-gray-50 pt-4 sm:border-none sm:pt-0">
//                     <button onClick={() => handlePrint(pkg.id)} className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-sky-400 hover:shadow-sm active:scale-95">
//                       {pkg.barcodeImage ? <Image src={pkg.barcodeImage} alt={`Barcode ${pkg.id}`} width={220} height={70} className="h-16 w-auto object-contain" /> : <div className="h-16 w-56 bg-gray-200 border-2 border-dashed rounded" />}
//                       <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-sky-500">Print Label</span>
//                     </button>
//                   </div>
//                 </div>
//               </Card>
//             ))}

//             {/* STATUS BUTTON */}
//             {buttonConfig && (
//               <Button onClick={handleStatusUpdate} disabled={orderStatus === "COMPLETED" || updateStatusMutation.isPending} className={`w-full h-12 text-white rounded-[24px] ${orderStatus === "COMPLETED" ? "bg-green-600 cursor-default" : "bg-[#31B8FA] hover:bg-[#31B8FA]/90"}`}>
//                 {updateStatusMutation.isPending ? "Updating..." : (<>{buttonConfig.icon}{buttonConfig.text}</>)}
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }



'use client'

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Copy, MapPin, Phone, Printer, Package, CheckCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { JobDetailsSkeleton } from "./_components/skeleton"

/* ================= TYPES ================= */

type OrderStatus = "PENDING" | "ON_MY_WAY" | "PICKED_UP" | "COMPLETED"

interface PackageItem {
  packageNumber: string
  barcodeImages: string[]
}

interface Store {
  store: string
  packages: PackageItem[]
}

interface Customer {
  firstName: string
  lastName: string
  phone: string
  address?: { street: string; city: string; zipCode: string }
  pickupLocation?: { address: string }
}

interface ReturnOrderData {
  _id: string
  customer: Customer
  stores: Store[]
  status: OrderStatus
  paymentStatus: string
  options?: {
    physicalReturnLabel?: {
      enabled: boolean
      labelFiles: string[]
    }
  }
}

/* ================= API ================= */

const fetchReturnOrder = async (orderId: string, token: string): Promise<ReturnOrderData> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/see-details/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await res.json()
  if (!res.ok || !result.status) throw new Error(result.message || "Failed to fetch order")
  return result.data
}

const updateOrderStatus = async ({ orderId, token, status }: { orderId: string; token: string; status: OrderStatus }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/${orderId}/driver-status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
  const result = await res.json()
  if (!res.ok || !result.status) throw new Error(result.message || "Status update failed")
  return result.data
}

export default function JobDetailsPage() {
  const { id: orderId } = useParams<{ id: string }>()
  const { data: session, status: sessionStatus } = useSession()
  const token = session?.accessToken as string
  const queryClient = useQueryClient()

  const pdfTemplateRef = useRef<HTMLDivElement>(null)
  const [activePkg, setActivePkg] = useState<{ id: string; store: string; barcodeImage: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  /* ---------- QUERY ---------- */
  const { data: orderData, isLoading, isError } = useQuery<ReturnOrderData>({
    queryKey: ["returnOrder", orderId],
    queryFn: () => fetchReturnOrder(orderId!, token),
    enabled: !!orderId && !!token && sessionStatus === "authenticated",
  })

  /* ---------- MUTATION ---------- */
  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (updated) => {
      queryClient.setQueryData<ReturnOrderData>(["returnOrder", orderId], (old) =>
        old ? { ...old, status: updated.status } : old
      )
      toast.success("Status updated")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  /* ================= DATA ================= */
  const allPackages = orderData?.stores.flatMap((store) =>
    store.packages.map((pkg) => ({
      id: pkg.packageNumber,
      store: store.store,
      barcodeImage: pkg.barcodeImages?.[0] || "",
    }))
  ) || []

  const returnLabelImage = orderData?.options?.physicalReturnLabel?.enabled
    ? orderData.options.physicalReturnLabel.labelFiles?.[0]
    : null

  const customer = orderData?.customer
  const fullName = `${customer?.firstName || ""} ${customer?.lastName || ""}`
  const address = customer?.pickupLocation?.address || (customer?.address ? `${customer.address.street}, ${customer.address.city}, ${customer.address.zipCode}` : "N/A")
  const orderStatus = orderData?.status ?? "PENDING"

  /* ================= PDF PRINT LOGIC ================= */
  const handlePrintAsPDF = async (pkg: { id: string; store: string; barcodeImage: string } | 'return-label') => {
    setIsGenerating(true)
    const toastId = toast.loading("Preparing PDF...")

    if (pkg === 'return-label') {
      setActivePkg({ id: 'Main Label', store: 'Return Shipping Label', barcodeImage: returnLabelImage || '' })
    } else {
      setActivePkg(pkg)
    }

    // Delay for DOM update
    setTimeout(async () => {
      try {
        const element = pdfTemplateRef.current
        if (!element) return

        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false
        })

        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        
        const blob = pdf.output("blob")
        const url = URL.createObjectURL(blob)
        const printWindow = window.open(url)
        
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print()
            URL.revokeObjectURL(url)
          }
        }
        toast.success("Ready to print", { id: toastId })
      } catch (err) {
        toast.error("PDF generation failed" + err, { id: toastId })
      } finally {
        setIsGenerating(false)
      }
    }, 800)
  }

  const handleStatusUpdate = () => {
    const config = getButtonConfig()
    if (!config?.next) return
    updateStatusMutation.mutate({ orderId: orderId!, token, status: config.next as OrderStatus })
  }

  const getButtonConfig = () => {
    switch (orderStatus) {
      case "PENDING": return { text: "Start Job (On my way)", next: "ON_MY_WAY" }
      case "ON_MY_WAY": return { text: "Confirm Pickup", next: "PICKED_UP" }
      case "PICKED_UP": return { text: "Complete Job", next: "COMPLETED" }
      case "COMPLETED": return { text: "COMPLETED", next: null, icon: <CheckCircle className="h-5 w-5 mr-2" /> }
      default: return null
    }
  }
  const buttonConfig = getButtonConfig()

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  if (sessionStatus === "loading" || isLoading) return <JobDetailsSkeleton />
  if (isError || !orderData) return <div className="p-10 text-center text-red-500">Error loading job details.</div>

  return (
    <>
      {/* HIDDEN PDF TEMPLATE */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <div ref={pdfTemplateRef} className="bg-white p-16 text-center" style={{ width: '794px' }}>
          <div className="border-[8px] border-black p-10 flex flex-col items-center justify-center min-h-[1000px]">
            <h1 className="text-5xl font-black uppercase mb-4 text-black">Package Label</h1>
            <p className="text-2xl text-gray-600 mb-10">Store: {activePkg?.store}</p>
            {activePkg?.barcodeImage && (
              <Image src={activePkg.barcodeImage} crossOrigin="anonymous" alt="Barcode" width={1000} height={1000} className="w-full h-auto mb-10 max-h-[400px] object-contain" />
            )}
            <p className="text-7xl font-mono font-black tracking-[12px] mt-6 text-black">{activePkg?.id}</p>
            <div className="mt-20 border-t-2 border-black pt-10 w-full text-left text-black text-xl">
              <p><b>Order ID:</b> {orderData._id}</p>
              <p><b>Customer:</b> {fullName}</p>
              <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SCREEN VIEW */}
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Job Details</h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">Order # {orderData._id.slice(-8)}</p>
            </div>
            <span className="rounded-full bg-green-100 px-4 py-1.5 text-xs sm:text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">{orderData.status}</span>
          </div>

          {/* CUSTOMER */}
          <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
            <div className="p-5 sm:p-6">
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Customer Details</h2>
              <h3 className="mb-5 text-xl font-bold text-gray-900">{fullName}</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span className="text-sm leading-relaxed text-gray-600">{address}</span>
                  </div>
                  <button onClick={() => handleCopy(address, "Address")} className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 transition-colors"><Copy className="h-3 w-3" /> (copy)</button>
                </div>
                {customer?.phone && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">{customer.phone}</span>
                    </div>
                    <button onClick={() => handleCopy(customer.phone, "Phone number")} className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 transition-colors">
                      <Copy className="h-3 w-3" /> (copy)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* RETURN LABEL (NEW) */}
          {returnLabelImage && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-sm font-bold uppercase text-gray-500 tracking-tight flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Return Shipping Label
                </h2>
                <Button onClick={() => handlePrintAsPDF('return-label')} variant="outline" size="sm" className="h-9 gap-2 border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                   <Printer className="h-4 w-4" /> Print PDF
                </Button>
              </div>
              <Card className="p-6 bg-gray-50">
                 <div className="relative h-48 w-full flex justify-center">
                    <Image src={returnLabelImage} alt="Return Label" width={10000} height={10000} className="h-full object-contain rounded-lg shadow-sm bg-white" />
                 </div>
              </Card>
            </div>
          )}




          {/* PACKAGES */}
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-tight">Packages ({allPackages.length})</h2>
            {allPackages.length > 0 && (
              <Button onClick={() => handlePrintAsPDF(allPackages[0])} variant="outline" size="sm" className="h-9 gap-2 border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                <Printer className="h-4 w-4" />
                <span className="hidden xs:inline">Print PDF</span>
              </Button>
            )}
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
                        <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pkg.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-gray-50 pt-4 sm:border-none sm:pt-0">
                    <button onClick={() => handlePrintAsPDF(pkg)} disabled={isGenerating} className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-sky-400 hover:shadow-sm active:scale-95">
                      {pkg.barcodeImage ? <Image src={pkg.barcodeImage} crossOrigin="anonymous" width={100} height={100} alt={`Barcode ${pkg.id}`} className="h-16 w-auto object-contain" /> : <div className="h-16 w-56 bg-gray-200 border-2 border-dashed rounded" />}
                      <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-sky-500">
                        {isGenerating && activePkg?.id === pkg.id ? 'Processing...' : 'Print Label PDF'}
                      </span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}

            {/* STATUS BUTTON */}
            {buttonConfig && (
              <Button onClick={handleStatusUpdate} disabled={orderStatus === "COMPLETED" || updateStatusMutation.isPending} className={`w-full h-12 text-white rounded-[24px] mt-6 ${orderStatus === "COMPLETED" ? "bg-green-600 cursor-default" : "bg-[#31B8FA] hover:bg-[#31B8FA]/90"}`}>
                {updateStatusMutation.isPending ? "Updating..." : (<>{buttonConfig.icon}{buttonConfig.text}</>)}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
