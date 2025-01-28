use starhomes::models::blogs_model::Blog;


#[starknet::interface]
pub trait IBlogsComponentTrait<TContractState> {
    fn add_blog(ref self: TContractState, blog: Blog);
    fn edit_blog(ref self: TContractState, blog_id: u64, blog: Blog);
    fn get_all_blogs(self: @TContractState) -> Array<Blog>;
    fn get_blog_by_id(self: @TContractState, blog_id: u64) -> Blog;
}
