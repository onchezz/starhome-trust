pub mod messages {
    pub mod errors;
    pub mod success;
}
pub mod models {
    pub mod property_models;
    pub mod investment_model;
    pub mod user_models;
    pub mod contract_events;
}

pub mod components {
    pub mod staking_component;
    pub mod property_component;
    pub mod user_component;
}
pub mod interfaces {
    pub mod user;
    pub mod iStarhomes;
    pub mod asset_staking;
    pub mod property;
}
pub mod starhomes_contract {
    pub mod starhomes;
}

