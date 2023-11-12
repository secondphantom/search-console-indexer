export declare class ServiceError extends Error {
    private code;
    constructor({ code, message }: {
        code: number;
        message: string;
    });
    getMessage: () => {
        code: number;
        message: string;
    };
}
export declare const errorResolver: (error: any, defaultMessage?: {
    code: number;
    message: string;
}) => {
    code: number;
    message: string;
};
export declare const invalidInput: ServiceError;
