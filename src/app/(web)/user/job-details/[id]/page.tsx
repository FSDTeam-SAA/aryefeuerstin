

// 'use client'

// import { useState, useRef } from "react"
// import { useParams } from "next/navigation"
// import { useSession } from "next-auth/react"
// import { useQuery } from "@tanstack/react-query"
// import { Copy, MapPin, Phone, Printer, Package, } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { toast } from "sonner"
// import Image from "next/image"
// import jsPDF from "jspdf"
// import html2canvas from "html2canvas"

// // --- Interfaces ---
// interface PackageInfo {
//   id: string
//   store: string
//   barcodeImage: string
// }

// interface Customer {
//   firstName: string
//   lastName: string
//   phone: string
//   address?: { street: string; city: string; zipCode: string }
//   pickupLocation?: { address: string }
// }

// interface ReturnOrderData {
//   customer: Customer
//   stores: {
//     store: string
//     packages: {
//       packageNumber: string
//       barcodeImages: string[]
//     }[]
//   }[]
//   options: {
//     physicalReturnLabel: { enabled: boolean; labelFiles: string[] }
//   }
//   _id: string
//   paymentStatus: string
// }

// const fetchReturnOrder = async (orderId: string, token: string): Promise<ReturnOrderData> => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/${orderId}`, {
//     headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//   })
//   const result = await res.json()
//   return result.data
// }

// export default function JobDetailsPage() {
//   const { id: orderId } = useParams<{ id: string }>()
//   const { data: session, status: sessionStatus } = useSession()
//   const token = session?.accessToken as string | undefined
  
//   const pdfTemplateRef = useRef<HTMLDivElement>(null)
//   const [activePkg, setActivePkg] = useState<PackageInfo | null>(null)
//   const [isGenerating, setIsGenerating] = useState(false)

//   const { data: orderData, isLoading,  } = useQuery({
//     queryKey: ["returnOrder", orderId],
//     queryFn: () => fetchReturnOrder(orderId!, token!),
//     enabled: !!orderId && sessionStatus === "authenticated" && !!token,
//   })

//   const allPackages: PackageInfo[] = orderData?.stores.flatMap(store =>
//     store.packages.map(pkg => ({
//       id: pkg.packageNumber,
//       store: store.store,
//       barcodeImage: pkg.barcodeImages[0] || "",
//     }))
//   ) || []

//   const returnLabelImage = orderData?.options.physicalReturnLabel.enabled
//     ? orderData.options.physicalReturnLabel.labelFiles[0]
//     : null

//   // --- PDF GENERATOR ---
//   const handlePrintAsPDF = async (pkg: PackageInfo | 'return-label') => {
//     setIsGenerating(true)
//     const toastId = toast.loading("Generating Label PDF...")

//     // Set active data
//     if (pkg === 'return-label') {
//       setActivePkg({ id: 'Shipping Label', store: 'Return Label', barcodeImage: returnLabelImage || '' })
//     } else {
//       setActivePkg(pkg)
//     }

//     // Wait for the hidden image to load completely
//     setTimeout(async () => {
//       try {
//         const element = pdfTemplateRef.current
//         if (!element) return

//         const canvas = await html2canvas(element, {
//           scale: 3, 
//           useCORS: true,
//           backgroundColor: "#ffffff",
//           logging: false
//         })

//         const imgData = canvas.toDataURL("image/png")
//         const pdf = new jsPDF({
//           orientation: "portrait",
//           unit: "mm",
//           format: "a4",
//         })

//         const pdfWidth = pdf.internal.pageSize.getWidth()
//         const pdfHeight = (canvas.height * pdfWidth) / canvas.width

//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        
//         const blob = pdf.output("blob")
//         const url = URL.createObjectURL(blob)
//         const printWindow = window.open(url)
        
//         if (printWindow) {
//           printWindow.onload = () => {
//             printWindow.print()
//             URL.revokeObjectURL(url)
//           }
//         }
        
