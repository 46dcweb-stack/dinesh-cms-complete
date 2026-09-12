import { statusTone } from "@/lib/trademarks";

const TONE = {
  registered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
  pending:    "text-blue-400 bg-blue-400/10 border-blue-400/25",
  closed:     "text-white/40 bg-white/5 border-white/10",
} as const;

export default function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${TONE[statusTone(status)]}`}>
      {status}
    </span>
  );
}
