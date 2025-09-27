"use client";

import HandwritingCanvas from "@/app/components/HandwritingCanvas";

export default function HandwritingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Handwriting</h1>
      </div>

      <div className="space-y-4">
        <HandwritingCanvas />
      </div>
    </div>
  );
}
