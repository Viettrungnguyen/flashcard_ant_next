"use client";

import { Card, Tooltip, Button, Image as AntImage } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined, SoundOutlined, PictureOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

interface FlashcardUIProps {
  word: string;
  meaning: string;
  example?: string;
  media?: { url: string; type: "image" | "gif" | "audio" | "video" | "file" } | null;
  ttsLang?: string;
}

export default function FlashcardUI({ word, meaning, example, media = null, ttsLang = "en-US" }: FlashcardUIProps) {
  const [flipped, setFlipped] = useState(false);

  // audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // tts
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function toggleAudio() {
    if (!media?.url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(media.url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }

  function speak() {
    if (!("speechSynthesis" in window)) {
      alert("TTS not supported");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${word}. ${meaning}. ${example ?? ""}`);
    u.lang = ttsLang;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }

  function stopSpeak() {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utterRef.current = null;
  }

  function handleSpeakClick(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (media?.type === "audio" && media.url) {
      toggleAudio();
    } else {
      if (isSpeaking) stopSpeak();
      else speak();
    }
  }

  return (
    <div
      onClick={() => setFlipped(s => !s)}
      className="w-[min(90%,360px)] sm:w-[340px] h-[240px] cursor-pointer [perspective:1000px]"
      role="button"
      aria-pressed={flipped}
    >
      <div className={[
        "relative h-full w-full transition-transform duration-500 will-change-transform [transform-style:preserve-3d]",
        flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
      ].join(" ")}>
        {/* front */}
        <div className={"absolute inset-0 z-40 flex flex-col items-center justify-center rounded-xl [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"}>
          <Card
            style={{ height: "100%", width: "100%" }}
            styles={{ body: { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 16 } }}
            className="rounded-xl shadow-md"
          >
            {media && (media.type === "image" || media.type === "gif") ? (
              <div className="w-full flex justify-center">
                <AntImage
                  src={media.url}
                  alt={word}
                  preview={{ mask: null }} // default preview (click to open) — mask null = no overlay icon
                  style={{ maxHeight: 128, objectFit: "contain" }}
                  placeholder={
                    <div className="h-32 w-full bg-gray-100 animate-pulse rounded-md" />
                  }
                />
              </div>
            ) : (
              <div className="mb-1 text-gray-400"><PictureOutlined /></div>
            )}

            <div className="text-center">
              <h3 className="text-2xl font-semibold">{word}</h3>
              <p className="text-sm text-gray-500 mt-1">Click to flip</p>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Tooltip title={media?.type === "audio" ? (isPlaying ? "Pause audio" : "Play audio") : (isSpeaking ? "Stop speaking" : "Speak")}>
                <Button type="text" onClick={handleSpeakClick} icon={media?.type === "audio" ? (isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />) : <SoundOutlined />} />
              </Tooltip>
            </div>
          </Card>
        </div>

        {/* back */}
        <div className={"absolute inset-0 z-30 flex items-center justify-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]"}>
          <Card
            style={{ height: "100%", width: "100%" }}
            styles={{ body: { height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, padding: 16 } }}
            className="rounded-xl shadow-md"
          >
            <div>
              <h3 className="text-2xl font-semibold">{word}</h3>
              <p className="mt-2 text-sm"><b>Meaning:</b> {meaning}</p>
              {example && <p className="mt-1 text-sm italic text-gray-700">Example: {example}</p>}
            </div>

            {media && media.type === "audio" && (
              <div className="mt-3 flex items-center gap-2">
                <Button onClick={(e) => { e.stopPropagation(); toggleAudio(); }} icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />} />
                <div className="text-sm text-gray-600">Audio preview</div>
              </div>
            )}

            {isSpeaking && (
              <div className="mt-3">
                <Button onClick={(e) => { e.stopPropagation(); stopSpeak(); }}>Stop speaking</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
