use starknet::ContractAddress;

#[derive(Clone,Drop, Serde, starknet::Store)]
pub struct MarketAnalysis {
    pub area_growth: felt252,
    pub occupancy_rate: felt252,
    pub comparable_properties: felt252,
    pub demand_trend: felt252,
} 

#[derive(Clone,Drop, Serde, starknet::Store)]
struct LegalDetails {
    pub ownership: felt252,
    pub zoning: felt252,
    pub permits: felt252,
    pub documents_id: felt252,
}



#[derive(Clone,Drop, Serde, starknet::Store)]
pub struct InvestmentAsset {
    pub id: felt252,
    pub name: felt252,
    pub location: felt252,
    pub size: felt252,
    pub investor_id: felt252,
    pub owner: ContractAddress,
    pub asset_value: u256,
    pub available_staking_amount: u256,
    pub is_active: bool,
    pub investment_type: felt252,
    pub construction_year: u64,
    pub property_price : u256,
    pub expected_roi: felt252,
    pub rental_income: u256,
    pub maintenance_costs: u256,
    pub tax_benefits: felt252,
    pub highlights: ByteArray,
    pub market_analysis: MarketAnalysis,
    pub risk_factors: ByteArray,
    pub legal_details: LegalDetails,
    pub additional_features: ByteArray,
    pub images: felt252,
    pub investment_token: ContractAddress,
    pub min_investment_amount: u256,
}
