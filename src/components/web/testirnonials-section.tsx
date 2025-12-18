import { Star, MessageCircle } from "lucide-react"

const testimonials = [
  {
    id: 1,
    text: "Our ad campaigns finally speak to the right audience with clarity resulting in high CTR and ROI.",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s with the release of Letraset electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset",
    name: "Kathrine Katija",
    title:
      "electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset",
    rating: 5,
  },
  {
    id: 2,
    text: "Our ad campaigns finally speak to the right audience with clarity resulting in high CTR and ROI.",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s with the release of Letraset electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset",
    name: "Kathrine Katija",
    title:
      "electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-[#D8EFF5] py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-balance">
            Honest Feedback From Valued People
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto text-balance">
            Real feedback from businesses and individuals who trusted my content to elevate their brands. Their words
            reflect the impact of my work
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg p-6 md:p-8 relative">
              {/* Quote Icon */}
              <div className="absolute -top-3 right-8 w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                S
              </div>

              <p className="font-semibold text-gray-900 mb-3 text-sm md:text-base">{testimonial.text}</p>
              <p className="text-xs md:text-sm text-gray-600 mb-4 leading-relaxed">{testimonial.description}</p>

              {/* Author Info */}
              <div className="border-t border-dashed border-gray-300 pt-4">
                <p className="font-bold text-gray-900 mb-1">{testimonial.name}</p>
                <p className="text-xs text-gray-600 mb-2">{testimonial.title}</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#3BBAEB] text-[#3BBAEB]" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">({testimonial.rating})</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#3BBAEB] flex items-center justify-center relative">
              <MessageCircle className="w-6 h-6 text-white" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FF0080] rounded-full flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">1000+</p>
              <p className="text-xs md:text-sm text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-1">
                4.9
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </p>
              <p className="text-xs md:text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">98%</p>
              <p className="text-xs md:text-sm text-gray-600">Would Recommend</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">24hr</p>
              <p className="text-xs md:text-sm text-gray-600">Report Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
