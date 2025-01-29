export const investmentTypes = [
  "Residential",
  "Commercial",
  "Industrial",
  "Mixed-Use",
  "Land Development",
  "Real Estate Investment Trust (REIT)",
  "Property Development",
  "Hotel & Hospitality",
  "Retail Space",
  "Warehouse & Logistics",
  "Office Building",
  "Multi-Family Housing"
] as const;

export const riskLevels = ["Low", "Medium", "High"] as const;

export const zoningTypes = [
  "Residential",
  "Commercial",
  "Industrial", 
  "Mixed-Use",
  "Special Purpose"
] as const;

export const constructionStatus = [
  "Completed",
  "Under Construction", 
  "Pre-Construction",
  "Renovation"
] as const;

export type InvestmentType = typeof investmentTypes[number];
export type RiskLevel = typeof riskLevels[number];
export type ZoningType = typeof zoningTypes[number];
export type ConstructionStatusType = typeof constructionStatus[number];

export interface InvestmentAsset {
    id: string;                      
    name: string;                    
    description: string;             
    isActive: boolean;               
    location: string;                
    size: string;                    
    investorId: string;              
    owner: string;                   
    constructionStatus: string;      
    assetValue: string;              
    availableStakingAmount: string;  
    investmentType: string;          
    constructionYear: number;        
    propertyPrice: string;           
    expectedRoi: string;             
    rentalIncome: string;            
    maintenanceCosts: string;        
    taxBenefits: string;             
    highlights: string;              
    marketAnalysis: string;          
    riskFactors: string;             
    legalDetailsId: string;          
    additionalFeatures: string;      
    images: string;                  
    investmentToken: string;         
    minInvestmentAmount: string;     
}