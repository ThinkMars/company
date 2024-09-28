import type { ErrorType } from "../src/constants";

export interface IReqEndRes {
  duration?: number;
  requestUrl?: string;
  response?: string | Response;
  context?: any;
  requestMethod?: string;
  requestData?: any;
  status: number;
}

export interface BaseError {
  errorType: ErrorType;
  url?: string | undefined;
  path?: string | undefined;
  context?: any;
}

export interface IHttpReqErrorRes extends BaseError {
  requestMethod: string | undefined;
  requestUrl: string | undefined;
  requestData: string | null;
  errorMsg?: string | undefined;
  status?: number;
}
