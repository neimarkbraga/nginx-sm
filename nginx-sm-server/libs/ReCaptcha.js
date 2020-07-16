const axios = require('axios');

class ReCaptcha {
  static async verify(captcha, secret) {
    const data = (await axios({
      method: 'post',
      url: 'https://www.google.com/recaptcha/api/siteverify',
      params: {
        secret: secret,
        response: captcha
      }
    })).data;
    return data.success;
  }
}

module.exports = ReCaptcha;