"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function LoginSuccessModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const session = useSession();
  const TOKEN = session?.data?.accessToken || null;

  // Banner API Call
  const { data, isLoading } = useQuery({
    queryKey: ["bannerData", TOKEN],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/banner`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch banner");
      return res.json();
    },
    enabled: open && !!TOKEN,
  });

  useEffect(() => {
    if (searchParams.get("showModal") === "true") {
      setOpen(true);
      router.replace("/");
    }
  }, [searchParams, router]);

  if (!open) return null;

  const banner = data?.data?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92dvh] md:max-h-[85dvh]">

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-10 rounded-sm bg-white/80 hover:bg-gray-100 p-1 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} strokeWidth={1.5} className="text-red-600" />
        </button>

        {/* Left Side - Content */}
        <div className="w-full md:w-1/2 px-6 py-8 sm:px-10 sm:py-10 md:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-md">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 sm:h-10 md:h-12 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 md:h-5 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 md:h-5 w-5/6 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-4 sm:mb-6 md:mb-8 text-gray-900 tracking-tight leading-tight">
                  {banner?.title}
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-2 leading-relaxed">
                  {banner?.description ||
                    "Thank you for signing in. Stay tuned for exclusive offers and"}
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-1 leading-relaxed">
                  {banner?.additionalInfo}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Image */}
        {/* On mobile: fixed height; on md+: fills the flex container height */}
        <div className="w-full md:w-1/2 h-52 sm:h-64 md:h-auto relative bg-gray-200 flex-shrink-0">
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          ) : banner?.media ? (
            <>
              {banner.media.endsWith(".mp4") ? (
                <video
                  src={banner.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={banner.media}
                  alt={banner.title || "Welcome"}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}