// "use client";

// import { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { SubscriptionSkeleton } from "./SubscriptionSkeleton";
// import { Loader2 } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import LoginRequiredModal from "./LoginRequiredModal";

// // -------------------- Types --------------------
// interface Plan {
//   _id: string;
//   title: string;
//   name: string;
//   price: number;
//   billingCycle: string;
//   features: string[];
//   status: string;
// }

// interface ApiResponse {
//   status: boolean;
//   message: string;
//   data: { items: Plan[] };
// }

// interface CheckoutResponse {
//   status: boolean;
//   message: string;
//   data: { url: string };
// }

// // -------------------- Color Helper --------------------
// const packageColors = [
//   {
//     border: "border-[#22C55E]",
//     header: "bg-gradient-to-r from-[#22C55E] to-[#16A34A]",
//     button: "bg-[#22C55E] hover:bg-[#16A34A]",
//   },
//   {
//     border: "border-[#3B82F6]",
//     header: "bg-gradient-to-r from-[#3B82F6] to-[#2563EB]",
//     button: "bg-[#3B82F6] hover:bg-[#2563EB]",
//   },
//   {
//     border: "border-[#A855F7]",
//     header: "bg-gradient-to-r from-[#A855F7] to-[#7E22CE]",
//     button: "bg-[#9333EA] hover:bg-[#7E22CE]",
//   },
//   {
//     border: "border-[#F59E0B]",
//     header: "bg-gradient-to-r from-[#F59E0B] to-[#B45309]",
//     button: "bg-[#D97706] hover:bg-[#B45309]",
//   },
//   {
//     border: "border-[#EF4444]",
//     header: "bg-gradient-to-r from-[#EF4444] to-[#B91C1C]",
//     button: "bg-[#EF4444] hover:bg-[#B91C1C]",
//   },
// ];

// const getColorByIndex = (index: number) =>
//   packageColors[index % packageColors.length];

// // -------------------- API --------------------
// const fetchPlans = async (): Promise<ApiResponse> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/plan`
//   );
//   if (!response.ok) throw new Error("Failed to fetch plans");
//   return response.json();
// };

// const createCheckoutSession = async ({
//   planId,
//   token,
// }: {
//   planId: string;
//   token?: string;
// }): Promise<CheckoutResponse> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription/buy/${planId}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//     }
//   );

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || "Failed to create checkout session");
//   }

//   return response.json();
// };

// // -------------------- Component --------------------
// export default function SubscriptionPackages() {
//   const { data: session } = useSession();
//   const token = session?.accessToken;

//   const [loginModalOpen, setLoginModalOpen] = useState(false);

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["plans"],
//     queryFn: fetchPlans,
//   });

