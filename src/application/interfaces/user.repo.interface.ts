import { User, User } from "../domain/user.domain";

export type UserRepo = {
  createUser: () => void;
  getUser: () => User;
  updateUser: (user: User) => User;
};
