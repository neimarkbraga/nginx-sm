class Utils {

  static getRequestErrorMessage(error, defaultMessage = 'An unknown error occurred.') {
    if (error) {
      if (error.response) {
        if (typeof error.response.data === 'object') {
          if (typeof error.response.data.message === 'string')
            return error.response.data.message;
        }
        if (typeof error.response.data === 'string') {
          if (error.response.data.length < 256)
            return error.response.data;
        }
      }
      return error.message || defaultMessage;
    }

    return defaultMessage;
  }
}

export default Utils;