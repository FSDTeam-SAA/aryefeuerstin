"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { User, MapPin, Phone, Mail } from "lucide-react"

/* -------------------- ZOD SCHEMA -------------------- */
const customerInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  zipCode: z.string().min(3, "Zip code is required"),
  street: z.string().min(3, "Street is required"),
  city: z.string().min(2, "City is required"),
  pickupInstructions: z.string().optional(),
  rushService: z.boolean(),
})

type CustomerInfoFormData = z.infer<typeof customerInfoSchema>

interface CustomerInfoFormProps {
  initialData?: Partial<CustomerInfoFormData>
  onNext: (data: CustomerInfoFormData) => void
}

export function CustomerInfoForm({ initialData, onNext }: CustomerInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CustomerInfoFormData>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      rushService: false,
      ...initialData,
    },
  })

  const rushService = watch("rushService")

  const onSubmit: SubmitHandler<CustomerInfoFormData> = (data) => {
    onNext(data)
  }

  /* ---------- COMMON INPUT STYLES ---------- */
  const inputClass =
    "border border-[#C0C3C1] h-[50px] rounded-[8px] focus-visible:ring-cyan-400"

  return (
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
        <Button type="button" variant="outline" size="sm">
          Edit
        </Button>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="firstName"
              placeholder="Marwan Obari"
              className={`${inputClass} pl-10`}
              {...register("firstName")}
            />
          </div>
          {errors.firstName && (
            <p className="text-sm text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="lastName"
              placeholder="Mrs Ann Gaur"
              className={`${inputClass} pl-10`}
              {...register("lastName")}
            />
          </div>
          {errors.lastName && (
            <p className="text-sm text-red-500">
              {errors.lastName.message}
            </p>
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
            placeholder="12A, River Nine, New York, USA"
            className={`${inputClass} pl-10`}
            {...register("pickupAddress")}
          />
        </div>
        {errors.pickupAddress && (
          <p className="text-sm text-red-500">
            {errors.pickupAddress.message}
          </p>
        )}
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Phone */}
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

        {/* Email */}
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
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Address Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="street">Street</Label>
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
            <Label htmlFor="rushService" className="text-[#5A57FF] font-medium text-base md:text-xl">
              Rush Service (Extra Cost)
            </Label>
            <p className="text-sm text-[#616161] mt-1">
              Priority pickup within 24 hours. Additional $15 fee will be applied.
            </p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-center  lg:justify-end pt-4">
        <Button
          type="submit"
          className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-8 h-[48px]"
        >
          Continue to Package Details
        </Button>
      </div>
    </form>
  )
}
