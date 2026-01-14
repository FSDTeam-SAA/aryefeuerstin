// /* eslint-disable */
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"

// import {
//   ChevronDown,
//   Upload,
//   Trash2,
//   X,
//   Package as PackageIcon,
//   FileText,
// } from "lucide-react"
// import { cn } from "@/lib/utils"

// const packageDetailsSchema = z.object({
//   printShippingLabel: z.boolean(),
//   hasReceipt: z.boolean(),
//   creditCardLast4: z.string().optional(),
//   needShippingLabel: z.boolean(),
//   productLength: z.string().optional(),
//   productWidth: z.string().optional(),
//   productHeight: z.string().optional(),
//   productWeight: z.string().optional(),
//   leaveMessage: z.boolean(),
//   message: z.string().optional(),
// })

// type PackageDetailsFormData = z.infer<typeof packageDetailsSchema>

// interface StoreData {
//   returnStore: string
//   otherStoreName?: string
//   numberOfPackages: number
//   packageImages: { [key: number]: string[] }
//   packageNumbers: { [key: number]: string }
// }

// interface PackageDetailsFormProps {
//   initialData: any
//   onSubmitAndProceed: (data: any) => Promise<void>
//   onBack: () => void
//   isSubmitting: boolean
// }

// export function PackageDetailsForm({
//   initialData,
//   onSubmitAndProceed,
//   onBack,
//   isSubmitting,
// }: PackageDetailsFormProps) {
//   const [openSections, setOpenSections] = useState<string[]>([
//     "store-0",
//     "packages-0",
//     "anotherStore",
//     "shippingLabel",
//   ])

//   const [stores, setStores] = useState<StoreData[]>(
//     initialData.stores?.length > 0
//       ? initialData.stores.map((s: any) => ({
//           returnStore: s.returnStore || "",
//           otherStoreName: s.otherStoreName || "",
//           numberOfPackages: s.numberOfPackages || 1,
//           packageImages: s.packageImages || {},
//           packageNumbers: s.packageNumbers || {},
//         }))
//       : [{ returnStore: "", numberOfPackages: 1, packageImages: {}, packageNumbers: {} }]
//   )

//   const [physicalReturnLabelFiles, setPhysicalReturnLabelFiles] = useState<
//     { file: File; preview?: string }[]
//   >(initialData.physicalReturnLabelFiles || [])

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//   } = useForm<PackageDetailsFormData>({
//     resolver: zodResolver(packageDetailsSchema),
//     defaultValues: {
//       printShippingLabel: initialData.printShippingLabel || false,
//       hasReceipt: initialData.hasReceipt || false,
//       creditCardLast4: initialData.creditCardLast4 || "",
//       needShippingLabel: initialData.needShippingLabel || false,
//       productLength: initialData.productLength || "",
//       productWidth: initialData.productWidth || "",
//       productHeight: initialData.productHeight || "",
//       productWeight: initialData.productWeight || "",
//       leaveMessage: initialData.leaveMessage || false,
//       message: initialData.message || "",
//     },
//   })

//   const printShippingLabel = watch("printShippingLabel")
//   const hasReceipt = watch("hasReceipt")
//   const leaveMessage = watch("leaveMessage")

//   const toggleSection = (section: string) => {
//     setOpenSections((prev) =>
//       prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
//     )
//   }

//   const addStore = () => {
//     const newIndex = stores.length
//     setStores([
//       ...stores,
//       { returnStore: "", numberOfPackages: 1, packageImages: {}, packageNumbers: {} },  
//     ])
//     setOpenSections((prev) => [...prev, `store-${newIndex}`, `packages-${newIndex}`])
//   }

//   const removeStore = (index: number) => {
//     if (stores.length <= 1) return
//     setStores(stores.filter((_, i) => i !== index))
//   }

//   const updateStoreData = (index: number, field: keyof StoreData, value: any) => {
//     setStores((prev) => {
//       const updated = [...prev]
//       // @ts-ignore
//       updated[index][field] = value
//       return updated
//     })
//   }

