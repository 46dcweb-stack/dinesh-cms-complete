"use client";
import { useEffect, useState } from "react";
import { teamService } from "@/lib/firebase-services";
import type { TeamMember } from "@/lib/types";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, Select, Toggle,
  SaveButton, ImageUpload, Alert, Card, SectionTitle, StatusBadge,
} from "../components/ui";

const EMPTY: Omit<TeamMember, "id"> = {
  name: "", role: "", bio: "", image: "",
  linkedIn: "", twitter: "",
  sortOrder: 0, featured: false, status: "active",
};

const NAME_MIN = 3;
const NAME_MAX = 80;
const ROLE_MIN = 2;
const ROLE_MAX = 100;

export default function TeamAdmin() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Omit<TeamMember, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setItems(await teamService.getAll());
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

  function openEdit(item: TeamMember) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setShowForm(true);
  }

  async function handleSave() {
    const payload: Omit<TeamMember, "id"> = {
      ...form,
      name: form.name.trim(),
      role: form.role.trim(),
      bio: form.bio.trim(),
      image: form.image.trim(),
      linkedIn: (form.linkedIn || "").trim(),
      twitter: (form.twitter || "").trim(),
      sortOrder: Number(form.sortOrder) || 0,
    };

    if (!payload.name || !payload.role) {
      setError("Name and Role are required.");
      return;
    }

    if (payload.name.length < NAME_MIN || payload.name.length > NAME_MAX) {
      setError(`Name must be between ${NAME_MIN} and ${NAME_MAX} characters.`);
      return;
    }

    if (payload.role.length < ROLE_MIN || payload.role.length > ROLE_MAX) {
      setError(`Role must be between ${ROLE_MIN} and ${ROLE_MAX} characters.`);
      return;
    }

    setSaving(true); setError("");
    try {
      if (editing?.id) { await teamService.update(editing.id, payload); }
      else { await teamService.create(payload); }
      setSaved(true); setShowForm(false); load();
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this team member?")) return;
    await teamService.delete(id); load();
  }

  async function move(index: number, dir: "up" | "down") {
    const arr = [...items];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    for (let i = 0; i < arr.length; i++) await teamService.update(arr[i].id!, { sortOrder: i });
    load();
  }

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Leadership & Team"
        subtitle="Manage team members shown in About page — Leadership & Logic section"
        action={
          <button onClick={openNew} className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <Plus size={14} /> Add Member
          </button>
        }
      />

      {showForm && (
        <Card className="mb-8">
          <SectionTitle>{editing ? "Edit Team Member" : "Add Team Member"}</SectionTitle>
          {error && <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 mb-4">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" required><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Elena Rossi" minLength={NAME_MIN} maxLength={NAME_MAX} /></Field>
            <Field label="Role / Title" required><Input value={form.role} onChange={e => set("role", e.target.value)} placeholder="Head of Strategy" minLength={ROLE_MIN} maxLength={ROLE_MAX} /></Field>
            <div className="col-span-2">
              <Field label="Bio" hint="Short description shown on hover">
                <Textarea value={form.bio} onChange={e => set("bio", e.target.value)} rows={3} placeholder="Specializing in global operations..." />
              </Field>
            </div>
            <Field label="LinkedIn URL"><Input value={form.linkedIn || ""} onChange={e => set("linkedIn", e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
            <Field label="Twitter / X URL"><Input value={form.twitter || ""} onChange={e => set("twitter", e.target.value)} placeholder="https://twitter.com/..." /></Field>
            <Field label="Sort Order" hint="Lower = appears first"><Input type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} min={0} /></Field>
            <Field label="Status">
              <Select value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="active">Active — Visible on site</option>
                <option value="hidden">Hidden</option>
              </Select>
            </Field>
            <div className="col-span-2">
              <Field label="Profile Photo">
                <ImageUpload value={form.image} onChange={v => set("image", v)} folder="team" />
              </Field>
            </div>
            <Toggle checked={form.featured} onChange={v => set("featured", v)} label="Featured Member" />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <SaveButton loading={saving} saved={saved} onClick={handleSave} label={editing ? "Update Member" : "Add Member"} />
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-sm text-white/40 hover:text-white transition-colors">Cancel</button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">
            No team members yet. Add the first one above.<br />
            <span className="text-xs text-white/20 mt-1 block">They appear in the Leadership & Logic section on /about</span>
          </div>
        ) : items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition-colors">
            <div className="flex flex-col gap-0.5 text-white/20">
              <button onClick={() => move(i, "up")} disabled={i === 0} className="hover:text-white disabled:opacity-20"><ChevronUp size={14} /></button>
              <button onClick={() => move(i, "down")} disabled={i === items.length - 1} className="hover:text-white disabled:opacity-20"><ChevronDown size={14} /></button>
            </div>
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border border-white/10 flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#E22D2D]/15 border border-[#E22D2D]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#E22D2D] font-bold text-lg">{item.name[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm">{item.name}</div>
              <div className="text-xs text-[#E22D2D] font-mono uppercase tracking-wider mt-0.5">{item.role}</div>
              {item.bio && <div className="text-xs text-white/30 mt-1 truncate">{item.bio}</div>}
            </div>
            <StatusBadge status={item.status} />
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(item.id!)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <p className="text-xs text-white/20 mt-4">{items.filter(m => m.status === "active").length} active · {items.filter(m => m.status === "hidden").length} hidden</p>
      )}
    </div>
  );
}
