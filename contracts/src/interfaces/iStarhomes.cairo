// use starhomes::models::property_models::{Property, TrustAssetProperty};
// use starhomes::models::user_models::{Investor, Agent};
use starknet::ContractAddress;
// use starknet::class_hash::ClassHash;
// use starknet::storage::{
//     Map, StorageMapReadAccess, StorageMapWriteAccess, Vec, VecTrait, MutableVecTrait,
// };

#[starknet::interface]
pub trait IStarhomesContract<TContractState> {
    // fn list_property(ref self: TContractState, property: Property, property_description:
    // ByteArray,is_investment: bool) -> felt252;
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

    // fn get_properties(self: @TContractState) -> Array<Property>;
    // fn create_investment_property(
    //     ref self: TContractState,
    //     investment_id: felt252,
    //     investor_id: felt252,
    //     property_id: felt252,
    //     investment_token: ContractAddress,
    // );
    // fn invest_in_property(ref self: TContractState, investment_id: u256, amount: u256);
    // fn get_property(self: @TContractState, property_id: felt252) -> Property;
    // fn get_sale_properties(self: @TContractState) -> Array<Property>;
    // fn get_investment_properties(self: @TContractState) -> Array<Property>;
    // fn get_investment(self: @TContractState, investment_id: u256) -> TrustAssetProperty;
    // fn get_investors(self: @TContractState) -> Array<Investor>;
    // fn get_investor(self: @TContractState) -> Investor;
    // fn register_investor(
    //     ref self: TContractState,
    //     investor_name: felt252,
    //     investor_email: felt252,
    //     investor_phone: felt252,
    //     investor_address: felt252,
    // ) -> felt252;
    // fn edit_investor(ref self: TContractState, investor: Investor) -> felt252;
    // fn get_agent(self: @TContractState, agent_id: ContractAddress) -> Agent;
    // fn register_agent(
    //     ref self: TContractState,
    //     agent_name: felt252,
    //     agent_email: felt252,
    //     agent_phone: felt252,
    //     agent_address: felt252,
    //     agent_profile_image: felt252,
    // ) -> felt252;
    // fn edit_agent(ref self: TContractState, agent: Agent) -> felt252;
    // fn get_all_property(self: @TContractState, property_id: felt252) -> Property;
    fn version(self: @TContractState) -> u64;
}

