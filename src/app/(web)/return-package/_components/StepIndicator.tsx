import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
}

const steps = [
  { number: 1, label: "Customer info" },
  { number: 2, label: "Package Details" },
  { number: 3, label: "Payment" },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
            {/* Circle */}
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-colors",
                currentStep === step.number
                  ? "bg-[#31B8FA] text-white"
                  : currentStep > step.number
                    ? "bg-[#31B8FA] text-white"
                    : "bg-white text-gray-400 border-2 border-gray-200",
              )}
            >
              {currentStep > step.number ? <Check className="w-6 h-6" /> : `0${step.number}`}
            </div>

            {/* Label */}
            <span
              className={cn("mt-2 text-sm font-medium", currentStep >= step.number ? "text-cyan-500" : "text-gray-400")}
            >
              {step.label}
            </span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-7 left-[50%] w-full h-0.5 -z-10",
                  currentStep > step.number ? "bg-cyan-500" : "bg-gray-200",
                )}
                style={{ width: "calc(100% - 28px)", left: "calc(50% + 28px)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
