import { Button } from "@/components/ui/button"

const packages = [
  {
    id: "pay-per",
    title: "Pay-Per-Package",
    name: "$6 Package",
    subtitle: "Pay Per Pickup",
    color: "black",
    features: [
      "No Subscription Required",
      "Pay Per Pickup",
      "$3.50 Fee For Physical Labels",
      "$8 Fee For Physical Receipts",
    ],
    buttonText: "$6 Pickup Request Now",
    buttonColor: "bg-[#31B8FA] hover:bg-[#2BA5D6]/90",
  },
  {
    id: "standard",
    title: "Standard Package",
    name: "Standard Package",
    subtitle: "$30 / Month",
    color: "black",
    features: ["Unlimited pickups for 30 days", "Free physical return labels", "$8 fee for physical receipt returns *"],
    buttonText: "Join EZ Prime - $30/Month",
    buttonColor: "bg-[#31B8FA] hover:bg-[#2BA5D6]/90",
  },
  {
    id: "premium",
    title: "Premium Package",
    name: "Premium Package",
    subtitle: "$45/Month",
    color: "black",
    features: ["Unlimited Pickups", "Unlimited Physical Label Printing", "Unlimited Physical Receipt Returns"],
    buttonText: "Join EZ Premium - $45/Month",
    buttonColor: "bg-[#31B8FA] hover:bg-[#2BA5D6]/90",
  },
  {
    id: "business",
    title: "Package coming soon",
    name: "Business Package",
    subtitle: "Coming Soon",
    color: "black",
    features: ["Bulk Pickup Option", "Weekly or Scheduled Pickups", "Weekly Scheduled Pickups"],
    buttonText: "Full Details Coming Soon",
    buttonColor: "bg-[#31B8FA] hover:bg-[#2BA5D6]/90",
  },
]

export default function SubscriptionPackages() {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#131313] mb-4 text-balance">
            Subscription Packages
          </h2>
          <p className="text-sm md:text-xl text-[#424242] font-normal  text-balance">
            We offer a range of service packages to match your needs. Simply choose the package that works best for you
            to begin the return process.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border-2 border-[#3258DA] rounded-lg overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-black text-white p-6 text-center">
                <h3 className="font-semibold text-2xl ">{pkg.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-center">
                <div className="mb-6">
                  <h4 className="text-[32px] font-semibold text-[#131313] mb-1">{pkg.name}</h4>
                  <p className="text-base text-[#424242] text-center">{pkg.subtitle}</p>
                </div>
                </div>

                <div className="mb-6">
                  <p className="text-base font-midium text-[#4338CA] mb-3 text-center bg-[#EEF2FF] py-2">THIS PLAN INCLUDES</p>
                  <ul className="space-y-2 mt-5">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="text-base font-normal text-[#000000] flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className={`${pkg.buttonColor} text-white h-[51px] rounded-[8px] w-full mt-auto text-sm py-5`}>
                  {pkg.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
