use starhomes::models::property_models::{Property};
use starhomes::models::investment_model::InvestmentAsset;
use starknet::ContractAddress;
// use starknet::class_hash::ClassHash;
// use starknet::storage::{
//     Map, StorageMapReadAccess, StorageMapWriteAccess, Vec, VecTrait, MutableVecTrait,
// };

#[starknet::interface]
pub trait IStarhomesContract<TContractState> {
    fn list_property(ref self: TContractState, property: Property) -> felt252;
    fn list_investment_property(ref self: TContractState, investment_asset: InvestmentAsset);
    fn invest_in_property(ref self: TContractState, investment_id: felt252, amount: u256);
    fn withdraw_from_property(ref self: TContractState, investment_id: felt252, amount: u256);
    fn edit_property(ref self: TContractState, property_id: felt252, property: Property) -> felt252;
    fn edit_listed_investment_property(
        ref self: TContractState, investment_id: felt252, investment: InvestmentAsset,
    ) -> felt252;
    fn get_property(self: @TContractState, property_id: felt252) -> Property;
    fn get_sale_properties(self: @TContractState) -> Array<Property>;

    fn get_investment_properties_by_lister(
        self: @TContractState, lister_id: ContractAddress,
    ) -> Array<InvestmentAsset>;
    fn get_sale_properties_by_agent(
        self: @TContractState, agent_id: ContractAddress,
    ) -> Array<Property>;
    fn get_investment_properties(self: @TContractState) -> Array<InvestmentAsset>;
    fn get_investment(self: @TContractState, investment_id: felt252) -> InvestmentAsset;
    fn version(self: @TContractState) -> u64;
}

