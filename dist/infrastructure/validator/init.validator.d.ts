import { IInitValidator } from "../../controller/init/init.interface";
import { SearchConsoleIndexerConstructorInput } from "../../contract/init.contract";
export declare class InitValidator implements IInitValidator {
    private constructorInputSchema;
    constructorInput: (constructorInput: SearchConsoleIndexerConstructorInput) => {
        userId: string;
        clientSecretFilePath: string;
        dataDirPath: string;
        options?: {
            saveUser?: boolean | undefined;
            saveData?: boolean | undefined;
            port?: number | undefined;
        } | undefined;
    };
}
