"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AdminUser } from "@/lib/types";
import { useAuth } from "../context/AuthContext";
import {
  AdminPageHeader, Field, Input, Select, Alert, Card, SectionTitle,
} from "../components/ui";
import { Plus, Trash2, Shield, User, Copy, Check, Link2, ChevronDown, ChevronUp } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  admin:  "bg-[#E22D2D]/15 text-[#E22D2D] border-[#E22D2D]/20",
  editor: "bg-blue-400/15 text-blue-400 border-blue-400/20",
  author: "bg-green-400/15 text-green-400 border-green-400/20",
};

const SECTIONS = ["Blog", "Press", "Ventures", "Gallery", "FAQ", "Manifesto", "About", "Team", "Settings", "Users"];

const ROLE_DEFAULTS: Record<string, Record<string, Record<string, boolean>>> = {
  admin: Object.fromEntries(SECTIONS.map(s => [s, { view: true, create: true, edit: true, delete: true, publish: true }])),
  editor: Object.fromEntries(SECTIONS.map(s => [s, {
    view: true,
    create: !["Settings", "Users"].includes(s),
    edit: !["Settings", "Users"].includes(s),
    delete: !["Settings", "Users"].includes(s),
    publish: !["Settings", "Users"].includes(s),
  }])),
  author: Object.fromEntries(SECTIONS.map(s => [s, {
    view: ["Blog", "Gallery"].includes(s),
    create: s === "Blog",
    edit: s === "Blog",
    delete: false,
    publish: false,
  }])),
};

const PERM_COLS = ["view", "create", "edit", "delete", "publish"];
const NO_PERM: Record<string, string[]> = {
  Settings: ["create", "delete", "publish"],
  Users: ["create", "delete", "publish"],
  Gallery: ["publish"],
  Team: ["publish"],
  About: ["create", "delete", "publish"],
  Manifesto: ["create", "delete", "publish"],
};

