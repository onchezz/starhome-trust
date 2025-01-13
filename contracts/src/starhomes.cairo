use starknet::{ContractAddress, ClassHash};
use components::property_component;
use components::investment_component;

#[starknet::interface]
trait IStarhomesContract<TContractState> {
    fn list_property(ref self: TContractState, price: u256, total_shares: u256, payment_token: ContractAddress) -> u256;
    fn invest_in_property(ref self: TContractState, property_id: u256, shares_to_buy: u256);
    fn get_property(self: @TContractState, property_id: u256) -> Property;
    fn get_investment(self: @TContractState, property_id: u256, investor: ContractAddress) -> Investment;
    fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
}

#[starknet::contract]
mod StarhomesContract {
    use super::{ContractAddress, ClassHash};
    use starknet::get_caller_address;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::upgrades::upgradeable::Upgradeable;
    use components::property_component;
    use components::investment_component;

    component!(path: property_component, storage: properties, event: PropertyEvent);
    component!(path: investment_component, storage: investments, event: InvestmentEvent);

    #[abi(embed_v0)]
    impl PropertyImpl = property_component::PropertyManager<ContractState>;
    #[abi(embed_v0)]
    impl InvestmentImpl = investment_component::InvestmentManager<ContractState>;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        #[substorage(v0)]
        properties: property_component::Storage,
        #[substorage(v0)]
        investments: investment_component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Upgraded: Upgraded,
        #[flat]
        PropertyEvent: property_component::Event,
        #[flat]
        InvestmentEvent: investment_component::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct Upgraded {
        class_hash: ClassHash,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.owner.write(get_caller_address());
    }

    #[external(v0)]
    impl StarhomesContractImpl of super::IStarhomesContract<ContractState> {
        fn list_property(
            ref self: ContractState,
            price: u256,
            total_shares: u256,
            payment_token: ContractAddress,
        ) -> u256 {
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
            IERC20Dispatcher { contract_address: property.payment_token }.transfer_from(
                caller, property.owner, investment_amount
            );

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
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Caller is not the owner');
            
            self.emit(Event::Upgraded(Upgraded { class_hash: new_class_hash }));
            
            Upgradeable::upgrade(new_class_hash);
        }
    }
}