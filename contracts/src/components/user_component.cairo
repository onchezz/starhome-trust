#[starknet::component]
pub mod UsersComponent {
    use starhomes::models::user_models::{Investor, Agent};
    use starhomes::messages::success::*;
    use starhomes::interfaces::user::IUsersComponentTrait;
    use starhomes::models::contract_events::UserRegistered;
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
        agents_ids: Vec<ContractAddress>,
        agents: Map::<ContractAddress, Agent>,
    }


    #[event]
    #[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
    pub enum Event {
        Registered: UserRegistered,
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
            ref self: ComponentState<TContractState>, investor: Investor,
        ) -> felt252 {
            let isinvestor = self.is_investor_registered(investor.investor_address);
            assert(isinvestor == true, 'Investor already registered');
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
        fn get_agents(self: @ComponentState<TContractState>) -> Array<Agent> {
            let mut agents = array![];
            for i in 0..self.agents_ids.len() {
                let id = self.agents_ids.at(i).read();
                agents.append(self.get_agent(id));
            };
            agents
        }

        fn get_agent(self: @ComponentState<TContractState>, agent_id: ContractAddress) -> Agent {
            let agent = self.agents.entry(agent_id).read();
            agent
        }
        fn register_agent(ref self: ComponentState<TContractState>, agent: Agent) -> felt252 {
            let caller = get_caller_address();
            assert(self.is_agent_registered(caller) == false, Errors::AGENT_ALREADY_REGISTERED);
            assert(agent.agent_id == caller, Errors::AGENT_OWNER);
            self.agents.write(agent.agent_id.clone(), agent.clone());
            self.agents_ids.append().write(agent.agent_id);
            self
                .emit(
                    Event::Registered(
                        UserRegistered {
                            user: agent.agent_id,
                            name: agent.name,
                            email: agent.email,
                            phone: agent.phone,
                            timestamp: starknet::get_block_timestamp(),
                        },
                    ),
                );
            Messages::SUCCESS
        }
        fn edit_agent(ref self: ComponentState<TContractState>, agent: Agent) -> felt252 {
            let caller = get_caller_address();
            assert(caller == agent.agent_id, 'only agent can edit');
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
            agent.agent_id == address
        }
    }
}
