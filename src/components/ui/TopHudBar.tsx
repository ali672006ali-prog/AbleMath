import { Home, Star, Volume2, VolumeX } from 'lucide-react';
import { AppScreen, NumeralStyle } from '../../types/game';
import { formatNumber } from '../../utils/numerals';

interface TopHudBarProps {
  screen: AppScreen;
  stageIndex: number;
  stars: number;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onGoHome: () => void;
  onToggleNumeralStyle: () => void;
  onToggleMute: () => void;
}

const STAGE_LABELS = ['التعلم', 'نشاط ١', 'نشاط ٢', 'نشاط ٣'];

export function TopHudBar({
  screen,
  stageIndex,
  stars,
  numeralStyle,
  isMuted,
  onGoHome,
  onToggleNumeralStyle,
  onToggleMute,
}: TopHudBarProps) {
  const inLesson = screen === 'lesson1' || screen === 'lesson2';

  return (
    <header className="no-print sticky top-0 z-30 border-b border-[#CFE5D8] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* اليمين: زر الرئيسية أو اسم المدرسة */}
        <div className="flex items-center gap-3">
          {screen !== 'home' ? (
            <button
              type="button"
              onClick={onGoHome}
              className="flex min-h-[50px] items-center gap-2 rounded-2xl border-2 border-[#CFE5D8] bg-[#F4FAF6] px-4 py-2 text-lg font-extrabold text-[#163029] transition-colors hover:bg-[#E3F4EA] active:scale-95 whitespace-nowrap"
            >
              <Home className="h-6 w-6 text-[#16A34A]" aria-hidden="true" />
              <span>الرئيسية</span>
            </button>
          ) : (
            <span className="text-lg font-extrabold text-[#166534] sm:text-xl whitespace-nowrap">
              مدارس الباجور — الصف الرابع
            </span>
          )}
        </div>

        {/* المنتصف: مؤشر خطوات التدرج عند وجود الطالب داخل الدرس */}
        {inLesson && (
          <nav
            aria-label="مراحل الدرس"
            className="order-3 flex w-full items-center justify-center gap-2 pt-1 md:order-2 md:w-auto md:pt-0"
          >
            {STAGE_LABELS.map((label, idx) => {
              const displayLabel =
                idx === 0
                  ? label
                  : `نشاط ${formatNumber(idx, numeralStyle)}`;
              const isCompleted = idx < stageIndex;
              const isCurrent = idx === stageIndex;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-base font-bold whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'bg-[#16A34A] text-white'
                        : isCompleted
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    <span>{displayLabel}</span>
                  </div>
                  {idx < STAGE_LABELS.length - 1 && (
                    <span className="text-sm font-bold text-[#94A3B8]" aria-hidden="true">
                      ←
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* اليسار: النجوم + زر تبديل الأرقام + زر الصوت */}
        <div className="order-2 flex items-center gap-2.5 md:order-3">
          {screen !== 'home' && (
            <div
              aria-label={`النجوم: ${formatNumber(stars, numeralStyle)}`}
              className="flex min-h-[50px] items-center gap-2 rounded-2xl border-2 border-[#FDE68A] bg-[#FEFCE8] px-4 py-2 text-lg font-black text-[#B45309] tabular-nums-arabic whitespace-nowrap"
            >
              <Star className="h-6 w-6 fill-[#FACC15] text-[#CA8A04]" aria-hidden="true" />
              <span>{formatNumber(stars, numeralStyle)}</span>
            </div>
          )}

          {/* زر تبديل شكل الأرقام (10 / ١٠) */}
          <button
            type="button"
            onClick={onToggleNumeralStyle}
            title="تبديل شكل الأرقام"
            className="flex min-h-[50px] items-center gap-2 rounded-2xl border-2 border-[#BAE6FD] bg-[#F0F9FF] px-4 py-2 text-base font-extrabold text-[#0369A1] transition-colors hover:bg-[#E0F2FE] active:scale-95 sm:text-lg whitespace-nowrap"
          >
            <span>الأرقام:</span>
            <span className="tabular-nums-arabic font-black">
              {numeralStyle === 'western' ? '10 ← ١٠' : '١٠ ← 10'}
            </span>
          </button>

          {/* زر تشغيل / كتم الصوت */}
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            className={`flex min-h-[50px] items-center gap-2 rounded-2xl border-2 px-4 py-2 text-base font-extrabold transition-colors active:scale-95 sm:text-lg whitespace-nowrap ${
              isMuted
                ? 'border-[#FDBA74] bg-[#FFF7ED] text-[#9A3412]'
                : 'border-[#BBF7D0] bg-[#ECFDF5] text-[#166534] hover:bg-[#DCFCE7]'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-6 w-6" aria-hidden="true" />
                <span className="hidden sm:inline">الصوت مكتوم</span>
              </>
            ) : (
              <>
                <Volume2 className="h-6 w-6" aria-hidden="true" />
                <span className="hidden sm:inline">الصوت يعمل</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
