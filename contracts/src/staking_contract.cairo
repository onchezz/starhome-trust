// SPDX-License-Identifier: MIT

use starknet::ContractAddress;
use openzeppelin::access::ownable::OwnableComponent;
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use openzeppelin::upgrades::interface::IUpgradeable;
use openzeppelin::upgrades::UpgradeableComponent;

#[starknet::interface]
trait IStaking<TContractState> {
    fn stake(ref self: TContractState, amount: u256);
    fn withdraw(ref self: TContractState, amount: u256);
    fn claim_rewards(ref self: TContractState);
    fn get_staked_balance(self: @TContractState, account: ContractAddress) -> u256;
    fn get_rewards(self: @TContractState, account: ContractAddress) -> u256;
    fn set_reward_rate(ref self: TContractState, rate: u256);
}

#[starknet::contract]
mod StakingContract {
    use super::{IStaking, IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address, ClassHash};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    #[storage]
    struct Storage {
        staking_token: IERC20Dispatcher,
        reward_token: IERC20Dispatcher,
        reward_rate: u256,
        rewards_per_token: u256,
        user_reward_per_token_paid: LegacyMap::<ContractAddress, u256>,
        rewards: LegacyMap::<ContractAddress, u256>,
        total_supply: u256,
        balances: LegacyMap::<ContractAddress, u256>,
        last_update_time: u64,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Staked: Staked,
        Withdrawn: Withdrawn,
        RewardsClaimed: RewardsClaimed,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event
    }

    #[derive(Drop, starknet::Event)]
    struct Staked {
        user: ContractAddress,
        amount: u256
    }

    #[derive(Drop, starknet::Event)]
    struct Withdrawn {
        user: ContractAddress,
        amount: u256
    }

    #[derive(Drop, starknet::Event)]
    struct RewardsClaimed {
        user: ContractAddress,
        amount: u256
    }

    mod Errors {
        const ZERO_AMOUNT: felt252 = 'Amount must be greater than 0';
        const INSUFFICIENT_BALANCE: felt252 = 'Insufficient balance';
        const TRANSFER_FAILED: felt252 = 'Token transfer failed';
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        staking_token: ContractAddress,
        reward_token: ContractAddress,
        initial_reward_rate: u256
    ) {
        self.ownable.initializer(owner);
        self.staking_token.write(IERC20Dispatcher { contract_address: staking_token });
        self.reward_token.write(IERC20Dispatcher { contract_address: reward_token });
        self.reward_rate.write(initial_reward_rate);
        self.last_update_time.write(get_block_timestamp());
    }

    #[external(v0)]
    impl Staking of IStaking<ContractState> {
        fn stake(ref self: ContractState, amount: u256) {
            assert(amount > 0, Errors::ZERO_AMOUNT);
            let caller = get_caller_address();
            
            // Update rewards
            self._update_reward(caller);

            // Transfer tokens
            let success = self.staking_token.read().transfer_from(
                caller, 
                get_contract_address(), 
                amount
            );
            assert(success, Errors::TRANSFER_FAILED);

            // Update state
            self.total_supply.write(self.total_supply.read() + amount);
            self.balances.write(caller, self.balances.read(caller) + amount);

            // Emit event
            self.emit(Event::Staked(Staked { user: caller, amount }));
        }

        fn withdraw(ref self: ContractState, amount: u256) {
            assert(amount > 0, Errors::ZERO_AMOUNT);
            let caller = get_caller_address();
            assert(self.balances.read(caller) >= amount, Errors::INSUFFICIENT_BALANCE);

            // Update rewards
            self._update_reward(caller);

            // Update state
            self.total_supply.write(self.total_supply.read() - amount);
            self.balances.write(caller, self.balances.read(caller) - amount);

            // Transfer tokens
            let success = self.staking_token.read().transfer(caller, amount);
            assert(success, Errors::TRANSFER_FAILED);

            // Emit event
            self.emit(Event::Withdrawn(Withdrawn { user: caller, amount }));
        }

        fn claim_rewards(ref self: ContractState) {
            let caller = get_caller_address();
            
            // Update rewards
            self._update_reward(caller);

            // Get rewards
            let reward = self.rewards.read(caller);
            if reward > 0 {
                // Reset rewards
                self.rewards.write(caller, 0);

                // Transfer rewards
                let success = self.reward_token.read().transfer(caller, reward);
                assert(success, Errors::TRANSFER_FAILED);

                // Emit event
                self.emit(Event::RewardsClaimed(RewardsClaimed { user: caller, amount: reward }));
            }
        }

        fn get_staked_balance(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.read(account)
        }

        fn get_rewards(self: @ContractState, account: ContractAddress) -> u256 {
            let current_reward = self.rewards.read(account);
            let earned = self._earned(account);
            current_reward + earned
        }

        fn set_reward_rate(ref self: ContractState, rate: u256) {
            self.ownable.assert_only_owner();
            self._update_reward(Zero::zero());
            self.reward_rate.write(rate);
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _earned(self: @ContractState, account: ContractAddress) -> u256 {
            let balance = self.balances.read(account);
            let current_reward_per_token = self._get_reward_per_token();
            let user_reward_per_token = self.user_reward_per_token_paid.read(account);
            
            balance * (current_reward_per_token - user_reward_per_token) / 1e18
        }

        fn _get_reward_per_token(self: @ContractState) -> u256 {
            let total = self.total_supply.read();
            if total == 0 {
                return self.rewards_per_token.read();
            }

            let time_delta = get_block_timestamp() - self.last_update_time.read();
            let reward_per_token = self.rewards_per_token.read() + 
                (self.reward_rate.read() * time_delta.into() * 1e18) / total;
            
            reward_per_token
        }

        fn _update_reward(ref self: ContractState, account: ContractAddress) {
            self.rewards_per_token.write(self._get_reward_per_token());
            self.last_update_time.write(get_block_timestamp());

            if account.is_non_zero() {
                self.rewards.write(account, self._earned(account));
                self.user_reward_per_token_paid.write(account, self.rewards_per_token.read());
            }
        }
    }
}