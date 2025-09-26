import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import ProtectedAppLayout from "@/routes/ProtectedAppLayout";
import LoginPage from "@/pages/LoginPage";
import ChatPage from "@/pages/ChatPage";
import CharacterSelectPage from "@/pages/CharacterSelectPage";
import CharacterCreatorPage from "@/pages/CharacterCreatorPage";
import CharacterCreatorPageTwo from "@/pages/CharacterCreatorPageTwo";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedAppLayout />}>
          <Route index element={<ChatPage />} />
          <Route path="characters" element={<CharacterSelectPage />} />
          <Route path="create" element={<CharacterCreatorPage />} />
          <Route path="create/2" element={<CharacterCreatorPageTwo />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