//   const handleImageChange = (
//     storeIdx: number,
//     pkgIdx: number,
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const files = e.target.files
//     if (!files || files.length === 0) return

//     const file = files[0]
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       setStores((prev) => {
//         const updated = [...prev]
//         updated[storeIdx].packageImages[pkgIdx] = [reader.result as string]
//         return updated
//       })
//     }
//     reader.readAsDataURL(file)
//     e.target.value = ""
//   }

//   const removeImage = (storeIdx: number, pkgIdx: number) => {
//     setStores((prev) => {
//       const updated = [...prev]
//       updated[storeIdx].packageImages[pkgIdx] = []
//       return updated
//     })
//   }

//   const handlePhysicalLabelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (!files) return

//     const newFiles = Array.from(files).map((file) => ({
//       file,
//       preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
//     }))

//     setPhysicalReturnLabelFiles((prev) => [...prev, ...newFiles])
//     e.target.value = ""
//   }

//   const removePhysicalLabelFile = (index: number) => {
//     setPhysicalReturnLabelFiles((prev) => {
//       if (prev[index]?.preview) URL.revokeObjectURL(prev[index].preview!)
//       return prev.filter((_, i) => i !== index)
//     })
//   }

//   return (
//     <form
//       onSubmit={handleSubmit((data) =>
//         onSubmitAndProceed({ ...data, stores, physicalReturnLabelFiles })
//       )}
//       className="space-y-6"
//     >
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Add information for each package you want to return
//         </p>
//       </div>

//       {stores.map((store, storeIndex) => (
//         <div key={storeIndex} className="space-y-4">
//           {storeIndex > 0 && (
//             <div className="flex justify-between items-center bg-cyan-50 p-2 rounded-md">
//               <span className="text-sm font-bold text-cyan-700 uppercase">
//                 Additional Store Return #{storeIndex + 1}
//               </span>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => removeStore(storeIndex)}
//                 className="text-[#FF4928] h-8"
//               >
//                 <Trash2 className="w-4 h-4 mr-1" /> Remove
//               </Button>
//             </div>
//           )}

//           {/* Store Selection Collapsible */}
//           <Collapsible
//             open={openSections.includes(`store-${storeIndex}`)}
//             onOpenChange={() => toggleSection(`store-${storeIndex}`)}
//             className="bg-[#F8FAFC] lg:p-4 rounded-lg border"
//           >
//             <CollapsibleTrigger className="w-full">
//               <div className="flex items-center justify-between p-2">
//                 <div className="flex items-center space-x-2">
//                   <PackageIcon className="w-5 h-5 text-gray-600" />
//                   <span className="font-medium text-gray-900">
//                  Select the return store for your item
//                   </span>
//                 </div>
//                 <ChevronDown
//                   className={cn(
//                     "w-5 h-5 text-gray-400 transition-transform",
//                     openSections.includes(`store-${storeIndex}`) && "rotate-180"
//                   )}
//                 />
//               </div>
//             </CollapsibleTrigger>

//             <CollapsibleContent className="pt-4 space-y-6">
//               <div className="p-3">
//                 <Label>Return Store</Label>
//                 <Select
//                   value={store.returnStore}
//                   onValueChange={(value) => {
//                     updateStoreData(storeIndex, "returnStore", value)
//                     if (value !== "OTHER") {
//                       updateStoreData(storeIndex, "otherStoreName", "")
//                     }
//                   }}
//                 >
//                   <SelectTrigger className="bg-white mt-1">
//                     <SelectValue placeholder="Please select a store" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="STAPLES">Staples</SelectItem>
//                     <SelectItem value="KOHLS">Kohl's</SelectItem>
//                     <SelectItem value="SHEIN">Shein Return</SelectItem>
//                     <SelectItem value="TARGET">Target</SelectItem>
//                     {/* <SelectItem value="WALMART">Walmart</SelectItem> */}
//                     <SelectItem value="WALMART">Walmart</SelectItem>
//                     <SelectItem value="WHOLE FOODS MARKET">Whole Foods Market</SelectItem>
//                     <SelectItem value="UPS">UPS Drop Off</SelectItem>
//                     <SelectItem value="USPS">USPS Drop Off</SelectItem>
//                     <SelectItem value="FEDEX">FedEx Drop Off</SelectItem>
//                     <SelectItem value="OTHER">Other (Please specify)</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 {/* Other Store Name Input – Inside the same section */}
//                 {store.returnStore === "OTHER" && (
//                   <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
//                     <Label htmlFor={`other-store-${storeIndex}`}>
//                       Please specify the store name
//                     </Label>
//                     <Input
//                       id={`other-store-${storeIndex}`}
//                       placeholder="e.g. Macy's, Best Buy, Nike"
//                       className="mt-1"
//                       value={store.otherStoreName || ""}
//                       onChange={(e) =>
//                         updateStoreData(storeIndex, "otherStoreName", e.target.value)
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//             </CollapsibleContent>
//           </Collapsible>

//           {/* Number of Packages */}
//           <Collapsible
//             open={openSections.includes(`packages-${storeIndex}`)}
//             onOpenChange={() => toggleSection(`packages-${storeIndex}`)}
//             className="bg-[#F8FAFC] lg:p-4 p-1 py-4 rounded-lg border"
//           >
//             <CollapsibleTrigger className="w-full">
//               <div className="flex items-center justify-between p-2">
//                 <div className="flex items-center space-x-2">
//                   <PackageIcon className="w-5 h-5 text-gray-600" />
//                   <span className="font-medium text-gray-900">
//                     Number of Packages ({store.numberOfPackages})
//                   </span>
//                 </div>
//                 <ChevronDown
//                   className={cn(
//                     "w-5 h-5 text-gray-400 transition-transform",
//                     openSections.includes(`packages-${storeIndex}`) && "rotate-180"
//                   )}
//                 />
//               </div>
//             </CollapsibleTrigger>

//             <CollapsibleContent className="pt-4 px-2">
//               <p className="text-sm text-gray-600 mb-3">
//                 How many packages are you returning to this store?
//               </p>
//               <Select
//                 value={store.numberOfPackages.toString()}
//                 onValueChange={(value) =>
//                   updateStoreData(storeIndex, "numberOfPackages", parseInt(value))
//                 }
//               >
//                 <SelectTrigger className="bg-white">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[1, 2, 3, 4, 5].map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <div className="mt-6 space-y-4">
//                 {Array.from({ length: store.numberOfPackages }).map((_, pkgIndex) => (
//                   <div key={pkgIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center space-x-2">
//                         <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">
//                           {pkgIndex + 1}
//                         </div>
//                         <span className="font-medium text-gray-900">Package {pkgIndex + 1}</span>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <Label>Package Number / Tracking Number</Label>
//                         <Input
//                           placeholder="e.g. PKG-001"
//                           className="mt-1"
//                           value={store.packageNumbers[pkgIndex] || ""}
//                           onChange={(e) =>
//                             updateStoreData(storeIndex, "packageNumbers", {
//                               ...store.packageNumbers,
//                               [pkgIndex]: e.target.value,
//                             })
//                           }
//                         />
//                       </div>

//                       <div>
//                         <Label>Barcode / Label Images (optional)</Label>
//                         <div className="mt-1">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             id={`img-${storeIndex}-${pkgIndex}`}
//                             onChange={(e) => handleImageChange(storeIndex, pkgIndex, e)}
//                           />

//                           {store.packageImages[pkgIndex]?.length > 0 ? (
//                             <div className="space-y-3">
//                               <div className="relative">
//                                 <img
//                                   src={store.packageImages[pkgIndex][0]}
//                                   alt="barcode"
//                                   className="w-full h-48 object-contain rounded-lg border bg-gray-50"
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() => removeImage(storeIndex, pkgIndex)}
//                                   className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
//                                 >
//                                   <X className="w-4 h-4" />
//                                 </button>
//                               </div>
//                               <label
//                                 htmlFor={`img-${storeIndex}-${pkgIndex}`}
//                                 className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
//                               >
//                                 <Upload className="w-4 h-4 mr-2" /> Replace Image
//                               </label>
//                             </div>
//                           ) : (
//                             <label
//                               htmlFor={`img-${storeIndex}-${pkgIndex}`}
//                               className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400"
//                             >
//                               <Upload className="w-10 h-10 text-gray-400 mb-3" />
//                               <p className="text-sm text-gray-600">Click to upload barcode image</p>
//                               <p className="text-xs text-gray-500 mt-1">(Only one image allowed)</p>
//                             </label>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CollapsibleContent>
//           </Collapsible>
//         </div>
//       ))}

//       {/* Add Another Store */}
//       <Collapsible
//         open={openSections.includes("anotherStore")}
//         onOpenChange={() => toggleSection("anotherStore")}
//         className="bg-[#F8FAFC] p-4 rounded-lg border"
//       >
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-2">
//             <div className="flex items-center space-x-2">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               <span className="font-medium text-gray-900">Add Another Store</span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("anotherStore") && "rotate-180"
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4 px-2">
//           <p className="text-sm text-gray-600 mb-3">
//             Are you returning packages to another store?
//           </p>
//           <RadioGroup onValueChange={(v) => v === "yes" && addStore()} defaultValue="no">
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" id="as-yes" />
//                 <Label htmlFor="as-yes">Yes</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" id="as-no" />
//                 <Label htmlFor="as-no">No</Label>
//               </div>
//             </div>
//           </RadioGroup>
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Physical Return Label */}
//       <Collapsible
//         open={openSections.includes("shippingLabel")}
//         onOpenChange={() => toggleSection("shippingLabel")}
//         className="bg-[#F8FAFC] p-4 rounded-lg border"
//       >
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-2">
//             <div className="flex items-center space-x-2">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               <span className="font-medium text-gray-900">
//                 Does your package require a physical return label?
//               </span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("shippingLabel") && "rotate-180"
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4 px-2">
//           <p className="text-sm text-gray-600 font-medium mb-3">
//             Note:{" "}
//             <span className="text-[#FF4928]">
//               Additional fee: $3.50 (applies to pay-per-package and standard accounts).
//             </span>
//           </p>
//           <RadioGroup
//             onValueChange={(v) => setValue("printShippingLabel", v === "yes")}
//             defaultValue="no"
//           >
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" id="psl-yes" />
//                 <Label htmlFor="psl-yes">Yes</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" id="psl-no" />
//                 <Label htmlFor="psl-no">No</Label>
//               </div>
//             </div>
//           </RadioGroup>

