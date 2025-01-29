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

// Updated to match Cairo contract structure
export interface InvestmentAsset {
    id: string;                      // felt252
    name: string;                    // felt252
    description: string;             // ByteArray
    isActive: boolean;               // bool
    location: string;                // felt252
    size: string;                    // felt252
    investorId: string;              // felt252
    owner: string;                   // ContractAddress
    constructionStatus: string;      // felt252
    assetValue: string;              // u64
    availableStakingAmount: string;  // u64
    investmentType: string;          // felt252
    constructionYear: number;        // u64
    propertyPrice: string;           // u64
    expectedRoi: string;             // felt252
    rentalIncome: string;            // u64
    maintenanceCosts: string;        // u64
    taxBenefits: string;             // felt252
    highlights: string;              // ByteArray
    marketAnalysis: string;          // ByteArray
    riskFactors: string;             // ByteArray
    legalDetailsId: string;          // ByteArray
    additionalFeatures: string;      // ByteArray
    images: string;                  // ByteArray
    investmentToken: string;         // ContractAddress
    minInvestmentAmount: string;     // u64
}

// Constants for testing/demo purposes
const OWNER_ADDRESS = "0x07b80d0f8512b5c4c052999e7d333020c91dbc40dff64933c8a5914c8c4c2e8c";
const INVESTMENT_TOKEN = "0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080";
const IPFS_IMAGE = "https://gateway.pinata.cloud/ipfs/bafybeiczuk7ze63d3r3vc5mcatxnx5lj53i6rupnw55ohdf5pmksj5ygdm";

export const dummyInvestmentProperties = [
  {
    id: "1",
    name: "Modern Apartment Complex",
    description: "Modern luxury apartment complex in prime downtown location with 50 units",
    isActive: true,
    location: "123 Downtown Avenue, Miami, FL",
    size: "75000",
    investorId: OWNER_ADDRESS,
    owner: OWNER_ADDRESS,
    constructionStatus: "Completed",
    assetValue: "25000000",
    availableStakingAmount: "15000000",
    investmentType: "1",
    constructionYear: 2020,
    propertyPrice: "30000000",
    expectedRoi: "150",
    rentalIncome: "2000000",
    maintenanceCosts: "500000",
    taxBenefits: "100",
    highlights: "Premium finishes,24/7 security,Rooftop pool,Fitness center,EV charging",
    marketAnalysis: JSON.stringify({
      areaGrowth: "80",
      occupancyRate: "950",
      comparableProperties: "8",
      demandTrend: "120"
    }),
    riskFactors: "Market volatility,Construction delays,Regulatory changes",
    legalDetailsId: "DOC123456",
    additionalFeatures: "Smart home features,Green building certification,Underground parking",
    images: IPFS_IMAGE,
    investmentToken: INVESTMENT_TOKEN,
    minInvestmentAmount: "100000"
  }
];