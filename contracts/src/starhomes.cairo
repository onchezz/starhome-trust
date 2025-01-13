use starknet::ContractAddress;
use starknet::class_hash::ClassHash;

#[starknet::interface]
trait IStarhomesContract<TContractState> {
    fn list_property(ref self: TContractState, price: u256, total_shares: u256, payment_token: ContractAddress) -> u256;
    fn invest_in_property(ref self: TContractState, property_id: u256, shares_to_buy: u256);
    fn get_property(self: @TContractState, property_id: u256) -> Property;
    fn get_investment(self: @TContractState, property_id: u256, investor: ContractAddress) -> Investment;
    fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
}

mod contract {
    use super::IStarhomesContract;
    use super::lib::StarhomesContract;
}