function PermMatrix({ perms, onChange }: {
  perms: Record<string, Record<string, boolean>>;
  onChange: (p: Record<string, Record<string, boolean>>) => void;
}) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left text-white/30 font-mono uppercase tracking-wider pb-3 pr-4">Section</th>
            {PERM_COLS.map(c => (
              <th key={c} className="text-center text-white/30 font-mono uppercase tracking-wider pb-3 px-2">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {SECTIONS.map(section => (
            <tr key={section}>
              <td className="py-2.5 pr-4 text-white/70 font-medium">{section}</td>
              {PERM_COLS.map(col => {
                const disabled = (NO_PERM[section] || []).includes(col);
                const checked = perms[section]?.[col] ?? false;
                return (
                  <td key={col} className="py-2.5 px-2 text-center">
                    {disabled ? (
                      <span className="text-white/10">—</span>
                    ) : (
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => {
                          const next = { ...perms, [section]: { ...perms[section], [col]: e.target.checked } };
                          onChange(next);
                        }}
                        className="w-4 h-4 accent-brand-primary cursor-pointer"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UsersAdmin() {
  const { isAdmin, adminUser } = useAuth();
  const [users, setUsers]               = useState<AdminUser[]>([]);
  const [invites, setInvites]           = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied]             = useState(false);
  const [showPerms, setShowPerms]       = useState(false);
  const [editingPermsUid, setEditingPermsUid] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    displayName: "",
    role: "editor" as "admin" | "editor" | "author",
    permissions: ROLE_DEFAULTS["editor"],
  });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [usersSnap, invitesSnap] = await Promise.all([
      getDocs(collection(db, "adminUsers")),
      getDocs(collection(db, "adminInvites")),
    ]);
    setUsers(usersSnap.docs.map(d => ({ uid: d.id, ...d.data() } as AdminUser)));
    setInvites(invitesSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter((i: any) => i.status === "pending"));
    setLoading(false);
  }

  function handleRoleChange(role: "admin" | "editor" | "author") {
    setForm(f => ({ ...f, role, permissions: ROLE_DEFAULTS[role] }));
  }

  async function generateInvite() {
    if (!form.email) { setError("Email is required."); return; }
    setSaving(true); setError(""); setGeneratedLink("");
    try {
      // Store a pre-approval record — when the person signs in with Google
      // the AuthContext will find this record and create their adminUsers doc
      await addDoc(collection(db, "adminInvites"), {
        email: form.email.toLowerCase().trim(),
        displayName: form.displayName,
        role: form.role,
        permissions: form.permissions,
        status: "pending",
        createdAt: serverTimestamp(),
        createdBy: adminUser?.uid,
      });
      setGeneratedLink(`Ask ${form.email} to go to ${typeof window !== "undefined" ? window.location.origin : ""}/admin and sign in with their Google account.`);
      setForm({ email: "", displayName: "", role: "editor", permissions: ROLE_DEFAULTS["editor"] });
      load();
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function revokeInvite(id: string) {
    await deleteDoc(doc(db, "adminInvites", id));
    load();
  }

  async function handleDelete(uid: string) {
    if (uid === adminUser?.uid) { alert("You cannot remove your own account."); return; }
    if (!confirm("Remove this user from the CMS?")) return;
    await deleteDoc(doc(db, "adminUsers", uid));
    load();
  }

  async function updateRole(uid: string, role: AdminUser["role"]) {
    await setDoc(doc(db, "adminUsers", uid), { role }, { merge: true });
    load();
  }

  async function savePerms(uid: string, perms: Record<string, Record<string, boolean>>) {
    await setDoc(doc(db, "adminUsers", uid), { permissions: perms }, { merge: true });
    setEditingPermsUid(null);
    load();
  }

  if (!isAdmin) return (
    <div className="p-8">
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
        <Shield size={32} className="text-white/20 mx-auto mb-3" />
        <p className="text-white/50 text-sm">Admin access required to manage users.</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <AdminPageHeader
        title="Users & Roles"
        subtitle="Invite team members and manage their permissions"
        action={
          !showForm ? (
            <button
              onClick={() => { setShowForm(true); setGeneratedLink(""); }}
              className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={14} /> Invite Member
            </button>
          ) : null
        }
      />

      {/* ── Invite Form ─────────────────────────────────────────── */}
      {showForm && (
        <Card className="mb-8">
          <SectionTitle>Invite New Member</SectionTitle>
          {error && <Alert message={error} className="mb-4" />}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Email" required>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="member@example.com" type="email" />
            </Field>
            <Field label="Display Name">
              <Input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Jane Smith" />
            </Field>
            <div className="col-span-2">
              <Field label="Base Role" hint="Sets default permissions — you can customise below">
                <Select value={form.role} onChange={e => handleRoleChange(e.target.value as any)}>
                  <option value="admin">Admin — Full access to everything</option>
                  <option value="editor">Editor — Create, edit, publish all content</option>
                  <option value="author">Author — Draft blog posts only</option>
                </Select>
              </Field>
            </div>
          </div>

          {/* Permission Matrix toggle */}
          <button
            onClick={() => setShowPerms(p => !p)}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors mb-2"
          >
            {showPerms ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showPerms ? "Hide" : "Customise"} permissions
          </button>

          {showPerms && (
            <PermMatrix
              perms={form.permissions}
              onChange={p => setForm(f => ({ ...f, permissions: p }))}
            />
          )}

          {/* Generated link */}
          {generatedLink && (
            <div className="mt-5 p-4 bg-green-400/10 border border-green-400/20 rounded-xl">
              <p className="text-green-400 text-xs font-mono mb-2 uppercase tracking-wider">Invite link generated — valid for 7 days</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-white/70 truncate bg-white/5 rounded-lg px-3 py-2">
                  {generatedLink}
                </code>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-400/20 hover:bg-green-400/30 text-green-400 text-xs font-bold transition-colors flex-shrink-0"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-white/30 text-xs mt-2">Once they sign in with Google, they'll have access immediately.</p>
            </div>
          )}

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={generateInvite}
              disabled={saving}
              className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <Link2 size={14} />
              {saving ? "Adding…" : "Add Member"}
            </button>
            <button onClick={() => { setShowForm(false); setGeneratedLink(""); }} className="text-sm text-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* ── Pending Invites ────────────────────────────────────── */}
      {invites.length > 0 && (
        <Card className="mb-6">
          <SectionTitle>Pending Invites</SectionTitle>
          <div className="space-y-2">
            {invites.map((inv: any) => (
              <div key={inv.id} className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{inv.email}</div>
                  <div className="text-xs text-white/30 mt-0.5">
                    Expires {new Date(inv.expiresAt).toLocaleDateString()} · Role: {inv.role}
                  </div>
                </div>
                <button
                  onClick={() => revokeInvite(inv.id)}
                  className="text-xs text-white/30 hover:text-red-400 transition-colors"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Role descriptions ─────────────────────────────────── */}
      <Card className="mb-6">
        <SectionTitle>Role Permissions</SectionTitle>
        <div className="space-y-3">
          {[
            { role: "Admin",  desc: "Full access to all content, settings, and user management." },
            { role: "Editor", desc: "Can create, edit, and publish all content. Cannot manage users or settings." },
            { role: "Author", desc: "Can draft blog posts only. Cannot publish without editor approval." },
          ].map(({ role, desc }) => (
            <div key={role} className="flex items-start gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-mono flex-shrink-0 mt-0.5 ${ROLE_COLORS[role.toLowerCase()]}`}>{role}</span>
              <p className="text-sm text-white/50">{desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Users list ────────────────────────────────────────── */}
      <div className="space-y-2">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">No users yet.</div>
        ) : users.map(u => (
          <div key={u.uid} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">{u.displayName || u.email}</div>
                <div className="text-xs text-white/30 mt-0.5">{u.email}</div>
              </div>
              <select
                value={u.role}
                onChange={e => updateRole(u.uid, e.target.value as AdminUser["role"])}
                disabled={u.uid === adminUser?.uid}
                className={`text-xs px-2.5 py-1 rounded-full border font-mono bg-transparent cursor-pointer disabled:cursor-default ${ROLE_COLORS[u.role]}`}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="author">Author</option>
              </select>
              <button
                onClick={() => setEditingPermsUid(editingPermsUid === u.uid ? null : u.uid)}
                className="text-xs text-white/30 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5 flex items-center gap-1"
              >
                <Shield size={12} /> Permissions
              </button>
              {u.uid !== adminUser?.uid && (
                <button onClick={() => handleDelete(u.uid)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
              {u.uid === adminUser?.uid && <span className="text-xs text-white/20 font-mono">(you)</span>}
            </div>

            {/* Inline permission editor */}
            {editingPermsUid === u.uid && (
              <div className="border-t border-white/10 px-5 pb-5">
                <PermMatrix
                  perms={(u as any).permissions || ROLE_DEFAULTS[u.role]}
                  onChange={p => setUsers(prev => prev.map(usr => usr.uid === u.uid ? { ...usr, permissions: p } as any : usr))}
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => savePerms(u.uid, (users.find(usr => usr.uid === u.uid) as any)?.permissions || ROLE_DEFAULTS[u.role])}
                    className="text-xs bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary/80 transition-colors"
                  >
                    Save Permissions
                  </button>
                  <button onClick={() => setEditingPermsUid(null)} className="text-xs text-white/40 hover:text-white transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}