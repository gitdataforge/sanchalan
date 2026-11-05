import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-brand-black text-brand-white overflow-hidden transition-colors duration-200">
      {/* Left Sidebar Menu */}
      <Sidebar />

      {/* Central Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top Menu Bar */}
        <TopBar />

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-brand-black">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}