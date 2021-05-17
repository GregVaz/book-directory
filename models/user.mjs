const _user_email = Symbol('email');
const _user_password = Symbol('password');
const _user_username = Symbol('username');

// Describe a single user that our application will manage
export class User {
  constructor(email, password, username) {
    this[_user_email] = email;
    this[_user_password] = password;
    this[_user_username] = username;
  }

  get id() { return this[_user_id]; }
  get email() { return this[_user_email]; }
  set email(newemail) { this[_user_email] = newemail; }
  get password() { return this[_user_password]; }
  set password(newpassword) { this[_user_password] = newpassword; }
  get username() { return this[_user_username]; }
  set username(newPublicationDate) { this[_user_username] = newPublicationDate; }

  get JSON() {
    return JSON.stringify({
      email: this.email,
      password: this.password,
      username: this.username
    });
  }

  static fromJSON(json) {
    const data = JSON.parse(json);
    if (typeof data !== 'object'
      || !data.hasOwnProperty('email')
      || typeof data.email !== 'string'
      || !data.hasOwnProperty('password')
      || typeof data.password !== 'string'
      || !data.hasOwnProperty('username')
      || typeof data.username !== 'string') {
        throw new Error(`Not a user: ${json}`);
    }
    const user = new user(
      data.email,
      data.password,
      data.username
    );
    return user;
  }
}

// Describes methods for managin some user instances
export class AbstractUsersStore {
  async close() {  }
  async update(email, password, username) {  }
  async create(email, password, username) {  }
  async read(id) {  }
  async destroy(id) {  }
}
