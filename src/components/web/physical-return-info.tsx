export default function PhysicalReturnInfo() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto border-2 border-[#3BBAEB] rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Card */}
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-balance">
                What is a Physical Return Label?
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed text-balance">
                A physical return label is only needed if the store requires a printed label for your return. Most
                returns are completed by uploading a barcode or digital label, so the $8 fee applies only when printing
                is necessary.
              </p>
            </div>

            {/* Right Card */}
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-balance">
                What is a Physical Receipt Return?
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed text-balance">
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
