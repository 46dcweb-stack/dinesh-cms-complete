"use client";
import { useEffect, useState } from "react";
import { manifestoService } from "@/lib/firebase-services";
import type { ManifestoMeta, ManifestoSection } from "@/lib/types";
import { Plus, Trash2, ChevronUp, ChevronDown, Pencil, GripVertical } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, Select, SaveButton, ImageUpload,
  Alert, Card, SectionTitle, Toggle,
} from "../components/ui";

// ── Built-in city coordinate lookup (no API needed) ─────────────────────────
const CITY_DB: { name: string; lat: number; lng: number }[] = [
  { name: "London", lat: 51.51, lng: -0.13 },
  { name: "New York", lat: 40.71, lng: -74.01 },
  { name: "San Francisco", lat: 37.78, lng: -122.42 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Dubai", lat: 25.20, lng: 55.27 },
  { name: "Sydney", lat: -33.87, lng: 151.21 },
  { name: "Paris", lat: 48.86, lng: 2.35 },
  { name: "Berlin", lat: 52.52, lng: 13.41 },
  { name: "Mumbai", lat: 19.08, lng: 72.88 },
  { name: "Delhi", lat: 28.61, lng: 77.21 },
  { name: "Bangalore", lat: 12.97, lng: 77.59 },
  { name: "Hong Kong", lat: 22.32, lng: 114.17 },
  { name: "Shanghai", lat: 31.23, lng: 121.47 },
  { name: "Beijing", lat: 39.91, lng: 116.39 },
  { name: "Seoul", lat: 37.57, lng: 126.98 },
  { name: "Lagos", lat: 6.52, lng: 3.38 },
  { name: "Nairobi", lat: -1.29, lng: 36.82 },
  { name: "Cairo", lat: 30.06, lng: 31.25 },
  { name: "Johannesburg", lat: -26.20, lng: 28.04 },
  { name: "São Paulo", lat: -23.55, lng: -46.63 },
  { name: "Mexico City", lat: 19.43, lng: -99.13 },
  { name: "Toronto", lat: 43.65, lng: -79.38 },
  { name: "Los Angeles", lat: 34.05, lng: -118.24 },
  { name: "Chicago", lat: 41.88, lng: -87.63 },
  { name: "Amsterdam", lat: 52.37, lng: 4.89 },
  { name: "Zurich", lat: 47.38, lng: 8.54 },
  { name: "Stockholm", lat: 59.33, lng: 18.07 },
  { name: "Moscow", lat: 55.76, lng: 37.62 },
  { name: "Istanbul", lat: 41.01, lng: 28.95 },
  { name: "Riyadh", lat: 24.69, lng: 46.72 },
  { name: "Erbil", lat: 36.19, lng: 44.01 },
  { name: "Doha", lat: 25.29, lng: 51.53 },
  { name: "Kuala Lumpur", lat: 3.14, lng: 101.69 },
  { name: "Jakarta", lat: -6.21, lng: 106.85 },
  { name: "Bangkok", lat: 13.75, lng: 100.52 },
  { name: "Karachi", lat: 24.86, lng: 67.01 },
  { name: "Buenos Aires", lat: -34.60, lng: -58.38 },
  { name: "Bogotá", lat: 4.71, lng: -74.07 },
  { name: "Lima", lat: -12.05, lng: -77.04 },
  { name: "Casablanca", lat: 33.59, lng: -7.62 },
  { name: "Accra", lat: 5.56, lng: -0.20 },
  { name: "Addis Ababa", lat: 9.03, lng: 38.74 },
  { name: "Lisbon", lat: 38.72, lng: -9.14 },
  { name: "Madrid", lat: 40.42, lng: -3.70 },
  { name: "Rome", lat: 41.90, lng: 12.50 },
  { name: "Vienna", lat: 48.21, lng: 16.37 },
  { name: "Warsaw", lat: 52.23, lng: 21.01 },
  { name: "Kyiv", lat: 50.45, lng: 30.52 },
  { name: "Helsinki", lat: 60.17, lng: 24.94 },
];

function searchCities(q: string) {
  if (!q.trim()) return [];
  const lower = q.toLowerCase();
  return CITY_DB.filter(c => c.name.toLowerCase().includes(lower)).slice(0, 6);
}

// Auto-generate connections between all markers in sequence
function buildConnections(markers: { lat: number; lng: number }[]): { from: [number, number]; to: [number, number] }[] {
  if (markers.length < 2) return [];
  const conns: { from: [number, number]; to: [number, number] }[] = [];
  for (let i = 0; i < markers.length - 1; i++) {
    conns.push({ from: [markers[i].lat, markers[i].lng], to: [markers[i+1].lat, markers[i+1].lng] });
  }
  // Close the loop if 3+ cities
  if (markers.length >= 3) {
    conns.push({ from: [markers[markers.length-1].lat, markers[markers.length-1].lng], to: [markers[0].lat, markers[0].lng] });
  }
  return conns;
}

const EMPTY_META: Omit<ManifestoMeta, "id"> = {
  title: "My Manifesto", subtitle: "A blueprint for resilient building.",
  eyebrow: "The Architecture of Intent", introLabel: "Infrastructure for the future",
  versionTag: "2.0", introStats: [
    { value: "Global", label: "Impact" },
    { value: "Infinite", label: "Vision" },
    { value: "100%", label: "Resilience" },
  ],
};

function ManualCityEntry({ onAdd }: { onAdd: (city: { lat: number; lng: number; label: string }) => void }) {
  const [label, setLabel] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      <div className="col-span-1">
        <Field label="City Name">
          <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Erbil" />
        </Field>
      </div>
      <div>
        <Field label="Latitude">
          <Input value={lat} onChange={e => setLat(e.target.value)} placeholder="36.19" type="number" />
        </Field>
      </div>
      <div>
        <Field label="Longitude">
          <Input value={lng} onChange={e => setLng(e.target.value)} placeholder="44.01" type="number" />
        </Field>
      </div>
      <button
        type="button"
        onClick={() => {
          if (!label || !lat || !lng) return;
          onAdd({ lat: parseFloat(lat), lng: parseFloat(lng), label });
          setLabel(""); setLat(""); setLng("");
        }}
        className="col-span-3 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors py-1"
      >
        <Plus size={14} /> Add City
      </button>
    </div>
  );
}

