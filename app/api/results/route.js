import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import connectDB from "@/config/db";
import QuizResult from "@/models/QuizResult";

// Initialize GenAI
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");

    const query = { userId };
    if (subject) {
      query.subject = subject;
    }

    const results = await QuizResult.find(query)
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json(results);
  } catch (error) {
    console.error("API GET Error:", error);
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
    const { score, totalQuestions, subject, userMistakes = [] } = body; 

    // Server-side validation
    if (typeof score !== 'number' || !totalQuestions) {
      return NextResponse.json({ error: "Invalid data", details: "Score or totalQuestions missing" }, { status: 400 });
    }

    const accuracy = (score / totalQuestions) * 100;

    // STEP 1: Save to database FIRST. If AI crashes later, user results are still safe.
    const newResult = await QuizResult.create({
      userId: userId,
      subject: subject || "Data Structures",
      score,
      totalQuestions,
      accuracy,
    });

    // STEP 2: Isolate AI generation so it cannot crash the database transaction
    let explanation = "";
    try {
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
        model: "gemini-2.5-flash", 
        contents: [
          {
            role: "user",
            parts: [{ text: explanationPrompt }],
          },
        ],
      });
      
      explanation = completion.text || "Great effort completing the quiz! Keep practicing.";
    } catch (aiError) {
      // If AI fails, log it but don't crash the request!
      console.error("AI Generation failed silently to save user UX:", aiError);
      explanation = "Your quiz score was saved successfully! However, the AI tutor feedback is temporarily unavailable. Great work!";
    }

    // STEP 3: Return payload safely
    return NextResponse.json({ 
      result: newResult, 
      explanation: explanation 
    }, { status: 201 });

  } catch (error) {
    console.error("API CRITICAL POST Error (Database failed):", error);
    return NextResponse.json({ error: "Failed to process and save quiz request" }, { status: 500 });
  }
}