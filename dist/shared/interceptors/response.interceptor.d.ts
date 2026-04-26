import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface TResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    result: T;
    path: string;
    duration: number;
    timestamp: number;
}
export declare class ResponseInterceptor<T> implements NestInterceptor<T, TResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<TResponse<T>>;
    private responseHandler;
    private errorHandler;
}
