import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata = {
  title: "KitchenPulse",
  description:
    "AI-powered Restaurant Operations Intelligence Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
  <ScrollToTop />
  {children}
</body>
    </html>
  );
}