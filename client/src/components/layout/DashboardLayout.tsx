import Sidebar from "./Sidebar";
import Header from "./Header";
import BackgroundGlow from "../ui/BackgroundGlow";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackgroundGlow />

      <div className="min-h-screen bg-transparent flex">
        <Sidebar />

        <main className="flex-1">
          <Header />

          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}