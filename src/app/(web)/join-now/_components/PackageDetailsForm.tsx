// "use client"

// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { ChevronDown, Upload, Trash2 } from "lucide-react"
// import { cn } from "@/lib/utils"

// const packageDetailsSchema = z.object({
//   returnStore: z.string().min(1, "Please select a return store"),
//   numberOfPackages: z.number().min(1).max(5),
//   addAnotherStore: z.boolean(),
//   printShippingLabel: z.boolean(),
//   hasReceipt: z.boolean(),
//   creditCardLast4: z.string().optional(),
//   needShippingLabel: z.boolean(),
//   pickupAddress2: z.string().optional(),
//   productLength: z.string().optional(),
//   productWidth: z.string().optional(),
//   productHeight: z.string().optional(),
//   productWeight: z.string().optional(),
//   leaveMessage: z.boolean(),
//   message: z.string().optional(),
// })

// type PackageDetailsFormData = z.infer<typeof packageDetailsSchema>

// interface PackageDetailsFormProps {
//   initialData: any
//   onNext: (data: PackageDetailsFormData) => void
//   onBack: () => void
// }

// export function PackageDetailsForm({ initialData, onNext, onBack }: PackageDetailsFormProps) {
//   const [openSections, setOpenSections] = useState<string[]>(["store", "packages"])
//   const [numberOfPackages, setNumberOfPackages] = useState(1)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<PackageDetailsFormData>({
//     resolver: zodResolver(packageDetailsSchema),
//     defaultValues: {
//       ...initialData,
//       numberOfPackages: 1,
//       addAnotherStore: false,
//       printShippingLabel: false,
//       hasReceipt: false,
//       needShippingLabel: false,
//       leaveMessage: false,
//     },
//   })

//   const addAnotherStore = watch("addAnotherStore")
//   const printShippingLabel = watch("printShippingLabel")
//   const hasReceipt = watch("hasReceipt")
//   const needShippingLabel = watch("needShippingLabel")
//   const leaveMessage = watch("leaveMessage")

//   const toggleSection = (section: string) => {
//     setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
//   }

//   return (
//     <form onSubmit={handleSubmit(onNext)} className="space-y-6">
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
//         <p className="text-sm text-gray-500 mt-1">Add information for each package you want to return</p>
//       </div>

//       {/* Return Store Selection */}
//       <Collapsible open={openSections.includes("store")} onOpenChange={() => toggleSection("store")}>
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               </div>
//               <span className="font-medium text-gray-900">Select the return store for your item</span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("store") && "rotate-180",
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4">
//           <Select onValueChange={(value) => setValue("returnStore", value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Please add Shoplee as a mother store return" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="shoplee">Shoplee</SelectItem>
//               <SelectItem value="amazon">Amazon</SelectItem>
//               <SelectItem value="walmart">Walmart</SelectItem>
//               <SelectItem value="target">Target</SelectItem>
//             </SelectContent>
//           </Select>
//           {errors.returnStore && <p className="text-sm text-red-500 mt-2">{errors.returnStore.message}</p>}
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Number of Packages */}
//       <Collapsible open={openSections.includes("packages")} onOpenChange={() => toggleSection("packages")}>
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               </div>
//               <span className="font-medium text-gray-900">Numbers of Packages</span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("packages") && "rotate-180",
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4">
//           <p className="text-sm text-gray-600 mb-3">How many packages are you returning to this store?</p>
//           <Select
//             onValueChange={(value) => {
//               const num = Number.parseInt(value)
//               setNumberOfPackages(num)
//               setValue("numberOfPackages", num)
//             }}
//             defaultValue="1"
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Write Here e.g. 5" />
//             </SelectTrigger>
//             <SelectContent>
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <SelectItem key={num} value={num.toString()}>
//                   {num}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Package Items */}
//           <div className="mt-6 space-y-4">
//             {Array.from({ length: numberOfPackages }).map((_, index) => (
//               <div key={index} className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
//                     <PackageIcon className="w-5 h-5 text-gray-600" />
//                     </div>
//                     <span className="font-medium text-gray-900">Package -{index + 1}</span>
//                   </div>
//                   {index > 0 && (
//                     <Button type="button" variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor={`package-${index}-number`}>Package Number</Label>
//                     <Input id={`package-${index}-number`} placeholder="PKG-002" className="mt-1" />
//                   </div>

