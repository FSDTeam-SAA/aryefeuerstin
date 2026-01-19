
import HelpSection from "@/components/web/help-section";
import HeroSection from "@/components/web/hero-section";
import PhysicalReturnInfo from "@/components/web/physical-return-info";
import SubcriptionAndderiver from "@/components/web/SubcriptionAndderiver";
import TestimonialsSection from "@/components/web/testirnonials-section";


export default function Page() {
  
  return (
    <div className="min-h-screen">
     
      <main>
        <HeroSection />
        <SubcriptionAndderiver/>
        <PhysicalReturnInfo />
        <HelpSection />
        <TestimonialsSection />
      </main>

    </div>
  )
}
