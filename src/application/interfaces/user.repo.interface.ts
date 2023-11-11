import { User, UserDomain } from "../../domain/user.domain";

export type UserRepoConstructorInput = {
  userId: string;
  dataDirPath: string;
  options?: {
    saveUser?: boolean;
  };
};

export type IUserRepo = {
  getUser: () => User;
  updateUser: (user: User) => void;
  findOrigin: (origin: string) => boolean;
};
