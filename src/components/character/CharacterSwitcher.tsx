import { useEffect, useRef, useState } from "react";
import { useCharacterContext } from "@/contexts/CharacterProvider";

export default function CharacterSwitcher() {
  const { characters, character, selectCharacter, isLoading } =
    useCharacterContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onOutside = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (isLoading || !character) return null;

  const menuId = "character-switcher-menu";

  return (
    <div ref={rootRef} className="fixed left-3 top-3 z-50 md:left-4 md:top-4">
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 shadow hover:bg-slate-800"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          {character.name}{" "}
          <span className="opacity-60">
            ({character.className} {character.level})
          </span>
          <svg
            className="ml-1 h-3 w-3 opacity-70"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
          </svg>
        </button>

        {open && (
          <div
            id={menuId}
            role="menu"
            className="absolute mt-1 w-64 rounded-lg border border-slate-700 bg-slate-900/95 p-1 shadow-xl backdrop-blur"
          >
            {characters.map((c) => (
              <button
                key={c.character_id}
                onClick={async () => {
                  await selectCharacter(c.character_id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-slate-800 ${
                  c.character_id === character.character_id
                    ? "bg-slate-800/80"
                    : ""
                }`}
                role="menuitem"
              >
                <div>
                  <div className="font-medium text-slate-100">{c.name}</div>
                  <div className="text-xs text-slate-400">
                    {c.race} • {c.className} {c.level}
                  </div>
                </div>
                {c.character_id === character.character_id && (
                  <span className="text-xs text-emerald-400">Active</span>
                )}
              </button>
            ))}
            <a
              href="/characters"
              className="mt-1 block rounded-md px-3 py-2 text-center text-xs font-medium text-indigo-300 hover:bg-slate-800"
            >
              Manage characters
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
