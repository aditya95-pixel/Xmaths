import connectDB from "@/config/db";
import MCQ from "@/models/MCQ";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");

    // 1. Define the match stage (filter by subject if provided)
    const matchStage = subject 
      ? { $match: { subject: new RegExp(subject, "i") } } 
      : { $match: {} };

    // 2. Use aggregation to get 10 random documents
    const mcqs = await MCQ.aggregate([
      matchStage,
      { $sample: { size: 10 } }
    ]);

    return NextResponse.json(mcqs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch random questions", details: error.message }, 
      { status: 500 }
    );
  }
}