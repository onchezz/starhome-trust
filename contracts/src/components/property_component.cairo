use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
struct PropertyAdded {
    id: u256,
    owner: ContractAddress,
    price: u256,
    total_shares: u256,
    payment_token: ContractAddress
}

#[derive(Drop, Serde, Copy)]
struct Property {
    id: u256,
    owner: ContractAddress,
    price: u256,
    total_shares: u256,
    available_shares: u256,
    payment_token: ContractAddress,
    is_active: bool,
}

#[starknet::component]
mod property_component {
    use starknet::{ContractAddress, get_caller_address};
    use super::{Property, PropertyAdded};

    #[storage]
    struct Storage {
        properties: LegacyMap<u256, Property>,
        next_property_id: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PropertyAdded: PropertyAdded,
    }

    #[embeddable_as(PropertyManager)]
    pub impl PropertyImpl<
        TContractState, +HasComponent<TContractState>
    > of super::IPropertyManager<ComponentState<TContractState>> {
        fn add_property(
            ref self: ComponentState<TContractState>,
            price: u256,
            total_shares: u256,
            payment_token: ContractAddress
        ) -> u256 {
            let caller = get_caller_address();
            let property_id = self.next_property_id.read();

            let property = Property {
                id: property_id,
                owner: caller,
                price,
                total_shares,
                available_shares: total_shares,
                payment_token,
                is_active: true
            };

            self.properties.write(property_id, property);
            self.next_property_id.write(property_id + 1);

            self.emit(Event::PropertyAdded(PropertyAdded {
                id: property_id,
                owner: caller,
                price,
                total_shares,
                payment_token
            }));

            property_id
        }

        fn get_property(self: @ComponentState<TContractState>, property_id: u256) -> Property {
            self.properties.read(property_id)
        }
    }
}

#[starknet::interface]
trait IPropertyManager<TContractState> {
    fn add_property(
        ref self: TContractState,
        price: u256,
        total_shares: u256,
        payment_token: ContractAddress
    ) -> u256;
    fn get_property(self: @TContractState, property_id: u256) -> Property;
}