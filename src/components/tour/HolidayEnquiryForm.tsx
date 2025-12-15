import React, { useState, useMemo, useEffect } from "react";
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

// Customer Types (matching API enum)
const CUSTOMER_TYPES = [
  "Corporate",
  "Group",
  "Solo",
  "Student",
  "Cruise",
  "Others",
];

interface HolidayEnquiryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId?: number | string;
  packageName?: string;
  destination?: string;
}

const HolidayEnquiryForm: React.FC<HolidayEnquiryFormProps> = ({
  open,
  onOpenChange,
  packageId,
  packageName,
  destination,
}) => {
  // Prepare countries sorted by name
  const countries = useMemo(() => Country.getAllCountries(), []);
  
  // Prepare countries sorted by name for phone code dropdown
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryOfResidence: "",
    nationality: "",
    email: "",
    phoneCode: "",
    phoneNumber: "",
    tripType: "",
    companyName: "",
    residence: "",
    fromDate: "",
    toDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    totalBudget: "",
    destination: "",
    packageName: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Auto-populate package name and destination when form opens with package info
  useEffect(() => {
    if (open) {
      setFormData((prev) => ({
        ...prev,
        ...(packageName && { packageName: packageName }),
        ...(destination && { destination: destination }),
      }));
    }
  }, [open, packageName, destination]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCounterChange = (
    field: "adults" | "children" | "infants",
    increment: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, increment ? prev[field] + 1 : prev[field] - 1),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare the data for submission
      const submissionData = {
        enquiryType: "PACKAGE",
        customerFirstName: formData.firstName,
        customerLastName: formData.lastName,
        countryOfResidence: formData.countryOfResidence,
        nationality: formData.nationality,
        customerPhone: `+${formData.phoneCode}${formData.phoneNumber}`,
        customerEmail: formData.email,
        customerType: formData.tripType,
        companyName: formData.companyName || undefined,
        residence: formData.residence || undefined,
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        budget: formData.totalBudget ? parseFloat(formData.totalBudget) : undefined,
        destination: formData.destination || undefined,
        enquiryDesc: formData.description || undefined,
        packageId: packageId ? (typeof packageId === 'string' ? parseInt(packageId) : packageId) : undefined,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
      };

      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();

      if (responseData.success === true) {
        toast.success(responseData.message || "Enquiry submitted successfully! We'll contact you soon.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Close the dialog after a short delay
        setTimeout(() => {
          onOpenChange(false);
          // Reset form
          setFormData({
            firstName: "",
            lastName: "",
            countryOfResidence: "",
            nationality: "",
            email: "",
            phoneCode: "",
            phoneNumber: "",
            tripType: "",
            companyName: "",
            residence: "",
            fromDate: "",
            toDate: "",
            adults: 1,
            children: 0,
            infants: 0,
            totalBudget: "",
            destination: "",
            packageName: "",
            description: "",
          });
        }, 1500);
      } else {
        toast.error(
          responseData.message || responseData.data || "Failed to submit enquiry. Please try again.",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (err) {
      console.error("Error submitting enquiry:", err);
      toast.error("Network error! Unable to submit enquiry. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
        <DialogContent className="max-w-[98vw] w-full p-2 max-h-[98vh] overflow-hidden">
          <DialogHeader className="p-1">
            <DialogTitle className="text-xs mb-0 text-center font-semibold">
              Holiday Enquiry Form
            </DialogTitle>
          </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-lg p-4 space-y-4"
        >
          {/* Personal Information Row */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-xs font-medium">
                First Name*
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="h-7 text-xs"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-xs font-medium">
                Last Name*
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="h-7 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-medium">
                Country of Residence*
              </Label>
              <Select
                value={formData.countryOfResidence}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    countryOfResidence: value,
                  }))
                }
                required
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country, index) => (
                    <SelectItem
                      key={`tour-holiday-residence-${index}`}
                      value={country.isoCode}
                      className="text-xs"
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium">Nationality*</Label>
              <Select
                value={formData.nationality}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, nationality: value }))
                }
                required
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose nationality" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country, index) => (
                    <SelectItem
                      key={`tour-holiday-nationality-${index}`}
                      value={country.isoCode}
                      className="text-xs"
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information Row */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label htmlFor="email" className="text-xs font-medium">
                Email Address*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-7 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Phone Code*</Label>
              <Select
                value={formData.phoneCode}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, phoneCode: value }))
                }
                required
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {sortedCountries.map((country, index) => (
                    <SelectItem
                      key={`tour-holiday-phone-${index}`}
                      value={country.phonecode}
                      className="text-xs"
                    >
                      {country.name} (+{country.phonecode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="text-xs font-medium">
                Phone Number*
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Phone"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="h-7 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Customer Type*</Label>
              <Select
                value={formData.tripType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tripType: value }))
                }
                required
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose customer type" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-xs">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Company and Residence Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="companyName" className="text-xs font-medium">
                Company
              </Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Company name"
                value={formData.companyName}
                onChange={handleInputChange}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="residence" className="text-xs font-medium">
                Residence
              </Label>
              <Input
                id="residence"
                name="residence"
                placeholder="City/Residence"
                value={formData.residence}
                onChange={handleInputChange}
                className="h-7 text-xs"
              />
            </div>
          </div>

          {/* Travel Dates Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fromDate" className="text-xs font-medium">
                From Date*
              </Label>
              <Input
                id="fromDate"
                name="fromDate"
                type="date"
                value={formData.fromDate}
                onChange={handleInputChange}
                className="h-7 text-xs"
                required
              />
            </div>
            <div>
              <Label htmlFor="toDate" className="text-xs font-medium">
                To Date*
              </Label>
              <Input
                id="toDate"
                name="toDate"
                type="date"
                value={formData.toDate}
                onChange={handleInputChange}
                className="h-7 text-xs"
                required
              />
            </div>
          </div>

          {/* Passenger Details Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-medium">Adults*</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCounterChange("adults", false)}
                  disabled={formData.adults <= 1}
                >
                  -
                </Button>
                <span className="text-xs px-3 py-1 min-w-[40px] text-center border rounded">
                  {formData.adults}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCounterChange("adults", true)}
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium">Children*</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCounterChange("children", false)}
                  disabled={formData.children <= 0}
                >
                  -
                </Button>
                <span className="text-xs px-3 py-1 min-w-[40px] text-center border rounded">
                  {formData.children}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCounterChange("children", true)}
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium">Infants*</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCounterChange("infants", false)}
                  disabled={formData.infants <= 0}
                >
                  -
                </Button>
                <span className="text-xs px-3 py-1 min-w-[40px] text-center border rounded">
                  {formData.infants}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCounterChange("infants", true)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Budget and Destination Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="totalBudget" className="text-xs font-medium">
                Total Budget
              </Label>
              <Input
                id="totalBudget"
                name="totalBudget"
                type="number"
                placeholder="Amount"
                value={formData.totalBudget}
                onChange={handleInputChange}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="destination" className="text-xs font-medium">
                Destination
              </Label>
              <Input
                id="destination"
                name="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="h-7 text-xs"
                readOnly={!!destination}
              />
            </div>
            <div>
              <Label htmlFor="packageName" className="text-xs font-medium">
                Package Name*
              </Label>
              <Input
                id="packageName"
                name="packageName"
                placeholder="Package name"
                value={formData.packageName}
                onChange={handleInputChange}
                className="h-7 text-xs"
                readOnly={!!packageName}
                required
              />
            </div>
          </div>

          {/* Additional Information Row */}
          <div>
            <Label htmlFor="description" className="text-xs font-medium mb-1 block">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Additional details..."
              value={formData.description}
              onChange={handleInputChange}
              className="text-xs min-h-[80px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <DialogFooter className="flex justify-center space-x-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="px-6 h-8 text-xs"
                disabled={submitting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="px-6 h-8 text-xs"
              disabled={submitting}
            >
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
