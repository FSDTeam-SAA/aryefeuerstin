import Image from "next/image"

interface NavbarProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  height?: string;
}

export default function Hero({ title, description, imageUrl, height }: NavbarProps) {
  return (
    <section
      className="relative w-full"
      style={{ height }} 
    >
      <Image
        src={imageUrl || "/assets/hero-aboutbg.jpg"}
        alt="Hero background"
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-[#0000004D]/50" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          {title}
        </h1>

        <p className="text-white text-sm md:text-lg lg:text-xl max-w-4xl leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  )
}
