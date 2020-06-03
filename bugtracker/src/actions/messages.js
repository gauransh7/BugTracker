export const createMessage = (msg) => {
  console.log(`${msg}`)
    return {
        type : 'CREATE_MESSAGE',
        payload : msg
    }
}

export const returnErrors = (msg, status) => {
    return {
      type: 'GET_ERROR',
      payload: { msg, status },
    };
  };