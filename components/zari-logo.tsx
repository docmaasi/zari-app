/**
 * Static Zari logo — magenta→violet→cyan orb with brand-colored ring.
 * Lightweight, no framer-motion, safe in server components.
 *
 * Prefer the new <ZariMark /> in components/brand for new code; this is kept
 * as a back-compat shim for places that still import @/components/zari-logo.
 */
export function ZariLogo({ size = 32 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size * 1.2, height: size * 1.2 }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.12,
          height: size * 1.12,
          border: "1px solid rgba(255,61,138,0.35)",
          boxShadow: "0 0 10px rgba(255,61,138,0.25)",
        }}
      />
      <div
        className="rounded-full shrink-0"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 35% 30%, #ffd2e3 0%, #ff7eb1 18%, #ff3d8a 40%, #b14aff 72%, #5cf1ff 100%)",
          boxShadow: `0 0 ${size * 0.35}px rgba(255,61,138,0.35)`,
        }}
      />
    </div>
  );
}
