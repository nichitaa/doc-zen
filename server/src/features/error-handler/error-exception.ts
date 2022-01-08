export class ErrorException extends Error {
  public readonly statusCode: number;
  public readonly error: string;

  constructor(statusCode: number, error: string) {
    super(error);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.error = error;
  }
}