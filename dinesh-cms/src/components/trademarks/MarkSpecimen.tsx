import Image from "next/image";

// The specimen box. A word mark deliberately has NO image: it renders the name
// in the display face with a caption explaining that a word mark protects the
// name in any typeface. That caption is doing real work — it is the single most
// misunderstood thing about trademarks.
export default function MarkSpecimen({
  name,
  image,
  bg = "Dark",
  className = "",
  textClass = "text-2xl",
}: {
  name: string;
  image?: string;
  bg?: "Light" | "Dark" | "Transparent";
  className?: string;
  textClass?: string;
}) {
  const surface =
    bg === "Light" ? "bg-white" : bg === "Transparent" ? "bg-transparent" : "bg-black";

  if (image) {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-white/10 ${surface} ${className}`}>
        <Image src={image} alt={`${name} mark as filed`} fill className="object-contain p-3" sizes="320px" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 ${className}`}>
      <span className={`font-display text-white text-center leading-tight break-words ${textClass}`}>
        {name}
      </span>
    </div>
  );
}
