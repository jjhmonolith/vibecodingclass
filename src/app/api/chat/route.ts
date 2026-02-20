import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/ai";
import { ChatRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const { topic, messages, currentHtml, phase } = body;

    if (!topic || !messages || !phase) {
      return NextResponse.json(
        { error: "topic, messages, phase는 필수입니다." },
        { status: 400 }
      );
    }

    const result = await chat(topic, messages, currentHtml, phase);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: `AI 응답 중 오류: ${message}` },
      { status: 500 }
    );
  }
}
