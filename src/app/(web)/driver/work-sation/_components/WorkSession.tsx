


"use client"

import { useState, useEffect } from "react"
import { CarFront } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface SessionData {
  status: "OFF_DUTY" | "ON_DUTY"
  punchInAt: string
  punchOutAt: string | null
  totalMinutes: number
  _id: string
}

export default function WorkSession() {
  const { data: session } = useSession()
  const token = session?.accessToken as string

  const [status, setStatus] = useState<"OFF_DUTY" | "ON_DUTY">("OFF_DUTY")
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  /* ---------------- LOAD FROM LOCAL STORAGE ---------------- */
  useEffect(() => {
    if (!mounted) return

    const syncSession = () => {
      const saved = localStorage.getItem("driverSession")
      if (!saved) {
        setStatus("OFF_DUTY")
        setSecondsPassed(0)
        return
      }

      const parsed: SessionData = JSON.parse(saved)
      setStatus(parsed.status)

      if (parsed.status === "ON_DUTY") {
        const start = new Date(parsed.punchInAt).getTime()
        setSecondsPassed(Math.floor((Date.now() - start) / 1000))
      }
    }

    syncSession()
    window.addEventListener("storage", syncSession)
    return () => window.removeEventListener("storage", syncSession)
  }, [mounted])

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (status !== "ON_DUTY" || !mounted) return

    const interval = setInterval(() => {
      const saved = localStorage.getItem("driverSession")
      if (!saved) return

      const parsed: SessionData = JSON.parse(saved)
      if (parsed.status === "ON_DUTY") {
        const start = new Date(parsed.punchInAt).getTime()
        setSecondsPassed(Math.floor((Date.now() - start) / 1000))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [status, mounted])

  /* ---------------- ACTIONS ---------------- */
  const handlePunchIn = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/driver-work-session/punch-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      if (!data.status) throw new Error()

      localStorage.setItem(
        "driverSession",
        JSON.stringify({
          ...data.data,
          status: "ON_DUTY",
          punchInAt: data.data.punchInAt || new Date().toISOString(),
        })
      )

      setStatus("ON_DUTY")
      setSecondsPassed(0)
      toast.success("Work started")
    } catch {
      toast.error("Punch-in failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePunchOut = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/driver-work-session/punch-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      if (!data.status) throw new Error()

      localStorage.removeItem("driverSession")
      setStatus("OFF_DUTY")
      setSecondsPassed(0)
      toast.success("Work ended")
    } catch {
      toast.error("Punch-out failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  /* ---------------- FORMAT ---------------- */
  const h = Math.floor(secondsPassed / 3600)
  const m = Math.floor((secondsPassed % 3600) / 60)
  const s = secondsPassed % 60
  const pad = (n: number) => n.toString().padStart(2, "0")

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col items-center gap-6 w-full  mx-auto p-4">
      {/* STATUS CARD */}
      <div className="w-full bg-[#E5E7EB] rounded-2xl py-10 px-6 flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-[#4B5563] text-lg font-semibold tracking-wide">
          Work Status :{" "}
          <span className="capitalize">
            {status === "ON_DUTY" ? "On Duty" : "Off Duty"}
          </span>
        </p>

        {status === "ON_DUTY" && (
          <p className="text-[#4B5563] text-lg font-semibold tracking-wide">
            Work Time : {pad(h)} : {pad(m)} : {pad(s)}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={status === "OFF_DUTY" ? handlePunchIn : handlePunchOut}
        disabled={isLoading}
        className={cn(
          "w-full  bg-[#38bdf8] hover:bg-[#0ea5e9] text-white rounded-xl py-4 flex items-center justify-center gap-3 transition-colors shadow-sm active:scale-[0.98]",
          "disabled:opacity-70 disabled:cursor-not-allowed"
        )}
      >
        <CarFront className="w-6 h-6" />
        <span className="text-lg font-medium tracking-wide">
          {isLoading
            ? "Processing..."
            : status === "OFF_DUTY"
            ? "Start Work"
            : "End Work"}
        </span>
      </button>
    </div>
  )
}
