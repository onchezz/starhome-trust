use starknet::ContractAddress;
use starknet::testing::{set_caller_address, set_contract_address};
use array::ArrayTrait;
use traits::Into;
use zeroable::Zeroable;
use debug::PrintTrait;

use starhomes::starhomes::{
    StarhomesContract, IStarhomesContractDispatcher, IStarhomesContractDispatcherTrait
};

fn create_address(value: felt252) -> ContractAddress {
    ContractAddress::try_from(value).unwrap()
}

#[test]
fn test_list_property() {
    let owner = create_address(1);
    let payment_token = create_address(123);
    set_caller_address(owner);

    let contract = StarhomesContract::constructor();

    let price: u256 = 1000;
    let total_shares: u256 = 100;
    
    let property_id = contract.list_property(price, total_shares, payment_token);
    assert(property_id == 1, 'Invalid property ID');

    let property = contract.get_property(property_id);
    assert(property.owner == owner, 'Invalid owner');
    assert(property.price == price, 'Invalid price');
    assert(property.total_shares == total_shares, 'Invalid shares');
    assert(property.available_shares == total_shares, 'Invalid available shares');
    assert(property.is_active == true, 'Property should be active');
}

#[test]
fn test_invest_in_property() {
    let owner = create_address(1);
    let investor = create_address(2);
    let payment_token = create_address(123);
    
    set_caller_address(owner);
    let contract = StarhomesContract::constructor();

    let price: u256 = 1000;
    let total_shares: u256 = 100;
    let property_id = contract.list_property(price, total_shares, payment_token);

    set_caller_address(investor);
    let shares_to_buy: u256 = 50;
    
    contract.invest_in_property(property_id, shares_to_buy);

    let investment = contract.get_investment(property_id, investor);
    assert(investment.investor == investor, 'Invalid investor');
    assert(investment.shares == shares_to_buy, 'Invalid shares bought');
}