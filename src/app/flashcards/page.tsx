// app/flashcards/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FlashcardUI from "@/app/components/FlashcardUI";
import { Button, Progress, Tag, Tooltip } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleTwoTone,
  CheckOutlined,
  RetweetOutlined,
} from "@ant-design/icons";

type Media = { url: string; type: "image" | "gif" | "audio" | "video" | "file" } | null;

type Card = {
  word: string;
  meaning: string;
  example?: string;
  media?: Media;
};

const initialCards: Card[] = [
  {
    word: "Apple",
    meaning: "A round fruit with red, green, or yellow skin.",
    example: "I eat an apple every morning.",
    media: { url: "/media/apple.jpg", type: "image" },
  },
  {
    word: "Cat",
    meaning: "A small domesticated carnivorous mammal.",
    example: "The cat sat on the mat.",
    media: { url: "/media/cat.gif", type: "gif" },
  },
  {
    word: "Hello",
    meaning: "A greeting.",
    example: "Hello! How are you?",
    media: { url: "/media/hello.mp3", type: "audio" },
  },
];

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [index, setIndex] = useState(0);
  const [remembered, setRemembered] = useState<Set<number>>(new Set());
  const [shuffle, setShuffle] = useState(false);

  const total = cards.length;
  const current = cards[index];
  const percent = Math.round((remembered.size / Math.max(1, total)) * 100);

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isCurrentRemembered = remembered.has(index);

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);

  const toggleRemember = useCallback(() => {
    setRemembered((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, [index]);

  // optional: shuffle deck UI-only
  const shuffleDeck = useCallback(() => {
    setShuffle((s) => !s);
    setCards((prev) => {
      if (shuffle) {
        // turn off shuffle → restore original order
        setIndex(0);
        return initialCards;
      } else {
        // turn on shuffle
        const arr = [...prev];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        setIndex(0);
        return arr;
      }
    });
    // remembered marks map to indices; clear for simplicity when shuffling
    setRemembered(new Set());
  }, [shuffle]);

  // keyboard: ← / → for nav, R to toggle remembered
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key.toLowerCase() === "r") toggleRemember();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, toggleRemember]);

  const DeckDots = useMemo(() => (
    <div className="flex flex-wrap gap-2">
      {cards.map((c, i) => {
        const active = i === index;
        const done = remembered.has(i);
        return (
          <Tooltip key={i} title={`${c.word}${done ? " • remembered" : ""}`}>
            <button
              onClick={() => setIndex(i)}
              className={[
                "h-8 px-3 rounded-full border text-sm",
                active ? "bg-black text-white border-black" : "bg-white",
                done ? "ring-2 ring-green-500" : "",
              ].join(" ")}
            >
              {i + 1}
            </button>
          </Tooltip>
        );
      })}
    </div>
  ), [cards, index, remembered]);

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header row: progress + quick actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Progress type="circle" percent={percent} size={54} />
          <div className="leading-tight">
            <div className="font-semibold">{remembered.size} / {total} remembered</div>
            <div className="text-xs text-gray-500">Use ← / → to navigate • Press “R” to mark</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip title="Shuffle deck (UI only)">
            <Button icon={<RetweetOutlined />} onClick={shuffleDeck} type={shuffle ? "primary" : "default"}>
              {shuffle ? "Shuffled" : "Shuffle"}
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-3">
          {isCurrentRemembered && (
            <Tag color="green" className="text-base py-1 px-2">
              <CheckCircleTwoTone twoToneColor="#52c41a" />&nbsp; Remembered
            </Tag>
          )}
        </div>

        <FlashcardUI
          word={current.word}
          meaning={current.meaning}
          example={current.example}
          media={current.media}
        />

        {/* Controls */}
        <div className="mt-6 flex items-center gap-3">
          <Button icon={<LeftOutlined />} onClick={goPrev} disabled={isFirst}>
            Previous
          </Button>

          <Button type={isCurrentRemembered ? "default" : "primary"} icon={<CheckOutlined />} onClick={toggleRemember}>
            {isCurrentRemembered ? "Unmark" : "Mark Remembered"}
          </Button>

          <Button icon={<RightOutlined />} onClick={goNext} disabled={isLast}>
            Next
          </Button>
        </div>
      </div>

      {/* Deck navigator */}
      <div className="pt-2 border-t">
        {DeckDots}
      </div>
    </div>
  );
}
