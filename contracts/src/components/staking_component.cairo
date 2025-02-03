use starhomes::messages::errors::Errors;

#[starknet::component]
pub mod AssetStakingComponent {
    use starhomes::models::contract_events::{Deposit, Withdrawal, RewardsFinished};
    // use core::starknet::event::EventEmitter;
    use starhomes::interfaces::asset_staking::IStakeAssetTrait;
    use starknet::storage::StoragePathEntry;
    use core::num::traits::Zero;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address};
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };

    #[storage]
    pub struct Storage {
        // Tokens
        pub staking_token: Map::<felt252, IERC20Dispatcher>,
        pub reward_token: Map::<felt252, IERC20Dispatcher>,
        pub owner: Map::<felt252, ContractAddress>,
        pub reward_rate: Map::<felt252, u256>,
        pub duration: Map::<felt252, u256>,
        pub finish_at: Map::<felt252, u256>,
        pub number_of_investors_per_investment: Map::<felt252, u256>,
        pub investors_in_investment: Map::<ContractAddress, (felt252, u256)>,
        // Reward tracking,
        pub current_reward_per_staked_token: Map::<
            ContractAddress, u256,
        >, // Accumulated rewards per staked token
        pub last_updated_at: Map::<ContractAddress, u256>, // Last time rewards were updated
        pub total_distributed_rewards: u256, // Total rewards distributed so far
        // User-specific data
        pub last_user_reward_per_staked_token: Map::<
            ContractAddress, u256,
        >, // Last reward per staked token for each user
        pub unclaimed_rewards: Map::<ContractAddress, u256>, // Unclaimed rewards for each user
        pub balance_of: Map::<ContractAddress, u256>, // Staked balance of each user
        // Property investment tracking
        pub total_investment_per_property: Map::<
            felt252, u256,
        >, // Total investment per property (key: property ID)
        pub user_investment_per_property: Map::<
            (felt252, ContractAddress), u256,
        >, // Investment per user per property (key: (property ID, user address))
        pub total_supply: u256,
    }

    #[event]
    #[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
    pub enum Event {
        Deposit: Deposit,
        Withdrawal: Withdrawal,
        RewardsFinished: RewardsFinished,
    }

    #[embeddable_as(StakeAsset)]
    pub impl StakeAssetImpl<
        TContractState, +HasComponent<TContractState>,
    > of IStakeAssetTrait<ComponentState<TContractState>> {
        fn initialize_asset_staking_token(
            ref self: ComponentState<TContractState>,
            token_address: ContractAddress,
            property_id: felt252,
        ) {
            let _staking_token: IERC20Dispatcher = self.staking_token.entry(property_id).read();

            self._initialize_property_staking_token(token_address, property_id);
        }
        fn stake(
            ref self: ComponentState<TContractState>, property_id: felt252, amount: u256,
        ) -> bool {
            assert(amount > 0, super::Errors::NULL_AMOUNT);

            let user = get_caller_address();
            self._update_rewards(user, property_id);

            self.balance_of.write(user, self.balance_of.read(user) + amount);

            self.total_supply.write(self.total_supply.read() + amount);
            self
                .staking_token
                .entry(property_id)
                .read()
                .transfer_from(user, get_contract_address(), amount);
            self.add_number_of_investor_per_investment_made(property_id);

            self.investors_in_investment.write(user, (property_id, amount));
            self.emit(Deposit { user, amount });

            true
        }

        fn withdraw(
            ref self: ComponentState<TContractState>, property_id: felt252, amount: u256,
        ) -> bool {
            assert(amount > 0, super::Errors::NULL_AMOUNT);

            let user = get_caller_address();

            assert(
                self.staking_token.entry(property_id).read().balance_of(user) >= amount,
                super::Errors::NOT_ENOUGH_BALANCE,
            );

            self._update_rewards(user, property_id);

            self.balance_of.write(user, self.balance_of.read(user) - amount);
            self.total_supply.write(self.total_supply.read() - amount);
            self.staking_token.entry(property_id).read().transfer(user, amount);
            self.reduce_number_of_investor_per_investment_made(property_id);

            self.emit(Withdrawal { user, amount });
            true
        }
        fn get_rewards(
            self: @ComponentState<TContractState>, account: ContractAddress, property_id: felt252,
        ) -> u256 {
            self.unclaimed_rewards.read(account) + self._compute_new_rewards(account, property_id)
        }
        // fn change_staking_tokens(
        //     ref self: ComponentState<TContractState>,
        //     propertyId: felt252,
        //     staking_token_address: ContractAddress,
        //     reward_token_address: ContractAddress,
        // ) -> felt252 {
        //     self
        //         .staking_token
        //         .entry(propertyId)
        //         .write(IERC20Dispatcher { contract_address: staking_token_address });
        //     self
        //         .reward_token
        //         .entry(propertyId)
        //         .write(IERC20Dispatcher { contract_address: reward_token_address });

        //     'TOKENS CHANGED'
        // }
        fn set_reward_duration(
            ref self: ComponentState<TContractState>, property_id: felt252, duration: u256,
        ) {
            self._only_owner(property_id);

            assert(duration > 0, super::Errors::NULL_DURATION);

            // can only set duration if the previous duration has already finished
            assert(
                self.finish_at.entry(property_id).read() < get_block_timestamp().into(),
                super::Errors::UNFINISHED_DURATION,
            );

            self.duration.write(property_id,duration);
        }

        fn set_reward_amount(
            ref self: ComponentState<TContractState>, property_id: felt252, amount: u256,
        ) {
            self._only_owner(property_id);
            self._update_rewards(Zero::zero());

            assert(amount > 0, super::Errors::NULL_REWARDS);
            assert(self.duration.entry(property_id).read() > 0, super::Errors::NULL_DURATION);

            let block_timestamp: u256 = get_block_timestamp().into();

            let rate = if self.finish_at.entry(property_id).read() < block_timestamp {
                amount / self.duration.entry(property_id).read()
            } else {
                let remaining_rewards = self.reward_rate.read()
                    * (self.finish_at.entry(property_id).read() - block_timestamp);
                (remaining_rewards + amount) / self.duration.entry(property_id).read()
            };

            assert(
                self.reward_token.entry(property_id).read().balance_of(get_contract_address()) >= rate
                    * self.duration.entry(property_id).read(),
                super::Errors::NOT_ENOUGH_REWARDS,
            );

            self.reward_rate.entry(property_id).write(rate);

            // even if the previous reward duration has not finished, we reset the finish_at
            // variable
            self.finish_at.entry(property_id).write(block_timestamp + self.duration.read());
            self.last_updated_at.entry(property_id).write(block_timestamp);

            // reset total distributed rewards
            self.total_distributed_rewards.write(0);
        }

        fn claim_rewards(ref self: ComponentState<TContractState>, property_id: felt252) {
            let user = get_caller_address();
            self._update_rewards(user, property_id);

            let rewards = self.unclaimed_rewards.read(user);

            if rewards > 0 {
                self.unclaimed_rewards.write(user, 0);
                self.reward_token.entry(property_id).read().transfer(user, rewards);
            }
        }
    }

    #[generate_trait]
    pub impl StakingPrivateFunctions<
        TContractState, +HasComponent<TContractState>,
    > of StakingPrivateFunctionsTrait<TContractState> {
        // call this function every time a user (including owner) performs a state-modifying action
        fn _initialize_property_staking_token(
            ref self: ComponentState<TContractState>,
            token_address: ContractAddress,
            property_id: felt252,
        ) {
            self.number_of_investors_per_investment.write(property_id, 0);
            self
                .staking_token
                .write(property_id, IERC20Dispatcher { contract_address: token_address })
        }


        fn get_property_token(
            self: @ComponentState<TContractState>, property_id: felt252,
        ) -> ContractAddress {
            let token = self.staking_token.entry(property_id).read();
            token.contract_address
        }
        fn get_number_of_investor_per_investment(
            self: @ComponentState<TContractState>, property_id: felt252,
        ) -> u256 {
            let investors = self.number_of_investors_per_investment.entry(property_id).read();
            investors
        }
        fn add_number_of_investor_per_investment_made(
            ref self: ComponentState<TContractState>, property_id: felt252,
        ) {
            let investors = self.number_of_investors_per_investment.entry(property_id).read();
            self.number_of_investors_per_investment.entry(property_id).write(investors + 1);
        }
        fn reduce_number_of_investor_per_investment_made(
            ref self: ComponentState<TContractState>, property_id: felt252,
        ) {
            let investors = self.number_of_investors_per_investment.entry(property_id).read();
            self.number_of_investors_per_investment.entry(property_id).write(investors - 1);
        }


        fn _update_rewards(
            ref self: ComponentState<TContractState>,
            account: ContractAddress,
            property_id: felt252,
        ) {
            self
                .current_reward_per_staked_token
                .write(account, self._compute_current_reward_per_staked_token(account));

            self.last_updated_at.write(account, self.last_time_applicable(property_id));

            if account.is_non_zero() {
                self._distribute_user_rewards(account, property_id);

                self
                    .last_user_reward_per_staked_token
                    .write(account, self.current_reward_per_staked_token.read(account));

                self._send_rewards_finished_event(account);
            }
        }
        fn _distribute_user_rewards(
            ref self: ComponentState<TContractState>,
            account: ContractAddress,
            property_id: felt252,
        ) {
            // compute earned rewards since last update for the user `account`
            let user_rewards = self.get_rewards(account, property_id);
            self.unclaimed_rewards.write(account, user_rewards);

            // track amount of total rewards distributed
            self
                .total_distributed_rewards
                .write(self.total_distributed_rewards.read() + user_rewards);
        }

        fn _send_rewards_finished_event(
            ref self: ComponentState<TContractState>, account: ContractAddress,
        ) {
            // check whether we should send a RewardsFinished event
            if self.last_updated_at.entry(property_id).read(account) == self.finish_at.entry(property_id).read(account) {
                let total_rewards = self.reward_rate.read(account) * self.duration.read(account);

                if total_rewards != 0 && self.total_distributed_rewards.read() == total_rewards {
                    // owner should set up NEW rewards into the contract
                    self.emit(RewardsFinished { msg: 'Rewards all distributed' });
                } else {
                    // owner should set up rewards into the contract (or add duration by setting up
                    // rewards)
                    self.emit(RewardsFinished { msg: 'Rewards not active yet' });
                }
            }
        }

        fn _compute_current_reward_per_staked_token(
            self: @ComponentState<TContractState>, account: ContractAddress,
        ) -> u256 {
            if self.total_supply.read() == 0 {
                self.current_reward_per_staked_token.read(account)
            } else {
                self.current_reward_per_staked_token.read(account)
                    + self.reward_rate.read(account)
                        * (self.last_time_applicable(account) - self.last_updated_at.read(account))
                        / self.total_supply.read()
            }
        }

        fn _compute_new_rewards(
            self: @ComponentState<TContractState>, account: ContractAddress, property_id: felt252,
        ) -> u256 {
            self.balance_of.read(account)
                * (self.current_reward_per_staked_token.read(account)
                    - self.last_user_reward_per_staked_token.read(account))
        }

        #[inline(always)]
        fn last_time_applicable(
            self: @ComponentState<TContractState>,proertyId:felt252,
        ) -> u256 {
            Self::min(self.finish_at.read(account), get_block_timestamp().into())
        }

        #[inline(always)]
        fn min(x: u256, y: u256) -> u256 {
            if (x <= y) {
                x
            } else {
                y
            }
        }

        fn _only_owner(self: @ComponentState<TContractState>, property_id: felt252) {
            let caller = get_caller_address();
            assert(caller == self.owner.entry(property_id).read(), super::Errors::NOT_OWNER);
        }
    }
}