//         toast.success("Ready to print", { id: toastId })
//       } catch (err) {
//         console.error(err)
//         toast.error("PDF generation failed.", { id: toastId })
//       } finally {
//         setIsGenerating(false)
//       }
//     }, 800)
//   }

//   const handleCopy = (text: string, label: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success(`${label} copied!`)
//   }

//   if (isLoading || sessionStatus === "loading") return <JobDetailsSkeleton />
//   if (!orderData) return null

//   const customer = orderData.customer
//   const fullName = `${customer.firstName} ${customer.lastName}`.trim()
//   const address = customer.pickupLocation?.address || "N/A"

//   return (
//     <>
//       {/* ===================== HIDDEN PRINT TEMPLATE ===================== */}
//       <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
//         <div ref={pdfTemplateRef} className="bg-white p-16 text-center" style={{ width: '794px' }}>
//           <div className="border-[8px] border-black p-10 flex flex-col items-center justify-center min-h-[1000px]">
//             <h1 className="text-5xl font-black uppercase mb-4 text-black">Package Label</h1>
//             <p className="text-2xl text-gray-600 mb-10">Store: {activePkg?.store}</p>
            
//             {activePkg?.barcodeImage && (
//               <Image 
//                 width={1000}
//                 height={1000} 
//                 src={activePkg.barcodeImage} 
//                 crossOrigin="anonymous" 
//                 alt="Barcode" 
//                 className="w-full h-auto mb-10 max-h-[400px] object-contain" 
//               />
//             )}

//             <p className="text-7xl font-mono font-black tracking-[12px] mt-6 text-black">
//               {activePkg?.id}
//             </p>
            
//             <div className="mt-20 border-t-2 border-black pt-10 w-full text-left text-black">
//               <p className="text-xl"><b>Order ID:</b> {orderData._id}</p>
//               <p className="text-xl"><b>Customer:</b> {fullName}</p>
//               <p className="text-xl"><b>Date:</b> {new Date().toLocaleDateString()}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//         <div className="mx-auto max-w-5xl">
//           <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Job Details</h1>
//               <p className="text-sm text-gray-500 mt-1 font-medium">Order # {orderData._id.slice(-8)}</p>
//             </div>
//             <span className="rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-semibold text-yellow-800">
//               {orderData.paymentStatus}
//             </span>
//           </div>

//            <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
//             <div className="p-5 sm:p-6">
//                <h2 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
//                 Customer Details
//                </h2>
//                <h3 className="mb-5 text-xl font-bold text-gray-900">{fullName}</h3>

//              <div className="space-y-4">
//                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
//                   <div className="flex items-start gap-3">
//                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
//                     <span className="text-sm leading-relaxed text-gray-600">{address}</span>
//                   </div>
//                    <button
//                      onClick={() => handleCopy(address, "Address")}
//                      className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 transition-colors"
//                   >
//                     <Copy className="h-3 w-3" /> (copy)
//                   </button>
//                 </div>

