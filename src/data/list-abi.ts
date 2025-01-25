export const list_abi = [
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
        "type": "core::integer::u256"
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
] as const;