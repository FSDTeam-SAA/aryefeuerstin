// "use client";

// import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { User, MapPin, Phone, Mail, Home } from "lucide-react"; // Added Home icon
// import { useState } from "react";

// import dynamic from "next/dynamic";

// const MapPicker = dynamic(() => import("./Mappiker"), {
//   ssr: false,
//   loading: () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//       <div className="bg-white rounded-xl p-10 shadow-2xl text-center">
//         <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//         <p className="text-lg font-medium text-gray-700">Loading map...</p>
//       </div>
//     </div>
//   ),
// });

// /* -------------------- ZOD SCHEMA -------------------- */
// const customerInfoSchema = z.object({
//   fullName: z.string().min(2, "First name must be at least 2 characters"),
//   pickupAddress: z.string().min(5, "Pickup address is required"),
//   phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/, "Invalid phone number"),
//   email: z.string().email("Invalid email address"),
//   zipCode: z.string().min(3, "Zip code is required"),
//   street: z.string().min(3, "Street is required"),
//   state: z.string().min(2, "State is required"),
//   city: z.string().min(2, "City is required"),
//   unit: z.string().optional(), // ← NEW: Unit/Apt/Suite
//   pickupInstructions: z.string().optional(),
//   rushService: z.boolean(),
//   lat: z.number().optional(),
//   lng: z.number().optional(),
// });

// type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;

// interface CustomerInfoFormProps {
//   initialData?: Partial<CustomerInfoFormData>;
//   onNext: (data: CustomerInfoFormData) => void;
// }

// export function CustomerInfoForm({
//   initialData,
//   onNext,
// }: CustomerInfoFormProps) {
//   const [showMap, setShowMap] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<CustomerInfoFormData>({
//     resolver: zodResolver(customerInfoSchema),
//     defaultValues: {
//       rushService: false,
//       unit: "", // default for new field
//       ...initialData,
//     },
//   });

//   const rushService = watch("rushService");
//   const pickupAddress = watch("pickupAddress");
//   const lat = watch("lat");
//   const lng = watch("lng");

//   const currentLocation =
//     pickupAddress && lat && lng ? { address: pickupAddress, lat, lng } : null;

//   const onSubmit: SubmitHandler<CustomerInfoFormData> = (data) => {
//     onNext(data);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleMapSelect = ({
//     address,
//     lat,
//     lng,
//   }: {
//     address: string;
//     lat: number;
//     lng: number;
//   }) => {
//     setValue("pickupAddress", address);
//     setValue("lat", lat);
//     setValue("lng", lng);
//     setShowMap(false);
//   };

//   const inputClass =
//     "border border-[#C0C3C1] h-[50px] rounded-[8px] focus-visible:ring-cyan-400";

//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-semibold text-[#181818]">
//               Customer Information
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Tell us where to pick up your package
//             </p>
//           </div>
//         </div>

//         {/* Name Fields */}
//         <div className="">
//           <div className="space-y-2">
//             <Label htmlFor="firstName">Full Name</Label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 id="fullName"
//                 placeholder="Marwan Obari"
//                 className={`${inputClass} pl-10`}
//                 {...register("fullName")}
//               />
//             </div>
//             {errors.fullName && (
//               <p className="text-sm text-red-500">{errors.fullName.message}</p>
//             )}
//           </div>
//         </div>

//         {/* Phone & Email */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email Address</Label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 className={`${inputClass} pl-10`}
//                 {...register("email")}
//               />
//             </div>
//             {errors.email && (
//               <p className="text-sm text-red-500">{errors.email.message}</p>
//             )}
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="phoneNumber">Phone Number</Label>
//             <div className="relative">
//               <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 id="phoneNumber"
//                 placeholder="+876 1327951614"
//                 className={`${inputClass} pl-10`}
//                 {...register("phoneNumber")}
//               />
//             </div>
//             {errors.phoneNumber && (
//               <p className="text-sm text-red-500">
//                 {errors.phoneNumber.message}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Pickup Address */}
//         <div className="space-y-2">
//           <Label htmlFor="pickupAddress">Pickup Address</Label>
//           <div className="relative">
//             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <Input
//               id="pickupAddress"
//               placeholder="Click to select on map..."
//               className={`${inputClass} pl-10 cursor-pointer bg-gray-50`}
//               {...register("pickupAddress")}
//               readOnly
//               onClick={() => setShowMap(true)}
//             />
//           </div>
//           {errors.pickupAddress && (
//             <p className="text-sm text-red-500">
//               {errors.pickupAddress.message}
//             </p>
//           )}
//         </div>

//         <div className="flex gap-4">
//           {/* Street Address */}
//           <div className="flex-1 space-y-2">
//             <Label htmlFor="street">Street Address</Label>
//             <Input
//               id="street"
//               placeholder="Main Street"
//               className={inputClass}
//               {...register("street")}
//             />
//             {errors.street && (
//               <p className="text-sm text-red-500">{errors.street.message}</p>
//             )}
//           </div>