//                 {customer?.phone && (
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
//                     <div className="flex items-center gap-3">
//                       <Phone className="h-4 w-4 shrink-0 text-gray-400" />
//                       <span className="text-sm font-medium text-gray-600">{customer.phone}</span>
//                     </div>
//                     <button
//                       onClick={() => handleCopy(customer.phone, "Phone number")}
//                       className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 transition-colors"
//                     >
//                       <Copy className="h-3 w-3" /> (copy)
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {returnLabelImage && (
//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-sm font-bold uppercase text-gray-500">Return Shipping Label</h2>
//                 <Button onClick={() => handlePrintAsPDF('return-label')} disabled={isGenerating} variant="outline" size="sm">
//                    <Printer className="h-4 w-4 mr-2" /> Print PDF
//                 </Button>
//               </div>
//               <Card className="p-6 bg-gray-50 rounded-[8px]">
//                 <div className="relative h-[80px] w-full">
//                   <Image 
//                     src={returnLabelImage} 
//                     alt="Return Label" 
//                     fill 
//                     className="object-contain rounded" 
//                     unoptimized 
//                   />
//                 </div>
//               </Card>
//             </div>
//           )}

//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-sm font-bold uppercase text-gray-500">Packages ({allPackages.length})</h2>
//             {allPackages.length > 0 && (
//               <Button onClick={() => handlePrintAsPDF(allPackages[0])} disabled={isGenerating} variant="outline" size="sm">
//                 <Printer className="h-4 w-4 mr-2" /> Print PDF
//               </Button>
//             )}
//           </div>

//           <div className="space-y-4">
//             {allPackages.map(pkg => (
//               <Card key={pkg.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
//                 <div className="flex items-center gap-4">
//                   <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center border">
//                     <Package className="h-8 w-8 text-gray-400" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-900">{pkg.store}</h3>
//                     <p className="text-xs font-mono text-gray-500 uppercase">#{pkg.id}</p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => handlePrintAsPDF(pkg)}
//                   disabled={isGenerating}
//                   className="group border rounded-xl p-4 bg-white hover:border-sky-500 transition flex flex-col items-center"
//                 >
//                   {pkg.barcodeImage ? (
//                     <Image
//                       width={1000}
//                       height={1000} 
//                       src={pkg.barcodeImage} 
//                       crossOrigin="anonymous" 
//                       alt="barcode" 
//                       className="h-12 w-48 object-contain" 
//                     />
//                   ) : (
//                     <div className="h-12 w-48 bg-gray-200 rounded border-dashed border-2" />
//                   )}
//                   <span className="text-[10px] font-bold uppercase text-gray-400 mt-2 group-hover:text-sky-600 flex items-center gap-1">
//                     <Printer className="h-3 w-3" /> {isGenerating && activePkg?.id === pkg.id ? 'Creating...' : 'Print Label PDF'}
//                   </span>
//                 </button>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// function JobDetailsSkeleton() {
//   return <div className="p-10 space-y-4"><Skeleton className="h-10 max-w-7xl mx-auto" /><Skeleton className="h-40 max-w-7xl mx-auto" /><Skeleton className="h-20 max-w-7xl mx-auto" /></div>
// }








'use client'

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Copy, MapPin, Phone, Printer, Package, FileText, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Image from "next/image"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

// --- Interfaces ---
interface PackageInfo {
  id: string
  store: string
  barcodeImage: string
}

interface Customer {
  firstName: string
  lastName: string
  phone: string
  email?: string
  address?: { street: string; city: string; zipCode: string }
  pickupLocation?: { address: string }
  pickupInstructions?: string
}

interface MessageOption {
  enabled: boolean
  note: string
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
  options: {
    physicalReturnLabel: { enabled: boolean; labelFiles: string[] }
    message?: MessageOption
  }
  _id: string
  paymentStatus: string
  status: string
}

const fetchReturnOrder = async (orderId: string, token: string): Promise<ReturnOrderData> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/${orderId}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  })
  const result = await res.json()
  if (!result.data) throw new Error("Failed to load order")
  return result.data
}

