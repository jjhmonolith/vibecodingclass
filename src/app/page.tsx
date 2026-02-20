"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  const handleStart = () => {
    const trimmed = topic.trim();
    if (!trimmed) return;
    router.push(`/workspace?topic=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleStart();
    }
  };

  const examples = [
    "나만의 자기소개 페이지",
    "우리 반 소개 페이지",
    "좋아하는 동물 도감",
    "나의 취미 소개",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            바이브코딩 교실
          </h1>
          <p className="text-gray-500 text-lg">
            코드를 몰라도 괜찮아! AI와 대화하며 웹 페이지를 만들어보자
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            어떤 주제로 만들어볼까?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 나만의 자기소개 페이지"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mb-4"
            autoFocus
          />

          <div className="flex flex-wrap gap-2 mb-6">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setTopic(ex)}
                className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 px-3 py-1.5 rounded-full transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={!topic.trim()}
            className="w-full rounded-xl bg-blue-500 py-3 text-base font-semibold text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
