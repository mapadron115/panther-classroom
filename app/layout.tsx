import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panther Classroom | Student Dashboard",
  description: "A Canvas-inspired philosophy student workspace for Fall C 2026.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
