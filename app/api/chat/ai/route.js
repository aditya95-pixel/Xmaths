export const maxDuration=60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export async function POST(req){
    try {
        const {userId}=getAuth(req);
         if(!userId){
            return NextResponse.json({
                success:false,
                message:"User not authenticated"
            });
        }
        const {chatId,prompt}=await req.json();
        await connectDB();
        const data=await Chat.findOne({userId,_id:chatId});
        const userPrompt={
            role:"user",
            content:prompt,
            timestamp:Date.now()
        };
        data.messages.push(userPrompt);

        // Chat Memory
        let prompt_with_chat_memory="";
        for(let i=0;i<data.messages.length;i++){
            prompt_with_chat_memory+=String(data.messages[i].role)+"\n"+String(data.messages[i].content)+"\n";
        }

        // Specialised prompt for maths specialisation
        let content=`
        You are an expert in Mathematics, Algorithms, Linear Algebra, Machine Learning, and Deep Learning. You have a deep understanding of theoretical concepts, practical applications, and the ability to explain complex ideas clearly and concisely.

        Given the following conversation and problem, analyze the discussion and provide a solution that is accurate, efficient, and easy to understand. Your solution should leverage your expertise in the aforementioned domains.

        Please format your response using Markdown syntax. For mathematical equations, use LaTeX notation wrapped in $ for inline equations or $$ for block equations. For superscripts/subscripts, use LaTeX notation (_{} and ^{}) rather than HTML tags.
        ---
        
        ${prompt_with_chat_memory}
        `
        const completion=await genAI.models.generateContent({
            model:'gemini-2.0-flash-001',
            contents:content
        });
        
        const message=completion.text;
        const systemRespose={
            role:"system",
            content:message,
            timestamp:Date.now()
        };
        data.messages.push(systemRespose);
        data.save();
        return NextResponse.json({success:true,data:systemRespose});
    } catch (error) {
        return NextResponse.json({success:false,error:error.message});
    }
}