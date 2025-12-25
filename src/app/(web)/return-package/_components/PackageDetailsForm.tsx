/*eslint-disable */
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import { ChevronDown, Upload, Trash2, X, PackageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Zod schema for the non-store fields
const packageDetailsSchema = z.object({
  printShippingLabel: z.boolean(),
  hasReceipt: z.boolean(),
  creditCardLast4: z.string().optional(),
  needShippingLabel: z.boolean(),
  productLength: z.string().optional(),
  productWidth: z.string().optional(),
  productHeight: z.string().optional(),
  productWeight: z.string().optional(),
  leaveMessage: z.boolean(),
  message: z.string().optional(),
})

type PackageDetailsFormData = z.infer<typeof packageDetailsSchema>

interface StoreData {
  returnStore: string
  numberOfPackages: number
  packageImages: { [key: number]: string[] }
  packageNumbers: { [key: number]: string }
}

interface PackageDetailsFormProps {
  initialData: any
  onSubmitAndProceed: (data: any) => Promise<void>
  onBack: () => void
  isSubmitting: boolean
}

export function PackageDetailsForm({
  initialData,
  onSubmitAndProceed,
  onBack,
  isSubmitting,
}: PackageDetailsFormProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    "store-0",
    "packages-0",
    "anotherStore",
  ])

  const [stores, setStores] = useState<StoreData[]>(
    initialData.stores?.length > 0
      ? initialData.stores
      : [{ returnStore: "", numberOfPackages: 1, packageImages: {}, packageNumbers: {} }]
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PackageDetailsFormData>({
    resolver: zodResolver(packageDetailsSchema),
    defaultValues: {
      printShippingLabel: initialData.printShippingLabel || false,
      hasReceipt: initialData.hasReceipt || false,
      creditCardLast4: initialData.creditCardLast4 || "",
      needShippingLabel: initialData.needShippingLabel || false,
      productLength: initialData.productLength || "",
      productWidth: initialData.productWidth || "",
      productHeight: initialData.productHeight || "",
      productWeight: initialData.productWeight || "",
      leaveMessage: initialData.leaveMessage || false,
      message: initialData.message || "",
    },
  })

  const hasReceipt = watch("hasReceipt")
  const needShippingLabel = watch("needShippingLabel")
  const leaveMessage = watch("leaveMessage")

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const addStore = () => {
    const newIndex = stores.length
    setStores([...stores, { returnStore: "", numberOfPackages: 1, packageImages: {}, packageNumbers: {} }])
    setOpenSections((prev) => [...prev, `store-${newIndex}`, `packages-${newIndex}`])
  }

  const removeStore = (index: number) => {
    if (stores.length <= 1) return
    setStores(stores.filter((_, i) => i !== index))
  }

  const updateStoreData = (index: number, field: keyof StoreData, value: any) => {
    const updated = [...stores]
    // @ts-ignore
    updated[index][field] = value
    setStores(updated)
  }

  const handleImageChange = (storeIdx: number, pkgIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Only take the first file
    const file = files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setStores((prev) => {
        const updated = [...prev]
        // Only store one image - replace if exists, add if not
        updated[storeIdx].packageImages[pkgIdx] = [reader.result as string]
        return updated
      })
    }
    reader.readAsDataURL(file)
    e.target.value = "" // reset input
  }

  const removeImage = (storeIdx: number, pkgIdx: number) => {
    setStores((prev) => {
      const updated = [...prev]
      // Clear the image array for this package
      updated[storeIdx].packageImages[pkgIdx] = []
      return updated
    })
  }

  const clearImage = (storeIdx: number, pkgIdx: number) => {
    removeImage(storeIdx, pkgIdx)
  }

  return (
    <form onSubmit={handleSubmit((data) => onSubmitAndProceed({ ...data, stores }))} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add information for each package you want to return
        </p>
      </div>

      {stores.map((store, storeIndex) => (
        <div key={storeIndex} className="space-y-4">
          {storeIndex > 0 && (
            <div className="flex justify-between items-center bg-cyan-50 p-2 rounded-md">
              <span className="text-sm font-bold text-cyan-700 uppercase">
                Additional Store Return #{storeIndex + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStore(storeIndex)}
                className="text-[#FF4928] h-8"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
          )}

          {/* Return Store Selection */}
          <Collapsible
            open={openSections.includes(`store-${storeIndex}`)}
            onOpenChange={() => toggleSection(`store-${storeIndex}`)}
            className="bg-[#F8FAFC] p-4 rounded-lg border"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <PackageIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Select the return store for your item</span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    openSections.includes(`store-${storeIndex}`) && "rotate-180"
                  )}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-2">
              <Select
                onValueChange={(value) => updateStoreData(storeIndex, "returnStore", value)}
                value={store.returnStore}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Please select a store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMAZON">AMAZON</SelectItem>
                  <SelectItem value="STAPLES">STAPLES</SelectItem>
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          {/* Number of Packages + Package Details */}
          <Collapsible
            open={openSections.includes(`packages-${storeIndex}`)}
            onOpenChange={() => toggleSection(`packages-${storeIndex}`)}
            className="bg-[#F8FAFC] p-4 rounded-lg border"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <PackageIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Number of Packages</span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    openSections.includes(`packages-${storeIndex}`) && "rotate-180"
                  )}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-2">
              <p className="text-sm text-gray-600 mb-3">
                How many packages are you returning to this store?
              </p>
              <Select
                onValueChange={(value) =>
                  updateStoreData(storeIndex, "numberOfPackages", parseInt(value))
                }
                value={store.numberOfPackages.toString()}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-6 space-y-4">
                {Array.from({ length: store.numberOfPackages }).map((_, pkgIndex) => (
                  <div key={pkgIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">
                          {pkgIndex + 1}
                        </div>
                        <span className="font-medium text-gray-900">
                          Package {pkgIndex + 1}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Package Number / Tracking Number</Label>
                        <Input
                          placeholder="e.g. PKG-001"
                          className="mt-1"
                          value={store.packageNumbers[pkgIndex] || ""}
                          onChange={(e) => {
                            const updated = { ...store.packageNumbers, [pkgIndex]: e.target.value }
                            updateStoreData(storeIndex, "packageNumbers", updated)
                          }}
                        />
                      </div>

                      <div>
                        <Label>Barcode / Label Images (optional)</Label>
                        <div className="mt-1">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`img-${storeIndex}-${pkgIndex}`}
                            onChange={(e) => handleImageChange(storeIndex, pkgIndex, e)}
                          />

                          {store.packageImages[pkgIndex] && store.packageImages[pkgIndex].length > 0 ? (
                            <div className="space-y-3">
                              {/* Single Image Preview */}
                              <div className="relative">
                                <img
                                  src={store.packageImages[pkgIndex][0]}
                                  alt="barcode"
                                  className="w-full h-48 object-contain rounded-lg border bg-gray-50"
                                />
                                <button
                                  type="button"
                                  onClick={() => clearImage(storeIndex, pkgIndex)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                                  title="Remove image"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Replace Image Button */}
                              <label
                                htmlFor={`img-${storeIndex}-${pkgIndex}`}
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Replace Image
                              </label>
                            </div>
                          ) : (
                            /* Upload Area (No Image Yet) */
                            <label
                              htmlFor={`img-${storeIndex}-${pkgIndex}`}
                              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400 transition-colors"
                            >
                              <Upload className="w-10 h-10 text-gray-400 mb-3" />
                              <p className="text-sm text-gray-600">Click to upload barcode image</p>
                              <p className="text-xs text-gray-500 mt-1">(Only one image allowed)</p>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}

      {/* Add Another Store */}
      <Collapsible
        open={openSections.includes("anotherStore")}
        onOpenChange={() => toggleSection("anotherStore")}
        className="bg-[#F8FAFC] p-4 rounded-lg border"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Add Another Store</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("anotherStore") && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <p className="text-sm text-gray-600 mb-3">
            Are you returning packages to another store?
          </p>
          <RadioGroup
            onValueChange={(v) => {
              if (v === "yes") addStore()
            }}
            defaultValue="no"
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="as-yes" />
                <Label htmlFor="as-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="as-no" />
                <Label htmlFor="as-no">No</Label>
              </div>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Physical Return Label */}
      <Collapsible
        open={openSections.includes("shippingLabel")}
        onOpenChange={() => toggleSection("shippingLabel")}
        className="bg-[#F8FAFC] p-4 rounded-lg border"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Does your package require a physical return label?
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("shippingLabel") && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <p className="text-sm text-gray-600 font-medium mb-3">
            Note: <span className="text-[#FF4928]">Additional fee: $3.50 (applies to pay-per-package and standard accounts).</span>
          </p>
          <RadioGroup onValueChange={(v) => setValue("printShippingLabel", v === "yes")} defaultValue="no">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="psl-yes" />
                <Label htmlFor="psl-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="psl-no" />
                <Label htmlFor="psl-no">No</Label>
              </div>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Physical Receipt */}
      <Collapsible
        open={openSections.includes("receipt")}
        onOpenChange={() => toggleSection("receipt")}
        className="bg-[#F8FAFC] p-4 rounded-lg border"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Does your return require a physical receipt?
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("receipt") && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">

          <RadioGroup onValueChange={(v) => setValue("hasReceipt", v === "yes")} defaultValue="no">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="r-yes" />
                <Label htmlFor="r-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="r-no" />
                <Label htmlFor="r-no">No</Label>
              </div>
            </div>
          </RadioGroup>

          {hasReceipt && (
            <div className="mt-4">
              <Label htmlFor="creditCardLast4">Last 4 digits of credit card used for purchase</Label>
              <Input
                id="creditCardLast4"
                placeholder="4242"
                maxLength={4}
                className="mt-1 bg-white w-full"
                {...register("creditCardLast4")}
              />
              <div className="pt-5">
                <p className="text-sm text-gray-600 font-medium mb-3">
                  Note: <span className="text-[#FF4928]">Additional fee: $8.00 (applies to pay-per-package and standard accounts).</span>
                </p>
                <p className="text-sm text-[#FF4928]">*Returns to stores that require a physical receipt can only be processed if the item was purchased using a credit card</p>
                <p className="text-sm text-[#FF4928]">*Please provide the last four digits of the credit card used for the purchase.</p>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Return Shipping Label (Dimensions) */}
      <Collapsible
        open={openSections.includes("returnShipping")}
        onOpenChange={() => toggleSection("returnShipping")}
        className="bg-[#F8FAFC] p-4 rounded-lg border"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Need a return shipping label?</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("returnShipping") && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <RadioGroup onValueChange={(v) => setValue("needShippingLabel", v === "yes")} defaultValue="no">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="rsl-yes" />
                <Label htmlFor="rsl-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="rsl-no" />
                <Label htmlFor="rsl-no">No</Label>
              </div>
            </div>
          </RadioGroup>

          {needShippingLabel && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Length (inches)</Label>
                <Input type="number" {...register("productLength")} placeholder="30" />
              </div>
              <div>
                <Label>Width (inches)</Label>
                <Input type="number" {...register("productWidth")} placeholder="20" />
              </div>
              <div>
                <Label>Height (inches)</Label>
                <Input type="number" {...register("productHeight")} placeholder="15" />
              </div>
              <div>
                <Label>Weight (lbs)</Label>
                <Input type="number" {...register("productWeight")} placeholder="3" />
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Message Note */}
      <Collapsible
        open={openSections.includes("message")}
        onOpenChange={() => toggleSection("message")}
        className="bg-[#F8FAFC] p-4 rounded-lg border"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Leave a message/note?</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("message") && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <RadioGroup onValueChange={(v) => setValue("leaveMessage", v === "yes")} defaultValue="no">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="m-yes" />
                <Label htmlFor="m-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="m-no" />
                <Label htmlFor="m-no">No</Label>
              </div>
            </div>
          </RadioGroup>

          {leaveMessage && (
            <div className="mt-4">
              <Label>Message / Note</Label>
              <Textarea
                rows={4}
                placeholder="e.g. Handle with care, fragile items"
                className="mt-1"
                {...register("message")}
              />
              <p className="text-xs text-[#FF4928] mt-2">
                Note : “Add extra $8 fot basic and standard package”
              </p>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between pt-8 border-t">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-10 h-12"
        >
          {isSubmitting ? "Submit Request..." : "Submit Request"}
        </Button>
      </div>
    </form>
  )
}