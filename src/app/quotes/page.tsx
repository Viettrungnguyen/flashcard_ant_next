"use client";

import Link from "next/link";
import { QUOTES, Lesson } from "@/app/data/quotes";
import { Card, Button, message, Modal, Radio, Select } from "antd";
import { useState, useEffect } from "react";

export default function QuotesIndexPage() {
  const [lessons, setLessons] = useState<Lesson[]>(QUOTES);
  const [importing, setImporting] = useState(false);
  const [importMode, setImportMode] = useState<"new" | "append">("new");
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(
    undefined
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    content: "",
  });

  useEffect(() => {
    let mounted = true;
    const apiBase =
      (process.env.NEXT_PUBLIC_API_URL as string) ?? "http://localhost:3000";
    const url = `${apiBase}/quotes`;
    (async () => {
      try {
        const res = await fetch(url);
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setLessons(data);
        }
      } catch (err) {
        // ignore - keep local QUOTES
        console.error("Failed to fetch /quotes", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {contextHolder}
      <Modal
        open={errorModal.visible}
        title={errorModal.title}
        onOk={() => setErrorModal({ visible: false, title: "", content: "" })}
        onCancel={() =>
          setErrorModal({ visible: false, title: "", content: "" })
        }
      >
        <div>{errorModal.content}</div>
      </Modal>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quotes Lessons</h1>
          <div className="text-sm text-gray-500">
            Choose a lesson to explore exams
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Radio.Group
            value={importMode}
            onChange={(e) => setImportMode(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio value="new">Create new</Radio>
            <Radio value="append">Append to lesson</Radio>
          </Radio.Group>

          {importMode === "append" && (
            <Select
              placeholder="Select lesson to append"
              style={{ minWidth: 220 }}
              value={selectedLessonId}
              onChange={(val) => setSelectedLessonId(val)}
              options={lessons.map((l) => ({
                label: l.title || l.id,
                value: l.id,
              }))}
              allowClear
            />
          )}

          <input
            id="quotes-file-input"
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const apiBase =
                (process.env.NEXT_PUBLIC_API_URL as string) ??
                "http://localhost:3000";

              if (importMode === "append" && !selectedLessonId) {
                messageApi.error("Please choose a lesson to append to");
                (
                  document.getElementById(
                    "quotes-file-input"
                  ) as HTMLInputElement
                ).value = "";
                return;
              }

              const query =
                importMode === "append" && selectedLessonId
                  ? `?mode=append&lessonId=${encodeURIComponent(
                      selectedLessonId
                    )}`
                  : "";
              const url = `${apiBase}/quotes/import${query}`;
              const fd = new FormData();
              fd.append("file", file);
              setImporting(true);
              try {
                const res = await fetch(url, { method: "POST", body: fd });
                let data: unknown = {};
                try {
                  data = await res.json();
                } catch {
                  /* ignore */
                }
                if (res.ok) {
                  const parsed =
                    (data && typeof data === "object"
                      ? (data as Record<string, unknown>)
                      : {}) || {};
                  const created = parsed["created"] ?? parsed["appended"] ?? 0;
                  messageApi.success(`Imported: ${created}`);
                  // refresh list
                  const listRes = await fetch(`${apiBase}/quotes`);
                  if (listRes.ok) {
                    const listData = await listRes.json();
                    if (Array.isArray(listData)) setLessons(listData);
                  }
                } else {
                  const parsed =
                    (data && typeof data === "object"
                      ? (data as Record<string, unknown>)
                      : {}) || {};
                  const errorText =
                    (parsed["error"] as string) ||
                    JSON.stringify(parsed) ||
                    res.statusText;
                  messageApi.error("Import failed");
                  setErrorModal({
                    visible: true,
                    title: "Import failed",
                    content: String(errorText),
                  });
                }
              } catch (err) {
                messageApi.error("Import request failed");
                setErrorModal({
                  visible: true,
                  title: "Import request failed",
                  content: String(err),
                });
              } finally {
                setImporting(false);
                (
                  document.getElementById(
                    "quotes-file-input"
                  ) as HTMLInputElement
                ).value = "";
              }
            }}
          />

          <Button
            loading={importing}
            onClick={() =>
              (
                document.getElementById("quotes-file-input") as HTMLInputElement
              )?.click()
            }
          >
            Import
          </Button>

          <Button
            onClick={() => {
              // generate CSV example and download — multiple rows demonstrating types
              const headers = [
                "lessonId",
                "lessonTitle",
                "lessonDescription",
                "examId",
                "examTitle",
                "questionId",
                "type",
                "question",
                "option_a",
                "option_b",
                "option_c",
                "option_d",
                "correct",
                "wordBank",
                "blanks",
                "media_type",
                "media_url",
                "options",
                "correctAnswer",
              ];

              const rows = [
                // multiple-choice
                [
                  "lesson-1",
                  "Famous Quotes",
                  "Sample description",
                  "exam-1",
                  "Motivational",
                  "q1",
                  "multiple-choice",
                  "Who said 'The only limit to our realization of tomorrow is our doubts of today'?",
                  "Albert Einstein",
                  "Franklin D. Roosevelt",
                  "Winston Churchill",
                  "Theodore Roosevelt",
                  "b",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                ],
                // fill-in-the-blank
                [
                  "lesson-1",
                  "Famous Quotes",
                  "Sample description",
                  "exam-1",
                  "Motivational",
                  "q2",
                  "fill-in-the-blank",
                  "___ is a popular library for building user interfaces.",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "React|JavaScript|Next.js|TypeScript",
                  "React",
                  "",
                  "",
                  "",
                  "",
                ],
                // drag-and-drop
                [
                  "lesson-1",
                  "Famous Quotes",
                  "Sample description",
                  "exam-1",
                  "Motivational",
                  "q3",
                  "drag-and-drop",
                  "The ___ is shining and the ___ are singing.",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "sun|birds|moon|stars",
                  "sun|birds",
                  "",
                  "",
                  "",
                  "",
                ],
                // video-audio
                [
                  "lesson-1",
                  "Famous Quotes",
                  "Sample description",
                  "exam-2",
                  "Video Exam",
                  "q1",
                  "video-audio",
                  "What is the main idea of the video?",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "video",
                  "https://www.bigbuckbunny.org/",
                  "Option 1|Option 2|Option 3",
                  "Option 1",
                ],
                // simple text-answer
                [
                  "lesson-2",
                  "Short Sayings",
                  "Example desc",
                  "exam-1",
                  "Shorts",
                  "q1",
                  "text-answer",
                  'What is the meaning of "Actions speak louder than words"?',
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                ],
              ];

              const escape = (v: unknown) =>
                `"${String(v ?? "").replace(/"/g, '""')}"`;
              const csvLines = [headers.join(",")].concat(
                rows.map((r) => r.map(escape).join(","))
              );
              const blob = new Blob([csvLines.join("\n")], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "quotes_example.csv";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
          >
            Download Example
          </Button>
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