//                   <div>
//                     <Label htmlFor={`package-${index}-barcode`}>Barcode Images</Label>
//                     <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-cyan-400 transition-colors cursor-pointer">
//                       <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
//                       <p className="text-sm text-gray-600">Upload barcode images</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Add Another Store */}
//       <Collapsible open={openSections.includes("anotherStore")} onOpenChange={() => toggleSection("anotherStore")}>
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               </div>
//               <span className="font-medium text-gray-900">Add Another Store</span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("anotherStore") && "rotate-180",
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4">
//           <p className="text-sm text-gray-600 mb-3">Are you returning packages to another store?</p>
//           <RadioGroup onValueChange={(value) => setValue("addAnotherStore", value === "yes")} defaultValue="no">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" id="anotherStore-yes" />
//                 <Label htmlFor="anotherStore-yes" className="cursor-pointer">
//                   Yes
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" id="anotherStore-no" />
//                 <Label htmlFor="anotherStore-no" className="cursor-pointer">
//                   No
//                 </Label>
//               </div>
//             </div>
//           </RadioGroup>
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Request Shipping Label */}
//       <Collapsible open={openSections.includes("shippingLabel")} onOpenChange={() => toggleSection("shippingLabel")}>
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               </div>
//               <span className="font-medium text-gray-900">Request to print shipping label</span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-colors",
//                 openSections.includes("shippingLabel") && "rotate-180",
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4">
//           <p className="text-sm text-red-500 font-medium mb-3">
//             Note: <span className="text-gray-600">If Yes add extra $3.50</span>
//           </p>
//           <RadioGroup onValueChange={(value) => setValue("printShippingLabel", value === "yes")} defaultValue="no">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" id="printLabel-yes" />
//                 <Label htmlFor="printLabel-yes" className="cursor-pointer">
//                   Yes
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" id="printLabel-no" />
//                 <Label htmlFor="printLabel-no" className="cursor-pointer">
//                   No
//                 </Label>
//               </div>
//             </div>
//           </RadioGroup>
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Package with Receipt */}
//       <Collapsible open={openSections.includes("receipt")} onOpenChange={() => toggleSection("receipt")}>
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               </div>
//               <span className="font-medium text-gray-900">Are you having a package with a receipt?</span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("receipt") && "rotate-180",
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4">
//           <p className="text-sm text-red-500 font-medium mb-3">
//             Note:{" "}
//             <span className="text-gray-600">
//               $$ for basic and standard package. Returns to stores that require a physical receipt can only be made with
//               a credit card if the item was purchased with a credit card
//             </span>
//           </p>
//           <RadioGroup onValueChange={(value) => setValue("hasReceipt", value === "yes")} defaultValue="no">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" id="receipt-yes" />
//                 <Label htmlFor="receipt-yes" className="cursor-pointer">
//                   Yes
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" id="receipt-no" />
//                 <Label htmlFor="receipt-no" className="cursor-pointer">
//                   No
//                 </Label>
//               </div>
//             </div>
//           </RadioGroup>

//           {hasReceipt && (
//             <div className="mt-4">
//               <Label htmlFor="creditCard">Enter last 4 digits of your credit card</Label>
//               <Input
//                 id="creditCard"
//                 placeholder="1234"
//                 maxLength={4}
//                 className="mt-1"
//                 {...register("creditCardLast4")}
//               />
//             </div>
//           )}
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Create Shipping Label */}
//       <Collapsible open={openSections.includes("createLabel")} onOpenChange={() => toggleSection("createLabel")}>
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               </div>
//               <span className="font-medium text-gray-900">Need us to create a shipping label?</span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("createLabel") && "rotate-180",
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4">
//           <p className="text-sm text-red-500 font-medium mb-3">
//             Note: <span className="text-gray-600">If Yes add extra $3.50</span>
//           </p>
//           <RadioGroup onValueChange={(value) => setValue("needShippingLabel", value === "yes")} defaultValue="no">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" id="needLabel-yes" />
//                 <Label htmlFor="needLabel-yes" className="cursor-pointer">
//                   Yes
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" id="needLabel-no" />
//                 <Label htmlFor="needLabel-no" className="cursor-pointer">
//                   No
//                 </Label>
//               </div>
//             </div>
//           </RadioGroup>

