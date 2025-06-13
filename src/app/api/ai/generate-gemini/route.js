import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // Make sure we have a prompt
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid prompt" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Google API key not configured. Please set the GOOGLE_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // console.log(text);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error in Gemini generation:", error);
    return NextResponse.json(
      {
        message: "There was an error processing your request with Gemini API",
        details: error,
      },
      { status: 500 }
    );
  }
}
