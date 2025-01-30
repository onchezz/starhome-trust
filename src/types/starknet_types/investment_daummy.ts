import { InvestmentAsset } from "../investment";

// export interface MarketAnalysis {
//   area_growth: string;
//   occupancy_rate: string;
//   comparable_properties: string;
//   demand_trend: string;
// }

// // export interface StarknetInvestmentAsset {
// //   id: string;
// //   name: string;
// //   title?: string;
// //   description: string;
// //   is_active: boolean;
// //   location: string;
// //   size: number;
// //   investor_id: string;
// //   owner: string;
// //   construction_status: string;
// //   asset_value: number;
// //   available_staking_amount: number;
// //   investment_type: string;
// //   construction_year: number;
// //   property_price: number;
// //   expected_roi: string;
// //   rental_income: number;
// //   maintenance_costs: number;
// //   tax_benefits: string;
// //   highlights: string;
// //   market_analysis: string;
// //   risk_factors: string;
// //   legal_detail: string;
// //   additional_features: string;
// //   images: string;
// //   investment_token: string;
// //   min_investment_amount: number;
// //   // UI specific fields
// //   currentInvestment?: number;
// //   totalInvestment?: number;
// //   investors?: number;
// //   roi?: string;
// //   type?: string;
// //   minInvestment?: number;
// // }

export const dummyInvestment:InvestmentAsset = {
  id: "4354bf6d4175404495df",
  name: "Skyline Luxury Residences",
  description: "Premium residential complex featuring modern amenities and sustainable design",
  is_active: true,
  location: "Manhattan, NY",
  size: 120000,
  investor_id: '0x07b80d0f8512b5c4c052999e7d333020c91dbc40dff64933c8a5914c8c4c2e8c',
  owner: '0x07b80d0f8512b5c4c052999e7d333020c91dbc40dff64933c8a5914c8c4c2e8c',
  construction_status: 'completed',
  asset_value: 12000000,
  available_staking_amount: 5000000,
  investment_type: "Residential Real Estate",
  construction_year: 2023,
  property_price: 10000000,
  expected_roi: "12.5",
  rental_income: 800000,
  maintenance_costs: 120000,
  tax_benefits: "20.0",
  highlights: "LEED Platinum certified building, Rooftop garden with panoramic views, Smart home integration throughout, 24/7 concierge and security, Private wellness center",
  market_analysis: "8.5% annual market growth rate in the area, 95.5% average occupancy rate in luxury segment, Growing young professional demographic, Limited luxury inventory in immediate vicinity, Planned tech hub development nearby",
  risk_factors: "Market volatility, Interest rate fluctuations, Local real estate policy changes",
  legal_detail: "Zoned for mixed-use commercial C-2, All construction permits obtained, Compliant with local building codes, Single-entity LLC ownership structure, Standard residential usage restrictions",
  additional_features: "EV charging stations, Fitness center, Co-working space, Wine cellar",
  images: "https://gateway.pinata.cloud/ipfs/bafybeiczuk7ze63d3r3vc5mcatxnx5lj53i6rupnw55ohdf5pmksj5ygdm",
  investment_token: "0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080",
  min_investment_amount: 1000,
 
};

// Create an array of multiple investments for testing
const dummyInvestments: InvestmentAsset[] = [
  dummyInvestment,
  {
    ...dummyInvestment,
    id: "2",
    name: "Tech Hub Offices",
    description: "Modern office complex catering to technology companies",
    investment_type: "Commercial Real Estate",
    size: 200000,
    asset_value: 20000000,
    available_staking_amount: 8000000,
    property_price: 18000000,
    investment_token: "TECHUB-001",
    highlights: "State-of-the-art networking infrastructure, Flexible floor plans, Green building certification, Innovation lab spaces, Collaborative areas",
    market_analysis: "10.2% tech sector growth in region, 92% occupancy rate for tech offices, Rising demand for flexible workspaces, Strong startup ecosystem, Major tech companies expanding locally",
    legal_detail: "Commercial zone designation, Tech hub tax incentives applicable, 5G infrastructure permits secured, Environmental compliance certified, Special economic zone benefits",
    
  },
  {
    ...dummyInvestment,
    id: "3",
    name: "Green Energy Industrial Park",
    description: "Sustainable industrial complex with solar power integration",
    investment_type: "Industrial Real Estate",
    size: 500000,
    asset_value: 25000000,
    available_staking_amount: 10000000,
    property_price: 22000000,
    investment_token: "GEIP-001",
    highlights: "On-site solar power generation, Smart grid integration, Zero-emission facility design, Advanced waste management system, Sustainable water management",
    market_analysis: "7.8% industrial sector growth, High demand for green facilities, Government incentives for sustainable industry, Rising energy costs driving efficiency demand, Strong ESG investment interest",
    legal_detail: "Industrial zone certification, Renewable energy permits, Environmental impact clearance, Grid connection agreements, Carbon credit eligibility",
   
  }
];

export const defaultInvestment = dummyInvestment;
export const testInvestments = dummyInvestments;
