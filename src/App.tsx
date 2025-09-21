import ChatPage from "@/pages/ChatPage";
import { CharacterProvider } from "@/contexts/CharacterProvider";

export default function App() {
  return (
    <CharacterProvider>
      <ChatPage />
    </CharacterProvider>
  );
}
