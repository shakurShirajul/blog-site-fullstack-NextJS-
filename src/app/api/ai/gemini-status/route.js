import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        {
          configured: false,
          message:
            "Google API key not configured. Please set the GOOGLE_API_KEY environment variable.",
        },
        { status: 200 }
      );
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Test the API with a simple prompt
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;

    console.log(response);

    return NextResponse.json({
      configured: true,
      message: "Gemini API is configured and working",
      models: ["gemini-pro", "gemini-pro-vision"],
    });
  } catch (error) {
    console.error("Error checking Gemini API status:", error);
    return NextResponse.json({
      configured: false,
      message: `Failed to connect to Gemini API: ${error.message}`,
    });
  }
}
