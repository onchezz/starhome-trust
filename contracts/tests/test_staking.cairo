use core::traits::Into;
use starknet::ContractAddress;
use starknet::testing::{set_caller_address, set_contract_address, set_block_timestamp};
use snforge_std::{declare, ContractClassTrait, start_prank, stop_prank};
use starhomes::IStarhomesContractDispatcher;
use starhomes::IStarhomesContractDispatcherTrait;
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

// Helper function to deploy contracts
fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name);
    let contract_address = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

#[test]
fn test_stake_tokens() {
    // Deploy contracts
    let staking_address = deploy_contract("StarhomesContract");
    let token_address = deploy_contract("ERC20"); // Mock token for testing

    // Create dispatchers
    let staking = IStarhomesContractDispatcher { contract_address: staking_address };
    let token = IERC20Dispatcher { contract_address: token_address };

    // Setup test account
    let account: ContractAddress = 0x123.try_into().unwrap();
    start_prank(staking_address, account);

    // Mint tokens for testing
    token.mint(account, 1000);
    assert(token.balance_of(account) == 1000, 'Wrong initial balance');

    // Approve tokens for staking
    token.approve(staking_address, 500);

    // Stake tokens
    staking.stake(500);
    assert(token.balance_of(account) == 500, 'Wrong balance after stake');

    // Check staked amount
    let staked = staking.get_staked_amount(account);
    assert(staked == 500, 'Wrong staked amount');

    stop_prank(staking_address);
}

#[test]
fn test_unstake_tokens() {
    // Deploy contracts
    let staking_address = deploy_contract("StarhomesContract");
    let token_address = deploy_contract("ERC20");

    // Create dispatchers
    let staking = IStarhomesContractDispatcher { contract_address: staking_address };
    let token = IERC20Dispatcher { contract_address: token_address };

    // Setup test account
    let account: ContractAddress = 0x123.try_into().unwrap();
    start_prank(staking_address, account);

    // Setup initial state
    token.mint(account, 1000);
    token.approve(staking_address, 500);
    staking.stake(500);

    // Test unstaking
    staking.withdraw(250);
    
    // Verify balances
    assert(token.balance_of(account) == 750, 'Wrong balance after unstake');
    assert(staking.get_staked_amount(account) == 250, 'Wrong staked amount');

    stop_prank(staking_address);
}

#[test]
fn test_reward_distribution() {
    // Deploy contracts
    let staking_address = deploy_contract("StarhomesContract");
    let token_address = deploy_contract("ERC20");
    let reward_token_address = deploy_contract("ERC20");

    // Create dispatchers
    let staking = IStarhomesContractDispatcher { contract_address: staking_address };
    let token = IERC20Dispatcher { contract_address: token_address };
    let reward_token = IERC20Dispatcher { contract_address: reward_token_address };

    // Setup test accounts
    let owner: ContractAddress = 0x123.try_into().unwrap();
    let user: ContractAddress = 0x456.try_into().unwrap();
    
    // Setup initial state
    start_prank(staking_address, owner);
    staking.set_reward_amount(1000);
    staking.set_reward_duration(100);
    stop_prank(staking_address);

    // User stakes tokens
    start_prank(staking_address, user);
    token.mint(user, 1000);
    token.approve(staking_address, 500);
    staking.stake(500);

    // Advance time
    set_block_timestamp(50);

    // Check rewards
    let rewards = staking.get_rewards(user);
    assert(rewards > 0, 'Should have earned rewards');

    // Claim rewards
    staking.claim_rewards();
    assert(reward_token.balance_of(user) == rewards, 'Wrong reward amount');

    stop_prank(staking_address);
}

#[test]
#[should_panic(expected: ('Amount must be > 0'))]
fn test_stake_zero_amount() {
    let staking_address = deploy_contract("StarhomesContract");
    let staking = IStarhomesContractDispatcher { contract_address: staking_address };
    
    let account: ContractAddress = 0x123.try_into().unwrap();
    start_prank(staking_address, account);
    
    staking.stake(0);
}

#[test]
#[should_panic(expected: ('Caller is not the owner'))]
fn test_only_owner_can_set_rewards() {
    let staking_address = deploy_contract("StarhomesContract");
    let staking = IStarhomesContractDispatcher { contract_address: staking_address };
    
    let non_owner: ContractAddress = 0x456.try_into().unwrap();
    start_prank(staking_address, non_owner);
    
    staking.set_reward_amount(1000);
}