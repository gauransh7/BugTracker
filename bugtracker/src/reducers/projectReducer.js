const initState = {
    posts : []
}

const projectReducer = (state = initState, action) => {
    switch (action.type){
        case 'CREATE_PROJECT':
            // console.log(action.payload)
            // console.log('created project', action.project)
            return{
                ...state,
                posts : [...state.posts,action.payload]
            };

        case 'GET_PROJECTS':
            return {
                ...state,
                posts : action.payload
            };

        case 'DELETE_PROJECT':
            return {
                ...state,
                posts : state.posts.filter(post => {
                    return post.id !== action.payload
                })
            }
    default:
        return state
    };
}

export default projectReducer