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
      <DialogContent className="max-w-[98vw] w-full p-2 max-h-[98vh] overflow-hidden">
        <DialogHeader className="p-1">
          <DialogTitle className="text-sm mb-0 text-center font-semibold">
            Holiday Enquiry Form
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2">
          {/* 1. Personal Information */}
          <div className="space-y-1 border p-1.5 rounded">
            <h3 className="text-xs font-semibold mb-0.5">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label htmlFor="firstName" className="text-[10px]">
                  First Name*
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="h-6 text-[10px] px-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-[10px]">
                  Last Name*
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="h-6 text-[10px] px-2"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label className="text-[10px]">Country of Residence*</Label>
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
                  <SelectTrigger className="h-6 text-[10px]">
                    <SelectValue placeholder="Choose country" />
                  </SelectTrigger>
                <SelectContent>
                  {countries.map((country, index) => (
                    <SelectItem
                      key={`holiday-residence-${index}`}
                      value={country.isoCode}
                      className="text-[10px]"
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px]">Nationality*</Label>
              <Select
                value={formData.nationality}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, nationality: value }))
                }
                required
              >
                <SelectTrigger className="h-6 text-[10px]">
                  <SelectValue placeholder="Choose nationality" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country, index) => (
                    <SelectItem
                      key={`holiday-nationality-${index}`}
                      value={country.isoCode}
                      className="text-[10px]"
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 2. Contact Information */}
          <div className="space-y-1 border p-1.5 rounded">
            <h3 className="text-xs font-semibold mb-0.5">
              Contact Information
            </h3>
            <div>
              <Label htmlFor="email" className="text-[10px]">
                Email Address*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-6 text-[10px] px-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label className="text-[10px]">Phone Code*</Label>
                <Select
                  value={formData.phoneCode}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, phoneCode: value }))
                  }
                  required
                >
                  <SelectTrigger className="h-6 text-[10px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                <SelectContent>
                  {sortedCountries.map((country, index) => (
                    <SelectItem
                      key={`holiday-phone-${index}`}
                      value={country.phonecode}
                      className="text-[10px]"
                    >
                      {country.name} (+{country.phonecode})
                    </SelectItem>
                  ))}
                </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-[10px]">
                  Phone Number*
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="h-6 text-[10px] px-2"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px]">Trip Type*</Label>
              <Select
                value={formData.tripType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tripType: value }))
                }
                required
              >
                <SelectTrigger className="h-6 text-[10px]">
                  <SelectValue placeholder="Choose trip type" />
                </SelectTrigger>
                <SelectContent>
                  {TRIP_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-[10px]">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="companyName" className="text-[10px]">
                Company
              </Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Company name"
                value={formData.companyName}
                onChange={handleInputChange}
                className="h-6 text-[10px] px-2"
              />
            </div>
            <div>
              <Label htmlFor="residence" className="text-[10px]">
                Residence
              </Label>
              <Input
                id="residence"
                name="residence"
                placeholder="City/Residence"
                value={formData.residence}
                onChange={handleInputChange}
                className="h-6 text-[10px] px-2"
              />
            </div>
          </div>

          {/* 3. Travel Information */}
          <div className="space-y-1 border p-1.5 rounded">
            <h3 className="text-xs font-semibold mb-0.5">Travel Information</h3>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label htmlFor="fromDate" className="text-[10px]">
                  From Date*
                </Label>
                <Input
                  id="fromDate"
                  name="fromDate"
                  type="date"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  className="h-6 text-[10px] px-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="toDate" className="text-[10px]">
                  To Date*
                </Label>
                <Input
                  id="toDate"
                  name="toDate"
                  type="date"
                  value={formData.toDate}
                  onChange={handleInputChange}
                  className="h-6 text-[10px] px-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* 4. Passenger Details */}
          <div className="space-y-1 border p-1.5 rounded">
            <h3 className="text-xs font-semibold mb-0.5">Passenger Details</h3>
            <div className="grid grid-cols-3 gap-1.5">
              <div>
                <Label className="text-[10px]">Adults*</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-5 w-5 text-[10px]"
                    onClick={() => handleCounterChange("adults", false)}
                    disabled={formData.adults <= 1}
                  >
                    -
                  </Button>
                  <span className="text-[10px] px-1 min-w-[20px] text-center">
                    {formData.adults}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-5 w-5 text-[10px]"
                    onClick={() => handleCounterChange("adults", true)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-[10px]">Children*</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-5 w-5 text-[10px]"
                    onClick={() => handleCounterChange("children", false)}
                    disabled={formData.children <= 0}
                  >
                    -
                  </Button>
                  <span className="text-[10px] px-1 min-w-[20px] text-center">
                    {formData.children}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-5 w-5 text-[10px]"
                    onClick={() => handleCounterChange("children", true)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-[10px]">Infants*</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-5 w-5 text-[10px]"
                    onClick={() => handleCounterChange("infants", false)}
                    disabled={formData.infants <= 0}
                  >
                    -
                  </Button>
                  <span className="text-[10px] px-1 min-w-[20px] text-center">
                    {formData.infants}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-5 w-5 text-[10px]"
                    onClick={() => handleCounterChange("infants", true)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Budget */}
          <div className="space-y-1 border p-1.5 rounded">
            <h3 className="text-xs font-semibold mb-0.5">Budget</h3>
            <div>
              <Label htmlFor="totalBudget" className="text-[10px]">
                Total Budget
              </Label>
              <Input
                id="totalBudget"
                name="totalBudget"
                type="number"
                placeholder="Amount"
                value={formData.totalBudget}
                onChange={handleInputChange}
                className="h-6 text-[10px] px-2"
              />
            </div>
          </div>

          {/* 6. Destination & Package */}
          <div className="space-y-1 border p-1.5 rounded">
            <h3 className="text-xs font-semibold mb-0.5">
              Destination & Package
            </h3>
            <div>
              <Label htmlFor="destination" className="text-[10px]">
                Destination
              </Label>
              <Input
                id="destination"
                name="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="h-6 text-[10px] px-2"
              />
            </div>
            <div>
              <Label htmlFor="packageName" className="text-[10px]">
                Package Name*
              </Label>
              <Input
                id="packageName"
                name="packageName"
                placeholder="Package name"
                value={formData.packageName}
                onChange={handleInputChange}
                className="h-6 text-[10px] px-2"
                required
              />
            </div>
          </div>

          {/* 7. Additional Information */}
          <div className="space-y-1 border p-1.5 rounded col-span-2">
            <h3 className="text-xs font-semibold mb-0.5">
              Additional Information
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label htmlFor="description" className="text-[10px]">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Additional details..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="text-[10px] h-14 px-2 py-1"
                />
              </div>
              <div>
                <Label htmlFor="attachment" className="text-[10px]">
                  File Attachment (Optional)
                </Label>
                <Input
                  id="attachment"
                  name="attachment"
                  type="file"
                  onChange={handleFileChange}
                  className="text-[10px] h-6"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <DialogFooter className="col-span-3 flex justify-center space-x-3 mt-1">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="px-4 h-7 text-xs"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="px-4 h-7 text-xs">
              Submit Enquiry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HolidayEnquiryForm;
