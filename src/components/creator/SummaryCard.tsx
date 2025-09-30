import type { Class, Race, Background, CharacterDraft } from "@/models/character/creator";
import { allAbilityMods } from "@/lib/ability";
import type { Feature, SkillKey } from "@/models/character/common";
import { SKILL_LABEL } from "@/lib/skills";
import { totalWeight } from "@/lib/ability";
import InventoryTable from "@/components/character/InventoryTable";
import AbilitiesGrid from "@/components/character/AbilitiesGrid";
import { useMemo } from "react";


type SummaryCardProps = {
  draft: CharacterDraft;
  selectedClass: Class | null;
  selectedRace: Race | null;
  selectedBackground: Background | null;
}

export default function SummaryCard({
  draft,
  selectedClass,
  selectedRace,
  selectedBackground,
}: SummaryCardProps) {
  const selectedAbilities = useMemo(() => Object.fromEntries(Object.entries(draft.abilities).filter(([, value]) => value > 0)), [draft.abilities]);

  return (
    <div className="space-y-4 w-80 max-w-80">
      {/* Basic Info */}
      <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
        <div className="mb-2 text-sm font-semibold text-white/90">Character Summary</div>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm">
          <dt className="text-white/60">Name</dt>
          <dd className="font-medium">{draft.name || "—"}</dd>
          <dt className="text-white/60">Race</dt>
          <dd className="font-medium">{selectedRace?.name ?? "—"}</dd>
          <dt className="text-white/60">Class</dt>
          <dd className="font-medium">{selectedClass?.name ?? "—"}</dd>
          <dt className="text-white/60">Background</dt>
          <dd className="font-medium">{selectedBackground?.name ?? "—"}</dd>
          {selectedClass && (
            <>
              <dt className="text-white/60">AC</dt>
              <dd className="font-medium">{selectedClass.ac}</dd>
              <dt className="text-white/60">Hit Dice</dt>
              <dd className="font-medium">{selectedClass.hitDice.name}</dd>
            </>
          )}
          {selectedRace && (
            <>
              <dt className="text-white/60">Speed</dt>
              <dd className="font-medium">{selectedRace.speed} ft</dd>
              <dt className="text-white/60">Size</dt>
              <dd className="font-medium">{selectedRace.size}</dd>
            </>
          )}
        </dl>
      </div>

      {/* Skill Proficiencies */}
      {draft.skills.length > 0 && (
        <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
          <div className="mb-2 text-sm font-semibold text-white/90">Skill Proficiencies</div>
          <div className="text-sm text-white/70 break-words leading-relaxed">
            {draft.skills.map(skill => SKILL_LABEL[skill.key as SkillKey]).join(", ")}
          </div>
        </div>
      )}

      {/* Weapon Proficiencies */}
      {draft.weapons.length > 0 && (
        <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
          <div className="mb-2 text-sm font-semibold text-white/90">Weapons</div>
          <div className="text-sm text-white/70 break-words leading-relaxed">
            {draft.weapons.map(weapon => weapon.name).join(", ")}
          </div>
        </div>
      )}

      {/* Spells */}
      {draft.spells.length > 0 && (
        <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
          <div className="mb-2 text-sm font-semibold text-white/90">Spells</div>
          <div className="text-sm text-white/70 break-words leading-relaxed">
            {draft.spells.join(", ")}
          </div>
        </div>
      )}

      {/* Abilities */}
      {selectedAbilities && Object.values(selectedAbilities).length > 0 && (
        <AbilitiesGrid scores={draft.abilities} mods={allAbilityMods(draft.abilities)} abbrv={true} />
      )}
      
      {/* Background Features */}
      {selectedBackground?.features && selectedBackground.features.length > 0 && (
        FeatureList({ features: selectedBackground.features, title: "Background Features" })
      )}

      {/* Background Inventory */}
      {selectedBackground?.inventory && selectedBackground.inventory.length > 0 && (
        <InventoryTable items={selectedBackground.inventory} total={totalWeight(selectedBackground.inventory)} />
      )}

      {/* Race Features */}
      {selectedRace?.features && selectedRace.features.length > 0 && (
        FeatureList({ features: selectedRace.features, title: "Race Features" })
      )}

      {/* Class Features */}
      {selectedClass?.features && selectedClass.features.length > 0 && (
        FeatureList({ features: selectedClass.features, title: "Class Features" })
      )}
    </div>
  );
}

function FeatureList({ features, title }: { features: Feature[], title: string }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
      <div className="mb-2 text-sm font-semibold text-white/90">{title}</div>
      <div className="space-y-2">
        {features.map((feature) => (
          <div key={feature.id} className="text-sm">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium">{feature.name}</span>
            </div>
            {feature.description && (
              <div className="text-white/70 mt-1 break-words leading-relaxed">{feature.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}