/**
 * Custom response DTO for API responses.
 * @description: This class is used to standardize the structure of API responses.
 * It includes properties for the data, message, status code, and success status.
 *
 */
export class CustomDataResponseDto<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;

  constructor(data: T, message: string, statusCode: number, success: boolean) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.success = success;
  }
}
