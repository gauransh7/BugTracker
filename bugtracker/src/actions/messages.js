export const createMessage = (msg) => {
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