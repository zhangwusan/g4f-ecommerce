// src/middleware/errorHandler.ts
import { NextRequest, NextResponse } from "next/server";

export function errorHandlerMiddleware(request: NextRequest) {
  try {
    return NextResponse.next(); // Allow the request to continue
  } catch (error) {
    // Catch any errors that occur in the middleware stack
    console.error('Middleware error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}