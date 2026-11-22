import { NumeralStyle } from '../../types/game';
import { formatNumber } from '../../utils/numerals';

const CARRIAGE_PALETTE = [
  { body: '#38BDF8', roof: '#0284C7', text: '#FFFFFF' },
  { body: '#4ADE80', roof: '#16A34A', text: '#052E16' },
  { body: '#FACC15', roof: '#CA8A04', text: '#422006' },
  { body: '#FB923C', roof: '#EA580C', text: '#FFFFFF' },
  { body: '#A78BFA', roof: '#7C3AED', text: '#FFFFFF' },
  { body: '#F472B6', roof: '#DB2777', text: '#FFFFFF' },
  { body: '#2DD4BF', roof: '#0D9488', text: '#042F2E' },
  { body: '#60A5FA', roof: '#2563EB', text: '#FFFFFF' },
  { body: '#86EFAC', roof: '#15803D', text: '#052E16' },
  { body: '#FBBF24', roof: '#B45309', text: '#451A03' },
];

export function TrainLocomotiveSvg({ className = 'h-28 w-36' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 156 120"
      fill="none"
      className={`${className} shrink-0 select-none`}
      aria-label="قاطرة قطار العقود"
    >
      {/* سحابة دخان ناعمة */}
      <circle cx="34" cy="18" r="10" fill="#E2E8F0" />
      <circle cx="48" cy="13" r="8" fill="#F1F5F9" />

      {/* المدخنة */}
      <rect x="26" y="28" width="18" height="26" rx="4" fill="#0F766E" />
      <rect x="22" y="24" width="26" height="8" rx="4" fill="#14B8A6" />

      {/* مقدمة القاطرة */}
      <rect x="18" y="50" width="66" height="44" rx="10" fill="#0284C7" />
      <path d="M18 94L8 94L18 76Z" fill="#F59E0B" />

      {/* كابينة السائق */}
      <rect x="76" y="30" width="62" height="64" rx="10" fill="#0369A1" />
      <rect x="70" y="24" width="74" height="10" rx="5" fill="#F59E0B" />

      {/* نافذة الكابينة */}
      <rect x="88" y="42" width="38" height="26" rx="6" fill="#E0F2FE" />
      {/* خط أصفر جمالي */}
      <rect x="22" y="72" width="112" height="7" rx="3.5" fill="#FDE047" />

      {/* العجلات */}
      <circle cx="44" cy="98" r="14" fill="#1E293B" stroke="#FACC15" strokeWidth="4" />
      <circle cx="44" cy="98" r="4" fill="#FFFFFF" />
      <circle cx="106" cy="98" r="16" fill="#1E293B" stroke="#FACC15" strokeWidth="4" />
      <circle cx="106" cy="98" r="5" fill="#FFFFFF" />

      {/* وصلة الربط */}
      <rect x="138" y="78" width="16" height="8" rx="4" fill="#475569" />
    </svg>
  );
}

interface TrainCarriageProps {
  value: number | null; // null يعني عربة مفقودة [؟]
  colorIndex: number;
  numeralStyle: NumeralStyle;
  isActive?: boolean;
  isVisited?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function TrainCarriageButton({
  value,
  colorIndex,
  numeralStyle,
  isActive = false,
  isVisited = false,
  onClick,
  size = 'md',
}: TrainCarriageProps) {
  const palette = CARRIAGE_PALETTE[colorIndex % CARRIAGE_PALETTE.length];
  const isMissing = value === null;

  const sizeClass =
    size === 'sm'
      ? 'h-24 w-24'
      : size === 'lg'
      ? 'h-36 w-36 sm:h-40 sm:w-40'
      : 'h-28 w-28 sm:h-32 sm:w-32';

  const content = (
    <svg
      viewBox="0 0 130 120"
      fill="none"
      className={`${sizeClass} select-none transition-transform duration-200 ${
        isActive ? '-translate-y-2 scale-105' : ''
      }`}
    >
      {/* هالة مضيئة عند التفعيل */}
      {isActive && (
        <rect
          x="6"
          y="12"
          width="118"
          height="86"
          rx="18"
          fill="#FEF08A"
          opacity="0.7"
        />
      )}

      {/* وصلات الربط */}
      <rect x="0" y="76" width="12" height="8" rx="3" fill="#64748B" />
      <rect x="118" y="76" width="12" height="8" rx="3" fill="#64748B" />

      {/* سقف العربة */}
      <rect
        x="10"
        y="18"
        width="110"
        height="14"
        rx="7"
        fill={isMissing ? '#F59E0B' : palette.roof}
      />

      {/* جسم العربة */}
      <rect
        x="14"
        y="28"
        width="102"
        height="64"
        rx="12"
        fill={isMissing ? '#FEF3C7' : palette.body}
        stroke={isActive ? '#CA8A04' : isMissing ? '#D97706' : palette.roof}
        strokeWidth={isActive ? '4.5' : isMissing ? '4' : '2.5'}
        strokeDasharray={isMissing ? '8 5' : undefined}
      />

      {/* الرقم أو علامة الاستفهام */}
      <text
        x="65"
        y="71"
        textAnchor="middle"
        fill={isMissing ? '#B45309' : palette.text}
        fontSize={value === 100 ? '34' : '38'}
        fontWeight="900"
        fontFamily="Cairo, Tajawal, sans-serif"
      >
        {isMissing ? '؟' : formatNumber(value, numeralStyle)}
      </text>

      {/* علامة صح خفيفة للعربات التي ضغط عليها الطالب */}
      {isVisited && !isMissing && (
        <g>
          <circle cx="106" cy="36" r="10" fill="#FFFFFF" />
          <path
            d="M101 36L104.5 39.5L111 32.5"
            stroke="#16A34A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* العجلات */}
      <circle cx="38" cy="98" r="13" fill="#1E293B" stroke="#E2E8F0" strokeWidth="3.5" />
      <circle cx="38" cy="98" r="4" fill="#FACC15" />
      <circle cx="92" cy="98" r="13" fill="#1E293B" stroke="#E2E8F0" strokeWidth="3.5" />
      <circle cx="92" cy="98" r="4" fill="#FACC15" />
    </svg>
  );

  if (!onClick) {
    return <div className="inline-flex shrink-0">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isMissing ? 'عربة مفقودة' : `العربة رقم ${formatNumber(value, numeralStyle)}`}
      className="inline-flex shrink-0 rounded-2xl transition-transform duration-150 hover:-translate-y-1 active:scale-95"
    >
      {content}
    </button>
  );
}

/**
 * رسم مصغّر لقطار العقود لبطاقة الدرس الثاني في الشاشة الرئيسية
 */
export function MiniTrainIllustration({ numeralStyle }: { numeralStyle: NumeralStyle }) {
  return (
    <div className="flex items-end justify-center gap-0.5 py-2" dir="ltr">
      <TrainLocomotiveSvg className="h-20 w-24" />
      <TrainCarriageButton value={10} colorIndex={0} numeralStyle={numeralStyle} size="sm" />
      <TrainCarriageButton value={20} colorIndex={1} numeralStyle={numeralStyle} size="sm" />
      <TrainCarriageButton value={30} colorIndex={2} numeralStyle={numeralStyle} size="sm" />
    </div>
  );
}
