// SPDX-License-Identifier: MIT

use starknet::ContractAddress;
use openzeppelin::access::ownable::OwnableComponent;
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use openzeppelin::upgrades::interface::IUpgradeable;
use openzeppelin::upgrades::UpgradeableComponent;

#[starknet::interface]
trait IStaking<TContractState> {
    fn stake(ref self: TContractState, property_id: u256, amount: u256);
    fn withdraw(ref self: TContractState, property_id: u256, amount: u256);
    fn claim_rewards(ref self: TContractState, property_id: u256);
    fn get_staked_balance(self: @TContractState, property_id: u256, account: ContractAddress) -> u256;
    fn get_rewards(self: @TContractState, property_id: u256, account: ContractAddress) -> u256;
    fn set_reward_rate(ref self: TContractState, property_id: u256, rate: u256);
}

#[starknet::contract]
mod StakingContract {
    use super::{IStaking, IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    #[storage]
    struct Storage {
        staking_token: IERC20Dispatcher,
        reward_token: IERC20Dispatcher,
        reward_rates: LegacyMap::<u256, u256>,
        rewards_per_token: LegacyMap::<u256, u256>,
        user_reward_per_token_paid: LegacyMap::<(u256, ContractAddress), u256>,
        rewards: LegacyMap::<(u256, ContractAddress), u256>,
        total_supplies: LegacyMap::<u256, u256>,
        balances: LegacyMap::<(u256, ContractAddress), u256>,
        last_update_times: LegacyMap::<u256, u64>,
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
        property_id: u256,
        user: ContractAddress,
        amount: u256
    }

    #[derive(Drop, starknet::Event)]
    struct Withdrawn {
        property_id: u256,
        user: ContractAddress,
        amount: u256
    }

    #[derive(Drop, starknet::Event)]
    struct RewardsClaimed {
        property_id: u256,
        user: ContractAddress,
        amount: u256
    }

    mod Errors {
        const ZERO_AMOUNT: felt252 = 'Amount must be greater than 0';
        const INSUFFICIENT_BALANCE: felt252 = 'Insufficient balance';
        const TRANSFER_FAILED: felt252 = 'Token transfer failed';
        const INVALID_PROPERTY: felt252 = 'Invalid property ID';
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        staking_token: ContractAddress,
        reward_token: ContractAddress
    ) {
        self.ownable.initializer(owner);
        self.staking_token.write(IERC20Dispatcher { contract_address: staking_token });
        self.reward_token.write(IERC20Dispatcher { contract_address: reward_token });
    }

    #[external(v0)]
    impl Staking of IStaking<ContractState> {
        fn stake(ref self: ContractState, property_id: u256, amount: u256) {
            assert(amount > 0, Errors::ZERO_AMOUNT);
            let caller = get_caller_address();
            
            self._update_reward(property_id, caller);

            let success = self.staking_token.read().transfer_from(
                caller, 
                get_contract_address(), 
                amount
            );
            assert(success, Errors::TRANSFER_FAILED);

            self.total_supplies.write(property_id, self.total_supplies.read(property_id) + amount);
            self.balances.write((property_id, caller), self.balances.read((property_id, caller)) + amount);

            self.emit(Event::Staked(Staked { property_id, user: caller, amount }));
        }

        fn withdraw(ref self: ContractState, property_id: u256, amount: u256) {
            assert(amount > 0, Errors::ZERO_AMOUNT);
            let caller = get_caller_address();
            assert(self.balances.read((property_id, caller)) >= amount, Errors::INSUFFICIENT_BALANCE);

            self._update_reward(property_id, caller);

            self.total_supplies.write(property_id, self.total_supplies.read(property_id) - amount);
            self.balances.write((property_id, caller), self.balances.read((property_id, caller)) - amount);

            let success = self.staking_token.read().transfer(caller, amount);
            assert(success, Errors::TRANSFER_FAILED);

            self.emit(Event::Withdrawn(Withdrawn { property_id, user: caller, amount }));
        }

        fn claim_rewards(ref self: ContractState, property_id: u256) {
            let caller = get_caller_address();
            
            self._update_reward(property_id, caller);

            let reward = self.rewards.read((property_id, caller));
            if reward > 0 {
                self.rewards.write((property_id, caller), 0);
                let success = self.reward_token.read().transfer(caller, reward);
                assert(success, Errors::TRANSFER_FAILED);

                self.emit(Event::RewardsClaimed(RewardsClaimed { 
                    property_id,
                    user: caller, 
                    amount: reward 
                }));
            }
        }

        fn get_staked_balance(self: @ContractState, property_id: u256, account: ContractAddress) -> u256 {
            self.balances.read((property_id, account))
        }

        fn get_rewards(self: @ContractState, property_id: u256, account: ContractAddress) -> u256 {
            let current_reward = self.rewards.read((property_id, account));
            let earned = self._earned(property_id, account);
            current_reward + earned
        }

        fn set_reward_rate(ref self: ContractState, property_id: u256, rate: u256) {
            self.ownable.assert_only_owner();
            self._update_reward(property_id, Zero::zero());
            self.reward_rates.write(property_id, rate);
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _earned(self: @ContractState, property_id: u256, account: ContractAddress) -> u256 {
            let balance = self.balances.read((property_id, account));
            let current_reward_per_token = self._get_reward_per_token(property_id);
            let user_reward_per_token = self.user_reward_per_token_paid.read((property_id, account));
            
            balance * (current_reward_per_token - user_reward_per_token) / 1e18
        }

        fn _get_reward_per_token(self: @ContractState, property_id: u256) -> u256 {
            let total = self.total_supplies.read(property_id);
            if total == 0 {
                return self.rewards_per_token.read(property_id);
            }

            let time_delta = get_block_timestamp() - self.last_update_times.read(property_id);
            let reward_per_token = self.rewards_per_token.read(property_id) + 
                (self.reward_rates.read(property_id) * time_delta.into() * 1e18) / total;
            
            reward_per_token
        }

        fn _update_reward(ref self: ContractState, property_id: u256, account: ContractAddress) {
            self.rewards_per_token.write(property_id, self._get_reward_per_token(property_id));
            self.last_update_times.write(property_id, get_block_timestamp());

            if account.is_non_zero() {
                self.rewards.write((property_id, account), self._earned(property_id, account));
                self.user_reward_per_token_paid.write(
                    (property_id, account), 
                    self.rewards_per_token.read(property_id)
                );
            }
        }
    }
}