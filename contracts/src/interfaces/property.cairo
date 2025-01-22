use starhomes::models::property_models::{Property};
use starhomes::models::investment_model::InvestmentAsset;

#[starknet::interface]
pub trait IPropertyComponentTrait<TContractState> {
    fn list_property(ref self: TContractState, property: Property) -> felt252;
    fn list_investment_property(ref self: TContractState, investment: InvestmentAsset) -> felt252;
    fn get_property_by_id(self: @TContractState, property_id: felt252) -> Property;
    fn get_sale_properties(self: @TContractState) -> Array<Property>;
    fn get_investment_properties(self: @TContractState) -> Array<InvestmentAsset>;
    fn get_investment_by_id(self: @TContractState, investment_id: felt252) -> InvestmentAsset;
}