//           {printShippingLabel && (
//             <div className="mt-6">
//               <Label>Upload Physical Return Label Files (PDF or Image)</Label>
//               <div className="mt-2">
//                 <input
//                   type="file"
//                   accept="image/*,.pdf"
//                   multiple
//                   className="hidden"
//                   id="physical-return-labels"
//                   onChange={handlePhysicalLabelUpload}
//                 />

//                 {physicalReturnLabelFiles.length > 0 ? (
//                   <div className="space-y-3">
//                     {physicalReturnLabelFiles.map((item, idx) => (
//                       <div
//                         key={idx}
//                         className="relative flex items-center gap-3 p-3 border rounded-lg bg-white"
//                       >
//                         {item.preview ? (
//                           <img
//                             src={item.preview}
//                             alt="Label preview"
//                             className="w-24 h-24 object-contain rounded border"
//                           />
//                         ) : (
//                           <div className="w-24 h-24 bg-gray-100 rounded border flex items-center justify-center">
//                             <FileText className="w-10 h-10 text-gray-400" />
//                           </div>
//                         )}
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate max-w-xs">{item.file.name}</p>
//                           <p className="text-xs text-gray-500">
//                             {(item.file.size / 1024).toFixed(1)} KB
//                           </p>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => removePhysicalLabelFile(idx)}
//                           className="text-red-600 hover:bg-red-50 p-2 rounded"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </div>
//                     ))}

