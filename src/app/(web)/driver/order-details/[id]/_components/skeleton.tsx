import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 print:hidden">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
          <div className="p-5 sm:p-6 space-y-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-7 w-64" />
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Skeleton className="mt-0.5 h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-8 w-20 ml-4" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-8 w-20 ml-4" />
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-4 flex items-center justify-between px-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="border-none shadow-sm ring-1 ring-gray-200">
              <div className="flex flex-col p-4 sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-6 border-t border-gray-50 pt-4 sm:border-none sm:pt-0">
                  <Skeleton className="h-14 w-48 rounded-lg" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}