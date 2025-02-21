#[starknet::contract]
pub mod StarhomesContract {
    use starhomes::components::property_component::PropertyComponent;
    use starhomes::components::user_component::UsersComponent;
    use starhomes::components::blogs_component::BlogComponent;
    use starhomes::models::user_models::UserVisitRequest;
    use starhomes::components::investment_component::InvestmentComponent;
    use starhomes::interface::starhomes_interface::*;
    use core::option::Option;
    use starhomes::models::property_models::Property;
    use starhomes::models::investment_model::InvestmentAsset;
    use starhomes::messages::errors::Errors;
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starhomes::interfaces::iStarhomes::IStarhomesContract;
    use starknet::{ContractAddress, get_caller_address};
    use starknet::class_hash::ClassHash;
    use core::array::ArrayTrait;
    use core::traits::Into;
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);
    component!(path: UsersComponent, storage: users_data, event: UsersEvent);
    component!(path: PropertyComponent, storage: properties, event: PropertyComponentEvent);
    component!(path: BlogComponent, storage: blogs, event: BlogsComponentEvent);
    component!(path: InvestmentComponent, storage: investments, event: InvestmentEvent);

    #[storage]
    struct Storage {
        #[substorage(v0)]
        properties: PropertyComponent::Storage,
        #[substorage(v0)]
        users_data: UsersComponent::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        #[substorage(v0)]
        blogs: BlogComponent::Storage,
        #[substorage(v0)]
        investments: InvestmentComponent::Storage,
        contract_owner: ContractAddress,
        update: u256,
        version: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        #[flat]
        UsersEvent: UsersComponent::Event,
        #[flat]
        PropertyComponentEvent: PropertyComponent::Event,
        #[flat]
        BlogsComponentEvent: BlogComponent::Event,
        #[flat]
        InvestmentEvent: InvestmentComponent::Event,
    }

    impl PropertyComponentImpl = PropertyComponent::PropertyComponentImpl<ContractState>;
    impl PropertyPrivateFunctions = PropertyComponent::PropertyFunctions<ContractState>;

    #[abi(embed_v0)]
    impl UsersComponentImpl = UsersComponent::UsersComponentImpl<ContractState>;
    impl UsersPrivateFunctions = UsersComponent::UsersPrivateFunctions<ContractState>;

    #[abi(embed_v0)]
    impl BlogComponentImpl = BlogComponent::BlogsComponentImpl<ContractState>;


    // #[abi(embed_v0)]
    impl InvestmentComponentImpl = InvestmentComponent::InvestmentImpl<ContractState>;
    impl InvestmentPrivateFunctions =
        InvestmentComponent::InvestmentInternalFunctions<ContractState>;
    // Ownable Implementation
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // Upgradeable Implementation
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
        self.properties._initialize_property_count();
    }

    #[abi(embed_v0)]
    impl StarhomesContractImpl of IStarhomesContract<ContractState> {
        fn list_property(ref self: ContractState, property: Property) -> felt252 {
            let agent_id = property.agent_id.clone();
            let isRegistered = self.users_data.is_agent_registered(agent_id);
            assert(isRegistered, Errors::AGENT_NOT_REGISTERED);
            self.properties.list_property(property)
        }

        fn list_investment_property(ref self: ContractState, investment_asset: InvestmentAsset) {
            self
                .investments
                .initialize_investment(
                    investment_id: investment_asset.id,
                    token: investment_asset.investment_token,
                    manager: investment_asset.investor_id,
                    min_lock: investment_asset.min_investment_amount,
                    withdrawal_fee: 500,
                    annual_return_rate: investment_asset.expected_roi.into(),
                );

            self.properties.list_investment_property(investment_asset);
        }
        fn send_visit_request(ref self: ContractState, visit_request: UserVisitRequest) {
            assert(
                self.users_data.is_user_registered(visit_request.user_id.clone()),
                Errors::USER_NOT_REGISTERED,
            );
            self.users_data._send_visit_request(visit_request);
        }
        fn read_visit_requests(
            self: @ContractState, property_id: felt252,
        ) -> Array<UserVisitRequest> {
            let caller = get_caller_address();
            assert(self.users_data.is_user_registered(caller), Errors::USER_NOT_REGISTERED);
            self.users_data._read_visit_requests(property_id)
        }

        fn edit_property(
            ref self: ContractState, property_id: felt252, property: Property,
        ) -> felt252 {
            self.properties.edit_property(property_id, property)
        }

        fn edit_listed_investment_property(
            ref self: ContractState, investment_id: felt252, investment: InvestmentAsset,
        ) -> felt252 {
            self.properties.edit_listed_investment_property(investment_id, investment)
        }

        fn invest_in_property(ref self: ContractState, investment_id: felt252, amount: u256) {
            // Verify user is registered
            let caller = starknet::get_caller_address();
            assert(self.users_data.is_investor_registered(caller), 'Not registered as investor');

            // Get investment details from property component
            let investment = self.properties.get_investment_by_id(investment_id);

            assert(investment.is_active, 'Investment not active');
            // let investment = self.get_investment(investment_id);
            assert(amount >= investment.min_investment_amount, 'Minimum amount not met');

            // Initialize investment if not already done
            if !self.investments._is_investment_initialized(investment_id) {
                self
                    .investments
                    .initialize_investment(
                        investment_id: investment_id,
                        token: investment.investment_token,
                        manager: investment.investor_id,
                        min_lock: investment.min_investment_amount,
                        withdrawal_fee: 500,
                        annual_return_rate: investment.expected_roi.into(),
                    );
            }

            // Make investment
            self.investments.invest(investment_id, amount);
            self
                .properties
                ._edit_listed_investment(
                    investment_id,
                    investment: InvestmentAsset {
                        available_staking_amount: investment.available_staking_amount - amount,
                        ..investment,
                    },
                );
        }

        fn withdraw_from_property(ref self: ContractState, investment_id: felt252, amount: u256) {
            // Verify user is registered
            let caller = starknet::get_caller_address();
            assert(self.users_data.is_investor_registered(caller), 'Not registered as investor');

            // Verify investment exists
            assert(
                self.investments._is_investment_initialized(investment_id),
                'Investment not initialized',
            );

            // Process withdrawal
            self.investments.withdraw(investment_id, amount);
            let investment = self.properties.get_investment_by_id(investment_id);
            self
                .properties
                ._edit_listed_investment(
                    investment_id,
                    investment: InvestmentAsset {
                        available_staking_amount: investment.available_staking_amount + amount,
                        ..investment,
                    },
                );
        }
        fn get_investment_manager(self: @ContractState, investment_id: felt252) -> ContractAddress {
            self.investments.get_manager(investment_id)
        }

        fn set_annual_investment_rate(ref self: ContractState, investment_id: felt252, rate: u256) {
            self.investments.set_annual_return_rate(investment_id, rate)
        }
        fn get_investors_for_investment(
            self: @ContractState, investment_id: felt252,
        ) -> Array<ContractAddress> {
            self.investments.get_investors_for_asset(investment_id)
        }
        fn get_investor_balance_in_investment(
            self: @ContractState, investment_id: felt252, investor_address: ContractAddress,
        ) -> u256 {
            self
                .investments
                .get_investment_balance(investor: investor_address, investment_id: investment_id)
        }


        fn get_property(self: @ContractState, property_id: felt252) -> Property {
            self.properties.get_property_by_id(property_id)
        }

        fn get_sale_properties(self: @ContractState) -> Array<Property> {
            self.properties.get_sale_properties()
        }

        fn get_sale_properties_by_agent(
            self: @ContractState, agent_id: ContractAddress,
        ) -> Array<Property> {
            self.properties.get_sale_properties_by_agent(agent_id)
        }

        fn get_investment_properties_by_lister(
            self: @ContractState, lister_id: ContractAddress,
        ) -> Array<InvestmentAsset> {
            self.properties.get_investment_properties_by_lister(lister_id)
        }

        fn get_investment_properties(self: @ContractState) -> Array<InvestmentAsset> {
            let mut investment_properties = array![];
            for i in 0..self.properties.get_investment_properties().len() {
                let investment: @InvestmentAsset = self
                    .properties
                    .get_investment_properties()
                    .at(i);
                let investors = self.get_investors_for_investment(investment.id.clone());

                investment_properties
                    .append(
                        InvestmentAsset { investors: investors.len().into(), ..investment.clone() },
                    );
            };
            investment_properties
        }

        fn get_investment(self: @ContractState, investment_id: felt252) -> InvestmentAsset {
            self.properties.get_investment_by_id(investment_id)
        }

        fn read_investor_returns(
            self: @ContractState, investment_id: felt252, investor: ContractAddress,
        ) -> u256 {
            self.investments.read_investor_returns(investment_id, investor)
        }
        fn read_update(self: @ContractState) -> u256 {
            self.update.read()
        }

        fn version(self: @ContractState) -> u64 {
            self.version.read()
        }
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            let contract_version = self.version.read();
            self.version.write(contract_version + 1);
            self.upgradeable.upgrade(new_class_hash);
        }
    }
}
