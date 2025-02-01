import React from "react";
import { InvestmentAsset } from "@/types/investment";
import PropertyDetails from "./basic-information/PropertyDetails";
import PropertyStatus from "./basic-information/PropertyStatus";
import InvestmentOptions from "./basic-information/InvestmentOptions";

interface BasicInformationProps {
  formData: Partial<InvestmentAsset>;
  handleInputChange: (field: keyof InvestmentAsset, value: any) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <PropertyDetails
        formData={formData}
        handleInputChange={handleInputChange}
      />

      <InvestmentOptions
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <PropertyStatus
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default BasicInformation;
