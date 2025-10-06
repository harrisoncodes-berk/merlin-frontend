import { useEffect, useRef } from "react";
import { useCharacterContext } from "@/contexts/CharacterProvider";
import { useNavigate } from "react-router-dom";
import { getOrCreateActiveSession } from "@/api/chatApi";

export default function SessionGate() {
    const { character } = useCharacterContext();
    const navigate = useNavigate();
    const once = useRef(false);

    useEffect(() => {
        if (once.current) return;
        if (!character) {
            navigate("/characters", { replace: true });
            return;
        }
        once.current = true;

        let cancelled = false;
        (async () => {
            try {
                const session = await getOrCreateActiveSession({ characterId: character.id });
                if (!cancelled) navigate(`/chat/${session.sessionId}`, { replace: true });
            } catch (e) {
                if (!cancelled) navigate("/characters", { replace: true });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [character, navigate]);

    return null;
}