//                     <label
//                       htmlFor="physical-return-labels"
//                       className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
//                     >
//                       <Upload className="w-4 h-4 mr-2" /> Add More Files
//                     </label>
//                   </div>
//                 ) : (
//                   <label
//                     htmlFor="physical-return-labels"
//                     className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-cyan-400"
//                   >
//                     <Upload className="w-12 h-12 text-gray-400 mb-4" />
//                     <p className="text-sm text-gray-600">Click to upload return label files</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Supports images and PDFs (multiple allowed)
//                     </p>
//                   </label>
//                 )}
//               </div>
//             </div>
//           )}
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Physical Receipt */}
//       <Collapsible
//         open={openSections.includes("receipt")}
//         onOpenChange={() => toggleSection("receipt")}
//         className="bg-[#F8FAFC] p-4 rounded-lg border"
//       >
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-2">
//             <div className="flex items-center space-x-2">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               <span className="font-medium text-gray-900">
//                 Does your return require a physical receipt?
//               </span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("receipt") && "rotate-180"
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4 px-2">
//           <RadioGroup
//             onValueChange={(v) => setValue("hasReceipt", v === "yes")}
//             defaultValue="no"
//           >
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" id="r-yes" />
//                 <Label htmlFor="r-yes">Yes</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" id="r-no" />
//                 <Label htmlFor="r-no">No</Label>
//               </div>
//             </div>
//           </RadioGroup>

