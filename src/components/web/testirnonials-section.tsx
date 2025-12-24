// import { Star } from "lucide-react"

// const testimonials = [
//   {
//     id: 1,
//     text: "Our ad campaigns finally speak to the right audience with clarity resulting in high CTR and ROI.",
//     description:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
//     name: "Kathrine Katija",
//     title: "Marketing Manager, Creative Agency",
//     rating: 5,
//   },
//   {
//     id: 2,
//     text: "The content strategy helped us increase engagement and conversions consistently.",
//     description:
//       "Lorem Ipsum has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
//     name: "John Anderson",
//     title: "Founder, Growth Studio",
//     rating: 5,
//   },
// ]

// export default function TestimonialsSection() {
//   return (
//     <section className="bg-[#E5F7FF] py-12 sm:py-16 lg:py-20 mt-20">
//       <div className="container mx-auto px-4">

//         {/* Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-[#131313] mb-4">
//             Honest Feedback From Valued People
//           </h2>
//           <p className="text-sm sm:text-base text-[#131313] max-w-xl mx-auto">
//             Real feedback from businesses and individuals who trusted my content to elevate their brands.
//           </p>
//         </div>

//         {/* Testimonials Grid */}
//         <div className="grid gap-6 md:grid-cols-2 mb-12">
//           {testimonials.map((testimonial) => (
//             <div
//               key={testimonial.id}
//               className=" rounded-lg p-5 sm:p-6 lg:p-8"
//             >
//               <p className="font-medium text-[#131313] mb-3 text-sm sm:text-base">
//                 {testimonial.text}
//               </p>

//               <p className="text-xs sm:text-sm text-[#424242] leading-relaxed mb-6">
//                 {testimonial.description}
//               </p>

//               {/* Author */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-dashed pt-4">
//                 <div>
//                   <p className="font-medium text-base sm:text-lg text-[#131313]">
//                     {testimonial.name}
//                   </p>
//                   <p className="text-xs sm:text-sm text-[#424242] max-w-md">
//                     {testimonial.title}
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <div className="flex gap-0.5">
//                     {Array.from({ length: testimonial.rating }).map((_, i) => (
//                       <Star
//                         key={i}
//                         className="w-4 h-4 fill-[#3BBAEB] text-[#3BBAEB]"
//                       />
//                     ))}
//                   </div>
//                   <span className="text-sm font-semibold text-[#131313]">
//                     ({testimonial.rating})
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Stats Section */}
//         <div className="bg-white rounded-lg px-4 sm:px-6 py-5 max-w-6xl mx-auto border border-[#B6B6B6]">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//             <div>
//               <p className="text-xl sm:text-2xl font-semibold text-[#131313]">
//                 1000+
//               </p>
//               <p className="text-xs sm:text-sm text-gray-600">
//                 Happy Customers
//               </p>
//             </div>

//             <div>
//               <p className="text-xl sm:text-2xl font-semibold text-[#131313] flex items-center justify-center gap-1">
//                 4.9
//                 <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//               </p>
//               <p className="text-xs sm:text-sm text-gray-600">
//                 Average Rating
//               </p>
//             </div>

//             <div>
//               <p className="text-xl sm:text-2xl font-semibold text-[#131313]">
//                 98%
//               </p>
//               <p className="text-xs sm:text-sm text-gray-600">
//                 Would Recommend
//               </p>
//             </div>

//             <div>
//               <p className="text-xl sm:text-2xl font-semibold text-[#131313]">
//                 24hr
//               </p>
//               <p className="text-xs sm:text-sm text-gray-600">
//                 Report Delivery
//               </p>
//             </div>
//           </div>
//         </div>

//       </div>
//     </section>
//   )
// }

"use client";

import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// ================= TYPES =================
interface Review {
  rating: number;
  comment: string;
  reviewedAt: string;
}

interface ReviewItem {
  review: Review;
  _id: string;
  firstName: string;
  lastName: string;
  returnStore: string;
  status: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    data: ReviewItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalData: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// ================= FETCH FUNCTION =================
const fetchReviews = async (): Promise<ReviewItem[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${baseUrl}/return-order/reviews`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const result: ApiResponse = await response.json();

  if (!result.status) {
    throw new Error(result.message || "Failed to load reviews");
  }

  return result.data.data;
};

// ================= COMPONENT =================
export default function TestimonialsSection() {
  const {
    data: testimonials = [],
    isLoading,
    isError,
  } = useQuery<ReviewItem[]>({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

  // ================= STATS =================
  const totalReviews = testimonials.length;

  const averageRating =
    totalReviews > 0
      ? testimonials.reduce((sum, t) => sum + t.review.rating, 0) / totalReviews
      : 0;

  const fiveStarCount = testimonials.filter(
    (t) => t.review.rating === 5
  ).length;

  const recommendPercentage =
    totalReviews > 0
      ? Math.round((fiveStarCount / totalReviews) * 100)
      : 0;

  return (
    <section className="bg-[#E5F7FF] py-12 sm:py-16 lg:py-20 mt-20">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-[#131313] mb-4">
            Honest Feedback From Valued Customers
          </h2>
          <p className="text-sm sm:text-base text-[#131313] max-w-xl mx-auto">
            Real feedback from customers who used our return service.
          </p>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 animate-pulse shadow-sm"
              >
                <div className="h-4 bg-gray-200 rounded mb-3 w-11/12" />
                <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                <div className="h-4 bg-gray-200 rounded mb-6 w-4/5" />

                <div className="border-t pt-4 flex justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="w-4 h-4 bg-gray-200 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="text-center py-10 text-red-600">
            Failed to load reviews. Please try again later.
          </div>
        )}

        {/* REVIEWS */}
        {!isLoading && !isError && testimonials.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className=" rounded-lg p-6 "
              >
                <p className="font-medium text-[#131313] mb-3">
                  {testimonial.review.comment}
                </p>

                <p className="text-sm text-[#424242] mb-6">
                  Returned items from{" "}
                  <strong>{testimonial.returnStore}</strong>
                </p>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-lg text-[#131313]">
                      {testimonial.firstName} {testimonial.lastName}
                    </p>
                    <p className="text-sm text-[#424242]">
                      Verified Customer
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({
                        length: testimonial.review.rating,
                      }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#3BBAEB] text-[#3BBAEB]"
                        />
                      ))}
                    </div>
                    <span className="font-semibold">
                      ({testimonial.review.rating})
                    </span> 
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && !isError && testimonials.length === 0 && (
          <div className="text-center py-10 text-gray-600">
            No reviews yet.
          </div>
        )}

        {/* STATS */}
        <div className="bg-white rounded-lg px-6 py-5 max-w-6xl mx-auto border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-semibold">1000+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>

            <div>
              <p className="text-2xl font-semibold flex justify-center gap-1">
                {averageRating.toFixed(1)}
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>

            <div>
              <p className="text-2xl font-semibold">
                {recommendPercentage}%
              </p>
              <p className="text-sm text-gray-600">Would Recommend</p>
            </div>

            <div>
              <p className="text-2xl font-semibold">24hr</p>
              <p className="text-sm text-gray-600">Report Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
