import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import QuizResult from "@/models/QuizResult";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract subject from the URL query parameters
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");

    // Build the query object
    const query = { userId };
    if (subject) {
      query.subject = subject;
    }

    const results = await QuizResult.find(query)
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB(); // Use the same connection helper as GET
    
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { score, totalQuestions, subject } = body;

    // Server-side validation
    if (typeof score !== 'number' || !totalQuestions) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const accuracy = (score / totalQuestions) * 100;

    const newResult = await QuizResult.create({
      userId: userId, // Use userId from getAuth
      subject: subject || "Data Structures",
      score,
      totalQuestions,
      accuracy,
    });

    return NextResponse.json(newResult, { status: 201 });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}