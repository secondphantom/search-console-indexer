export class ServiceError extends Error {
  private code: number;
  constructor({ code, message }: { code: number; message: string }) {
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

export const errorResolver = (
  error: any,
  defaultMessage?: { code: number; message: string }
) => {
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
    } catch (error) {}
  }
  return message;
};

export const invalidInput = new ServiceError({
  code: 400,
  message: "Invalid Input",
});
