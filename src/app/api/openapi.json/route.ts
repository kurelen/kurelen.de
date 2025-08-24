import { NextResponse } from "next/server";
import { getOpenAPIDocument } from "@/lib/openapi";

export async function GET() {
  const doc = getOpenAPIDocument();
  return NextResponse.json(doc);
}
