mod model;
use model::models::{Investment, Property};
use starknet::ContractAddress;
use starknet::class_hash::ClassHash;
use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};


#[starknet::interface]
pub trait IStarhomesContract<TContractState> {
    fn list_property_for_sale(
        ref self: TContractState, price: u256, total_shares: u256, token_address: ContractAddress,
    ) -> u256;
    fn list_property_for_investment(
        ref self: TContractState, price: u256, total_shares: u256, payment_token: ContractAddress,
    ) -> u256;
    fn approve_token(ref self: TContractState, amount: u256);
    fn invest_in_property(ref self: TContractState, property_id: u256, amount: u256) -> u256;
    fn get_property(self: @TContractState, property_id: u256) -> Property;
    fn get_investment(
        self: @TContractState, property_id: u256, investor: ContractAddress,
    ) -> Investment;
    fn save_token(ref self: TContractState, token: ContractAddress) -> ContractAddress;
    fn send_to_starhomes(ref self: TContractState, amount: u256) -> u256;
    fn version(self: @TContractState) -> u64;
    fn add_owner(ref self: TContractState, new_owner: ContractAddress);
    // fn owner(self: @TContractState) -> ContractAddress;
}
// #[starknet::interface]
// pub trait IUpgradeable<TState> {
//     fn upgrade(ref self: TState, new_class_hash: ClassHash);
//     fn version(self: @TState) -> u64;
//     // fn owner(self: @TState) -> ContractAddress;
// }

