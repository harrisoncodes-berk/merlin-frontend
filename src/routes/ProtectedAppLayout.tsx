import { Outlet } from "react-router-dom";
import { CharacterProvider } from "@/contexts/CharacterProvider";

export default function ProtectedAppLayout() {
  return (
    <CharacterProvider>
      <Outlet />
    </CharacterProvider>
  );
}
