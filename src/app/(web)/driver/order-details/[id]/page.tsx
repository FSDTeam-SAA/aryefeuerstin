"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  MapPin,
  Phone,
  Printer,
  Package,
  CheckCircle,
  FileText,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { JobDetailsSkeleton } from "./_components/skeleton";

/* ================= TYPES ================= */

type OrderStatus = "PENDING" | "ON_MY_WAY" | "PICKED_UP" | "COMPLETED";

interface PackageItem {
  packageNumber: string;
  barcodeImages: string[];
}

interface Store {
  store: string;
  packages: PackageItem[];
  otherStoreName?: string;
}

interface Customer {
  fullName: string;
  phone: string;
  email?: string;
  unit?: string; // ✅ ADD THIS
  address?: {
    street: string;
    state: string;
    city: string;
    zipCode: string;
  };
  pickupLocation?: {
    address: string;
  };
  pickupInstructions?: string;
}

interface MessageOption {
  enabled: boolean;
  note: string;
}

interface ReturnOrderData {
  _id: string;
  customer: Customer;
  stores: Store[];
  status: OrderStatus;
  paymentStatus: string;
  options?: {
    physicalReturnLabel?: {
      enabled: boolean;
      labelFiles: string[];
    };
    message?: MessageOption;
    physicalReceipt?: {
      enabled: boolean;
      creditCardLast4: string;
    };
  };
}

/* ================= API ================= */

const fetchReturnOrder = async (
  orderId: string,
  token: string,
): Promise<ReturnOrderData> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/see-details/${orderId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const result = await res.json();
  if (!res.ok || !result.status)
    throw new Error(result.message || "Failed to fetch order");
  return result.data;
};

const updateOrderStatus = async ({
  orderId,
  token,
  status,
}: {
  orderId: string;
  token: string;
  status: OrderStatus;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/${orderId}/driver-status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    },
  );
  const result = await res.json();
  if (!res.ok || !result.status)
    throw new Error(result.message || "Status update failed");
  return result.data;
};

