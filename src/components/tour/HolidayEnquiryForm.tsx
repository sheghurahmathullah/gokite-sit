import React, { useState, useMemo } from "react";
import { Country } from "country-state-city";
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

// Trip Types
const TRIP_TYPES = [
  "Solo",
  "Group",
  "Corporate",
  "Student",
  "Cruise",
  "Others",
];

interface HolidayEnquiryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HolidayEnquiryForm: React.FC<HolidayEnquiryFormProps> = ({
  open,
  onOpenChange,
}) => {
  // Prepare countries
  const countries = useMemo(() => Country.getAllCountries(), []);

  // Get unique phone codes
  const phoneCodes = useMemo(() => {
    const codes = Array.from(new Set(countries.map((c) => c.phonecode))).filter(
      Boolean
    );
    return codes.sort((a, b) => Number(a) - Number(b));
  }, [countries]);

  const [formData, setFormData] = useState({
    customerFirstName: "",
    customerLastName: "",
    countryOfResidence: "",
    nationality: "",
    customerEmail: "",
    customerPhone: "",
    type: "",
    nameOfTheCompany: "",
    residence: "",
    fromDate: "",
    toDate: "",
    numberOfAdults: 1,
    numberOfChildren: 0,
    numberOfInfants: 0,
    budget: 0,
    destination: "",
    packageName: "",
    description: "",
    fileAttachment: null as File | null,
  });

  // API Integration States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const ENQUIRY_ENDPOINT = "/api/enquiry";

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

  const handleCounterChange = (
    field: "numberOfAdults" | "numberOfChildren" | "numberOfInfants",
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
    if (!formData.customerPhone)
      newErrors.customerPhone = "Phone code is required";
    if (!formData.customerEmail.trim())
      newErrors.customerEmail = "Email is required";
    if (!formData.type) newErrors.type = "Trip type is required";
    if (!formData.fromDate) newErrors.fromDate = "From date is required";
    if (!formData.toDate) newErrors.toDate = "To date is required";
    if (!formData.packageName.trim())
      newErrors.packageName = "Package name is required";

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
      const res = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getCookie("accesstoken")
            ? { Authorization: `Bearer ${getCookie("accesstoken")}` }
            : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({ message: "Submitted" }));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit enquiry");
      }

      // Show success toast
      toast.success("Holiday Enquiry Submitted Successfully! 🎉", {
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
          customerEmail: "",
          customerPhone: "",
          type: "",
          nameOfTheCompany: "",
          residence: "",
          fromDate: "",
          toDate: "",
          numberOfAdults: 1,
          numberOfChildren: 0,
          numberOfInfants: 0,
          budget: 0,
          destination: "",
          packageName: "",
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
        <DialogContent className="sm:max-w-[1200px] w-full p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl mb-2 text-center">
              Holiday Enquiry Form
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold mb-4 border-b pb-2">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerFirstName" className="text-xs">
                    First Name*
                  </Label>
                  <Input
                    id="customerFirstName"
                    name="customerFirstName"
                    placeholder="Enter your first name"
                    value={formData.customerFirstName}
                    onChange={handleInputChange}
                    className={`h-10 ${
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
                    placeholder="Enter your last name"
                    value={formData.customerLastName}
                    onChange={handleInputChange}
                    className={`h-10 ${
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
                <div>
                  <Label className="text-xs">Country of Residence*</Label>
                  <Select
                    value={formData.countryOfResidence}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        countryOfResidence: value,
                      }));
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
                      className={`h-10 ${
                        errors.countryOfResidence ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Choose your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.isoCode}
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
                      setFormData((prev) => ({ ...prev, nationality: value }));
                      if (errors.nationality) {
                        setErrors((prev) => ({ ...prev, nationality: "" }));
                      }
                    }}
                    required
                  >
                    <SelectTrigger
                      className={`h-10 ${
                        errors.nationality ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Choose your nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.isoCode}
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

            {/* 2. Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold mb-4 border-b pb-2">
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="customerEmail" className="text-xs">
                    Email Address*
                  </Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className={`h-10 ${
                      errors.customerEmail ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.customerEmail && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.customerEmail}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-xs">Phone Code*</Label>
                  <Select
                    value={formData.customerPhone}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        customerPhone: value,
                      }));
                      if (errors.customerPhone) {
                        setErrors((prev) => ({ ...prev, customerPhone: "" }));
                      }
                    }}
                    required
                  >
                    <SelectTrigger
                      className={`h-10 ${
                        errors.customerPhone ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Choose phone code" />
                    </SelectTrigger>
                    <SelectContent>
                      {phoneCodes.map((code) => (
                        <SelectItem key={code} value={code}>
                          +{code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerPhone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.customerPhone}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="residence" className="text-xs">
                    Residence
                  </Label>
                  <Input
                    id="residence"
                    name="residence"
                    placeholder="Enter your city / residence"
                    value={formData.residence}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs">Trip Type*</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, type: value }));
                      if (errors.type) {
                        setErrors((prev) => ({ ...prev, type: "" }));
                      }
                    }}
                    required
                  >
                    <SelectTrigger
                      className={`h-10 ${errors.type ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Choose trip type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIP_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-xs text-red-500 mt-1">{errors.type}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="nameOfTheCompany" className="text-xs">
                    Name of the Company
                  </Label>
                  <Input
                    id="nameOfTheCompany"
                    name="nameOfTheCompany"
                    placeholder="Enter company name"
                    value={formData.nameOfTheCompany}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* 3. Travel Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold mb-4 border-b pb-2">
                Travel Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromDate" className="text-xs">
                    From Date*
                  </Label>
                  <Input
                    id="fromDate"
                    name="fromDate"
                    type="date"
                    min={today}
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    className={`h-10 ${
                      errors.fromDate ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.fromDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.fromDate}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="toDate" className="text-xs">
                    To Date*
                  </Label>
                  <Input
                    id="toDate"
                    name="toDate"
                    type="date"
                    min={today}
                    value={formData.toDate}
                    onChange={handleInputChange}
                    className={`h-10 ${errors.toDate ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.toDate && (
                    <p className="text-xs text-red-500 mt-1">{errors.toDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Passenger Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold mb-4 border-b pb-2">
                Passenger Details
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Number of Adults*</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleCounterChange("numberOfAdults", false)
                      }
                      disabled={formData.numberOfAdults <= 1}
                    >
                      -
                    </Button>
                    <span className="text-sm px-2">
                      {formData.numberOfAdults}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
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
                      className="h-8 w-8"
                      onClick={() =>
                        handleCounterChange("numberOfChildren", false)
                      }
                      disabled={formData.numberOfChildren <= 0}
                    >
                      -
                    </Button>
                    <span className="text-sm px-2">
                      {formData.numberOfChildren}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleCounterChange("numberOfChildren", true)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Number of Infants*</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleCounterChange("numberOfInfants", false)
                      }
                      disabled={formData.numberOfInfants <= 0}
                    >
                      -
                    </Button>
                    <span className="text-sm px-2">
                      {formData.numberOfInfants}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleCounterChange("numberOfInfants", true)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Budget */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold mb-4 border-b pb-2">
                Budget
              </h3>
              <div>
                <Label htmlFor="budget" className="text-xs">
                  Total Budget
                </Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
            </div>

            {/* 6. Destination & Package */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold mb-4 border-b pb-2">
                Destination & Package
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="destination" className="text-xs">
                    Destination
                  </Label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="Enter destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="packageName" className="text-xs">
                    Package Name*
                  </Label>
                  <Input
                    id="packageName"
                    name="packageName"
                    placeholder="Enter package name"
                    value={formData.packageName}
                    onChange={handleInputChange}
                    className={`h-10 ${
                      errors.packageName ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.packageName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.packageName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 7. Additional Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold mb-4 border-b pb-2">
                Additional Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description" className="text-xs">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide any additional details or specific requests..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="h-24"
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
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <DialogFooter className="flex justify-center space-x-4 mt-2">
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

export default HolidayEnquiryForm;
