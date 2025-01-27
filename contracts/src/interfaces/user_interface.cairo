// use starhomes::model::models::{ Investor,  Agent};
use starhomes::models::user_models::{User};
use starknet::ContractAddress;
#[starknet::interface]
pub trait IUsersComponentTrait<TContractState> {
    fn register_user(ref self: TContractState, user: User) -> felt252;
    fn edit_user(ref self: TContractState, user_id: ContractAddress, user: User) -> felt252;
    fn get_user_by_address(self: @TContractState, user_id: ContractAddress) -> User;
    fn get_investors(self: @TContractState) -> Array<User>;
    fn get_investor(self: @TContractState) -> User;
    fn get_agents(self: @TContractState) -> Array<User>;
    fn get_agent(self: @TContractState, agent_id: ContractAddress) -> User;
    fn register_as_agent(ref self: TContractState, user_id: ContractAddress) -> felt252;
    fn register_as_investor(ref self: TContractState, user_id: ContractAddress) -> felt252;
    fn authorize_as_investment_lister(ref self: TContractState, investor_address: ContractAddress);
    // fn edit_agent(ref self: TContractState, agent: Agent) -> felt252;
//  fn edit_investor(ref self: TContractState, investor: Investor) -> felt252;
}
