#[starknet::contract]
mod PropertyContract {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use array::ArrayTrait;
    use option::OptionTrait;
    use traits::Into;
    use zeroable::Zeroable;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PropertyListed: PropertyListed,
        PropertySold: PropertySold,
        InvestmentMade: InvestmentMade,
    }

    #[derive(Drop, starknet::Event)]
    struct PropertyListed {
        property_id: u256,
        owner: ContractAddress,
        price: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct PropertySold {
        property_id: u256,
        old_owner: ContractAddress,
        new_owner: ContractAddress,
        price: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct InvestmentMade {
        property_id: u256,
        investor: ContractAddress,
        amount: u256,
        shares: u256,
        timestamp: u64,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct Property {
        id: u256,
        owner: ContractAddress,
        price: u256,
        total_shares: u256,
        available_shares: u256,
        is_active: bool,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct Investment {
        investor: ContractAddress,
        shares: u256,
        timestamp: u64,
    }

    #[storage]
    struct Storage {
        owner: ContractAddress,
        properties: LegacyMap::<u256, Property>,
        property_investments: LegacyMap::<(u256, ContractAddress), Investment>,
        next_property_id: u256,
        property_count: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.owner.write(get_caller_address());
        self.next_property_id.write(1);
        self.property_count.write(0);
    }

    #[external(v0)]
    impl PropertyContractImpl of super::IPropertyContract<ContractState> {
        fn list_property(
            ref self: ContractState,
            price: u256,
            total_shares: u256,
        ) -> u256 {
            let caller = get_caller_address();
            let property_id = self.next_property_id.read();

            // Create new property
            let property = Property {
                id: property_id,
                owner: caller,
                price,
                total_shares,
                available_shares: total_shares,
                is_active: true,
            };

            // Store property
            self.properties.write(property_id, property);
            self.next_property_id.write(property_id + 1);
            self.property_count.write(self.property_count.read() + 1);

            // Emit event
            self.emit(Event::PropertyListed(PropertyListed {
                property_id,
                owner: caller,
                price,
                timestamp: starknet::get_block_timestamp(),
            }));

            property_id
        }

        fn invest_in_property(
            ref self: ContractState,
            property_id: u256,
            shares_to_buy: u256,
        ) {
            let caller = get_caller_address();
            let mut property = self.properties.read(property_id);
            assert(property.is_active, 'Property not active');
            assert(shares_to_buy <= property.available_shares, 'Not enough shares');

            // Calculate investment amount
            let share_price = property.price / property.total_shares;
            let investment_amount = share_price * shares_to_buy;

            // Update property shares
            property.available_shares = property.available_shares - shares_to_buy;
            self.properties.write(property_id, property);

            // Record investment
            let investment = Investment {
                investor: caller,
                shares: shares_to_buy,
                timestamp: starknet::get_block_timestamp(),
            };
            self.property_investments.write((property_id, caller), investment);

            // Emit event
            self.emit(Event::InvestmentMade(InvestmentMade {
                property_id,
                investor: caller,
                amount: investment_amount,
                shares: shares_to_buy,
                timestamp: starknet::get_block_timestamp(),
            }));
        }

        fn get_property(self: @ContractState, property_id: u256) -> Property {
            self.properties.read(property_id)
        }

        fn get_investment(
            self: @ContractState,
            property_id: u256,
            investor: ContractAddress
        ) -> Investment {
            self.property_investments.read((property_id, investor))
        }
    }
}

#[starknet::interface]
trait IPropertyContract<TContractState> {
    fn list_property(ref self: TContractState, price: u256, total_shares: u256) -> u256;
    fn invest_in_property(ref self: TContractState, property_id: u256, shares_to_buy: u256);
    fn get_property(self: @TContractState, property_id: u256) -> Property;
    fn get_investment(
        self: @TContractState,
        property_id: u256,
        investor: ContractAddress
    ) -> Investment;
}