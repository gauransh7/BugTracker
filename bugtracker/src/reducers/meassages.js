const initState = {
}

const messageReducer = (state = initState, action) => {
    switch (action.type){
        case 'CREATE_MESSAGE':
            return (state = action.payload)
        default:
            return state
    };
}

export default messageReducer