//           {/* Unit / Apt */}
//           <div className="flex-1 space-y-2">
//             <Label htmlFor="unit">Unit Number</Label>
//             <div className="relative">
//               <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 id="unit"
//                 placeholder="Apt 5B, Suite 300, etc."
//                 className={`${inputClass} pl-10`}
//                 {...register("unit")}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Address Details */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="city">City</Label>
//             <Input
//               id="city"
//               placeholder="New York"
//               className={inputClass}
//               {...register("city")}
//             />
//             {errors.city && (
//               <p className="text-sm text-red-500">{errors.city.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="city">State</Label>
//             <Input
//               id="state"
//               placeholder="Florida"
//               className={inputClass}
//               {...register("state")}
//             />
//             {errors.state && (
//               <p className="text-sm text-red-500">{errors.state.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="zipCode">Zip code</Label>
//             <Input
//               id="zipCode"
//               placeholder="10001"
//               className={inputClass}
//               {...register("zipCode")}
//             />
//             {errors.zipCode && (
//               <p className="text-sm text-red-500">{errors.zipCode.message}</p>
//             )}
//           </div>
          
//         </div>

//         {/* Pickup Instructions */}
//         <div className="space-y-2">
//           <Label htmlFor="pickupInstructions">Pick-up instructions</Label>
//           <Textarea
//             id="pickupInstructions"
//             rows={4}
//             className="border border-[#C0C3C1] rounded-[8px] focus-visible:ring-cyan-400"
//             {...register("pickupInstructions")}
//           />
//         </div>

//         {/* Rush Service */}
//         <div className="bg-[#E4F6FF] rounded-lg p-4">
//           <div className="flex items-center md:items-start space-x-4">
//             <Checkbox
//               id="rushService"
//               checked={rushService}
//               onCheckedChange={(checked) =>
//                 setValue("rushService", Boolean(checked))
//               }
//             />
//             <div>
//               <Label
//                 htmlFor="rushService"
//                 className="text-[#5A57FF] font-medium text-base md:text-xl"
//               >
//                 Rush Service (Extra Cost)
//               </Label>
//               <p className="text-sm text-[#616161] mt-1">
//                 Priority pickup within 24 hours. Additional $15 fee will be
//                 applied.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="flex justify-center lg:justify-end pt-4">
//           <Button
//             type="submit"
//             className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-8 h-[48px]"
//           >
//             Continue to Package Details
//           </Button>
//         </div>
//       </form>

//       {/* Map Picker Modal */}
//       {showMap && (
//         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h3 className="text-xl font-semibold">Select Pickup Location</h3>
//               <button
//                 onClick={() => setShowMap(false)}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="flex-1 overflow-auto p-4">
//               <MapPicker
//                 onSelect={handleMapSelect}
//                 onClose={() => setShowMap(false)}
//                 initialLocation={currentLocation}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
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
import { User, MapPin, Phone, Mail, Home } from "lucide-react"; 
import { useState } from "react";
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

  const { register, handleSubmit, formState: { errors }, setValue, watch } =
    useForm<CustomerInfoFormData>({
      resolver: zodResolver(customerInfoSchema),
      defaultValues: {
        rushService: false,
        unit: "",
        ...initialData,
      },
    });

  const rushService = watch("rushService");
  const pickupAddress = watch("pickupAddress");
  const lat = watch("lat");
  const lng = watch("lng");

  const currentLocation =
    pickupAddress && lat && lng ? { address: pickupAddress, lat, lng } : null;

  // ✅ Fixed payload
  const onSubmit: SubmitHandler<CustomerInfoFormData> = (data) => {
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
  };

  const handleMapSelect = ({ address, lat, lng }: { address: string; lat: number; lng: number }) => {
    setValue("pickupAddress", address);
    setValue("lat", lat);
    setValue("lng", lng);
    setShowMap(false);
  };

  const inputClass =
    "border border-[#C0C3C1] h-[50px] rounded-[8px] focus-visible:ring-cyan-400";

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
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

        {/* Name Fields */}
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

        {/* Phone & Email */}
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

        {/* Pickup Address */}
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
              onClick={() => setShowMap(true)}
            />
          </div>
          {errors.pickupAddress && (
            <p className="text-sm text-red-500">{errors.pickupAddress.message}</p>
          )}
        </div>

        {/* Street & Unit */}
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

        {/* Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
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
              placeholder="Florida"
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

        {/* Pickup Instructions */}
        <div className="space-y-2">
          <Label htmlFor="pickupInstructions">Pick-up instructions</Label>
          <Textarea
            id="pickupInstructions"
            rows={4}
            className="border border-[#C0C3C1] rounded-[8px] focus-visible:ring-cyan-400"
            {...register("pickupInstructions")}
          />
        </div>

        {/* Rush Service */}
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

        {/* Submit */}
        <div className="flex justify-center lg:justify-end pt-4">
          <Button
            type="submit"
            className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-8 h-[48px]"
          >
            Continue to Package Details
          </Button>
        </div>
      </form>

      {/* Map Picker Modal */}
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
                initialLocation={currentLocation}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
