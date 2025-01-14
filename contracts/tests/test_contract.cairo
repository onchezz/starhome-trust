use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use starhomes::IStarhomesContractSafeDispatcher;
use starhomes::IStarhomesContractSafeDispatcherTrait;
use starhomes::IStarhomesContractDispatcher;
use starhomes::IStarhomesContractDispatcherTrait;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

#[test]
fn test_balance() {
    let contract_address = deploy_contract("HelloStarknet");

    let dispatcher = IStarhomesContractDispatcher { contract_address };
    // let address = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
    

    // let balance_before = dispatcher.save_token(address);
    // assert(balance_before != address, 'Invalid balance');

    // dispatcher.

    // let balance_after = dispatcher.get_balance();
    // assert(balance_after == 42, 'Invalid balance');
}

// #[test]
// #[feature("safe_dispatcher")]
// fn test_cannot_increase_balance_with_zero_value() {
//     let contract_address = deploy_contract("HelloStarknet");

//     let safe_dispatcher = IStarhomesContractSafeDispatcher { contract_address };

//     let balance_before = safe_dispatcher.get_balance().unwrap();
//     assert(balance_before == 0, 'Invalid balance');

//     match safe_dispatcher.increase_balance(0) {
//         Result::Ok(_) => core::panic_with_felt252('Should have panicked'),
//         Result::Err(panic_data) => {
//             assert(*panic_data.at(0) == 'Amount cannot be 0', *panic_data.at(0));
//         }
//     };
// }
