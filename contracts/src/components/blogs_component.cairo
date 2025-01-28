#[starknet::component]
pub mod BlogComponent {
    use starhomes::models::blogs_model::Blog;
    use starhomes::interfaces::blogs_interface::IBlogsComponentTrait;
    use starhomes::models::contract_events::BlogAdded;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait, MutableVecTrait,
    };
    use starknet::{get_caller_address};
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        BLOGADDED: BlogAdded,
        BLOGUPDATED: BlogAdded,
    }

    #[storage]
   pub  struct Storage {
        blogs: Vec<Blog>,
    }
    #[embeddable_as(BlogsComponentImpl)]
    pub impl BlogsComponent<
        TContractState, +HasComponent<TContractState>,
    > of IBlogsComponentTrait<ComponentState<TContractState>> {
        fn add_blog(ref self: ComponentState<TContractState>, blog: Blog) {
            let user = get_caller_address();
            let blog_id = self.blogs.len() + 1;
            self.blogs.append().write(Blog { id: blog_id, ..blog });

            self
                .emit(
                    Event::BLOGADDED(
                        BlogAdded {
                            user: user,
                            author: blog.author.clone(),
                            timestamp: starknet::get_block_timestamp(),
                        },
                    ),
                )
        }
        fn edit_blog(ref self: ComponentState<TContractState>, blog_id: u64, blog: Blog) {
            let author = blog.author.clone();
            self.blogs.at(blog_id - 1).write(blog);
            let user = get_caller_address();
            self
                .emit(
                    Event::BLOGADDED(
                        BlogAdded {
                            user: user, author: author, timestamp: starknet::get_block_timestamp(),
                        },
                    ),
                )
        }
        fn get_all_blogs(self: @ComponentState<TContractState>) -> Array<Blog> {
            let mut blogs = array![];
            for i in 0..self.blogs.len() {
                blogs.append(self.blogs.at(i).read())
            };
            blogs
        }
        fn get_blog_by_id(self: @ComponentState<TContractState>, blog_id: u64) -> Blog {
            self.blogs.at(blog_id - 1).read()
        }
    }
}
