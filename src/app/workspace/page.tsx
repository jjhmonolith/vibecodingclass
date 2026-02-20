"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Message, Phase, ChatResponse } from "@/lib/types";
import { extractSlots, replaceSlotImage } from "@/lib/image-utils";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import TopBar from "@/components/TopBar";

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentHtml, setCurrentHtml] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [isLoading, setIsLoading] = useState(false);

  const slots = useMemo(
    () => (currentHtml ? extractSlots(currentHtml) : []),
    [currentHtml]
  );

  const handleReplaceImage = useCallback(
    (slotName: string, base64: string) => {
      if (!currentHtml) return;
      const updatedHtml = replaceSlotImage(currentHtml, slotName, base64);
      setCurrentHtml(updatedHtml);
    },
    [currentHtml]
  );

  useEffect(() => {
    if (!topic) {
      router.push("/");
      return;
    }

    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            messages: [],
            currentHtml: null,
            phase: "intro",
          }),
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as ChatResponse;
        setMessages([{ role: "assistant", content: data.message }]);
        setPhase(data.phase);
      } catch {
        setMessages([
          {
            role: "assistant",
            content: `안녕! 오늘은 "${topic}"을 주제로 웹 페이지를 만들어볼 거야! 어떤 내용을 넣고 싶어?`,
          },
        ]);
        setPhase("spec");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();
  }, [topic, router]);

  const handleSend = useCallback(
    async (text: string) => {
      const userMessage: Message = { role: "user", content: text };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            messages: updatedMessages,
            currentHtml,
            phase,
          }),
        });

        if (!res.ok) {
          throw new Error("API 요청 실패");
        }

        const data = (await res.json()) as ChatResponse;

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);

        if (data.html) {
          setCurrentHtml(data.html);
        }

        setPhase(data.phase);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "앗, 잠깐 문제가 생겼어! 다시 한번 말해줄래?",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, currentHtml, phase, topic]
  );

  const handleReset = () => {
    router.push("/");
  };

  if (!topic) return null;

  return (
    <div className="h-screen flex flex-col">
      <TopBar topic={topic} onReset={handleReset} />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[40%] min-w-[320px] border-r border-gray-200">
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
            phase={phase}
          />
        </div>
        <div className="flex-1">
          <PreviewPanel
            html={currentHtml}
            slots={slots}
            onReplaceImage={handleReplaceImage}
          />
        </div>
      </div>
    </div>
  );
}

export default function Workspace() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-gray-400">
          로딩 중...
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
