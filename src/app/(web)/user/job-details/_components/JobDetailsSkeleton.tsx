import { Skeleton } from "@/components/ui/skeleton"
import { Package, MapPin, Phone, Printer } from "lucide-react"

export function JobDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      {/* Customer Details Card Skeleton */}
      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <Skeleton className="h-4 w-36 mb-4" />
          <Skeleton className="h-7 w-64 mb-6" />

          <div className="space-y-6">
            {/* Address Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                <Skeleton className="h-4 w-80" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>

            {/* Phone Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gray-300" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section Header */}
      <div className="mb-4 flex items-center justify-between px-1">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-36 rounded-md flex items-center gap-2 px-4">
          <Printer className="h-4 w-4" />
          <span className="hidden xs:inline">
            <Skeleton className="h-4 w-28" />
          </span>
        </Skeleton>
      </div>

      {/* Package Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col p-4 sm:flex-row sm:items-center sm:justify-between gap-5 rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <Package className="h-7 w-7 text-gray-300" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-gray-100 pt-4 sm:border-none sm:pt-0">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-20 w-32 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}