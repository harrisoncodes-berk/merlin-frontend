import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listRaces, listClasses, listBackgrounds } from "@/api/characterCreatorApi";
import type { Race, Class, Background, CharacterDraft } from "@/models/character/creator";
import ClassStep from "@/components/creator/steps/ClassStep";
import RaceStep from "@/components/creator/steps/RaceStep";
import BackgroundStep from "@/components/creator/steps/BackgroundStep";
import ClassChoicesStep from "@/components/creator/steps/ClassChoicesStep";
import SummaryStep from "@/components/creator/steps/SummaryStep";
import SummaryCard from "@/components/creator/SummaryCard";

type Step = "class" | "race" | "background" | "choices" | "summary";

export default function CharacterCreatorPage() {
  const nav = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("class");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data
  const [races, setRaces] = useState<Race[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);

  // Form state
  const [draft, setDraft] = useState<CharacterDraft>({
    name: "",
    classId: null,
    raceId: null,
    backgroundId: null,
    skillProficiencies: [],
    weapons: [],
    spells: [],
  });

  // Load initial data
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [racesData, classesData, backgroundsData] = await Promise.all([
          listRaces(),
          listClasses(),
          listBackgrounds(),
        ]);
        if (!mounted) return;
        setRaces(racesData);
        setClasses(classesData);
        setBackgrounds(backgroundsData);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load character data");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedClass = classes.find((c) => c.id === draft.classId) ?? null;
  const selectedRace = races.find((r) => r.id === draft.raceId) ?? null;
  const selectedBackground = backgrounds.find((b) => b.id === draft.backgroundId) ?? null;

  const filteredBackgrounds = useMemo(() => {
    return backgrounds.filter(bg => bg.classId === draft.classId);
  }, [backgrounds, draft.classId]);

  // Validation logic for choices step
  const isChoicesStepValid = useMemo(() => {
    if (!selectedClass) return false;

    // TODO: Check if expertise is applicable
    if (selectedClass.skillChoices && draft.skillProficiencies.length !== selectedClass.skillChoices.proficiencies) {
      return false;
    }

    if (selectedClass.weaponChoices) {
      for (const weaponChoice of selectedClass.weaponChoices) {
        const selectedWeapons = draft.weapons.filter(weapon =>
          weaponChoice.choices.some((w: any) => w.id === weapon.id)
        );
        if (selectedWeapons.length !== weaponChoice.number) {
          return false;
        }
      }
    }

    if (selectedClass.spellChoices) {
      for (const spellChoice of selectedClass.spellChoices) {
        const selectedSpells = draft.spells.filter(id =>
          spellChoice.choices.some((s: any) => s.id === id)
        );
        if (selectedSpells.length !== spellChoice.number) {
          return false;
        }
      }
    }

    return true;
  }, [selectedClass, draft]);

  const steps: { key: Step; label: string; completed: boolean }[] = [
    { key: "class", label: "Class", completed: !!draft.classId },
    { key: "race", label: "Race", completed: !!draft.raceId },
    { key: "background", label: "Background", completed: !!draft.backgroundId },
    { key: "choices", label: "Choices", completed: isChoicesStepValid },
    { key: "summary", label: "Summary", completed: false },
  ];

  function updateDraft(updates: Partial<CharacterDraft>) {
    setDraft((prev) => {
      const newDraft = { ...prev, ...updates };

      // If class is changing, clear background selection if it doesn't match the new class
      if (updates.classId && updates.classId !== prev.classId) {
        if (newDraft.backgroundId) {
          const selectedBackground = backgrounds.find(bg => bg.id === newDraft.backgroundId);
          if (selectedBackground && selectedBackground.classId !== updates.classId) {
            newDraft.backgroundId = null;
          }
        }
      }

      return newDraft;
    });
  }

  function goToStep(step: Step) {
    // Validate current step before moving
    if (currentStep === "class" && !draft.classId) return;
    if (currentStep === "race" && !draft.raceId) return;
    if (currentStep === "background" && !draft.backgroundId) return;

    setCurrentStep(step);
  }

  function nextStep() {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);
    if (currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1].key);
    }
  }

  function prevStep() {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1].key);
    }
  }

  async function handleCreate() {
    setBusy(true);
    setError(null);
    try {
      // TODO: Implement character creation API call
      console.log("Creating character with draft:", draft);
      nav("/");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create character");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 text-white">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-[1fr,320px]">
        {/* Header */}
        <header className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600" />
            <div>
              <div className="text-base font-semibold">Character Creator</div>
              <div className="text-sm text-white/70">
                Create your D&D character step by step
              </div>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => nav(-1)}
                className="rounded-lg bg-slate-800/70 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-slate-700"
              >
                Back
              </button>
            </div>
          </div>
        </header>

        {/* Left: Form */}
        <section className="space-y-4 w-full">
          {/* Step Navigation */}
          <div className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10">
            <div className="mb-4 text-sm font-medium text-white/90">Progress</div>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center">
                  <button
                    onClick={() => goToStep(step.key)}
                    className={`mb-2 h-8 w-8 rounded-full text-xs font-semibold transition-colors ${step.key === currentStep
                      ? "bg-indigo-600 text-white"
                      : step.completed
                        ? "bg-green-600 text-white"
                        : "bg-slate-700 text-white/60"
                      }`}
                  >
                    {index + 1}
                  </button>
                  <span className="text-xs text-white/70">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Character Name */}
          <div className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">
                Character Name *
              </span>
              <input
                value={draft.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
                placeholder="Enter your character's name"
                className="w-full rounded-xl bg-slate-900/70 px-3 py-2 text-white placeholder:text-slate-400 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
          </div>

          {/* Step Content */}
          <div className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10 min-h-[500px] flex flex-col w-full">
            {currentStep === "class" && (
              <ClassStep
                classes={classes}
                selectedId={draft.classId}
                onSelect={(classId) => updateDraft({ classId })}
              />
            )}
            {currentStep === "race" && (
              <RaceStep
                races={races}
                selectedId={draft.raceId}
                onSelect={(raceId) => updateDraft({ raceId })}
              />
            )}
            {currentStep === "background" && (
              <BackgroundStep
                backgrounds={filteredBackgrounds}
                selectedId={draft.backgroundId}
                onSelect={(backgroundId) => updateDraft({ backgroundId })}
              />
            )}
            {currentStep === "choices" && selectedClass && (
              <ClassChoicesStep
                selectedClass={selectedClass}
                draft={draft}
                onUpdate={updateDraft}
              />
            )}
            {currentStep === "summary" && (
              <SummaryStep
                draft={draft}
                selectedClass={selectedClass}
                selectedRace={selectedRace}
                selectedBackground={selectedBackground}
              />
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-xl bg-rose-600/20 p-3 text-sm text-rose-200 ring-1 ring-rose-700/40">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === "class"}
              className="rounded-lg bg-slate-800/70 px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => nav(-1)}
                className="rounded-lg bg-slate-800/70 px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-slate-700"
              >
                Cancel
              </button>
              {currentStep === "summary" ? (
                <button
                  disabled={!draft.name.trim() || busy}
                  onClick={handleCreate}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {busy ? "Creating..." : "Create Character"}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={
                    (!draft.name.trim()) ||
                    (currentStep === "class" && !draft.classId) ||
                    (currentStep === "race" && !draft.raceId) ||
                    (currentStep === "background" && !draft.backgroundId) ||
                    (currentStep === "choices" && !isChoicesStepValid)
                  }
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right: Summary */}
        <aside className="space-y-4">
          <SummaryCard
            draft={draft}
            selectedClass={selectedClass}
            selectedRace={selectedRace}
            selectedBackground={selectedBackground}
          />
        </aside>

      </div>
    </div>
  );
}
