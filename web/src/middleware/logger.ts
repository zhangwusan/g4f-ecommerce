import { NextRequest, NextResponse } from "next/server";

export function loggerMiddleware(request: NextRequest) {
  // Create the response (this allows the request to continue)
  const response = NextResponse.next();  

  // Get the current time
  const timeStamp = new Date().toISOString();

  // Log incoming request details without colors
  console.info(`[${timeStamp}] Incoming request to ${request.nextUrl.pathname}`);

  // You can log other details like request headers, method, etc.
  console.info(`[${timeStamp}] Method: ${request.method}`);
  console.info(`[${timeStamp}] User-Agent: ${request.headers.get('user-agent')}`);

  // Setting custom headers in the response
  response.headers.set('X-Custom-Header', 'LoggerMiddlewareApplied');
  response.headers.set('X-Request-Path', request.nextUrl.pathname);

  return response;
}