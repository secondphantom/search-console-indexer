import { InitValidator } from "../../../infrastructure/validator/init.validator";

describe("Init validator", () => {
  let initValidator: InitValidator;

  beforeAll(() => {
    initValidator = new InitValidator();
  });

  describe("Constructor input", () => {
    test.each<{
      message: string;
      throwError: boolean;
      dto: any;
    }>([
      {
        message: "valid options optional",
        throwError: false,
        dto: {
          userId: "emailId",
          clientSecretFilePath: "./exclude/",
          dataDirPath: "./exclude/",
        },
      },
      {
        message: "valid options schema",
        throwError: false,
        dto: {
          userId: "emailId",
          clientSecretFilePath: "./exclude/",
          dataDirPath: "./exclude/",
          options: {
            saveUser: true,
            saveDate: true,
            port: 3000,
          },
        },
      },
      {
        message: "invalid input string",
        throwError: true,
        dto: {
          userId: true,
          clientSecretFilePath: "./exclude/",
          dataDirPath: "./exclude/",
          options: {
            saveUser: true,
            saveDate: true,
            port: 3000,
          },
        },
      },
      {
        message: "invalid input options",
        throwError: true,
        dto: {
          userId: true,
          clientSecretFilePath: "./exclude/",
          dataDirPath: "./exclude/",
          options: "",
        },
      },
      {
        message: "valid options schema",
        throwError: true,
        dto: {
          userId: "emailId",
          clientSecretFilePath: "./exclude/",
          dataDirPath: "./exclude/",
          options: {
            saveUser: "true",
            saveDate: true,
            port: "3000",
          },
        },
      },
    ])("$message", async ({ dto, throwError }) => {
      let occurError = false;
      try {
        const result = initValidator.constructorInput(dto as any);
      } catch (error) {
        occurError = true;
      }
      if (throwError) {
        expect(occurError).toEqual(true);
      } else {
        expect(occurError).toEqual(false);
      }
    });
  });
});
