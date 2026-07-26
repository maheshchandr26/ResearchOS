import { Routes, Route } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import ProjectPage from "@/pages/ProjectPage";
import ChatPage from "@/pages/ChatPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/projects/:id"
        element={<ProjectPage />}
      />
      <Route path="/chat" element={<ChatPage />} />
      <Route
  path="/projects/:id/chat"
  element={<ChatPage />}
/>
    </Routes>
  );
}