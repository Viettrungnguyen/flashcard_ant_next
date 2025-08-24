"use client";

import { Button } from "antd";
import { useEffect, useRef, useState } from "react";

export default function VoiceRecorderLocal({
  onRecorded,
}: {
  onRecorded: (url: string | null) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        onRecorded(url);
        // stop tracks
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied or not available.");
      console.error(err);
    }
  }

  function stop() {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {!recording ? (
          <Button type="primary" onClick={start}>
            Start Recording
          </Button>
        ) : (
          <Button danger onClick={stop}>
            Stop
          </Button>
        )}
        <Button
          onClick={() => {
            setPreviewUrl(null);
            onRecorded(null);
          }}
        >
          Clear
        </Button>
      </div>

      {previewUrl && (
        <div className="mt-2">
          <audio src={previewUrl} controls />
        </div>
      )}
    </div>
  );
}
