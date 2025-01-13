use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
struct InvestmentMade {
    property_id: u256,
    investor: ContractAddress,
    shares: u256
}

#[derive(Drop, Serde, Copy)]
struct Investment {
    property_id: u256,
    investor: ContractAddress,
    shares: u256
}

#[starknet::component]
mod investment_component {
    use starknet::{ContractAddress, get_caller_address};
    use super::{Investment, InvestmentMade};

    #[storage]
    struct Storage {
        investments: LegacyMap<(u256, ContractAddress), Investment>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        InvestmentMade: InvestmentMade,
    }

    #[embeddable_as(InvestmentManager)]
    pub impl InvestmentImpl<
        TContractState, +HasComponent<TContractState>
    > of super::IInvestmentManager<ComponentState<TContractState>> {
        fn invest(
            ref self: ComponentState<TContractState>,
            property_id: u256,
            shares: u256
        ) {
            let caller = get_caller_address();
            
            let investment = Investment {
                property_id,
                investor: caller,
                shares
            };

            self.investments.write((property_id, caller), investment);

            self.emit(Event::InvestmentMade(InvestmentMade {
                property_id,
                investor: caller,
                shares
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

#[starknet::interface]
trait IInvestmentManager<TContractState> {
    fn invest(ref self: TContractState, property_id: u256, shares: u256);
    fn get_investment(self: @TContractState, property_id: u256, investor: ContractAddress) -> Investment;
}