// app/settings/page.tsx
"use client";

import { useState } from "react";
import { Select, Card, Button, Space } from "antd";
import { usePreferredLanguage } from "@/app/providers/PreferredLanguageProvider";
import LanguageChooser from "@/app/components/LanguageChooser";

export default function SettingsPage() {
  const { lang, setLang, ready } = usePreferredLanguage();
  const [openChooser, setOpenChooser] = useState(false);

  // local select for quick change
  function handleQuickChange(value: string) {
    setLang(value as "en" | "zh" | "ja" | "all");
  }

  if (!ready) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-600">
              Current learning language
            </div>
            <div className="mt-1 font-medium">{lang ?? "Not set"}</div>
          </div>

          <Space>
            <Select
              value={lang ?? undefined}
              onChange={(v) => handleQuickChange(v.toString())}
              options={[
                { label: "English", value: "en" },
                { label: "Chinese (Mandarin)", value: "zh" },
                { label: "Japanese", value: "ja" },
                { label: "All / Multilingual", value: "all" },
              ]}
              style={{ minWidth: 220 }}
            />

            <Button onClick={() => setOpenChooser(true)}>Open chooser</Button>
          </Space>
        </div>
      </Card>

      <LanguageChooser
        visible={openChooser}
        onSelect={(l) => {
          setLang(l);
          setOpenChooser(false);
        }}
        onClose={() => setOpenChooser(false)}
      />
    </div>
  );
}
