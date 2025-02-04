use core::traits::TryInto;
use core::array::ArrayTrait;
use starknet::ContractAddress;
use starknet::contract_address_const;
use core::result::ResultTrait;
use snforge_std::{declare, ContractClassTrait, start_prank, stop_prank, CheatTarget, spy_events, EventSpy, EventSpyTrait};
use starhomes::starhomes_contract::starhomes::StarhomesContract;
use starhomes::interfaces::iStarhomes::{IStarhomesContractDispatcher,IStarhomesContractDispatcherTrait };
use starhomes::components::investment::{self, Investment};

// Mock contract for investment component testing
#[starknet::contract]
mod MockInvestmentContract {
    use super::investment::InvestmentComponent;
    
    component!(path: InvestmentComponent, storage: investment, event: InvestmentEvent);

    #[storage]
    struct Storage {
        #[substorage(v0)]
        investment: InvestmentComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        InvestmentEvent: InvestmentComponent::Event,
    }

    #[abi(embed_v0)]
    impl InvestmentImpl = InvestmentComponent::InvestmentImpl<ContractState>;
}

type InvestmentTestingState = investment::ComponentState<MockInvestmentContract::ContractState>;

impl InvestmentTestingStateDefault of Default<InvestmentTestingState> {
    fn default() -> InvestmentTestingState {
        investment::component_state_for_testing()
    }
}

const ADMIN: felt252 = 'ADMIN';
const USER1: felt252 = 'USER1';
const INVESTOR: felt252 = 'INVESTOR';
const AGENT: felt252 = 'AGENT';

fn deploy_contract() -> ContractAddress {
    let contract = declare('Starhomes');
    let constructor_args = array![];
    let contract_address = contract.deploy(constructor_args).unwrap();
    contract_address
}

#[test]
fn test_investment_operations() {
    let contract_address = deploy_contract();
    let dispatcher = IStarhomesContractDispatcher { contract_address };

    // Register agent and list investment property
    let agent_address = contract_address_const::<AGENT>();
    start_prank(CheatTarget::One(contract_address), agent_address);
    dispatcher.register_user('Agent Name', 'agent@example.com', '5555555555');
    dispatcher.register_agent('AG123456', 'Best Realty');
    let property_id = dispatcher.list_investment_property('Investment Property', 'Desc', 1000000, 'Location', 10);
    stop_prank(CheatTarget::One(contract_address));

    // Register investor
    let investor_address = contract_address_const::<INVESTOR>();
    start_prank(CheatTarget::One(contract_address), investor_address);
    dispatcher.register_user('Investor Name', 'investor@example.com', '1111111111');
    dispatcher.register_investor('INV123', 'Investment Corp');

    // Invest in property
    let investment_amount = 100000;
    dispatcher.invest_in_property(property_id, investment_amount);

    // Verify investment
    let investment = dispatcher.get_investment(investor_address, property_id);
    assert(investment.amount == investment_amount, 'Invalid investment amount');
    assert(investment.investor == investor_address, 'Invalid investor address');
    assert(investment.property_id == property_id, 'Invalid property ID');

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
fn test_component_internal_investment() {
    let mut investment_state: InvestmentTestingState = Default::default();
    let test_investment = Investment {
        id: 1,
        property_id: 1,
        investor: contract_address_const::<INVESTOR>(),
        amount: 100000
    };

    // Test internal investment validation
    investment_state.validate_investment(&test_investment);
}

