/**
 * Static Zari logo — the purple-to-blue orb with glow ring.
 * Use this in server components where ZariOrb (animated) can't be used.
 */
export function ZariLogo({ size = 32 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size * 1.2, height: size * 1.2 }}
    >
      {/* Ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.12,
          height: size * 1.12,
          border: "1px solid rgba(124,92,252,0.3)",
          boxShadow: "0 0 8px rgba(79,139,255,0.15)",
        }}
      />
      {/* Orb */}
      <div
        className="rounded-full shrink-0"
        style={{
          width: size,
          height: size,
          background: "radial-gradient(circle at 38% 35%, #d8b4fe 0%, #a78bfa 20%, #7c5cfc 45%, #4f8bff 75%, #38b2ff 100%)",
          boxShadow: `0 0 ${size * 0.3}px rgba(124,92,252,0.3)`,
        }}
      />
    </div>
  );
}