//           {hasReceipt && (
//             <div className="mt-4">
//               <Input
//                 placeholder="Enter last 4 digits of your credit card"
//                 maxLength={4}
//                 className="mt-1 bg-white w-full"
//                 {...register("creditCardLast4")}
//               />
//               <div className="pt-5">
//                 <p className="text-sm text-gray-600 font-medium mb-3">
//                   Note:{" "}
//                   <span className="text-[#FF4928]">
//                     Additional fee: $8.00 (applies to pay-per-pickup and standard accounts).
//                   </span>
//                 </p>
//                 <p className="text-sm text-[#FF4928]">
//                   *Returns requiring a physical receipt must be purchased with a credit card.
//                 </p>
//               </div>
//             </div>
//           )}
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Message */}
//       <Collapsible
//         open={openSections.includes("message")}
//         onOpenChange={() => toggleSection("message")}
//         className="bg-[#F8FAFC] p-4 rounded-lg border"
//       >
//         <CollapsibleTrigger className="w-full">
//           <div className="flex items-center justify-between p-2">
//             <div className="flex items-center space-x-2">
//               <PackageIcon className="w-5 h-5 text-gray-600" />
//               <span className="font-medium text-gray-900">Leave a Message (Optional)</span>
//             </div>
//             <ChevronDown
//               className={cn(
//                 "w-5 h-5 text-gray-400 transition-transform",
//                 openSections.includes("message") && "rotate-180"
//               )}
//             />
//           </div>
//         </CollapsibleTrigger>
//         <CollapsibleContent className="pt-4 px-2">
//           <Label>Do you want to leave a message?</Label>
//           <RadioGroup
//             onValueChange={(v) => setValue("leaveMessage", v === "yes")}
//             defaultValue="no"
//           >
//             <div className="flex items-center space-x-6 pt-2">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" id="m-yes" />
//                 <Label htmlFor="m-yes">Yes</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" id="m-no" />
//                 <Label htmlFor="m-no">No</Label>
//               </div>
//             </div>
//           </RadioGroup>

//           {leaveMessage && (
//             <div className="mt-4">
//               <Textarea
//                 rows={4}
//                 placeholder="Write your message here..."
//                 className="mt-1"
//                 {...register("message")}
//               />
//             </div>
//           )}
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Submit Buttons */}
//       <div className="flex flex-col md:flex-row gap-4 justify-between pt-8 border-t">
//         <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
//           Back
//         </Button>
//         <Button
//           type="submit"
//           disabled={isSubmitting}
//           className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-10 h-12"
//         >
//           {isSubmitting ? "Submitting Request..." : "Submit Request"}
//         </Button>
//       </div>
//     </form>
//   )
// }




