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

export interface ImageSlot {
  name: string;
  currentSrc: string;
  isPlaceholder: boolean;
}

export interface PexelsPhoto {
  id: number;
  src: { small: string; medium: string };
  photographer: string;
  alt: string;
}

export interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  total_results: number;
}
