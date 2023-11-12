export type User = {
  auth: any;
  userId: string;
  origins: string[];
};

export class UserDomain {
  private auth: any;
  private userId: string;
  private origins: string[];
  constructor({ auth, userId, origins }: User) {
    this.auth = auth;
    this.userId = userId;
    this.origins = origins;
  }

  static createUser(user: User) {
    return new UserDomain(user);
  }

  getUserAuth = () => {
    return this.auth;
  };

  getUserId = () => {
    return this.userId;
  };

  updateUserAuth = (auth: any) => {
    this.auth = auth;
  };

  updateUserOrigins = (origins: string[]) => {
    this.origins = origins;
  };

  getUser = () => {
    return {
      auth: this.auth,
      userId: this.userId,
      origins: this.origins,
    };
  };
}
