use starknet::ContractAddress;

#[derive(Clone, Drop, Serde, starknet::Store)]
pub struct MarketAnalysis {
    pub area_growth: felt252,
    pub occupancy_rate: felt252,
    pub comparable_properties: felt252,
    pub demand_trend: felt252,
}

#[derive(Clone, Drop, Serde, starknet::Store)]
struct LegalDetails {
    pub ownership: felt252,
    pub zoning: felt252,
    pub permits: felt252,
    pub documents_id: felt252,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Location {
    pub address: felt252,
    pub city: felt252,
    pub state: felt252,
    pub country: felt252,
    pub latitude: felt252,
    pub longitude: felt252,
}

#[derive(Clone, Drop, Serde, starknet::Store)]
pub struct InvestmentAsset {
    pub id: felt252,
    pub name: felt252,
    pub description: ByteArray,
    pub is_active: bool,
    pub location: Location,
    pub size: felt252,
    pub investor_id: ContractAddress,
    pub owner: ContractAddress,
    pub construction_status: felt252,
    pub asset_value: u256,
    pub available_staking_amount: u256,
    pub investment_type: felt252,
    pub construction_year: u64,
    pub property_price: u256,
    pub expected_roi: felt252,
    pub rental_income: u256,
    pub maintenance_costs: u256,
    pub tax_benefits: ByteArray,
    pub highlights: ByteArray,
    pub market_analysis: ByteArray,
    pub risk_factors: ByteArray,
    pub legal_detail: ByteArray,
    pub additional_features: ByteArray,
    pub images: ByteArray,
    pub investment_token: ContractAddress,
    pub min_investment_amount: u256,
    pub investors: u64,
}
