"use client";

import { motion } from "framer-motion";

export default function BlogContentWrapper({ content }: { content: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
