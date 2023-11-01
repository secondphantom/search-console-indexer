export type Url = {
  requestDate: string;
  isIndexing: boolean;
  request: {
    success: string;
    message: string;
  };
};

export type Host = {
  userId: string;
  urls: Url[];
};

export type User = {
  auth: any;
  userId: string;
  hosts: string[];
};

export class UserDomain {
  auth: any;
  userId: string;
  hosts: string[];
  constructor({ auth, userId, hosts }: User) {
    this.auth = auth;
    this.userId = userId;
    this.hosts = hosts;
  }

  static createUser(user: User) {
    return new UserDomain(user);
  }

  updateUserAuth = (auth: any) => {
    this.auth = auth;
  };

  updateUserHosts = (hosts: string[]) => {
    this.hosts = hosts;
  };

  getUser = () => {
    return {
      auth: this.auth,
      userId: this.userId,
      hosts: this.hosts,
    };
  };
}
