const abi =[
  {
    "name": "StarhomesContractImpl",
    "type": "impl",
    "interface_name": "starhomes::interface::IStarhomesContract"
  },
  {
    "name": "core::bool",
    "type": "enum",
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
    "name": "core::integer::u256",
    "type": "struct",
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
    "name": "starhomes::model::models::Location",
    "type": "struct",
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
        "type": "core::integer::u256"
      },
      {
        "name": "longitude",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "starhomes::model::models::Agent",
    "type": "struct",
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
    "name": "starhomes::model::models::Amenities",
    "type": "struct",
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
    "name": "starhomes::model::models::Property",
    "type": "struct",
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
        "type": "core::felt252"
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
    "name": "starhomes::model::models::Investor",
    "type": "struct",
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
    "name": "starhomes::interface::IStarhomesContract",
    "type": "interface",
    "items": [
      {
        "name": "list_property_for_sale",
        "type": "function",
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
        "name": "list_property_for_investment",
        "type": "function",
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
        "name": "get_properties",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::model::models::Property>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "create_investment_property",
        "type": "function",
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
        "name": "invest_in_property",
        "type": "function",
        "inputs": [
          {
            "name": "property_id",
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
        "name": "get_property",
        "type": "function",
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
        "name": "get_investors",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::model::models::Investor>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_investor",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "starhomes::model::models::Investor"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "register_investor",
        "type": "function",
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
        "name": "edit_investor",
        "type": "function",
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
        "name": "version",
        "type": "function",
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
    "name": "UpgradeableImpl",
    "type": "impl",
    "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
  },
  {
    "name": "openzeppelin_upgrades::interface::IUpgradeable",
    "type": "interface",
    "items": [
      {
        "name": "upgrade",
        "type": "function",
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
    "name": "OwnableMixinImpl",
    "type": "impl",
    "interface_name": "openzeppelin_access::ownable::interface::OwnableABI"
  },
  {
    "name": "openzeppelin_access::ownable::interface::OwnableABI",
    "type": "interface",
    "items": [
      {
        "name": "owner",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transfer_ownership",
        "type": "function",
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
        "name": "renounce_ownership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "transferOwnership",
        "type": "function",
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
        "name": "renounceOwnership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "starhomes::model::models::PropertyListed",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "property_id",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "price",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "payment_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "starhomes::model::models::PropertySold",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "property_id",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "old_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "price",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "starhomes::model::models::InvestmentMade",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "property_id",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "investor",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred"
      },
      {
        "kind": "nested",
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "starhomes::model::models::Deposit",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "starhomes::model::models::Withdrawal",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "starhomes::model::models::RewardsFinished",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "msg",
        "type": "core::felt252"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "starhomes::staking_component::AssetStakingComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Deposit",
        "type": "starhomes::model::models::Deposit"
      },
      {
        "kind": "nested",
        "name": "Withdrawal",
        "type": "starhomes::model::models::Withdrawal"
      },
      {
        "kind": "nested",
        "name": "RewardsFinished",
        "type": "starhomes::model::models::RewardsFinished"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "starhomes::starhomes::StarhomesContract::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "PropertyListed",
        "type": "starhomes::model::models::PropertyListed"
      },
      {
        "kind": "nested",
        "name": "PropertySold",
        "type": "starhomes::model::models::PropertySold"
      },
      {
        "kind": "nested",
        "name": "InvestmentMade",
        "type": "starhomes::model::models::InvestmentMade"
      },
      {
        "kind": "flat",
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "AssetStakingEvent",
        "type": "starhomes::staking_component::AssetStakingComponent::Event"
      }
    ]
  }
]as const;

export default abi;