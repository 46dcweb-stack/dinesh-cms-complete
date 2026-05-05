# Dinesh Portfolio — Firebase CMS Setup Guide

---

## STEP 1 — Install Firebase dependency

```bash
npm install firebase
```

---

## STEP 2 — Create .env.local

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Get values from:
**Firebase Console → Project Settings (⚙️ gear) → General → Your Apps → SDK Setup & Configuration**

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dineshportfolio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dineshportfolio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dineshportfolio.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## STEP 3 — Firebase Console Checklist

### ✅ A. Authentication — Enable Email/Password

1. Firebase Console → **Authentication** → **Sign-in method**
2. Click **Email/Password** → Enable → Save
3. Go to **Authentication → Users → Add User**
4. Create your admin account: `admin@dinesh.com` + strong password
5. Copy the **UID** shown — you'll need it in Step 5

---

### ✅ B. Firestore Rules — Paste the security rules

1. Firebase Console → **Firestore Database** → **Rules** tab
2. Replace everything with the contents of `firestore.rules`
3. Click **Publish**

---

### ✅ C. Firestore Indexes — Create compound indexes

**Option 1 — Automatic (recommended):**
Run your app. When a query fails with a "missing index" error, Firebase shows a direct link in the browser console to create it. Click each link.

**Option 2 — Manual via Firebase CLI:**
```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project
# It will detect firestore.indexes.json automatically
firebase deploy --only firestore:indexes
```

**Option 3 — Manual via Console:**
Firebase Console → **Firestore → Indexes → Composite** → Add each from `firestore.indexes.json`:

| Collection | Fields | Order |
|---|---|---|
| blogPosts | status ASC, publishDate DESC | |
| pressMentions | status ASC, sortOrder ASC | |
| faqItems | status ASC, sortOrder ASC | |
| subscribers | email ASC, status ASC | |
| contactSubmissions | status ASC, createdAt DESC | |
| auditLogs | collection ASC, createdAt DESC | |
| ventures | status ASC, sortOrder ASC | |
| galleryImages | status ASC, sortOrder ASC | |

---

### ✅ D. Storage Rules — Paste storage rules

1. Firebase Console → **Storage** → **Rules** tab
2. Replace with contents of `storage.rules`
3. Click **Publish**

---

### ✅ E. Storage — Enable CORS (if images don't load)

Create a file `cors.json`:
```json
[
  {
    "origin": ["http://localhost:3000", "https://yourdomain.com"],
    "method": ["GET", "POST"],
    "maxAgeSeconds": 3600
  }
]
```
Then run:
```bash
gsutil cors set cors.json gs://your-project-id.appspot.com
```

---

## STEP 4 — Create your first Admin user in Firestore

After enabling Auth and creating your user, you must add them to the `adminUsers` collection:

1. Firebase Console → **Firestore** → `adminUsers` collection
2. Click **Add document**
3. Document ID = **your Firebase Auth UID** (from Step 3A)
4. Add these fields:
   - `email` (string): `admin@dinesh.com`
   - `role` (string): `admin`
   - `displayName` (string): `Dinesh`

---

## STEP 5 — Run the app

```bash
npm install
npm run dev
```

Visit: **http://localhost:3000/admin**

Login with the credentials you created in Step 3A.

---

## STEP 6 — Manual Testing Checklist

### Admin Panel
- [ ] `/admin/login` — Login works
- [ ] `/admin` — Dashboard loads with stats
- [ ] `/admin/home` — Save home page, verify on `/`
- [ ] `/admin/about` — Add bio, milestones, save → verify on `/about`
- [ ] `/admin/blog/new` — Create blog post → set Published → verify on `/blog`
- [ ] `/admin/blog/[id]` — Edit post, check slug
- [ ] `/admin/press/new` — Add press item → verify on `/press`
- [ ] `/admin/manifesto` — Add metadata + 2 sections → verify on `/manifesto`
- [ ] `/admin/faq/new` — Add FAQ → verify on `/faq`
- [ ] `/admin/ventures` — Add venture → verify on homepage
- [ ] `/admin/gallery` — Upload image → verify on `/gallery`
- [ ] `/admin/subscribers` — Subscribe via homepage form → check it appears here
- [ ] `/admin/contacts` — Submit contact form → check inbox
- [ ] `/admin/settings` — Save site name → verify
- [ ] `/admin/users` — Add editor user (needs their Firebase Auth UID)
- [ ] `/admin/audit` — All edits above should appear in log

### Frontend (data from Firebase)
- [ ] `/` — Hero, ethos, ventures load from CMS
- [ ] `/blog` — Posts from CMS appear
- [ ] `/blog/[slug]` — Individual post loads
- [ ] `/press` — Press items from CMS appear
- [ ] `/about` — Bio, milestones from CMS
- [ ] `/faq` — FAQ from CMS grouped by category
- [ ] `/manifesto` — Sections in correct order
- [ ] Contact form → submission lands in `/admin/contacts`
- [ ] Newsletter signup → subscriber in `/admin/subscribers`

---

## Collection Reference

| Firestore Collection | Admin Page | Frontend Page |
|---|---|---|
| `homePage/main` | /admin/home | / |
| `aboutPage/main` | /admin/about | /about |
| `blogPosts` | /admin/blog | /blog, /blog/[slug] |
| `pressMentions` | /admin/press | /press |
| `manifestoMeta/main` + `manifestoSections` | /admin/manifesto | /manifesto |
| `faqItems` | /admin/faq | /faq |
| `ventures` | /admin/ventures | / (homepage) |
| `galleryImages` | /admin/gallery | /gallery |
| `subscribers` | /admin/subscribers | (newsletter forms) |
| `contactSubmissions` | /admin/contacts | (contact form) |
| `siteSettings/main` | /admin/settings | (global) |
| `adminUsers` | /admin/users | (auth guard) |
| `auditLogs` | /admin/audit | (log only) |
