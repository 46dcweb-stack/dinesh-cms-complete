"use client";
import { motion } from "framer-motion";

export default function BlogContentWrapper({ content }: { content: string }) {
  if (!content) return null;

  // Detect if content is HTML (starts with < tag)
  const isHtml = content.trimStart().startsWith("<");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="blog-content prose prose-invert prose-lg max-w-none
        prose-headings:font-display prose-headings:text-white
        prose-p:text-text-secondary prose-p:leading-relaxed
        prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white prose-blockquote:border-brand-primary
        prose-blockquote:text-text-secondary prose-code:text-brand-primary
        prose-img:rounded-2xl prose-hr:border-white/10"
      {...(isHtml
        ? { dangerouslySetInnerHTML: { __html: content } }
        : {}
      )}
    >
      {!isHtml && (
        content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))
      )}
    </motion.div>
  );
}
