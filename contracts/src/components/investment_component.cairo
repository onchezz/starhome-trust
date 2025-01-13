use starknet::ContractAddress;

#[starknet::interface]
pub trait IInvestmentManager<TContractState> {
    fn invest(ref self: TContractState, property_id: u256, shares: u256);
    fn get_investment(self: @TContractState, property_id: u256, investor: ContractAddress) -> Investment;
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Investment {
    investor: ContractAddress,
    shares: u256,
    timestamp: u64,
}

#[starknet::component]
pub mod investment_component {
    use super::{Investment, IInvestmentManager};
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;

    #[storage]
    struct Storage {
        investments: LegacyMap::<(u256, ContractAddress), Investment>,
        investment_count: LegacyMap::<u256, u32>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        InvestmentMade: InvestmentMade,
    }

    #[derive(Drop, starknet::Event)]
    pub struct InvestmentMade {
        property_id: u256,
        investor: ContractAddress,
        shares: u256,
        timestamp: u64,
    }

    #[embeddable_as(InvestmentManager)]
    impl InvestmentManagerImpl<
        TContractState, +HasComponent<TContractState>
    > of IInvestmentManager<ComponentState<TContractState>> {
        fn invest(
            ref self: ComponentState<TContractState>,
            property_id: u256,
            shares: u256,
        ) {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            let investment = Investment {
                investor: caller,
                shares,
                timestamp,
            };

            self.investments.write((property_id, caller), investment);
            self.investment_count.write(
                property_id,
                self.investment_count.read(property_id) + 1
            );

            self.emit(Event::InvestmentMade(InvestmentMade {
                property_id,
                investor: caller,
                shares,
                timestamp,
            }));
        }

        fn get_investment(
            self: @ComponentState<TContractState>,
            property_id: u256,
            investor: ContractAddress
        ) -> Investment {
            self.investments.read((property_id, investor))
        }
    }
}