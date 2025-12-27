// components/OrderSkeleton.tsx
import { Card } from "@/components/ui/card"

export function OrderSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-5 shadow-none animate-pulse">
          <div className="mb-4 flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-5 w-32 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="mb-4 space-y-3">
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
          <div className="h-10 w-[127px] bg-gray-200 rounded" />
        </Card>
      ))}
    </div>
  )
}