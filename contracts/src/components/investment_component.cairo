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
        // Total invested amount per user
        pub investments: Map<ContractAddress, u256>,
        // Lock period end timestamp per user
        pub lock_periods: Map<ContractAddress, u256>,
        // Minimum lock period in seconds (e.g., 365 days = 31536000 seconds)
        pub min_lock_period: u256,
        // Minimum investment amount
        pub min_investment: u256,
        // Early withdrawal fee percentage (in basis points, e.g., 500 = 5%)
        pub early_withdrawal_fee: u16,
        // Total funds in trust
        pub total_funds: u256,
        // Beneficiary addresses per investor
        pub beneficiaries: Map<ContractAddress, ContractAddress>,
        // Investment caps per user
        pub investment_caps: Map<ContractAddress, u256>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        InvestmentDeposit: InvestmentDeposit,
        InvestmentWithdrawal: InvestmentWithdrawal,
        LockPeriodSet: LockPeriodSet,
    }

    #[derive(Drop, starknet::Event)]
    pub struct InvestmentDeposit {
        investor: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct InvestmentWithdrawal {
        investor: ContractAddress,
        amount: u256,
        fee_paid: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct LockPeriodSet {
        investor: ContractAddress,
        lock_until: u256,
    }

    pub trait IInvestmentTrait<TContractState> {
        fn initialize_investment(
            ref self: TContractState,
            token: ContractAddress,
            manager: ContractAddress,
            min_lock: u256,
            min_invest: u256,
            withdrawal_fee: u16
        );
        fn invest(ref self: TContractState, amount: u256) -> bool;
        fn set_lock_period(ref self: TContractState, duration: u256);
        fn withdraw(ref self: TContractState, amount: u256) -> bool;
        fn set_beneficiary(ref self: TContractState, beneficiary: ContractAddress);
        fn get_investment_balance(self: @TContractState, investor: ContractAddress) -> u256;
        fn get_lock_period_end(self: @TContractState, investor: ContractAddress) -> u256;
        fn set_investment_cap(ref self: TContractState, investor: ContractAddress, cap: u256);
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
            min_invest: u256,
            withdrawal_fee: u16,
        ) {
            self.investment_token.write(IERC20Dispatcher { contract_address: token });
            self.manager.write(manager);
            self.min_lock_period.write(min_lock);
            self.min_investment.write(min_invest);
            self.early_withdrawal_fee.write(withdrawal_fee);
        }

        fn invest(ref self: ComponentState<TContractState>, amount: u256) -> bool {
            let investor = get_caller_address();
            
            // Validate investment amount
            assert(amount >= self.min_investment.read(), super::Errors::NULL_AMOUNT);
            
            // Check investment cap if set
            let cap = self.investment_caps.read(investor);
            if cap > 0 {
                assert(
                    self.investments.read(investor) + amount <= cap,
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
            self.investments.write(
                investor,
                self.investments.read(investor) + amount
            );
            self.total_funds.write(self.total_funds.read() + amount);

            // Emit event
            self.emit(InvestmentDeposit { investor, amount });
            true
        }

        fn set_lock_period(ref self: ComponentState<TContractState>, duration: u256) {
            let investor = get_caller_address();
            assert(duration >= self.min_lock_period.read(), 'Lock period too short');

            let lock_until = get_block_timestamp().into() + duration;
            self.lock_periods.write(investor, lock_until);

            self.emit(LockPeriodSet { investor, lock_until });
        }

        fn withdraw(ref self: ComponentState<TContractState>, amount: u256) -> bool {
            let investor = get_caller_address();
            let investment = self.investments.read(investor);
            
            assert(amount <= investment, 'Insufficient balance');

            let current_time: u256 = get_block_timestamp().into();
            let lock_end = self.lock_periods.read(investor);
            
            let mut fee: u256 = 0;
            if current_time < lock_end {
                fee = (amount * self.early_withdrawal_fee.read().into()) / 10000;
            }

            let withdrawal_amount = amount - fee;
            
            // Update investment records
            self.investments.write(investor, investment - amount);
            self.total_funds.write(self.total_funds.read() - amount);

            // Transfer tokens
            self.investment_token.read().transfer(investor, withdrawal_amount);
            if fee > 0 {
                // Transfer fee to manager
                self.investment_token.read().transfer(self.manager.read(), fee);
            }

            self.emit(InvestmentWithdrawal { investor, amount, fee_paid: fee });
            true
        }

        fn set_beneficiary(ref self: ComponentState<TContractState>, beneficiary: ContractAddress) {
            let investor = get_caller_address();
            self.beneficiaries.write(investor, beneficiary);
        }

        fn get_investment_balance(
            self: @ComponentState<TContractState>,
            investor: ContractAddress
        ) -> u256 {
            self.investments.read(investor)
        }

        fn get_lock_period_end(
            self: @ComponentState<TContractState>,
            investor: ContractAddress
        ) -> u256 {
            self.lock_periods.read(investor)
        }

        fn set_investment_cap(
            ref self: ComponentState<TContractState>,
            investor: ContractAddress,
            cap: u256
        ) {
            assert(get_caller_address() == self.manager.read(), 'Only manager');
            self.investment_caps.write(investor, cap);
        }
    }
}