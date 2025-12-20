
import HelpSection from "@/components/web/help-section";
import HeroSection from "@/components/web/hero-section";
import PhysicalReturnInfo from "@/components/web/physical-return-info";
import SubscriptionPackages from "@/components/web/subscription -packages";
import TestimonialsSection from "@/components/web/testirnonials-section";


export default function Page() {
  return (
    <div className="min-h-screen">
     
      <main>
        <HeroSection />
        <SubscriptionPackages />
        <PhysicalReturnInfo />
        <HelpSection />
        <TestimonialsSection />
      </main>

    </div>
  )
}
