use starknet::ContractAddress;
use starknet::class_hash::ClassHash;

#[derive(Copy, Drop, starknet::Event)]
pub struct PropertyListed {
    pub property_id: felt252,
    pub owner: ContractAddress,
    pub price: u256,
    pub payment_token: ContractAddress,
    pub timestamp: u64,
}
#[derive(Copy, Drop, starknet::Event)]
pub struct InvestmentListed {
    pub investment_id: felt252,
    pub owner: ContractAddress,
    pub asset_price: u256,
    pub payment_token: ContractAddress,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
pub struct PropertySold {
    pub property_id: felt252,
    pub old_owner: ContractAddress,
    pub new_owner: ContractAddress,
    pub price: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
pub struct InvestmentMade {
    pub property_id: felt252,
    pub investor: ContractAddress,
    pub amount: u256,
    // pub shares: u128,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
pub struct Upgraded {
    pub class_hash: ClassHash,
}

#[event]
#[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
pub enum Event {
    Deposit: Deposit,
    Withdrawal: Withdrawal,
    RewardsFinished: RewardsFinished,
}

#[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
pub struct Deposit {
    pub user: ContractAddress,
    pub amount: u256,
}

#[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
pub struct Withdrawal {
    pub user: ContractAddress,
    pub amount: u256,
}

#[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
pub struct RewardsFinished {
    pub msg: felt252,
}

