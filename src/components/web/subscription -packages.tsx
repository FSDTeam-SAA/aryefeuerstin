


"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SubscriptionSkeleton } from "./SubscriptionSkeleton";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import LoginRequiredModal from "./LoginRequiredModal";


// --- Types ---
interface Plan {
  _id: string;
  title: string;
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
  status: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: { items: Plan[] };
}

interface CheckoutResponse {
  status: boolean;
  message: string;
  data: { url: string };
}

// --- API Fetchers ---
const fetchPlans = async (): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/plan`
  );
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

export default function SubscriptionPackages() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // 1️⃣ Fetch Plans
  const { data, isLoading, isError } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  // 2️⃣ Buy Plan Mutation
  const mutation = useMutation({
    mutationFn: createCheckoutSession,
    onMutate: () => {
      toast.loading("Creating checkout session...", { id: "checkout" });
    },
    onSuccess: (response) => {
      if (response.data?.url) {
        toast.success("Redirecting to payment...", { id: "checkout" });
        window.location.href = response.data.url;
      } else {
        toast.error("Invalid response from server", { id: "checkout" });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong", {
        id: "checkout",
      });
    },
  });

  const handleJoinNow = (planId: string) => {
    if (!session) {
      setLoginModalOpen(true);
      return;
    }

    mutation.mutate({ planId, token });
  };

  const plans = data?.data?.items || [];

  return (
    <>
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#131313] mb-4">
              Subscription Packages
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <SubscriptionSkeleton key={i} />
              ))
            ) : isError ? (
              <div className="col-span-full text-center text-red-500">
                Failed to load packages.
              </div>
            ) : (
              plans.map((pkg) => (
                <div
                  key={pkg._id}
                  className="border-2 border-[#3258DA] rounded-lg overflow-hidden flex flex-col"
                >
                  <div className="bg-black text-white p-6 text-center">
                    <h3 className="font-semibold text-2xl uppercase">
                      {pkg.title}
                    </h3>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex justify-center mb-6 text-center">
                      <div>
                        <h4 className="text-[28px] font-semibold text-[#131313] mb-1">
                          {/* ${pkg.price} */} {pkg.name}
                        </h4>
                        {/* <p className="text-base text-[#424242]">
                          {pkg.name}
                        </p> */}
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs font-medium text-[#4338CA] mb-3 text-center bg-[#EEF2FF] py-2 uppercase">
                        THIS PLAN INCLUDES
                      </p>
                      <ul className="space-y-2 mt-5">
                        {pkg.features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm font-normal text-[#000000] flex items-start gap-2"
                          >
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      disabled={mutation.isPending}
                      onClick={() => handleJoinNow(pkg._id)}
                      className="bg-[#31B8FA] hover:bg-[#2BA5D6]/90 text-white h-[51px] rounded-[8px] w-full mt-auto text-sm py-5"
                    >
                      {mutation.isPending &&
                      (mutation.variables as { planId: string })?.planId ===
                        pkg._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}

                      {pkg.price === 0
                        ? "Request Now"
                        : `Join Now - $${pkg.price}/${
                            pkg.billingCycle === "monthly" ? "mo" : "yr"
                          }`}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 🔐 Login Required Modal */}
      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
