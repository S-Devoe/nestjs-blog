/**
 * @description Custom error response DTO for handling errors in a consistent format.
 */
export class CustomErrorResponseDto {
  data: null;
  message: string;
  statusCode: number;
  success: boolean;

  constructor(message: string, statusCode: number) {
    this.data = null;
    this.message = message;
    this.statusCode = statusCode;
    this.success = false;
  }
}
