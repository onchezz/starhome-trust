

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


export interface MarketAnalysis {
    areaGrowth: string;
    occupancyRate: string;
    comparableProperties: string;
    demandTrend: string;
}

export interface LegalDetails {
    ownership: string;
    zoning: string;
    permits: string;
    documentsId: string;
}

export interface InvestmentAsset {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    location: string;
    size: string;
    investorId: string;
    owner: string;
    constructionStatus:string,
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
    marketAnalysis: MarketAnalysis;
    riskFactors: string;
    legalDetails: LegalDetails;
    additionalFeatures: string;
    images: string;
    investmentToken: string;
    minInvestmentAmount: string;
}


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
    size: "75000", // 75,000 sq ft
    investorId: OWNER_ADDRESS,
    owner: OWNER_ADDRESS,
    assetValue: "25000000", // $25M
    availableStakingAmount: "15000000", // $15M
    investmentType: "1", // 1 for residential
    constructionYear: 2020,
    propertyPrice: "30000000", // $30M
    expectedRoi: "150", // 15.0%
    rentalIncome: "2000000", // $2M annual
    maintenanceCosts: "500000", // $500k annual
    taxBenefits: "100", // 10.0%
    highlights: "Premium finishes,24/7 security,Rooftop pool,Fitness center,EV charging",
    marketAnalysis: {
      areaGrowth: "80", // 8.0%
      occupancyRate: "950", // 95.0%
      comparableProperties: "8", // 8 similar properties
      demandTrend: "120" // 12.0% growth
    },
    riskFactors: "Market volatility,Construction delays,Regulatory changes",
    legalDetails: {
      ownership: "1", // 1 for full ownership
      zoning: "2", // 2 for mixed-use
      permits: "1", // 1 for all permits approved
      documentsId: "DOC123456"
    },
    additionalFeatures: "Smart home features,Green building certification,Underground parking",
    images: IPFS_IMAGE,
    investmentToken: INVESTMENT_TOKEN,
    minInvestmentAmount: "100000" // $100k minimum
  },
  {
    id: "2",
    name: "Commercial Office Tower",
    description: "Class A office building in tech district with 20 floors",
    isActive: true,
    location: "456 Innovation Drive, Austin, TX",
    size: "120000", // 120,000 sq ft
    investorId: OWNER_ADDRESS,
    owner: OWNER_ADDRESS,
    assetValue: "45000000", // $45M
    availableStakingAmount: "30000000", // $30M
    investmentType: "2", // 2 for commercial
    constructionYear: 2019,
    propertyPrice: "50000000", // $50M
    expectedRoi: "180", // 18.0%
    rentalIncome: "4000000", // $4M annual
    maintenanceCosts: "800000", // $800k annual
    taxBenefits: "120", // 12.0%
    highlights: "LEED certification,Floor-to-ceiling windows,Conference center,Tech-ready infrastructure",
    marketAnalysis: {
      areaGrowth: "100", // 10.0%
      occupancyRate: "880", // 88.0%
      comparableProperties: "5", // 5 similar properties
      demandTrend: "150" // 15.0% growth
    },
    riskFactors: "Tech sector dependency,Economic cycles,Remote work impact",
    legalDetails: {
      ownership: "1", // 1 for full ownership
      zoning: "3", // 3 for commercial
      permits: "1", // 1 for all permits approved
      documentsId: "DOC789012"
    },
    additionalFeatures: "Flexible floor plans,Bike storage,Shower facilities,Rooftop garden",
    images: IPFS_IMAGE,
    investmentToken: INVESTMENT_TOKEN,
    minInvestmentAmount: "250000" // $250k minimum
  }
];
