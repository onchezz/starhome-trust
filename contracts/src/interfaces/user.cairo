// use starhomes::model::models::{ Investor,  Agent};
use starhomes::models::user_models::{Investor, Agent};
use starknet::ContractAddress;
#[starknet::interface]
pub trait IUsersComponentTrait<TContractState> {
    fn get_investors(self: @TContractState) -> Array<Investor>;
    fn get_investor(self: @TContractState) -> Investor;
    fn register_investor(
        ref self: TContractState,
        investor:Investor,
    ) -> felt252;
    fn edit_investor(ref self: TContractState, investor: Investor) -> felt252;
     fn get_agents(self: @TContractState) -> Array<Agent>;
    fn get_agent(self: @TContractState, agent_id: ContractAddress) -> Agent;
    fn register_agent(
        ref self: TContractState,
        agent:Agent
    ) -> felt252;
    fn edit_agent(ref self: TContractState, agent: Agent) -> felt252;
}
