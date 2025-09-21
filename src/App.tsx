import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import ChatPage from "@/pages/ChatPage";
import { CharacterProvider } from "@/contexts/CharacterProvider";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Protected area */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <CharacterProvider>
              <ChatPage />
            </CharacterProvider>
          }
        />
      </Route>
      {/* Fallback */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}
