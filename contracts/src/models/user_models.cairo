use starknet::ContractAddress;

#[derive(Clone, Drop, Serde, starknet::Store)]
pub struct Agent {
    pub agent_id: ContractAddress,
    pub name: felt252,
    pub phone: felt252,
    pub email: felt252,
    pub profile_image: ByteArray // IPFS CID for the profile image
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Investor {
    pub investor_address: ContractAddress,
    pub name: felt252,
    pub email: felt252,
    pub phone: felt252,
    pub address: felt252,
    pub is_verified: bool,
    pub is_authorized: bool,
    pub timestamp: u64,
}

