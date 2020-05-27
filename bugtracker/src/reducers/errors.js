const initState = {
    msg : {},
    status : null
}

const errorReducer = (state = initState, action) => {
    switch (action.type){
        case 'GET_ERRORS':
            // console.log(action.payload)
            // console.log('created project', action.project)
            return{
                msg : action.payload.msg,
                status : action.payload.status
            };
    default:
        return state
    };
}

export default errorReducer