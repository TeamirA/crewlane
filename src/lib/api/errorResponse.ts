import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import {
  DomainError,
  type DomainErrorCode,
  RateLimitError,
} from "@/core/domain/errors/domainErrors";
import type { ApiErrorBody } from "@/types/api";

const STATUS_BY_ERROR_CODE: Record<DomainErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
};

function buildErrorResponse(status: number, body: ApiErrorBody, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

export function mapErrorToResponse(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof ZodError) {
    const details = z.flattenError(error).fieldErrors;
    return buildErrorResponse(400, {
      error: { message: "Invalid request", code: "VALIDATION_ERROR", details },
    });
  }
  if (error instanceof DomainError) {
    const headers =
      error instanceof RateLimitError
        ? { "Retry-After": String(error.retryAfterSeconds) }
        : undefined;
    const body = { error: { message: error.message, code: error.code, details: error.details } };
    return buildErrorResponse(STATUS_BY_ERROR_CODE[error.code], body, headers);
  }
  console.error("Unhandled API error", error);
  return buildErrorResponse(500, {
    error: { message: "Something went wrong", code: "INTERNAL_ERROR" },
  });
}
