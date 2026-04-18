import HelpSection from "@/components/web/help-section";
import HeroSection from "@/components/web/hero-section";
import PhysicalReturnInfo from "@/components/web/physical-return-info";
import SubcriptionAndderiver from "@/components/web/SubcriptionAndderiver";
import TestimonialsSection from "@/components/web/testirnonials-section";
import LoginSuccessModal from "@/components/shared/LoginSuccessModal";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div></div>}>
        <main>
          <HeroSection />
          <SubcriptionAndderiver />
          <PhysicalReturnInfo />
          <HelpSection />
          <TestimonialsSection />
        </main>

        {/* ✅ Client Modal */}
        <LoginSuccessModal />
      </Suspense>
    </div>
  );
}
