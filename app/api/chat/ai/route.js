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
        console.log(userPrompt);
        data.messages.push(userPrompt);
        
        const completion=await genAI.models.generateContent({
            model:'gemini-2.0-flash-001',
            contents:prompt
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