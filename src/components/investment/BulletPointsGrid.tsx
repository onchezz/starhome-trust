import React from "react";
import BulletPointInput from "./BulletPointInput";

interface BulletPointsGridProps {
  highlights: string[];
  riskFactors: string[];
  additionalFeatures: string[];
  setHighlights: (points: string[]) => void;
  setRiskFactors: (points: string[]) => void;
  setAdditionalFeatures: (points: string[]) => void;
}

const BulletPointsGrid: React.FC<BulletPointsGridProps> = ({
  highlights,
  riskFactors,
  additionalFeatures,
  setHighlights,
  setRiskFactors,
  setAdditionalFeatures,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <BulletPointInput
        label="Highlights"
        points={highlights}
        onChange={setHighlights}
      />
      <BulletPointInput
        label="Risk Factors"
        points={riskFactors}
        onChange={setRiskFactors}
      />
      <BulletPointInput
        label="Additional Features"
        points={additionalFeatures}
        onChange={setAdditionalFeatures}
      />
    </div>
  );
};

export default BulletPointsGrid;