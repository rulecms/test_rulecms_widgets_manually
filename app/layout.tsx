import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RuleCMS widget tests",
  description: "Server-rendered pages for manual RuleCMS widget checks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
