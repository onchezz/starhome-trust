use starhomes::messages::errors::Errors;

#[starknet::component]
pub mod InvestmentComponent {
    use starhomes::models::contract_events::{InvestmentDeposit, InvestmentWithdrawal, LockPeriodSet};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address};
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess
    };

    #[storage]
    pub struct Storage {
        // Core investment tracking
        pub investment_token: IERC20Dispatcher,
        pub manager: ContractAddress,
        pub investments: Map<(ContractAddress, felt252), u256>,
        pub lock_periods: Map<(ContractAddress, felt252), u256>,
        pub min_lock_period: u256,
        pub min_investments: Map<felt252, u256>,
        pub early_withdrawal_fee: u16,
        pub total_funds: Map<felt252, u256>,
        pub investment_caps: Map<(ContractAddress, felt252), u256>,
        pub initialized_investments: Map<felt252, bool>,
        
        // Investment performance tracking
        pub investment_start_times: Map<(ContractAddress, felt252), u256>,
        pub annual_return_rates: Map<felt252, u256>,
        pub earned_returns: Map<(ContractAddress, felt252), u256>,
        pub total_invested_amount: Map<felt252, u256>,
        pub investor_count: Map<felt252, u32>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        InvestmentDeposit: InvestmentDeposit,
        InvestmentWithdrawal: InvestmentWithdrawal,
        LockPeriodSet: LockPeriodSet,
    }

    #[generate_trait]
    pub trait IInvestmentTrait<TContractState> {
        fn initialize_investment(
            ref self: TContractState,
            investment_id: felt252,
            token: ContractAddress,
            manager: ContractAddress,
            min_lock: u256,
            withdrawal_fee: u16,
            annual_return_rate: u256
        );
        fn invest(ref self: TContractState, investment_id: felt252, amount: u256) -> bool;
        fn set_lock_period(ref self: TContractState, investment_id: felt252, duration: u256);
        fn withdraw(ref self: TContractState, investment_id: felt252, amount: u256) -> bool;
        fn get_investment_balance(self: @TContractState, investor: ContractAddress, investment_id: felt252) -> u256;
        fn get_lock_period_end(self: @TContractState, investor: ContractAddress, investment_id: felt252) -> u256;
        fn get_earned_returns(self: @TContractState, investor: ContractAddress, investment_id: felt252) -> u256;
        fn get_investment_metrics(self: @TContractState, investment_id: felt252) -> (u256, u32, u256);
        fn set_investment_cap(ref self: TContractState, investor: ContractAddress, investment_id: felt252, cap: u256);
        fn set_min_investment(ref self: TContractState, investment_id: felt252, min_amount: u256);
        fn set_annual_return_rate(ref self: TContractState, investment_id: felt252, rate: u256);
    }

    #[embeddable_as(InvestmentImpl)]
    impl Investment<
        TContractState, +HasComponent<TContractState>
    > of IInvestmentTrait<ComponentState<TContractState>> {
        fn initialize_investment(
            ref self: ComponentState<TContractState>,
            investment_id: felt252,
            token: ContractAddress,
            manager: ContractAddress,
            min_lock: u256,
            withdrawal_fee: u16,
            annual_return_rate: u256
        ) {
            self.investment_token.write(IERC20Dispatcher { contract_address: token });
            self.manager.write(manager);
            self.min_lock_period.write(min_lock);
            self.early_withdrawal_fee.write(withdrawal_fee);
            self.annual_return_rates.write(investment_id, annual_return_rate);
            self.initialized_investments.write(investment_id, true);
            self.investor_count.write(investment_id, 0);
            self.total_invested_amount.write(investment_id, 0);
        }

        fn invest(ref self: ComponentState<TContractState>, investment_id: felt252, amount: u256) -> bool {
            assert(self._is_investment_initialized(investment_id), 'Investment not initialized');
            let investor = get_caller_address();
            let min_investment = self.min_investments.read(investment_id);
            
            assert(amount >= min_investment, 'Below minimum investment');
            
            let cap = self.investment_caps.read((investor, investment_id));
            if cap > 0 {
                let current_investment = self.investments.read((investor, investment_id));
                assert(current_investment + amount <= cap, 'Exceeds investment cap');
            }

            // Transfer tokens
            self.investment_token.read().transfer_from(investor, get_contract_address(), amount);

            // Update investment records
            let current_investment = self.investments.read((investor, investment_id));
            if current_investment == 0 {
                // New investor
                let current_count = self.investor_count.read(investment_id);
                self.investor_count.write(investment_id, current_count + 1);
                self.investment_start_times.write((investor, investment_id), get_block_timestamp().into());
            }

            self.investments.write((investor, investment_id), current_investment + amount);
            
            // Update total amounts
            let current_total = self.total_funds.read(investment_id);
            self.total_funds.write(investment_id, current_total + amount);
            
            let total_invested = self.total_invested_amount.read(investment_id);
            self.total_invested_amount.write(investment_id, total_invested + amount);

            self.emit(InvestmentDeposit { investor, amount });
            true
        }

        fn withdraw(ref self: ComponentState<TContractState>, investment_id: felt252, amount: u256) -> bool {
            assert(self._is_investment_initialized(investment_id), 'Investment not initialized');
            let investor = get_caller_address();
            let investment = self.investments.read((investor, investment_id));
            
            assert(amount <= investment, 'Insufficient balance');

            let current_time: u256 = get_block_timestamp().into();
            let lock_end = self.lock_periods.read((investor, investment_id));
            
            // Calculate earned returns
            let earned = self._calculate_returns(investor, investment_id);
            
            let mut withdrawal_amount = amount;
            if current_time < lock_end {
                let fee = (amount * self.early_withdrawal_fee.read().into()) / 10000;
                withdrawal_amount = amount - fee;
                // Transfer fee to manager
                if fee > 0 {
                    self.investment_token.read().transfer(self.manager.read(), fee);
                }
            }

            // Update investment records
            self.investments.write((investor, investment_id), investment - amount);
            let current_total = self.total_funds.read(investment_id);
            self.total_funds.write(investment_id, current_total - amount);

            // Update earned returns
            self.earned_returns.write((investor, investment_id), earned);

            // Transfer withdrawal amount
            self.investment_token.read().transfer(investor, withdrawal_amount);

            self.emit(InvestmentWithdrawal { 
                investor, 
                amount, 
                fee_paid: amount - withdrawal_amount 
            });
            true
        }

        fn get_earned_returns(
            self: @ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252
        ) -> u256 {
            self._calculate_returns(investor, investment_id)
        }

        fn get_investment_metrics(
            self: @ComponentState<TContractState>,
            investment_id: felt252
        ) -> (u256, u32, u256) {
            (
                self.total_invested_amount.read(investment_id),
                self.investor_count.read(investment_id),
                self.annual_return_rates.read(investment_id)
            )
        }

        fn set_annual_return_rate(
            ref self: ComponentState<TContractState>,
            investment_id: felt252,
            rate: u256
        ) {
            assert(get_caller_address() == self.manager.read(), 'Only manager');
            self.annual_return_rates.write(investment_id, rate);
        }
    }

    #[generate_trait]
    impl InternalFunctions<
        TContractState, +HasComponent<TContractState>
    > of InternalFunctionsTrait<TContractState> {
        fn _is_investment_initialized(
            self: @ComponentState<TContractState>,
            investment_id: felt252
        ) -> bool {
            self.initialized_investments.read(investment_id)
        }

        fn _calculate_returns(
            self: @ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252
        ) -> u256 {
            let investment = self.investments.read((investor, investment_id));
            if investment == 0 {
                return 0;
            }

            let start_time = self.investment_start_times.read((investor, investment_id));
            let current_time: u256 = get_block_timestamp().into();
            let time_invested = current_time - start_time;
            
            // Calculate returns based on annual rate and time invested
            let annual_rate = self.annual_return_rates.read(investment_id);
            let returns = (investment * annual_rate * time_invested) / (10000 * 31536000); // 31536000 seconds in a year
            
            returns
        }
    }
}
