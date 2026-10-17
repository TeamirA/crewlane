export interface ApiSuccess<TData> {
  data: TData;
}

export interface ApiErrorBody {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export type ApiResponse<TData> = ApiSuccess<TData> | ApiErrorBody;
