import { NumeralStyle } from '../../types/game';
import { formatNumber } from '../../utils/numerals';

interface BalloonSvgProps {
  value: number;
  color: string;
  strokeColor: string;
  numeralStyle: NumeralStyle;
  isHinted?: boolean;
}

export function BalloonSvg({
  value,
  color,
  strokeColor,
  numeralStyle,
  isHinted = false,
}: BalloonSvgProps) {
  return (
    <svg
      viewBox="0 0 110 155"
      fill="none"
      className={`h-32 w-24 select-none sm:h-36 sm:w-28 ${
        isHinted ? 'drop-shadow-[0_0_16px_rgba(245,158,11,0.9)]' : 'drop-shadow-sm'
      }`}
    >
      {/* هالة التلميح للبالون المطلوب */}
      {isHinted && (
        <ellipse
          cx="55"
          cy="56"
          rx="49"
          ry="54"
          fill="#FEF08A"
          opacity="0.65"
        />
      )}

      {/* خيط البالون */}
      <path
        d="M55 108C48 122 62 132 54 148"
        stroke="#64748B"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* عقدة البالون */}
      <path d="M55 102L48 111H62L55 102Z" fill={strokeColor} />

      {/* جسم البالون */}
      <ellipse
        cx="55"
        cy="56"
        rx="41"
        ry="48"
        fill={color}
        stroke={isHinted ? '#D97706' : strokeColor}
        strokeWidth={isHinted ? '4.5' : '3'}
      />

      {/* لمعة كرتونية ناعمة */}
      <path
        d="M32 34C36 24 44 19 52 18"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* الرقم بوضوح كبير */}
      <text
        x="55"
        y="68"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={value === 100 ? '30' : '34'}
        fontWeight="900"
        fontFamily="Cairo, Tajawal, sans-serif"
      >
        {formatNumber(value, numeralStyle)}
      </text>
    </svg>
  );
}
