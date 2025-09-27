"use client";

import React, { useEffect, useMemo, useState } from "react";
import { EditorContent } from "@tiptap/react";
import {
  Button,
  Input,
  Table,
  Modal,
  Form,
  Space,
  Popconfirm,
  message,
  Tooltip,
  Select,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TipTapEditor from "./components/TipTapEditor";

type Entry = {
  id: string;
  word: string;
  pronunciation?: string;
  partOfSpeech?: string;
  meaning?: string;
  example?: string;
  explanation?: string; // custom content
  createdAt: number;
};

const STORAGE_KEY = "dictionary_v1";

export default function DictionaryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [form] = Form.useForm();
  // avoid rendering portal-based components (Modal) during SSR to prevent hydration mismatches
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // HTML content controlled separately (TipTap doesn't integrate directly with antd Form)
  const [meaningHtml, setMeaningHtml] = useState<string>("");
  const [explanationHtml, setExplanationHtml] = useState<string>("");

  useEffect(() => {
    // load from localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Entry[];
        setEntries(parsed);
      }
    } catch (err) {
      console.error("dictionary:loadFailed", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
      console.error("dictionary:saveFailed", err);
    }
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice().sort((a, b) => b.createdAt - a.createdAt);
    return entries
      .filter(
        (e) =>
          e.word.toLowerCase().includes(q) ||
          (e.meaning || "").toLowerCase().includes(q) ||
          (e.explanation || "").toLowerCase().includes(q)
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [entries, query]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setMeaningHtml("");
    setExplanationHtml("");
    setModalOpen(true);
  };

  const openEdit = (item: Entry) => {
    setEditing(item);
    // populate form fields and controlled editor HTML
    form.setFieldsValue(item as EntryFormValues);
    setMeaningHtml(item.meaning || "");
    setExplanationHtml(item.explanation || "");
    setModalOpen(true);
  };

  const doDelete = (id: string) => {
    setEntries((s) => s.filter((x) => x.id !== id));
    message.success("Deleted");
  };

  type EntryFormValues = {
    word: string;
    pronunciation?: string;
    partOfSpeech?: string;
    meaning?: string;
    example?: string;
    explanation?: string;
  };

  const onFinish = (vals: EntryFormValues) => {
    const now = Date.now();
    const finalVals = {
      ...vals,
      meaning: meaningHtml,
      explanation: explanationHtml,
    };

    if (editing) {
      setEntries((s) =>
        s.map((it) => (it.id === editing.id ? { ...it, ...finalVals } : it))
      );
      message.success("Saved");
    } else {
      const newEntry: Entry = {
        id: `${now}-${Math.floor(Math.random() * 10000)}`,
        word: finalVals.word,
        pronunciation: finalVals.pronunciation,
        partOfSpeech: finalVals.partOfSpeech,
        meaning: finalVals.meaning,
        example: finalVals.example,
        explanation: finalVals.explanation,
        createdAt: now,
      };
      setEntries((s) => [newEntry, ...s]);
      message.success("Added");
    }
    setModalOpen(false);
    form.resetFields();
    setEditing(null);
    setMeaningHtml("");
    setExplanationHtml("");
  };

  const importJson = (json: string) => {
    try {
      const parsed = JSON.parse(json) as Entry[];
      if (!Array.isArray(parsed)) throw new Error("Invalid format");
      // add ids/createdAt if missing
      const normalized = parsed.map((p) => ({
        id: p.id || `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        word: p.word || "",
        pronunciation: p.pronunciation,
        partOfSpeech: p.partOfSpeech,
        meaning: p.meaning,
        example: p.example,
        explanation: p.explanation,
        createdAt: p.createdAt || Date.now(),
      }));
      setEntries((s) => [...normalized, ...s]);
      message.success("Imported");
    } catch {
      message.error("Failed to import: invalid JSON");
    }
  };

  const exportJson = () => {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dictionary.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "Word",
      dataIndex: "word",
      key: "word",
      sorter: (a: Entry, b: Entry) => a.word.localeCompare(b.word),
      render: (val: string) => <strong>{val}</strong>,
    },
    {
      title: "POS",
      dataIndex: "partOfSpeech",
      key: "pos",
      width: 120,
    },
    {
      title: "Meaning",
      dataIndex: "meaning",
      key: "meaning",
      ellipsis: true,
      render: (val: string) => (
        <div
          style={{ maxHeight: 48, overflow: "hidden" }}
          dangerouslySetInnerHTML={{ __html: val || "" }}
        />
      ),
    },
    {
      title: "Example",
      dataIndex: "example",
      key: "example",
      ellipsis: true,
      width: 220,
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_: unknown, record: Entry) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title={`Delete '${record.word}'?`}
            onConfirm={() => doDelete(record.id)}
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dictionary</h1>
        <Space>
          <Input.Search
            placeholder="Search word, meaning, explanation..."
            allowClear
            onSearch={(v) => setQuery(v)}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: 360 }}
          />
          <Tooltip title="Import JSON">
            <label>
              <input
                type="file"
                accept="application/json"
                style={{ display: "none" }}
                onChange={(ev) => {
                  const f = ev.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => {
                    if (typeof r.result === "string") importJson(r.result);
                  };
                  r.readAsText(f);
                  ev.currentTarget.value = "";
                }}
              />
              <Button icon={<UploadOutlined />} />
            </label>
          </Tooltip>
          <Tooltip title="Export JSON">
            <Button icon={<DownloadOutlined />} onClick={exportJson} />
          </Tooltip>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Add word
          </Button>
        </Space>
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey={(r) => r.id}
        expandable={{
          expandedRowRender: (record: Entry) => (
            <div className="space-y-2">
              {record.pronunciation && (
                <div>
                  <strong>Pronunciation:</strong> {record.pronunciation}
                </div>
              )}
              {record.meaning && (
                <div>
                  <strong>Meaning:</strong>
                  <div className="ml-2">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: record.meaning || "" }}
                    />
                  </div>
                </div>
              )}
              {record.example && (
                <div>
                  <strong>Example:</strong>
                  <div className="ml-2">{record.example}</div>
                </div>
              )}
              {record.explanation && (
                <div>
                  <strong>Explanation:</strong>
                  <div className="ml-2">
                    <div
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: record.explanation || "",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ),
        }}
        pagination={{ pageSize: 8 }}
      />

      {/* Render Modal only on client to avoid SSR portal/hydration mismatches */}
      {mounted && (
        <Modal
          title={editing ? `Edit: ${editing.word}` : "Add new word"}
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
            form.resetFields();
            setMeaningHtml("");
            setExplanationHtml("");
          }}
          onOk={() => form.submit()}
          destroyOnHidden
          forceRender
          width={1000}
          styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="word" label="Word" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="pronunciation" label="Pronunciation">
              <Input />
            </Form.Item>
            <Form.Item name="partOfSpeech" label="Part of speech">
              <Input />
            </Form.Item>
            <Form.Item label="Meaning">
              <TipTapEditor value={meaningHtml} onChange={setMeaningHtml} />
            </Form.Item>
            <Form.Item name="example" label="Example sentence">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="explanation"
              label="Custom explanation"
              valuePropName="value"
              getValueFromEvent={(html: string) => html}
            >
              <TipTapEditor
                value={explanationHtml}
                onChange={setExplanationHtml}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
