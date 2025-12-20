export default function PhysicalReturnInfo() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="w-full mx-auto border-2 border-[#31B8FA] rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            {/* Left Card */}
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-semibold text-[#131313] mb-4 text-balance">
                What is a Physical Return Label?
              </h3>
              <p className="text-sm md:text-base text-[#424242] leading-relaxed text-balance text-center mt-6">
                A physical return label is only needed if the store requires a printed label for your return. Most
                returns are completed by uploading a barcode or digital label, so the $8 fee applies only when printing
                is necessary.
              </p>
            </div>

            {/* Right Card */}
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-semibold text-[#131313] mb-4 text-balance">
                What is a Physical Receipt Return?
              </h3>
              <p className="text-sm md:text-base text-[#424242] leading-relaxed text-balance text-center mt-6">
                A physical receipt return is required only when the store needs the original paper receipt instead of a
                return label or barcode. The $8 fee applies only when this paper receipt must be handed in at the store.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
