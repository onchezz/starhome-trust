/// Real Estate Trust Fund Contract
use starknet::class_hash::ClassHash;
use starknet::ContractAddress;
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
#[starknet::interface]
trait RealEstateTrustInterface<ContractState> {
    /// Add a stakeholder
    fn add_stakeholder(ref self: ContractState, stakeholder: ContractAddress);
    /// Deposit funds
    fn deposit(ref self: ContractState, amount: u64);
    /// Add an asset
    fn add_asset(
        ref self: ContractState, asset_id: felt252, is_rented: bool, max_investment: felt252,
    );
    /// Record an investment
    fn record_investment(
        ref self: ContractState, asset_id: felt252, investor: ContractAddress, amount: felt252,
    );
    /// Refund an investment
    fn refund_investment(ref self: ContractState, asset_id: felt252, investor: ContractAddress);
    /// Compute monthly returns
    fn compute_returns(ref self: ContractState);
    /// Upgrade the contract
    fn upgrade(ref self: ContractState, new_class_hash: ClassHash);
    /// Get contract version
    fn version(self: @ContractState) -> felt252;
}

#[starknet::contract]
mod RealEstateTrustFund {
   

    use starknet::class_hash::ClassHash;
    use core::num::traits::Zero;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address};

    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,StoragePathEntry
    };


    /// Contract storage
    #[storage]
    struct Storage {
        owner: ContractAddress, // Owner of the contract
        total_fund_balance: u64, // Total fund balance
        total_stakeholders: u64, // Total stakeholders count
        stakeholders: Map<ContractAddress, u64>, // Stakeholder deposits
        assets: Map<
            felt252, (bool, felt252, felt252),
        >, // Asset ID to (is_rented, rental_income, max_investment)
        investments: Map<
            felt252, Map<ContractAddress, felt252>,
        >, // Asset ID to (investor -> amount)
        returns: Map<ContractAddress, felt252> // Returns per stakeholder
    }

    #[abi(embed_v0)]
    impl RealEstateTrustFundImpl of super::RealEstateTrustInterface<ContractState> {
        /// Add a stakeholder
        fn add_stakeholder(ref self: ContractState, stakeholder: ContractAddress) {
            self.ensure_owner();
            // assert!(self.stakeholders.read(stakeholder).is_none(), "Stakeholder already exists");
            let mut stake_holder_num = self.total_stakeholders.read();
            stake_holder_num += 1;
            self.stakeholders.write(stakeholder, stake_holder_num);
        }

        /// Deposit funds
        fn deposit(ref self: ContractState, amount: u64) {
            let caller = get_caller_address();
            let mut balance = self.stakeholders.entry(caller).read();
            balance += amount;
            let mut stakers = self.stakeholders;
            stakers.entry(caller).write(balance);
            // stakers.write(caller, balance);
            self.total_fund_balance.write(self.total_fund_balance.read() + amount);
        }


        /// Add an asset
        fn add_asset(
            ref self: ContractState, asset_id: felt252, is_rented: bool, max_investment: felt252,
        ) {
            self.ensure_owner();
            // assert!(self.assets.entry(asset_id).read() == asset_id, "Asset already exists");

            self.assets.write(asset_id, (is_rented, 0, max_investment));
        }
       

        /// Record an investment
        fn record_investment(
            ref self: ContractState, asset_id: felt252, investor: ContractAddress, amount: felt252,
        ) {
            let asset = self.assets.entry(asset_id).read();
            let mut investments = self.investments.entry(asset_id);
            let current_investment = investments.entry(investor).read();

            // assert!(current_investment + amount <= asset.2, "Exceeds max investment");

            investments.write(investor, current_investment + amount);
            // self.assets.entry(asset_id).write( (asset., asset.1, asset.2));
        }

        /// Refund an investment
        fn refund_investment(
            ref self: ContractState, asset_id: felt252, investor: ContractAddress,
        ) {
            let mut investments = self.investments.entry(asset_id);
            let refund_amount = investments.entry(investor).read();

            // assert!(refund_amount > 0, "No investment to refund");

            investments.write(investor, 0);
        }

        /// Compute monthly returns
        fn compute_returns(
            ref self: ContractState,
        ) { 
            // for stakeholder in self.stakeholders.keys() {
        //     let deposit = self.stakeholders.read(stakeholder).unwrap_or(0);
        //     let mut total_return = 0;

        //     for asset_id in self.assets.keys() {
        //         let asset = self.assets.read(asset_id).unwrap();
        //         if asset.0 {
        //             total_return += (deposit * asset.1) / self.total_fund_balance;
        //         }
        //     }

        //     self.returns.write(stakeholder, total_return);
        // }
        }

        /// Upgrade the contract
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ensure_owner();
            // assert!(new_class_hash != ClassHash::default(), "Invalid class hash");
            starknet::syscalls::replace_class_syscall(new_class_hash).unwrap();
        }

        /// Get contract version
        fn version(self: @ContractState) -> felt252 {
            1
        }
    }

    #[generate_trait]
    impl PrivateFunctions of PrivateFunctionsTrait {
        fn ensure_owner(self: @ContractState) {
            let caller = get_caller_address();
            assert!(caller == self.owner.read(), "Caller is not the owner");
        }
    }
}


//