/* eslint-disable */
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Package } from "lucide-react"

import { StepIndicator } from "./_components/StepIndicator"
import { CustomerInfoForm } from "./_components/CustomerInfoForm"
import { PackageDetailsForm } from "./_components/PackageDetailsForm"
import { SummaryReview } from "./_components/PaymentForm"
import { toast } from "sonner"

type Step = 1 | 2 | 3

export default function PackageReturnService() {
  const session = useSession()
  const token = session.data?.accessToken as string | undefined

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [orderId, setOrderId] = useState<string>("")
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [orderResponse, setOrderResponse] = useState<any>(null)

  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    zipCode: "",
    street: "",
    city: "",
    pickupAddress: "",
    pickupInstructions: "",
    lat: undefined,
    lng: undefined,
    rushService: false,

    stores: [],
    printShippingLabel: false,
    hasReceipt: false,
    creditCardLast4: "",
    needShippingLabel: false,
    productLength: "",
    productWidth: "",
    productHeight: "",
    productWeight: "",
    leaveMessage: false,
    message: "",
    physicalReturnLabelFiles: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const handleNext = (stepData: any) => {
    setFormData((prev: any) => ({ ...prev, ...stepData }))
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as Step)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step)
  }

  const handleSubmitAndProceed = async (finalStepData: any) => {
    const updatedData = { ...formData, ...finalStepData }
    setFormData(updatedData)

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setSubmitMessage("")

    try {
      const fullAddress =
        updatedData.pickupAddress || `${updatedData.street}, ${updatedData.city}, USA`

      const formDataToSend = new FormData()

      // Customer info
      formDataToSend.append("firstName", updatedData.firstName)
      formDataToSend.append("lastName", updatedData.lastName)
      formDataToSend.append("phone", updatedData.phoneNumber)
      formDataToSend.append("email", updatedData.email)
      formDataToSend.append("zipCode", updatedData.zipCode || "")
      formDataToSend.append("street", updatedData.street || "")
      formDataToSend.append("city", updatedData.city || "")
      formDataToSend.append("pickupInstructions", updatedData.pickupInstructions || "")
      formDataToSend.append("address", fullAddress)
      formDataToSend.append("lat", updatedData.lat?.toString() || "")
      formDataToSend.append("lng", updatedData.lng?.toString() || "")

      // Options
      formDataToSend.append("rushService", String(updatedData.rushService))
      formDataToSend.append("physicalReturnLabel", String(updatedData.printShippingLabel))
      formDataToSend.append("physicalReceipt", String(updatedData.hasReceipt))
      formDataToSend.append("returnShippingLabel", String(updatedData.needShippingLabel))
      formDataToSend.append("leaveMessage", String(updatedData.leaveMessage))

      if (updatedData.hasReceipt) {
        formDataToSend.append("creditCardLast4", updatedData.creditCardLast4 || "")
      }

      if (updatedData.needShippingLabel) {
        formDataToSend.append("pickupAndReturnAddress", fullAddress)
        formDataToSend.append("productLength", updatedData.productLength || "")
        formDataToSend.append("productWidth", updatedData.productWidth || "")
        formDataToSend.append("productHeight", updatedData.productHeight || "")
        formDataToSend.append("productWeight", updatedData.productWeight || "")
      }

      if (updatedData.leaveMessage) {
        formDataToSend.append("messageNote", updatedData.message || "")
      }

      // === FIXED & CORRECTED: Map frontend values to exact backend enum strings ===
      const storesForBackend = updatedData.stores.map((store: any) => {
        let backendStoreValue: string

        switch (store.returnStore) {
          case "STAPLES":
            backendStoreValue = "Staples"
            break
          case "KOHLS":
            backendStoreValue = "Kohl's"
            break
          case "SHEIN":
            backendStoreValue = "Shein Return"
            break
          case "TARGET":
            backendStoreValue = "Target"
            break
          case "WALMART":
            backendStoreValue = "Walmart"
            break
          case "HOME_DEPOT":
            backendStoreValue = "Home Depot"
            break
          case "UPS":
            backendStoreValue = "UPS Drop Off"
            break
          case "USPS":
            backendStoreValue = "USPS Drop Off"
            break
          case "FEDEX":
            backendStoreValue = "FedEx Drop Off"
            break
          case "OTHER":
            backendStoreValue = "Other"
            break
          default:
            backendStoreValue = "Other" // safe fallback
        }

        const isOther = store.returnStore === "OTHER"

        return {
          store: backendStoreValue,
          ...(isOther && store.otherStoreName
            ? { otherStoreName: store.otherStoreName.trim() }
            : {}),
          numberOfPackages: store.numberOfPackages,
          packages: Object.keys(store.packageNumbers || {}).map((key) => ({
            packageNumber: store.packageNumbers[key] || "",
            barcodeImages: [], // Filled separately via file upload
          })),
        }
      })

      formDataToSend.append("stores", JSON.stringify(storesForBackend))

      // Handle barcode images (data URLs → blobs → files)
      let imageIndex = 0
      const imagePromises: Promise<void>[] = []

      updatedData.stores.forEach((store: any) => {
        Object.keys(store.packageImages || {}).forEach((pkgIdx: string) => {
          ;(store.packageImages[pkgIdx] || []).forEach((dataUrl: string) => {
            const p = fetch(dataUrl)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], `barcode_${imageIndex}.jpg`, { type: "image/jpeg" })
                formDataToSend.append("barcodeImages", file)
                imageIndex++
              })
            imagePromises.push(p)
          })
        })
      })

      // Handle physical return label files
      if (updatedData.physicalReturnLabelFiles && updatedData.physicalReturnLabelFiles.length > 0) {
        updatedData.physicalReturnLabelFiles.forEach((item: { file: File }) => {
          formDataToSend.append("physicalReturnLabelFiles", item.file)
        })
      }

      await Promise.all(imagePromises)

      // API Call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order`,
        {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formDataToSend,
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Submission failed")
      }

      // SUCCESS
      setOrderId(result.data._id)
      setTotalAmount(result.data.pricing.totalAmount)
      setOrderResponse(result.data)
      setSubmitStatus("success")
      setSubmitMessage(result.message || "Return order created successfully!")
      setCurrentStep(3)
      toast.success("Return order created successfully!")
    } catch (error: any) {
      setSubmitStatus("error")
      setSubmitMessage(error.message || "Something went wrong")
      toast.error(error.message || "Submission failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-[#31B8FA] rounded-full items-center justify-center mb-4">
            <Package className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Customer Package Return Service</h1>
        </div>

        <StepIndicator currentStep={currentStep} />

        <div className="bg-white lg:p-6 p-3 mt-8 rounded-lg shadow">
          {currentStep === 1 && <CustomerInfoForm initialData={formData} onNext={handleNext} />}
          {currentStep === 2 && (
            <PackageDetailsForm
              initialData={formData}
              onSubmitAndProceed={handleSubmitAndProceed}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
          {currentStep === 3 && orderResponse && (
            <SummaryReview
              orderData={orderResponse}
              status={submitStatus}
              message={submitMessage}
              orderId={orderId}
              totalAmount={totalAmount}
            />
          )}
        </div>
      </div>
    </div>
  )
}