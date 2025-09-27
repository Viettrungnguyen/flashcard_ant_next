// app/layout.tsx
import "./globals.css";
// ProseMirror base styles required for proper editor rendering
import "prosemirror-view/style/prosemirror.css";

import AntdClient from "@/app/providers/AntdClient";
import AppLayout from "@/app/components/AppLayout";
import PreferredLanguageProvider from "@/app/providers/PreferredLanguageProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen">
        <AntdClient>
          <PreferredLanguageProvider>
            <AppLayout>{children}</AppLayout>
          </PreferredLanguageProvider>
        </AntdClient>
      </body>
    </html>
  );
}
