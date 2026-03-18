import connectDB from "@/config/db";
import Resource from "@/models/Resource";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const resources = await Resource.find({ category }).sort({ order: 1 });

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}