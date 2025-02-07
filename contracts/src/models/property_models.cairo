use starknet::ContractAddress;
// use openzeppelin::token::erc20::interface::{IERC20Dispatcher};
use core::byte_array::ByteArray;

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Location {
    pub address: felt252,
    pub city: felt252,
    pub state: felt252,
    pub country: felt252,
    pub latitude: felt252,
    pub longitude: felt252,
}


#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Amenities {
    pub has_garden: bool,
    pub has_swimming_pool: bool,
    pub pet_friendly: bool,
    pub wheelchair_accessible: bool,
}


#[derive(Clone, Drop, Serde, starknet::Store)]
pub struct Property {
    pub id: felt252, // Use felt252 for string-like IDs
    pub title: felt252,
    pub description: ByteArray,
    pub location_address: felt252,
    pub city: felt252,
    pub state: felt252,
    pub country: felt252,
    pub latitude: felt252,
    pub longitude: felt252,
    pub price: u256,
    pub asking_price: u256,
    pub currency: felt252,
    pub area: u64,
    pub bedrooms: u64,
    pub bathrooms: u64,
    pub parking_spaces: u64,
    pub property_type: felt252,
    pub status: felt252,
    pub interested_clients: u64,
    pub annual_growth_rate: felt252,
    pub features_id: ByteArray,
    pub images_id: ByteArray, // Array of IPFS CIDs for images
    pub video_tour: ByteArray,
    pub agent_id: ContractAddress,
    pub date_listed: u64, // Date as a string (e.g., "2024-02-15")
    pub has_garden: bool,
    pub has_swimming_pool: bool,
    pub pet_friendly: bool,
    pub wheelchair_accessible: bool,
    pub asset_token: ContractAddress,
}

