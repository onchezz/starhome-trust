// /// Real Estate Trust Contract
// use starknet::ContractAddress;
// use starknet::class_hash::ClassHash;

// use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, Map};
// // use starknet::class_hash::ClassHash;
// // use starknet::ContractAddress;
// #[starknet::interface]
// pub trait IRealEstateTrust<TContractState> {
//     /// Add a stakeholder
//     fn add_stakeholder(ref self: TContractState, stakeholder: ContractAddress);
//     /// Deposit funds
//     fn deposit(ref self: TContractState, amount: felt252);
//     /// Add an asset
//     fn add_asset(
//         ref self: TContractState, asset_id: felt252, is_rented: bool, max_investment: felt252,
//     );
//     /// Record an investment
//     fn record_investment(
//         ref self: TContractState, asset_id: felt252, investor: ContractAddress, amount: felt252,
//     );
//     /// Refund an investment
//     fn refund_pledge(ref self: TContractState, asset_id: felt252, investor: ContractAddress);
//     /// Compute monthly returns
//     fn compute_monthly_returns(ref self: TContractState);
//     /// Upgrade the contract
//     fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
//     /// Get contract version
//     fn version(self: @TContractState) -> felt252;
// }

// #[starknet::contract]
// mod RealEstateTrust {
//     use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, Map};
//     /// Real Estate Trust Contract
//     use starknet::ContractAddress;
//     use starknet::class_hash::ClassHash;

//     #[storage]
//     struct Storage {
//         fund_balance: felt252,
//         total_stakeholders: felt252,
//         stakeholders: Map<felt252, (ContractAddress, felt252)>, // Stakeholder address and
//         deposits assets: Map<
//             felt252, (bool, felt252, felt252),
//         >, // Asset ID to (is_rented, rental_income, max_investment)
//         investments: Map<
//             felt252, Map<ContractAddress, felt252>,
//         > // Asset ID to (ContractAddress -> amount)
//     }

//     // #[storage]
//     // struct Storage {
//     //     balance: felt252,
//     // }

//     #[abi(embed_v0)]
//     impl RealEstateTrustImpl of super::IRealEstateTrust<ContractState> {
//         fn add_stakeholder(
//             ref self: ContractState, stakeholder: ContractAddress,
//         ) {

//         }
//         fn deposit(ref self: ContractState, amount: felt252){}

//         fn add_asset(
//             ref self: ContractState, asset_id: felt252, is_rented: bool, max_investment: felt252,
//         ){}

//         fn record_investment(
//             ref self: ContractState, asset_id: felt252, investor: ContractAddress, amount:
//             felt252,
//         ){}

//         fn refund_pledge(
//             ref self: ContractState, asset_id: felt252, investor: ContractAddress,
//         ){}

//         fn compute_monthly_returns(ref self: ContractState){}

//         fn upgrade(ref self: ContractState, new_class_hash: ClassHash){}

//         fn version(self: @ContractState) -> felt252{
//             return 1;
//         }

//     }
// }

// #[starknet::contract]
// mod RealEstateTrust {
//     use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, Map};
//     use starknet::class_hash::ClassHash;
//     use starknet::ContractAddress;
//     // use starknet::syscalls::{get_caller_address};

//     /// Contract storage
//     ///

//     // /// Internal Functions Trait
//     // #[generate_trait]
//     // impl InternalFunctions of InternalFunctionsTrait {
//     //     /// Internal function to update stakeholder deposit
//     //     fn update_stakeholder(ref self: TContractState, stakeholder: ContractAddress, amount:
//     // felt252) {
//     //         for i in 0..self.total_stakeholders.read() {
//     //             let (addr, stake) = self.stakeholders.read(i);
//     //             if addr == stakeholder {
//     //                 self.stakeholders.write(i, (addr, stake + amount));
//     //                 break;
//     //             }
//     //         }
//     //     }

//     //     /// Internal function to calculate total returns for a stakeholder
//     //     fn calculate_returns(self: @TContractState, deposit: felt252) -> felt252 {
//     //         let mut total_return = 0;

//     //         for asset_id in self.assets.keys() {
//     //             let (is_rented, rental_income, _) = self.assets.read(asset_id);
//     //             if is_rented {
//     //                 total_return += (deposit * rental_income) / self.fund_balance.read();
//     //             }
//     //         }

//     //         total_return
//     //     }
//     // }

//     /// Constructor to initialize the contract
//     #[constructor]
//     fn constructor(ref self: TContractState) {
//         self.fund_balance.write(0);
//         self.total_stakeholders.write(0);
//     }

//     /// Add a stakeholder
//     #[external(v0)]
//     fn add_stakeholder(ref self: TContractState, stakeholder: ContractAddress) {
//         let total = self.total_stakeholders.read();
//         self.stakeholders.write(total, (stakeholder, 0));
//         self.total_stakeholders.write(total + 1);
//     }

//     /// Deposit funds
//     #[external(v0)]
//     fn deposit(ref self: TContractState, amount: felt252) {
//         let caller = get_caller_address();
//         let mut balance = self.fund_balance.read();
//         balance += amount;
//         self.fund_balance.write(balance);

//         self.update_stakeholder(caller, amount);
//     }

//     /// Add an asset
//     #[external(v0)]
//     fn add_asset(
//         ref self: ContractState, asset_id: felt252, is_rented: bool, max_investment: felt252,
//     ) {
//         self.assets.write(asset_id, (is_rented, 0, max_investment));
//     }

//     /// Record an investment
//     #[external(v0)]
//     fn record_investment(
//         ref self: ContractState, asset_id: felt252, investor: ContractAddress, amount: felt252,
//     ) {
//         let (_, _, max_investment) = self.assets.read(asset_id);
//         let mut investments = self.investments.read(asset_id).unwrap_or_default();
//         let current_investment = investments.read(investor).unwrap_or_default();

//         assert!(current_investment + amount <= max_investment, "Exceeds max investment");

//         investments.write(investor, current_investment + amount);
//         self.investments.write(asset_id, investments);
//     }

//     /// Refund an investment
//     #[external(v0)]
//     fn refund_pledge(ref self: ContractState, asset_id: felt252, investor: ContractAddress) {
//         let mut investments = self.investments.read(asset_id).unwrap_or_default();
//         let refund_amount = investments.read(investor).unwrap_or_default();

//         assert!(refund_amount > 0, "No investment to refund");

//         investments.write(investor, 0);
//         self.investments.write(asset_id, investments);
//     }

//     /// Compute monthly returns
//     #[external(v0)]
//     fn compute_monthly_returns(ref self: ContractState) {
//         for i in 0..self.total_stakeholders.read() {
//             let (stakeholder, deposit) = self.stakeholders.read(i);
//             let total_return = self.calculate_returns(deposit);
//             // Placeholder for distributing returns (actual transfer logic needed)
//         }
//     }

//     /// Upgrade the contract
//     #[external(v0)]
//     fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
//         assert!(new_class_hash != ClassHash::default(), "Invalid class hash");
//         starknet::syscalls::replace_class_syscall(new_class_hash).unwrap();
//     }

//     /// Get contract version
//     #[view(v0)]
//     fn version(self: @TContractState) -> felt252 {
//         1
//     }
// }


