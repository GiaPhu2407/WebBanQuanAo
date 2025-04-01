// app/staff/layout.tsx
import type { Metadata } from "next";
import Sidebar from "./component/StaffSidebar";
import { div } from "@tensorflow/tfjs";
import Menu from "@/app/Staff/DashBoard/Header";

export const metadata: Metadata = {
  title: "GiPuDiHi Staff Dashboard",
  description: "Staff management portal",
};

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Menu />

      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
