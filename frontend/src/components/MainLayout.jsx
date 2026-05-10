import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--secondary-bg)",
      }}
    >
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen((p) => !p)} />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main
        style={{
          marginTop: "var(--header-height)",
          minHeight: "calc(100vh - var(--header-height))",
          background: "var(--secondary-bg)",
          padding: "28px 24px",
          transition: "all 0.3s ease",

          // Desktop sidebar spacing
          marginLeft:
            window.innerWidth >= 768
              ? "var(--sidebar-width)"
              : "0",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;