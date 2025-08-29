/**
 * Health Check API Endpoint
 * Simple endpoint to verify the development server is running for visual tests
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Mr. Timely Development Server',
    version: process.env.npm_package_version || '0.1.0'
  });
}