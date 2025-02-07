#[starknet::component]
pub mod UsersComponent {
    use starhomes::models::user_models::{Investor, Agent, User, UserVisitRequest};
    use starhomes::messages::success::*;
    use starhomes::interfaces::user_interface::IUsersComponentTrait;
    // User_interface::IUsersComponentTrait;
    use starhomes::models::contract_events::UserRegistered;
    use starknet::storage::StoragePathEntry;
    // use core::num::traits::Zero;
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{
        Map, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess, Vec, VecTrait, MutableVecTrait,
    };
    use starhomes::messages::errors::*;

    #[storage]
    pub struct Storage {
        users: Map::<ContractAddress, User>,
        investors: Map::<ContractAddress, Investor>,
        authorized_investment_lister: Map::<ContractAddress, Investor>,
        investor_ids: Vec<ContractAddress>,
        agents_ids: Vec<ContractAddress>,
        agents: Map::<ContractAddress, Agent>,
        visit_request: Map<felt252, Vec<UserVisitRequest>>,
    }


    #[event]
    #[derive(Copy, Drop, Debug, PartialEq, starknet::Event)]
    pub enum Event {
        Registered: UserRegistered,
    }

    #[embeddable_as(UsersComponentImpl)]
    pub impl UsersComponent<
        TContractState, +HasComponent<TContractState>,
    > of IUsersComponentTrait<ComponentState<TContractState>> {
        fn register_user(ref self: ComponentState<TContractState>, user: User) -> felt252 {
            let caller = get_caller_address();
            assert(self.is_user_registered(caller) == false, Errors::USER_ALREADY_REGISTERED);
            self.users.write(caller, user.clone());
            self
                .emit(
                    Event::Registered(
                        UserRegistered {
                            user: caller,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            timestamp: starknet::get_block_timestamp(),
                        },
                    ),
                );
            Messages::SUCCESS
        }
        fn edit_user(
            ref self: ComponentState<TContractState>, user_id: ContractAddress, user: User,
        ) -> felt252 {
            let caller = get_caller_address();
            assert(caller == user.id, 'only user can edit');
            self.users.entry(user_id).write(user);
            Messages::SUCCESS
        }
        fn get_user_by_address(
            self: @ComponentState<TContractState>, user_id: ContractAddress,
        ) -> User {
            self.users.entry(user_id).read()
        }
        fn register_as_investor(
            ref self: ComponentState<TContractState>, user_id: ContractAddress,
        ) -> felt252 {
            let caller = get_caller_address();
            let user = self.get_user_by_address(user_id);
            assert(user.is_investor == true, 'Investor already registered');
            assert(caller == user_id, Errors::AGENT_OWNER);
            let investor_user = User { is_investor: true, ..user };
            self.edit_user(user_id, investor_user);
            self.investor_ids.append().write(user_id);
            Messages::SUCCESS
        }

        fn get_agents(self: @ComponentState<TContractState>) -> Array<User> {
            let mut agents = array![];
            for i in 0..self.agents_ids.len() {
                let id = self.agents_ids.at(i).read();
                agents.append(self.get_agent(id));
            };
            agents
        }

        fn get_agent(self: @ComponentState<TContractState>, agent_id: ContractAddress) -> User {
            let agent = self.users.entry(agent_id).read();
            agent
        }
        fn register_as_agent(
            ref self: ComponentState<TContractState>, user_id: ContractAddress,
        ) -> felt252 {
            // let caller = get_caller_address();
            assert(self.is_user_registered(user_id), Errors::USER_NOT_REGISTERED);
            // assert(self.is_agent_registered(user_id), Errors::AGENT_ALREADY_REGISTERED);
            let user: User = self.get_user_by_address(user_id);
            // assert(caller == user_id, Errors::NOT_OWNER);

            let mut agent_user = User { is_agent: true, ..user };
            self.edit_user(user_id, agent_user);
            // self.agents.write(agent.agent_id.clone(), agent.clone());
            self.agents_ids.append().write(user_id);
            self
                .emit(
                    Event::Registered(
                        UserRegistered {
                            user: user.id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            timestamp: starknet::get_block_timestamp(),
                        },
                    ),
                );
            Messages::SUCCESS
        }
        fn get_investors(self: @ComponentState<TContractState>) -> Array<User> {
            let mut investors = array![];
            for i in 0..self.investor_ids.len() {
                let id = self.investor_ids.at(i).read();
                investors.append(self.users.entry(id).read());
            };
            investors
        }
        fn get_investor(self: @ComponentState<TContractState>) -> User {
            let caller = get_caller_address();
            let investor = self.users.entry(caller).read();
            investor
        }
        fn authorize_as_investment_lister(
            ref self: ComponentState<TContractState>, investor_address: ContractAddress,
        ) {
            let user = self.get_user_by_address(investor_address);

            assert(user.is_authorized == false, Errors::INVESTOR_ALREADY_AUTHORIZED);
            self.users.entry(investor_address).write(User { is_authorized: true, ..user });
        }
    }

    #[generate_trait]
    pub impl UsersPrivateFunctions<
        TContractState, +HasComponent<TContractState>,
    > of UsersPrivateFunctionsTrait<TContractState> {
        fn _send_visit_request(
            ref self: ComponentState<TContractState>, visit_request: UserVisitRequest,
        ) {
            let mut requests = self.visit_request.entry(visit_request.property_id);
            requests.append().write(visit_request)
        }

        fn _read_visit_requests(
            self: @ComponentState<TContractState>, property_id: felt252,
        ) -> Array<UserVisitRequest> {
            let mut result = ArrayTrait::new();
            let vec = self.visit_request.entry(property_id);
            let len = vec.len();
            let mut i = 0;
            loop {
                if i == len {
                    break;
                }
                result.append(vec.at(i).read());
                i += 1;
            };
            result
        }

        fn is_authorized_investment_lister(
            self: @ComponentState<TContractState>, address: ContractAddress,
        ) -> bool {
            let investor = self.get_user_by_address(address);
            investor.is_authorized
        }
        fn is_investor_registered(
            self: @ComponentState<TContractState>, address: ContractAddress,
        ) -> bool {
            let investor = self.get_user_by_address(address);
            investor.is_investor
        }
        fn is_user_registered(
            self: @ComponentState<TContractState>, address: ContractAddress,
        ) -> bool {
            let user = self.users.entry(address).read();
            user.id == address
        }
        fn is_agent_registered(
            self: @ComponentState<TContractState>, address: ContractAddress,
        ) -> bool {
            let agent = self.get_user_by_address(address);
            match (agent.is_agent) {
                true => true,
                false => false,
            }
        }
    }
}
