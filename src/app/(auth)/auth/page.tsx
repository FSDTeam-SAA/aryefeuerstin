
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
    return (
        <div className="relative flex h-screen items-center justify-center overflow-hidden">
            {/* Background image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/image/regsiter.jpg')",
                }}
            >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 text-center">
                {/* Welcome Text */}
                <div className="mb-8 space-y-2 md:mb-5">
                    <h1 className="text-4xl font-semibold text-white sm:text-5xl md:text-6xl">Welcome!</h1>
                    <p className="text-base text-white/90 sm:text-lg md:text-xl">Please login here</p>
                </div>

                {/* Logo */}
                <div className="mb-8 md:mb-12 w-[345px] lg:h-[440px] h-[340px]">
                    <Image src="/logo.png" alt="Logo" width={1000} height={1000} className="w-full h-full object-cover" />
                </div>



                {/* Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="min-w-[180px] bg-[#31B8FA] px-6 h-[48px] text-sm font-medium text-white hover:bg-[#31B8FA]/90 sm:min-w-[200px] sm:px-8 sm:text-base   "
                    >
                        <Link href="/auth/register/user-register">
                            User Registration
                        </Link>
                    </Button>

                    <Button
                        asChild
                        size="lg"
                        className="min-w-[180px] border-2 border-[#31B8FA] bg-transparent px-6 h-[48px] text-sm font-medium text-white hover:bg-transparent  hover:text-white sm:min-w-[200px] sm:px-8 sm:text-base"
                    >
                        <Link href="/auth/register/driver-register">
                            Driver Registration
                        </Link>
                    </Button>


                    
                </div>
            </div>
        </div>
    )
}
