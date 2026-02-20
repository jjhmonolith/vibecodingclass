import { ImageSlot } from "./types";

export function extractSlots(html: string): ImageSlot[] {
  const slots: ImageSlot[] = [];
  const imgRegex = /<img\s[^>]*data-slot="([^"]+)"[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(html)) !== null) {
    const tag = match[0];
    const name = match[1];
    const srcMatch = tag.match(/src="([^"]+)"/);
    const currentSrc = srcMatch ? srcMatch[1] : "";
    const isPlaceholder = currentSrc.includes("placehold.co");

    slots.push({ name, currentSrc, isPlaceholder });
  }

  return slots;
}

export function replaceSlotImage(
  html: string,
  slotName: string,
  newSrc: string
): string {
  const tagRegex = new RegExp(
    `<img\\s[^>]*data-slot="${escapeRegex(slotName)}"[^>]*>`,
    "gi"
  );
  return html.replace(tagRegex, (tag) =>
    tag.replace(/src="[^"]*"/, `src="${newSrc}"`)
  );
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
