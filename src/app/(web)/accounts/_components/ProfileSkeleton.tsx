// components/profile/ProfileSkeleton.tsx
import { Card } from "@/components/ui/card"

export function ProfileSkeleton() {
  return (
    <div className="p-4 sm:p-6 md:p-8 animate-pulse">
      <div className="mx-auto max-w-5xl">
        <Card className="border-none shadow-none p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
              <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-gray-200" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
            <div className="flex-1 space-y-6">
              <div className="h-8 w-48 bg-gray-200 rounded" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 w-full bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}