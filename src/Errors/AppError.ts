interface IAppError {
    message: string;
    errorCode?: number;
}

class AppError extends Error {
    public readonly message: string;

    public readonly errorCode: number | undefined;

    constructor({ message, errorCode }: IAppError) {
        super();

        this.message = message;
        this.errorCode = errorCode;
    }
}

export default AppError;
