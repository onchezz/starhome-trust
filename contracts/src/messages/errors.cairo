pub mod Errors {
    pub const NULL_REWARDS: felt252 = 'Reward amount must be > 0';
    pub const NOT_ENOUGH_REWARDS: felt252 = 'Reward amount must be > balance';
    pub const NULL_AMOUNT: felt252 = 'Amount must be > 0';
    pub const NULL_DURATION: felt252 = 'Duration must be > 0';
    pub const UNFINISHED_DURATION: felt252 = 'Reward duration not finished';
    pub const NOT_ENOUGH_BALANCE: felt252 = 'Balance too low';
    pub const NOT_OWNER: felt252 = 'Caller is not the owner';
    pub const OWNER_NOT_REGISTERED: felt252 = 'Caller is not registered';
    pub const AGENT_NOT_REGISTERED: felt252 = 'Agent is not registered';
    pub const INVESTOR_NOT_REGISTERED: felt252 = 'Investor is not registered';
    pub const NO_PROPERTY: felt252 = 'Property not available ';
    pub const INVALID_SHARE_PRICE: felt252 = 'share price is invalid ';
    pub const INVALID_SHARE_COUNT: felt252 = 'share price is invalid ';
    pub const UNDEFINED_TOKEN_ADDRESS: felt252 = 'Undefined token address';
    pub const STAKING_FAILED: felt252 = 'Staking failed';
    pub const INVESTOR_ALREADY_AUTHORIZED: felt252 = 'Investor already authorized';
    pub const INVESTOR_NOT_AUTHORIZED: felt252 = 'Investor not authorized';
}
