import { NextRequest, NextResponse } from "next/server";
import { PexelsPhoto, PexelsSearchResponse } from "@/lib/types";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "query 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "PEXELS_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&locale=ko-KR`;

  const res = await fetch(url, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Pexels API 요청 실패" },
      { status: res.status }
    );
  }

  const data = await res.json();

  const response: PexelsSearchResponse = {
    photos: data.photos.map((p: Record<string, unknown>): PexelsPhoto => ({
      id: p.id as number,
      src: {
        small: (p.src as Record<string, string>).small,
        medium: (p.src as Record<string, string>).medium,
      },
      photographer: p.photographer as string,
      alt: (p.alt as string) || "",
    })),
    total_results: data.total_results,
  };

  return NextResponse.json(response);
}
