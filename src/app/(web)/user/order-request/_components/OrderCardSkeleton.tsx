import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function OrderCardSkeleton() {
  return (
    <Card className="p-5 shadow-none">
      <div className="mb-4 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="mb-4 space-y-3">
        <div className="flex items-start gap-2 border-b pb-2">
          <Skeleton className="mt-0.5 h-4 w-4" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="flex justify-between flex-col gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </Card>
  )
}