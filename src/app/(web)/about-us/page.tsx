
import Hero from "@/components/shared/Hero"
import OUrstory from "./_components/OUrstory"
import Ourmission from "./_components/Ourmission"
import TrustUs from "./_components/TrustUs"
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
     
      <Hero title="About Us" description="At EZ Return Services, we redefine convenience with a delivery experience built on precision, reliability, and care. " imageUrl="/image/about2.png" height="483px"/>
      <div className="flex flex-col gap-20 py-16 md:gap-32 md:py-24">
        <OUrstory />
        <Ourmission />
        <TrustUs/>
      </div>
    </main>
  )
}
