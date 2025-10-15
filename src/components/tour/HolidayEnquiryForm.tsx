import React, { useState, useMemo } from "react";
import { Country } from "country-state-city";
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
  "Leisure",
  "Business",
  "Adventure",
  "Family",
  "Honeymoon",
  "Group",
  "Solo",
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
    attachment: null as File | null,
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, attachment: file || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Holiday Enquiry Form submitted:", formData);
    onOpenChange(false);
  };

  return (
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
                <Label htmlFor="firstName" className="text-xs">
                  First Name*
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-xs">
                  Last Name*
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Country of Residence*</Label>
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
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Nationality*</Label>
                <Select
                  value={formData.nationality}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, nationality: value }))
                  }
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose your nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="email" className="text-xs">
                  Email Address*
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Phone Code*</Label>
                <Select
                  value={formData.phoneCode}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, phoneCode: value }))
                  }
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose phone code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.isoCode}
                        value={country.phonecode}
                      >
                        {country.name} (+{country.phonecode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-xs">
                  Phone Number*
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Trip Type*</Label>
                <Select
                  value={formData.tripType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, tripType: value }))
                  }
                  required
                >
                  <SelectTrigger className="h-10">
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
              </div>
              <div>
                <Label htmlFor="companyName" className="text-xs">
                  Name of the Company
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="h-10"
                />
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
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
              </div>
              <div>
                <Label htmlFor="toDate" className="text-xs">
                  To Date*
                </Label>
                <Input
                  id="toDate"
                  name="toDate"
                  type="date"
                  value={formData.toDate}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
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
                    onClick={() => handleCounterChange("adults", false)}
                    disabled={formData.adults <= 1}
                  >
                    -
                  </Button>
                  <span className="text-sm px-2">{formData.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCounterChange("adults", true)}
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
                    onClick={() => handleCounterChange("children", false)}
                    disabled={formData.children <= 0}
                  >
                    -
                  </Button>
                  <span className="text-sm px-2">{formData.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCounterChange("children", true)}
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
                    onClick={() => handleCounterChange("infants", false)}
                    disabled={formData.infants <= 0}
                  >
                    -
                  </Button>
                  <span className="text-sm px-2">{formData.infants}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCounterChange("infants", true)}
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
              <Label htmlFor="totalBudget" className="text-xs">
                Total Budget
              </Label>
              <Input
                id="totalBudget"
                name="totalBudget"
                type="number"
                placeholder="Enter amount"
                value={formData.totalBudget}
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
                  className="h-10"
                  required
                />
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
                <Label htmlFor="attachment" className="text-xs">
                  File Attachment (Optional)
                </Label>
                <Input
                  id="attachment"
                  name="attachment"
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
              <Button type="button" variant="outline" className="px-6">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="px-6">
              Submit Enquiry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HolidayEnquiryForm;
