/**
 * @fileoverview
 * This file contains a custom exception filter for handling all exceptions
 * in a NestJS application. It extends the built-in ExceptionFilter interface
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomErrorResponseDto } from '../data-response/error-response.dto';

/**
 * Global Exception Filter that customizes the response structure for errors.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error'; // Default message

    // Type narrow `exception` to `HttpException` to access its properties safely
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message || message;
    } else if (exception instanceof Error) {
      // If the exception is an instance of the `Error` class, we can safely access `.message`
      message = exception.message;
    }

    // Customize the error response format using the CustomErrorResponseDto
    const errorResponse = new CustomErrorResponseDto(message, status);

    // Send the customized error response
    response.status(status).json(errorResponse);
  }
}
