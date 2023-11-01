import { UserRepo } from "../../../infrastructure/repo/user.repo";
import dotenv from "dotenv";
dotenv.config();

describe("User Repo", () => {
  let userRepo: UserRepo;
  beforeAll(() => {
    userRepo = new UserRepo({
      userId: process.env.USER_ID!,
      dataDirPath: process.env.DATA_DIR_PATH!,
    });
  });

  test("Get User", () => {
    const user = userRepo.getUser();

    expect(user).toMatchObject({
      userId: process.env.USER_ID!,
      hosts: [],
      auth: "",
    });
  });

  test("hosts", () => {
    const updateUser = {
      userId: process.env.USER_ID!,
      hosts: ["https://example.com", "https://www.example.com"],
      auth: "auth",
    };

    userRepo.updateUser(updateUser);

    const user = userRepo.getUser();

    expect(user).toMatchObject({
      ...updateUser,
    });
  });
});
