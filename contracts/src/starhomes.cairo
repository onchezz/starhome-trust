use starknet::ContractAddress;
use starknet::class_hash::ClassHash;
use openzeppelin::token::erc20::interface::IERC20;
use openzeppelin::upgrades::upgradeable::Upgradeable;
use openzeppelin::access::ownable::Ownable;

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
    use super::ContractAddress;
    use super::ClassHash;
    use super::IERC20;
    use super::Upgradeable;
    use super::Ownable;
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
        Upgraded: Upgraded
    }

    #[derive(Drop, starknet::Event)]
    struct PropertyListed {
        property_id: u256,
        owner: ContractAddress,
        price: u256,
        payment_token: ContractAddress,
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

    #[derive(Drop, starknet::Event)]
    struct Upgraded {
        class_hash: ClassHash,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct Property {
        id: u256,
        owner: ContractAddress,
        price: u256,
        payment_token: ContractAddress,
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
    impl StarhomesContractImpl of super::IStarhomesContract<ContractState> {
        fn list_property(
            ref self: ContractState,
            price: u256,
            total_shares: u256,
            payment_token: ContractAddress,
        ) -> u256 {
            let caller = get_caller_address();
            let property_id = self.next_property_id.read();

            // Create new property
            let property = Property {
                id: property_id,
                owner: caller,
                price,
                payment_token,
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
                payment_token,
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

            // Transfer tokens from investor to contract
            IERC20::transfer_from(
                property.payment_token,
                caller,
                property.owner,
                investment_amount
            );

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

        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            // Only owner can upgrade
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Caller is not the owner');
            
            // Emit event before upgrading
            self.emit(Event::Upgraded(Upgraded { class_hash: new_class_hash }));
            
            // Perform the upgrade
            Upgradeable::upgrade(new_class_hash);
        }
    }
}
