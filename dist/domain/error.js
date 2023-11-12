"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidInput = exports.errorResolver = exports.ServiceError = void 0;
class ServiceError extends Error {
    code;
    constructor({ code, message }) {
        super(message);
        this.code = code;
    }
    getMessage = () => {
        return {
            code: this.code,
            message: this.message,
        };
    };
}
exports.ServiceError = ServiceError;
const errorResolver = (error, defaultMessage) => {
    let message = defaultMessage
        ? defaultMessage
        : {
            code: 505,
            message: "Internal Error",
        };
    if (error instanceof Error) {
        try {
            //@ts-ignore
            message = error.getMessage();
        }
        catch (error) { }
    }
    return message;
};
exports.errorResolver = errorResolver;
exports.invalidInput = new ServiceError({
    code: 400,
    message: "Invalid Input",
});
