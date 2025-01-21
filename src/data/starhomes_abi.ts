export const ABI = [
  {
    "type": "impl",
    "name": "StarhomesContractImpl",
    "interface_name": "starhomes::interface::IStarhomesContract"
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::model::models::Location",
    "members": [
      {
        "name": "address",
        "type": "core::felt252"
      },
      {
        "name": "city",
        "type": "core::felt252"
      },
      {
        "name": "state",
        "type": "core::felt252"
      },
      {
        "name": "country",
        "type": "core::felt252"
      },
      {
        "name": "latitude",
        "type": "core::felt252"
      },
      {
        "name": "longitude",
        "type": "core::felt252"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::model::models::Agent",
    "members": [
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "phone",
        "type": "core::felt252"
      },
      {
        "name": "email",
        "type": "core::felt252"
      },
      {
        "name": "profile_image",
        "type": "core::felt252"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::model::models::Amenities",
    "members": [
      {
        "name": "has_garden",
        "type": "core::bool"
      },
      {
        "name": "has_swimming_pool",
        "type": "core::bool"
      },
      {
        "name": "pet_friendly",
        "type": "core::bool"
      },
      {
        "name": "wheelchair_accessible",
        "type": "core::bool"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::model::models::Property",
    "members": [
      {
        "name": "id",
        "type": "core::felt252"
      },
      {
        "name": "isInvestment",
        "type": "core::bool"
      },
      {
        "name": "title",
        "type": "core::felt252"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "location",
        "type": "starhomes::model::models::Location"
      },
      {
        "name": "price",
        "type": "core::integer::u256"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "asking_price",
        "type": "core::integer::u256"
      },
      {
        "name": "currency",
        "type": "core::felt252"
      },
      {
        "name": "area",
        "type": "core::integer::u256"
      },
      {
        "name": "bedrooms",
        "type": "core::integer::u256"
      },
      {
        "name": "bathrooms",
        "type": "core::integer::u256"
      },
      {
        "name": "parking_spaces",
        "type": "core::integer::u256"
      },
      {
        "name": "property_type",
        "type": "core::felt252"
      },
      {
        "name": "status",
        "type": "core::felt252"
      },
      {
        "name": "interested_clients",
        "type": "core::integer::u256"
      },
      {
        "name": "annual_growth_rate",
        "type": "core::integer::u256"
      },
      {
        "name": "features_id",
        "type": "core::felt252"
      },
      {
        "name": "images_id",
        "type": "core::felt252"
      },
      {
        "name": "video_tour",
        "type": "core::felt252"
      },
      {
        "name": "agent",
        "type": "starhomes::model::models::Agent"
      },
      {
        "name": "date_listed",
        "type": "core::felt252"
      },
      {
        "name": "amenities",
        "type": "starhomes::model::models::Amenities"
      },
      {
        "name": "payment_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "type": "struct",
    "name": "openzeppelin_token::erc20::interface::IERC20Dispatcher",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::model::models::TrustAssetInvestment",
    "members": [
      {
        "name": "id",
        "type": "core::felt252"
      },
      {
        "name": "property_id",
        "type": "core::felt252"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "price",
        "type": "core::integer::u256"
      },
      {
        "name": "payment_token",
        "type": "openzeppelin_token::erc20::interface::IERC20Dispatcher"
      },
      {
        "name": "total_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "available_staking_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "is_active",
        "type": "core::bool"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::model::models::Investor",
    "members": [
      {
        "name": "investor_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "names",
        "type": "core::felt252"
      },
      {
        "name": "investor_id",
        "type": "core::felt252"
      },
      {
        "name": "Investor_id",
        "type": "core::felt252"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "type": "interface",
    "name": "starhomes::interface::IStarhomesContract",
    "items": [
      {
        "type": "function",
        "name": "list_property_for_sale",
        "inputs": [
          {
            "name": "property",
            "type": "starhomes::model::models::Property"
          },
          {
            "name": "token_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "list_property_for_investment",
        "inputs": [
          {
            "name": "price",
            "type": "core::integer::u256"
          },
          {
            "name": "total_shares",
            "type": "core::integer::u256"
          },
          {
            "name": "payment_token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_properties",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::model::models::Property>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "create_investment_property",
        "inputs": [
          {
            "name": "investment_id",
            "type": "core::felt252"
          },
          {
            "name": "investor_id",
            "type": "core::felt252"
          },
          {
            "name": "property_id",
            "type": "core::felt252"
          },
          {
            "name": "investment_token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "invest_in_property",
        "inputs": [
          {
            "name": "investment_id",
            "type": "core::felt252"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_property",
        "inputs": [
          {
            "name": "property_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "starhomes::model::models::Property"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_investment",
        "inputs": [
          {
            "name": "investment_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "starhomes::model::models::TrustAssetInvestment"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_investors",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::model::models::Investor>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_investor",
        "inputs": [],
        "outputs": [
          {
            "type": "starhomes::model::models::Investor"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "register_investor",
        "inputs": [
          {
            "name": "investor",
            "type": "starhomes::model::models::Investor"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "edit_investor",
        "inputs": [
          {
            "name": "investor",
            "type": "starhomes::model::models::Investor"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "version",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "UpgradeableImpl",
    "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
  },
  {
    "type": "interface",
    "name": "openzeppelin_upgrades::interface::IUpgradeable",
    "items": [
      {
        "type": "function",
        "name": "upgrade",
        "inputs": [
          {
            "name": "new_class_hash",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "impl",
    "name": "OwnableMixinImpl",
    "interface_name": "openzeppelin_access::ownable::interface::OwnableABI"
  },
  {
    "type": "interface",
    "name": "openzeppelin_access::ownable::interface::OwnableABI",
    "items": [
      {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transfer_ownership",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "renounce_ownership",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "transferOwnership",
        "inputs": [
          {
            "name": "newOwner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "renounceOwnership",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::model::models::PropertyListed",
    "kind": "struct",
    "members": [
      {
        "name": "property_id",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "price",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "payment_token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::model::models::PropertySold",
    "kind": "struct",
    "members": [
      {
        "name": "property_id",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "old_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "price",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::model::models::InvestmentMade",
    "kind": "struct",
    "members": [
      {
        "name": "property_id",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "investor",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        "kind": "nested"
      },
      {
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "kind": "struct",
    "members": [
      {
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::model::models::Deposit",
    "kind": "struct",
    "members": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::model::models::Withdrawal",
    "kind": "struct",
    "members": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::model::models::RewardsFinished",
    "kind": "struct",
    "members": [
      {
        "name": "msg",
        "type": "core::felt252",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::staking_component::AssetStakingComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Deposit",
        "type": "starhomes::model::models::Deposit",
        "kind": "nested"
      },
      {
        "name": "Withdrawal",
        "type": "starhomes::model::models::Withdrawal",
        "kind": "nested"
      },
      {
        "name": "RewardsFinished",
        "type": "starhomes::model::models::RewardsFinished",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::starhomes::StarhomesContract::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "PropertyListed",
        "type": "starhomes::model::models::PropertyListed",
        "kind": "nested"
      },
      {
        "name": "PropertySold",
        "type": "starhomes::model::models::PropertySold",
        "kind": "nested"
      },
      {
        "name": "InvestmentMade",
        "type": "starhomes::model::models::InvestmentMade",
        "kind": "nested"
      },
      {
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "AssetStakingEvent",
        "type": "starhomes::staking_component::AssetStakingComponent::Event",
        "kind": "flat"
      }
    ]
  }
] as const;
