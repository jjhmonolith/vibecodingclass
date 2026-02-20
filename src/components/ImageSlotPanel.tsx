"use client";

import { useState, useRef } from "react";
import { ImageSlot } from "@/lib/types";
import { fileToBase64 } from "@/lib/image-utils";
import PexelsSearchModal from "./PexelsSearchModal";

interface ImageSlotPanelProps {
  slots: ImageSlot[];
  onReplace: (slotName: string, base64: string) => void;
}

export default function ImageSlotPanel({
  slots,
  onReplace,
}: ImageSlotPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchSlot, setSearchSlot] = useState<string | null>(null);

  if (slots.length === 0) return null;

  return (
    <div className="border-b border-gray-200 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>이미지 교체 ({slots.length}개 슬롯)</span>
        <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="px-4 pb-3 flex flex-wrap gap-3">
          {slots.map((slot) => (
            <SlotItem
              key={slot.name}
              slot={slot}
              onReplace={onReplace}
              onSearch={() => setSearchSlot(slot.name)}
            />
          ))}
        </div>
      )}

      {searchSlot && (
        <PexelsSearchModal
          slotName={searchSlot}
          onSelect={(slotName, imageUrl) => onReplace(slotName, imageUrl)}
          onClose={() => setSearchSlot(null)}
        />
      )}
    </div>
  );
}

function SlotItem({
  slot,
  onReplace,
  onSearch,
}: {
  slot: ImageSlot;
  onReplace: (slotName: string, base64: string) => void;
  onSearch: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    onReplace(slot.name, base64);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
      <img
        src={slot.currentSrc}
        alt={slot.name}
        className="w-10 h-10 object-cover rounded border border-gray-300"
      />
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-700">{slot.name}</span>
        {slot.isPlaceholder ? (
          <span className="text-[10px] text-orange-500">플레이스홀더</span>
        ) : (
          <span className="text-[10px] text-green-600">업로드됨</span>
        )}
      </div>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="ml-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {slot.isPlaceholder ? "업로드" : "변경"}
      </button>
      <button
        onClick={onSearch}
        className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        검색
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