export default function JobDetailsPage() {
  const { id: orderId } = useParams<{ id: string }>();
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.accessToken as string;
  const queryClient = useQueryClient();

  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  const [activePkg, setActivePkg] = useState<{
    id: string;
    store: string;
    barcodeImage: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /* ---------- QUERY ---------- */
  const {
    data: orderData,
    isLoading,
    isError,
  } = useQuery<ReturnOrderData>({
    queryKey: ["returnOrder", orderId],
    queryFn: () => fetchReturnOrder(orderId!, token),
    enabled: !!orderId && !!token && sessionStatus === "authenticated",
  });

  /* ---------- MUTATION ---------- */
  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (updated) => {
      queryClient.setQueryData<ReturnOrderData>(
        ["returnOrder", orderId],
        (old) => (old ? { ...old, status: updated.status } : old),
      );
      toast.success("Status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  /* ================= DATA ================= */
  const allPackages =
    orderData?.stores.flatMap((store) =>
      store.packages.map((pkg) => ({
        id: pkg.packageNumber,
        store: store.store,
        barcodeImage: pkg.barcodeImages?.[0] || "",
      })),
    ) || [];

  const returnLabelFile = orderData?.options?.physicalReturnLabel?.enabled
    ? orderData.options.physicalReturnLabel.labelFiles?.[0]
    : null;

  const isReturnLabelPDF = returnLabelFile?.toLowerCase().endsWith(".pdf");
  const returnLabelImage = !isReturnLabelPDF ? returnLabelFile : null;

  const customer = orderData?.customer;
  const fullName = `${customer?.fullName || ""}`.trim() || "N/A";
  const address =
    customer?.pickupLocation?.address ??
    (customer?.address
      ? `${customer.address.street}${
          customer.unit ? `, Unit ${customer.unit}` : ""
        }, ${customer.address.city}, ${customer.address.state}, ${
          customer.address.zipCode
        }`
      : "N/A");
  const orderStatus = orderData?.status ?? "PENDING";

  const pickupInstructions = customer?.pickupInstructions?.trim();
  const customerMessage =
    orderData?.options?.message?.enabled &&
    orderData?.options?.message?.note?.trim()
      ? orderData.options.message.note.trim()
      : null;

  /* ================= PDF PRINT LOGIC ================= */
  const handlePrintAsPDF = async (
    pkg: { id: string; store: string; barcodeImage: string } | "return-label",
  ) => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating high-quality label...");

    let targetPkg: { id: string; store: string; barcodeImage: string };

    if (pkg === "return-label") {
      if (!returnLabelImage) {
        toast.error("Return label not available", { id: toastId });
        setIsGenerating(false);
        return;
      }
      targetPkg = {
        id: "Return Label",
        store: "Return Shipping Label",
        barcodeImage: returnLabelImage,
      };
    } else {
      targetPkg = pkg;
      if (!targetPkg.barcodeImage) {
        toast.error("No barcode image available", { id: toastId });
        setIsGenerating(false);
        return;
      }
    }

    setActivePkg(targetPkg);

    // Ensure image is fully loaded before generating PDF
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const element = pdfTemplateRef.current;
      if (!element) {
        toast.error("Template error", { id: toastId });
        setIsGenerating(false);
        return;
      }

      // Wait for image to load
      const img = element.querySelector("img") as HTMLImageElement | null;
      if (img && !img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }

      const canvas = await html2canvas(element, {
        scale: 3.7795, // ≈96dpi → good for most thermal printers
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [101.6, 152.4], // ← Real 4×6 inches in mm
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        "FAST",
      );

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      const printWindow = window.open(url, "_blank");

      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
          }, 700);
        };

        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.focus();
            printWindow.print();
          }
        }, 1800);

        toast.success("Print ready! Use system print dialog.", {
          id: toastId,
        });
      } else {
        pdf.save(`Label_${targetPkg.id.replace(/\s+/g, "_")}.pdf`);
        toast.success("PDF downloaded – open and print", { id: toastId });
      }
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("Failed to generate label", { id: toastId });
    } finally {
      setIsGenerating(false);
      setActivePkg(null);
    }
  };

  const handleStatusUpdate = () => {
    const config = getButtonConfig();
    if (!config?.next) return;
    updateStatusMutation.mutate({
      orderId: orderId!,
      token,
      status: config.next as OrderStatus,
    });
  };

  const getButtonConfig = () => {
    switch (orderStatus) {
      case "PENDING":
        return { text: "Start Job (On my way)", next: "ON_MY_WAY" };
      case "ON_MY_WAY":
        return { text: "Confirm Pickup", next: "PICKED_UP" };
      case "PICKED_UP":
        return { text: "Complete Job", next: "COMPLETED" };
      case "COMPLETED":
        return {
          text: "COMPLETED",
          next: null,
          icon: <CheckCircle className="h-5 w-5 mr-2" />,
        };
      default:
        return null;
    }
  };
  const buttonConfig = getButtonConfig();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  if (sessionStatus === "loading" || isLoading) return <JobDetailsSkeleton />;
  if (isError || !orderData)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading job details.
      </div>
    );

  return (
    <>
      {/* HIDDEN PDF TEMPLATE - OPTIMIZED FOR 4×6 THERMAL PRINTERS */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          pointerEvents: "none",
        }}
      >
        <div
          ref={pdfTemplateRef}
          className="bg-white"
          style={{
            width: "1219px", // 4" × ~305dpi
            height: "1829px", // 6" × ~305dpi
            padding: "70px 50px",
          }}
        >
          <div className="border-2 border-black flex flex-col items-center justify-between h-full py-12">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-7xl font-black uppercase tracking-wider text-gray-900">
                PACKAGE LABEL
              </h1>
              <p className="text-4xl font-bold text-gray-800 mt-10">
                Store: {activePkg?.store || "N/A"}
              </p>
              <p className="text-4xl font-black text-gray-900 mt-8 pb-4 tracking-wide">
                PACKAGE # {activePkg?.id || "N/A"}
              </p>
            </div>

            {/* Large Sharp Barcode */}
            <div className="flex-1 flex items-center justify-center w-full px-10">
              {activePkg?.barcodeImage && (
                <Image
                  src={activePkg.barcodeImage}
                  crossOrigin="anonymous"
                  alt="Barcode"
                  width={2000}
                  height={1200}
                  className="max-w-full max-h-full object-contain"
                  unoptimized
                  priority
                />
              )}
            </div>

            {/* Footer with Package Number Again */}
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-700 mb-3">
                {activePkg?.id || "N/A"}
              </p>
              <p className="text-2xl font-medium text-gray-500">
                Scan to verify
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SCREEN VIEW */}
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Job Details
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Order # {orderData._id.slice(-8)}
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-4 py-1.5 text-xs sm:text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
              {orderData.status.replace("_", " ")}
            </span>
          </div>

          {/* CUSTOMER SECTION - REDESIGNED */}
          <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
            <div className="p-5 sm:p-6">
              <h2 className="mb-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Customer Details
              </h2>
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                {fullName}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Address & Phone */}
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <span className="text-sm leading-relaxed text-gray-600">
                        {customer?.address
                          ? `${customer.address.street}${
                              customer.unit ? `, Unit ${customer.unit}` : ""
                            }, ${customer.address.city}, ${
                              customer.address.state
                            }, ${customer.address.zipCode}`
                          : "N/A"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(address, "Address")}
                      className="ml-4 flex items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 transition-colors"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>

                  {customer?.phone && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {customer.phone}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(customer.phone, "Phone number")
                        }
                        className="ml-4 flex items-center gap-1.5 rounded-md border border-sky-400 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-sky-500 hover:bg-sky-50 transition-colors"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column: Pickup Instructions & Message */}
                <div className="space-y-5">
                  {pickupInstructions && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-bold uppercase text-gray-500">
                          Pickup Instructions
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                        {pickupInstructions}
                      </p>
                    </div>
                  )}

                  {customerMessage && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-bold uppercase text-gray-500">
                          Customer Message
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                        {customerMessage}
                      </p>
                    </div>
                  )}

                  {/* Right Column: Pickup Instructions & Message & Credit Card */}
                  <div className="space-y-5">
                    {pickupInstructions && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-bold uppercase text-gray-500">
                            Pickup Instructions
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                          {pickupInstructions}
                        </p>
                      </div>
                    )}

                    {customerMessage && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-bold uppercase text-gray-500">
                            Customer Message
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                          {customerMessage}
                        </p>
                      </div>
                    )}

                    {/* এখানে নতুন যোগ করা */}
                    {orderData?.options?.physicalReceipt?.enabled &&
                      orderData.options.physicalReceipt.creditCardLast4 && (
                        <div className="mt-5">
                          <div className="flex items-center gap-3 text-sm">
                            <CreditCard className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 font-medium">
                              Card Last 4 Digits
                            </span>
                          </div>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            <span className="text-base tracking-wider">
                              •••• •••• ••••
                            </span>
                            <span className="text-emerald-800">
                              {
                                orderData.options.physicalReceipt
                                  .creditCardLast4
                              }
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-gray-500 italic">
                            Used for physical receipt verification
                          </p>
                        </div>
                      )}

                    {!pickupInstructions &&
                      !customerMessage &&
                      !orderData?.options?.physicalReceipt?.enabled && (
                        <p className="text-sm text-gray-400 italic">
                          No additional instructions or messages.
                        </p>
                      )}
                  </div>

                  {!pickupInstructions && !customerMessage && (
                    <p className="text-sm text-gray-400 italic">
                      No additional instructions or messages.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* RETURN LABEL */}
          {returnLabelFile && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-sm font-bold uppercase text-gray-500 tracking-tight flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Return Shipping Label
                </h2>
                {isReturnLabelPDF ? (
                  <a
                    href={returnLabelFile}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-2 border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      <Printer className="h-4 w-4" /> Download PDF
                    </Button>
                  </a>
                ) : (
                  <Button
                    onClick={() => handlePrintAsPDF("return-label")}
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Printer className="h-4 w-4" /> Print PDF
                  </Button>
                )}
              </div>
              {isReturnLabelPDF ? (
                <Card className="p-6 bg-gray-50">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      PDF Return Label
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Click Download PDF to view and print
                    </p>
                    <a
                      href={returnLabelFile}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Printer className="h-4 w-4" /> Download PDF
                      </Button>
                    </a>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 bg-gray-50">
                  <div className="relative h-48 w-full flex justify-center">
                    <Image
                      src={returnLabelImage!}
                      alt="Return Label"
                      width={10000}
                      height={10000}
                      className="h-full object-contain rounded-lg shadow-sm bg-white"
                    />
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* PACKAGES */}
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-tight">
              Packages ({allPackages.length})
            </h2>
            {allPackages.length > 0 && allPackages[0].barcodeImage && (
              <Button
                onClick={() => handlePrintAsPDF(allPackages[0])}
                variant="outline"
                size="sm"
                className="h-9 gap-2 border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden xs:inline">Print PDF</span>
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {allPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="border-none shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col p-4 sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 border border-gray-200">
                      <Package className="h-7 w-7 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
  {pkg.store === "OTHER"
    ? orderData?.stores.find(s => s.store === "OTHER")?.otherStoreName || "OTHER"
    : pkg.store}
</h3>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                        <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {pkg.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-gray-50 pt-4 sm:border-none sm:pt-0">
                    <button
                      onClick={() => handlePrintAsPDF(pkg)}
                      disabled={isGenerating || !pkg.barcodeImage}
                      className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-sky-400 hover:shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {pkg.barcodeImage ? (
                        <Image
                          src={pkg.barcodeImage}
                          crossOrigin="anonymous"
                          width={100}
                          height={100}
                          alt={`Barcode ${pkg.id}`}
                          className="h-16 w-auto object-contain"
                          unoptimized
                        />
                      ) : (
                        <div className="h-16 w-56 bg-gray-200 border-2 border-dashed rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            No barcode
                          </span>
                        </div>
                      )}
                      <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-sky-500">
                        {isGenerating && activePkg?.id === pkg.id
                          ? "Generating..."
                          : "Print Label PDF"}
                      </span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}

            {/* STATUS BUTTON */}
            {buttonConfig && (
              <Button
                onClick={handleStatusUpdate}
                disabled={
                  orderStatus === "COMPLETED" || updateStatusMutation.isPending
                }
                className={`w-full h-12 text-white rounded-[24px] mt-6 ${
                  orderStatus === "COMPLETED"
                    ? "bg-green-600 cursor-default"
                    : "bg-[#31B8FA] hover:bg-[#31B8FA]/90"
                }`}
              >
                {updateStatusMutation.isPending ? (
                  "Updating..."
                ) : (
                  <>
                    {buttonConfig.icon}
                    {buttonConfig.text}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
