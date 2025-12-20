import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms Of Service - Wellness Made Clear",
  description: "Terms of Service for Wellness Made Clear",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen py-8 px-4 sm:py-12 md:py-16">
      <article className=" max-w-7xl mx-auto">
        <header className="mb-8 text-center sm:mb-12">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-[#131313] sm:text-4xl">Terms Of Service</h1>
          <p className="text-sm text-gray-600">Effective Date: July 7, 2025</p>
        </header>

        <div className="space-y-8 text-gray-800">
          {/* Welcome Section */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">Welcome</h2>
            <p className="leading-relaxed text-sm sm:text-base">
              Welcome to Wellness Made Clear, a digital platform designed to provide clarity and guidance in your health
              and wellness journey. By accessing or using our website, services, or content, you agree to the following
              Terms of Service.
            </p>
          </section>

          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">1. Acceptance of Terms</h2>
            <p className="mb-2 leading-relaxed text-sm sm:text-base">
              By accessing or using the Wellness Made Clear website, blog, products, coaching services, or community
              forums, you agree to comply with and be bound by these Terms of Service and our Privacy Policy.
            </p>
            <p className="leading-relaxed text-sm sm:text-base">
              If you do not agree to these terms, please do not visit our services.
            </p>
          </section>

          {/* 2. Health Disclaimer */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">2. Health Disclaimer</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">
              Wellness Made Clear provides information and resources for general wellness education and personal growth.
            </p>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">
              Our coaches are not licensed medical professionals.
            </p>
            <ul className="ml-6 space-y-1 list-disc text-sm sm:text-base">
              <li>The content is for educational and informational purposes</li>
              <li>Always consult with a physician or qualified health professional before</li>
            </ul>
          </section>

          {/* 3. Services Offered */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">3. Services Offered</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">Wellness Made Clear Offers:</p>
            <ul className="ml-6 space-y-1 list-disc text-sm sm:text-base">
              <li>Digital health and wellness content on lifestyle, nutrition, and holistic health</li>
              <li>Digital blog and educational content</li>
              <li>Affiliate links to recommended third-party products</li>
              <li>Optional paid community or coaching services</li>
              <li>Community discussion forums and group support features</li>
            </ul>
            <p className="mt-3 leading-relaxed text-sm sm:text-base">
              We reserve the right to modify or discontinue any service at our discretion without notice.
            </p>
          </section>

          {/* 4. User Responsibilities */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">4. User Responsibilities</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">As a user, you agree:</p>
            <ul className="ml-6 space-y-1 list-disc text-sm sm:text-base">
              <li>Not to misuse, hack, or damage the website or services</li>
              <li>Not to post harmful, false, misleading, or inappropriate content</li>
              <li>To be respectful and constructive in all community spaces</li>
              <li>To only use the content for personal, non-commercial purposes unless otherwise permitted</li>
            </ul>
          </section>

          {/* 5. Intellectual Property */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">5. Intellectual Property</h2>
            <p className="leading-relaxed text-sm sm:text-base">
              All content on Wellness Made Clear, including logos, articles, videos, and graphics, is protected under
              copyright and intellectual property laws. You may not reuse, reproduce, or distribute our content without
              written permission.
            </p>
          </section>

          {/* 6. Payments & Refunds */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">6. Payments & Refunds</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">
              If you purchase coaching sessions, products, or subscriptions:
            </p>
            <ul className="ml-6 space-y-1 list-disc text-sm sm:text-base">
              <li>All prices are clearly listed before checkout</li>
              <li>Payments are processed securely through trusted payment processors</li>
              <li>Refund policies vary by product or service. You may request a refund if unsatisfied or unexpired</li>
              <li>Coaching sessions and digital downloads are non-refundable unless otherwise stated</li>
            </ul>
          </section>

          {/* 7. Third-Party Links */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">7. Third-Party Links</h2>
            <p className="leading-relaxed text-sm sm:text-base">
              Our site may contain affiliate links or links to third-party services. We are not responsible for the
              content, policies, or products of those external sites.
            </p>
          </section>

          {/* 8. Termination */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">8. Termination</h2>
            <p className="leading-relaxed text-sm sm:text-base">
              We may suspend or terminate your access to the site if you violate these terms or act in a way that harms
              the community, brand, or other users.
            </p>
          </section>

          {/* 9. Limitation of Liability */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">9. Limitation of Liability</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">
              Wellness Made Clear, its team, and affiliates are not liable for:
            </p>
            <ul className="ml-6 space-y-1 list-disc text-sm sm:text-base">
              <li>Any health issues, injuries, or damages resulting from following content on our site</li>
              <li>&apos;Personal issues, service interruptions, or errors on the platform</li>
            </ul>
            <p className="mt-3 leading-relaxed text-sm sm:text-base">Use of our site is at your own risk.</p>
          </section>

          {/* 10. Changes to Terms */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">10. Changes to Terms</h2>
            <p className="leading-relaxed text-sm sm:text-base">
              We may update these Terms of Service from time to time. Any changes will be posted here with the updated
              Effective Date. Continued use of the site after changes means you accept the updated terms.
            </p>
          </section>

          {/* 11. Contact Us */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">11. Contact Us</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">If you have questions about these Terms:</p>
            <div className="space-y-1 text-sm sm:text-base">
              <p className="leading-relaxed">
                📧{" "}
                <a href="mailto:info@wellnessmadeclear.com" className="text-blue-600 hover:underline">
                  info@wellnessmadeclear.com
                </a>
              </p>
              <p className="leading-relaxed">📍 Mailing Address: 14021 Haylam Drive #2651, Chino Hills, CA 91709</p>
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}
