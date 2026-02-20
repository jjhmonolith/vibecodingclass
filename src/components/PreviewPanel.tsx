"use client";

import { ImageSlot } from "@/lib/types";
import ImageSlotPanel from "./ImageSlotPanel";

interface PreviewPanelProps {
  html: string | null;
  slots: ImageSlot[];
  onReplaceImage: (slotName: string, base64: string) => void;
}

export default function PreviewPanel({
  html,
  slots,
  onReplaceImage,
}: PreviewPanelProps) {
  if (!html) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-lg font-medium">여기에 결과가 표시돼요</p>
          <p className="text-sm mt-1">AI와 대화하면 웹 페이지가 만들어져요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ImageSlotPanel slots={slots} onReplace={onReplaceImage} />
      <div className="flex-1">
        <iframe
          srcDoc={html}
          sandbox="allow-scripts"
          className="w-full h-full border-0 bg-white"
          title="미리보기"
        />
      </div>
    </div>
  );
}
