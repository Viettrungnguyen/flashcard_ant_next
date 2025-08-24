"use client";

import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

export type MediaPreview = {
  url: string;
  type: "image" | "gif" | "audio" | "video" | "file";
} | null;

export default function MediaPicker({
  onSelect,
}: {
  onSelect: (m: MediaPreview) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const url = URL.createObjectURL(file);
    const mime = file.type;
    const type = mime.startsWith("image")
      ? mime === "image/gif"
        ? "gif"
        : "image"
      : mime.startsWith("audio")
      ? "audio"
      : mime.startsWith("video")
      ? "video"
      : "file";

    onSelect({ url, type });
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <label className="cursor-pointer">
        <input
          accept="image/*,audio/*,video/*"
          type="file"
          onChange={handlePick}
          className="hidden"
        />
        <Button icon={<UploadOutlined />} loading={loading}>
          Pick media
        </Button>
      </label>
      <Button onClick={() => onSelect(null)}>Clear</Button>
      <div className="text-sm text-gray-500">
        Supported: images, gifs, audio, video
      </div>
    </div>
  );
}
