// app/flashcards/[lessonId]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LESSONS, Lesson, Card as CardType } from "@/app/data/lessons";
import FlashcardUI from "@/app/components/FlashcardUI";
import { Button, Empty, Progress, Tag } from "antd";
import { LeftOutlined, RightOutlined, CheckOutlined } from "@ant-design/icons";

export default function LessonStudyPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId as string | undefined;

  // find lesson (fallback to first if missing)
  const lesson = useMemo<Lesson | undefined>(
    () => LESSONS.find((l) => l.id === lessonId),
    [lessonId]
  );

  // local state
  const [idx, setIdx] = useState(0);
  const [rememberedMap, setRememberedMap] = useState<
    Record<string, Set<string>>
  >({});

  useEffect(() => {
    setIdx(0);
    // load remembered map from localStorage
    try {
      const raw = localStorage.getItem("englearn.rememberedMap");
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string[]>;
        const rec: Record<string, Set<string>> = {};
        Object.entries(parsed).forEach(([k, arr]) => (rec[k] = new Set(arr)));
        setRememberedMap(rec);
      }
    } catch {}
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="py-12">
        <h2 className="text-xl font-semibold">Lesson not found</h2>
        <div className="mt-4">
          <Button onClick={() => router.push("/flashcards")}>
            Back to lessons
          </Button>
        </div>
      </div>
    );
  }

  const total = lesson.cards.length;
  const current: CardType | undefined = lesson.cards[idx];
  const rememberedSet = rememberedMap[lesson.id] ?? new Set<string>();
  const rememberedCount = rememberedSet.size;
  const percent = Math.round((rememberedCount / Math.max(1, total)) * 100);

  function goPrev() {
    setIdx((i) => Math.max(0, i - 1));
  }
  function goNext() {
    setIdx((i) => Math.min(total - 1, i + 1));
  }

  function toggleRemember() {
    if (!lesson) return;

    setRememberedMap((prev) => {
      const copy: Record<string, Set<string>> = { ...prev };
      const s = new Set(copy[lesson.id] ? Array.from(copy[lesson.id]) : []);
      if (current) {
        if (s.has(current.id)) s.delete(current.id);
        else s.add(current.id);
      }
      copy[lesson.id] = s;
      try {
        const serial = JSON.stringify(
          Object.fromEntries(
            Object.entries(copy).map(([k, s]) => [k, Array.from(s)])
          )
        );
        localStorage.setItem("englearn.rememberedMap", serial);
      } catch {}
      return copy;
    });
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{lesson.title}</h2>
          {lesson.description && (
            <p className="text-sm text-gray-500">{lesson.description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Progress type="circle" percent={percent} size={54} />
          <div className="text-sm">
            <div className="font-semibold">
              {rememberedCount} / {total} remembered
            </div>
          </div>
        </div>
      </div>

      {/* main study area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {current ? (
          <>
            <div className="mb-3">
              {rememberedSet.has(current.id) && (
                <Tag color="green">Remembered</Tag>
              )}
            </div>

            <FlashcardUI
              word={current.word}
              meaning={current.meaning}
              example={current.example}
              media={current.media}
              vi={current.vi}
              langCode={current.lang}
            />

            <div className="mt-6 flex items-center gap-3">
              <Button
                icon={<LeftOutlined />}
                onClick={goPrev}
                disabled={idx === 0}
              >
                Previous
              </Button>
              <Button
                type={rememberedSet.has(current.id) ? "default" : "primary"}
                icon={<CheckOutlined />}
                onClick={toggleRemember}
              >
                {rememberedSet.has(current.id) ? "Unmark" : "Mark Remembered"}
              </Button>
              <Button
                icon={<RightOutlined />}
                onClick={goNext}
                disabled={idx === total - 1}
              >
                Next
              </Button>
            </div>

            <div className="mt-6 flex gap-2 flex-wrap">
              {lesson.cards.map((c: CardType, i: number) => {
                const active = i === idx;
                const done = rememberedSet.has(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setIdx(i)}
                    className={[
                      "h-8 px-3 rounded-full border text-sm",
                      active ? "bg-black text-white border-black" : "bg-white",
                      done ? "ring-2 ring-green-500" : "",
                    ].join(" ")}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <Empty description="No cards in this lesson" />
        )}
      </div>

      {/* footer */}
      <div className="pt-2 border-t flex items-center justify-between">
        <Button onClick={() => router.push("/flashcards")}>
          Back to lessons
        </Button>
        <div className="text-sm text-gray-500">Lesson: {lesson.title}</div>
      </div>
    </div>
  );
}
