interface ISuccessResponse<T> {
  isSuccess: true;
  data?: T;
  message: string;
}

interface IErrorResponse<T> {
  isSuccess: false;
  error: string;
}

export type APIResponse<T> = ISuccessResponse<T> | IErrorResponse<T>;
