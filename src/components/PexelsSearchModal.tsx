"use client";

import { useState } from "react";
import { PexelsPhoto, PexelsSearchResponse } from "@/lib/types";

interface PexelsSearchModalProps {
  slotName: string;
  onSelect: (slotName: string, imageUrl: string) => void;
  onClose: () => void;
}

export default function PexelsSearchModal({
  slotName,
  onSelect,
  onClose,
}: PexelsSearchModalProps) {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/search-images?query=${encodeURIComponent(trimmed)}`
      );
      if (!res.ok) throw new Error("검색 실패");
      const data: PexelsSearchResponse = await res.json();
      setPhotos(data.photos);
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSelect = (photo: PexelsPhoto) => {
    onSelect(slotName, photo.src.medium);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800">
              이미지 검색 — {slotName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색어 입력 (예: sunset, office)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "검색중..." : "검색"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {loading && (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              이미지를 검색하고 있습니다...
            </div>
          )}

          {!loading && searched && photos.length === 0 && (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              검색 결과가 없습니다.
            </div>
          )}

          {!loading && photos.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => handleSelect(photo)}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <img
                      src={photo.src.small}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                      <span className="text-white text-[10px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity truncate w-full">
                        {photo.photographer}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-3 text-center">
                Photos provided by Pexels
              </p>
            </>
          )}

          {!loading && !searched && (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              검색어를 입력하고 검색 버튼을 누르세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
