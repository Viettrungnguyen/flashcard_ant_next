// app/flashcards/layout.tsx
import type { ReactNode } from "react";

export default function FlashcardsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* optional sub-header for flashcards section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Flashcards</h2>
        <div className="text-sm text-gray-500">Study mode</div>
      </div>

      <div>{children}</div>
    </div>
  );
}
