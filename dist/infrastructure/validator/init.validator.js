"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const error_1 = require("../../domain/error");
class InitValidator {
    constructorInputSchema = zod_1.default.object({
        userId: zod_1.default.string().min(1),
        clientSecretFilePath: zod_1.default.string().min(1),
        dataDirPath: zod_1.default.string().min(1),
        options: zod_1.default
            .object({
            saveUser: zod_1.default.boolean().optional(),
            saveData: zod_1.default.boolean().optional(),
            port: zod_1.default.number().optional(),
        })
            .optional(),
    });
    constructorInput = (constructorInput) => {
        try {
            const dto = this.constructorInputSchema.parse(constructorInput);
            return dto;
        }
        catch (error) {
            throw error_1.invalidInput;
        }
    };
}
exports.InitValidator = InitValidator;
