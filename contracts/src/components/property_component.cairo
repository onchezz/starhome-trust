use starknet::ContractAddress;

#[starknet::interface]
pub trait IPropertyManager<TContractState> {
    fn add_property(
        ref self: TContractState,
        price: u256,
        total_shares: u256,
        payment_token: ContractAddress
    ) -> u256;
    fn get_property(self: @TContractState, property_id: u256) -> Property;
    fn get_property_count(self: @TContractState) -> u32;
    fn get_properties(self: @TContractState) -> Array<Property>;
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Property {
    id: u256,
    owner: ContractAddress,
    price: u256,
    payment_token: ContractAddress,
    total_shares: u256,
    available_shares: u256,
    is_active: bool,
}

#[starknet::component]
pub mod property_component {
    use super::{Property, IPropertyManager};
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        properties: LegacyMap::<u256, Property>,
        property_count: u32,
        next_property_id: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PropertyAdded: PropertyAdded,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PropertyAdded {
        property_id: u256,
        owner: ContractAddress,
        price: u256,
    }

    #[embeddable_as(PropertyManager)]
    impl PropertyManagerImpl<
        TContractState, +HasComponent<TContractState>
    > of IPropertyManager<ComponentState<TContractState>> {
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
                payment_token,
                total_shares,
                available_shares: total_shares,
                is_active: true,
            };

            self.properties.write(property_id, property);
            self.next_property_id.write(property_id + 1);
            self.property_count.write(self.property_count.read() + 1);

            self.emit(Event::PropertyAdded(PropertyAdded { 
                property_id,
                owner: caller,
                price,
            }));

            property_id
        }

        fn get_property(self: @ComponentState<TContractState>, property_id: u256) -> Property {
            self.properties.read(property_id)
        }

        fn get_property_count(self: @ComponentState<TContractState>) -> u32 {
            self.property_count.read()
        }

        fn get_properties(self: @ComponentState<TContractState>) -> Array<Property> {
            let mut properties = array![];
            let count = self.property_count.read();
            let mut i: u32 = 0;
            
            while i < count {
                properties.append(self.properties.read(i.into()));
                i += 1;
            };

            properties
        }
    }
}