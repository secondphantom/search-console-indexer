import { SearchConsoleIndexerConstructorInput } from "../../contract/init.contract";

export type IInitValidator = {
  constructorInput: (
    constructorInput: SearchConsoleIndexerConstructorInput
  ) => SearchConsoleIndexerConstructorInput;
};
