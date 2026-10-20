import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { z } from "zod";

import { ValidationError } from "@/core/domain/errors/domainErrors";

import { mapErrorToResponse } from "./errorResponse";

type RouteContext<TParams> = { params: Promise<TParams> };

type RouteHandler<TParams> = (
  request: NextRequest,
  context: RouteContext<TParams>,
) => Promise<Response>;

export function createApiHandler<TParams = Record<string, never>>(
  handler: RouteHandler<TParams>,
): RouteHandler<TParams> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return mapErrorToResponse(error);
    }
  };
}

export async function parseRequestBody<TSchema extends z.ZodType>(
  request: NextRequest,
  schema: TSchema,
): Promise<z.infer<TSchema>> {
  const body: unknown = await request.json().catch(() => {
    throw new ValidationError("Request body must be valid JSON");
  });
  return schema.parse(body);
}

export function respondWithData<TData>(data: TData, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}
