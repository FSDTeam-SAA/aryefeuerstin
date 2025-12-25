"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, MapPin, Loader2, Upload, FileText, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Dynamic import for Map
const MapPicker = dynamic(() => import("./_components/LocationPickerModal"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <Loader2 className="animate-spin text-gray-400" />
    </div>
  ),
});

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Location
  const [location, setLocation] = useState({
    address: "",
    lat: 23.8103,
    lng: 90.4125,
  });

  // Driving License File
  const [drivingLicenseFile, setDrivingLicenseFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleLocationSelect = (data: { address: string; lat: number; lng: number }) => {
    setLocation(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDrivingLicenseFile(file);

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setDrivingLicenseFile(null);
    setFilePreview(null);
  };

  // TanStack Query Mutation
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register-driver`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Something went wrong" }));
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Driver account created successfully!");
      window.location.href = "/auth/login";
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept terms & conditions");
      return;
    }
    if (!drivingLicenseFile) {
      toast.error("Please upload driving license");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("location", JSON.stringify({ address: location.address, lat: location.lat, lng: location.lng }));
    formData.append("drivingLicense", drivingLicenseFile);

    mutation.mutate(formData);
  };

  return (
    <div className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Left Image Section */}
      <div className="hidden lg:block relative">
        <Image src="/delivery-van.png" alt="Ez Returns delivery van" fill className="object-cover" priority />
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center bg-gray-50 px-6 overflow-y-auto py-3">
        <div className="w-full max-w-2xl space-y-1">
          <div className="text-center space-y-1">
            <p className="text-sm text-[#616161]">Welcome to Wellness Made Clear</p>
            <h1 className="text-3xl font-semibold text-[#131313]">Create an account for Driver</h1>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-[#E4F6FF] h-11 mt-1"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-[#E4F6FF] h-11 mt-1"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#E4F6FF] h-11 mt-1"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <Label>Phone No *</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-[#E4F6FF] h-11 mt-1"
                placeholder="Phone No"
                required
              />
            </div>

            {/* Location Picker */}
            <div>
              <Label>Location *</Label>
              <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <Input
                      readOnly
                      placeholder="Click to select location on map"
                      className="bg-[#E4F6FF] h-11 mt-1 cursor-pointer"
                      value={location.address ? `${location.address} (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : ""}
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#31B8FA] transition-colors" size={18} />
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Select Driver Location</DialogTitle>
                  </DialogHeader>
                  <MapPicker onSelect={handleLocationSelect} />
                  <Button type="button" className="w-full bg-[#31B8FA] hover:bg-[#31B8FA]/90" onClick={() => setIsMapOpen(false)}>
                    Confirm Location
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {/* Password Fields */}
            <div>
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#E4F6FF] h-11 mt-1 pr-10"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label>Confirm Password *</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#E4F6FF] h-11 mt-1 pr-10"
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Driving License File Upload */}
            <div>
              <Label>Driving License *</Label>
              <div className="mt-1">
                {!drivingLicenseFile ? (
                  <label className="flex justify-center items-center w-full h-32 px-4 transition bg-[#E4F6FF] border-2 border-dashed rounded-lg cursor-pointer hover:bg-[#d0efff]">
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-600">Click to upload license (Image/PDF)</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} required />
                  </label>
                ) : (
                  <div className="relative bg-[#E4F6FF] rounded-lg p-4 flex items-center gap-4">
                    {filePreview && drivingLicenseFile.type.startsWith("image/") ? (
                      <Image src={filePreview} alt="License preview" width={1000} height={1000} className="h-24 w-32 object-cover rounded" />
                    ) : (
                      <div className="flex items-center justify-center h-24 w-32 bg-gray-200 rounded">
                        <FileText size={40} className="text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{drivingLicenseFile.name}</p>
                      <p className="text-xs text-gray-500">{(drivingLicenseFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button type="button" onClick={removeFile} className="text-red-600 hover:text-red-800">
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm">
              <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-[#8C311E] underline">
                  terms & conditions
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-11 bg-[#31B8FA] hover:bg-[#28a5e0] text-white flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#23547B] font-medium">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 
 



// "use client";

// import { useState } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import Link from "next/link";
// import { Eye, EyeOff, MapPin, Loader2, Upload, FileText, X } from "lucide-react";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";

// // Shadcn UI Components
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// // Dynamic import for Google Map
// const MapPicker = dynamic(() => import("./_components/LocationPickerModal"), { ssr: false });

// export default function SignUpPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isMapOpen, setIsMapOpen] = useState(false);

//   // Form fields
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [termsAccepted, setTermsAccepted] = useState(false);

//   // Location
//   const [location, setLocation] = useState({
//     address: "",
//     lat: 23.8103,
//     lng: 90.4125,
//   });

//   // Driving License File
//   const [drivingLicenseFile, setDrivingLicenseFile] = useState<File | null>(null);
//   const [filePreview, setFilePreview] = useState<string | null>(null);

//   const handleLocationSelect = (data: { address: string; lat: number; lng: number }) => {
//     setLocation(data);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setDrivingLicenseFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setFilePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeFile = () => {
//     setDrivingLicenseFile(null);
//     setFilePreview(null);
//   };

//   // Mutation
//   const mutation = useMutation({
//     mutationFn: async (formData: FormData) => {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register-driver`, {
//         method: "POST",
//         body: formData,
//       });
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ message: "Something went wrong" }));
//         throw new Error(error.message || "Registration failed");
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       toast.success("Driver account created successfully!");
//       window.location.href = "/auth/login";
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || "Failed to create account");
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     if (!termsAccepted) {
//       toast.error("Please accept terms & conditions");
//       return;
//     }
//     if (!drivingLicenseFile) {
//       toast.error("Please upload driving license");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("firstName", firstName);
//     formData.append("lastName", lastName);
//     formData.append("email", email);
//     formData.append("phone", phone);
//     formData.append("password", password);
//     formData.append("location", JSON.stringify(location));
//     formData.append("drivingLicense", drivingLicenseFile);

//     mutation.mutate(formData);
//   };

//   return (
//     <div className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2">
//       {/* Left Image */}
//       <div className="hidden lg:block relative">
//         <Image src="/delivery-van.png" alt="Ez Returns delivery van" fill className="object-cover" priority />
//       </div>

//       {/* Right Form */}
//       <div className="flex items-center justify-center bg-gray-50 px-6 overflow-y-auto py-3">
//         <div className="w-full max-w-2xl space-y-1">
//           <div className="text-center space-y-1">
//             <p className="text-sm text-[#616161]">Welcome to Wellness Made Clear</p>
//             <h1 className="text-3xl font-semibold text-[#131313]">Create an account for Driver</h1>
//           </div>

//           <form className="space-y-5" onSubmit={handleSubmit}>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label>First Name *</Label>
//                 <Input
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   className="bg-[#E4F6FF] h-11 mt-1"
//                   placeholder="First name"
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Last Name *</Label>
//                 <Input
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   className="bg-[#E4F6FF] h-11 mt-1"
//                   placeholder="Last name"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>Email *</Label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="bg-[#E4F6FF] h-11 mt-1"
//                 placeholder="Email"
//                 required
//               />
//             </div>

//             <div>
//               <Label>Phone No *</Label>
//               <Input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="bg-[#E4F6FF] h-11 mt-1"
//                 placeholder="Phone No"
//                 required
//               />
//             </div>

//             {/* Location Picker */}
//             <div>
//               <Label>Location *</Label>
//               <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
//                 <DialogTrigger asChild>
//                   <div className="relative cursor-pointer group">
//                     <Input
//                       readOnly
//                       placeholder="Click to select location on map"
//                       className="bg-[#E4F6FF] h-11 mt-1 cursor-pointer"
//                       value={location.address ? `${location.address} (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : ""}
//                     />
//                     <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#31B8FA] transition-colors" size={18} />
//                   </div>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[500px]">
//                   <DialogHeader>
//                     <DialogTitle>Select Driver Location</DialogTitle>
//                   </DialogHeader>
//                   <MapPicker onSelect={handleLocationSelect} />
//                   <Button type="button" className="w-full bg-[#31B8FA] hover:bg-[#31B8FA]/90 mt-2" onClick={() => setIsMapOpen(false)}>
//                     Confirm Location
//                   </Button>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             {/* Password Fields */}
//             <div>
//               <Label>Password *</Label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="bg-[#E4F6FF] h-11 mt-1 pr-10"
//                   placeholder="Password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <Label>Confirm Password *</Label>
//               <div className="relative">
//                 <Input
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="bg-[#E4F6FF] h-11 mt-1 pr-10"
//                   placeholder="Confirm Password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 >
//                   {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* Driving License Upload */}
//             <div>
//               <Label>Driving License *</Label>
//               <div className="mt-1">
//                 {!drivingLicenseFile ? (
//                   <label className="flex justify-center items-center w-full h-32 px-4 transition bg-[#E4F6FF] border-2 border-dashed rounded-lg cursor-pointer hover:bg-[#d0efff]">
//                     <div className="flex flex-col items-center">
//                       <Upload className="w-8 h-8 text-gray-400" />
//                       <span className="mt-2 text-sm text-gray-600">Click to upload license (Image/PDF)</span>
//                     </div>
//                     <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} required />
//                   </label>
//                 ) : (
//                   <div className="relative bg-[#E4F6FF] rounded-lg p-4 flex items-center gap-4">
//                     {filePreview && drivingLicenseFile.type.startsWith("image/") ? (
//                       <Image src={filePreview} alt="License preview" width={1000} height={1000} className="h-24 w-32 object-cover rounded" />
//                     ) : (
//                       <div className="flex items-center justify-center h-24 w-32 bg-gray-200 rounded">
//                         <FileText size={40} className="text-gray-500" />
//                       </div>
//                     )}
//                     <div className="flex-1">
//                       <p className="text-sm font-medium truncate">{drivingLicenseFile.name}</p>
//                       <p className="text-xs text-gray-500">{(drivingLicenseFile.size / 1024 / 1024).toFixed(2)} MB</p>
//                     </div>
//                     <button type="button" onClick={removeFile} className="text-red-600 hover:text-red-800">
//                       <X size={20} />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Terms */}
//             <div className="flex items-start gap-2 text-sm">
//               <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
//               <label htmlFor="terms" className="text-gray-600">
//                 I agree to the{" "}
//                 <Link href="/terms" className="text-[#8C311E] underline">
//                   terms & conditions
//                 </Link>
//               </label>
//             </div>

//             {/* Submit */}
//             <Button
//               type="submit"
//               disabled={mutation.isPending}
//               className="w-full h-11 bg-[#31B8FA] hover:bg-[#28a5e0] text-white flex items-center gap-2"
//             >
//               {mutation.isPending ? (
//                 <>
//                   <Loader2 className="animate-spin" size={20} />
//                   Creating Account...
//                 </>
//               ) : (
//                 "Create Account"
//               )}
//             </Button>

//             <p className="text-center text-sm text-gray-600">
//               Already have an account?{" "}
//               <Link href="/auth/login" className="text-[#23547B] font-medium">
//                 Log In
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