//   const mutation = useMutation({
//     mutationFn: createCheckoutSession,
//     onMutate: () => {
//       toast.loading("Creating checkout session...", { id: "checkout" });
//     },
//     onSuccess: (response) => {
//       if (response.data?.url) {
//         toast.success("Redirecting to payment...", { id: "checkout" });
//         window.location.href = response.data.url;
//       } else {
//         toast.error("Invalid response from server", { id: "checkout" });
//       }
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || "Something went wrong", {
//         id: "checkout",
//       });
//     },
//   });

//   const handleJoinNow = (planId: string) => {
//     if (!session) {
//       setLoginModalOpen(true);
//       return;
//     }
//     mutation.mutate({ planId, token });
//   };

//   const plans = data?.data?.items || [];

//   return (
//     <>
//       <section className="bg-white py-12 md:py-16 lg:py-20">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#131313]">
//               Subscription Packages
//             </h2>
//           </div>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//             {isLoading ? (
//               Array.from({ length: 4 }).map((_, i) => (
//                 <SubscriptionSkeleton key={i} />
//               ))
//             ) : isError ? (
//               <div className="col-span-full text-center text-red-500">
//                 Failed to load packages.
//               </div>
//             ) : (
//               plans.map((pkg, index) => {
//                 const colors = getColorByIndex(index);
//                 const isLastPackage = index === plans.length - 1;

//                 return (
//                   <div
//                     key={pkg._id}
//                     className={`
//                       border-2 ${colors.border}
//                       rounded-xl overflow-hidden
//                       flex flex-col
//                       shadow-sm hover:shadow-md
//                       transition-shadow duration-300
//                       bg-white
//                       w-full max-w-[340px] mx-auto
//                     `}
//                   >
//                     {/* Header */}
//                     <div
//                       className={`${colors.header} text-white p-7 text-center`}
//                     >
//                       <h3 className="font-bold text-2xl uppercase tracking-wide">
//                         {pkg.title}
//                       </h3>
//                     </div>

//                     <div className="p-6 flex-1 flex flex-col">
//                       <p className="text-xs font-semibold text-[#4338CA] mb-4 text-center bg-[#EEF2FF] py-2 rounded-md uppercase tracking-wider">
//                         THIS PLAN INCLUDES
//                       </p>

//                       <ul className="space-y-3 mb-8 flex-1">
//                         {pkg.features.map((feature, i) => (
//                           <li
//                             key={i}
//                             className="text-[15px] flex items-start gap-2.5 leading-relaxed"
//                           >
//                             <span className="text-yellow-500 text-lg mt-0.5">
//                               ⭐
//                             </span>
//                             <span>{feature}</span>
//                           </li>
//                         ))}
//                       </ul>

//                       <Button
//                         disabled={isLastPackage || mutation.isPending}
//                         onClick={() => {
//                           if (!isLastPackage) {
//                             handleJoinNow(pkg._id);
//                           }
//                         }}
//                         className={`
//                           mt-auto
//                           h-[52px]
//                           text-base font-medium
//                           rounded-lg
//                           w-full
//                           ${
//                             isLastPackage
//                               ? "bg-orange-500 hover:bg-orange-500 cursor-not-allowed"
//                               : colors.button
//                           }
//                         `}
//                       >
//                         {isLastPackage ? (
//                           "Coming Soon"
//                         ) : mutation.isPending &&
//                           (mutation.variables as { planId: string })
//                             ?.planId === pkg._id ? (
//                           <>
//                             <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                             Processing...
//                           </>
//                         ) : pkg.price === 0 ? (
//                           "Request Now"
//                         ) : (
//                           `Join Now - $${pkg.price}/${
//                             pkg.billingCycle === "monthly" ? "mo" : "-"
//                           }`
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </section> 

//       <LoginRequiredModal
//         open={loginModalOpen}
//         onClose={() => setLoginModalOpen(false)}
//       />
//     </>
//   );
// }


"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SubscriptionSkeleton } from "./SubscriptionSkeleton";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import LoginRequiredModal from "./LoginRequiredModal";

// -------------------- Types --------------------
interface Plan {
  _id: string;
  title: string;
  name: string;
  price: number;
  billingCycle: string;
  displayFeatures: string[];    // ← API থেকে আসা আসল ফিল্ড
  status: string;
  // যদি আরো ফিল্ড লাগে তাহলে এখানে যোগ করতে পারো
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    items: Plan[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface CheckoutResponse {
  status: boolean;
  message: string;
  data: { url: string };
}

// -------------------- Color Helper --------------------
const packageColors = [
  {
    border: "border-[#22C55E]",
    header: "bg-gradient-to-r from-[#22C55E] to-[#16A34A]",
    button: "bg-[#22C55E] hover:bg-[#16A34A]",
  },
  {
    border: "border-[#3B82F6]",
    header: "bg-gradient-to-r from-[#3B82F6] to-[#2563EB]",
    button: "bg-[#3B82F6] hover:bg-[#2563EB]",
  },
  {
    border: "border-[#A855F7]",
    header: "bg-gradient-to-r from-[#A855F7] to-[#7E22CE]",
    button: "bg-[#9333EA] hover:bg-[#7E22CE]",
  },
  {
    border: "border-[#F59E0B]",
    header: "bg-gradient-to-r from-[#F59E0B] to-[#B45309]",
    button: "bg-[#D97706] hover:bg-[#B45309]",
  },
  {
    border: "border-[#EF4444]",
    header: "bg-gradient-to-r from-[#EF4444] to-[#B91C1C]",
    button: "bg-[#EF4444] hover:bg-[#B91C1C]",
  },
];

const getColorByIndex = (index: number) =>
  packageColors[index % packageColors.length];

// -------------------- API --------------------
const fetchPlans = async (): Promise<ApiResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/plan`);
  if (!response.ok) throw new Error("Failed to fetch plans");
  return response.json();
};

const createCheckoutSession = async ({
  planId,
  token,
}: {
  planId: string;
  token?: string;
}): Promise<CheckoutResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription/buy/${planId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create checkout session");
  }

  return response.json();
};

// -------------------- Component --------------------
export default function SubscriptionPackages() {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const mutation = useMutation<CheckoutResponse, Error, { planId: string; token?: string }>({
    mutationFn: createCheckoutSession,
    onMutate: () => {
      toast.loading("Creating checkout session...", { id: "checkout" });
    },
    onSuccess: (response) => {
      if (response?.data?.url) {
        toast.success("Redirecting to payment...", { id: "checkout" });
        window.location.href = response.data.url;
      } else {
        toast.error("Invalid response from server", { id: "checkout" });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong", { id: "checkout" });
    },
  });

  const handleJoinNow = (planId: string) => {
    if (!session) {
      setLoginModalOpen(true);
      return;
    }
    mutation.mutate({ planId, token });
  };

  const plans = data?.data?.items ?? [];

  return (
    <>
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#131313]">
              Subscription Packages
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SubscriptionSkeleton key={i} />)
            ) : isError ? (
              <div className="col-span-full text-center text-red-500">
                Failed to load packages.
              </div>
            ) : plans.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No subscription plans available at the moment.
              </div>
            ) : (
              plans.map((pkg, index) => {
                const colors = getColorByIndex(index);
                const isLastPackage = index === plans.length - 1;

                return (
                  <div
                    key={pkg._id}
                    className={`
                      border-2 ${colors.border}
                      rounded-xl overflow-hidden
                      flex flex-col
                      shadow-sm hover:shadow-md
                      transition-shadow duration-300
                      bg-white
                      w-full max-w-[340px] mx-auto
                    `}
                  >
                    <div className={`${colors.header} text-white p-7 text-center`}>
                      <h3 className="font-bold text-2xl uppercase tracking-wide">
                        {pkg.title}
                      </h3>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-xs font-semibold text-[#4338CA] mb-4 text-center bg-[#EEF2FF] py-2 rounded-md uppercase tracking-wider">
                        THIS PLAN INCLUDES
                      </p>

                      <ul className="space-y-3 mb-8 flex-1">
                        {(pkg.displayFeatures ?? []).map((feature, i) => (
                          <li
                            key={i}
                            className="text-[15px] flex items-start gap-2.5 leading-relaxed"
                          >
                            <span className="text-yellow-500 text-lg mt-0.5">⭐</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        disabled={isLastPackage || mutation.isPending}
                        onClick={() => !isLastPackage && handleJoinNow(pkg._id)}
                        className={`
                          mt-auto h-[52px] text-base font-medium rounded-lg w-full
                          ${isLastPackage
                            ? "bg-orange-500 hover:bg-orange-500 cursor-not-allowed"
                            : colors.button
                          }
                        `}
                      >
                        {isLastPackage ? (
                          "Coming Soon"
                        ) : mutation.isPending && mutation.variables?.planId === pkg._id ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : pkg.price === 0 ? (
                          "Request Now"
                        ) : (
                          `Join Now - $${pkg.price}/${pkg.billingCycle === "monthly" ? "mo" : "-"}`
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}