pub mod models {
    use starknet::ContractAddress;
    use starknet::class_hash::ClassHash;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher};

    // use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[derive(Copy, Drop, starknet::Event)]
    pub struct PropertyListed {
        pub property_id: u256,
        pub owner: ContractAddress,
        pub price: u256,
        pub payment_token: IERC20Dispatcher,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
    pub struct PropertySold {
        pub property_id: u256,
        pub old_owner: ContractAddress,
        pub new_owner: ContractAddress,
        pub price: u256,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
    pub struct InvestmentMade {
        pub property_id: u256,
        pub investor: ContractAddress,
        pub amount: u256,
        // pub shares: u128,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
    pub struct Upgraded {
        pub class_hash: ClassHash,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    pub struct Property {
        pub id: u256,
        pub owner: ContractAddress,
        pub price: u256,
        pub payment_token: IERC20Dispatcher,
        pub total_shares: u256,
        pub available_shares: u256,
        pub is_active: bool,
    }
    #[derive(Copy, Drop, Serde, starknet::Store)]
    pub struct TrustInvestment {
        pub id: u256,
        pub owner: ContractAddress,
        pub price: u256,
        pub payment_token: IERC20Dispatcher,
        pub total_shares: u256,
        pub available_shares: u256,
        pub roi: u64,
        pub is_active: bool,
    }


    #[derive(Copy, Drop, Serde, starknet::Store)]
    pub struct Investment {
        pub investor: ContractAddress,
        pub shares: u256,
        pub timestamp: u64,
    }
}
// #[derive(Drop, starknet::Event)]
// struct PropertyListed {
//     property_id: u256,
//     owner: ContractAddress,
//     price: u256,
//     payment_token: ContractAddress,
//     timestamp: u64,
// }

// #[derive(Drop, starknet::Event)]
// struct PropertySold {
//     property_id: u256,
//     old_owner: ContractAddress,
//     new_owner: ContractAddress,
//     price: u256,
//     timestamp: u64,
// }

// #[derive(Drop, starknet::Event)]
// struct InvestmentMade {
//     property_id: u256,
//     investor: ContractAddress,
//     amount: u256,
//     shares: u256,
//     timestamp: u64,
// }

// #[derive(Drop, starknet::Event)]
// struct Upgraded {
//     class_hash: ClassHash,
// }

// #[derive(Copy, Drop, Serde, starknet::Store)]
// struct Property {
//     id: u256,
//     owner: ContractAddress,
//     price: u256,
//     payment_token: ContractAddress,
//     total_shares: u256,
//     available_shares: u256,
//     is_active: bool,
// }

// #[derive(Copy, Drop, Serde, starknet::Store)]
// struct Investment {
//     investor: ContractAddress,
//     shares: u256,
//     timestamp: u64,
// }


