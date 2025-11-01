export class Login {
  username: string;
  password: string;
  captcha: object;

  constructor(username: string, password: string, captcha: object = {}) {
    this.username = username;
    this.password = password;
    this.captcha = captcha;
  }

  static fromJson(json: any): Login {
    return new Login(json.username, json.password, json.captcha || {});
  }
}