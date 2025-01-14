use core::traits::Into;
use starknet::ContractAddress;
use starknet::testing::{set_caller_address, set_contract_address, set_block_timestamp};
use snforge_std::{declare, ContractClassTrait, start_prank, stop_prank};
use starhomes::IStarhomesContractDispatcher;
use starhomes::IStarhomesContractDispatcherTrait;
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use starhomes::model::models::{Investment, Property};

// Helper function to deploy contracts
fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name);
    let contract_address = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

#[test]
fn test_list_property_for_sale() {
    // Deploy contracts
    let contract_address = deploy_contract("StarhomesContract");
    let token_address = deploy_contract("ERC20"); // Mock token for testing

    // Create dispatchers
    let starhomes = IStarhomesContractDispatcher { contract_address };
    let token = IERC20Dispatcher { contract_address: token_address };

    // Setup test account
    let owner: ContractAddress = 0x123.try_into().unwrap();
    start_prank(contract_address, owner);

    // List property
    let price: u256 = 1000;
    let total_shares: u256 = 100;
    let property_id = starhomes.list_property_for_sale(price, total_shares, token_address);
    
    // Verify property details
    let property = starhomes.get_property(property_id);
    assert(property.owner == owner, 'Wrong property owner');
    assert(property.price == price, 'Wrong property price');
    assert(property.total_shares == total_shares, 'Wrong total shares');
    assert(property.available_shares == total_shares, 'Wrong available shares');
    assert(property.is_active == true, 'Property should be active');

    stop_prank(contract_address);
}

#[test]
fn test_invest_in_property() {
    // Deploy contracts
    let contract_address = deploy_contract("StarhomesContract");
    let token_address = deploy_contract("ERC20");

    // Create dispatchers
    let starhomes = IStarhomesContractDispatcher { contract_address };
    let token = IERC20Dispatcher { contract_address: token_address };

    // Setup accounts
    let owner: ContractAddress = 0x123.try_into().unwrap();
    let investor: ContractAddress = 0x456.try_into().unwrap();

    // List property
    start_prank(contract_address, owner);
    let property_id = starhomes.list_property_for_sale(1000, 100, token_address);
    stop_prank(contract_address);

    // Setup investor
    start_prank(contract_address, investor);
    token.mint(investor, 1000);
    token.approve(contract_address, 500);

    // Make investment
    let investment_amount: u256 = 50;
    starhomes.invest_in_property(property_id, investment_amount);

    // Verify investment
    let investment = starhomes.get_investment(property_id, investor);
    assert(investment.investor == investor, 'Wrong investor');
    assert(investment.shares == investment_amount, 'Wrong shares amount');

    // Verify property updated shares
    let property = starhomes.get_property(property_id);
    assert(property.available_shares == 50, 'Wrong available shares after investment');

    stop_prank(contract_address);
}

#[test]
fn test_token_operations() {
    // Deploy contracts
    let contract_address = deploy_contract("StarhomesContract");
    let token_address = deploy_contract("ERC20");

    // Create dispatchers
    let starhomes = IStarhomesContractDispatcher { contract_address };
    let token = IERC20Dispatcher { contract_address: token_address };

    // Setup test account
    let user: ContractAddress = 0x123.try_into().unwrap();
    start_prank(contract_address, user);

    // Test save_token
    let saved_token = starhomes.save_token(token_address);
    assert(saved_token == token_address, 'Wrong saved token');

    // Test approve_token
    token.mint(user, 1000);
    starhomes.approve_token(500);
    let allowance = token.allowance(user, contract_address);
    assert(allowance == 500, 'Wrong allowance amount');

    // Test send_to_starhomes
    token.approve(contract_address, 300);
    let sent_amount = starhomes.send_to_starhomes(300);
    let contract_balance = token.balance_of(contract_address);
    assert(contract_balance == 300, 'Wrong contract balance');

    stop_prank(contract_address);
}

#[test]
#[should_panic(expected: ('Property not active'))]
fn test_invest_in_inactive_property() {
    let contract_address = deploy_contract("StarhomesContract");
    let token_address = deploy_contract("ERC20");
    
    let starhomes = IStarhomesContractDispatcher { contract_address };
    
    let investor: ContractAddress = 0x123.try_into().unwrap();
    start_prank(contract_address, investor);
    
    // Try to invest in non-existent property
    starhomes.invest_in_property(999, 100);
}

#[test]
#[should_panic(expected: ('Not enough shares'))]
fn test_invest_more_than_available() {
    let contract_address = deploy_contract("StarhomesContract");
    let token_address = deploy_contract("ERC20");
    
    let starhomes = IStarhomesContractDispatcher { contract_address };
    let token = IERC20Dispatcher { contract_address: token_address };
    
    // Setup property
    let owner: ContractAddress = 0x123.try_into().unwrap();
    start_prank(contract_address, owner);
    let property_id = starhomes.list_property_for_sale(1000, 100, token_address);
    stop_prank(contract_address);
    
    // Try to invest more than available shares
    let investor: ContractAddress = 0x456.try_into().unwrap();
    start_prank(contract_address, investor);
    starhomes.invest_in_property(property_id, 101);
}