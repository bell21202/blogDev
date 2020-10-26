import createDataContext from './createDataContext';
import jsonServer from '../api/jsonServer';

const blogReducer = (state,action) => {
    switch(action.type)
    {
        case 'get_blogposts':
            return [action.payload];

        case 'edit_blogpost':
            return state.map((blogPost) => {
                if (blogPost.id === action.payload.id) {
                    return action.payload;
                } else {
                    return blogPost;
                }
            });


        case 'delete_blogpost':
            return state.filter((blogPost) => blogPost.id !== action.payload);
        default:
            return state;
    }
};

const getBlogPosts = (dispatch) => {
    return async () => {
        const response = await jsonServer.get('/blogposts');
        dispatch({type: 'get_blogposts', payload: response.data});
    };

};

const addBlogPost = (dispatch) => {
    return async (title, content, callback) => {
        await jsonServer.post('/blogposts',{title,content});
         // dispatch an action object
         if (callback) {
            callback();
        }
    };   
};

const deleteBlogPost = (dispatch) => {
    return async (id) => {
        await jsonServer.delete(`/blogposts/${id}`);
        const Action = {type: 'delete_blogpost', payload: id};
        dispatch(Action)
    };
}

const editBlogPost = (dispatch) => {
    return async (id, title, content, callback) => {
        await jsonServer.put(`/blogposts/${id}`,{title,content})
        dispatch({type: 'edit_blogpost', payload: {id, title, content}})
        if (callback) {
            callback();
        }    
    };  
};

export const {Context, Provider} = createDataContext(
    blogReducer,
    {addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts},
    []);

