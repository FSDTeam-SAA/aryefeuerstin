// components/DeliveryCardSkeleton.tsx
export function DeliveryCardSkeleton() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col gap-4">
        <div className="flex-1 space-y-4">
          {/* Order ID Placeholder */}
          <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
          
          {/* Name Placeholder */}
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
          
          {/* Address Placeholder */}
          <div className="flex items-start gap-2 border-b border-gray-100 pb-3">
            <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full flex-shrink-0" />
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
          </div>
          
          {/* Package Count Placeholder */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 animate-pulse rounded flex-shrink-0" />
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
          
          {/* Buttons Placeholder */}
          <div className="flex justify-between pt-2">
            <div className="h-9 w-[140px] bg-gray-200 animate-pulse rounded-md" />
            <div className="h-9 w-[140px] bg-gray-200 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}