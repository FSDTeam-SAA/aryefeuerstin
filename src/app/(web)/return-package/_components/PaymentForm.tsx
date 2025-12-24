"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, PackageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const paymentSchema = z.object({
  selectedPackage: z.string().min(1, "Please select a package"),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  //eslint-disable-next-line
  initialData: any
  onBack: () => void
  onSubmit: (data: PaymentFormData) => void
}

const packages = [
  {
    id: "standard",
    name: "Standard Package",
    price: "$20 / Month",
    badge: "Best Value",
    features: ["Unlimited pickups for 30 days", "Free physical return labels", "$5 fee for physical return"],
  },
  {
    id: "pay-per",
    name: "$5 Package",
    subtitle: "Pay Per Pickup",
    price: "",
    features: [
      "No Subscription Required",
      "Pay per pickup",
      "$5.50 fee for physical labels",
      "$5 fee for physical reports",
    ],
  },
  {
    id: "premium",
    name: "Premium Package",
    price: "$45/Month",
    features: ["Unlimited pickups", "Unlimited physical label printing", "Unlimited physical receipt returns"],
  },
  {
    id: "business",
    name: "Business Package",
    subtitle: "Coming Soon",
    price: "",
    features: ["Bulk 100/m option", "Weekly scheduled pickups", "Weekly scheduled pickups"],
    disabled: true,
  },
]

export function PaymentForm({ initialData, onBack, onSubmit }: PaymentFormProps) {
  const [selectedPackage, setSelectedPackage] = useState("")

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData,
  })

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
    setValue("selectedPackage", packageId)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
        <p className="text-sm text-gray-500 mt-1">Add information for each package you want to return</p>
      </div>

      {/* Package Options */}
      <div className="space-y-4">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => !pkg.disabled && handlePackageSelect(pkg.id)}
            disabled={pkg.disabled}
            className={cn(
              "w-full text-left border-2 rounded-lg p-4 transition-all",
              selectedPackage === pkg.id ? "border-[#155DFC] bg-[#EFF6FF]" : "border-gray-200 hover:border-gray-300",
              pkg.disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">
                  <PackageIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                  
                  </div>
                  {pkg.price && <p className="text-sm text-gray-600 mb-2">{pkg.price}</p>}
                  {pkg.subtitle && <p className="text-sm text-gray-500 mb-2">{pkg.subtitle}</p>}
                  <ul className="space-y-1 bg-white p-5 !routder-[40px]">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start ">
                        <Check className="w-4 h-4  mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
               {pkg.badge && (
                      <span className="bg-[#155DFC] text-white text-xs px-2 py-1 rounded-full">{pkg.badge}</span>
                    )}
            </div>
          </button>
        ))}
      </div>

      {errors.selectedPackage && <p className="text-sm text-red-500">{errors.selectedPackage.message}</p>}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-8 h-[48px]">
          Submit Request
        </Button>
      </div>
    </form>
  )
}
