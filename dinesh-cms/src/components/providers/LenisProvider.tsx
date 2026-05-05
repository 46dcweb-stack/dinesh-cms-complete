// "use client";

// import { ReactLenis } from "lenis/react";
// import { ReactNode } from "react";

// export default function LenisProvider({ children }: { children: ReactNode }) {
//     return (
//         <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
//             {children}
//         </ReactLenis>
//     );
// }
"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
