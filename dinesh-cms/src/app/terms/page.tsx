import LegalPageView, { buildLegalMetadata } from "@/components/legal/LegalPageView";

export const revalidate = 60;

export async function generateMetadata() {
  return buildLegalMetadata("terms");
}

export default async function Page() {
  return <LegalPageView slug="terms" />;
}
