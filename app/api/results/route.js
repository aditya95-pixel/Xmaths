import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import connectDB from "@/config/db";
import QuizResult from "@/models/QuizResult";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    await connectDB();
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { score, totalQuestions, subject, userMistakes } = body; 

    // Server-side validation
    if (typeof score !== 'number' || !totalQuestions) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const explanationPrompt = `
      You are an expert tutor. 
      
      TASK:
      ${userMistakes.length === 0 
        ? "The user answered all questions correctly! Provide a short, enthusiastic, and encouraging congratulatory message praising their mastery of the subject." 
        : `The user made the following mistakes: ${JSON.stringify(userMistakes)}. 
          Explain these mistakes in a clear, encouraging way. Provide concise, actionable feedback for each concept they got wrong.`
      }
    `;

    const completion = await genAI.models.generateContent({
      model: "gemma-3-27b-it",
      contents: [
        {
          role: "user",
          parts: [{ text: explanationPrompt}],
        },
      ],
    });
    const explanation = completion.text;

    const accuracy = (score / totalQuestions) * 100;

    const newResult = await QuizResult.create({
      userId: userId,
      subject: subject || "Data Structures",
      score,
      totalQuestions,
      accuracy,
    });

    // Send both the saved result and the AI-generated explanation to the frontend
    return NextResponse.json({ 
      result: newResult, 
      explanation: explanation 
    }, { status: 201 });

  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}