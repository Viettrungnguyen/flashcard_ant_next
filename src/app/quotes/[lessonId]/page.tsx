"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { QUOTES } from "@/app/data/quotes";
import { Card, Button } from "antd";

export default function LessonExamsPage() {
  const params = useParams();
  const lessonId = params?.lessonId as string | undefined;
  const lesson = QUOTES.find((l) => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="py-12">
        <h2 className="text-xl font-semibold">Lesson not found</h2>
        <div className="mt-4">
          <Link href="/quotes">
            <Button>Back to lessons</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{lesson.title}</h1>
        <div className="text-sm text-gray-500">Choose an exam to start</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lesson.exams.map((exam) => (
          <Card
            key={exam.id}
            hoverable
            className="rounded-lg"
            styles={{
              body: { padding: 16 },
            }}
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{exam.title}</h3>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {exam.questions.length} questions
                </div>
                <Link href={`/quotes/${lesson.id}/${exam.id}`}>
                  <Button type="primary">Start Exam</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
