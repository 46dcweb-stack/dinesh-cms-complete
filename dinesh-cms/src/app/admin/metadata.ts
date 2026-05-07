import type { Metadata } from "next";

export const adminMetadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "Admin | Dinesh CMS", template: "%s | Admin" },
};
