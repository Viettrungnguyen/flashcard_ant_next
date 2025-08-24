// app/layout.tsx
import "./globals.css";
import AntdClient from "@/app/providers/AntdClient";
import AppLayout from "@/app/components/AppLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdClient>
          <AppLayout>{children}</AppLayout>
        </AntdClient>
      </body>
    </html>
  );
}
