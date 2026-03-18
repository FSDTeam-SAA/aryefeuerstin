export default function PhysicalReturnInfo() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="w-full mx-auto border-2 border-[#31B8FA] rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 w-full mx-auto">
            {/* Left Card */}
            <div className="text-start">
              <h3 className="text-2xl md:text-4xl font-semibold text-[#131313] mb-4 text-balance">
              What is a Printed Return Label?
              </h3>
              <p className="text-sm md:text-base text-[#424242] leading-relaxed text-balance text- mt-6">
               A printed return label is only needed if your return requires a physical shipping label. This applies when you don&apos;`t already have a label and we need to print one for you. Most returns can be completed by uploading a barcode or digital label. The $3.50 fee only applies when printing is required.
              </p>
            </div>

            {/* Right Card */}
            <div className="">
              <h3 className="text-2xl md:text-4xl font-semibold text-[#131313] mb-4 text-balance">
                What is a Retail Store Return?
              </h3>
              <p className="text-sm md:text-base text-[#424242] leading-relaxed text-balance  mt-6">
               A retail store return is required when an item must be returned in person to the store with the original receipt, rather than using a label or barcode. Availability may vary by location. For pricing, please contact our customer service department.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
