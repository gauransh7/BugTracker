const initstate = {
    token : localStorage.getItem('token'),
    isAuthenticated : false,
    isLoading : false,
    User : null,
    users : []
}

const authReducer = (state=initstate,action) =>{
    switch(action.type){
        case 'USER_LOADING':
            return {
                ...state,
                isLoading : true
            }
        case 'USER_LOADED':
            return {
                ...state,
                isLoading: false,
                isAuthenticated : true,
                User : action.payload
            }

        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                is_Authenticated:true,
                is_Loading:false
            }

        case 'GET_USERS':
            return {
                ...state,
                users : action.payload
            }

        case 'USER_AUTHENTICATED':
            return {
                ...state,
                ...action.payload,
                is_Authenticated:true,
                is_Loading:false
            }
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            localStorage.removeItem('token')
            return {
                ...state,
                token : null,
                isLoading : false,
                isAuthenticated : false,
                User : null
            }
        default:
            return state
    }
}

export default authReducer