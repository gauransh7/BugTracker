export const createMessage = (msg) => {
    return {
        type : 'CREATE_MESSAGE',
        payload : msg
    }
}