// app/components/AppLayout.tsx
"use client";

import { Layout, Menu, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  BookOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname() || "/";

  // map route -> key (adjusted for root routes: "/", "/flashcards", "/quotes")
  const activeKey =
    pathname === "/" ? "1" :
    pathname.startsWith("/flashcards") ? "2" :
    pathname.startsWith("/quotes") ? "3" : "1";

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={72}
        width={220}
        className="shadow-sm"
      >
        <div className="text-white text-center py-4 text-lg font-extrabold tracking-tight">
          <div className="select-none px-2">
            <span className="inline-block mr-2 text-2xl">📘</span>
            {!collapsed && <span>EngLearn</span>}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          items={[
            { key: "1", icon: <HomeOutlined />, label: <Link href="/">Home</Link> },
            { key: "2", icon: <BookOutlined />, label: <Link href="/flashcards">Flashcards</Link> },
            { key: "3", icon: <BulbOutlined />, label: <Link href="/quotes">Quotes</Link> },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <h1 className="m-0 text-lg font-semibold">English Learning App</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Welcome</div>
          </div>
        </Header>

        <Content className="p-4">
          <div className="mx-auto">
            <div className="p-6 h-full bg-white rounded-2xl shadow-sm">
              {children}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
