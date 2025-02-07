#[starknet::component]
pub mod InvestmentComponent {
    use starknet::storage::StoragePathEntry;
    use starhomes::models::contract_events::{
        InvestmentDeposit, InvestmentWithdrawal, LockPeriodSet,
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address};
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess, Vec, VecTrait, MutableVecTrait,
    };
    use starhomes::interfaces::investment_interface::IInvestmentTrait;

    #[storage]
    pub struct Storage {
        // Core investment tracking
        pub investment_token: Map<felt252, IERC20Dispatcher>, // Token per investment
        pub manager: Map<felt252, ContractAddress>, // Manager per investment
        pub investments: Map<(ContractAddress, felt252), u256>, // Investor balance per investment
        pub lock_periods: Map<
            (ContractAddress, felt252), u256,
        >, // Lock period end time per investor per investment
        pub min_lock_period: u256, // Minimum lock period duration
        pub min_investments: Map<felt252, u256>, // Minimum investment amount per investment
        pub early_withdrawal_fee: u16, // Fee percentage for early withdrawals (basis points)
        pub total_funds: Map<felt252, u256>, // Total funds in each investment
        pub investment_caps: Map<
            (ContractAddress, felt252), u256,
        >, // Maximum investment amount per investor per investment
        pub initialized_investments: Map<felt252, bool>, // Track if investment is initialized
        // Investment performance tracking
        pub investment_start_times: Map<
            (ContractAddress, felt252), u256,
        >, // When each investor started their investment
        pub annual_return_rates: Map<
            felt252, u256,
        >, // Annual return rate per investment (basis points)
        pub earned_returns: Map<
            (ContractAddress, felt252), u256,
        >, // Earned returns per investor per investment
        pub total_invested_amount: Map<
            felt252, u256,
        >, // Total amount ever invested in each investment
        pub investor_count: Map<felt252, u32>, // Number of unique investors per investment
        // Investor tracking
        pub investors_per_asset: Map<
            felt252, Vec<ContractAddress>,
        >, // Array of investors per investment
        pub active_investors: Map<felt252, u32> // Count of active investors per investment
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        InvestmentDeposit: InvestmentDeposit,
        InvestmentWithdrawal: InvestmentWithdrawal,
        LockPeriodSet: LockPeriodSet,
    }


    #[embeddable_as(InvestmentImpl)]
    pub impl Investment<
        TContractState, +HasComponent<TContractState>,
    > of IInvestmentTrait<ComponentState<TContractState>> {
        fn initialize_investment(
            ref self: ComponentState<TContractState>,
            investment_id: felt252,
            token: ContractAddress,
            manager: ContractAddress,
            min_lock: u256,
            withdrawal_fee: u16,
            annual_return_rate: u256,
        ) {
            // Initialize investment token and manager
            self
                .investment_token
                .write(investment_id, IERC20Dispatcher { contract_address: token });
            self.manager.write(investment_id, manager);

            // Set initial parameters
            self.min_lock_period.write(min_lock);
            self.early_withdrawal_fee.write(withdrawal_fee);
            self.annual_return_rates.write(investment_id, annual_return_rate);
            // Initialize tracking variables
            self.initialized_investments.write(investment_id, true);
            self.investor_count.write(investment_id, 0);
            self.total_invested_amount.write(investment_id, 0);
            self.active_investors.write(investment_id, 0);
        }

        fn invest(
            ref self: ComponentState<TContractState>, investment_id: felt252, amount: u256,
        ) -> bool {
            let investor = get_caller_address();

            assert(self._is_investment_initialized(investment_id), 'Investment not initialized');

            let min_investment = self.min_investments.read(investment_id);

            // Validate investment amount
            assert(amount >= min_investment, 'Below minimum investment');
            // Check investment cap
            let cap = self.investment_caps.read((investor, investment_id));
            if cap > 0 {
                let current_investment = self.investments.read((investor, investment_id));
                assert(current_investment + amount <= cap, 'Exceeds investment cap');
            }

            // Transfer tokens
            let token = self.investment_token.read(investment_id);
            token.transfer_from(investor, get_contract_address(), amount);

            // Update investment records
            let current_investment = self.investments.read((investor, investment_id));
            if current_investment == 0 {
                // New investor
                let current_count = self.investor_count.read(investment_id);
                self.investor_count.write(investment_id, current_count + 1);
                self
                    .investment_start_times
                    .write((investor, investment_id), get_block_timestamp().into());

                // Add to investors array
                let mut investors = self.investors_per_asset.entry(investment_id);
                investors.append().write(investor);
                // Update active investors count
                let active = self.active_investors.read(investment_id);
                self.active_investors.write(investment_id, active + 1);
            }

            // Update investment amounts
            self.investments.write((investor, investment_id), current_investment + amount);
            let current_total = self.total_funds.read(investment_id);
            self.total_funds.write(investment_id, current_total + amount);
            let total_invested = self.total_invested_amount.read(investment_id);
            self.total_invested_amount.write(investment_id, total_invested + amount);

            self.emit(InvestmentDeposit { investor, amount });
            true
        }

        fn withdraw(
            ref self: ComponentState<TContractState>, investment_id: felt252, amount: u256,
        ) -> bool {
            assert(self._is_investment_initialized(investment_id), 'Investment not initialized');
            let investor = get_caller_address();
            let investment = self.investments.read((investor, investment_id));

            assert(amount <= investment, 'less balance in investment');

            let current_time: u256 = get_block_timestamp().into();
            let lock_end = self.lock_periods.read((investor, investment_id));

            // Calculate earned returns
            let earned = self._calculate_returns(investor, investment_id);

            // Process withdrawal with fees if applicable
            let mut withdrawal_amount = amount;
            if current_time < lock_end {
                let fee = (amount * self.early_withdrawal_fee.read().into()) / 10000;
                withdrawal_amount = amount - fee;
                // Transfer fee to manager
                if fee > 0 {
                    let token = self.investment_token.read(investment_id);
                    token.transfer(self.manager.read(investment_id), fee);
                }
            }

            // Update investment records
            self.investments.write((investor, investment_id), investment - amount);
            let current_total = self.total_funds.read(investment_id);
            self.total_funds.write(investment_id, current_total - amount);

            // Update earned returns
            self.earned_returns.write((investor, investment_id), earned);

            // Check if investor has fully withdrawn
            if investment - amount == 0 {
                let active = self.active_investors.read(investment_id);
                if active > 0 {
                    self.active_investors.write(investment_id, active - 1);
                }
            }

            // Transfer withdrawal amount
            let token = self.investment_token.read(investment_id);
            token.transfer(investor, withdrawal_amount);

            self
                .emit(
                    InvestmentWithdrawal { investor, amount, fee_paid: amount - withdrawal_amount },
                );
            true
        }


        fn set_lock_period(
            ref self: ComponentState<TContractState>, investment_id: felt252, duration: u256,
        ) {
            // Verify caller is investment manager
            let caller = get_caller_address();
            assert(caller == self.manager.read(investment_id), 'Only manager can set lock');

            // Ensure duration meets minimum requirements
            assert(duration >= self.min_lock_period.read(), 'Lock period too short');

            // Calculate lock end time
            let current_time: u256 = get_block_timestamp().into();
            let lock_end = current_time + duration;

            // Set lock period
            self.lock_periods.write((caller, investment_id), lock_end);

            self.emit(LockPeriodSet { investor: caller, lock_until: lock_end });
        }

        fn get_lock_period_end(
            self: @ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252,
        ) -> u256 {
            self.lock_periods.read((investor, investment_id))
        }

        fn set_investment_cap(
            ref self: ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252,
            cap: u256,
        ) {
            // Verify caller is investment manager
            let caller = get_caller_address();
            assert(caller == self.manager.read(investment_id), 'Only manager can set cap');
            // Set investment cap for specific investor
            self.investment_caps.write((investor, investment_id), cap);
        }

        fn set_min_investment(
            ref self: ComponentState<TContractState>, investment_id: felt252, min_amount: u256,
        ) {
            // Verify caller is investment manager
            let caller = get_caller_address();
            assert(caller == self.manager.read(investment_id), 'Only manager can set min');
            // Set minimum investment amount
            self.min_investments.write(investment_id, min_amount);
        }

        fn get_investment_balance(
            self: @ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252,
        ) -> u256 {
            self.investments.read((investor, investment_id))
        }

        fn get_earned_returns(
            self: @ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252,
        ) -> u256 {
            self._calculate_returns(investor, investment_id)
        }

        fn get_investment_metrics(
            self: @ComponentState<TContractState>, investment_id: felt252,
        ) -> (u256, u32, u256) {
            (
                self.total_invested_amount.read(investment_id),
                self.investor_count.read(investment_id),
                self.annual_return_rates.read(investment_id),
            )
        }

        fn set_annual_return_rate(
            ref self: ComponentState<TContractState>, investment_id: felt252, rate: u256,
        ) {
            assert(get_caller_address() == self.manager.read(investment_id), 'Only manager');
            self.annual_return_rates.write(investment_id, rate);
        }

        fn get_investors_for_asset(
            self: @ComponentState<TContractState>, investment_id: felt252,
        ) -> Array<ContractAddress> {
            // self.investors_per_asset.entry(investment_id).read()

            let mut result = ArrayTrait::new();
            let vec = self.investors_per_asset.entry(investment_id);
            let len = vec.len();
            let mut i = 0;
            loop {
                if i == len {
                    break;
                }
                result.append(vec.at(i).read());
                i += 1;
            };
            result
        }

        fn get_manager(
            self: @ComponentState<TContractState>, investment_id: felt252,
        ) -> ContractAddress {
            self.manager.read(investment_id)
        }
    }

    #[generate_trait]
    pub impl InvestmentInternalFunctions<
        TContractState, +HasComponent<TContractState>,
    > of InvestmentInternalFunctionsTrait<TContractState> {
        fn read_investor_returns(
            self: @ComponentState<TContractState>,
            investment_id: felt252,
            investor: ContractAddress,
        ) -> u256 {
            self._calculate_returns(investor, investment_id)
        }
        fn _is_investment_initialized(
            self: @ComponentState<TContractState>, investment_id: felt252,
        ) -> bool {
            self.initialized_investments.read(investment_id)
        }

        fn _calculate_returns(
            self: @ComponentState<TContractState>,
            investor: ContractAddress,
            investment_id: felt252,
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
            // Returns = (investment * annual_rate * time_invested) / (10000 * seconds_in_year)
            let returns = (investment * annual_rate * time_invested) / (10000 * 31536000);

            returns
        }
    }
}
