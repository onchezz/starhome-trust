// src/components/PropertyForm.tsx
import React, { useState } from "react";
import { Dropdown, TokenSelector } from "./dropdown";
// import { Dropdown } from "./Dropdown";
// import { TokenSelector } from "./TokenSelector";

const tokenAddresses = {
  USDT: "0x02ab8758891e84b968ff11361789070c6b1af2df618d6d2f4a78b0757573c6eb",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
};

const booleanOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export const PropertyForm: React.FC = () => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    locationAddress: "",
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
    price: "",
    owner: "",
    askingPrice: "",
    currency: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpaces: "",
    propertyType: "",
    status: "",
    interestedClients: "",
    annualGrowthRate: "",
    featuresId: "",
    imagesId: "",
    videoTour: "",
    agentId: "",
    dateListed: "",
    hasGarden: false,
    hasSwimmingPool: false,
    petFriendly: false,
    wheelchairAccessible: false,
    assetToken: tokenAddresses.USDT,
    isInvestment: false,
    timestamp: "",
  });

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add logic to send transaction
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="ID"
        value={formData.id}
        onChange={(e) => handleChange("id", e.target.value)}
      />
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <Dropdown
        label="Has Garden"
        options={booleanOptions}
        value={formData.hasGarden}
        onChange={(value) => handleChange("hasGarden", value)}
      />
      <Dropdown
        label="Has Swimming Pool"
        options={booleanOptions}
        value={formData.hasSwimmingPool}
        onChange={(value) => handleChange("hasSwimmingPool", value)}
      />
      <TokenSelector
        label="Asset Token"
        tokens={tokenAddresses}
        value={formData.assetToken}
        onChange={(value) => handleChange("assetToken", value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};



// // src/pages/AddPropertyPage.tsx
// import React from "react";
// import { PropertyForm } from "../components/PropertyForm";

export const AddPropertyPage: React.FC = () => {
  return (
    <div>
      <h1>Add Property</h1>
      <PropertyForm />
    </div>
  );
};

