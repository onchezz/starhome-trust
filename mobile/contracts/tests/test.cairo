// # Tests for Real Estate Trust Contract

// use super::RealEstateTrust;
// use super::RealEstateTrust::{RealEstateTrustTraitDispatcher, RealEstateTrustTraitDispatcherTrait};
// use core::starknet::syscalls::deploy_syscall;
// use core::starknet::SyscallResultTrait;

// fn setup_contract() -> RealEstateTrustTraitDispatcher {
//     let (address, _) = deploy_syscall(
//         RealEstateTrust::TEST_CLASS_HASH.try_into().unwrap(),
//         0,
//         array![].span(),
//         false,
//     )
//     .unwrap_syscall();
//     RealEstateTrustTraitDispatcher { contract_address: address }
// }

// #[test]
// fn test_constructor() {
//     let contract = setup_contract();
//     assert_eq!(contract.get_balance(), 0);
// }

// #[test]
// fn test_add_stakeholder() {
//     let contract = setup_contract();
//     let stakeholder = ContractAddress::from(1);
//     contract.add_stakeholder(stakeholder);

//     // Assuming the contract exposes a way to get stakeholder data for verification
//     let total_stakeholders = contract.get_total_stakeholders();
//     assert_eq!(total_stakeholders, 1);
// }

// #[test]
// fn test_deposit() {
//     let contract = setup_contract();
//     let amount = 100;
//     contract.deposit(amount);
//     assert_eq!(contract.get_balance(), amount);
// }

// #[test]
// fn test_add_asset() {
//     let contract = setup_contract();
//     let asset_id = 101;
//     let max_investment = 1000;
//     contract.add_asset(asset_id, true, max_investment);

//     // Assuming the contract provides a way to fetch asset details
//     let is_rented = contract.is_asset_rented(asset_id);
//     assert!(is_rented);
// }

// #[test]
// fn test_record_investment() {
//     let contract = setup_contract();
//     let asset_id = 101;
//     let investor = ContractAddress::from(2);
//     let investment_amount = 200;

//     contract.add_asset(asset_id, true, 1000);
//     contract.record_investment(asset_id, investor, investment_amount);

//     // Assuming the contract exposes investment details
//     let investments = contract.get_investments(asset_id);
//     assert_eq!(investments.len(), 1);
//     assert_eq!(investments[0].1, investment_amount);
// }

// #[test]
// fn test_compute_monthly_returns() {
//     let contract = setup_contract();

//     // Add stakeholders
//     let stakeholder1 = ContractAddress::from(1);
//     let stakeholder2 = ContractAddress::from(2);
//     contract.add_stakeholder(stakeholder1);
//     contract.add_stakeholder(stakeholder2);

//     // Deposit funds
//     contract.deposit(500);

//     // Add assets and investments
//     let asset_id = 201;
//     contract.add_asset(asset_id, true, 1000);
//     contract.record_investment(asset_id, stakeholder1, 300);
//     contract.record_investment(asset_id, stakeholder2, 200);

//     // Compute monthly returns
//     contract.compute_monthly_returns();

//     // Validate returns calculation logic (requires contract implementation details)
// }

// #[test]
// fn test_upgrade() {
//     let contract = setup_contract();
//     let new_class_hash = ClassHash::from(42);

//     contract.upgrade(new_class_hash);

//     // Assuming a way to verify the upgraded class hash
//     let current_version = contract.version();
//     assert_eq!(current_version, 1); // Update this as needed for new versions
// }
