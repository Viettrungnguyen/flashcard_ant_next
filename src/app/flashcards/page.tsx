// app/flashcards/page.tsx
"use client";

import Link from "next/link";
import { LESSONS, Lesson } from "@/app/data/lessons";
import { Card, Button } from "antd";
import { useState } from "react";

export default function FlashcardsIndexPage() {
  const [lessons] = useState<Lesson[]>(LESSONS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lessons</h1>
        <div className="text-sm text-gray-500">
          Choose a lesson to start learning
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => (
          <Card
            key={lesson.id}
            hoverable
            className="rounded-lg"
            styles={{
              body: { padding: 16 },
            }}
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
                {lesson.description && (
                  <p className="text-sm text-gray-500 mt-2">
                    {lesson.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {lesson.cards.length} cards
                </div>
                <Link href={`/flashcards/${lesson.id}`}>
                  <Button type="primary">Start</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
