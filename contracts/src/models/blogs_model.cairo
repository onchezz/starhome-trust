#[derive(Clone, Drop, Serde, starknet::Store)]
pub struct Blog {
    pub id: u64,
    pub title: felt252,
    pub category: felt252,
    pub description: ByteArray,
    pub image: ByteArray,
    pub content: ByteArray,
    pub author: felt252,
    pub date: felt252,
    pub readTime: felt252,
}

