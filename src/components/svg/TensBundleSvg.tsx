import { NumeralStyle } from '../../types/game';
import { formatNumber } from '../../utils/numerals';

interface TensBundleSvgProps {
  numeralStyle: NumeralStyle;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  highlighted?: boolean;
  showLabel?: boolean;
}

const BUNDLE_SIZES = {
  xs: 'h-14 w-11',
  sm: 'h-20 w-16',
  md: 'h-24 w-20',
  lg: 'h-32 w-24',
};

/**
 * حزمة عصي العشرات المرسومة بوضوح (10 أعواد مربوطة بشريط ومكتوب عليها 10)
 */
export function TensBundleSvg({
  numeralStyle,
  size = 'md',
  highlighted = false,
  showLabel = true,
}: TensBundleSvgProps) {
  const stickX = [16, 22, 28, 34, 40, 46, 52, 58, 64, 70];

  return (
    <svg
      viewBox="0 0 92 112"
      fill="none"
      className={`${BUNDLE_SIZES[size]} select-none transition-transform duration-200 ${
        highlighted ? 'scale-105' : ''
      }`}
      aria-label={`حزمة عشرة ${formatNumber(10, numeralStyle)}`}
    >
      {/* 10 عصي خشبية ملوّنة بوضوح */}
      {stickX.map((x, idx) => (
        <rect
          key={x}
          x={x}
          y={10 + (idx % 2 === 0 ? 0 : 2)}
          width="5.2"
          height="90"
          rx="2.6"
          fill={idx % 2 === 0 ? '#F59E0B' : '#FBBF24'}
          stroke="#B45309"
          strokeWidth="1.2"
        />
      ))}

      {/* الشريط الرابط للحزمة */}
      <rect
        x="11"
        y="40"
        width="70"
        height="34"
        rx="10"
        fill={highlighted ? '#16A34A' : '#0284C7'}
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />

      {/* الرقم 10 بوضوح تام */}
      {showLabel && (
        <text
          x="46"
          y="65"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="24"
          fontWeight="900"
          fontFamily="Cairo, Tajawal, sans-serif"
        >
          {formatNumber(10, numeralStyle)}
        </text>
      )}
    </svg>
  );
}

interface HundredsSquareSvgProps {
  numeralStyle: NumeralStyle;
  columns?: number; // 10 = مربع المئات الكامل (100)، أقل من 10 للنماذج المقارنة
  showBadge?: boolean;
  className?: string;
}

/**
 * مربع المئات الكبير (10 أعمدة × 10 صفوف = 100 وحدة) أو نموذج جزئي من عدة عشرات
 */
export function HundredsSquareSvg({
  numeralStyle,
  columns = 10,
  showBadge = false,
  className = 'h-36 w-36',
}: HundredsSquareSvgProps) {
  const cell = 12;
  const pad = 10;
  const totalWidth = 10 * cell;
  const filledCols = Math.max(1, Math.min(10, columns));

  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      className={`${className} select-none`}
      aria-label={`نموذج ${formatNumber(filledCols * 10, numeralStyle)}`}
    >
      {/* خلفية الإطار */}
      <rect
        x="6"
        y="6"
        width="128"
        height="128"
        rx="14"
        fill="#F8FAFC"
        stroke={filledCols === 10 ? '#16A34A' : '#CBD5E1'}
        strokeWidth="3"
      />

      {/* الأعمدة الملوّنة (كل عمود = عشرة واحدة) */}
      {Array.from({ length: filledCols }).map((_, colIdx) => (
        <g key={colIdx}>
          {Array.from({ length: 10 }).map((__, rowIdx) => (
            <rect
              key={`${colIdx}-${rowIdx}`}
              x={pad + colIdx * cell + 1}
              y={pad + rowIdx * cell + 1}
              width={cell - 2}
              height={cell - 2}
              rx="2"
              fill={
                filledCols === 10
                  ? colIdx % 2 === 0
                    ? '#22C55E'
                    : '#16A34A'
                  : colIdx % 2 === 0
                  ? '#38BDF8'
                  : '#0284C7'
              }
            />
          ))}
        </g>
      ))}

      {/* خطوط خفيفة للمساحة الفارغة إذا لم يكن مربعاً كاملاً */}
      {filledCols < 10 &&
        Array.from({ length: 10 - filledCols }).map((_, idx) => {
          const colIdx = filledCols + idx;
          return (
            <rect
              key={`empty-${colIdx}`}
              x={pad + colIdx * cell + 1}
              y={pad + 1}
              width={cell - 2}
              height={totalWidth - 2}
              rx="2"
              fill="#F1F5F9"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

      {showBadge && (
        <g>
          <rect
            x="38"
            y="48"
            width="64"
            height="42"
            rx="12"
            fill="#FFFFFF"
            fillOpacity="0.94"
            stroke="#15803D"
            strokeWidth="2.5"
          />
          <text
            x="70"
            y="78"
            textAnchor="middle"
            fill="#14532D"
            fontSize="26"
            fontWeight="900"
            fontFamily="Cairo, Tajawal, sans-serif"
          >
            {formatNumber(filledCols * 10, numeralStyle)}
          </text>
        </g>
      )}
    </svg>
  );
}
