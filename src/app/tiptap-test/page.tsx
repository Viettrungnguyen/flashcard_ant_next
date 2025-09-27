"use client";

import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { getSharedLinkExtension } from "../../lib/tiptap-extensions";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Button, Space, Tooltip, Select, Divider } from "antd";

export default function TipTapTestPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>TipTap test page</h1>
      <p>
        Path: <code>/tiptap-test</code>
      </p>
      <TestEditor />
    </div>
  );
}

function TestEditor() {
  const [html, setHtml] = useState<string>(
    `<p>Type here — TipTap should render as a rich editor.</p>`
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, horizontalRule: false }),
      getSharedLinkExtension(),
      HorizontalRule,
    ],
    content: html,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  // keep editor in sync if html is changed programmatically
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((html || "") !== current) {
      editor.commands.setContent(html || "");
    }
  }, [html, editor]);

  const exec = (fn: () => void) => {
    try {
      fn();
      editor?.view?.focus();
    } catch (e) {
      console.error(e);
    }
  };

  const HeadingSelect = (
    <Select
      size="small"
      style={{ width: 110 }}
      value={
        editor?.isActive("heading", { level: 1 })
          ? "H1"
          : editor?.isActive("heading", { level: 2 })
          ? "H2"
          : editor?.isActive("heading", { level: 3 })
          ? "H3"
          : "Normal"
      }
      onChange={(v) => {
        if (v === "Normal")
          exec(() => editor?.chain().focus().setParagraph().run());
        else if (v === "H1")
          exec(() => editor?.chain().focus().toggleHeading({ level: 1 }).run());
        else if (v === "H2")
          exec(() => editor?.chain().focus().toggleHeading({ level: 2 }).run());
        else if (v === "H3")
          exec(() => editor?.chain().focus().toggleHeading({ level: 3 }).run());
      }}
      options={[
        { label: "Normal", value: "Normal" },
        { label: "Heading 1", value: "H1" },
        { label: "Heading 2", value: "H2" },
        { label: "Heading 3", value: "H3" },
      ]}
    />
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 20 }}>
      <div>
        <div style={{ marginBottom: 8 }}>
          <Space wrap>
            {HeadingSelect}

            <Button
              size="small"
              type={editor?.isActive("bold") ? "primary" : "default"}
              onClick={() =>
                exec(() => editor?.chain().focus().toggleBold().run())
              }
            >
              Bold
            </Button>

            <Button
              size="small"
              type={editor?.isActive("italic") ? "primary" : "default"}
              onClick={() =>
                exec(() => editor?.chain().focus().toggleItalic().run())
              }
            >
              Italic
            </Button>

            <Button
              size="small"
              type={editor?.isActive("strike") ? "primary" : "default"}
              onClick={() =>
                exec(() => editor?.chain().focus().toggleStrike().run())
              }
            >
              Strike
            </Button>

            <Button
              size="small"
              type={editor?.isActive("code") ? "primary" : "default"}
              onClick={() =>
                exec(() => editor?.chain().focus().toggleCode().run())
              }
            >
              Inline code
            </Button>

            <Button
              size="small"
              type={editor?.isActive("bulletList") ? "primary" : "default"}
              onClick={() =>
                exec(() => editor?.chain().focus().toggleBulletList().run())
              }
            >
              • List
            </Button>

            <Button
              size="small"
              type={editor?.isActive("orderedList") ? "primary" : "default"}
              onClick={() =>
                exec(() => editor?.chain().focus().toggleOrderedList().run())
              }
            >
              1. List
            </Button>

            <Button
              size="small"
              type={editor?.isActive("blockquote") ? "primary" : "default"}
              onClick={() =>
                exec(() => editor?.chain().focus().toggleBlockquote().run())
              }
            >
              Quote
            </Button>

            <Tooltip title="Horizontal rule">
              <Button
                size="small"
                onClick={() =>
                  exec(() => editor?.chain().focus().setHorizontalRule().run())
                }
              >
                HR
              </Button>
            </Tooltip>

            <Button
              size="small"
              onClick={() => exec(() => editor?.chain().focus().undo().run())}
            >
              Undo
            </Button>
            <Button
              size="small"
              onClick={() => exec(() => editor?.chain().focus().redo().run())}
            >
              Redo
            </Button>

            <Button
              size="small"
              type={editor?.isActive("link") ? "primary" : "default"}
              onClick={() => {
                const url = window.prompt("Enter URL (https://...)");
                if (url)
                  exec(() =>
                    editor
                      ?.chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: url })
                      .run()
                  );
              }}
            >
              Link
            </Button>

            <Button
              size="small"
              onClick={() =>
                exec(() => editor?.chain().focus().unsetLink().run())
              }
            >
              Unlink
            </Button>

            <Button
              size="small"
              onClick={() =>
                exec(() =>
                  editor?.chain().focus().clearNodes().unsetAllMarks().run()
                )
              }
            >
              Clear
            </Button>
          </Space>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            minHeight: 260,
            padding: 16,
            background: "#fff",
            boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
          }}
        >
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <div style={{ minHeight: 180 }} />
          )}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <Button
            size="small"
            onClick={() =>
              setHtml(
                "<h3>Programmatic content</h3><p>This was set from JS</p>"
              )
            }
          >
            Set content
          </Button>
          <Button
            size="small"
            onClick={() =>
              setHtml("<p>" + new Date().toLocaleString() + "</p>")
            }
          >
            Insert timestamp
          </Button>
          <Button size="small" onClick={() => setHtml("")}>
            Clear
          </Button>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0 }}>Live preview</h3>
          <Button
            size="small"
            onClick={() => navigator.clipboard?.writeText(html || "")}
          >
            Copy HTML
          </Button>
        </div>

        <Divider style={{ margin: "8px 0" }} />

        <div
          style={{
            minHeight: 320,
            border: "1px solid #eef2f6",
            borderRadius: 8,
            padding: 12,
            background: "#fbfdff",
            overflow: "auto",
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: html || "<em>(empty)</em>" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <h4 style={{ marginBottom: 8 }}>Underlying HTML</h4>
          <div
            style={{
              whiteSpace: "pre-wrap",
              background: "#f7f7f7",
              padding: 12,
              borderRadius: 6,
            }}
          >
            {html}
          </div>
        </div>
      </div>
    </div>
  );
}
