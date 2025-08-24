"use client";

import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  BulbOutlined,
  SettingOutlined,
  UserOutlined,
  GlobalOutlined,
  LockOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname() || "/";

  // determine selected key based on current pathname
  let selectedKey = "home";
  if (pathname === "/") selectedKey = "home";
  else if (pathname.startsWith("/flashcards")) selectedKey = "flashcards";
  else if (pathname.startsWith("/quotes")) selectedKey = "quotes";
  else if (pathname === "/settings") selectedKey = "settings";
  else if (pathname.startsWith("/settings/profile"))
    selectedKey = "settings:profile";
  else if (pathname.startsWith("/settings/language"))
    selectedKey = "settings:language";
  else if (pathname.startsWith("/settings/account"))
    selectedKey = "settings:account";

  // open the Settings submenu when route is under /settings
  const defaultOpenKeys = pathname.startsWith("/settings") ? ["settings"] : [];

  return (
    <Layout className="bg-gray-50">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={72}
        width={220}
      >
        <div className="!text-white text-center py-4 text-lg font-extrabold tracking-tight">
          <div className="select-none px-2">
            <span className="inline-block mr-2 text-2xl">📘</span>
            {!collapsed && <span>EngLearn</span>}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={defaultOpenKeys}
          items={[
            {
              key: "home",
              icon: <HomeOutlined />,
              label: <Link href="/">Home</Link>,
            },
            {
              key: "flashcards",
              icon: <BookOutlined />,
              label: <Link href="/flashcards">Flashcards</Link>,
            },
            {
              key: "quotes",
              icon: <BulbOutlined />,
              label: <Link href="/quotes">Quotes</Link>,
            },
            // Settings with sub-items
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Settings",
              children: [
                {
                  key: "settings:profile",
                  icon: <UserOutlined />,
                  label: <Link href="/settings/profile">Profile</Link>,
                },
                {
                  key: "settings:language",
                  icon: <GlobalOutlined />,
                  label: (
                    <Link href="/settings/language">Learning language</Link>
                  ),
                },
                {
                  key: "settings:account",
                  icon: <LockOutlined />,
                  label: <Link href="/settings/account">Account</Link>,
                },
              ],
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="bg-white px-4 py-3 flex items-center justify-end shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Welcome</div>
          </div>
        </Header>

        <Content className="p-4 overflow-auto">
          <div className="mx-auto">
            <div className="p-6 bg-white rounded-2xl shadow-sm overflow-auto">
              {children}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
