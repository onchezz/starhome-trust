#[starknet::component]
pub mod PropertyComponent {
    use starhomes::interfaces::property::IPropertyComponentTrait;
    use starhomes::models::property_models::{Property, TrustAssetProperty};
    use starhomes::models::contract_events::{PropertyListed, PropertySold, InvestmentMade};
    use starknet::storage::{
        Map, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess, Vec,
        VecTrait, StoragePathEntry, MutableVecTrait,
    };
    use core::option::Option;
    use starhomes::messages::errors::Errors;
    // use starhomes::messages::success::Messages;
    use starknet::ContractAddress;
    use starknet::{get_caller_address, get_block_timestamp};
    use core::array::ArrayTrait;
    use core::traits::Into;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher};
    // use core::byte_array::ByteArray;
    // use starhomes::components::user_component::UsersComponent;
    use starhomes::components::user_component::UsersComponent::UsersPrivateFunctions;
    // use starhomes::components::staking_component::AssetStakingComponent;
    use starhomes::components::staking_component::AssetStakingComponent::StakingPrivateFunctions;


    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PropertyListed: PropertyListed,
        PropertySold: PropertySold,
        InvestmentMade: InvestmentMade,
    }

    #[storage]
    pub struct Storage {
        // contract_owner: ContractAddress,
        property_tokens: Map::<u256, ContractAddress>,
        property_description: Map::<felt252, ByteArray>,
        properties: Map::<felt252, Property>,
        listed_sale_properties_ids: Vec<felt252>,
        listed_investment_properties_ids: Vec<felt252>,
        property_investments: Map::<u256, TrustAssetProperty>,
        property_investments_by_investor: Map::<ContractAddress, Vec<u256>>,
        property_count: u256,
    }


    #[embeddable_as(PropertyComponentImpl)]
    pub impl PropertyComponent<
        TContractState, +HasComponent<TContractState>,
    > of IPropertyComponentTrait<ComponentState<TContractState>> {
        // fn list_property(
        //     ref self: ComponentState<TContractState>,
        //     id: felt252,
        //     title: felt252,
        //     description: ByteArray,
        //     location_address: felt252,
        //     city: felt252,
        //     state: felt252,
        //     country: felt252,
        //     latitude: felt252,
        //     longitude: felt252,
        //     price: u256,
        //     owner: ContractAddress,
        //     asking_price: u256,
        //     currency: felt252,
        //     area: u64,
        //     bedrooms: u64,
        //     bathrooms: u64,
        //     parking_spaces: u64,
        //     property_type: felt252,
        //     status: felt252,
        //     interested_clients: u256,
        //     annual_growth_rate: u256,
        //     features_id: felt252, // Array of features
        //     images_id: felt252, // Array of IPFS CIDs for images
        //     video_tour: felt252, // IPFS CID for the video tour
        //     agent_id: ContractAddress,
        //     date_listed: felt252, // Date as a string (e.g., "2024-02-15")
        //     has_garden: bool,
        //     has_swimming_pool: bool,
        //     pet_friendly: bool,
        //     wheelchair_accessible: bool,
        //     asset_token: ContractAddress,
        //     is_investment: bool,
        // ) -> felt252 {
        //     let property = Property {
        //         id,
        //         title,
        //         description,
        //         location_address,
        //         city,
        //         state,
        //         country,
        //         latitude,
        //         longitude,
        //         price,
        //         owner,
        //         asking_price,
        //         currency,
        //         area,
        //         bedrooms,
        //         bathrooms,
        //         parking_spaces,
        //         property_type,
        //         status,
        //         interested_clients,
        //         annual_growth_rate,
        //         features_id, // Array of features
        //         images_id, // Array of IPFS CIDs for images
        //         video_tour, // IPFS CID for the video tour
        //         agent_id,
        //         date_listed: get_block_timestamp(), // Date as a string (e.g., "2024-02-15")
        //         has_garden,
        //         has_swimming_pool,
        //         pet_friendly,
        //         wheelchair_accessible,
        //         asset_token,
        //         is_investment,
        //     };
        //     self._add_property(property);

        //     match is_investment {
        //         true => {
        //             self
        //                 .create_investment_property_trust(
        //                     property_id: id, investment_token: asset_token,
        //                 );

        //             self.listed_investment_properties_ids.append().write(id);
        //         },
        //         false => { self.listed_sale_properties_ids.append().write(id); },
        //     }

        //     self
        //         .emit(
        //             Event::PropertyListed(
        //                 PropertyListed {
        //                     property_id: id,
        //                     owner: owner,
        //                     price: price,
        //                     payment_token: asset_token,
        //                     timestamp: starknet::get_block_timestamp(),
        //                 },
        //             ),
        //         );

        //     id
        // }
        fn list_property(ref self: ComponentState<TContractState>, property: Property) -> felt252 {
            self._add_property(property.clone());

            match property.is_investment {
                true => {
                    self
                        .create_investment_property_trust(
                            property_id: property.id, investment_token: property.asset_token,
                        );

                    self.listed_investment_properties_ids.append().write(property.id);
                },
                false => { self.listed_sale_properties_ids.append().write(property.id); },
            }

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
        fn get_sale_properties(self: @ComponentState<TContractState>) -> Array<Property> {
            let mut sale_properties = array![];
            for i in 0..self.listed_sale_properties_ids.len() {
                let id = self.listed_sale_properties_ids.at(i).read();
                sale_properties.append(self.properties.entry(id).read());
            };
            sale_properties
        }
        fn get_investment_properties(self: @ComponentState<TContractState>) -> Array<Property> {
            let mut investment_properties = array![];
            for i in 0..self.listed_investment_properties_ids.len() {
                let id = self.listed_investment_properties_ids.at(i).read();
                investment_properties.append(self.properties.entry(id).read());
            };
            investment_properties
        }


        fn invest_in_property(
            ref self: ComponentState<TContractState>, investment_id: u256, amount: u256,
        ) {
            // let caller = get_caller_address();
            // let is_registered = self.is_investor_registered(caller);
            // // let contract_address = get_contract_address();
            // let user_investor = self.get_investor();
            // assert(
            //     self.is_investor_registered(user_investor.investor_address),
            //     Errors::INVESTOR_NOT_REGISTERED,
            // );
            let investment = self.get_investment_by_id(investment_id);
            let property_id = investment.property_id;
            let asset_property = self.properties.entry(property_id).read();
            assert(property_id == asset_property.id, Errors::NO_PROPERTY);
            // let token_address = self.stake_to_property.get_property_token(property_id);

            // assert(asset_property.asset_token == token_address, Errors::UNDEFINED_TOKEN_ADDRESS);
        // if is_registered {
        //     let is_staked = self.stake_to_property.stake(property_id, amount);
        //     assert(!is_staked, Errors::STAKING_FAILED);
        //     if is_staked { // self.property_investments.write((property_id,
        //     investor.investor_address))
        //     }

            //     // self.property_investments.write((property_id,investor.investor_address),)

            //     // let investment = Investment {
        //     //     property_id,
        //     //     investor: caller,
        //     //     shares: amount,
        //     //     timestamp: starknet::get_block_timestamp(),
        //     // };
        //     // self.property_investments.write((property_id, caller), investment);

            //     // Emit event
        //     self
        //         .emit(
        //             Event::InvestmentMade(
        //                 InvestmentMade {
        //                     property_id,
        //                     investor: caller,
        //                     amount: amount,
        //                     // shares: shares_to_buy,
        //                     timestamp: starknet::get_block_timestamp(),
        //                 },
        //             ),
        //         );
        // }
        }


        fn get_property_by_id(
            self: @ComponentState<TContractState>, property_id: felt252,
        ) -> Property {
            let property = self.properties.entry(property_id).read();
            property
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
        fn _initialize_property_count(ref self: ComponentState<TContractState>) {
            self.property_count.write(0);
        }
        fn get_investment_count(self: @ComponentState<TContractState>) -> u256 {
            (self.listed_investment_properties_ids.len()).into()
        }
        fn get_investment_by_id(
            self: @ComponentState<TContractState>, investment_id: u256,
        ) -> TrustAssetProperty {
            self.property_investments.entry(investment_id).read()
        }
        fn create_investment_property_trust(
            ref self: ComponentState<TContractState>,
            property_id: felt252,
            investment_token: ContractAddress,
        ) -> u256 {
            let investment_count = self.get_investment_count();
            let investment_id: u256 = (investment_count + 1).into();
            let caller = get_caller_address();
            // let investor = self.get_investor();
            // assert(investor.investor_address == caller, Errors::OWNER_NOT_REGISTERED);

            let asset_property: Property = self.properties.entry(property_id).read();

            assert(asset_property.id == property_id, Errors::NO_PROPERTY);

            let trustAsset = TrustAssetProperty {
                id: investment_id.into(),
                property_id: property_id,
                owner: caller,
                price: asset_property.price,
                payment_token: IERC20Dispatcher { contract_address: investment_token },
                total_amount: asset_property.price,
                available_staking_amount: asset_property.price,
                is_active: true,
            };
            self.property_investments.write(investment_id, trustAsset);
            // StakingPrivateFunctions::_initialize_property_stake_token(
            //     ref self, token_address: asset_property.asset_token, property_id: property_id,
            // );
            //    StakingPrivateFunctions::_initialize_property_stake_token(
            //         ref self, token_address: asset_property.asset_token, property_id:
            //         property_id,
            //     );
            // AssetStakingComponent::initialize_property_token(
            //     token_address: asset_property.asset_token, property_id: property_id,
            // );
            // self
            //     .stake_to_property
            //     .initialize_property_token(
            //         token_address: asset_property.asset_token, property_id: property_id,
            //     );
            investment_id
        }
    }
}
