export class Login {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  static fromJson(json: any): Login {
    return new Login(json.username, json.password || {});
  }
}