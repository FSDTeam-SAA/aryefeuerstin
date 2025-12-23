
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
import { ChevronDown, Upload, Trash2, X, Package2Icon, PackageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const packageDetailsSchema = z.object({
  addAnotherStore: z.boolean(),
  printShippingLabel: z.boolean(),
  hasReceipt: z.boolean(),
  creditCardLast4: z.string().optional(),
  needShippingLabel: z.boolean(),
  pickupAddress2: z.string().optional(),
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
  onNext: (data: any) => void
  onBack: () => void
}

export function PackageDetailsForm({ initialData, onNext, onBack }: PackageDetailsFormProps) {
  const [openSections, setOpenSections] = useState<string[]>(["store-0", "packages-0", "anotherStore"])
  
  const [stores, setStores] = useState<StoreData[]>([
    { returnStore: "", numberOfPackages: 1, packageImages: {}, packageNumbers: {} }
  ])

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PackageDetailsFormData>({
    resolver: zodResolver(packageDetailsSchema),
    defaultValues: {
      ...initialData,
      addAnotherStore: false,
      printShippingLabel: false,
      hasReceipt: false,
      needShippingLabel: false,
      leaveMessage: false,
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
    setStores([...stores, { returnStore: "", numberOfPackages: 1, packageImages: {}, packageNumbers: {} }])
    const newIndex = stores.length
    setOpenSections(prev => [...prev, `store-${newIndex}`, `packages-${newIndex}`])
  }

  const removeStore = (index: number) => {
    if (stores.length <= 1) return
    setStores(stores.filter((_, i) => i !== index))
  }

  const updateStoreData = (index: number, field: keyof StoreData, value: any) => {
    const updated = [...stores]
    updated[index] = { ...updated[index], [field]: value }
    setStores(updated)
  }

  const handleImageChange = (storeIdx: number, pkgIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setStores((prev) => {
          const updated = [...prev]
          const currentImages = updated[storeIdx].packageImages[pkgIdx] || []
          updated[storeIdx].packageImages[pkgIdx] = [...currentImages, reader.result as string]
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ""
  }

  const removeImage = (storeIdx: number, pkgIdx: number, imgIdx: number) => {
    setStores((prev) => {
      const updated = [...prev]
      updated[storeIdx].packageImages[pkgIdx] = updated[storeIdx].packageImages[pkgIdx].filter((_, i) => i !== imgIdx)
      return updated
    })
  }

  return (
    <form onSubmit={handleSubmit((data) => onNext({ ...data, stores }))} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
        <p className="text-sm text-gray-500 mt-1">Add information for each package you want to return</p>
      </div>

      {stores.map((store, storeIndex) => (
        <div key={storeIndex} className="space-y-4">
          {storeIndex > 0 && (
            <div className="flex justify-between items-center bg-cyan-50 p-2 rounded-md">
              <span className="text-sm font-bold text-cyan-700 uppercase">Additional Store Return #{storeIndex + 1}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeStore(storeIndex)} className="text-[#FF4928] h-8">
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
          )}

          {/* Return Store Selection */}
          <Collapsible open={openSections.includes(`store-${storeIndex}`)} onOpenChange={() => toggleSection(`store-${storeIndex}`)} className="bg-[#F8FAFC] p-4 rounded-lg border">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <PackageIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Select the return store for your item</span>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", openSections.includes(`store-${storeIndex}`) && "rotate-180")} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-2">
              <Select onValueChange={(value) => updateStoreData(storeIndex, "returnStore", value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Please add Shoplee as a mother store return" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shoplee">Shoplee</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="walmart">Walmart</SelectItem>
                  <SelectItem value="target">Target</SelectItem>
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          {/* Number of Packages */}
          <Collapsible open={openSections.includes(`packages-${storeIndex}`)} onOpenChange={() => toggleSection(`packages-${storeIndex}`)} className="bg-[#F8FAFC] p-4 rounded-lg border">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <PackageIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Numbers of Packages</span>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", openSections.includes(`packages-${storeIndex}`) && "rotate-180")} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-2">
              <p className="text-sm text-gray-600 mb-3">How many packages are you returning to this store?</p>
              <Select
                onValueChange={(value) => updateStoreData(storeIndex, "numberOfPackages", parseInt(value))}
                value={store.numberOfPackages.toString()}
              >
                <SelectTrigger className="bg-white"><SelectValue placeholder="Write Here e.g. 5" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-6 space-y-4">
                {Array.from({ length: store.numberOfPackages }).map((_, pkgIndex) => (
                  <div key={pkgIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">
                          {pkgIndex + 1}
                        </div>
                        <span className="font-medium text-gray-900">Package - {pkgIndex + 1}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Package Number</Label>
                        <Input 
                           placeholder="PKG-002" 
                           className="mt-1" 
                           onChange={(e) => {
                             const updatedPkgNums = { ...store.packageNumbers, [pkgIndex]: e.target.value };
                             updateStoreData(storeIndex, "packageNumbers", updatedPkgNums);
                           }}
                        />
                      </div>
                      <div>
                        <Label>Barcode Images</Label>
                        <div className="mt-1">
                          <input type="file" accept="image/*" multiple className="hidden" id={`img-${storeIndex}-${pkgIndex}`} onChange={(e) => handleImageChange(storeIndex, pkgIndex, e)} />
                          {(!store.packageImages[pkgIndex] || store.packageImages[pkgIndex].length === 0) ? (
                            <label htmlFor={`img-${storeIndex}-${pkgIndex}`} className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400">
                              <Upload className="w-10 h-10 text-gray-400 mb-3" />
                              <p className="text-sm text-gray-600">Click to upload barcode images</p>
                            </label>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {store.packageImages[pkgIndex].map((src, i) => (
                                <div key={i} className="relative group">
                                  <img src={src} className="w-full h-32 object-cover rounded-lg border" />
                                  <button type="button" onClick={() => removeImage(storeIndex, pkgIndex, i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                                </div>
                              ))}
                              <label htmlFor={`img-${storeIndex}-${pkgIndex}`} className="flex items-center justify-center border-2 border-dashed rounded-lg h-32 cursor-pointer bg-gray-50"><Upload className="w-6 h-6 text-gray-400" /></label>
                            </div>
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
      <Collapsible open={openSections.includes("anotherStore")} onOpenChange={() => toggleSection("anotherStore")} className="bg-[#F8FAFC] p-4 rounded-lg border">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Add Another Store</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", openSections.includes("anotherStore") && "rotate-180")} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <p className="text-sm text-gray-600 mb-3">Are you returning packages to another store?</p>
          <RadioGroup onValueChange={(v) => { if (v === "yes") addStore(); setValue("addAnotherStore", v === "yes"); }} defaultValue="no">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="as-yes" /><Label htmlFor="as-yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="as-no" /><Label htmlFor="as-no">No</Label></div>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Shipping Label Section */}
      <Collapsible open={openSections.includes("shippingLabel")} onOpenChange={() => toggleSection("shippingLabel")} className="bg-[#F8FAFC] p-4 rounded-lg border">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <Package2Icon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Does your package require a physical return label?</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", openSections.includes("shippingLabel") && "rotate-180")} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <p className="text-sm text-gray-600 font-medium mb-3">Note: <span className="text-[#FF4928]">Additional fee: $3.50 (applies to pay-per-package and standard accounts)</span></p>
          <RadioGroup onValueChange={(v) => setValue("printShippingLabel", v === "yes")} defaultValue="no">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="psl-yes" /><Label htmlFor="psl-yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="psl-no" /><Label htmlFor="psl-no">No</Label></div>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Physical Receipt Section */}
      <Collapsible open={openSections.includes("receipt")} onOpenChange={() => toggleSection("receipt")} className="bg-[#F8FAFC] p-4 rounded-lg border">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Does your return require a physical receipt?</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", openSections.includes("receipt") && "rotate-180")} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <div className="text-sm text-gray-600 font-medium mb-3">
            Note: <span className="text-[#FF4928]">Note : Additional fee: $8.00 (applies to pay-per-package and standard accounts)</span>
            <div className="mt-1 text-[#FF4928] text-xs">*Returns to stores that require a physical receipt can only be processed if the item was purchased using a credit card.Please provide the last four digits of the credit card used for the purchase</div>
          </div>
          <RadioGroup onValueChange={(v) => setValue("hasReceipt", v === "yes")} defaultValue="no">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="r-yes" /><Label htmlFor="r-yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="r-no" /><Label htmlFor="r-no">No</Label></div>
            </div>
          </RadioGroup>
          {hasReceipt && (
            <div className="mt-4"><Label>Last 4 digits of credit card</Label><Input placeholder="1234" maxLength={4} className="mt-1 bg-white" {...register("creditCardLast4")} /></div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Message System Section */}
      <Collapsible open={openSections.includes("message")} onOpenChange={() => toggleSection("message")} className="bg-[#F8FAFC] p-4 rounded-lg border">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Message System</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", openSections.includes("message") && "rotate-180")} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <p className="text-sm text-gray-600 mb-3">Do you want to leave a message?</p>
          <RadioGroup onValueChange={(v) => setValue("leaveMessage", v === "yes")} defaultValue="no">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="m-yes" /><Label htmlFor="m-yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="m-no" /><Label htmlFor="m-no">No</Label></div>
            </div>
          </RadioGroup>
          {leaveMessage && (
            <div className="mt-4 space-y-3">
              <Textarea placeholder="Write Here ...." rows={4} className="bg-white" {...register("message")} />
              <p className="text-xs font-medium text-gray-600">Note: <span className="text-[#FF4928]">"Add extra $8 for basic and standard package"</span></p>
              <Button type="button" className="bg-[#31B8FA] text-white hover:bg-cyan-600 h-9">Send</Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-col md:flex-row gap-y-3 justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit" className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-8 h-[48px]">
          Continue to Summary
        </Button>
      </div>
    </form>
  )
}