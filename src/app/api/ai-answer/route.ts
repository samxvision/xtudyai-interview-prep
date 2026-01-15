import { NextRequest, NextResponse } from "next/server";
import { generateAiAnswer } from "@/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const answer = await generateAiAnswer(question);

    return NextResponse.json({
      success: true,
      answer, // The answer is already a JSON object
    });
  } catch (error: any) {
    console.error(`API Error: ${error.message}`);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
