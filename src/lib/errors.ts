export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message);
    }
}

export class FileProcessingError extends AppError {
    constructor(message: string) {
        super(422, message);
    }
}

export class OpenAIError extends AppError {
    constructor(message: string) {
        super(502, `OpenAI API Error: ${message}`);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string) {
        super(500, `Database Error: ${message}`);
    }
}
