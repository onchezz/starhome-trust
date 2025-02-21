use starhomes::models::property_models::{Property};
use starhomes::models::investment_model::InvestmentAsset;
use starhomes::models::user_models::UserVisitRequest;
use starknet::ContractAddress;
// use starknet::class_hash::ClassHash;
// use starknet::storage::{
//     Map, StorageMapReadAccess, StorageMapWriteAccess, Vec, VecTrait, MutableVecTrait,
// };

#[starknet::interface]
pub trait IStarhomesContract<TContractState> {
    fn list_property(ref self: TContractState, property: Property) -> felt252;
    fn list_investment_property(ref self: TContractState, investment_asset: InvestmentAsset);
    fn send_visit_request(ref self: TContractState, visit_request: UserVisitRequest);
    fn read_visit_requests(self: @TContractState, property_id: felt252) -> Array<UserVisitRequest>;

    fn invest_in_investment_property(ref self: TContractState, investment_id: felt252, amount: u256);
    fn get_property_balance(self: @TContractState, property_id: felt252) -> u256;
    fn withdraw_from_investment_property(ref self: TContractState, investment_id: felt252, amount: u256);
    fn pay_property(ref self: TContractState, property_id: felt252, amount: u256);
    fn withdraw_from_property(ref self: TContractState, property_id: felt252);
    fn get_investors_for_investment(
        self: @TContractState, investment_id: felt252,
    ) -> Array<ContractAddress>;
    fn get_investor_balance_in_investment(
        self: @TContractState, investment_id: felt252, investor_address: ContractAddress,
    ) -> u256;
    fn get_investment_manager(self: @TContractState, investment_id: felt252) -> ContractAddress;
    fn set_annual_investment_rate(ref self: TContractState, investment_id: felt252, rate: u256);
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
    fn read_investor_returns(
        self: @TContractState, investment_id: felt252, investor: ContractAddress,
    ) -> u256;
    fn read_update(self: @TContractState) -> u256;
    fn version(self: @TContractState) -> u64;
}

