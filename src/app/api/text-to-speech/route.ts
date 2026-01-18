import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, lang } = await req.json();

    if (!text || !lang) {
      return NextResponse.json(
        { error: "Text and language code are required" },
        { status: 400 }
      );
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("API key is not configured.");
    }
    const URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

    const voiceConfig = lang === 'hi-IN' 
        ? { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-B' }
        : { languageCode: 'en-US', name: 'en-US-Wavenet-D' };

    const apiResponse = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: { text },
        voice: voiceConfig,
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 1.0, // Normal speed
        },
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("Google TTS API Error Details:", errorData);
      throw new Error(errorData.error?.message || `TTS API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    const audioContent = data.audioContent;

    if (!audioContent) {
        throw new Error("Empty audio response from TTS API.");
    }
    
    return NextResponse.json({
      success: true,
      audioDataUri: `data:audio/mp3;base64,${audioContent}`,
    });

  } catch (error: any) {
    console.error(`TTS API Error: ${error.message}`);
    return NextResponse.json(
      { error: `Failed to generate speech: ${error.message}` },
      { status: 500 }
    );
  }
}
