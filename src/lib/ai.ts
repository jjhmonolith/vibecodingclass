import OpenAI from "openai";
import { Phase, Message, ChatResponse } from "./types";
import { buildSystemPrompt } from "./prompts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(
  topic: string,
  messages: Message[],
  currentHtml: string | null,
  phase: Phase
): Promise<ChatResponse> {
  const systemPrompt = buildSystemPrompt(topic, phase);

  const inputMessages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }> = [];

  if (currentHtml) {
    inputMessages.push({
      role: "system",
      content: `현재 생성된 HTML:\n\`\`\`html\n${currentHtml}\n\`\`\``,
    });
  }

  for (const msg of messages) {
    inputMessages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  if (inputMessages.length === 0) {
    inputMessages.push({
      role: "user",
      content: `"${topic}" 주제로 바이브코딩을 시작할게!`,
    });
  }

  const response = await client.responses.create({
    model: "gpt-5.2",
    instructions: systemPrompt,
    input: inputMessages,
    reasoning: {
      effort: "medium",
      summary: "auto",
    },
    text: {
      format: {
        type: "json_schema",
        name: "chat_response",
        strict: true,
        schema: {
          type: "object",
          properties: {
            message: { type: "string", description: "학생에게 보여줄 메시지" },
            html: {
              type: ["string", "null"],
              description: "생성된 HTML 코드 또는 null",
            },
            phase: {
              type: "string",
              enum: [
                "intro",
                "spec",
                "confirm_spec",
                "generate",
                "modify",
                "confirm_modify",
              ],
              description: "다음 대화 단계",
            },
          },
          required: ["message", "html", "phase"],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(response.output_text) as ChatResponse;
  return parsed;
}
