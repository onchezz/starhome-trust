#[starknet::component]
pub mod PropertyComponent {
    use starhomes::interfaces::property::IPropertyComponentTrait;
    use starhomes::models::property_models::{Property};
    use starhomes::models::contract_events::{
        PropertyListed, PropertySold, InvestmentMade, InvestmentListed,
    };
    use starhomes::models::investment_model::InvestmentAsset;
    use starknet::storage::{
        Map, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess, Vec,
        VecTrait, StoragePathEntry, MutableVecTrait,
    };
    use core::option::Option;
    // use starhomes::messages::errors::Errors;
    // use starhomes::messages::success::Messages;
    use starknet::ContractAddress;
    // use starknet::{get_caller_address, get_block_timestamp};
    use core::array::ArrayTrait;
    use core::traits::Into;
    // use openzeppelin::token::erc20::interface::{IERC20Dispatcher};
    use starhomes::components::user_component::UsersComponent::UsersPrivateFunctions;
    use starhomes::components::staking_component::AssetStakingComponent::StakingPrivateFunctions;


    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PropertyListed: PropertyListed,
        InvestmentListed: InvestmentListed,
        PropertySold: PropertySold,
        InvestmentMade: InvestmentMade,
    }

    #[storage]
    pub struct Storage {
        property_tokens: Map::<u256, ContractAddress>,
        property_description: Map::<felt252, ByteArray>,
        properties: Map::<felt252, Property>,
        listed_sale_properties_ids: Vec<felt252>,
        listed_investment_properties_ids: Vec<felt252>,
        investments_properties: Map::<felt252, InvestmentAsset>,
        property_investments_by_investor: Map::<ContractAddress, Vec<u256>>,
        property_sale_count: u256,
         property_investment_count: u256,
    }


    #[embeddable_as(PropertyComponentImpl)]
    pub impl PropertyComponent<
        TContractState, +HasComponent<TContractState>,
    > of IPropertyComponentTrait<ComponentState<TContractState>> {
        fn list_property(ref self: ComponentState<TContractState>, property: Property) -> felt252 {
            self._add_property(property.clone());

            self.listed_sale_properties_ids.append().write(property.id);

            self
                .emit(
                    Event::PropertyListed(
                        PropertyListed {
                            property_id: property.id,
                            owner: property.owner,
                            price: property.price,
                            payment_token: property.asset_token,
                            timestamp: starknet::get_block_timestamp(),
                        },
                    ),
                );

            property.id.clone()
        }
        fn list_investment_property(
            ref self: ComponentState<TContractState>, investment: InvestmentAsset,
        ) -> felt252 {
           

            self.listed_investment_properties_ids.append().write(investment.id);

            self
                .emit(
                    Event::InvestmentListed(
                        InvestmentListed {
                            investment_id: investment.id,
                            owner: investment.owner,
                            asset_price: investment.asset_value,
                            payment_token: investment.investment_token,
                            timestamp: starknet::get_block_timestamp(),
                        },
                    ),
                );

            investment.id.clone()
        }
        fn get_sale_properties(self: @ComponentState<TContractState>) -> Array<Property> {
            let mut sale_properties = array![];
            for i in 0..self.listed_sale_properties_ids.len() {
                let id = self.listed_sale_properties_ids.at(i).read();
                sale_properties.append(self.properties.entry(id).read());
            };
            sale_properties
        }
        fn get_investment_properties(self: @ComponentState<TContractState>) -> Array<InvestmentAsset> {
            let mut investment_properties = array![];
            for i in 0..self.listed_investment_properties_ids.len() {
                let id = self.listed_investment_properties_ids.at(i).read();
                investment_properties.append(self.investments_properties.entry(id).read());
            };
            investment_properties
        }


       

        fn get_property_by_id(
            self: @ComponentState<TContractState>, property_id: felt252,
        ) -> Property {
            let property = self.properties.entry(property_id).read();
            property
        }
        fn get_investment_by_id(
            self: @ComponentState<TContractState>, investment_id: felt252,
        ) -> InvestmentAsset {
            self.investments_properties.entry(investment_id).read()
        }
    }


    #[generate_trait]
    pub impl PropertyFunctions<
        TContractState, +HasComponent<TContractState>,
    > of PropertyFunctionsTrait<TContractState> {
        fn _add_property(ref self: ComponentState<TContractState>, property: Property) -> Property {
            self.properties.write(property.id.clone(), property.clone());
            property
        }
         fn _add_investment_asset(ref self: ComponentState<TContractState>, asset: InvestmentAsset) -> InvestmentAsset {
            self.investments_properties.write(asset.id.clone(), asset.clone());
            asset
        }
        fn _initialize_property_count(ref self: ComponentState<TContractState>) {
    
            self.property_sale_count.write(0);
                  self.property_investment_count.write(0);
        }
        fn get_investment_count(self: @ComponentState<TContractState>) -> u256 {
            (self.listed_investment_properties_ids.len()).into()
        }
        
      
    }
}
