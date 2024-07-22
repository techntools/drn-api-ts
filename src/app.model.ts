export type TResponse<T> =
  | {
      data: T;
    }
  | { errors: { code: string; message: string }[] };
