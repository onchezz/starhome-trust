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
        // Investment token (e.g., USDC, ETH)
        pub investment_token: IERC20Dispatcher,
        // Trust fund manager/admin
        pub manager: ContractAddress,
        // Total invested amount per user per investment
        pub investments: Map<(ContractAddress, felt252), u256>,
        // Lock period end timestamp per user per investment
        pub lock_periods: Map<(ContractAddress, felt252), u256>,
        // Minimum lock period in seconds (e.g., 365 days = 31536000 seconds)
        pub min_lock_period: u256,
        // Minimum investment amount per investment
        pub min_investments: Map<felt252, u256>,
        // Early withdrawal fee percentage (in basis points, e.g., 500 = 5%)
        pub early_withdrawal_fee: u16,
        // Total funds per investment
        pub total_funds: Map<felt252, u256>,
        // Investment caps per user per investment
        pub investment_caps: Map<(ContractAddress, felt252), u256>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        InvestmentDeposit: InvestmentDeposit,
        InvestmentWithdrawal: InvestmentWithdrawal,
        LockPeriodSet: LockPeriodSet,
    }

    pub trait IInvestmentTrait<TContractState> {
        fn initialize_investment(
            ref self: TContractState,
            token: ContractAddress,
            manager: ContractAddress,
            min_lock: u256,
            withdrawal_fee: u16
        );
        fn invest(ref self: TContractState, investment_id: felt252, amount: u256) -> bool;
        fn set_lock_period(ref self: TContractState, investment_id: felt252, duration: u256);
        fn withdraw(ref self: TContractState, investment_id: felt252, amount: u256) -> bool;
        fn get_investment_balance(self: @TContractState, investor: ContractAddress, investment_id: felt252) -> u256;
        fn get_lock_period_end(self: @TContractState, investor: ContractAddress, investment_id: felt252) -> u256;
        fn set_investment_cap(ref self: TContractState, investor: ContractAddress, investment_id: felt252, cap: u256);
        fn set_min_investment(ref self: TContractState, investment_id: felt252, min_amount: u256);
    }

    #[embeddable_as(InvestmentImpl)]
    impl Investment<
        TContractState, +HasComponent<TContractState>
    > of IInvestmentTrait<ComponentState<TContractState>> {
        fn initialize_investment(
            ref self: ComponentState<TContractState>,
            token: ContractAddress,
            manager: ContractAddress,
            min_lock: u256,
            withdrawal_fee: u16,
        ) {
            self.investment_token.write(IERC20Dispatcher { contract_address: token });
            self.manager.write(manager);
            self.min_lock_period.write(min_lock);
            self.early_withdrawal_fee.write(withdrawal_fee);
        }

        fn invest(ref self: ComponentState<TContractState>, investment_id: felt252, amount: u256) -> bool {
            let investor = get_caller_address();
            let min_investment = self.min_investments.read(investment_id);
            
            // Validate investment amount
            assert(amount >= min_investment, super::Errors::NULL_AMOUNT);
            
            // Check investment cap
            let cap = self.investment_caps.read((investor, investment_id));
            if cap > 0 {
                let current_investment = self.investments.read((investor, investment_id));
                assert(
                    current_investment + amount <= cap,
                    'Exceeds investment cap'
                );
            }

            // Transfer tokens to contract
            self.investment_token.read().transfer_from(
                investor,
                get_contract_address(),
                amount
            );

            // Update investment records
            let current_investment = self.investments.read((investor, investment_id));
            self.investments.write((investor, investment_id), current_investment + amount);
            
            let current_total = self.total_funds.read(investment_id);
            self.total_funds.write(investment_id, current_total + amount);

            // Emit event
            self.emit(InvestmentDeposit { investor, amount });
            true
        }

        fn set_lock_period(ref self: ComponentState<TContractState>, investment_id: felt252, duration: u256) {
            let investor = get_caller_address();
            assert(duration >= self.min_lock_period.read(), 'Lock period too short');

            let lock_until = get_block_timestamp().into() + duration;
            self.lock_periods.write((investor, investment_id), lock_until);

            self.emit(LockPeriodSet { investor, lock_until });
        }

        fn withdraw(ref self: ComponentState<TContractState>, investment_id: felt252, amount: u256) -> bool {
            let investor = get_caller_address();
            let investment = self.investments.read((investor, investment_id));
            
            assert(amount <= investment, 'Insufficient balance');

            let current_time: u256 = get_block_timestamp().into();
            let lock_end = self.lock_periods.read((investor, investment_id));
            
            let mut fee: u256 = 0;
            if current_time < lock_end {
                fee = (amount * self.early_withdrawal_fee.read().into()) / 10000;
            }

            let withdrawal_amount = amount - fee;
            
            // Update investment records
            self.investments.write((investor, investment_id), investment - amount);
            let current_total = self.total_funds.read(investment_id);
            self.total_funds.write(investment_id, current_total - amount);

            // Transfer tokens
            self.investment_token.read().transfer(investor, withdrawal_amount);
            if fee > 0 {
                self.investment_token.read().transfer(self.manager.read(), fee);
            }

            self.emit(InvestmentWithdrawal { investor, amount, fee_paid: fee });
            true
        }

        fn get_investment_balance(
            self: @ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252
        ) -> u256 {
            self.investments.read((investor, investment_id))
        }

        fn get_lock_period_end(
            self: @ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252
        ) -> u256 {
            self.lock_periods.read((investor, investment_id))
        }

        fn set_investment_cap(
            ref self: ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252,
            cap: u256
        ) {
            assert(get_caller_address() == self.manager.read(), 'Only manager');
            self.investment_caps.write((investor, investment_id), cap);
        }

        fn set_min_investment(
            ref self: ComponentState<TContractState>,
            investment_id: felt252,
            min_amount: u256
        ) {
            assert(get_caller_address() == self.manager.read(), 'Only manager');
            self.min_investments.write(investment_id, min_amount);
        }
    }
}