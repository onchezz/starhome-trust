#[starknet::component]
pub mod UsersComponent {
    use starhomes::models::user_models::{Investor, Agent};
    use starhomes::messages::success::*;
    use starhomes::interfaces::user::IUsersComponentTrait;
    // use core::starknet::event::EventEmitter;
    use starknet::storage::StoragePathEntry;
    // use core::num::traits::Zero;
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{
        Map, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess, Vec,
        VecTrait, MutableVecTrait,
    };
    use starhomes::messages::errors::*;

    #[storage]
    pub struct Storage {
        investors: Map::<ContractAddress, Investor>,
        authorized_investment_lister: Map::<ContractAddress, Investor>,
        investor_ids: Vec<ContractAddress>,
        agents: Map::<ContractAddress, Agent>,
    }


    #[event]
    #[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
    pub enum Event { // Registed: Deposit,
    // Withdrawal: Withdrawal,
    // RewardsFinished: RewardsFinished,
    }

    #[embeddable_as(UsersComponentImpl)]
    pub impl UsersComponent<
        TContractState, +HasComponent<TContractState>,
    > of IUsersComponentTrait<ComponentState<TContractState>> {
        fn get_investors(self: @ComponentState<TContractState>) -> Array<Investor> {
            let mut investors = array![];
            for i in 0..self.investor_ids.len() {
                let id = self.investor_ids.at(i).read();
                investors.append(self.investors.entry(id).read());
            };
            investors
        }
        fn get_investor(self: @ComponentState<TContractState>) -> Investor {
            let caller = get_caller_address();
            let investor = self.investors.entry(caller).read();
            investor
        }
        fn register_investor(
            ref self: ComponentState<TContractState>,
            investor_name: felt252,
            investor_email: felt252,
            investor_phone: felt252,
            investor_address: felt252,
        ) -> felt252 {
            let caller = get_caller_address();
            let investor = Investor {
                investor_address: caller,
                name: investor_name,
                email: investor_email,
                phone: investor_phone,
                address: investor_address,
                is_authorized: false,
                timestamp: starknet::get_block_timestamp(),
            };
            self.investors.write(investor.investor_address, investor);
            self.investor_ids.append().write(investor.investor_address);
            Messages::SUCCESS
        }
        fn edit_investor(ref self: ComponentState<TContractState>, investor: Investor) -> felt252 {
            let caller = get_caller_address();

            assert(caller == investor.investor_address, 'only investor can edit');
            self.investors.entry(caller).write(investor);

            Messages::SUCCESS
        }

        fn get_agent(self: @ComponentState<TContractState>, agent_id: ContractAddress) -> Agent {
            let agent = self.agents.entry(agent_id).read();
            agent
        }
        fn register_agent(
            ref self: ComponentState<TContractState>,
            agent_name: felt252,
            agent_email: felt252,
            agent_phone: felt252,
            agent_address: felt252,
            agent_profile_image: felt252,
        ) -> felt252 {
            let caller = get_caller_address();
            let agent = Agent {
                agent_id: agent_address,
                name: agent_name,
                phone: agent_phone,
                email: agent_email,
                profile_image: agent_profile_image,
                agent_address: caller,
            };
            self.agents.write(agent.agent_address, agent);
            Messages::SUCCESS
        }
        fn edit_agent(ref self: ComponentState<TContractState>, agent: Agent) -> felt252 {
            let caller = get_caller_address();
            assert(caller == agent.agent_address, 'only agent can edit');
            self.agents.entry(caller).write(agent);
            Messages::SUCCESS
        }
    }

    #[generate_trait]
    pub impl UsersPrivateFunctions<
        TContractState, +HasComponent<TContractState>,
    > of UsersPrivateFunctionsTrait<TContractState> {
        fn authorize_investment_lister(
            ref self: ComponentState<TContractState>, investor_address: ContractAddress,
        ) -> felt252 {
            let caller = get_caller_address();
            let investor = self.get_investor();
            assert(investor.investor_address == caller, Errors::INVESTOR_NOT_REGISTERED);
            assert(investor.is_authorized == false, Errors::INVESTOR_ALREADY_AUTHORIZED);
            self.investors.entry(caller).write(Investor { is_authorized: true, ..investor });
            self.authorized_investment_lister.write(investor.investor_address, investor);
            Messages::SUCCESS
        }
        fn is_authorized_investment_lister(
            self: @ComponentState<TContractState>, address: ContractAddress,
        ) -> bool {
            let investor = self.authorized_investment_lister.entry(address).read();
            investor.is_authorized == true
        }
        fn is_investor_registered(
            self: @ComponentState<TContractState>, address: ContractAddress,
        ) -> bool {
            let investor = self.get_investor();
            investor.investor_address == address
        }
        fn is_agent_registered(
            self: @ComponentState<TContractState>, address: ContractAddress,
        ) -> bool {
            let agent = self.get_agent(address);
            agent.agent_address == address
        }
    }
}
