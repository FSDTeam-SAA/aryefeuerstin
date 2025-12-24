"use client"

import { useState } from "react"

import { Package } from "lucide-react"
import { StepIndicator } from "./_components/StepIndicator"
import { CustomerInfoForm } from "./_components/CustomerInfoForm"
import { PackageDetailsForm } from "./_components/PackageDetailsForm"
import { PaymentForm } from "./_components/PaymentForm"

type Step = 1 | 2 | 3

export default function PackageReturnService() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: "",
    lastName: "",
    pickupAddress: "",
    phoneNumber: "",
    email: "",
    zipCode: "",
    street: "",
    city: "",
    pickupInstructions: "",
    rushService: false,
    // Package Details
    returnStore: "",
    numberOfPackages: 1,
    packages: [] as Array<{ number: string; barcode: string }>,
    addAnotherStore: false,
    printShippingLabel: false,
    hasReceipt: false,
    creditCardLast4: "",
    needShippingLabel: false,
    pickupAddress2: "",
    productLength: "",
    productWidth: "",
    productHeight: "",
    productWeight: "",
    leaveMessage: false,
    message: "",
    // Payment
    selectedPackage: "",
  })


  //eslint-disable-next-line
  const handleNext = (stepData: any) => {
    setFormData({ ...formData, ...stepData })
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className=" container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#31B8FA] mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Customer Package Return Service</h1>
          <p className="text-sm text-gray-500 mt-1">Complete the form below to schedule your package return pickup</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mt-8">
          {currentStep === 1 && <CustomerInfoForm initialData={formData} onNext={handleNext} />}
          {currentStep === 2 && <PackageDetailsForm initialData={formData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && (
            <PaymentForm
              initialData={formData}
              onBack={handleBack}
              onSubmit={(data) => {
                console.log("Form submitted:", { ...formData, ...data })
                alert("Form submitted successfully!")
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
