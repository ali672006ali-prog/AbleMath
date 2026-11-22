import { CSSProperties } from 'react';

interface CelebrationOverlayProps {
  active: boolean;
}

const CONFETTI_COLORS = ['#22C55E', '#FACC15', '#38BDF8', '#FB923C', '#F472B6', '#A78BFA'];

const PIECES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 3.6 + (i % 3) * 1.4) % 98}%`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: `${(i % 7) * 0.08}s`,
  duration: `${2.1 + (i % 5) * 0.28}s`,
  size: i % 3 === 0 ? 14 : 10,
  isCircle: i % 2 === 0,
}));

export function CelebrationOverlay({ active }: CelebrationOverlayProps) {
  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {PIECES.map((piece) => (
        <span
          key={piece.id}
          className="animate-confetti-piece absolute top-0 block"
          style={
            {
              left: piece.left,
              width: `${piece.size}px`,
              height: `${piece.isCircle ? piece.size : piece.size * 1.4}px`,
              backgroundColor: piece.color,
              borderRadius: piece.isCircle ? '9999px' : '3px',
              '--fall-delay': piece.delay,
              '--fall-duration': piece.duration,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
