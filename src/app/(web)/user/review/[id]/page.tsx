
'use client'
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, MapPin, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function DeliveryCompletePage() {
  const params = useParams();
  const id = params?.id;
  const session=useSession();
  const token=session.data?.accessToken||"";

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // TanStack Mutation using Fetch
  const { mutate, isPending } = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      // Fetch doesn't throw on 4xx/5xx, so we handle it manually
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Something went wrong');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    mutate({ rating, comment });
  };

  return (
    <div className="p-4 md:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981]">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#181818]">Delivery Completed!</h1>
        </div>

        <Card className="!border-none shadow-md bg-white p-8">
          <div className="space-y-6">
            <div>
              <p className="mb-1 text-[11px] font-medium uppercase tracking-widest text-gray-400">
                Job-{id || "1001"}
              </p>
              <h2 className="text-lg font-medium text-[#424242]">Daniel Hart</h2>
            </div>

            <div className="space-y-4 border-y border-gray-100 py-6">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Pickup :</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">12 Maple Street, Brookview, CA 92714</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Drop off :</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">15 Maple Street, Brookview, CA 92714</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 shrink-0 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">2 Packages</span>
            </div>
          </div>
        </Card>

        {/* Review Section */}
        <div className="pt-6 bg-white mt-8 shadow-md p-8 rounded-lg">
          <p className="mb-3 text-sm font-semibold text-gray-600">Leave a Review</p>
          <div className="mb-5 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-transform active:scale-95 ${
                  star <= rating ? "text-yellow-400" : "text-gray-200"
                }`}
              >
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Write your experience here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] resize-none border-gray-100 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-gray-300"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="mt-6 w-full rounded-lg bg-[#31B8FA] hover:bg-[#31B8FA]/90 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50 md:w-auto md:px-8"
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}