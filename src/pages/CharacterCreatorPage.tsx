import { useEffect, useMemo, useState } from "react";
import CreatorSelect from "@/components/creator/CreatorSelect";
import CheckboxList from "@/components/creator/CheckboxList";
import SummaryCard from "@/components/creator/SummaryCard";
import {
  listRaces,
  listClasses,
  listBackgroundsForClass,
  listWeaponsForClass,
  listPacksForClass,
  createCharacterFromDraft,
} from "@/api/characterCreatorApi";
import type {
  Race,
  ClassDef,
  Background,
  Weapon,
  EquipmentPack,
  CharacterDraft,
} from "@/models/creator";
import { useNavigate } from "react-router-dom";

export default function CharacterCreatorPage() {
  const nav = useNavigate();
  const [races, setRaces] = useState<Race[]>([]);
  const [classes, setClasses] = useState<ClassDef[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [packs, setPacks] = useState<EquipmentPack[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [raceId, setRaceId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [backgroundId, setBackgroundId] = useState<string | null>(null);
  const [weaponIds, setWeaponIds] = useState<string[]>([]);
  const [packId, setPackId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [rs, cs] = await Promise.all([listRaces(), listClasses()]);
      if (!mounted) return;
      setRaces(rs);
      setClasses(cs);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [bgs, ws, ps] = await Promise.all([
        listBackgroundsForClass(classId),
        listWeaponsForClass(classId),
        listPacksForClass(classId),
      ]);
      if (!mounted) return;
      setBackgrounds(bgs);
      setWeapons(ws);
      setPacks(ps);

      if (backgroundId && !bgs.some((b) => b.background_id === backgroundId)) {
        setBackgroundId(null);
      }
      setWeaponIds((prev) =>
        prev.filter((id) => ws.some((w) => w.weapon_id === id))
      );
      if (packId && !ps.some((p) => p.pack_id === packId)) {
        setPackId(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [classId]);

  const selectedRace = useMemo(
    () => races.find((r) => r.race_id === raceId) ?? null,
    [races, raceId]
  );
  const selectedClass = useMemo(
    () => classes.find((c) => c.class_id === classId) ?? null,
    [classes, classId]
  );
  const selectedBg = useMemo(
    () => backgrounds.find((b) => b.background_id === backgroundId) ?? null,
    [backgrounds, backgroundId]
  );

  const weaponItems = useMemo(
    () =>
      weapons.map((w) => ({
        id: w.weapon_id,
        name: w.name,
        description: w.description,
      })),
    [weapons]
  );

  function toggleWeapon(id: string) {
    setWeaponIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const canSubmit = name.trim() && raceId && classId && backgroundId;

  async function handleCreate() {
    setBusy(true);
    setError(null);
    const draft: CharacterDraft = {
      name: name.trim(),
      race_id: raceId!,
      class_id: classId!,
      background_id: backgroundId!,
      weapon_ids: weaponIds,
      pack_id: packId,
    };
    try {
      const created = await createCharacterFromDraft(draft);
      // TODO: call your backend POST /v1/characters once wired
      console.log("Created Character (dummy)", created);
      nav("/");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create character");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 text-white">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-[1.2fr,0.8fr]">
        <header className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600" />
            <div>
              <div className="text-base font-semibold">Character Creator</div>
              <div className="text-sm text-white/70">
                Pick a race, class, and starting kit.
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

        {/* Left: form */}
        <section className="space-y-4">
          <div className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">
                Name *
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Create a name for your character"
                className="w-full rounded-xl bg-slate-900/70 px-3 py-2 text-white placeholder:text-slate-400 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10">
              <CreatorSelect
                label="Race"
                value={raceId}
                onChange={setRaceId}
                required
                options={races.map((r) => ({
                  value: r.race_id,
                  label: r.name,
                }))}
              />
              {selectedRace?.description && (
                <p className="mt-2 text-sm text-white/70">
                  {selectedRace.description}
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10">
              <CreatorSelect
                label="Class"
                value={classId}
                onChange={setClassId}
                required
                options={classes.map((c) => ({
                  value: c.class_id,
                  label: c.name,
                }))}
              />
              {selectedClass?.description && (
                <p className="mt-2 text-sm text-white/70">
                  {selectedClass.description}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10">
            <CreatorSelect
              label="Background"
              value={backgroundId}
              onChange={setBackgroundId}
              required
              options={backgrounds.map((b) => ({
                value: b.background_id,
                label: b.name,
              }))}
            />
            {selectedBg?.description && (
              <p className="mt-2 text-sm text-white/70">
                {selectedBg.description}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10">
              <CheckboxList
                label="Weapons (pick any allowed)"
                items={weaponItems}
                selected={weaponIds}
                onToggle={toggleWeapon}
              />
            </div>

            <div className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10">
              <CreatorSelect
                label="Equipment Pack"
                value={packId}
                onChange={setPackId}
                options={packs.map((p) => ({
                  value: p.pack_id,
                  label: p.name,
                }))}
                placeholder="(Optional)"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-600/20 p-3 text-sm text-rose-200 ring-1 ring-rose-700/40">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => nav(-1)}
              className="rounded-lg bg-slate-800/70 px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              disabled={!canSubmit || busy}
              onClick={handleCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {busy ? "Creating…" : "Create Character"}
            </button>
          </div>
        </section>

        {/* Right: summary */}
        <aside className="space-y-4">
          <SummaryCard
            name={name}
            race={selectedRace?.name ?? null}
            klass={selectedClass?.name ?? null}
            background={selectedBg?.name ?? null}
            weapons={
              weaponIds
                .map((id) => weapons.find((w) => w.weapon_id === id)?.name)
                .filter(Boolean) as string[]
            }
            pack={
              packId
                ? packs.find((p) => p.pack_id === packId)?.name ?? null
                : null
            }
          />
          <div className="rounded-2xl bg-slate-900/50 p-4 text-sm ring-1 ring-white/10">
            <div className="mb-2 font-semibold">Notes</div>
            <ul className="list-disc space-y-1 pl-5 text-white/80">
              <li>Backgrounds, weapons, and packs are filtered by class.</li>
              <li>
                Abilities/HP/AC use simple defaults (easy to extend later).
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