export default function JobDetailsPage() {
  const { id: orderId } = useParams<{ id: string }>()
  const { data: session, status: sessionStatus } = useSession()
  const token = session?.accessToken as string | undefined

  const pdfTemplateRef = useRef<HTMLDivElement>(null)
  const [activePkg, setActivePkg] = useState<PackageInfo | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["returnOrder", orderId],
    queryFn: () => fetchReturnOrder(orderId!, token!),
    enabled: !!orderId && sessionStatus === "authenticated" && !!token,
  })

  const allPackages: PackageInfo[] = orderData?.stores.flatMap(store =>
    store.packages.map(pkg => ({
      id: pkg.packageNumber,
      store: store.store,
      barcodeImage: pkg.barcodeImages[0] || "",
    }))
  ) || []

  const returnLabelImage = orderData?.options.physicalReturnLabel.enabled
    ? orderData.options.physicalReturnLabel.labelFiles[0]
    : null

  // Extract data
  const customer = orderData?.customer
  const fullName = `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || "N/A"
  const address = customer?.pickupLocation?.address || "N/A"
  const pickupInstructions = customer?.pickupInstructions?.trim()
  const customerMessage = orderData?.options?.message?.enabled && orderData?.options?.message?.note?.trim()
    ? orderData.options.message.note.trim()
    : null

  // --- OPTIMIZED HIGH-QUALITY PDF GENERATOR (Max ~1MB) ---
  const handlePrintAsPDF = async (pkg: PackageInfo | 'return-label') => {
    setIsGenerating(true)
    const toastId = toast.loading("Generating high-quality label...")

    let targetPkg: PackageInfo

    if (pkg === 'return-label') {
      if (!returnLabelImage) {
        toast.error("Return label not available", { id: toastId })
        setIsGenerating(false)
        return
      }
      targetPkg = { id: 'Shipping Label', store: 'Return Label', barcodeImage: returnLabelImage }
    } else {
      if (!pkg.barcodeImage) {
        toast.error("No barcode available", { id: toastId })
        setIsGenerating(false)
        return
      }
      targetPkg = pkg
    }

    setActivePkg(targetPkg)

    setTimeout(async () => {
      try {
        const element = pdfTemplateRef.current
        if (!element) throw new Error("Template not found")

        const canvas = await html2canvas(element, {
          scale: 5,                    // Maximum sharpness
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          allowTaint: false,
        })

        const imgData = canvas.toDataURL("image/jpeg", 0.95)  // High quality JPEG = sharp + small size

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [100, 150],          // 4x6 inch – ideal for thermal printers
          compress: true,
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()

        const imgWidth = canvas.width / 5
        const imgHeight = canvas.height / 5
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const scaledWidth = imgWidth * ratio
        const scaledHeight = imgHeight * ratio

        pdf.addImage(
          imgData,
          "JPEG",
          (pdfWidth - scaledWidth) / 2,
          (pdfHeight - scaledHeight) / 2,
          scaledWidth,
          scaledHeight,
          undefined,
          "FAST"
        )

        const blob = pdf.output("blob")
        const url = URL.createObjectURL(blob)

        const printWindow = window.open(url, "_blank")

        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => printWindow.print(), 800)
          }
          setTimeout(() => {
            if (!printWindow.closed) printWindow.print()
          }, 2000)
          toast.success("Print dialog opened!", { id: toastId })
        } else {
          pdf.save(`Label_${targetPkg.id.replace(/\s/g, '_')}.pdf`)
          toast.success("PDF downloaded – open and print", { id: toastId })
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to generate PDF", { id: toastId })
      } finally {
        setIsGenerating(false)
        setActivePkg(null)
      }
    }, 1000)
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  if (isLoading || sessionStatus === "loading") return <JobDetailsSkeleton />
  if (!orderData) return null

  return (
    <>
      {/* ===================== HIDDEN PRINT TEMPLATE (High Quality) ===================== */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <div ref={pdfTemplateRef} className="bg-white" style={{ width: '1000px', padding: '80px 60px' }}>
          <div className="border-[8px] border-black flex flex-col items-center justify-between min-h-[1400px]">
            <div className="text-center">
              <h1 className="text-7xl font-black uppercase tracking-wider text-black">PACKAGE LABEL</h1>
              <p className="text-4xl font-bold text-gray-800 mt-8">Store: {activePkg?.store || "N/A"}</p>
            </div>

            {activePkg?.barcodeImage && (
              <div className="flex-1 flex items-center justify-center w-full px-10">
                <Image
                  src={activePkg.barcodeImage}
                  crossOrigin="anonymous"
                  alt="Barcode"
                  width={1600}
                  height={900}
                  className="max-w-full max-h-full object-contain"
                  unoptimized
                  priority
                />
              </div>
            )}

            <div className="text-center w-full">
              <p className="text-7xl font-mono font-black tracking-[12px] text-black">
                {activePkg?.id}
              </p>

              <div className="mt-16 border-t-4 border-black pt-8 w-full text-left px-8">
                <p className="text-2xl text-black"><b>Order ID:</b> {orderData._id.slice(-8)}</p>
                <p className="text-2xl text-black"><b>Customer:</b> {fullName}</p>
                <p className="text-2xl text-black"><b>Date:</b> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MAIN UI ===================== */}
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Job Details</h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">Order # {orderData._id.slice(-8)}</p>
            </div>
            <span className="rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-semibold text-yellow-800">
              {orderData.paymentStatus}
            </span>
          </div>

          {/* CUSTOMER CARD WITH pickupInstructions & message */}
          <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
            <div className="p-5 sm:p-6">
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Customer Details
              </h2>
              <h3 className="mb-6 text-xl font-bold text-gray-900">{fullName}</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Address & Phone */}
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <span className="text-sm leading-relaxed text-gray-600">{address}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(address, "Address")}
                      className="ml-4 flex items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 transition-colors"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>

                  {customer?.phone && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">{customer.phone}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(customer.phone, "Phone number")}
                        className="ml-4 flex items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 transition-colors"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Instructions & Message */}
                <div className="space-y-5">
                  {pickupInstructions && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-bold uppercase text-gray-500">Pickup Instructions</span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                        {pickupInstructions}
                      </p>
                    </div>
                  )}

                  {customerMessage && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-bold uppercase text-gray-500">Customer Message</span>
                      </div>
                      <p className="text-sm text-gray-700 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                        {customerMessage}
                      </p>
                    </div>
                  )}

                  {!pickupInstructions && !customerMessage && (
                    <p className="text-sm text-gray-400 italic">No additional instructions or messages.</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* RETURN LABEL */}
          {returnLabelImage && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold uppercase text-gray-500">Return Shipping Label</h2>
                <Button onClick={() => handlePrintAsPDF('return-label')} disabled={isGenerating} variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" /> Print PDF
                </Button>
              </div>
              <Card className="p-6 bg-gray-50 rounded-[8px]">
                <div className="relative h-[80px] w-full">
                  <Image src={returnLabelImage} alt="Return Label" fill className="object-contain rounded" unoptimized />
                </div>
              </Card>
            </div>
          )}

          {/* PACKAGES */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase text-gray-500">Packages ({allPackages.length})</h2>
            {allPackages.length > 0 && allPackages[0].barcodeImage && (
              <Button onClick={() => handlePrintAsPDF(allPackages[0])} disabled={isGenerating} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" /> Print PDF
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {allPackages.map(pkg => (
              <Card key={pkg.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center border">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{pkg.store}</h3>
                    <p className="text-xs font-mono text-gray-500 uppercase">#{pkg.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => handlePrintAsPDF(pkg)}
                  disabled={isGenerating || !pkg.barcodeImage}
                  className="group border rounded-xl p-4 bg-white hover:border-sky-500 transition flex flex-col items-center disabled:opacity-50"
                >
                  {pkg.barcodeImage ? (
                    <Image
                      src={pkg.barcodeImage}
                      crossOrigin="anonymous"
                      alt="barcode"
                      width={1000}
                      height={1000}
                      className="h-12 w-48 object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="h-12 w-48 bg-gray-200 rounded border-dashed border-2" />
                  )}
                  <span className="text-[10px] font-bold uppercase text-gray-400 mt-2 group-hover:text-sky-600 flex items-center gap-1">
                    <Printer className="h-3 w-3" />
                    {isGenerating && activePkg?.id === pkg.id ? 'Creating...' : 'Print Label PDF'}
                  </span>
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function JobDetailsSkeleton() {
  return (
    <div className="p-10 space-y-8 max-w-5xl mx-auto">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}