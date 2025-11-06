import { Request, Response, NextFunction } from 'express';
import { UnifiedResponse, ErrorDetails } from '../../types/types';
import HttpError from './HttpError';
import { ZodError } from 'zod';

const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            error: err,
        });
    } else {
        console.error('Error occurred:', {
            message: err.message,
            statusCode: err instanceof HttpError ? err.statusCode : 500,
        });
    }

    if (err instanceof ZodError) {
        const httpError = HttpError.validation(err);

        res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            data: undefined,
            error: {
                message: 'Validation failed',
                ...(isDevelopment && { errorLog: err.message }),
                data: httpError.error.data,
            },
        });
        return;
    }

    const isHttpError = err instanceof HttpError;
    const statusCode = isHttpError ? err.statusCode : 500;
    const message = err.message || 'An error occurred on the server.';
    
    const errorLog = isDevelopment && isHttpError && err.error ? err.error.errorLog : undefined;

    const errorResponse: ErrorDetails = {
        message,
        ...(isDevelopment && errorLog && { errorLog }),
        ...(isDevelopment && err.stack && { stackTrace: err.stack }),
        data: isHttpError && err.error ? err.error.data : undefined,
    };

    const response: UnifiedResponse = {
        status: 'error',
        message,
        data: undefined,
        error: errorResponse,
    };

    res.status(statusCode).json(response);
};

export default ErrorHandler;
