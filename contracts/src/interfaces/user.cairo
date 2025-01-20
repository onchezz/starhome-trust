// use starhomes::model::models::{ Investor,  Agent};
use starhomes::models::user_models::{Investor, Agent};
use starknet::ContractAddress;
#[starknet::interface]
pub trait IUsersComponentTrait<TContractState> {
    fn get_investors(self: @TContractState) -> Array<Investor>;
    fn get_investor(self: @TContractState) -> Investor;
    fn register_investor(
        ref self: TContractState,
        investor_name: felt252,
        investor_email: felt252,
        investor_phone: felt252,
        investor_address: felt252,
    ) -> felt252;
    fn edit_investor(ref self: TContractState, investor: Investor) -> felt252;
    fn get_agent(self: @TContractState, agent_id: ContractAddress) -> Agent;
    fn register_agent(
        ref self: TContractState,
        agent_name: felt252,
        agent_email: felt252,
        agent_phone: felt252,
        agent_address: felt252,
        agent_profile_image: felt252,
    ) -> felt252;
    fn edit_agent(ref self: TContractState, agent: Agent) -> felt252;
}
