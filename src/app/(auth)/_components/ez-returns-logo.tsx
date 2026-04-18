import { cn } from "@/lib/utils"
import Image from "next/image"

export function EzReturnsLogo() {
  return (
    <div className={cn("flex flex-col items-center gap-2")}>
     <Image src={"/logo.png"} width={900} height={900} alt="Ez Returns Logo" className="w-[460px] h-[460px]  object-cover" />
    </div>
  )
}
