"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AdminUser } from "@/lib/types";
import { useAuth } from "../context/AuthContext";
import {
  AdminPageHeader, Field, Input, Select, SaveButton, Alert, Card, SectionTitle,
} from "../components/ui";
import { Plus, Trash2, Shield, Edit, User } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-[#E22D2D]/15 text-[#E22D2D] border-[#E22D2D]/20",
  editor: "bg-blue-400/15 text-blue-400 border-blue-400/20",
  author: "bg-green-400/15 text-green-400 border-green-400/20",
};

export default function UsersAdmin() {
  const { isAdmin, adminUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ uid: "", email: "", displayName: "", role: "author" as AdminUser["role"] });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const snap = await getDocs(collection(db, "adminUsers"));
    setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() } as AdminUser)));
    setLoading(false);
  }

  async function handleSave() {
    if (!form.uid || !form.email) { setError("UID and email are required."); return; }
    setSaving(true);
    setError("");
    try {
      await setDoc(doc(db, "adminUsers", form.uid), {
        email: form.email,
        displayName: form.displayName,
        role: form.role,
      });
      setSaved(true);
      setShowForm(false);
      setForm({ uid: "", email: "", displayName: "", role: "author" });
      load();
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  async function handleDelete(uid: string) {
    if (uid === adminUser?.uid) { alert("You cannot delete your own account."); return; }
    if (!confirm("Remove this user from CMS?")) return;
    await deleteDoc(doc(db, "adminUsers", uid));
    load();
  }

  async function updateRole(uid: string, role: AdminUser["role"]) {
    await setDoc(doc(db, "adminUsers", uid), { role }, { merge: true });
    load();
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <Shield size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/50 text-sm">Admin access required to manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <AdminPageHeader
        title="Users & Roles"
        subtitle="Manage who has access to the CMS"
        action={
          !showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={14} /> Add User
            </button>
          ) : null
        }
      />

      {showForm && (
        <Card className="mb-8">
          <SectionTitle>Add CMS User</SectionTitle>
          <p className="text-xs text-white/40 mb-4">
            The user must already have a Firebase Auth account. Get their UID from Firebase Console → Authentication → Users.
          </p>
          {error && <Alert message={error} className="mb-4" />}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Firebase UID" required hint="From Firebase Auth console">
              <Input value={form.uid} onChange={e => setForm(f => ({ ...f, uid: e.target.value }))} placeholder="abc123..." />
            </Field>
            <Field label="Email" required>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@example.com" />
            </Field>
            <Field label="Display Name">
              <Input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} />
            </Field>
            <Field label="Role">
              <Select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminUser["role"] }))}>
                <option value="admin">Admin — Full access</option>
                <option value="editor">Editor — Create, edit, publish</option>
                <option value="author">Author — Draft only, own posts</option>
              </Select>
            </Field>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <SaveButton loading={saving} saved={saved} onClick={handleSave} label="Add User" />
            <button onClick={() => setShowForm(false)} className="text-sm text-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Role descriptions */}
      <Card className="mb-6">
        <SectionTitle>Role Permissions</SectionTitle>
        <div className="space-y-3">
          {[
            { role: "Admin", desc: "Full access to all content, settings, and user management." },
            { role: "Editor", desc: "Can create, edit, and publish all content types. Cannot manage users or settings." },
            { role: "Author", desc: "Can create and edit their own blog posts (draft only). Cannot publish without editor approval." },
          ].map(({ role, desc }) => (
            <div key={role} className="flex items-start gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-mono flex-shrink-0 mt-0.5 ${ROLE_COLORS[role.toLowerCase()]}`}>{role}</span>
              <p className="text-sm text-white/50">{desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Users list */}
      <div className="space-y-2">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">No users yet.</div>
        ) : (
          users.map(u => (
            <div key={u.uid} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">{u.displayName || u.email}</div>
                <div className="text-xs text-white/30 mt-0.5">{u.email}</div>
                <div className="text-xs text-white/20 font-mono mt-0.5">{u.uid}</div>
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
              {u.uid !== adminUser?.uid && (
                <button
                  onClick={() => handleDelete(u.uid)}
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
              {u.uid === adminUser?.uid && (
                <span className="text-xs text-white/20 font-mono">(you)</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
