import React from "react";
import { InvestmentAsset } from "@/types/investment";
import PropertyDetails from "./basic-information/PropertyDetails";
import PropertyStatus from "./basic-information/PropertyStatus";
import InvestmentOptions from "./basic-information/InvestmentOptions";

interface BasicInformationProps {
  formData: Partial<InvestmentAsset>;
  handleInputChange: (field: keyof InvestmentAsset, value: any) => void;
  editMode?: boolean;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  handleInputChange,
  editMode = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <PropertyDetails
        formData={formData}
        handleInputChange={handleInputChange}
        editMode={editMode}
      />

      <InvestmentOptions
        formData={formData}
        handleInputChange={handleInputChange}
        editMode={editMode}
      />
      <PropertyStatus
        formData={formData}
        handleInputChange={handleInputChange}
        editMode={editMode}
      />
    </div>
  );
};

export default BasicInformation;