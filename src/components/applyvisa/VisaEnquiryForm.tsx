import React, { useState, useMemo } from "react";
import { Country, State, City } from "country-state-city";
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

// Visa Types (sample, can be expanded)
const VISA_TYPES = [
  "Tourist Visa",
  "Business Visa",
  "Student Visa",
  "Work Visa",
  "Transit Visa",
];

interface VisaEnquiryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VisaEnquiryForm: React.FC<VisaEnquiryFormProps> = ({
  open,
  onOpenChange,
}) => {
  // Prepare countries, states, and cities
  const countries = useMemo(() => Country.getAllCountries(), []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryOfResidence: "",
    countryCode: "",
    nationality: "",
    stateOfResidence: "",
    cityOfResidence: "",
    destinationCountry: "",
    destinationState: "",
    destinationCity: "",
    visaType: "",
    travelDate: "",
    phoneNumber: "",
    email: "",
    adults: 1,
    children: 0,
    description: "",
    attachment: null as File | null,
  });

  // Dynamic state and city handling
  const [residenceStates, setResidenceStates] = useState<any[]>([]);
  const [residenceCities, setResidenceCities] = useState<any[]>([]);
  const [destinationStates, setDestinationStates] = useState<any[]>([]);
  const [destinationCities, setDestinationCities] = useState<any[]>([]);

  const handleCountryChange = (
    field: "countryOfResidence" | "nationality" | "destinationCountry",
    value: string
  ) => {
    const selectedCountry = countries.find((c) => c.isoCode === value);

    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset dependent fields
      ...(field === "countryOfResidence" && {
        stateOfResidence: "",
        cityOfResidence: "",
      }),
      ...(field === "destinationCountry" && {
        destinationState: "",
        destinationCity: "",
      }),
    }));

    // Update states based on selected country
    if (field === "countryOfResidence") {
      const states = selectedCountry
        ? State.getStatesOfCountry(selectedCountry.isoCode)
        : [];
      setResidenceStates(states);
      setResidenceCities([]);
    } else if (field === "destinationCountry") {
      const states = selectedCountry
        ? State.getStatesOfCountry(selectedCountry.isoCode)
        : [];
      setDestinationStates(states);
      setDestinationCities([]);
    }
  };

  const handleStateChange = (
    field: "stateOfResidence" | "destinationState",
    value: string
  ) => {
    const countryField =
      field === "stateOfResidence"
        ? "countryOfResidence"
        : "destinationCountry";
    const selectedCountry = countries.find(
      (c) => c.isoCode === formData[countryField]
    );

    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset city
      ...(field === "stateOfResidence" && { cityOfResidence: "" }),
      ...(field === "destinationState" && { destinationCity: "" }),
    }));

    // Update cities based on selected state
    if (field === "stateOfResidence" && selectedCountry) {
      const cities = City.getCitiesOfState(selectedCountry.isoCode, value);
      setResidenceCities(cities);
    } else if (field === "destinationState" && selectedCountry) {
      const cities = City.getCitiesOfState(selectedCountry.isoCode, value);
      setDestinationCities(cities);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCounterChange = (
    field: "adults" | "children",
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
    console.log("Form submitted:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] w-full p-6">
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
                <Label htmlFor="firstName" className="text-xs">
                  First Name*
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="h-8 text-xs"
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
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Country of Residence*</Label>
                <Select
                  value={formData.countryOfResidence}
                  onValueChange={(value) =>
                    handleCountryChange("countryOfResidence", value)
                  }
                  required
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.isoCode}
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
                <Label className="text-xs">Nationality*</Label>
                <Select
                  value={formData.nationality}
                  onValueChange={(value) =>
                    handleCountryChange("nationality", value)
                  }
                  required
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.isoCode}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">State of Residence*</Label>
                <Select
                  value={formData.stateOfResidence}
                  onValueChange={(value) =>
                    handleStateChange("stateOfResidence", value)
                  }
                  disabled={!formData.countryOfResidence}
                  required
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {residenceStates.map((state) => (
                      <SelectItem
                        key={state.isoCode}
                        value={state.isoCode}
                        className="text-xs"
                      >
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">City of Residence*</Label>
                <Select
                  value={formData.cityOfResidence}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, cityOfResidence: value }))
                  }
                  disabled={!formData.stateOfResidence}
                  required
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {residenceCities.map((city) => (
                      <SelectItem
                        key={city.name}
                        value={city.name}
                        className="text-xs"
                      >
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 2. Travel Information */}
          <div className="space-y-3 border p-3 rounded-lg">
            <h3 className="text-base font-semibold mb-2">Travel Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Destination Country*</Label>
                <Select
                  value={formData.destinationCountry}
                  onValueChange={(value) =>
                    handleCountryChange("destinationCountry", value)
                  }
                  required
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.isoCode}
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
                <Label className="text-xs">Type of Visa*</Label>
                <Select
                  value={formData.visaType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, visaType: value }))
                  }
                  required
                >
                  <SelectTrigger className="h-8 text-xs">
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
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Destination State*</Label>
                <Select
                  value={formData.destinationState}
                  onValueChange={(value) =>
                    handleStateChange("destinationState", value)
                  }
                  disabled={!formData.destinationCountry}
                  required
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationStates.map((state) => (
                      <SelectItem
                        key={state.isoCode}
                        value={state.isoCode}
                        className="text-xs"
                      >
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Destination City*</Label>
                <Select
                  value={formData.destinationCity}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, destinationCity: value }))
                  }
                  disabled={!formData.destinationState}
                  required
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationCities.map((city) => (
                      <SelectItem
                        key={city.name}
                        value={city.name}
                        className="text-xs"
                      >
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="travelDate" className="text-xs">
                Tentative Travel Date*
              </Label>
              <Input
                id="travelDate"
                name="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={handleInputChange}
                className="h-8 text-xs"
                required
              />
            </div>
          </div>

          {/* 3. Contact Information */}
          <div className="space-y-3 border p-3 rounded-lg">
            <h3 className="text-base font-semibold mb-2">
              Contact Information
            </h3>
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
                className="h-8 text-xs"
                required
              />
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
                className="h-8 text-xs"
                required
              />
            </div>
          </div>

          {/* 4. Passenger Details */}
          <div className="space-y-3 border p-3 rounded-lg">
            <h3 className="text-base font-semibold mb-2">Passenger Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Number of Adults*</Label>
                <div className="flex items-center space-x-2">
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
                  <span className="text-xs px-2">{formData.adults}</span>
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
                <Label className="text-xs">Number of Children*</Label>
                <div className="flex items-center space-x-2">
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
                  <span className="text-xs px-2">{formData.children}</span>
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
                <Label htmlFor="attachment" className="text-xs">
                  File Attachment (Optional)
                </Label>
                <Input
                  id="attachment"
                  name="attachment"
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

export default VisaEnquiryForm;
