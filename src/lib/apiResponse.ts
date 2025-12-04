import { AppError } from './errors';

export function successResponse<T>(data: T, status = 200) {
    return Response.json(data, { status });
}

export function errorResponse(
    error: string,
    message: string,
    statusCode = 500
) {
    return Response.json(
        { error, message, statusCode },
        { status: statusCode }
    );
}

export function handleAPIError(error: unknown) {
    if (error instanceof AppError) {
        return errorResponse(error.name, error.message, error.statusCode);
    }

    console.error('Unexpected error:', error);
    return errorResponse(
        'InternalServerError',
        'An unexpected error occurred',
        500
    );
}
