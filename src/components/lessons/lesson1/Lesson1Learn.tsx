import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { NumeralStyle, RabbitMood } from '../../../types/game';
import {
  playApplauseSound,
  playClickSound,
  speakArabic,
} from '../../../utils/audio';
import {
  formatNumber,
  formatTextNumbers,
  getDecadeWord,
  getStudentCallout,
} from '../../../utils/numerals';
import { HundredsSquareSvg, TensBundleSvg } from '../../svg/TensBundleSvg';
import { GuideBanner } from '../../ui/GuideBanner';

interface Lesson1LearnProps {
  studentName: string;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onCelebrate: () => void;
  onComplete: () => void;
}

export function Lesson1Learn({
  studentName,
  numeralStyle,
  isMuted,
  onCelebrate,
  onComplete,
}: Lesson1LearnProps) {
  // قائمة معرفات الحزم التي انتقلت للصندوق (من 0 إلى 9)
  const [movedIds, setMovedIds] = useState<number[]>([]);
  const callout = getStudentCallout(studentName);
  const count = movedIds.length;
  const totalValue = count * 10;
  const isComplete = count === 10;

  const introSpeech = `أهلاً ${callout}! اضغط على كل حزمة عشرة لتنقلها إلى الصندوق، وسنعد معاً حتى نصل إلى مئة.`;
  const currentMessage = isComplete
    ? formatTextNumbers(
        `رائع ${callout}! عشر عشرات تساوي 100 (مئة).`,
        numeralStyle
      )
    : count === 0
    ? formatTextNumbers(
        `اضغط على كل حزمة عشرة لتنقلها إلى الصندوق ونعد معاً حتى 100!`,
        numeralStyle
      )
    : formatTextNumbers(
        `أحسنت! لدينا الآن ${totalValue} (${getDecadeWord(totalValue)}). اضغط على حزمة أخرى!`,
        numeralStyle
      );

  const mood: RabbitMood = isComplete ? 'cheering' : 'happy';

  useEffect(() => {
    speakArabic(introSpeech, isMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBundleClick = (bundleId: number) => {
    if (movedIds.includes(bundleId) || isComplete) return;

    const nextMoved = [...movedIds, bundleId];
    setMovedIds(nextMoved);
    const nextValue = nextMoved.length * 10;

    if (nextValue === 100) {
      playApplauseSound(isMuted);
      onCelebrate();
      speakArabic(`مئة! أحسنت ${callout}! عشر عشرات تساوي مئة.`, isMuted);
    } else {
      playClickSound(isMuted);
      speakArabic(getDecadeWord(nextValue), isMuted);
    }
  };

  const handleReplay = () => {
    if (isComplete) {
      speakArabic(`أحسنت ${callout}! عشر عشرات تساوي مئة. اضغط على التالي لنبدأ اللعب.`, isMuted);
    } else {
      speakArabic(introSpeech, isMuted);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <GuideBanner
        message={currentMessage}
        mood={mood}
        feedbackTone={isComplete ? 'success' : 'neutral'}
        onReplayAudio={handleReplay}
      />

      {/* منطقة الحزم المتاحة للضغط */}
      {!isComplete && (
        <section className="rounded-3xl border-2 border-[#CFE5D8] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-center text-2xl font-black text-[#163029]">
            اضغط على حزم العشرات واحدة تلو الأخرى:
          </h2>
          <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-5">
            {Array.from({ length: 10 }, (_, idx) => {
              const isMoved = movedIds.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isMoved}
                  onClick={() => handleBundleClick(idx)}
                  aria-label={`حزمة عشرة رقم ${formatNumber(idx + 1, numeralStyle)}`}
                  className={`flex min-h-[116px] w-full max-w-[140px] flex-col items-center justify-center rounded-2xl border-2 p-2 transition-all duration-200 ${
                    isMoved
                      ? 'scale-90 border-dashed border-[#CBD5E1] bg-[#F8FAFC] opacity-25'
                      : 'border-[#BAE6FD] bg-[#F0F9FF] hover:-translate-y-1 hover:border-[#0284C7] hover:bg-[#E0F2FE] active:scale-95'
                  }`}
                >
                  <TensBundleSvg numeralStyle={numeralStyle} size="md" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* صندوق تجميع المئة */}
      <section
        className={`rounded-3xl border-3 p-6 shadow-sm transition-colors duration-200 ${
          isComplete
            ? 'border-[#16A34A] bg-[#ECFDF5]'
            : 'border-[#FCD34D] bg-[#FFFBEB]'
        }`}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-[#14532D] sm:text-3xl">
            صندوق العشرات
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-[#475569]">العدد داخل الصندوق:</span>
            <span className="tabular-nums-arabic rounded-2xl border-2 border-[#16A34A] bg-white px-6 py-2 text-4xl font-black text-[#15803D] sm:text-5xl">
              {formatNumber(totalValue, numeralStyle)}
            </span>
          </div>
        </div>

        {/* الحزم داخل الصندوق */}
        <div className="flex min-h-[130px] flex-wrap items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#86EFAC] bg-white/90 p-4">
          {count === 0 ? (
            <p className="text-xl font-bold text-[#64748B]">
              الصندوق فارغ الآن.. اضغط على أي حزمة عشرة في الأعلى لتدخل هنا!
            </p>
          ) : (
            movedIds.map((id, orderIdx) => (
              <div key={id} className="animate-pop-in flex flex-col items-center">
                <TensBundleSvg
                  numeralStyle={numeralStyle}
                  size="sm"
                  highlighted={isComplete || orderIdx === count - 1}
                />
                <span className="tabular-nums-arabic mt-1 text-base font-extrabold text-[#166534]">
                  {formatNumber((orderIdx + 1) * 10, numeralStyle)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* بطاقة تلخيص المفهوم عند الوصول إلى 100 */}
        {isComplete && (
          <div className="animate-pop-in mt-6 flex flex-col items-center justify-between gap-6 rounded-2xl border-2 border-[#86EFAC] bg-white p-6 md:flex-row">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <HundredsSquareSvg
                numeralStyle={numeralStyle}
                columns={10}
                showBadge
                className="h-32 w-32 shrink-0"
              />
              <div className="text-center sm:text-right">
                <p className="text-3xl font-black text-[#14532D]">
                  {formatTextNumbers('10 عشرات = 100', numeralStyle)}
                </p>
                <p className="mt-1 text-xl font-bold text-[#334155]">
                  عشر حزم من العشرات تصنع معاً العدد الكبير «مئة»!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound(isMuted);
                onComplete();
              }}
              className="flex min-h-[68px] shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#16A34A] px-8 py-4 text-2xl font-black text-white shadow-sm transition-transform duration-150 hover:bg-[#15803D] active:scale-95"
            >
              <span>التالي: نشاط التجميع</span>
              <ArrowLeft className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
