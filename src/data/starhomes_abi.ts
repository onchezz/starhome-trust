export const starhomes_abi =[
  {
    "name": "StarhomesContractImpl",
    "type": "impl",
    "interface_name": "starhomes::interfaces::iStarhomes::IStarhomesContract"
  },
  {
    "name": "core::byte_array::ByteArray",
    "type": "struct",
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
    "name": "starhomes::models::property_models::Property",
    "type": "struct",
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
    "name": "starhomes::models::investment_model::MarketAnalysis",
    "type": "struct",
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
    "name": "starhomes::models::investment_model::LegalDetails",
    "type": "struct",
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
    "name": "starhomes::models::investment_model::InvestmentAsset",
    "type": "struct",
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
    "name": "starhomes::interfaces::iStarhomes::IStarhomesContract",
    "type": "interface",
    "items": [
      {
        "name": "list_property",
        "type": "function",
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
        "name": "list_investment_property",
        "type": "function",
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
        "name": "invest_in_property",
        "type": "function",
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
        "name": "edit_property",
        "type": "function",
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
        "name": "edit_listed_investment_property",
        "type": "function",
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
            "type": "starhomes::models::property_models::Property"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_sale_properties",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::models::property_models::Property>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_investment_properties",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::models::investment_model::InvestmentAsset>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_investment",
        "type": "function",
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
    "name": "UsersComponentImpl",
    "type": "impl",
    "interface_name": "starhomes::interfaces::user::IUsersComponentTrait"
  },
  {
    "name": "starhomes::models::user_models::Investor",
    "type": "struct",
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
    "name": "starhomes::models::user_models::Agent",
    "type": "struct",
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
    "name": "starhomes::interfaces::user::IUsersComponentTrait",
    "type": "interface",
    "items": [
      {
        "name": "get_investors",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::models::user_models::Investor>"
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
            "type": "starhomes::models::user_models::Investor"
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
        "name": "edit_investor",
        "type": "function",
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
        "name": "get_agents",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<starhomes::models::user_models::Agent>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_agent",
        "type": "function",
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
        "name": "register_agent",
        "type": "function",
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
        "name": "edit_agent",
        "type": "function",
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
    "name": "starhomes::models::contract_events::Deposit",
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
    "name": "starhomes::models::contract_events::Withdrawal",
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
    "name": "starhomes::models::contract_events::RewardsFinished",
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
    "name": "starhomes::components::staking_component::AssetStakingComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Deposit",
        "type": "starhomes::models::contract_events::Deposit"
      },
      {
        "kind": "nested",
        "name": "Withdrawal",
        "type": "starhomes::models::contract_events::Withdrawal"
      },
      {
        "kind": "nested",
        "name": "RewardsFinished",
        "type": "starhomes::models::contract_events::RewardsFinished"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "starhomes::models::contract_events::UserRegistered",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "name",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "email",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "phone",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "starhomes::components::user_component::UsersComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Registered",
        "type": "starhomes::models::contract_events::UserRegistered"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "starhomes::models::contract_events::PropertyListed",
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
    "name": "starhomes::models::contract_events::InvestmentListed",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "investment_id",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "asset_price",
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
    "name": "starhomes::models::contract_events::PropertySold",
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
    "name": "starhomes::models::contract_events::InvestmentMade",
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
    "kind": "enum",
    "name": "starhomes::components::property_component::PropertyComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "PropertyListed",
        "type": "starhomes::models::contract_events::PropertyListed"
      },
      {
        "kind": "nested",
        "name": "PropertyEditedListed",
        "type": "starhomes::models::contract_events::PropertyListed"
      },
      {
        "kind": "nested",
        "name": "InvestmentListed",
        "type": "starhomes::models::contract_events::InvestmentListed"
      },
      {
        "kind": "nested",
        "name": "InvestmentListedEdited",
        "type": "starhomes::models::contract_events::InvestmentListed"
      },
      {
        "kind": "nested",
        "name": "PropertySold",
        "type": "starhomes::models::contract_events::PropertySold"
      },
      {
        "kind": "nested",
        "name": "InvestmentMade",
        "type": "starhomes::models::contract_events::InvestmentMade"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "starhomes::starhomes_contract::starhomes::StarhomesContract::Event",
    "type": "event",
    "variants": [
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
        "type": "starhomes::components::staking_component::AssetStakingComponent::Event"
      },
      {
        "kind": "flat",
        "name": "UsersEvent",
        "type": "starhomes::components::user_component::UsersComponent::Event"
      },
      {
        "kind": "flat",
        "name": "PropertyComponentEvent",
        "type": "starhomes::components::property_component::PropertyComponent::Event"
      }
    ]
  }
] as const;
