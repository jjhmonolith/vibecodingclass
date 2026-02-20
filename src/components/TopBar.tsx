"use client";

interface TopBarProps {
  topic: string;
  onReset: () => void;
}

export default function TopBar({ topic, onReset }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-gray-800">
          바이브코딩 교실
        </span>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          {topic}
        </span>
      </div>
      <button
        onClick={onReset}
        className="text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
      >
        처음부터
      </button>
    </div>
  );
}
