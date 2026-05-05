// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence, Variants } from "framer-motion";

// const words = ["Hello", "Bonjour", "Ciao", "Olà", "Hoi", "G'day", "Hej", "नमस्ते", "Welcome"];

// const opacity: Variants = {
//     initial: {
//         opacity: 0
//     },
//     enter: {
//         opacity: 0.75,
//         transition: { duration: 1, delay: 0.2 }
//     },
// }

// const slideUp: Variants = {
//     initial: {
//         top: 0
//     },
//     exit: {
//         top: "-100vh",
//         transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
//     }
// }

// export default function CurveLoader() {
//     const [index, setIndex] = useState(0);
//     const [dimension, setDimension] = useState({ width: 0, height: 0 });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         setDimension({ width: window.innerWidth, height: window.innerHeight });
//     }, []);

//     useEffect(() => {
//         if (index === words.length - 1) {
//             setTimeout(() => {
//                 setLoading(false);
//                 document.body.style.cursor = 'default';
//                 window.scrollTo(0, 0);
//             }, 500);
//             return;
//         }
//         const timeout = setTimeout(() => {
//             setIndex(index + 1);
//         }, index === 0 ? 1000 : 150);
//         return () => clearTimeout(timeout);
//     }, [index]);

//     const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
//     const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

//     const curve: Variants = {
//         initial: {
//             d: initialPath,
//             transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
//         },
//         exit: {
//             d: targetPath,
//             transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
//         }
//     };

//     if (dimension.width === 0) {
//         return (
//             <div className="fixed inset-0 z-[99999] bg-[#141516]" />
//         );
//     }

//     return (
//         <AnimatePresence mode="wait">
//             {loading && (
//                 <motion.div
//                     variants={slideUp}
//                     initial="initial"
//                     exit="exit"
//                     className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#141516]"
//                 >
//                     <motion.p
//                         variants={opacity}
//                         initial="initial"
//                         animate="enter"
//                         className="flex items-center text-white text-[42px] z-[1] font-display font-medium"
//                     >
//                         <span className="block w-[12px] h-[12px] bg-white rounded-full mr-[12px]" />
//                         {words[index]}
//                     </motion.p>
//                     <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none fill-[#141516]">
//                         <motion.path
//                             variants={curve}
//                             initial="initial"
//                             exit="exit"
//                         />
//                     </svg>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const words = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olà",
  "Hoi",
  "G'day",
  "Hej",
  "नमस्ते",
  "Welcome",
];

export default function CurveLoader() {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);

  // Keep the SVG path stable (no window-dependent geometry).
  const paths = useMemo(() => {
    // 0..100 coordinate space; scales to viewport via viewBox.
    const initial = "M0 0 L100 0 L100 100 Q50 130 0 100 L0 0"; // bulge down
    const target = "M0 0 L100 0 L100 100 Q50 100 0 100 L0 0"; // flat bottom
    return { initial, target };
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Fewer updates = less main-thread work.
    // Show the first word longer, then cycle faster.
    const isLast = index >= words.length - 1;

    if (isLast) {
      const t = window.setTimeout(
        () => setOpen(false),
        prefersReducedMotion ? 0 : 400,
      );
      return () => window.clearTimeout(t);
    }

    const delay = index === 0 ? 700 : 180;
    const t = window.setTimeout(
      () => setIndex((i) => i + 1),
      prefersReducedMotion ? 0 : delay,
    );
    return () => window.clearTimeout(t);
  }, [index, open, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // Only animate transforms + opacity (avoid layout-triggering properties). [web:65]
          initial={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 1,
            y: "-100vh",
            transition: {
              duration: prefersReducedMotion ? 0 : 0.65,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#141516]"
          style={{ willChange: "transform" }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.75,
              transition: {
                duration: prefersReducedMotion ? 0 : 0.6,
                delay: 0.1,
              },
            }}
            className="flex items-center text-white text-[42px] z-[1] font-display font-medium"
          >
            <span className="block w-[12px] h-[12px] bg-white rounded-full mr-[12px]" />
            {words[index]}
          </motion.p>

          {/* Stable SVG: no dynamic height like h-[calc(100%+300px)], no window reads. */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none fill-[#141516]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              initial={{ d: paths.initial }}
              exit={{
                d: paths.target,
                transition: {
                  duration: prefersReducedMotion ? 0 : 0.6,
                  ease: [0.76, 0, 0.24, 1],
                },
              }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
