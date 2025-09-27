"use client";

import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { Button, Space, Slider } from "antd";

export default function HandwritingCanvas() {
  const sigRef = useRef<SignaturePad | null>(null);
  const [color, setColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(4);
  const [hasStroke, setHasStroke] = useState(false);

  const clear = () => {
    sigRef.current?.clear();
    setHasStroke(false);
  };

  const undo = () => {
    if (!sigRef.current) return;
    const data = sigRef.current.toData();
    if (!data || data.length === 0) return;
    data.pop();
    sigRef.current.fromData(data);
    setHasStroke(data.length > 0);
  };

  const save = () => {
    const dataUrl = sigRef.current?.toDataURL("image/png");
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "handwriting.png";
    a.click();
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <Space>
          <Button onClick={undo} disabled={!hasStroke}>
            Undo
          </Button>
          <Button onClick={clear} disabled={!hasStroke}>
            Clear
          </Button>
          <Button type="primary" onClick={save} disabled={!hasStroke}>
            Save as PNG
          </Button>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>Color</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Pen color"
            />
          </label>

          <div style={{ width: 160 }}>
            <span style={{ fontSize: 12 }}>Width</span>
            <Slider
              min={1}
              max={30}
              value={penWidth}
              onChange={(v) =>
                setPenWidth(typeof v === "number" ? v : penWidth)
              }
              tooltip={{ formatter: (v) => `${v}px` }}
            />
          </div>
        </Space>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <SignaturePad
          ref={sigRef}
          penColor={color}
          minWidth={penWidth}
          maxWidth={penWidth}
          onBegin={() => setHasStroke(true)}
          canvasProps={{
            style: {
              display: "block",
              touchAction: "none",
              width: "100%",
              height: 300,
            },
          }}
        />
      </div>
    </div>
  );
}
