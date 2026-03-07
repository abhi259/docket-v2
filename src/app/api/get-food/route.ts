import { NextResponse } from "next/server";
import foodData from "./Foods.json";

export async function GET() {
  return NextResponse.json(foodData);
}