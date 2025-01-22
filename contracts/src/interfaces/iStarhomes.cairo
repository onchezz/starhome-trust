use starhomes::models::property_models::{Property};
use starhomes::models::investment_model::InvestmentAsset;
// use starknet::ContractAddress;
// use starknet::class_hash::ClassHash;
// use starknet::storage::{
//     Map, StorageMapReadAccess, StorageMapWriteAccess, Vec, VecTrait, MutableVecTrait,
// };

#[starknet::interface]
pub trait IStarhomesContract<TContractState> {
    fn list_property(ref self: TContractState, property: Property) -> felt252;
    fn list_investment_property(ref self: TContractState, investment_asset: InvestmentAsset);
    fn invest_in_property(ref self: TContractState, investment_id: u256, amount: u256);
    fn get_property(self: @TContractState, property_id: felt252) -> Property;
    fn get_sale_properties(self: @TContractState) -> Array<Property>;
    fn get_investment_properties(self: @TContractState) -> Array<InvestmentAsset>;
    fn get_investment(self: @TContractState, investment_id: felt252) -> InvestmentAsset;
    fn version(self: @TContractState) -> u64;
}

