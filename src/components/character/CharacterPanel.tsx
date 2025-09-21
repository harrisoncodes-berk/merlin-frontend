import { useState } from "react";
import { useCharacter } from "@/hooks/useCharacter";
import OverviewCard from "./OverviewCard";
import AbilitiesGrid from "./AbilitiesGrid";
import FeaturesList from "./FeaturesList";
import InventoryTable from "./InventoryTable";
import SkillsTable from "./SkillsTable";
import SpellsPanel from "./SpellsPanel";

type Tab = "overview" | "abilities" | "skills" | "inventory" | "spells";

export default function CharacterPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { character, derived, loading, error } = useCharacter();
  const [tab, setTab] = useState<Tab>("overview");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-slate-950 text-white shadow-xl ring-1 ring-white/10">
        <header className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-lg font-semibold">Character</h2>
          <button
            onClick={onClose}
            className="rounded-md bg-slate-800/70 px-2 py-1 text-sm hover:bg-slate-700"
          >
            Close
          </button>
        </header>

        {/* Tabs */}
        <nav className="flex flex-wrap gap-2 border-b border-white/10 p-2">
          <TabButton
            active={tab === "overview"}
            onClick={() => setTab("overview")}
            label="Overview"
          />
          <TabButton
            active={tab === "abilities"}
            onClick={() => setTab("abilities")}
            label="Abilities"
          />
          <TabButton
            active={tab === "skills"}
            onClick={() => setTab("skills")}
            label="Skills"
          />
          <TabButton
            active={tab === "inventory"}
            onClick={() => setTab("inventory")}
            label="Inventory"
          />
          <TabButton
            active={tab === "spells"}
            onClick={() => setTab("spells")}
            label="Spells"
          />
        </nav>

        <main className="grid max-h-[calc(100dvh-8rem)] grid-rows-[1fr] overflow-y-auto p-4">
          {loading && <p className="text-white/70">Loading…</p>}
          {error && <p className="text-rose-300">Error: {error}</p>}
          {character && derived && (
            <div className="space-y-4">
              {tab === "overview" && (
                <>
                  <OverviewCard c={character} />
                  <FeaturesList features={character.features} />
                </>
              )}

              {tab === "abilities" && (
                <AbilitiesGrid
                  scores={character.abilities}
                  mods={derived.mods}
                />
              )}

              {tab === "skills" && (
                <SkillsTable
                  skills={derived.skills}
                  passivePerception={derived.passivePerception}
                  proficiency={derived.proficiency}
                />
              )}

              {tab === "inventory" && (
                <InventoryTable
                  items={character.inventory}
                  total={derived.totalWeight}
                />
              )}

              {tab === "spells" && character.spellcasting && (
                <SpellsPanel
                  spells={character.spellcasting.spells}
                  slots={character.spellcasting.slots}
                  castingClass={character.spellcasting.className}
                />
              )}
              {tab === "spells" && !character.spellcasting && (
                <p className="text-white/70">
                  This character has no spellcasting.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-sm ring-1 ring-white/10 ${
        active ? "bg-slate-800/80" : "bg-transparent hover:bg-slate-900/60"
      }`}
    >
      {label}
    </button>
  );
}
