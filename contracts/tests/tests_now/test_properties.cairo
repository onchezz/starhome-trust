use core::traits::TryInto;
use core::array::ArrayTrait;
use starknet::ContractAddress;
use starknet::contract_address_const;
use core::result::ResultTrait;
use snforge_std::{declare, ContractClassTrait,spy_events, EventSpy, EventSpyTrait, DeclareResultTrait};
use starhomes::starhomes_contract::starhomes::StarhomesContract;
use starhomes::interfaces::iStarhomes::{IStarhomesContractDispatcher,IStarhomesContractDispatcherTrait };
use starhomes::components::property_component::PropertyComponent;

// Mock contract for property component testing
#[starknet::contract]
mod MockPropertyContract {
    use super::PropertyComponent;
    
    component!(path: PropertyComponent, storage: property, event: PropertyEvent);

    #[storage]
    struct Storage {
        #[substorage(v0)]
        property: PropertyComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PropertyEvent: PropertyComponent::Event,
    }

    #[abi(embed_v0)]
   impl PropertyComponentImpl = PropertyComponent::PropertyComponentImpl<ContractState>;
    impl PropertyPrivateFunctions = PropertyComponent::PropertyFunctions<ContractState>;
}

type PropertyTestingState = PropertyComponent::ComponentState<MockPropertyContract::ContractState>;

impl PropertyTestingStateDefault of Default<PropertyTestingState> {
    fn default() -> PropertyTestingState {
        PropertyComponent::component_state_for_testing()
    }
}

const ADMIN: felt252 = 'ADMIN';
const USER1: felt252 = 'USER1';
const AGENT: felt252 = 'AGENT';

fn deploy_contract() -> ContractAddress {
    let contract = declare("Starhomes").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![]).unwrap(); 
    contract_address
}

#[test]
fn test_property_listing() {
    let contract_address = deploy_contract();
    let dispatcher = IStarhomesContractDispatcher { contract_address };

    let agent_address = contract_address_const::<AGENT>();
    start_prank(CheatTarget::One(contract_address), agent_address);

    // Register agent
    dispatcher.register_user('Agent Name', 'agent@example.com', '5555555555');
    dispatcher.register_agent('AG123456', 'Best Realty');

    // List property
    let name = 'Test Property';
    let description = 'A beautiful property';
    let price = 100000;
    let location = 'New York';
    let property_id = dispatcher.list_property(name, description, price, location);

    // Verify property details
    let property = dispatcher.get_property(property_id);
    assert(property.name == name, 'Invalid property name');
    assert(property.description == description, 'Invalid property description');
    assert(property.price == price, 'Invalid property price');
    assert(property.location == location, 'Invalid property location');
    assert(property.owner == agent_address, 'Invalid property owner');

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
fn test_component_internal_property() {
    let mut property_state: PropertyTestingState = Default::default();
    let test_property = Property {
        id: 1,
        name: 'Test',
        description: 'Test Desc',
        price: 100000,
        location: 'Test Location',
        owner: contract_address_const::<ADMIN>(),
    };

    // Test internal property validation
    property_state.validate_property(&test_property);
}