//           {needShippingLabel && (
//             <div className="mt-4 space-y-4">
//               <div>
//                 <Label htmlFor="pickupAddress2">Enter the pickup and return address</Label>
//                 <Input id="pickupAddress2" placeholder="Address" className="mt-1" {...register("pickupAddress2")} />
//               </div>

//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 <div>
//                   <Input placeholder="enter product length" {...register("productLength")} />
//                 </div>
//                 <div>
//                   <Input placeholder="enter product width" {...register("productWidth")} />
//                 </div>
//                 <div>
//                   <Input placeholder="enter product height" {...register("productHeight")} />
//                 </div>
//                 <div>
//                   <Input placeholder="enter product weight" {...register("productWeight")} />
//                 </div>
//               </div>
//             </div>
//           )}
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Message System */}
//       <Collapsible open={openSections.includes("message")} onOpenChange={() => toggleSection("message")}>
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               </div>
//               <span className="font-medium text-gray-900">Message System</span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("message") && "rotate-180",
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4">
//           <p className="text-sm text-gray-600 mb-3">Do you want to leave a message?</p>
//           <RadioGroup onValueChange={(value) => setValue("leaveMessage", value === "yes")} defaultValue="no">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" id="message-yes" />
//                 <Label htmlFor="message-yes" className="cursor-pointer">
//                   Yes
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" id="message-no" />
//                 <Label htmlFor="message-no" className="cursor-pointer">
//                   No
//                 </Label>
//               </div>
//             </div>
//           </RadioGroup>

//           {leaveMessage && (
//             <div className="mt-4">
//               <Label htmlFor="message">Optional notes box</Label>
//               <Textarea id="message" placeholder="Write Here ...." rows={4} className="mt-1" {...register("message")} />
//               <p className="text-sm text-red-500 mt-2">
//                 Note: <span className="text-gray-600">Add price for 50 header, and scheduled package</span>
//               </p>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 className="mt-2  text-white hover:bg-cyan-600"
//               >
//                 Send
//               </Button>
//             </div>
//           )}
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Action Buttons */}
//       <div className="flex justify-between pt-6">
//         <Button type="button" variant="outline" onClick={onBack}>
//           Back
//         </Button>
//         <Button type="submit" className=" hover:bg-cyan-600 text-white px-8">
//           Continue to Package Details
//         </Button>
//       </div>
//     </form>
//   )
// }



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
  returnStore: z.string().min(1, "Please select a return store"),
  numberOfPackages: z.number().min(1).max(5),
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

interface PackageDetailsFormProps {
  
  initialData: any
  onNext: (data: PackageDetailsFormData) => void
  onBack: () => void
}

