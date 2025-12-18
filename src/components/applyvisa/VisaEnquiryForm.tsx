import React, { useState, useMemo, useEffect } from "react";
import { Country } from "country-state-city";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Visa Types
const VISA_TYPES = [
  "Tourist Visa",
  "Business Visa",
  "Student Visa",
  "Work Visa",
  "Transit Visa",
];

// Customer Types
const CUSTOMER_TYPES = [
  "Corporate",
  "Group",
  "Solo",
  "Student",
  "Cruise",
  "Others",
];

// ============================================
// TYPES & INTERFACES
// ============================================

export interface VisaEnquiryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinationCountry?: string; // ISO country code (e.g., "AE", "US")
}

// ============================================
// MAIN COMPONENT
// ============================================

const VisaEnquiryForm: React.FC<VisaEnquiryFormProps> = ({
  open,
  onOpenChange,
  destinationCountry,
}) => {
  const countries = useMemo(() => Country.getAllCountries(), []);

  const [formData, setFormData] = useState({
    customerFirstName: "",
    customerLastName: "",
    countryOfResidence: "",
    nationality: "",
    destinationCountry: "",
    customerType: "",
    visaType: "",
    tentativeTravelDate: "",
    contactNumber: "",
    email: "",
    numberOfAdults: 1,
    numberOfChildren: 0,
    description: "",
    fileAttachment: null as File | null,
  });

  // API Integration States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const ENQUIRY_ENDPOINT = "/api/visa-enquiry";

  // Read cookie helper
  const getCookie = (name: string): string => {
    if (typeof document === "undefined") return "";
    const match = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : "";
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  // Auto-populate destination country when form opens with destinationCountry prop
  useEffect(() => {
    if (open && destinationCountry) {
      setFormData((prev) => ({
        ...prev,
        destinationCountry: destinationCountry,
      }));
    }
  }, [open, destinationCountry]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleCountryChange = (
    field: "countryOfResidence" | "nationality" | "destinationCountry",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prev) => ({ ...prev, contactNumber: value || "" }));
    if (errors.contactNumber) {
      setErrors((prev) => ({ ...prev, contactNumber: "" }));
    }
  };

  const handleCounterChange = (
    field: "numberOfAdults" | "numberOfChildren",
    increment: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(
        field === "numberOfAdults" ? 1 : 0,
        increment ? prev[field] + 1 : prev[field] - 1
      ),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, fileAttachment: file || null }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerFirstName.trim())
      newErrors.customerFirstName = "First name is required";
    if (!formData.customerLastName.trim())
      newErrors.customerLastName = "Last name is required";
    if (!formData.countryOfResidence)
      newErrors.countryOfResidence = "Country of residence is required";
    if (!formData.nationality)
      newErrors.nationality = "Nationality is required";
    if (!formData.destinationCountry)
      newErrors.destinationCountry = "Destination country is required";
    if (!formData.customerType)
      newErrors.customerType = "Customer type is required";
    if (!formData.visaType) newErrors.visaType = "Visa type is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.tentativeTravelDate)
      newErrors.tentativeTravelDate = "Travel date is required";

    setErrors(newErrors);

    // Show toast for validation errors
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Upload file first if one exists
      let uploadedFileName = null;
      if (formData.fileAttachment) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", formData.fileAttachment);

          const uploadRes = await fetch("/api/cms/file/upload", {
            method: "POST",
            headers: {
              ...(getCookie("accesstoken")
                ? { Authorization: `Bearer ${getCookie("accesstoken")}` }
                : {}),
            },
            body: uploadFormData,
          });

          if (!uploadRes.ok) {
            throw new Error("Failed to upload file");
          }

          const uploadData = await uploadRes.json();
          // Extract the generated file name from the response
          // The API might return it in different formats, so we handle multiple cases
          // Check if data is a string (filename directly) first
          uploadedFileName =
            (typeof uploadData?.data === "string" ? uploadData.data : null) ||
            uploadData?.data?.fileName ||
            uploadData?.fileName ||
            uploadData?.data?.generatedFileName ||
            uploadData?.generatedFileName ||
            uploadData?.data?.name ||
            uploadData?.name;

          if (!uploadedFileName) {
            console.warn("Upload response:", uploadData);
            throw new Error("Could not get file name from upload response");
          }
        } catch (uploadError: any) {
          console.error("File upload error:", uploadError);
          toast.error(
            uploadError.message || "Failed to upload file. Please try again.",
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          setSubmitting(false);
          return;
        }
      }

      // Prepare the data for submission with enquiryType and proper field mapping
      const submissionData = {
        enquiryType: "VISA",
        customerFirstName: formData.customerFirstName,
        customerLastName: formData.customerLastName,
        countryOfResidence: formData.countryOfResidence,
        nationality: formData.nationality,
        customerPhone: formData.contactNumber,
        customerEmail: formData.email,
        customerType: formData.customerType,
        companyName: undefined, // Not in visa form
        residence: undefined, // State and city fields removed
        adults: formData.numberOfAdults,
        children: formData.numberOfChildren,
        infants: 0, // Not in form, defaulting to 0
        budget: undefined, // Not in form
        destination: formData.destinationCountry || undefined,
        enquiryDesc: formData.description || undefined,
        packageId: undefined, // Not in form
        packageName: undefined, // Not in form
        fromDate: formData.tentativeTravelDate || undefined,
        toDate: undefined, // Not in form
        attachments: uploadedFileName
          ? [
              {
                documentType: "Passport", // Default, could be enhanced
                generatedFileName: uploadedFileName,
              },
            ]
          : undefined,
      };

      const res = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getCookie("accesstoken")
            ? { Authorization: `Bearer ${getCookie("accesstoken")}` }
            : {}),
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json().catch(() => ({ message: "Submitted" }));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit enquiry");
      }

      // Show success toast
      toast.success("Visa Enquiry Submitted Successfully! 🎉", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Close dialog after successful submission
      setTimeout(() => {
        onOpenChange(false);
        // Reset form
        setFormData({
          customerFirstName: "",
          customerLastName: "",
          countryOfResidence: "",
          nationality: "",
          destinationCountry: "",
          customerType: "",
          visaType: "",
          tentativeTravelDate: "",
          contactNumber: "",
          email: "",
          numberOfAdults: 1,
          numberOfChildren: 0,
          description: "",
          fileAttachment: null,
        });
        setErrors({});
      }, 1500);
    } catch (err: any) {
      // Show error toast
      toast.error(
        err.message || "Failed to submit enquiry. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1200px] w-full p-6 max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl mb-2 text-center">
              Visa Enquiry Form
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            {/* 1. Personal Information */}
            <div className="space-y-3 border p-3 rounded-lg">
              <h3 className="text-base font-semibold mb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="customerFirstName" className="text-xs">
                    First Name*
                  </Label>
                  <Input
                    id="customerFirstName"
                    name="customerFirstName"
                    placeholder="Enter first name"
                    value={formData.customerFirstName}
                    onChange={handleInputChange}
                    className={`h-8 text-xs ${
                      errors.customerFirstName ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.customerFirstName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.customerFirstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customerLastName" className="text-xs">
                    Last Name*
                  </Label>
                  <Input
                    id="customerLastName"
                    name="customerLastName"
                    placeholder="Enter last name"
                    value={formData.customerLastName}
                    onChange={handleInputChange}
                    className={`h-8 text-xs ${
                      errors.customerLastName ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.customerLastName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.customerLastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Country of Residence*</Label>
                  <Select
                    value={formData.countryOfResidence}
                    onValueChange={(value) => {
                      handleCountryChange("countryOfResidence", value);
                      if (errors.countryOfResidence) {
                        setErrors((prev) => ({
                          ...prev,
                          countryOfResidence: "",
                        }));
                      }
                    }}
                    required
                  >
                    <SelectTrigger
                      className={`h-8 text-xs ${
                        errors.countryOfResidence ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country, index) => (
                        <SelectItem
                          key={`visa-residence-${index}`}
                          value={country.isoCode}
                          className="text-xs"
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.countryOfResidence && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.countryOfResidence}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-xs">Nationality*</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => {
                      handleCountryChange("nationality", value);
                      if (errors.nationality) {
                        setErrors((prev) => ({ ...prev, nationality: "" }));
                      }
                    }}
                    required
                  >
                    <SelectTrigger
                      className={`h-8 text-xs ${
                        errors.nationality ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country, index) => (
                        <SelectItem
                          key={`visa-nationality-${index}`}
                          value={country.isoCode}
                          className="text-xs"
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.nationality && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.nationality}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Travel Information */}
            <div className="space-y-3 border p-3 rounded-lg">
              <h3 className="text-base font-semibold mb-2">
                Travel Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Destination Country*</Label>
                  <Select
                    value={formData.destinationCountry}
                    onValueChange={(value) => {
                      handleCountryChange("destinationCountry", value);
                      if (errors.destinationCountry) {
                        setErrors((prev) => ({
                          ...prev,
                          destinationCountry: "",
                        }));
                      }
                    }}
                    required
                  >
                    <SelectTrigger
                      className={`h-8 text-xs ${
                        errors.destinationCountry ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country, index) => (
                        <SelectItem
                          key={`visa-destination-${index}`}
                          value={country.isoCode}
                          className="text-xs"
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.destinationCountry && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.destinationCountry}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-xs">Customer Type*</Label>
                  <Select
                    value={formData.customerType}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, customerType: value }));
                      if (errors.customerType) {
                        setErrors((prev) => ({ ...prev, customerType: "" }));
                      }
                    }}
                    required
                  >
                    <SelectTrigger
                      className={`h-8 text-xs ${
                        errors.customerType ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Customer Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CUSTOMER_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerType && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.customerType}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Type of Visa*</Label>
                  <Select
                    value={formData.visaType}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, visaType: value }));
                      if (errors.visaType) {
                        setErrors((prev) => ({ ...prev, visaType: "" }));
                      }
                    }}
                    required
                  >
                    <SelectTrigger
                      className={`h-8 text-xs ${
                        errors.visaType ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Visa Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISA_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.visaType && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.visaType}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="tentativeTravelDate" className="text-xs">
                  Tentative Travel Date*
                </Label>
                <Input
                  id="tentativeTravelDate"
                  name="tentativeTravelDate"
                  type="date"
                  min={today}
                  value={formData.tentativeTravelDate}
                  onChange={handleInputChange}
                  className={`h-8 text-xs ${
                    errors.tentativeTravelDate ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.tentativeTravelDate && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.tentativeTravelDate}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Contact Information */}
            <div className="space-y-3 border p-3 rounded-lg">
              <h3 className="text-base font-semibold mb-2">
                Contact Information
              </h3>
              <div>
                <Label htmlFor="contactNumber" className="text-xs">
                  Contact Number*
                </Label>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={formData.contactNumber}
                  onChange={handlePhoneChange}
                  defaultCountry="IN"
                  className={`h-8 text-xs border rounded-md px-2 ${
                    errors.contactNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  style={
                    {
                      "--PhoneInputCountryFlag-height": "1em",
                      "--PhoneInput-color--focus": "#3b82f6",
                    } as React.CSSProperties
                  }
                />
                {errors.contactNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.contactNumber}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="text-xs">
                  Email Address*
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-8 text-xs ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* 4. Passenger Details */}
            <div className="space-y-3 border p-3 rounded-lg">
              <h3 className="text-base font-semibold mb-2">
                Passenger Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Number of Adults*</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        handleCounterChange("numberOfAdults", false)
                      }
                      disabled={formData.numberOfAdults <= 1}
                    >
                      -
                    </Button>
                    <span className="text-xs px-2">
                      {formData.numberOfAdults}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        handleCounterChange("numberOfAdults", true)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Number of Children*</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        handleCounterChange("numberOfChildren", false)
                      }
                      disabled={formData.numberOfChildren <= 0}
                    >
                      -
                    </Button>
                    <span className="text-xs px-2">
                      {formData.numberOfChildren}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        handleCounterChange("numberOfChildren", true)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Additional */}
            <div className="space-y-3 border p-3 rounded-lg col-span-2">
              <h3 className="text-base font-semibold mb-2">
                Additional Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="description" className="text-xs">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Additional details"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="text-xs h-20"
                  />
                </div>
                <div>
                  <Label htmlFor="fileAttachment" className="text-xs">
                    File Attachment (Optional)
                  </Label>
                  <Input
                    id="fileAttachment"
                    name="fileAttachment"
                    type="file"
                    onChange={handleFileChange}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <DialogFooter className="col-span-3 flex justify-center space-x-4 mt-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="px-6"
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="px-6" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisaEnquiryForm;
