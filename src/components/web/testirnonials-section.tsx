import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    text: "Our ad campaigns finally speak to the right audience with clarity resulting in high CTR and ROI.",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    name: "Kathrine Katija",
    title: "Marketing Manager, Creative Agency",
    rating: 5,
  },
  {
    id: 2,
    text: "The content strategy helped us increase engagement and conversions consistently.",
    description:
      "Lorem Ipsum has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    name: "John Anderson",
    title: "Founder, Growth Studio",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-[#E5F7FF] py-12 sm:py-16 lg:py-20 mt-20">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-[#131313] mb-4">
            Honest Feedback From Valued People
          </h2>
          <p className="text-sm sm:text-base text-[#131313] max-w-xl mx-auto">
            Real feedback from businesses and individuals who trusted my content to elevate their brands.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className=" rounded-lg p-5 sm:p-6 lg:p-8"
            >
              <p className="font-medium text-[#131313] mb-3 text-sm sm:text-base">
                {testimonial.text}
              </p>

              <p className="text-xs sm:text-sm text-[#424242] leading-relaxed mb-6">
                {testimonial.description}
              </p>

              {/* Author */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-dashed pt-4">
                <div>
                  <p className="font-medium text-base sm:text-lg text-[#131313]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs sm:text-sm text-[#424242] max-w-md">
                    {testimonial.title}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#3BBAEB] text-[#3BBAEB]"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#131313]">
                    ({testimonial.rating})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg px-4 sm:px-6 py-5 max-w-6xl mx-auto border border-[#B6B6B6]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-semibold text-[#131313]">
                1000+
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Happy Customers
              </p>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-semibold text-[#131313] flex items-center justify-center gap-1">
                4.9
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Average Rating
              </p>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-semibold text-[#131313]">
                98%
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Would Recommend
              </p>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-semibold text-[#131313]">
                24hr
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Report Delivery
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