// Section types offered in the admin dropdown. The stored value is rendered
// verbatim as the label above each section on the public /manifesto page, so
// these strings are user-facing copy, not internal keys.
const SECTION_TYPES = [
  "Principle 46",
  "Statement 46",
  "Vision 46",
  "Rule 46",
  "Reason 46",
  "Suggestion 46",
  "Lesson 46",
  "Note 46",
  "Essay",
] as const;

export default function ManifestoAdmin() {
  const [meta, setMeta] = useState<Omit<ManifestoMeta, "id">>(EMPTY_META);
  const [sections, setSections] = useState<ManifestoSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaSaved, setMetaSaved] = useState(false);
  const [error, setError] = useState("");
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [citySearchResults, setCitySearchResults] = useState<{name:string;lat:number;lng:number}[]>([]);
  const [editingSection, setEditingSection] = useState<ManifestoSection | null>(null);
  const [sectionForm, setSectionForm] = useState<Omit<ManifestoSection, "id">>({
    sectionType: "Essay", order: 0, type: "text", heading: "", body: "",
    highlightStyle: "normal",
  });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [m, s] = await Promise.all([
      manifestoService.getMeta(),
      manifestoService.getSections(),
    ]);
    if (m) { const { id: _, ...rest } = m; setMeta(rest); }
    setSections(s);
    setLoading(false);
  }

  async function saveMeta() {
    setSavingMeta(true);
    await manifestoService.saveMeta(meta);
    setMetaSaved(true);
    setTimeout(() => setMetaSaved(false), 3000);
    setSavingMeta(false);
  }

  function setS(key: keyof typeof sectionForm, val: any) {
    setSectionForm(f => ({ ...f, [key]: val }));
  }

  async function saveSection() {
    if (!sectionForm.sectionType) { setError("Section type required."); return; }
    try {
      if (editingSection?.id) {
        await manifestoService.updateSection(editingSection.id, sectionForm);
      } else {
        await manifestoService.createSection({ ...sectionForm, order: sections.length });
      }
      setShowSectionForm(false);
      setEditingSection(null);
      load();
    } catch (err: any) { setError(err.message); }
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section?")) return;
    await manifestoService.deleteSection(id);
    load();
  }

  async function moveSection(index: number, dir: "up" | "down") {
    const newSections = [...sections];
    const swapWith = dir === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= newSections.length) return;
    [newSections[index], newSections[swapWith]] = [newSections[swapWith], newSections[index]];
    const reordered = newSections.map((s, i) => ({ id: s.id!, order: i }));
    await manifestoService.reorderSections(reordered);
    load();
  }

  function editSection(s: ManifestoSection) {
    setEditingSection(s);
    const { id: _, ...rest } = s;
    setSectionForm(rest);
    setShowSectionForm(true);
  }

  if (loading) return <div className="p-8 text-white/40 text-sm">Loading manifesto...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <AdminPageHeader title="Manifesto" subtitle="Edit your manifesto metadata and sections" />

      {error && <Alert message={error} className="mb-6" />}

      {/* Meta */}
      <Card className="mb-8">
        <SectionTitle>Manifesto Metadata</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title">
            <Input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} />
          </Field>
          <Field label="Version Tag">
            <Input value={meta.versionTag} onChange={e => setMeta(m => ({ ...m, versionTag: e.target.value }))} />
          </Field>
          <div className="col-span-2">
            <Field label="Subtitle">
              <Input value={meta.subtitle} onChange={e => setMeta(m => ({ ...m, subtitle: e.target.value }))} />
            </Field>
          </div>
          <Field label="Eyebrow Text">
            <Input value={meta.eyebrow} onChange={e => setMeta(m => ({ ...m, eyebrow: e.target.value }))} />
          </Field>
          <Field label="Intro Label">
            <Input value={meta.introLabel} onChange={e => setMeta(m => ({ ...m, introLabel: e.target.value }))} />
          </Field>
        </div>

        <div className="mt-4">
          <SectionTitle>Intro Stats (3 items)</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            {meta.introStats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <Field label={`Stat ${i + 1} Value`}>
                  <Input value={stat.value} onChange={e => {
                    const s = [...meta.introStats];
                    s[i] = { ...s[i], value: e.target.value };
                    setMeta(m => ({ ...m, introStats: s }));
                  }} />
                </Field>
                <Field label="Label">
                  <Input value={stat.label} onChange={e => {
                    const s = [...meta.introStats];
                    s[i] = { ...s[i], label: e.target.value };
                    setMeta(m => ({ ...m, introStats: s }));
                  }} />
                </Field>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Card>
            <SectionTitle>SEO & Schema</SectionTitle>
            <div className="space-y-3">
              <Field label="SEO Title">
                <Input value={(meta as any).seoTitle || ""} onChange={e => setMeta((m:any) => ({...m, seoTitle: e.target.value}))} placeholder="Manifesto | Dinesh Koyyalamudi" />
              </Field>
              <Field label="SEO Description" hint="~155 characters">
                <Textarea value={(meta as any).seoDescription || ""} onChange={e => setMeta((m:any) => ({...m, seoDescription: e.target.value}))} rows={2} />
              </Field>
              <Field label="OG Image">
                <ImageUpload value={(meta as any).seoOgImage || ""} onChange={(v:string) => setMeta((m:any) => ({...m, seoOgImage: v}))} folder="seo" />
              </Field>
            </div>
          </Card>
          {/* CTA Section */}
          <Card>
            <SectionTitle>CTA Section (Bottom of Page)</SectionTitle>
            <div className="space-y-3">
              <Field label="Heading" hint="e.g. Will you build">
                <Input value={(meta as any).ctaHeading || ""} onChange={e => setMeta((m:any) => ({...m, ctaHeading: e.target.value}))} placeholder="Will you build" />
              </Field>
              <Field label="Heading Italic Part" hint="e.g. the future with us?">
                <Input value={(meta as any).ctaHeadingItalic || ""} onChange={e => setMeta((m:any) => ({...m, ctaHeadingItalic: e.target.value}))} placeholder="the future with us?" />
              </Field>
              <Field label="Description">
                <Textarea value={(meta as any).ctaDescription || ""} onChange={e => setMeta((m:any) => ({...m, ctaDescription: e.target.value}))} rows={3} placeholder="We are actively looking for visionary collaborators..." />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Button 1 Label">
                  <Input value={(meta as any).ctaBtn1Label || ""} onChange={e => setMeta((m:any) => ({...m, ctaBtn1Label: e.target.value}))} placeholder="Join the Collective" />
                </Field>
                <Field label="Button 2 Label">
                  <Input value={(meta as any).ctaBtn2Label || ""} onChange={e => setMeta((m:any) => ({...m, ctaBtn2Label: e.target.value}))} placeholder="Read the Vision Paper" />
                </Field>
              </div>
            </div>
          </Card>
          {/* Globe Locations */}
          <Card>
            <SectionTitle>Globe Locations</SectionTitle>
            <p className="text-xs text-white/40 mb-4">
              Add cities to highlight on the globe. Connections are drawn automatically between them in order.
            </p>

            {/* City search */}
            <div className="relative mb-4">
              <Field label="Search & Add City">
                <div className="relative">
                  <Input
                    value={citySearch}
                    onChange={e => {
                      setCitySearch(e.target.value);
                      setCitySearchResults(searchCities(e.target.value));
                    }}
                    placeholder="Type a city name e.g. London…"
                  />
                  {citySearchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
                      {citySearchResults.map(city => (
                        <button
                          key={city.name}
                          type="button"
                          onClick={() => {
                            const markers = [...((meta as any).globeMarkers || []), { lat: city.lat, lng: city.lng, label: city.name }];
                            setMeta((m: any) => ({ ...m, globeMarkers: markers, globeConnections: buildConnections(markers) }));
                            setCitySearch("");
                            setCitySearchResults([]);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                        >
                          <span className="text-sm text-white">{city.name}</span>
                          <span className="text-[10px] text-white/30 font-mono">{city.lat.toFixed(2)}, {city.lng.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Field>
            </div>

            {/* Manual entry */}
            <details className="mb-4">
              <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60 transition-colors mb-2 uppercase tracking-wider font-mono">
                + Add manually with coordinates
              </summary>
              <ManualCityEntry onAdd={(city) => {
                const markers = [...((meta as any).globeMarkers || []), city];
                setMeta((m: any) => ({ ...m, globeMarkers: markers, globeConnections: buildConnections(markers) }));
              }} />
            </details>

            {/* Markers list */}
            <div className="space-y-2">
              {((meta as any).globeMarkers || []).length === 0 && (
                <p className="text-white/20 text-xs font-mono py-4 text-center">No cities added yet. Globe will use default markers.</p>
              )}
              {((meta as any).globeMarkers || []).map((m: any, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                  <span className="flex-1 text-sm text-white font-medium">{m.label}</span>
                  <span className="text-[10px] text-white/30 font-mono">{Number(m.lat).toFixed(2)}, {Number(m.lng).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const markers = ((meta as any).globeMarkers || []).filter((_: any, j: number) => j !== i);
                      setMeta((prev: any) => ({ ...prev, globeMarkers: markers, globeConnections: buildConnections(markers) }));
                    }}
                    className="text-white/20 hover:text-red-400 transition-colors ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {((meta as any).globeMarkers || []).length > 0 && (
              <p className="text-[10px] text-white/30 font-mono mt-3">
                {((meta as any).globeMarkers || []).length} cities · {((meta as any).globeConnections || []).length} connections auto-generated
              </p>
            )}
          </Card>
          <SaveButton loading={savingMeta} saved={metaSaved} onClick={saveMeta} label="Save Metadata" />
        </div>
      </Card>

      {/* Sections */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">
          Sections ({sections.length})
        </h2>
        <button onClick={() => { setEditingSection(null); setSectionForm({ sectionType: "Essay", order: sections.length, type: "text", heading: "", body: "", highlightStyle: "normal" }); setShowSectionForm(true); }}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} /> Add Section
        </button>
      </div>

      {showSectionForm && (
        <Card className="mb-6">
          <SectionTitle>{editingSection ? "Edit Section" : "New Section"}</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Section Type">
              <Select value={sectionForm.sectionType} onChange={e => setS("sectionType", e.target.value)}>
                {SECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                {/* A section saved under an older type keeps its value instead of
                    silently snapping to the first option when it is edited. */}
                {sectionForm.sectionType && !(SECTION_TYPES as readonly string[]).includes(sectionForm.sectionType) && (
                  <option value={sectionForm.sectionType}>{sectionForm.sectionType} (existing)</option>
                )}
              </Select>
            </Field>
            <Field label="Display Type">
              <Select value={sectionForm.type} onChange={e => setS("type", e.target.value)}>
                <option value="text">Text / Essay</option>
                <option value="quote">Quote</option>
                <option value="principle">Principles Grid</option>
                <option value="vision_grid">Vision Grid</option>
              </Select>
            </Field>
            <Field label="Highlight Style">
              <Select value={sectionForm.highlightStyle} onChange={e => setS("highlightStyle", e.target.value)}>
                <option value="normal">Normal</option>
                <option value="emphasized">Emphasized</option>
              </Select>
            </Field>
          </div>

          {(sectionForm.type === "text" || sectionForm.type === "vision_grid") && (
            <div className="mt-4 space-y-4">
              <Field label="Heading">
                <Input value={sectionForm.heading || ""} onChange={e => setS("heading", e.target.value)} />
              </Field>
              <Field label="Body Text" hint="Plain text (blank lines = paragraphs) or paste HTML for rich formatting">
                <Textarea value={sectionForm.body || ""} onChange={e => setS("body", e.target.value)} rows={10} />
              </Field>
            </div>
          )}

          {sectionForm.type === "quote" && (
            <div className="mt-4 space-y-4">
              <Field label="Quote Text">
                <Textarea value={sectionForm.text || ""} onChange={e => setS("text", e.target.value)} rows={3} />
              </Field>
              <Field label="Author Attribution">
                <Input value={sectionForm.authorAttr || ""} onChange={e => setS("authorAttr", e.target.value)} />
              </Field>
            </div>
          )}

          <div className="mt-4">
            <Field label="Pull Quote (optional)">
              <Input value={sectionForm.pullQuote || ""} onChange={e => setS("pullQuote", e.target.value)} />
            </Field>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <SaveButton onClick={saveSection} label={editingSection ? "Update Section" : "Add Section"} />
            <button onClick={() => { setShowSectionForm(false); setEditingSection(null); }} className="text-sm text-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {sections.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition-colors">
            <div className="text-white/20 flex flex-col gap-0.5">
              <button onClick={() => moveSection(i, "up")} disabled={i === 0} className="hover:text-white disabled:opacity-20 transition-colors"><ChevronUp size={14} /></button>
              <button onClick={() => moveSection(i, "down")} disabled={i === sections.length - 1} className="hover:text-white disabled:opacity-20 transition-colors"><ChevronDown size={14} /></button>
            </div>
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-xs font-mono text-white/40">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">{s.heading || s.text?.slice(0, 60) || `${s.sectionType} — ${s.type}`}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.sectionType} · {s.type} · {s.highlightStyle}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => editSection(s)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => deleteSection(s.id!)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">No sections yet. Add your first manifesto section.</div>
        )}
      </div>
    </div>
  );
}