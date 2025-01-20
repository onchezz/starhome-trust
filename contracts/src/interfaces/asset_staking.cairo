// use starhomes::model::models::{Property, Investor, TrustAssetProperty, Agent};
use starknet::ContractAddress;
#[starknet::interface]
pub trait IAssetStakingTrait<TContractState> {
    // fn change_staking_tokens(
    //     ref self: TContractState,
    //     propertyId:felt252,
    //     staking_token_address: ContractAddress,
    //     reward_token_address: ContractAddress,
    // ) -> felt252;
    // fn set_reward_amount(ref self: TContractState, amount: u256);
    // fn set_reward_duration(ref self: TContractState, duration: u256);
    fn initialize_property_token(
        ref self: TContractState, token_address: ContractAddress, property_id: felt252,
    );
    fn stake(ref self: TContractState, property_id: felt252, amount: u256) -> bool;
    fn withdraw(ref self: TContractState, property_id: felt252, amount: u256) -> bool;
    fn get_rewards(self: @TContractState, account: ContractAddress, property_id: felt252) -> u256;
    fn claim_rewards(ref self: TContractState, property_id: felt252);
}
