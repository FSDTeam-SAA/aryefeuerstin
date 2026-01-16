// "use client";

// import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { User, MapPin, Phone, Mail, Home, MapPinned } from "lucide-react"; 
// import { useState, useCallback, useMemo } from "react";
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

// const customerInfoSchema = z.object({
//   fullName: z.string().min(2, "First name must be at least 2 characters"),
//   pickupAddress: z.string().min(5, "Pickup address is required"),
//   phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/, "Invalid phone number"),
//   email: z.string().email("Invalid email address"),
//   zipCode: z.string().min(3, "Zip code is required"),
//   street: z.string().min(3, "Street is required"),
//   state: z.string().min(2, "State is required"),
//   city: z.string().min(2, "City is required"),
//   unit: z.string().optional(),
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

// export function CustomerInfoForm({ initialData, onNext }: CustomerInfoFormProps) {
//   const [showMap, setShowMap] = useState(false);
//   const [showLocationModal, setShowLocationModal] = useState(false);
//   const [userLocation, setUserLocation] = useState<{ address: string; lat: number; lng: number } | null>(null);
//   const [locationError, setLocationError] = useState<string>("");

//   const { register, handleSubmit, formState: { errors }, setValue, watch } =
//     useForm<CustomerInfoFormData>({
//       resolver: zodResolver(customerInfoSchema),
//       defaultValues: useMemo(() => ({
//         rushService: false,
//         unit: "",
//         ...initialData,
//       }), [initialData]),
//     });

//   const rushService = watch("rushService");
//   const pickupAddress = watch("pickupAddress");
//   const lat = watch("lat");
//   const lng = watch("lng");

//   const currentLocation = useMemo(() => 
//     pickupAddress && lat && lng ? { address: pickupAddress, lat, lng } : null,
//     [pickupAddress, lat, lng]
//   );

//   const onSubmit: SubmitHandler<CustomerInfoFormData> = useCallback((data) => {
//     const payload: CustomerInfoFormData = {
//       fullName: data.fullName.trim(),
//       email: data.email.trim(),
//       phoneNumber: data.phoneNumber.trim(),
//       pickupAddress: data.pickupAddress.trim(),
//       street: data.street.trim(),
//       unit: data.unit?.trim() || "",
//       city: data.city.trim(),
//       state: data.state.trim(),
//       zipCode: data.zipCode.trim(),
//       pickupInstructions: data.pickupInstructions?.trim() || "",
//       rushService: Boolean(data.rushService),
//       lat: data.lat ?? undefined,
//       lng: data.lng ?? undefined,
//     };

//     onNext(payload);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [onNext]);

//   const handleMapSelect = useCallback(({ address, lat, lng }: { address: string; lat: number; lng: number }) => {
//     setValue("pickupAddress", address);
//     setValue("lat", lat);
//     setValue("lng", lng);
//     setShowMap(false);
//   }, [setValue]);

//   const handleOpenMap = useCallback(() => {
//     setShowLocationModal(true);
//   }, []);

//   const handleAllowLocation = useCallback(() => {
//     if ("geolocation" in navigator) {
//       const processLocation = (position: GeolocationPosition) => {
//         const { latitude, longitude } = position.coords;
        
//         if (typeof google === 'undefined' || !google.maps) {
//           const address = `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
//           setUserLocation({ 
//             address: address,
//             lat: latitude, 
//             lng: longitude 
//           });
//           setLocationError("");
//           setShowLocationModal(false);
//           setShowMap(true);
//           return;
//         }

//         const geocoder = new google.maps.Geocoder();
//         geocoder.geocode(
//           { location: { lat: latitude, lng: longitude } },
//           (results, status) => {
//             let address = "My Current Location";
            
//             if (status === "OK" && results?.[0]) {
//               address = results[0].formatted_address.replace(/^[A-Z0-9+]+,\s*/, "");
//             } else {
//               address = `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
//             }

//             setUserLocation({ 
//               address: address,
//               lat: latitude, 
//               lng: longitude 
//             });
//             setLocationError("");
//             setShowLocationModal(false);
//             setShowMap(true);
//           }
//         );
//       };

//       const attemptGeolocation = (attemptNumber: number = 1) => {
//         const configs = [
//           { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 },
//           { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 },
//           { enableHighAccuracy: false, timeout: 30000, maximumAge: 300000 },
//         ];

//         const config = configs[attemptNumber - 1] || configs[configs.length - 1];

//         navigator.geolocation.getCurrentPosition(
//           processLocation,
//           (error) => {
//             if (error.code === error.PERMISSION_DENIED) {
//               setLocationError("Location access denied. Please enable location permission in your browser.");
//               setTimeout(() => {
//                 setShowLocationModal(false);
//                 setShowMap(true);
//               }, 3000);
//               return;
//             }

