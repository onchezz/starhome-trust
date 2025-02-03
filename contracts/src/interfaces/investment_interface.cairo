use starknet::{ContractAddress};
#[starknet::interface]
pub trait IInvestmentTrait<TContractState> {
    // Initialize a new investment opportunity
    fn initialize_investment(
        ref self: TContractState,
        investment_id: felt252,
        token: ContractAddress,
        manager: ContractAddress,
        min_lock: u256,
        withdrawal_fee: u16,
        annual_return_rate: u256,
    );

    // Core investment functions
    fn invest(ref self: TContractState, investment_id: felt252, amount: u256) -> bool;
    fn withdraw(ref self: TContractState, investment_id: felt252, amount: u256) -> bool;

    // Investment management functions
    fn set_lock_period(ref self: TContractState, investment_id: felt252, duration: u256);
    fn set_investment_cap(
        ref self: TContractState, investor: ContractAddress, investment_id: felt252, cap: u256,
    );
    fn set_min_investment(ref self: TContractState, investment_id: felt252, min_amount: u256);
    fn set_annual_return_rate(ref self: TContractState, investment_id: felt252, rate: u256);

    // View functions
    fn get_investment_balance(
        self: @TContractState, investor: ContractAddress, investment_id: felt252,
    ) -> u256;
    fn get_lock_period_end(
        self: @TContractState, investor: ContractAddress, investment_id: felt252,
    ) -> u256;
    fn get_earned_returns(
        self: @TContractState, investor: ContractAddress, investment_id: felt252,
    ) -> u256;
    fn get_investment_metrics(self: @TContractState, investment_id: felt252) -> (u256, u32, u256);
    fn get_investors_for_asset(
        self: @TContractState, investment_id: felt252,
    ) -> Array<ContractAddress>;
    fn get_manager(self: @TContractState, investment_id: felt252) -> ContractAddress;
}
