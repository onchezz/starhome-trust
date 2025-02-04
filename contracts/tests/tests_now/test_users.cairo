use core::traits::TryInto;
use core::array::ArrayTrait;
use starknet::ContractAddress;
use starknet::contract_address_const;
use core::result::ResultTrait;
use snforge_std::{declare, ContractClassTrait, start_prank, stop_prank, CheatTarget};

use starhomes::starhomes_contract::starhomes::StarhomesContract;
use starhomes::interfaces::iStarhomes::{IStarhomesContractDispatcher,IStarhomesContractDispatcherTrait };

// Constants for testing
const ADMIN: felt252 = 'ADMIN';
const USER1: felt252 = 'USER1';
const USER2: felt252 = 'USER2';
const INVESTOR: felt252 = 'INVESTOR';
const AGENT: felt252 = 'AGENT';

fn deploy_contract() -> ContractAddress {
    let contract = declare('Starhomes');
    let constructor_args = array![];
    let contract_address = contract.deploy(constructor_args).unwrap();
    contract_address
}

#[test]
fn test_user_registration() {
    let contract_address = deploy_contract();
    let dispatcher = IStarhomesContractDispatcher { contract_address };

    // Register basic user
    let caller = contract_address_const::<USER1>();
    start_prank(CheatTarget::One(contract_address), caller);

    let name = 'John Doe';
    let email = 'john@example.com';
    let phone = '1234567890';
    
    dispatcher.register_user(name, email, phone);
    let user = dispatcher.get_user(caller);
    
    assert(user.name == name, 'Invalid name');
    assert(user.email == email, 'Invalid email');
    assert(user.phone == phone, 'Invalid phone');
    assert(!user.is_investor, 'Should not be investor');
    assert(!user.is_agent, 'Should not be agent');

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
fn test_investor_registration() {
    let contract_address = deploy_contract();
    let dispatcher = IStarhomesContractDispatcher { contract_address };

    let investor_address = contract_address_const::<INVESTOR>();
    start_prank(CheatTarget::One(contract_address), investor_address);

    // First register as basic user
    dispatcher.register_user('Investor Name', 'investor@example.com', '9876543210');
    
    // Register as investor
    let investor_id = '123456789';
    let company_name = 'Investment Corp';
    dispatcher.register_investor(investor_id, company_name);

    let user = dispatcher.get_user(investor_address);
    assert(user.is_investor, 'Should be investor');
    
    stop_prank(CheatTarget::One(contract_address));
}

#[test]
fn test_agent_registration() {
    let contract_address = deploy_contract();
    let dispatcher = IStarhomesContractDispatcher { contract_address };

    let agent_address = contract_address_const::<AGENT>();
    start_prank(CheatTarget::One(contract_address), agent_address);

    // First register as basic user
    dispatcher.register_user('Agent Name', 'agent@example.com', '5555555555');
    
    // Register as agent
    let license_id = 'AG123456';
    let agency_name = 'Best Realty';
    dispatcher.register_agent(license_id, agency_name);

    let user = dispatcher.get_user(agent_address);
    assert(user.is_agent, 'Should be agent');
    
    stop_prank(CheatTarget::One(contract_address));
}

#[test]
fn test_user_authorization() {
    let contract_address = deploy_contract();
    let dispatcher = IStarhomesContractDispatcher { contract_address };

    // Register and verify investor authorization
    let investor_address = contract_address_const::<INVESTOR>();
    start_prank(CheatTarget::One(contract_address), investor_address);
    
    dispatcher.register_user('Investor Test', 'investor.test@example.com', '1111111111');
    dispatcher.register_investor('INV123', 'Test Investment LLC');
    
    assert(dispatcher.is_investor(investor_address), 'Should be authorized investor');
    assert(!dispatcher.is_agent(investor_address), 'Should not be agent');
    
    stop_prank(CheatTarget::One(contract_address));

    // Register and verify agent authorization
    let agent_address = contract_address_const::<AGENT>();
    start_prank(CheatTarget::One(contract_address), agent_address);
    
    dispatcher.register_user('Agent Test', 'agent.test@example.com', '2222222222');
    dispatcher.register_agent('LIC789', 'Test Agency');
    
    assert(dispatcher.is_agent(agent_address), 'Should be authorized agent');
    assert(!dispatcher.is_investor(agent_address), 'Should not be investor');
    
    stop_prank(CheatTarget::One(contract_address));
}

#[test]
#[should_panic(expected: ('User does not exist', ))]
fn test_get_nonexistent_user() {
    let contract_address = deploy_contract();
    let dispatcher = IStarhomesContractDispatcher { contract_address };
    
    let nonexistent_address = contract_address_const::<USER2>();
    dispatcher.get_user(nonexistent_address);
}

#[test]
#[should_panic(expected: ('User already registered', ))]
fn test_duplicate_registration() {
    let contract_address = deploy_contract();
    let dispatcher = IStarhomesContractDispatcher { contract_address };

    let user_address = contract_address_const::<USER1>();
    start_prank(CheatTarget::One(contract_address), user_address);
    
    // First registration
    dispatcher.register_user('Test User', 'test@example.com', '3333333333');
    
    // Attempt duplicate registration
    dispatcher.register_user('Test User 2', 'test2@example.com', '4444444444');
    
    stop_prank(CheatTarget::One(contract_address));
}

#[test]
#[should_panic(expected: ('Must be registered user', ))]
fn test_investor_registration_without_user() {
    let contract_address = deploy_contract();
    let dispatcher = IStarhomesContractDispatcher { contract_address };

    let investor_address = contract_address_const::<INVESTOR>();
    start_prank(CheatTarget::One(contract_address), investor_address);
    
    // Attempt investor registration without basic user registration
    dispatcher.register_investor('INV456', 'Failed Corp');
    
    stop_prank(CheatTarget::One(contract_address));
}