"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { User, MapPin, Phone, Mail, Home, MapPinned } from "lucide-react"; 
import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./Mappiker"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl p-10 shadow-2xl text-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading map...</p>
      </div>
    </div>
  ),
});

const customerInfoSchema = z.object({
  fullName: z.string().min(2, "First name must be at least 2 characters"),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  zipCode: z.string().min(3, "Zip code is required"),
  street: z.string().min(3, "Street is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  unit: z.string().optional(),
  pickupInstructions: z.string().optional(),
  rushService: z.boolean(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;

interface CustomerInfoFormProps {
  initialData?: Partial<CustomerInfoFormData>;
  onNext: (data: CustomerInfoFormData) => void;
}

export function CustomerInfoForm({ initialData, onNext }: CustomerInfoFormProps) {
  const [showMap, setShowMap] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  const { register, handleSubmit, formState: { errors }, setValue, watch } =
    useForm<CustomerInfoFormData>({
      resolver: zodResolver(customerInfoSchema),
      defaultValues: useMemo(() => ({
        rushService: false,
        unit: "",
        ...initialData,
      }), [initialData]),
    });

  const rushService = watch("rushService");
  const pickupAddress = watch("pickupAddress");
  const lat = watch("lat");
  const lng = watch("lng");

  const currentLocation = useMemo(() => 
    pickupAddress && lat && lng ? { address: pickupAddress, lat, lng } : null,
    [pickupAddress, lat, lng]
  );

  const onSubmit: SubmitHandler<CustomerInfoFormData> = useCallback((data) => {
    const payload: CustomerInfoFormData = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phoneNumber: data.phoneNumber.trim(),
      pickupAddress: data.pickupAddress.trim(),
      street: data.street.trim(),
      unit: data.unit?.trim() || "",
      city: data.city.trim(),
      state: data.state.trim(),
      zipCode: data.zipCode.trim(),
      pickupInstructions: data.pickupInstructions?.trim() || "",
      rushService: Boolean(data.rushService),
      lat: data.lat ?? undefined,
      lng: data.lng ?? undefined,
    };

    onNext(payload);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [onNext]);

  const handleMapSelect = useCallback(({ address, lat, lng }: { address: string; lat: number; lng: number }) => {
    setValue("pickupAddress", address);
    setValue("lat", lat);
    setValue("lng", lng);
    setShowMap(false);
  }, [setValue]);

  const handleOpenMap = useCallback(() => {
    setShowLocationModal(true);
  }, []);

  const handleAllowLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      const processLocation = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        
        if (typeof google === 'undefined' || !google.maps) {
          const address = `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setUserLocation({ 
            address: address,
            lat: latitude, 
            lng: longitude 
          });
          setLocationError("");
          setShowLocationModal(false);
          setShowMap(true);
          return;
        }

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            let address = "My Current Location";
            
            if (status === "OK" && results?.[0]) {
              address = results[0].formatted_address.replace(/^[A-Z0-9+]+,\s*/, "");
            } else {
              address = `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
            }

            setUserLocation({ 
              address: address,
              lat: latitude, 
              lng: longitude 
            });
            setLocationError("");
            setShowLocationModal(false);
            setShowMap(true);
          }
        );
      };

      const attemptGeolocation = (attemptNumber: number = 1) => {
        const configs = [
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 },
          { enableHighAccuracy: false, timeout: 30000, maximumAge: 300000 },
        ];

        const config = configs[attemptNumber - 1] || configs[configs.length - 1];

        navigator.geolocation.getCurrentPosition(
          processLocation,
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setLocationError("Location access denied. Please enable location permission in your browser.");
              setTimeout(() => {
                setShowLocationModal(false);
                setShowMap(true);
              }, 3000);
              return;
            }

            if (attemptNumber < configs.length) {
              console.log(`Location attempt ${attemptNumber} failed, trying again...`);
              attemptGeolocation(attemptNumber + 1);
            } else {
              setLocationError("Unable to get your location after multiple attempts. Please check your device's location settings.");
              setTimeout(() => {
                setShowLocationModal(false);
                setShowMap(true);
              }, 3000);
            }
          },
          config
        );
      };

      attemptGeolocation(1);
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setTimeout(() => {
        setShowLocationModal(false);
        setShowMap(true);
      }, 2000);
    }
  }, []);

  const handleSkipLocation = useCallback(() => {
    setUserLocation(null);
    setShowLocationModal(false);
    setShowMap(true);
  }, []);

  const inputClass =
    "border border-[#C0C3C1] h-[50px] rounded-[8px] focus-visible:ring-cyan-400";

  return (
    <>
      <div onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#181818]">
              Customer Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tell us where to pick up your package
            </p>
          </div>
        </div>

        <div className="">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="fullName"
                placeholder="Marwan Obari"
                className={`${inputClass} pl-10`}
                {...register("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={`${inputClass} pl-10`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phoneNumber"
                placeholder="+876 1327951614"
                className={`${inputClass} pl-10`}
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickupAddress">Pickup Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="pickupAddress"
              placeholder="Click to select on map..."
              className={`${inputClass} pl-10 cursor-pointer bg-gray-50`}
              {...register("pickupAddress")}
              readOnly
              onClick={handleOpenMap}
            />
          </div>
          {errors.pickupAddress && (
            <p className="text-sm text-red-500">{errors.pickupAddress.message}</p>
          )}
        </div>

        <div className="lg:flex gap-4 space-y-6 lg:space-y-0">
          <div className="flex-1 space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              placeholder="Main Street"
              className={inputClass}
              {...register("street")}
            />
            {errors.street && (
              <p className="text-sm text-red-500">{errors.street.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="unit">Unit Number</Label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="unit"
                placeholder="Apt 5B, Suite 300, etc."
                className={`${inputClass} pl-10`}
                {...register("unit")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Monre"
              className={inputClass}
              {...register("city")}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="New York"
              className={inputClass}
              {...register("state")}
            />
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip code</Label>
            <Input
              id="zipCode"
              placeholder="10001"
              className={inputClass}
              {...register("zipCode")}
            />
            {errors.zipCode && (
              <p className="text-sm text-red-500">{errors.zipCode.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickupInstructions">Pick-up instructions</Label>
          <Textarea
            id="pickupInstructions"
            rows={4}
            className="border border-[#C0C3C1] rounded-[8px] focus-visible:ring-cyan-400"
            {...register("pickupInstructions")}
          />
        </div>

        <div className="bg-[#E4F6FF] rounded-lg p-4">
          <div className="flex items-center md:items-start space-x-4">
            <Checkbox
              id="rushService"
              checked={rushService}
              onCheckedChange={(checked) =>
                setValue("rushService", Boolean(checked))
              }
            />
            <div>
              <Label
                htmlFor="rushService"
                className="text-[#5A57FF] font-medium text-base md:text-xl"
              >
                Rush Service (Extra Cost)
              </Label>
              <p className="text-sm text-[#616161] mt-1">
                Priority pickup within 24 hours. Additional $15 fee will be
                applied.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end pt-4">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-8 h-[48px]"
          >
            Continue to Package Details
          </Button>
        </div>
      </div>

      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <MapPinned className="w-8 h-8 text-cyan-500" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Access Your Location
              </h3>
              
              <p className="text-gray-600 mb-6">
                Allow access to your location to automatically show your current position on the map and make selecting your pickup address easier.
              </p>

              {locationError && (
                <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-600">{locationError}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={handleAllowLocation}
                  className="flex-1 bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white h-11"
                >
                  Allow Location
                </Button>
                <Button
                  onClick={handleSkipLocation}
                  className="flex-1 border border-gray-300 text-black hover:bg-gray-50 bg-white h-11"
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMap && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">Select Pickup Location</h3>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MapPicker
                onSelect={handleMapSelect}
                onClose={() => setShowMap(false)}
                initialLocation={currentLocation || userLocation}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}