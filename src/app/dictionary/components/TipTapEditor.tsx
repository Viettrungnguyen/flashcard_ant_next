"use client";

import React, { useEffect, useRef, memo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Select, Space, Button, Tooltip } from "antd";
import { getSharedLinkExtension } from "../../../lib/tiptap-extensions";
import Image from "@tiptap/extension-image";

const TipTapEditor = memo(function TipTapEditor({
  value,
  onChange,
  debounce = 250,
  height = 100,
}: {
  value?: string;
  onChange: (html: string) => void;
  debounce?: number;
  height?: number;
}) {
  const timeoutRef = useRef<number | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, horizontalRule: false }),
      getSharedLinkExtension(),
      Image,
    ],
    injectCSS: true,
    content: value || "",
    editorProps: {
      attributes: {
        style: `min-height: ${height}px; padding: 8px;`,
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        onChange(editor.getHTML());
      }, debounce) as unknown as number;
    },
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const exec = (fn: () => void) => {
    try {
      fn();
      editor?.view?.focus();
    } catch (e) {
      // swallow UI errors
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

  // file input for image uploads
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const src = String(r.result || "");
      // insert image node (typed)
      exec(() =>
        editor
          ?.chain()
          .focus()
          .insertContent({ type: "image", attrs: { src } })
          .run()
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    r.readAsDataURL(f);
  };

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    const file = ev.dataTransfer?.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const src = String(r.result || "");
      exec(() =>
        editor
          ?.chain()
          .focus()
          .insertContent({ type: "image", attrs: { src } })
          .run()
      );
    };
    r.readAsDataURL(file);
  };

  const handleDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
  };

  // extract image srcs from the HTML for a concise preview
  const extractImageSrcs = (html: string | undefined): string[] => {
    if (!html) return [];
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const imgs = Array.from(doc.querySelectorAll("img"));
      return imgs.map((i) => i.getAttribute("src") || "");
    } catch {
      return [];
    }
  };

  // Truncate long URLs with a middle ellipsis, keep start/end for context
  const truncateMiddle = (s: string, max = 60) => {
    if (!s) return "";
    if (s.length <= max) return s;
    const keep = Math.max(6, Math.floor((max - 3) / 2));
    return s.slice(0, keep) + "..." + s.slice(s.length - keep);
  };

  if (!editor)
    return (
      <div
        style={{
          minHeight: height,
          border: "1px solid #e5e7eb",
          borderRadius: 6,
        }}
      />
    );

  return (
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

          {/* hidden file input used by Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button size="small" onClick={() => fileInputRef.current?.click()}>
            Upload
          </Button>
          <Button
            size="small"
            onClick={() => {
              const url = window.prompt("Enter image URL (https://...)");
              if (!url) return;
              exec(() =>
                editor
                  ?.chain()
                  .focus()
                  .insertContent({ type: "image", attrs: { src: url } })
                  .run()
              );
            }}
          >
            Image
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
          borderRadius: 6,
          minHeight: height,
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <EditorContent editor={editor} style={{ minHeight: height }} />
      </div>

      <div style={{ marginTop: 12 }}>
        {/* Image links summary (truncated with ellipsis when too long) */}
        <h4 style={{ marginBottom: 8 }}>Images</h4>
        <div style={{ marginBottom: 12 }}>
          {extractImageSrcs(value).length ? (
            extractImageSrcs(value).map((src, idx) => (
              <div key={idx} style={{ marginBottom: 6 }}>
                <Tooltip title={src}>
                  <a
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {truncateMiddle(src, 60)}
                  </a>
                </Tooltip>
              </div>
            ))
          ) : (
            <div style={{ color: "#6b7280", fontSize: 13 }}>(no images)</div>
          )}
        </div>

        <h4 style={{ marginBottom: 8, marginTop: 8 }}>Underlying HTML</h4>
        <div
          style={{
            whiteSpace: "pre-wrap",
            background: "#f7f7f7",
            padding: 8,
            borderRadius: 6,
            overflow: "auto",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
});

export default TipTapEditor;
