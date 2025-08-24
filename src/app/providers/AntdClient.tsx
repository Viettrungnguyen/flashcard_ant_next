// app/providers/AntdClient.tsx
"use client";

import '@ant-design/v5-patch-for-react-19';
import "antd/dist/reset.css";
import { ConfigProvider, App as AntApp } from "antd";
import type { ReactNode } from "react";

export default function AntdClient({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={{ token: { borderRadius: 12 } }}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}
