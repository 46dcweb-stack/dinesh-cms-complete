# Dinesh Koyyalamudi Portfolio — Frontend Only

A clean Next.js 15 portfolio site with **zero backend dependencies**.
All CMS, Firebase, Firestore, FireCMS, and admin panel code has been removed.

## Stack
- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **Framer Motion** (animations)
- **Lenis** (smooth scroll)
- **date-fns** (date formatting)
- **lucide-react** (icons)

## Getting Started

```bash
npm install
npm run dev
```

## Content Management

All content lives in one file:

```
src/lib/data.ts
```

Edit this file to update:
- Hero text, CTAs, quotes
- Ethos principles
- Ventures / portfolio
- Blog posts and their full HTML content
- Press mentions
- FAQ groups and questions
- Gallery images
- About page bios, milestones, values
- Manifesto blocks

## Adding a New Blog Post

Open `src/lib/data.ts` and add to the `blogPosts` array:

```ts
{
  id: "5",
  slug: "my-new-post",
  title: "My New Post Title",
  excerpt: "Short description...",
  content: `<p>Full HTML content here.</p>`,
  tags: ["Leadership"],
  publishDate: "2025-01-15",
  featuredImage: "https://...",
}
```

## Form Submissions

The contact form and newsletter form currently log a stub result.
To wire them up, edit:
- `src/components/sections/ContactForm.tsx` — find the `// TODO` comment
- `src/components/sections/Newsletter.tsx` — find the `// TODO` comment

Replace with your preferred service (Resend, EmailJS, Formspree, etc.).

## CMS Integration (Later)

When you're ready to add a CMS back:
1. Replace `src/lib/data.ts` exports with async functions
2. Convert server pages to `async` and call your data fetching functions
3. Pages already pass data down as props — just swap the source

## Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About & Story |
| `/blog` | Blog Listing |
| `/blog/[slug]` | Blog Post |
| `/contact` | Contact |
| `/faq` | FAQ |
| `/gallery` | Gallery |
| `/press` | Press & Media |
| `/manifesto` | Manifesto |
| `/subscribe` | Newsletter |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Use |
| `/cookies` | Cookie Policy |
