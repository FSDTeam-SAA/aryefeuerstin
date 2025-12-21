'use client'
import { useState } from "react"
import { Copy, MapPin, Phone, Printer, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

export default function JobDetailsPage() {
  const [selectedPkgForPrint, setSelectedPkgForPrint] = useState<string | null>(null)

  const packages = [
    { id: "PKG-A1", title: "Electronics", desc: "Small box, fragile", weight: "2.5 lbs" },
    { id: "PKG-A2", title: "Documents", desc: "Large envelope", weight: "2.5 lbs" },
  ]

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`, {
      description: text,
      duration: 2000,
    })
  }

  const handlePrint = (pkgId: string) => {
    setSelectedPkgForPrint(pkgId)
    setTimeout(() => {
      window.print()
      setSelectedPkgForPrint(null)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* PRINT-ONLY VIEW */}
      <div className="hidden print:block">
        {packages.filter(p => !selectedPkgForPrint || p.id === selectedPkgForPrint).map(pkg => (
          <div key={pkg.id} className="p-10 border-4 border-black text-center mb-8 break-inside-avoid">
            <h2 className="text-2xl font-bold uppercase mb-4">Shipping Label</h2>
            <div className="flex justify-center mb-4">
              <BarcodeSVG className="h-24 w-80" />
            </div>
            <p className="font-mono text-3xl font-bold">{pkg.id}</p>
          </div>
        ))}
      </div>

      {/* SCREEN VIEW */}
      <div className="mx-auto max-w-5xl print:hidden">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Job Details</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">Order # Job 1002</p>
          </div>
          <div className="flex">
            <span className="rounded-full bg-green-100 px-4 py-1.5 text-xs sm:text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
              Completed
            </span>
          </div>
        </div>

        {/* Customer Details Card */}
        <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
          <div className="p-5 sm:p-6">
            <h2 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Customer Details</h2>
            <h3 className="mb-5 text-xl font-bold text-gray-900">Daniel Hart</h3>

            <div className="space-y-4">
              {/* Address Row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <span className="text-sm leading-relaxed text-gray-600">19 Maple Street, Brookview, CA 92714</span>
                </div>
                <button 
                  onClick={() => handleCopy("19 Maple Street, Brookview, CA 92714", "Address")}
                  className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 transition-colors hover:bg-sky-50 active:scale-95"
                >
                  <Copy className="h-3 w-3" /> (copy)
                </button>
              </div>

              {/* Phone Row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">+1 415-203-8892</span>
                </div>
                <button 
                  onClick={() => handleCopy("+1 415-203-8892", "Phone number")}
                  className="flex w-fit items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-sky-500 transition-colors hover:bg-sky-50 active:scale-95"
                >
                  <Copy className="h-3 w-3" /> (copy)
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Package Section Header */}
        <div className="mb-4 flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-tight">Packages ({packages.length})</h2>
          <Button 
            onClick={() => window.print()} 
            variant="outline" 
            size="sm" 
            className="h-9 gap-2 border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" /> 
            <span className="hidden xs:inline">Print All Labels</span>
            <span className="xs:hidden">Print All</span>
          </Button>
        </div>

        {/* Packages List */}
        <div className="space-y-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="border-none shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
              <div className="flex flex-col p-4 sm:flex-row sm:items-center sm:justify-between gap-5">
                {/* Left Side: Info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 border border-gray-200">
                    <Package className="h-7 w-7 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{pkg.title}</h3>
                    <p className="text-xs text-gray-500">{pkg.desc}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pkg.id}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Weight and Barcode */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-gray-50 pt-4 sm:border-none sm:pt-0">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 ring-1 ring-inset ring-blue-700/10">
                    {pkg.weight}
                  </span>
                  
                  <button 
                    onClick={() => handlePrint(pkg.id)}
                    className="group flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-2.5 transition-all hover:border-sky-400 hover:shadow-sm active:scale-95"
                  >
                    <BarcodeSVG className="h-10 w-24 text-black group-hover:text-sky-600" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-sky-500">
                      Print Label
                    </span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div>
            <Button className="text-white text-base bg-[#31B8FA] hover:bg-[#31B8FA]/90 h-[48px] rounded-[24px] w-full mt-10">
                Complete Delivery
            </Button>
        </div>
      </div>
    </div>
  )
}

function BarcodeSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 40" preserveAspectRatio="none">
      <rect x="0" y="0" width="100" height="40" fill="transparent" />
      {[...Array(25)].map((_, i) => (
        <rect 
          key={i} 
          x={i * 4} 
          y="5" 
          width={i % 4 === 0 ? 3 : 1} 
          height="30" 
          fill="currentColor" 
        />
      ))}
    </svg>
  )
}