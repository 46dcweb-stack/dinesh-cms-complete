"use client";
import { useEffect, useState } from "react";
import { ventureService } from "@/lib/firebase-services";
import type { Venture } from "@/lib/types";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, Select, Toggle,
  SaveButton, ImageUpload, Alert, Card, SectionTitle, StatusBadge,
} from "../components/ui";

const EMPTY: Omit<Venture, "id"> = {
  name: "", role: "", description: "", image: "", color: "#E22D2D",
  url: "", sortOrder: 0, featured: false, status: "active",
};

export default function VenturesAdmin() {
  const [items, setItems] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Venture | null>(null);
  const [form, setForm] = useState<Omit<Venture, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setItems(await ventureService.getAll());
    setLoading(false);
  }

  function set(key: keyof typeof form, val: any) {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, sortOrder: items.length });
    setShowForm(true);
  }

  function openEdit(item: Venture) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name) { setError("Venture name is required."); return; }
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await ventureService.update(editing.id, form);
      } else {
        await ventureService.create(form);
      }
      setSaved(true);
      setShowForm(false);
      load();
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this venture?")) return;
    await ventureService.delete(id);
    load();
  }

  async function move(index: number, dir: "up" | "down") {
    const arr = [...items];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    for (let i = 0; i < arr.length; i++) {
      await ventureService.update(arr[i].id!, { sortOrder: i });
    }
    load();
  }

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Ventures"
        subtitle="Manage portfolio ventures shown on the homepage"
        action={
          <button onClick={openNew}
            className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> New Venture
          </button>
        }
      />

      {showForm && (
        <Card className="mb-8">
          <SectionTitle>{editing ? "Edit Venture" : "New Venture"}</SectionTitle>
          {error && <Alert message={error} className="mb-4" />}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Venture Name" required>
              <Input value={form.name} onChange={e => set("name", e.target.value)} />
            </Field>
            <Field label="Your Role">
              <Input value={form.role} onChange={e => set("role", e.target.value)} placeholder="Founder & CEO" />
            </Field>
            <div className="col-span-2">
              <Field label="Description">
                <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} />
              </Field>
            </div>
            <Field label="Website URL">
              <Input value={form.url || ""} onChange={e => set("url", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Card Color (hex)">
              <div className="flex items-center gap-2">
                <Input value={form.color} onChange={e => set("color", e.target.value)} placeholder="#E22D2D" />
                <div className="w-10 h-10 rounded-lg border border-white/10 flex-shrink-0" style={{ backgroundColor: form.color }} />
              </div>
            </Field>
            <Field label="Sort Order">
              <Input type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} min={0} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>
            <div className="col-span-2">
              <Field label="Venture Image">
                <ImageUpload value={form.image} onChange={v => set("image", v)} folder="ventures" />
              </Field>
            </div>
            <Toggle checked={form.featured} onChange={v => set("featured", v)} label="Featured Venture" />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <SaveButton loading={saving} saved={saved} onClick={handleSave} />
            <button onClick={() => setShowForm(false)} className="text-sm text-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading ventures...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">No ventures yet.</div>
        ) : (
          items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition-colors">
              <div className="flex flex-col gap-0.5 text-white/20">
                <button onClick={() => move(i, "up")} disabled={i === 0} className="hover:text-white disabled:opacity-20 transition-colors"><ChevronUp size={14} /></button>
                <button onClick={() => move(i, "down")} disabled={i === items.length - 1} className="hover:text-white disabled:opacity-20 transition-colors"><ChevronDown size={14} /></button>
              </div>
              <div className="w-3 h-8 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
              {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{item.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{item.role}</div>
              </div>
              <StatusBadge status={item.status} />
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(item.id!)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
