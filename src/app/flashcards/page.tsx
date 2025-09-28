// app/flashcards/page.tsx
"use client";

import Link from "next/link";
import { LESSONS, Lesson } from "@/app/data/lessons";
import { Card, Button, message, Modal, Radio, Select } from "antd";
import { useState, useEffect } from "react";

export default function FlashcardsIndexPage() {
  // lessons state — start with local fallback, then load from backend
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);
  const [importing, setImporting] = useState(false);
  const [importMode, setImportMode] = useState<"new" | "append">("new");
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(
    undefined
  );
  // antd message hook to avoid static API warning
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
    const url = `${apiBase}/flashcards`;
    console.log("FlashcardsIndexPage fetching", url);

    (async () => {
      try {
        const res = await fetch(url);
        console.log("flashcards fetch status", res.status);
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data)) setLessons(data);
        else console.warn("unexpected /flashcards response", data);
      } catch (err) {
        console.error("failed to fetch /flashcards", err);
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
          <h1 className="text-2xl font-semibold">Lessons</h1>
          <div className="text-sm text-gray-500">
            Choose a lesson to start learning
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
            id="file-input"
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
                // clear input
                (
                  document.getElementById("file-input") as HTMLInputElement
                ).value = "";
                return;
              }

              const query =
                importMode === "append" && selectedLessonId
                  ? `?mode=append&lessonId=${encodeURIComponent(
                      selectedLessonId
                    )}`
                  : "";
              const url = `${apiBase}/flashcards/import${query}`;
              const fd = new FormData();
              fd.append("file", file);
              setImporting(true);
              try {
                const res = await fetch(url, { method: "POST", body: fd });
                let data: unknown = {};
                try {
                  data = await res.json();
                } catch {
                  // ignore JSON parse errors
                }
                if (res.ok) {
                  const parsedData = (
                    data && typeof data === "object"
                      ? (data as Record<string, unknown>)
                      : {}
                  ) as Record<string, unknown>;
                  const created =
                    parsedData["created"] ?? parsedData["appended"] ?? 0;
                  messageApi.success(`Imported: ${created}`);
                  // refresh lessons after import
                  const listRes = await fetch(`${apiBase}/flashcards`);
                  if (listRes.ok) {
                    const listData = await listRes.json();
                    if (Array.isArray(listData)) setLessons(listData);
                  }
                } else {
                  const parsedData = (
                    data && typeof data === "object"
                      ? (data as Record<string, unknown>)
                      : {}
                  ) as Record<string, unknown>;
                  const errorText =
                    (parsedData["error"] as string) ||
                    JSON.stringify(parsedData) ||
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
                // clear input
                (
                  document.getElementById("file-input") as HTMLInputElement
                ).value = "";
              }
            }}
          />

          <Button
            loading={importing}
            onClick={() =>
              (
                document.getElementById("file-input") as HTMLInputElement
              )?.click()
            }
          >
            Import Excel
          </Button>

          <Button
            onClick={() => {
              // generate CSV example and download
              const headers = [
                "lessonId",
                "lessonTitle",
                "lessonDescription",
                "cardId",
                "word",
                "meaning",
                "example",
                "vi",
                "lang",
              ];
              const exampleRow = [
                "lesson-1",
                "Basic Words",
                "Common basic English words",
                "c1",
                "apple",
                "A round fruit",
                "I ate an apple.",
                "táo",
                "en",
              ];
              const csv = [
                headers.join(","),
                exampleRow
                  .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                  .join(","),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "flashcards_example.csv";
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
