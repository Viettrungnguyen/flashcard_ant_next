// app/components/LanguageChooser.tsx
"use client";

import { Modal, Radio, Button } from "antd";
import { useState } from "react";

type Lang = "en" | "zh" | "ja" | "all";

export default function LanguageChooser({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean;
  onSelect: (lang: Lang) => void;
  onClose?: () => void;
}) {
  const [value, setValue] = useState<Lang>("en");

  return (
    <Modal
      open={visible}
      closable={false}
      footer={null}
      centered
      maskClosable={false}
      styles={{
        body: { padding: 24 },
      }}
      width={560}
    >
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-xl font-semibold">Choose a language to learn</h2>
        <p className="text-sm text-gray-600">
          You can change this later in Settings.
        </p>

        <Radio.Group
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full"
        >
          <div className="flex flex-col gap-3">
            <Radio value="en">
              English{" "}
              <span className="text-xs text-gray-500 ml-2">
                (Learn words, listen, TTS: en-US)
              </span>
            </Radio>
            <Radio value="zh">
              Chinese{" "}
              <span className="text-xs text-gray-500 ml-2">
                (Mandarin, TTS: zh-CN)
              </span>
            </Radio>
            <Radio value="ja">
              Japanese{" "}
              <span className="text-xs text-gray-500 ml-2">(TTS: ja-JP)</span>
            </Radio>
            <Radio value="all">Multilingual / All languages</Radio>
          </div>
        </Radio.Group>

        <div className="mt-4 flex gap-2 w-full justify-end">
          <Button
            onClick={() => {
              onSelect(value);
            }}
            type="primary"
          >
            Continue
          </Button>
          <Button
            onClick={() => {
              onSelect(value);
              onClose?.();
            }}
          >
            Continue (close)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
