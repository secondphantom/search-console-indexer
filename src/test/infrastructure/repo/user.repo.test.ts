import { UserRepo } from "../../../infrastructure/repo/user.repo";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

describe("User Repo", () => {
  let userRepo: UserRepo;
  beforeAll(() => {
    userRepo = new UserRepo({
      userId: process.env.USER_ID!,
      dataDirPath: process.env.DATA_DIR_PATH!,
    });
  });

  test("Check file is existed", () => {
    const userFilePath = `${process.env.DATA_DIR_PATH!}/${process.env
      .USER_ID!}-user.json`;
    expect(fs.existsSync(userFilePath)).toEqual(true);
  });

  test("Get User", () => {
    const user = userRepo.getUser();

    expect(user).toMatchObject({
      userId: process.env.USER_ID!,
      origins: [],
      auth: "",
    });
  });

  test("hosts", async () => {
    const updateUser = {
      userId: process.env.USER_ID!,
      origins: ["https://example.com", "https://www.example.com"],
      auth: "auth",
    };

    userRepo.updateUser(updateUser);

    const user = userRepo.getUser();
    await userRepo.asyncSaveUser();

    expect(user).toMatchObject({
      ...updateUser,
    });
  });
});
