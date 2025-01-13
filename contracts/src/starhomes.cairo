use starknet::{ContractAddress, ClassHash};
use openzeppelin::access::ownable::OwnableComponent;
use openzeppelin::upgrades::interface::IUpgradeable;
use openzeppelin::upgrades::UpgradeableComponent;
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

use components::property_component::{Property, PropertyComponent};
use components::investment_component::{Investment, InvestmentComponent};

#[starknet::interface]
trait IStarhomes<TContractState> {
    fn list_property(ref self: TContractState, price: u256, total_shares: u256, payment_token: ContractAddress) -> u256;
    fn invest_in_property(ref self: TContractState, property_id: u256, shares_to_buy: u256);
    fn get_property(self: @TContractState, property_id: u256) -> Property;
    fn get_investment(self: @TContractState, property_id: u256, investor: ContractAddress) -> Investment;
    fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
}

#[starknet::contract]
mod Starhomes {
    use super::{Property, Investment, ContractAddress, ClassHash, IERC20Dispatcher};
    use starknet::get_caller_address;
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);
    component!(path: PropertyComponent, storage: properties, event: PropertyEvent);
    component!(path: InvestmentComponent, storage: investments, event: InvestmentEvent);

    // External implementations
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    #[abi(embed_v0)]
    impl PropertyImpl = PropertyComponent::PropertyManager<ContractState>;
    #[abi(embed_v0)]
    impl InvestmentImpl = InvestmentComponent::InvestmentManager<ContractState>;

    // Internal implementations
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        #[substorage(v0)]
        properties: PropertyComponent::Storage,
        #[substorage(v0)]
        investments: InvestmentComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        #[flat]
        PropertyEvent: PropertyComponent::Event,
        #[flat]
        InvestmentEvent: InvestmentComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl Starhomes of super::IStarhomes<ContractState> {
        fn list_property(
            ref self: ContractState,
            price: u256,
            total_shares: u256,
            payment_token: ContractAddress,
        ) -> u256 {
            self.ownable.assert_only_owner();
            self.properties.add_property(price, total_shares, payment_token)
        }

        fn invest_in_property(
            ref self: ContractState,
            property_id: u256,
            shares_to_buy: u256,
        ) {
            let property = self.properties.get_property(property_id);
            assert(property.is_active, 'Property not active');
            assert(shares_to_buy <= property.available_shares, 'Not enough shares');

            let share_price = property.price / property.total_shares;
            let investment_amount = share_price * shares_to_buy;

            let caller = get_caller_address();
            let token = IERC20Dispatcher { contract_address: property.payment_token };
            token.transfer_from(caller, property.owner, investment_amount);

            self.investments.invest(property_id, shares_to_buy);
        }

        fn get_property(self: @ContractState, property_id: u256) -> Property {
            self.properties.get_property(property_id)
        }

        fn get_investment(
            self: @ContractState,
            property_id: u256,
            investor: ContractAddress
        ) -> Investment {
            self.investments.get_investment(property_id, investor)
        }

        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }
}