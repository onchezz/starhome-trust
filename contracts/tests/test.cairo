// fn approve_token(ref self: ContractState, amount: u256) {
//     let caller = get_caller_address();
//     let contract_address = get_contract_address();
//     // let this = get_contract_address();
//     // let mut property = self.properties.read(property_id);
//     //    self.properties.entry(property_id).payment_token.write().
//     self.token.read().approve(contract_address, amount);
//     // self.token.read().allowance(caller, contract_address);
// }
// fn save_token(ref self: ContractState, token: ContractAddress) -> ContractAddress {
//     //    let payment_token = IERC20Dispatcher { contract_address: token };
//     self.token.write(IERC20Dispatcher { contract_address: token });
//     token
// }
// fn send_to_starhomes(ref self: ContractState, amount: u256) -> u256 {
//     let caller = get_caller_address();
//     let contract_address = get_contract_address();
//     let balance: u256 =
//     self.token.read().balance_of(contract_address).try_into().unwrap();
//     assert(balance >= amount, 'No enough balance');
//     if (balance > amount) {
//         self.token.read().transfer_from(caller, contract_address, amount);
//     }
//     balance
// }
// fn owner(self: @ContractState) -> ContractAddress {
//     // self.owner()
// }
