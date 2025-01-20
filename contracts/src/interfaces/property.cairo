use starhomes::models::property_models::{Property};
use starknet::ContractAddress;
#[starknet::interface]
pub trait IPropertyComponentTrait<TContractState> {
    fn list_property(ref self: TContractState, property: Property,) ->
    felt252;
    // fn list_property(
    //     ref self: TContractState,
    //     id: felt252,
    //     title: felt252,
    //     description: ByteArray,
    //     location_address: felt252,
    //     city: felt252,
    //     state: felt252,
    //     country: felt252,
    //     latitude: felt252,
    //     longitude: felt252,
    //     price: u256,
    //     owner: ContractAddress,
    //     asking_price: u256,
    //     currency: felt252,
    //     area: u64,
    //     bedrooms: u64,
    //     bathrooms: u64,
    //     parking_spaces: u64,
    //     property_type: felt252,
    //     status: felt252,
    //     interested_clients: u256,
    //     annual_growth_rate: u256,
    //     features_id: felt252, // Array of features
    //     images_id: felt252, // Array of IPFS CIDs for images
    //     video_tour: felt252, // IPFS CID for the video tour
    //     agent_id: ContractAddress,
    //     date_listed: felt252, // Date as a string (e.g., "2024-02-15")
    //     has_garden: bool,
    //     has_swimming_pool: bool,
    //     pet_friendly: bool,
    //     wheelchair_accessible: bool,
    //     asset_token: ContractAddress,
    //     is_investment: bool,
    
    // ) -> felt252;
    fn invest_in_property(ref self: TContractState, investment_id: u256, amount: u256);
    fn get_property_by_id(self: @TContractState, property_id: felt252) -> Property;
    fn get_sale_properties(self: @TContractState) -> Array<Property>;
    fn get_investment_properties(self: @TContractState) -> Array<Property>;
    // fn get_property_by_id(self: @TContractState, property_id: felt252) -> Property;
}
