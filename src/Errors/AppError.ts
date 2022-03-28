interface IAppError {
    message: string;
    errorCode?: number;
}

class AppError {
    public readonly message: string;

    public readonly errorCode: number | undefined;

    constructor({ message, errorCode }: IAppError) {
        this.message = message;
        this.errorCode = errorCode;
    }
}

export default AppError;
