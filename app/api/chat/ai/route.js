export const maxDuration = 60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    // ⬇ Use formData instead of req.json()
    const formData = await req.formData();
    const chatId = formData.get("chatId");
    const prompt = formData.get("prompt");
    const image = formData.get("image"); // File object if uploaded
    const domain = formData.get("domain");
    await connectDB();
    const data = await Chat.findOne({ userId, _id: chatId });
    const isFirstMessage = (data.messages.length === 0);
    const userPrompt = {
      role: "user",
      content: prompt,
      image: image ? "uploaded" : null, // you can store URL later
      timestamp: Date.now(),
    };
    data.messages.push(userPrompt);

    // Chat memory
    let prompt_with_chat_memory = "";
    for (let i = 0; i < data.messages.length; i++) {
      prompt_with_chat_memory +=
        String(data.messages[i].role) +
        "\n" +
        String(data.messages[i].content) +
        "\n";
    }

    // If an image is uploaded, handle it
    let geminiImagePart = null;
    if (image) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const imageBase64 = buffer.toString("base64");

    geminiImagePart = {
        inlineData: {
        data: imageBase64,
        mimeType: image.type, // e.g. "image/png" or "image/jpeg"
        },
    };
    }

    let content = `
      You are an expert in ${domain || "Mathematics, Algorithms, Linear Algebra, Machine Learning, and Deep Learning"}. 
      You have a deep understanding of theoretical concepts, practical applications, and the ability to explain complex ideas clearly.

      **Instructions:**
      1. Analyze the conversation and provide an accurate, efficient solution.
      2. Format your response using standard Markdown.
        - **TABLES:** If question needs generating a table, you MUST use proper line breaks after the header, the separator line, and every individual row. Never output a table on a single continuous line.
      3. For mathematical equations, use LaTeX: $inline$ or $$block$$.
      4. **DIAGRAMS (USE WHEN AND IF NECESSARY):**        - ONLY generate a Mermaid.js diagram if the problem fundamentally requires visual mapping to be understood (e.g., tracing a complex graph algorithm, defining a DFA/NFA state machine, or visualizing an intricate tree data structure).
        - Do NOT generate diagrams for basic algebra, simple logical steps, general text explanations, or standard code structure where a diagram adds no new informative value.
        - If a diagram is strictly necessary, use valid Mermaid.js v11.13.0 syntax inside a \`\`\`mermaid code block.
        - Do not put any comments in the Mermaid.js code.
          ---
      Conversation History:
      ${prompt_with_chat_memory}
    `;
    const modelsToTry = [
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemma-4-31b-it",
      "gemma-4-26b-it",
      "gemini-2.0-flash",
      "gemma-3-27b-it"
    ];
    
    let completion = null;
    for (const modelName of modelsToTry) {
      try {
        completion = await genAI.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [
                { text: content },
                ...(geminiImagePart ? [geminiImagePart] : []),
              ],
            },
          ],
        });
        break; 
      } catch (error) {
        if (modelName === modelsToTry[modelsToTry.length - 1]) {
          throw new Error("All models failed to generate content.");
        }
      }
    }

    const message = completion.text;
    const systemResponse = {
      role: "system",
      content: message,
      timestamp: Date.now(),
    };

    data.messages.push(systemResponse);
    if (isFirstMessage) {
      try {
        const titlePrompt = `Generate a short, concise 3-5 word title for a chat that begins with this message: "${prompt}". Output ONLY the title text, no quotes or formatting.`;
        const titleResult = await genAI.models.generateContent({
          model:"gemma-3-27b-it",
          contents:titlePrompt
        });
        const generatedTitle = titleResult.text;
        // Update the document
        data.name = generatedTitle; 
      } catch (titleError) {
        data.name = prompt.substring(0, 30) + "..."; // Fallback
      }
    }

    await data.save();

    return NextResponse.json({
      success: true,
      data: systemResponse,
      isFirstMessage: isFirstMessage
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}