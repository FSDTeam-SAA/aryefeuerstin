// components/SubscriptionSkeleton.tsx
export function SubscriptionSkeleton() {
  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden flex flex-col animate-pulse">
      <div className="bg-gray-300 h-16 w-full" />
      <div className="p-6 flex-1 flex flex-col items-center">
        <div className="h-8 bg-gray-200 w-3/4 mb-2 rounded" />
        <div className="h-4 bg-gray-100 w-1/2 mb-6 rounded" />
        <div className="w-full h-10 bg-gray-50 mb-3 rounded" />
        <div className="space-y-3 w-full mt-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-100 rounded w-5/6" />
          ))}
        </div>
        <div className="h-[51px] bg-gray-200 w-full mt-auto rounded-lg" />
      </div>
    </div>
  );
}