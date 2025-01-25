export const starhomes_abi =[
  {
    "type": "impl",
    "name": "StarhomesContractImpl",
    "interface_name": "starhomes::interfaces::iStarhomes::IStarhomesContract"
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
    "name": "starhomes::models::property_models::Property",
    "members": [
      {
        "name": "id",
        "type": "core::felt252"
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
        "name": "location_address",
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
      },
      {
        "name": "price",
        "type": "core::integer::u256"
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
        "type": "core::integer::u64"
      },
      {
        "name": "bedrooms",
        "type": "core::integer::u64"
      },
      {
        "name": "bathrooms",
        "type": "core::integer::u64"
      },
      {
        "name": "parking_spaces",
        "type": "core::integer::u64"
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
        "type": "core::felt252"
      },
      {
        "name": "features_id",
        "type": "core::felt252"
      },
      {
        "name": "images_id",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "video_tour",
        "type": "core::felt252"
      },
      {
        "name": "agent_id",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "date_listed",
        "type": "core::integer::u64"
      },
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
      },
      {
        "name": "asset_token",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::models::investment_model::MarketAnalysis",
    "members": [
      {
        "name": "area_growth",
        "type": "core::felt252"
      },
      {
        "name": "occupancy_rate",
        "type": "core::felt252"
      },
      {
        "name": "comparable_properties",
        "type": "core::felt252"
      },
      {
        "name": "demand_trend",
        "type": "core::felt252"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::models::investment_model::LegalDetails",
    "members": [
      {
        "name": "ownership",
        "type": "core::felt252"
      },
      {
        "name": "zoning",
        "type": "core::felt252"
      },
      {
        "name": "permits",
        "type": "core::felt252"
      },
      {
        "name": "documents_id",
        "type": "core::felt252"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::models::investment_model::InvestmentAsset",
    "members": [
      {
        "name": "id",
        "type": "core::felt252"
      },
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "is_active",
        "type": "core::bool"
      },
      {
        "name": "location",
        "type": "core::felt252"
      },
      {
        "name": "size",
        "type": "core::felt252"
      },
      {
        "name": "investor_id",
        "type": "core::felt252"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "asset_value",
        "type": "core::integer::u256"
      },
      {
        "name": "available_staking_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "investment_type",
        "type": "core::felt252"
      },
      {
        "name": "construction_year",
        "type": "core::integer::u64"
      },
      {
        "name": "property_price",
        "type": "core::integer::u256"
      },
      {
        "name": "expected_roi",
        "type": "core::felt252"
      },
      {
        "name": "rental_income",
        "type": "core::integer::u256"
      },
      {
        "name": "maintenance_costs",
        "type": "core::integer::u256"
      },
      {
        "name": "tax_benefits",
        "type": "core::felt252"
      },
      {
        "name": "highlights",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "market_analysis",
        "type": "starhomes::models::investment_model::MarketAnalysis"
      },
      {
        "name": "risk_factors",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "legal_details",
        "type": "starhomes::models::investment_model::LegalDetails"
      },
      {
        "name": "additional_features",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "images",
        "type": "core::felt252"
      },
      {
        "name": "investment_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "min_investment_amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "interface",
    "name": "starhomes::interfaces::iStarhomes::IStarhomesContract",
    "items": [
      {
        "type": "function",
        "name": "list_property",
        "inputs": [
          {
            "name": "property",
            "type": "starhomes::models::property_models::Property"
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
        "name": "list_investment_property",
        "inputs": [
          {
            "name": "investment_asset",
            "type": "starhomes::models::investment_model::InvestmentAsset"
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
            "type": "core::integer::u256"
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
        "name": "edit_property",
        "inputs": [
          {
            "name": "property_id",
            "type": "core::felt252"
          },
          {
            "name": "property",
            "type": "starhomes::models::property_models::Property"
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
        "name": "edit_listed_investment_property",
        "inputs": [
          {
            "name": "investment_id",
            "type": "core::felt252"
          },
          {
            "name": "investment",
            "type": "starhomes::models::investment_model::InvestmentAsset"
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
        "name": "get_property",
        "inputs": [
          {
            "name": "property_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "starhomes::models::property_models::Property"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_sale_properties",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::models::property_models::Property>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_investment_properties",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::models::investment_model::InvestmentAsset>"
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
            "type": "starhomes::models::investment_model::InvestmentAsset"
          }
        ],
        "state_mutability": "view"
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
    "name": "UsersComponentImpl",
    "interface_name": "starhomes::interfaces::user::IUsersComponentTrait"
  },
  {
    "type": "struct",
    "name": "starhomes::models::user_models::Investor",
    "members": [
      {
        "name": "investor_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "email",
        "type": "core::felt252"
      },
      {
        "name": "phone",
        "type": "core::felt252"
      },
      {
        "name": "address",
        "type": "core::felt252"
      },
      {
        "name": "is_verified",
        "type": "core::bool"
      },
      {
        "name": "is_authorized",
        "type": "core::bool"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "type": "struct",
    "name": "starhomes::models::user_models::Agent",
    "members": [
      {
        "name": "agent_id",
        "type": "core::starknet::contract_address::ContractAddress"
      },
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
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "type": "interface",
    "name": "starhomes::interfaces::user::IUsersComponentTrait",
    "items": [
      {
        "type": "function",
        "name": "get_investors",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::models::user_models::Investor>"
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
            "type": "starhomes::models::user_models::Investor"
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
            "type": "starhomes::models::user_models::Investor"
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
            "type": "starhomes::models::user_models::Investor"
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
        "name": "get_agents",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::models::user_models::Agent>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_agent",
        "inputs": [
          {
            "name": "agent_id",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "starhomes::models::user_models::Agent"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "register_agent",
        "inputs": [
          {
            "name": "agent",
            "type": "starhomes::models::user_models::Agent"
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
        "name": "edit_agent",
        "inputs": [
          {
            "name": "agent",
            "type": "starhomes::models::user_models::Agent"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
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
    "name": "starhomes::models::contract_events::Deposit",
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
    "name": "starhomes::models::contract_events::Withdrawal",
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
    "name": "starhomes::models::contract_events::RewardsFinished",
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
    "name": "starhomes::components::staking_component::AssetStakingComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Deposit",
        "type": "starhomes::models::contract_events::Deposit",
        "kind": "nested"
      },
      {
        "name": "Withdrawal",
        "type": "starhomes::models::contract_events::Withdrawal",
        "kind": "nested"
      },
      {
        "name": "RewardsFinished",
        "type": "starhomes::models::contract_events::RewardsFinished",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::components::user_component::UsersComponent::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "starhomes::models::contract_events::PropertyListed",
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
    "name": "starhomes::models::contract_events::InvestmentListed",
    "kind": "struct",
    "members": [
      {
        "name": "investment_id",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "asset_price",
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
    "name": "starhomes::models::contract_events::PropertySold",
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
    "name": "starhomes::models::contract_events::InvestmentMade",
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
    "name": "starhomes::components::property_component::PropertyComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "PropertyListed",
        "type": "starhomes::models::contract_events::PropertyListed",
        "kind": "nested"
      },
      {
        "name": "PropertyEditedListed",
        "type": "starhomes::models::contract_events::PropertyListed",
        "kind": "nested"
      },
      {
        "name": "InvestmentListed",
        "type": "starhomes::models::contract_events::InvestmentListed",
        "kind": "nested"
      },
      {
        "name": "InvestmentListedEdited",
        "type": "starhomes::models::contract_events::InvestmentListed",
        "kind": "nested"
      },
      {
        "name": "PropertySold",
        "type": "starhomes::models::contract_events::PropertySold",
        "kind": "nested"
      },
      {
        "name": "InvestmentMade",
        "type": "starhomes::models::contract_events::InvestmentMade",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "starhomes::starhomes_contract::starhomes::StarhomesContract::Event",
    "kind": "enum",
    "variants": [
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
        "type": "starhomes::components::staking_component::AssetStakingComponent::Event",
        "kind": "flat"
      },
      {
        "name": "UsersEvent",
        "type": "starhomes::components::user_component::UsersComponent::Event",
        "kind": "flat"
      },
      {
        "name": "PropertyComponentEvent",
        "type": "starhomes::components::property_component::PropertyComponent::Event",
        "kind": "flat"
      }
    ]
  }
] as const;
