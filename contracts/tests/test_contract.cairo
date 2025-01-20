// use core::traits::Into;
// use starknet::ContractAddress;
// // use starknet::testing::{set_caller_address, set_contract_address, set_block_timestamp};
// use snforge_std::{declare, ContractClassTrait, mock_call, start_mock_call, stop_mock_call};
// use snforge_std::{DeclareResultTrait, store, load, map_entry_address};
// use starknet::{get_caller_address};
// use starhomes::interfaces::iStarhomes::IStarhomesContractDispatcher;
// use starhomes::interfaces::iStarhomes::IStarhomesContractDispatcherTrait;
// use starhomes::models::property_models::Property;
// // use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
// // use starhomes::model::models::{Investment, Property};
// // model::models::{Investment, Property};

// fn deploy_contract(name: ByteArray) -> ContractAddress {
//     let contract = declare(name).unwrap().contract_class();
//     let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
//     contract_address
// }


// #[test]
// fn test_list_property_for_sale() {
//     let contract_address = deploy_contract("StarhomesContract");
//     let token_address = deploy_contract("ERC20");
//     let starhomes = IStarhomesContractDispatcher { contract_address };
//     // let token = IERC20Dispatcher { contract_address: token_address };
//     let owner: ContractAddress = 0x123.try_into().unwrap();
//     let ca = get_caller_address();

//     let property = Property {
//         id: 1,
//         title: 'house villa',
//         // description: "Nice house villa",
//         location_address: '123 test st',
//         city: 'test city',
//         // state: 'test state',
//         // country: 'test country',
//         // latitude: 1_felt252,
//         // longitude: 1_felt252,
//         price: 1000_u256,
//         owner: owner,
//         asking_price: 1000_u256,
//         currency: 'USD',
//         area: 100_u64,
//         // bedrooms: 4_u64,
//         // bathrooms: 3_u64,
//         // parking_spaces: 2_u64,
//         // property_type: 'house',
//         // status: 'active',
//         // interested_clients: 100_u256,
//         // annual_growth_rate: 100_u256,
//         // features_id: 1_felt252,
//         // images_id: '123',
//         // video_tour: '123',
//         agent_id: ca,
//         date_listed: starknet::get_block_timestamp(),
//         // has_garden: true,
//         // has_swimming_pool: true,
//         // pet_friendly: true,
//         // wheelchair_accessible: true,
//         asset_token: token_address,
//         // is_investment: false,
//     // timestamp: starknet::get_block_timestamp(),
//     };
//     let property_description = "very nice property ";
//     let is_investment = true;

//     starhomes.list_property(property, property_description, is_investment);

//     let property = starhomes.get_property(1);
//     assert(property.id != 1, 'Wrong property id');
// }
