use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
use starhomes::messages::errors::Errors;
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

#[starknet::component]
pub mod PropertyInvestmentComponent {
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess
    };
    use super::{ContractAddress, get_caller_address, get_block_timestamp, IERC20Dispatcher};

    #[derive(Drop, starknet::Store, Serde)]
    pub struct Property {
        id: felt252,
        owner: ContractAddress,
        total_investment: u256,
        available_investment: u256,
        rental_income: u256,
        last_distribution: u64,
        is_active: bool,
    }

    #[derive(Drop, starknet::Store, Serde)]
    pub struct Investment {
        amount: u256,
        share_percentage: u256,
        unclaimed_income: u256,
        timestamp: u64,
    }

    #[storage]
    pub struct Storage {
        // Property storage
        pub properties: Map<felt252, Property>,
        pub property_count: u256,
        pub property_token: IERC20Dispatcher,
        
        // Investment tracking
        pub investments: Map<(felt252, ContractAddress), Investment>,
        pub total_invested_amount: Map<felt252, u256>,
        pub investor_count: Map<felt252, u256>,
        
        // Income distribution
        pub pending_distributions: Map<felt252, u256>,
        pub last_distribution_timestamp: Map<felt252, u64>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PropertyAdded: PropertyAdded,
        PropertyUpdated: PropertyUpdated,
        InvestmentMade: InvestmentMade,
        InvestmentWithdrawn: InvestmentWithdrawn,
        IncomeDistributed: IncomeDistributed,
        IncomeClaimed: IncomeClaimed,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PropertyAdded {
        property_id: felt252,
        owner: ContractAddress,
        total_investment: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PropertyUpdated {
        property_id: felt252,
        total_investment: u256,
        rental_income: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct InvestmentMade {
        property_id: felt252,
        investor: ContractAddress,
        amount: u256,
        share_percentage: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct InvestmentWithdrawn {
        property_id: felt252,
        investor: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct IncomeDistributed {
        property_id: felt252,
        total_amount: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct IncomeClaimed {
        property_id: felt252,
        investor: ContractAddress,
        amount: u256,
    }

    pub trait IPropertyInvestmentTrait<TContractState> {
        fn initialize_property_investment(ref self: TContractState, token: ContractAddress);
        fn add_property(ref self: TContractState, id: felt252, total_investment: u256, rental_income: u256) -> bool;
        fn update_property(ref self: TContractState, id: felt252, total_investment: u256, rental_income: u256) -> bool;
        fn invest_in_property(ref self: TContractState, property_id: felt252, amount: u256) -> bool;
        fn withdraw_from_property(ref self: TContractState, property_id: felt252, amount: u256) -> bool;
        fn distribute_income(ref self: TContractState, property_id: felt252) -> bool;
        fn claim_income(ref self: TContractState, property_id: felt252) -> bool;
        fn get_property(self: @TContractState, id: felt252) -> Property;
        fn get_investment(self: @TContractState, property_id: felt252, investor: ContractAddress) -> Investment;
    }

    #[embeddable_as(PropertyInvestmentImpl)]
    impl PropertyInvestment<
        TContractState, +HasComponent<TContractState>
    > of IPropertyInvestmentTrait<ComponentState<TContractState>> {
        fn initialize_property_investment(
            ref self: ComponentState<TContractState>,
            token: ContractAddress,
        ) {
            self.property_token.write(IERC20Dispatcher { contract_address: token });
        }

        fn add_property(
            ref self: ComponentState<TContractState>,
            id: felt252,
            total_investment: u256,
            rental_income: u256,
        ) -> bool {
            let caller = get_caller_address();
            let property = Property {
                id,
                owner: caller,
                total_investment,
                available_investment: total_investment,
                rental_income,
                last_distribution: get_block_timestamp().try_into().unwrap(),
                is_active: true,
            };
            self.properties.write(id, property);
            self.property_count.write(self.property_count.read() + 1);
            
            self.emit(PropertyAdded { property_id: id, owner: caller, total_investment });
            true
        }

        fn update_property(
            ref self: ComponentState<TContractState>,
            id: felt252,
            total_investment: u256,
            rental_income: u256,
        ) -> bool {
            let mut property = self.properties.read(id);
            assert(property.owner == get_caller_address(), 'Not property owner');
            
            property.total_investment = total_investment;
            property.rental_income = rental_income;
            self.properties.write(id, property);
            
            self.emit(PropertyUpdated { property_id: id, total_investment, rental_income });
            true
        }

        fn invest_in_property(
            ref self: ComponentState<TContractState>,
            property_id: felt252,
            amount: u256,
        ) -> bool {
            let mut property = self.properties.read(property_id);
            assert(property.is_active, 'Property not active');
            assert(amount <= property.available_investment, 'Insufficient available investment');

            let investor = get_caller_address();
            let total_invested = self.total_invested_amount.read(property_id);
            let share_percentage = if total_invested == 0 {
                10000 // 100% in basis points
            } else {
                (amount * 10000) / property.total_investment
            };

            // Transfer tokens
            self.property_token.read().transfer_from(investor, get_caller_address(), amount);

            // Update investment records
            let mut investment = self.investments.read((property_id, investor));
            investment.amount += amount;
            investment.share_percentage = share_percentage;
            investment.timestamp = get_block_timestamp().try_into().unwrap();
            self.investments.write((property_id, investor), investment);

            // Update property records
            property.available_investment -= amount;
            self.properties.write(property_id, property);
            self.total_invested_amount.write(property_id, total_invested + amount);
            self.investor_count.write(property_id, self.investor_count.read(property_id) + 1);

            self.emit(InvestmentMade { 
                property_id,
                investor,
                amount,
                share_percentage
            });
            true
        }

        fn withdraw_from_property(
            ref self: ComponentState<TContractState>,
            property_id: felt252,
            amount: u256,
        ) -> bool {
            let investor = get_caller_address();
            let mut investment = self.investments.read((property_id, investor));
            assert(amount <= investment.amount, 'Insufficient balance');

            // Update investment records
            investment.amount -= amount;
            investment.share_percentage = (investment.amount * 10000) / self.total_invested_amount.read(property_id);
            self.investments.write((property_id, investor), investment);

            // Transfer tokens
            self.property_token.read().transfer(investor, amount);

            self.emit(InvestmentWithdrawn { property_id, investor, amount });
            true
        }

        fn distribute_income(
            ref self: ComponentState<TContractState>,
            property_id: felt252,
        ) -> bool {
            let property = self.properties.read(property_id);
            assert(property.owner == get_caller_address(), 'Not property owner');
            
            let current_time: u64 = get_block_timestamp().try_into().unwrap();
            let time_elapsed = current_time - property.last_distribution;
            let income_amount = (property.rental_income * time_elapsed.into()) / 31536000; // Yearly income pro-rated

            self.pending_distributions.write(property_id, income_amount);
            self.last_distribution_timestamp.write(property_id, current_time);

            self.emit(IncomeDistributed { 
                property_id,
                total_amount: income_amount,
                timestamp: current_time
            });
            true
        }

        fn claim_income(
            ref self: ComponentState<TContractState>,
            property_id: felt252,
        ) -> bool {
            let investor = get_caller_address();
            let investment = self.investments.read((property_id, investor));
            let total_distribution = self.pending_distributions.read(property_id);
            
            let investor_share = (total_distribution * investment.share_percentage) / 10000;
            assert(investor_share > 0, 'No income to claim');

            // Transfer income
            self.property_token.read().transfer(investor, investor_share);
            
            self.emit(IncomeClaimed { property_id, investor, amount: investor_share });
            true
        }

        fn get_property(self: @ComponentState<TContractState>, id: felt252) -> Property {
            self.properties.read(id)
        }

        fn get_investment(
            self: @ComponentState<TContractState>,
            property_id: felt252,
            investor: ContractAddress
        ) -> Investment {
            self.investments.read((property_id, investor))
        }
    }
}