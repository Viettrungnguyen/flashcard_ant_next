"use client";

import Link from "next/link";
import { QUOTES, Lesson } from "@/app/data/quotes";
import { Card, Button } from "antd";
import { useState } from "react";

export default function QuotesIndexPage() {
  const [lessons] = useState<Lesson[]>(QUOTES);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quotes Lessons</h1>
        <div className="text-sm text-gray-500">
          Choose a lesson to explore exams
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
                  {lesson.exams.length} exams
                </div>
                <Link href={`/quotes/${lesson.id}`}>
                  <Button type="primary">View Exams</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
