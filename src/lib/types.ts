export type Phase =
  | "intro"
  | "spec"
  | "confirm_spec"
  | "generate"
  | "modify"
  | "confirm_modify";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  topic: string;
  messages: Message[];
  currentHtml: string | null;
  phase: Phase;
}

export interface ChatResponse {
  message: string;
  html: string | null;
  phase: Phase;
}