export function PackageDetailsForm({ initialData, onNext, onBack }: PackageDetailsFormProps) {
  const [openSections, setOpenSections] = useState<string[]>(["store", "packages"])
  const [numberOfPackages, setNumberOfPackages] = useState(1)

  // State to hold images for each package: array of File[] and preview URLs
  const [packageImages, setPackageImages] = useState<{ [key: number]: string[] }>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PackageDetailsFormData>({
    resolver: zodResolver(packageDetailsSchema),
    defaultValues: {
      ...initialData,
      numberOfPackages: 1,
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

  // Handle image selection
  const handleImageChange = (packageIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPreviewUrls: string[] = []

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPackageImages((prev) => ({
          ...prev,
          [packageIndex]: [...(prev[packageIndex] || []), reader.result as string],
        }))
      }
      reader.readAsDataURL(file)
    })

    // Reset input so same file can be selected again
    e.target.value = ""
  }

  // Remove specific image
  const removeImage = (packageIndex: number, imageIndex: number) => {
    setPackageImages((prev) => ({
      ...prev,
      [packageIndex]: prev[packageIndex]?.filter((_, i) => i !== imageIndex) || [],
    }))
  }

  // Remove entire package (when trash icon clicked on package header, if >1 package)
  const removePackage = (packageIndex: number) => {
    if (numberOfPackages <= 1) return

    setNumberOfPackages((prev) => prev - 1)
    setValue("numberOfPackages", numberOfPackages - 1)

    // Remove images for this package
    setPackageImages((prev) => {
      const updated = { ...prev }
      delete updated[packageIndex]
      // Reindex remaining packages if needed (optional, but clean)
      const reordered: { [key: number]: string[] } = {}
      Object.keys(updated).forEach((key, idx) => {
        if (parseInt(key) > packageIndex) {
          reordered[idx] = updated[parseInt(key)]
        } else if (parseInt(key) < packageIndex) {
          reordered[parseInt(key)] = updated[parseInt(key)]
        }
      })
      return reordered
    })
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
        <p className="text-sm text-gray-500 mt-1">Add information for each package you want to return</p>
      </div>

      {/* Return Store Selection */}
      <Collapsible open={openSections.includes("store")} onOpenChange={() => toggleSection("store")}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Select the return store for your item</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("store") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <Select onValueChange={(value) => setValue("returnStore", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Please add Shoplee as a mother store return" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shoplee">Shoplee</SelectItem>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="walmart">Walmart</SelectItem>
              <SelectItem value="target">Target</SelectItem>
            </SelectContent>
          </Select>
          {errors.returnStore && <p className="text-sm text-red-500 mt-2">{errors.returnStore.message}</p>}
        </CollapsibleContent>
      </Collapsible>

      {/* Number of Packages */}
      <Collapsible open={openSections.includes("packages")} onOpenChange={() => toggleSection("packages")}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Numbers of Packages</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("packages") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <p className="text-sm text-gray-600 mb-3">How many packages are you returning to this store?</p>
          <Select
            onValueChange={(value) => {
              const num = Number.parseInt(value)
              setNumberOfPackages(num)
              setValue("numberOfPackages", num)
            }}
            value={numberOfPackages.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Write Here e.g. 5" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Package Items */}
          <div className="mt-6 space-y-4">
            {Array.from({ length: numberOfPackages }).map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">Package - {index + 1}</span>
                  </div>
                  {numberOfPackages > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => removePackage(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`package-${index}-number`}>Package Number</Label>
                    <Input id={`package-${index}-number`} placeholder="PKG-002" className="mt-1" />
                  </div>

                  <div>
                    <Label>Barcode Images</Label>
                    <div className="mt-1">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id={`barcode-upload-${index}`}
                        onChange={(e) => handleImageChange(index, e)}
                      />

                      {/* Upload area or image previews */}
                      {(!packageImages[index] || packageImages[index].length === 0) ? (
                        <label
                          htmlFor={`barcode-upload-${index}`}
                          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer"
                        >
                          <Upload className="w-10 h-10 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600">Click to upload barcode images</p>
                          <p className="text-xs text-gray-500 mt-1">Supports multiple images</p>
                        </label>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {packageImages[index].map((src, imgIndex) => (
                            <div key={imgIndex} className="relative group">
                              <img
                                src={src}
                                alt={`Barcode ${imgIndex + 1}`}
                                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, imgIndex)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <label
                            htmlFor={`barcode-upload-${index}`}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-48 hover:border-cyan-400 transition-colors cursor-pointer bg-gray-50"
                          >
                            <Upload className="w-8 h-8 text-gray-400" />
                            <p className="text-xs text-gray-600 mt-2">Add more</p>
                          </label>
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

      {/* Rest of the sections remain unchanged */}
      {/* Add Another Store */}
      <Collapsible open={openSections.includes("anotherStore")} onOpenChange={() => toggleSection("anotherStore")}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Add Another Store</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("anotherStore") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <p className="text-sm text-gray-600 mb-3">Are you returning packages to another store?</p>
          <RadioGroup onValueChange={(value) => setValue("addAnotherStore", value === "yes")} defaultValue="no">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="anotherStore-yes" />
                <Label htmlFor="anotherStore-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="anotherStore-no" />
                <Label htmlFor="anotherStore-no" className="cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Request Shipping Label */}
      <Collapsible open={openSections.includes("shippingLabel")} onOpenChange={() => toggleSection("shippingLabel")}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
              <Package2Icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Request to print shipping label</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("shippingLabel") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <p className="text-sm text-red-500 font-medium mb-3">
            Note: <span className="text-gray-600">If Yes add extra $3.50</span>
          </p>
          <RadioGroup onValueChange={(value) => setValue("printShippingLabel", value === "yes")} defaultValue="no">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="printLabel-yes" />
                <Label htmlFor="printLabel-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="printLabel-no" />
                <Label htmlFor="printLabel-no" className="cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Package with Receipt */}
      <Collapsible open={openSections.includes("receipt")} onOpenChange={() => toggleSection("receipt")}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Are you having a package with a receipt?</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("receipt") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <p className="text-sm text-red-500 font-medium mb-3">
            Note: <span className="text-gray-600">
              $$ for basic and standard package. Returns to stores that require a physical receipt can only be made with
              a credit card if the item was purchased with a credit card
            </span>
          </p>
          <RadioGroup onValueChange={(value) => setValue("hasReceipt", value === "yes")} defaultValue="no">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="receipt-yes" />
                <Label htmlFor="receipt-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="receipt-no" />
                <Label htmlFor="receipt-no" className="cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>

          {hasReceipt && (
            <div className="mt-4">
              <Label htmlFor="creditCard">Enter last 4 digits of your credit card</Label>
              <Input
                id="creditCard"
                placeholder="1234"
                maxLength={4}
                className="mt-1"
                {...register("creditCardLast4")}
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Create Shipping Label */}
      <Collapsible open={openSections.includes("createLabel")} onOpenChange={() => toggleSection("createLabel")}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Need us to create a shipping label?</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("createLabel") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <p className="text-sm text-red-500 font-medium mb-3">
            Note: <span className="text-gray-600">If Yes add extra $3.50</span>
          </p>
          <RadioGroup onValueChange={(value) => setValue("needShippingLabel", value === "yes")} defaultValue="no">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="needLabel-yes" />
                <Label htmlFor="needLabel-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="needLabel-no" />
                <Label htmlFor="needLabel-no" className="cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>

          {needShippingLabel && (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="pickupAddress2">Enter the pickup and return address</Label>
                <Input id="pickupAddress2" placeholder="Address" className="mt-1" {...register("pickupAddress2")} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Input placeholder="enter product length" {...register("productLength")} />
                </div>
                <div>
                  <Input placeholder="enter product width" {...register("productWidth")} />
                </div>
                <div>
                  <Input placeholder="enter product height" {...register("productHeight")} />
                </div>
                <div>
                  <Input placeholder="enter product weight" {...register("productWeight")} />
                </div>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Message System */}
      <Collapsible open={openSections.includes("message")} onOpenChange={() => toggleSection("message")}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full  text-white flex items-center justify-center text-sm">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Message System</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("message") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <p className="text-sm text-gray-600 mb-3">Do you want to leave a message?</p>
          <RadioGroup onValueChange={(value) => setValue("leaveMessage", value === "yes")} defaultValue="no">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="message-yes" />
                <Label htmlFor="message-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="message-no" />
                <Label htmlFor="message-no" className="cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>

          {leaveMessage && (
            <div className="mt-4">
              <Label htmlFor="message">Optional notes box</Label>
              <Textarea id="message" placeholder="Write Here ...." rows={4} className="mt-1" {...register("message")} />
              <p className="text-sm text-red-500 mt-2">
                Note: <span className="text-gray-600">Add price for 50 header, and scheduled package</span>
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2  text-white hover:bg-cyan-600"
              >
                Send
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-y-3 justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-8 h-[48px]">
          Continue to Package Details
        </Button>
      </div>
    </form>
  )
}