//             if (attemptNumber < configs.length) {
//               console.log(`Location attempt ${attemptNumber} failed, trying again...`);
//               attemptGeolocation(attemptNumber + 1);
//             } else {
//               setLocationError("Unable to get your location after multiple attempts. Please check your device's location settings.");
//               setTimeout(() => {
//                 setShowLocationModal(false);
//                 setShowMap(true);
//               }, 3000);
//             }
//           },
//           config
//         );
//       };

//       attemptGeolocation(1);
//     } else {
//       setLocationError("Geolocation is not supported by your browser.");
//       setTimeout(() => {
//         setShowLocationModal(false);
//         setShowMap(true);
//       }, 2000);
//     }
//   }, []);

//   const handleSkipLocation = useCallback(() => {
//     setUserLocation(null);
//     setShowLocationModal(false);
//     setShowMap(true);
//   }, []);

//   const inputClass =
//     "border border-[#C0C3C1] h-[50px] rounded-[8px] focus-visible:ring-cyan-400";

//   return (
//     <>
//       <div onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

//         <div className="">
//           <div className="space-y-2">
//             <Label htmlFor="fullName">Full Name</Label>
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
//               <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
//             )}
//           </div>
//         </div>

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
//               onClick={handleOpenMap}
//             />
//           </div>
//           {errors.pickupAddress && (
//             <p className="text-sm text-red-500">{errors.pickupAddress.message}</p>
//           )}
//         </div>

//         <div className="lg:flex gap-4 space-y-6 lg:space-y-0">
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

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="city">City</Label>
//             <Input
//               id="city"
//               placeholder="Monre"
//               className={inputClass}
//               {...register("city")}
//             />
//             {errors.city && (
//               <p className="text-sm text-red-500">{errors.city.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="state">State</Label>
//             <Input
//               id="state"
//               placeholder="New York"
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

//         <div className="space-y-2">
//           <Label htmlFor="pickupInstructions">Pick-up instructions</Label>
//           <Textarea
//             id="pickupInstructions"
//             rows={4}
//             className="border border-[#C0C3C1] rounded-[8px] focus-visible:ring-cyan-400"
//             {...register("pickupInstructions")}
//           />
//         </div>

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

//         <div className="flex justify-center lg:justify-end pt-4">
//           <Button
//             onClick={handleSubmit(onSubmit)}
//             className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-8 h-[48px]"
//           >
//             Continue to Package Details
//           </Button>
//         </div>
//       </div>

//       {showLocationModal && (
//         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
//                 <MapPinned className="w-8 h-8 text-cyan-500" />
//               </div>
              
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 Access Your Location
//               </h3>
              
//               <p className="text-gray-600 mb-6">
//                 Allow access to your location to automatically show your current position on the map and make selecting your pickup address easier.
//               </p>

//               {locationError && (
//                 <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//                   <p className="text-sm text-red-600">{locationError}</p>
//                 </div>
//               )}

//               <div className="flex flex-col sm:flex-row gap-3 w-full">
//                 <Button
//                   onClick={handleAllowLocation}
//                   className="flex-1 bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white h-11"
//                 >
//                   Allow Location
//                 </Button>
//                 <Button
//                   onClick={handleSkipLocation}
//                   className="flex-1 border border-gray-300 text-black hover:bg-gray-50 bg-white h-11"
//                 >
//                   Skip
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

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
//                 initialLocation={currentLocation || userLocation}
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

export function CustomerInfoForm({
  initialData,
  onNext,
}: CustomerInfoFormProps) {
  const [showMap, setShowMap] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CustomerInfoFormData>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: useMemo(
      () => ({
        rushService: false,
        unit: "",
        ...initialData,
      }),
      [initialData]
    ),
  });

  const rushService = watch("rushService");
  const pickupAddress = watch("pickupAddress");
  const lat = watch("lat");
  const lng = watch("lng");

  const currentLocation = useMemo(
    () =>
      pickupAddress && lat && lng
        ? { address: pickupAddress, lat, lng }
        : null,
    [pickupAddress, lat, lng]
  );

  const onSubmit: SubmitHandler<CustomerInfoFormData> = useCallback(
    (data) => {
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
    },
    [onNext]
  );

  const handleMapSelect = useCallback(
    ({
      address,
      lat,
      lng,
      addressComponents,
    }: {
      address: string;
      lat: number;
      lng: number;
      addressComponents?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
      };
    }) => {
      setValue("pickupAddress", address);
      setValue("lat", lat);
      setValue("lng", lng);

      // Auto-fill address fields if components are provided
      if (addressComponents) {
        if (addressComponents.street) {
          setValue("street", addressComponents.street);
        }
        if (addressComponents.city) {
          setValue("city", addressComponents.city);
        }
        if (addressComponents.state) {
          setValue("state", addressComponents.state);
        }
        if (addressComponents.zipCode) {
          setValue("zipCode", addressComponents.zipCode);
        }
      }

      setShowMap(false);
    },
    [setValue]
  );

  const handleOpenMap = useCallback(() => {
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
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
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
            <p className="text-sm text-red-500">
              {errors.pickupAddress.message}
            </p>
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