use core::traits::Into;
use starknet::ContractAddress;
use starknet::testing::{set_caller_address, set_contract_address, set_block_timestamp};
use snforge_std::{declare, ContractClassTrait, start_prank, stop_prank};

use super::staking_contract::{
    IStakingDispatcher, IStakingDispatcherTrait, StakingContract
};

fn setup() -> (ContractAddress, ContractAddress, ContractAddress, IStakingDispatcher) {
    // Deploy mock tokens and staking contract
    let owner = contract_address_const::<1>();
    let staking_token = contract_address_const::<2>();
    let reward_token = contract_address_const::<3>();
    
    let contract = declare('StakingContract');
    let contract_address = contract.deploy(
        array![
            owner.into(),
            staking_token.into(),
            reward_token.into(),
            1000.into() // initial reward rate
        ]
    ).unwrap();

    (
        owner,
        staking_token,
        reward_token,
        IStakingDispatcher { contract_address }
    )
}

#[test]
fn test_stake() {
    let (owner, staking_token, _, dispatcher) = setup();
    
    // Setup test
    let user = contract_address_const::<4>();
    let amount: u256 = 100.into();
    
    start_prank(staking_token, user);
    dispatcher.stake(amount);
    
    assert(dispatcher.get_staked_balance(user) == amount, 'Wrong staked balance');
}

// Add more tests as needed