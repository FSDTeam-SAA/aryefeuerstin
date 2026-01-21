/* eslint-disable */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  ChevronDown,
  Upload,
  Trash2,
  X,
  Package as PackageIcon,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const packageDetailsSchema = z.object({
  printShippingLabel: z.boolean(),
  hasReceipt: z.boolean(),
  creditCardLast4: z.string().optional(),
  needShippingLabel: z.boolean(),
  productLength: z.string().optional(),
  productWidth: z.string().optional(),
  productHeight: z.string().optional(),
  productWeight: z.string().optional(),
  leaveMessage: z.boolean(),
  message: z.string().optional(),
});

type PackageDetailsFormData = z.infer<typeof packageDetailsSchema>;

interface StoreData {
  returnStore: string;
  otherStoreName?: string;
  numberOfPackages: number;
  packageImages: { [key: number]: string[] };
  packageNumbers: { [key: number]: string };
}

interface PackageDetailsFormProps {
  initialData: any;
  onSubmitAndProceed: (data: any) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

export function PackageDetailsForm({
  initialData,
  onSubmitAndProceed,
  onBack,
  isSubmitting,
}: PackageDetailsFormProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    "store-0",
    "packages-0",
    "anotherStore",
    "shippingLabel",
  ]);

  const [stores, setStores] = useState<StoreData[]>(
    initialData.stores?.length > 0
      ? initialData.stores.map((s: any) => ({
          returnStore: s.returnStore || "",
          otherStoreName: s.otherStoreName || "",
          numberOfPackages: s.numberOfPackages || 1,
          packageImages: s.packageImages || {},
          packageNumbers: s.packageNumbers || {},
        }))
      : [
          {
            returnStore: "",
            numberOfPackages: 1,
            packageImages: {},
            packageNumbers: {},
          },
        ],
  );

  const [physicalReturnLabelFiles, setPhysicalReturnLabelFiles] = useState<
    { file: File; preview?: string }[]
  >(initialData.physicalReturnLabelFiles || []);

  const { register, handleSubmit, setValue, watch } =
    useForm<PackageDetailsFormData>({
      resolver: zodResolver(packageDetailsSchema),
      defaultValues: {
        printShippingLabel: initialData.printShippingLabel || false,
        hasReceipt: initialData.hasReceipt || false,
        creditCardLast4: initialData.creditCardLast4 || "",
        needShippingLabel: initialData.needShippingLabel || false,
        productLength: initialData.productLength || "",
        productWidth: initialData.productWidth || "",
        productHeight: initialData.productHeight || "",
        productWeight: initialData.productWeight || "",
        leaveMessage: initialData.leaveMessage || false,
        message: initialData.message || "",
      },
    });

  const printShippingLabel = watch("printShippingLabel");
  const hasReceipt = watch("hasReceipt");
  const leaveMessage = watch("leaveMessage");
  const session = useSession();
  const TOKEN = session?.data?.accessToken || "";
  const [agreed, setAgreed] = useState(false);

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`, // যদি token লাগে
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      return res.json(); // 👉 backend response return করবে
    },
  });

  const isFreePhysicalLabel =
    userData?.data?.user?.subscription?.planId?.entitlements
      ?.freePhysicalReturnLabel === true;

  const isFreePhysicalReceipt =
    userData?.data?.user?.subscription?.planId?.entitlements
      ?.freePhysicalReceipt === true;

  const maxPackagesAllowed =
    userData?.data?.user?.subscription?.planId?.numberOfPackages ?? 5;

  console.log(userData);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const addStore = () => {
    const newIndex = stores.length;
    setStores([
      ...stores,
      {
        returnStore: "",
        numberOfPackages: 1,
        packageImages: {},
        packageNumbers: {},
      },
    ]);
    setOpenSections((prev) => [
      ...prev,
      `store-${newIndex}`,
      `packages-${newIndex}`,
    ]);
  };

  const removeStore = (index: number) => {
    if (stores.length <= 1) return;
    setStores(stores.filter((_, i) => i !== index));
  };

  const updateStoreData = (
    index: number,
    field: keyof StoreData,
    value: any,
  ) => {
    setStores((prev) => {
      const updated = [...prev];
      // @ts-ignore
      updated[index][field] = value;
      return updated;
    });
  };

  const handleImageChange = (
    storeIdx: number,
    pkgIdx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setStores((prev) => {
        const updated = [...prev];
        updated[storeIdx].packageImages[pkgIdx] = [reader.result as string];
        return updated;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = (storeIdx: number, pkgIdx: number) => {
    setStores((prev) => {
      const updated = [...prev];
      updated[storeIdx].packageImages[pkgIdx] = [];
      return updated;
    });
  };

  const handlePhysicalLabelUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setPhysicalReturnLabelFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removePhysicalLabelFile = (index: number) => {
    setPhysicalReturnLabelFiles((prev) => {
      if (prev[index]?.preview) URL.revokeObjectURL(prev[index].preview!);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (!agreed) {
          // optional: alert বা toast দেখাতে পারো, কিন্তু button disable থাকলে এটা আসবে না
          toast.warning("Please agree to the terms before submitting");
          return;
        }
        onSubmitAndProceed({ ...data, stores, physicalReturnLabelFiles });
      })}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add information for each package you want to return
        </p>
      </div>

      {stores.map((store, storeIndex) => (
        <div key={storeIndex} className="space-y-4">
          {storeIndex > 0 && (
            <div className="flex justify-between items-center bg-cyan-50 p-2 rounded-md">
              <span className="text-sm font-bold text-cyan-700 uppercase">
                Additional Store Return #{storeIndex + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStore(storeIndex)}
                className="text-[#FF4928] h-8"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
          )}

          {/* Store Selection Collapsible */}
          <Collapsible
            open={openSections.includes(`store-${storeIndex}`)}
            onOpenChange={() => toggleSection(`store-${storeIndex}`)}
            className="bg-[#F8FAFC] lg:p-4 rounded-lg border"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <PackageIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    Select the return store for your item
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    openSections.includes(`store-${storeIndex}`) &&
                      "rotate-180",
                  )}
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-4 space-y-6">
              <div className="p-3">
                <Label>Return Store</Label>
                <Select
                  value={store.returnStore}
                  onValueChange={(value) => {
                    updateStoreData(storeIndex, "returnStore", value);
                    if (value !== "OTHER") {
                      updateStoreData(storeIndex, "otherStoreName", "");
                    }
                  }}
                >
                  <SelectTrigger className="bg-white mt-1">
                    <SelectValue placeholder="Please select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAPLES">Staples</SelectItem>
                    <SelectItem value="KOHLS">Kohl's</SelectItem>
                    <SelectItem value="SHEIN">Shein Return</SelectItem>
                    <SelectItem value="TARGET">Target</SelectItem>
                    <SelectItem value="WALMART">Walmart</SelectItem>
                    <SelectItem value="WHOLE FOODS MARKET">
                      Whole Foods Market
                    </SelectItem>
                    <SelectItem value="UPS">UPS Drop Off</SelectItem>
                    <SelectItem value="USPS">USPS Drop Off</SelectItem>
                    <SelectItem value="FEDEX">FedEx Drop Off</SelectItem>
                    <SelectItem value="OTHER">
                      Other (Please specify)
                    </SelectItem>
                  </SelectContent>
                </Select>

                {store.returnStore === "OTHER" && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor={`other-store-${storeIndex}`}>
                      Please specify the store name
                    </Label>
                    <Input
                      id={`other-store-${storeIndex}`}
                      placeholder="e.g. Macy's, Best Buy, Nike"
                      className="mt-1"
                      value={store.otherStoreName || ""}
                      onChange={(e) =>
                        updateStoreData(
                          storeIndex,
                          "otherStoreName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Number of Packages */}
          <Collapsible
            open={openSections.includes(`packages-${storeIndex}`)}
            onOpenChange={() => toggleSection(`packages-${storeIndex}`)}
            className="bg-[#F8FAFC] lg:p-4 p-1 py-4 rounded-lg border"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <PackageIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    Number of Packages ({store.numberOfPackages})
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    openSections.includes(`packages-${storeIndex}`) &&
                      "rotate-180",
                  )}
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-4 px-2">
              <p className="text-sm text-gray-600 mb-3">
                How many packages are you returning to this store?
              </p>
              <Select
                value={store.numberOfPackages.toString()}
                onValueChange={(value) =>
                  updateStoreData(
                    storeIndex,
                    "numberOfPackages",
                    parseInt(value),
                  )
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: maxPackagesAllowed },
                    (_, i) => i + 1,
                  ).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-6 space-y-4">
                {Array.from({ length: store.numberOfPackages }).map(
                  (_, pkgIndex) => (
                    <div
                      key={pkgIndex}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">
                            {pkgIndex + 1}
                          </div>
                          <span className="font-medium text-gray-900">
                            Package {pkgIndex + 1}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Barcode / Label Images (optional)</Label>
                          <div className="mt-1">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id={`img-${storeIndex}-${pkgIndex}`}
                              onChange={(e) =>
                                handleImageChange(storeIndex, pkgIndex, e)
                              }
                            />

                            {store.packageImages?.[pkgIndex]?.length > 0 ? (
                              <div className="space-y-3">
                                <div className="relative">
                                  <img
                                    src={store.packageImages[pkgIndex][0]}
                                    alt="barcode"
                                    className="w-full h-48 object-contain rounded-lg border bg-gray-50"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeImage(storeIndex, pkgIndex)
                                    }
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <label
                                  htmlFor={`img-${storeIndex}-${pkgIndex}`}
                                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                >
                                  <Upload className="w-4 h-4 mr-2" /> Replace
                                  Image
                                </label>
                              </div>
                            ) : (
                              <label
                                htmlFor={`img-${storeIndex}-${pkgIndex}`}
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400"
                              >
                                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                <p className="text-sm text-gray-600">
                                  Click to upload barcode image
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  (Only one image allowed)
                                </p>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}

      {/* Add Another Store */}
      <Collapsible
        open={openSections.includes("anotherStore")}
        onOpenChange={() => toggleSection("anotherStore")}
        className="bg-[#F8FAFC] p-4 rounded-lg border"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Add Another Store
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("anotherStore") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <p className="text-sm text-gray-600 mb-3">
            Are you returning packages to another store?
          </p>
          <RadioGroup
            onValueChange={(v) => v === "yes" && addStore()}
            defaultValue="no"
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="as-yes" />
                <Label htmlFor="as-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="as-no" />
                <Label htmlFor="as-no">No</Label>
              </div>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Physical Return Label */}
      <Collapsible
        open={openSections.includes("shippingLabel")}
        onOpenChange={() => toggleSection("shippingLabel")}
        className="bg-[#F8FAFC] p-4 rounded-lg border"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Does your package require a physical return label?
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("shippingLabel") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-4 px-2 sm:px-4 space-y-6">
          <RadioGroup
            onValueChange={(v) => setValue("printShippingLabel", v === "yes")}
            value={printShippingLabel ? "yes" : "no"}
          >
            <div className="flex flex-wrap items-center gap-8 mb-5">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="label-yes" />
                <Label htmlFor="label-yes" className="text-base font-medium">
                  Yes, I need a physical return label
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="label-no" />
                <Label htmlFor="label-no" className="text-base font-medium">
                  No, I will use my own label
                </Label>
              </div>
            </div>
          </RadioGroup>

          {printShippingLabel && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Fee notice - only shown when Yes is selected */}
              {isFreePhysicalLabel ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-800">
                    Additional fee: <strong>$3.50</strong> will be charged for
                    physical return label
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    (applies to your current plan)
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-emerald-800">
                    ✓ Physical return label is <strong>included free</strong> in
                    your plan
                  </p>
                </div>
              )}

              {/* Upload area - only when Yes */}
              <div>
                <Label className="mb-2.5 block font-medium">
                  Upload Physical Return Label{" "}
                  {isFreePhysicalLabel ? "(PDF or Image)" : "(PDF or Image)"}
                </Label>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  className="hidden"
                  id="physical-return-labels"
                  onChange={handlePhysicalLabelUpload}
                />

                {physicalReturnLabelFiles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {physicalReturnLabelFiles.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-all duration-200"
                      >
                        <div className="aspect-[4/5] sm:aspect-[3/4] bg-gray-50 relative">
                          {item.preview ? (
                            <img
                              src={item.preview}
                              alt="Label preview"
                              className="absolute inset-0 w-full h-full object-contain p-4"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                              <FileText className="w-16 h-16 text-blue-600 mb-4" />
                              <p className="text-base font-semibold text-gray-800 truncate max-w-[90%] px-2">
                                {item.file.name}
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                {item.file.type.includes("pdf")
                                  ? "PDF"
                                  : "File"}{" "}
                                • {(item.file.size / 1024).toFixed(0)} KB
                              </p>
                              <p className="text-xs text-gray-500 mt-3 italic">
                                Preview not available
                              </p>

                              <a
                                href={URL.createObjectURL(item.file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                              >
                                <FileText className="w-4 h-4" />
                                Open File
                              </a>
                            </div>
                          )}
                        </div>

                        {/* File info & remove button */}
                        <div className="p-3 flex items-center justify-between bg-gray-50 border-t">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {item.file.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {(item.file.size / 1024).toFixed(1)} KB •{" "}
                              {item.file.type.includes("pdf") ? "PDF" : "Image"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removePhysicalLabelFile(idx)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors ml-2 flex-shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add more button */}
                    <label
                      htmlFor="physical-return-labels"
                      className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/30 transition-colors min-h-[220px]"
                    >
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700">
                        Add more files
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF or Image</p>
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="physical-return-labels"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/30 transition-colors min-h-[280px]"
                  >
                    <Upload className="w-14 h-14 text-gray-400 mb-4" />
                    <p className="text-base font-medium text-gray-700">
                      Click to upload return label files
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                      Supports JPG, PNG, PDF (multiple files allowed)
                    </p>
                  </label>
                )}
              </div>
            </div>
          )}

          {!printShippingLabel && (
            <p className="text-sm text-gray-500 italic pt-2">
              You will need to provide your own shipping label during drop-off.
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Physical Receipt */}
      <Collapsible
        open={openSections.includes("receipt")}
        onOpenChange={() => toggleSection("receipt")}
        className="bg-[#F8FAFC] p-4 rounded-lg border"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Does your return require a physical receipt?
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("receipt") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <RadioGroup
            onValueChange={(v) => setValue("hasReceipt", v === "yes")}
            defaultValue="no"
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="r-yes" />
                <Label htmlFor="r-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="r-no" />
                <Label htmlFor="r-no">No</Label>
              </div>
            </div>
          </RadioGroup>

          {hasReceipt && (
            <div className="mt-5 space-y-6">
              {isFreePhysicalReceipt ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                  <p className="font-medium text-amber-800">
                    Additional fee: <strong>$8.00</strong> for physical receipt
                  </p>
                  <p className="text-amber-700 mt-1">
                    (applies according to your current plan)
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm">
                  <p className="font-medium text-emerald-800">
                    ✓ Physical receipt processing is <strong>free</strong> with
                    your plan
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <Input
                  placeholder="Last 4 digits of credit card"
                  maxLength={4}
                  {...register("creditCardLast4")}
                />

                <p className="text-xs text-red-600 font-medium">
                  * Returns requiring physical receipt must be purchased with a
                  credit card
                </p>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Message */}
      <Collapsible
        open={openSections.includes("message")}
        onOpenChange={() => toggleSection("message")}
        className="bg-[#F8FAFC] p-4 rounded-lg border"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Leave a Message (Optional)
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                openSections.includes("message") && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-2">
          <Label>Do you want to leave a message?</Label>
          <RadioGroup
            onValueChange={(v) => setValue("leaveMessage", v === "yes")}
            defaultValue="no"
          >
            <div className="flex items-center space-x-6 pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="m-yes" />
                <Label htmlFor="m-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="m-no" />
                <Label htmlFor="m-no">No</Label>
              </div>
            </div>
          </RadioGroup>

          {leaveMessage && (
            <div className="mt-4">
              <Textarea
                rows={4}
                placeholder="Write your message here..."
                className="mt-1"
                {...register("message")}
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <div className="pt-6 border-t space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id="agreement"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(!!checked)}
            className={cn(
              "data-[state=checked]:bg-[#31B8FA] data-[state=checked]:border-[#31B8FA]",
              !agreed && "border-red-500", // optional: চেক না থাকলে লাল বর্ডার
            )}
          />
          <label
            htmlFor="agreement"
            className={cn(
              "text-sm leading-relaxed cursor-pointer select-none flex-1",
              !agreed && "text-red-600", // optional: চেক না থাকলে লাল টেক্সট
            )}
          >
            I agree that I have selected the correct pickup address/drop-off
            location, uploaded the necessary barcodes, and will write the number
            on the outside of each package that corresponds to the package
            number where the barcode was uploaded. For more details, you can
            watch our{" "}
            <a
              href="https://www.youtube.com/watch?v=your-video-id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31B8FA] underline hover:text-[#2BA5D6]"
            >
              how-to video here
            </a>
            .
          </label>
        </div>

        {/* Optional error message যদি চাও */}
        {!agreed && (
          <p className="text-sm text-red-600 pl-7">
            You must agree to continue
          </p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between pt-8 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting || !agreed}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#31B8FA] hover:bg-[#31B8FA]/95 text-white px-10 h-12"
        >
          {isSubmitting ? "Submitting Request..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}
