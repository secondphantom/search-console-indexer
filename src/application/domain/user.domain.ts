export type Url = {
  requestDate: string;
  isIndexing: boolean;
  request: {
    success: string;
    message: string;
  };
};

export type Host = {
  email: string;
  urls: Url[];
};

export type User = {
  auth: any;
  email: string;
  hosts: string[];
};

export class UserDomain {
  auth: any;
  email: string;
  hosts: string[];
  constructor({ auth, email, hosts }: User) {
    this.auth = auth;
    this.email = email;
    this.hosts = hosts;
  }

  static createUser(user: User) {
    return new UserDomain(user);
  }

  updateUserAuth = (auth: any) => {
    this.auth = auth;
  };

  getUser = () => {
    return {
      auth: this.auth,
      email: this.email,
      hosts: this.hosts,
    };
  };
}
