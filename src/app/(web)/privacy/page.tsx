import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Wellness Made Clear",
  description: "Privacy Policy for Wellness Made Clear LLC",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-8 px-4 sm:py-12 md:py-16">
      <article className="mx-auto max-w-7xl">
        <header className="mb-8 text-center sm:mb-12">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-[#131313] sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-gray-600">Wellness Made Clear LLC - Privacy Policy</p>
          <p className="text-sm text-gray-600">Effective Date: July 7, 2025</p>
        </header>

        <div className="space-y-8 text-gray-800">
          {/* Welcome Section */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">Welcome</h2>
            <p className="leading-relaxed text-sm sm:text-base text-[#424242]">
              Welcome to Wellness Made Clear LLC (&apos;Wellness Made Clear,&apos; &apos;we,&apos; &apos;us,&apos; or &apos;our&apos;). Your privacy matters.
              This Privacy Policy explains how we collect, use, store, and protect your personal information when you
              use our website, services, and digital tools. By using our platform, you agree to the terms outlined
              below.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">1. Information We Collect</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">
              We may collect the following types of information:
            </p>
            <ul className="ml-6 space-y-2 list-disc text-sm sm:text-base text-[#424242]">
              <li>
                <strong>Personal Information:</strong> Name, email address, mailing address, billing information, and
                other details you provide when creating an account, subscribing to our newsletter, or purchasing our
                products and services.
              </li>
              <li>
                <strong>Wellness & Lifestyle Data:</strong> Optional information you choose to share through
                assessments, wellness tools, AI-sign quizzes, or coaching sessions.
              </li>
              <li>
                <strong>Technical & Usage Data:</strong> IP address, browser type, pages visited, time spent on the
                site, and interactions with features collected via cookies and similar technologies.
              </li>
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">2. How We Use Your Information</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">We use your information to:</p>
            <ul className="ml-6 space-y-1 list-disc text-sm sm:text-base text-[#424242]">
              <li>Provide and personalize our wellness coaching, tools, and content</li>
              <li>Process purchases, subscriptions, and communications</li>
              <li>Send newsletters, updates, and marketing materials (with your consent)</li>
              <li>Improve our website experience and service delivery</li>
              <li>Meet legal obligations and enforce our rights</li>
            </ul>
            <p className="mt-3 leading-relaxed text-sm sm:text-base">
              Your information will never be sold or released.
            </p>
          </section>

          {/* 3. Sharing Your Data */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">3. Sharing Your Data</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base text-[#424242]">
              We may share your information with trusted third parties that help us operate and improve our business.
              These include website platforms (like WIX), analytics tools (like Google Analytics), email processors
              (like Mailchimp), and payment platforms (like PayPal and Stripe). All partners are required to follow data
              protection standards and use your information only for specified purposes.
            </p>
          </section>

          {/* 4. Data Security */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">4. Data Security</h2>
            <p className="leading-relaxed text-sm sm:text-base text-[#424242]">
              We take reasonable administrative, technical, and physical measures to protect your personal information.
              This includes encrypted data transmission, secure hosting, and strict access controls. However, no method
              of transmission or storage is 100% secure. By using our platform, you acknowledge that some risk of data
              breaches exists.
            </p>
          </section>

          {/* 5. Legal Disclaimer & Health Notice */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">
              5. Legal Disclaimer & Health Notice
            </h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base text-[#424242]">
              Wellness Made Clear provides educational content and wellness coaching. We are not medical professionals
              and our services are not intended to replace the advice or licensed healthcare providers.
            </p>
            <p className="mb-3 leading-relaxed text-sm sm:text-base text-[#424242]">
              Our health coaches are not licensed medical professionals. They are trained in the Wellness Made Clear
              method, which blends foundational wellness principles—such as diet food, restful sleep, movement, and
              mindset—with a holistic faith philosophy, supported by science-backed research and personalized tools.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-[#424242]">
              Always consult with a qualified healthcare professional before starting any new diet, supplement regimen,
              making dietary changes, or discontinuing prescribed medications.
            </p>
            <p className="mt-3 leading-relaxed text-sm sm:text-base">
              By engaging with our coaching services or using our tools, you acknowledge that any lifestyle
              recommendations are for educational and informational purposes only. You agree to consult with the
              licensed healthcare professional for any personal medical advice.
            </p>
          </section>

          {/* 6. Cookies & Tracking */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">6. Cookies & Tracking</h2>
            <p className="leading-relaxed text-sm sm:text-base text-[#424242]">
              We use cookies, pixels, and similar technologies to analyze website traffic, enhance your experience, and
              personalize content. You can adjust cookie preferences through your browser settings at any time.
            </p>
          </section>

          {/* 7. Children's Privacy */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">7. Children&apos;s Privacy</h2>
            <p className="leading-relaxed text-sm sm:text-base text-[#424242]">
              Our services are intended for adults 18 years and older. We do not knowingly collect data from individuals
              under 18. If such data is discovered, it will be promptly deleted.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">8. Your Rights</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">You may at any time:</p>
            <ul className="ml-6 space-y-1 list-disc text-sm sm:text-base text-[#424242]">
              <li>Request access to your personal data</li>
              <li>Correct or update your information</li>
              <li>Delete your account or personal data</li>
              <li>Opt out of email communications</li>
            </ul>
            <p className="mt-3 leading-relaxed text-sm sm:text-base">To exercise these rights,</p>
            <p className="leading-relaxed text-sm sm:text-base">
              contact us at{" "}
              <a href="mailto:info@wellnessmadeclear.com" className="text-blue-600 hover:underline">
                info@wellnessmadeclear.com
              </a>
            </p>
          </section>

          {/* 9. Changes to This Policy */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">9. Changes to This Policy</h2>
            <p className="leading-relaxed text-sm sm:text-base text-[#424242]">
              This policy may be updated as our business evolves or as required by law. Updates will be posted here with
              the effective date listed above.
            </p>
          </section>

          {/* 10. Contact Information */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#131313] sm:text-2xl">10. Contact Information</h2>
            <p className="mb-3 leading-relaxed text-sm sm:text-base">Wellness Made Clear LLC</p>
            <div className="space-y-1 text-sm sm:text-base">
              <p className="leading-relaxed">
                📧 Email:{" "}
                <a href="mailto:info@wellnessmadeclear.com" className="text-blue-600 hover:underline">
                  info@wellnessmadeclear.com
                </a>
              </p>
              <p className="leading-relaxed">Mailing Address: 14021 Haylam Drive, Suite #2651, Chino Hills, CA 91709</p>
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}