#[starknet::contract]
mod StarhomesContract {
    use super::model::models::{
        Investment, Property, //  Upgraded,
        InvestmentMade, PropertySold, PropertyListed,
        TrustInvestment,
    };
    use starknet::storage::StoragePathEntry;
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use super::ContractAddress;
    use super::Map;
    use super::StorageMapReadAccess;
    use super::StorageMapWriteAccess;
    use super::ClassHash;
    // use super::IUpgradeable;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use core::array::ArrayTrait;
    use core::traits::Into;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // Ownable Mixin
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // Upgradeable
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PropertyListed: PropertyListed,
        PropertySold: PropertySold,
        InvestmentMade: InvestmentMade,
        // Upgraded: Upgraded,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
    }


    #[storage]
    struct Storage {
        token: IERC20Dispatcher,
        total_supply: u256,
        balance_of: Map<ContractAddress, u256>,
        owner: ContractAddress,
        property_tokens: Map::<u256, ContractAddress>,
        properties: Map::<u256, Property>,
        investment: Map::<u256, TrustInvestment>,
        property_investments: Map::<(u256, ContractAddress), Investment>,
        next_property_id: u256,
        next_property_investment_id: u256,
        property_count: u256,
        version: u64,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        let owner = get_caller_address();
        if (self.owner.read() != owner) {
            self.ownable.initializer(owner);
            self.owner.write(owner);
            self.next_property_id.write(1);
            self.property_count.write(0);
        }
    }

    #[abi(embed_v0)]
    impl StarhomesContractImpl of super::IStarhomesContract<ContractState> {
        fn add_owner(ref self: ContractState, new_owner: ContractAddress) {
            self.ownable.initializer(new_owner);
        }
        fn list_property_for_sale(
            ref self: ContractState,
            price: u256,
            total_shares: u256,
            token_address: ContractAddress,
        ) -> u256 {
            let caller = get_caller_address();
            let property_id = self.next_property_id.read();
            let payment_token = IERC20Dispatcher { contract_address: token_address };
            self.token.write(payment_token);

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
            self.property_tokens.write(property_id, token_address);

            // Store property
            self.properties.write(property_id, property);
            self.next_property_id.write(property_id + 1);
            self.property_count.write(self.property_count.read() + 1);

            // Emit event
            self
                .emit(
                    Event::PropertyListed(
                        PropertyListed {
                            property_id,
                            owner: caller,
                            price,
                            payment_token,
                            timestamp: starknet::get_block_timestamp(),
                        },
                    ),
                );

            property_id
        }
        fn approve_token(ref self: ContractState, amount: u256) {
            let caller = get_caller_address();
            let contract_address = get_contract_address();
            // let this = get_contract_address();
            // let mut property = self.properties.read(property_id);
            //    self.properties.entry(property_id).payment_token.write().
            self.token.read().approve(contract_address, amount);
            // self.token.read().allowance(caller, contract_address);
        }

        fn save_token(ref self: ContractState, token: ContractAddress) -> ContractAddress {
            //    let payment_token = IERC20Dispatcher { contract_address: token };
            self.token.write(IERC20Dispatcher { contract_address: token });
            token
        }
        fn send_to_starhomes(ref self: ContractState, amount: u256) -> u256 {
            let caller = get_caller_address();
            let contract_address = get_contract_address();

            let balance: u256 = self.token.read().balance_of(contract_address).try_into().unwrap();
            assert(balance >= amount, 'No enough balance');

            if (balance > amount) {
                self.token.read().transfer_from(caller, contract_address, amount);
            }

            // let amount_felt252: felt252 = amount.low.into();

            balance
        }

        fn invest_in_property(ref self: ContractState, property_id: u256, amount: u256) -> u256 {
            let caller = get_caller_address();
            let contract_address = get_contract_address();
            let mut property = self.properties.read(property_id);
            assert(property.is_active, 'Property not active');
            assert(amount <= property.available_shares, 'Not enough shares');
            let propterty_token = self.property_tokens.entry(property_id).read();
            // assert(property.payment_token.balance_of())
            // self.token.write(IERC20Dispatcher { contract_address: property.payment_token });

            // Calculate investment amount
            // let share_price = property.price / property.total_shares;
            // let investment_amount = share_price * shares_to_buy;
            // property.payment_token.transfer(contract_address, investment_amount.into());

            // property.payment_token.approve(contract_address, amount);
            property.payment_token.allowance(caller, contract_address);
            let bal = property.payment_token.balance_of(propterty_token);

            // property.payment_token.
            // property
            //     .payment_token
            //     .transfer_from(caller, contract_address, investment_amount.into());
            // self.token.read().approve(contract_address, investment_amount);

            // self.token.read().transfer_from(caller, contract_address, investment_amount);

            // Update property shares
            property.available_shares = property.available_shares - amount;
            self.properties.write(property_id, property);

            // Record investment
            let investment = Investment {
                investor: caller, shares: amount, timestamp: starknet::get_block_timestamp(),
            };
            self.property_investments.write((property_id, caller), investment);

            // Emit event
            self
                .emit(
                    Event::InvestmentMade(
                        InvestmentMade {
                            property_id,
                            investor: caller,
                            amount: amount,
                            // shares: shares_to_buy,
                            timestamp: starknet::get_block_timestamp(),
                        },
                    ),
                );
            bal
        }
        fn list_property_for_investment(
            ref self: ContractState,
            price: u256,
            total_shares: u256,
            payment_token: ContractAddress,
        ) -> u256 {
            // let caller = get_caller_address();

            1
        }

        fn get_property(self: @ContractState, property_id: u256) -> Property {
            let property = self.properties.entry(property_id).read();
            property
        }

        fn get_investment(
            self: @ContractState, property_id: u256, investor: ContractAddress,
        ) -> Investment {
            // let invest = self.property_investments.entry(property_id, investor).read();
            let property_investment = self.property_investments.read((property_id, investor));
            property_investment
        }
        // fn owner(self: @ContractState) -> ContractAddress {
        //     // self.owner()
        // }
        fn version(self: @ContractState) -> u64 {
            self.version.read()
        }
    }
    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            // // Only owner can upgrade
            // let caller = get_caller_address();
            // assert(caller == self.owner.read(), 'Caller is not the owner');
            let contract_version = self.version.read();
            self.version.write(contract_version + 1);
            self.ownable.assert_only_owner();

            // Replace the class hash upgrading the contract
            self.upgradeable.upgrade(new_class_hash);
            // Emit event before upgrading
        // self.emit(Event::upgradeable(Upgraded { class_hash: new_class_hash }));

            // Perform the upgrade
        // Upgradeable::upgrade(new_class_hash);
        // IUpgradeable::upgrade(ref self, new_class_hash);
        }
        // fn version(self: @ContractState) -> u64 {
    //     self.version.read()
    // }
    // fn owner(self: @ContractState) -> ContractAddress {
    //     self.owner()
    // }
    }
}
