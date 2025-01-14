"use client";

import Sidebar from "@/app/templates/admin/templates/header/sidebar";
import TicketsPage from "@/app/templates/admin/tickets/page";
import { useState } from "react";


export default function Dashboard() {

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="bg-sky-600 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">
              Panel de Administración de Tickets Internos
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-gradient-to-r from-blue-100 to-blue-200">
          <br />
          <TicketsPage />
        </main>
      </div>
    </div>
  );
}