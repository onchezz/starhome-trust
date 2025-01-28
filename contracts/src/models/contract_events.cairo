use starknet::ContractAddress;
use starknet::class_hash::ClassHash;

#[derive(Copy, Drop, starknet::Event)]
pub struct PropertyListed {
    pub property_id: felt252,
    pub owner: ContractAddress,
    pub price: u64,
    pub payment_token: ContractAddress,
    pub timestamp: u64,
}
#[derive(Copy, Drop, starknet::Event)]
pub struct InvestmentListed {
    pub investment_id: felt252,
    pub owner: ContractAddress,
    pub asset_price: u64,
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
pub struct UserRegistered {
    pub user: ContractAddress,
    pub name: felt252,
    pub email: felt252,
    pub phone: felt252,
    pub timestamp: u64,
}
#[event]
#[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
pub struct BlogAdded {
    pub user: ContractAddress,
    pub author: felt252,
    pub timestamp: u64,
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

