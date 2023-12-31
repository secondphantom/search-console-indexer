import { IInitValidator } from "../../controller/init/init.interface";
import z from "zod";
import { invalidInput } from "../../domain/error";
import { SearchConsoleIndexerConstructorInput } from "../../contract/init.contract";

export class InitValidator implements IInitValidator {
  private constructorInputSchema = z.object({
    userId: z.string().min(1),
    clientSecretFilePath: z.string().min(1),
    dataDirPath: z.string().min(1),
    options: z
      .object({
        saveUser: z.boolean().optional(),
        saveData: z.boolean().optional(),
        port: z.number().optional(),
      })
      .optional(),
  });

  constructorInput = (
    constructorInput: SearchConsoleIndexerConstructorInput
  ) => {
    try {
      const dto = this.constructorInputSchema.parse(constructorInput);
      return dto;
    } catch (error) {
      throw invalidInput;
    }
  };
}
