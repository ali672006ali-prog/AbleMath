import { RabbitMood } from '../../types/game';

interface RabbitMascotProps {
  mood?: RabbitMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-20 w-20',
  md: 'h-28 w-28',
  lg: 'h-40 w-40',
};

/**
 * الشخصية الكرتونية المرافقة: الأرنب اللطيف "أرنوب"
 * يعرض تعابير مبتسمة ومشجعة واحتفالية تناسب طلاب التربية الخاصة
 */
export function RabbitMascot({
  mood = 'happy',
  size = 'md',
  className = '',
}: RabbitMascotProps) {
  const isCheering = mood === 'cheering';
  const isEncouraging = mood === 'encouraging';
  const isThinking = mood === 'thinking';

  return (
    <svg
      viewBox="0 0 160 170"
      fill="none"
      role="img"
      aria-label="الأرنب المبتسم المشجع"
      className={`${SIZE_MAP[size]} shrink-0 select-none transition-transform duration-200 ${
        isCheering ? 'scale-105' : ''
      } ${className}`}
    >
      {/* ظل خفيف أسفل الأرنب */}
      <ellipse cx="80" cy="158" rx="44" ry="8" fill="#B7DEC6" opacity="0.65" />

      {/* الأذن اليسرى */}
      <g transform={isThinking ? 'rotate(-10 58 55)' : 'rotate(-6 58 55)'}>
        <ellipse cx="56" cy="40" rx="15" ry="34" fill="#FFFFFF" stroke="#5B6E66" strokeWidth="3.5" />
        <ellipse cx="56" cy="42" rx="8" ry="23" fill="#FBCFE8" />
      </g>

      {/* الأذن اليمنى */}
      <g transform={isCheering ? 'rotate(12 102 55)' : 'rotate(6 102 55)'}>
        <ellipse cx="104" cy="40" rx="15" ry="34" fill="#FFFFFF" stroke="#5B6E66" strokeWidth="3.5" />
        <ellipse cx="104" cy="42" rx="8" ry="23" fill="#FBCFE8" />
      </g>

      {/* الجسم */}
      <ellipse cx="80" cy="128" rx="34" ry="27" fill="#FFFFFF" stroke="#5B6E66" strokeWidth="3.5" />
      <ellipse cx="80" cy="132" rx="20" ry="17" fill="#F0FDF4" />

      {/* اليدان */}
      {isCheering ? (
        <>
          <ellipse
            cx="40"
            cy="104"
            rx="10"
            ry="17"
            transform="rotate(-38 40 104)"
            fill="#FFFFFF"
            stroke="#5B6E66"
            strokeWidth="3.5"
          />
          <ellipse
            cx="120"
            cy="104"
            rx="10"
            ry="17"
            transform="rotate(38 120 104)"
            fill="#FFFFFF"
            stroke="#5B6E66"
            strokeWidth="3.5"
          />
        </>
      ) : (
        <>
          <ellipse
            cx="48"
            cy="126"
            rx="10"
            ry="15"
            transform="rotate(20 48 126)"
            fill="#FFFFFF"
            stroke="#5B6E66"
            strokeWidth="3.5"
          />
          <ellipse
            cx="112"
            cy="126"
            rx="10"
            ry="15"
            transform="rotate(-20 112 126)"
            fill="#FFFFFF"
            stroke="#5B6E66"
            strokeWidth="3.5"
          />
        </>
      )}

      {/* فيونكة خضراء لطيفة */}
      <path d="M80 113L67 106V120L80 113Z" fill="#16A34A" />
      <path d="M80 113L93 106V120L80 113Z" fill="#16A34A" />
      <circle cx="80" cy="113" r="4.5" fill="#FACC15" />

      {/* الرأس */}
      <circle cx="80" cy="84" r="37" fill="#FFFFFF" stroke="#5B6E66" strokeWidth="3.5" />

      {/* الخدان الورديان */}
      <ellipse cx="55" cy="91" rx="7.5" ry="4.5" fill="#FBCFE8" opacity="0.85" />
      <ellipse cx="105" cy="91" rx="7.5" ry="4.5" fill="#FBCFE8" opacity="0.85" />

      {/* العينان */}
      {isCheering ? (
        <>
          <path
            d="M60 80C62 74 70 74 72 80"
            stroke="#163029"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          <path
            d="M88 80C90 74 98 74 100 80"
            stroke="#163029"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <circle cx="66" cy="79" r="5.5" fill="#163029" />
          <circle cx="68" cy="77" r="2" fill="#FFFFFF" />
          <circle cx="94" cy="79" r="5.5" fill="#163029" />
          <circle cx="96" cy="77" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* الأنف الصغير */}
      <ellipse cx="80" cy="88" rx="5" ry="3.5" fill="#F472B6" />

      {/* الفم المبتسم دائماً بلطف */}
      {isCheering ? (
        <path
          d="M70 95C73 105 87 105 90 95Z"
          fill="#FB7185"
          stroke="#163029"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
      ) : isEncouraging ? (
        <path
          d="M72 97C76 102 84 102 88 97"
          stroke="#163029"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M70 95C74 102 86 102 90 95"
          stroke="#163029"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      )}

      {/* نجمة صغيرة بجانب الأرنب عند الاحتفال */}
      {isCheering && (
        <path
          d="M135 44L138.5 52L147 53L140.5 58.5L142.5 67L135 62.5L127.5 67L129.5 58.5L123 53L131.5 52L135 44Z"
          fill="#FACC15"
          stroke="#CA8A04"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
