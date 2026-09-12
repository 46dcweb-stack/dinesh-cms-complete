import { isRegistered } from "@/lib/trademarks";

// The "registered" stamp.
//
// Whether it appears is DERIVED from status and is not an admin toggle — the
// same rule as the ® symbol. Claiming a mark is registered before the registry
// says so is an offence under s.95 of the UK Trade Marks Act 1994 and s.107 of
// India's Trade Marks Act 1999, so this renders nothing at all for a mark that
// is still in examination. The wording on it is editable; the condition is not.
export default function MarkStamp({
  status,
  label,
  sublabel,
  className = "",
}: {
  status: string;
  label: string;
  /** Already substituted by the caller — typically the country name. */
  sublabel?: string;
  className?: string;
}) {
  if (!isRegistered(status) || !label) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none inline-flex flex-col items-center justify-center
        rounded-[3px] border-2 border-[#E2483D]/70 px-4 py-2 -rotate-[8deg]
        bg-[#E2483D]/5 ${className}`}
    >
      <span className="text-[#E2483D] font-bold uppercase text-[13px] tracking-[0.22em] leading-none">
        {label}
      </span>
      {sublabel && (
        <span className="text-[#E2483D]/80 uppercase text-[9px] tracking-[0.18em] leading-none mt-1.5">
          {sublabel}
        </span>
      )}
    </div>
  );
}
