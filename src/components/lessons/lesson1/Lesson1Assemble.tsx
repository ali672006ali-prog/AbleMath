import { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
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
import { TensBundleSvg } from '../../svg/TensBundleSvg';
import { GuideBanner } from '../../ui/GuideBanner';

interface Lesson1AssembleProps {
  studentName: string;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onCelebrate: () => void;
  onComplete: () => void;
}

/**
 * الدرس الأول - نشاط 1: نشاط التجميع حتى 100
 */
export function Lesson1Assemble({
  studentName,
  numeralStyle,
  isMuted,
  onCelebrate,
  onComplete,
}: Lesson1AssembleProps) {
  const [bundlesCount, setBundlesCount] = useState(0);
  const callout = getStudentCallout(studentName);
  const currentTotal = bundlesCount * 10;
  const isDone = bundlesCount === 10;

  const promptSpeech = `النشاط الأول: اضغط على الزر الكبير لإضافة حزم العشرات حتى يصل العداد إلى مئة ${callout}.`;

  useEffect(() => {
    speakArabic(promptSpeech, isMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTen = () => {
    if (isDone) return;
    const nextCount = bundlesCount + 1;
    setBundlesCount(nextCount);
    const nextValue = nextCount * 10;

    if (nextValue === 100) {
      playApplauseSound(isMuted);
      onCelebrate();
      speakArabic(`ممتاز ${callout}! وصلنا إلى مئة! عشر عشرات تساوي مئة.`, isMuted);
    } else {
      playClickSound(isMuted);
      speakArabic(getDecadeWord(nextValue), isMuted);
    }
  };

  const message = isDone
    ? formatTextNumbers(`أحسنت ${callout}! جمّعت 10 حزم ووصل العداد إلى 100!`, numeralStyle)
    : formatTextNumbers(
        `اضغط لإضافة حزمة عشرة حتى يصل العداد إلى 100 (الآن: ${currentTotal})`,
        numeralStyle
      );

  const mood: RabbitMood = isDone ? 'cheering' : 'happy';

  return (
    <div className="flex w-full flex-col gap-6">
      <GuideBanner
        message={message}
        mood={mood}
        feedbackTone={isDone ? 'success' : 'neutral'}
        onReplayAudio={() =>
          speakArabic(
            isDone
              ? `أحسنت ${callout}! وصلنا إلى مئة. اضغط على التالي.`
              : promptSpeech,
            isMuted
          )
        }
      />

      <section className="flex flex-col items-center gap-7 rounded-3xl border-2 border-[#CFE5D8] bg-white p-6 shadow-sm sm:p-8">
        {/* العداد الكبير وشريط التقدم */}
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex items-center gap-5">
            <span className="text-2xl font-extrabold text-[#334155]">العداد الحالي:</span>
            <span
              className={`tabular-nums-arabic rounded-3xl border-3 px-8 py-3 text-5xl font-black sm:text-6xl ${
                isDone
                  ? 'border-[#16A34A] bg-[#ECFDF5] text-[#15803D]'
                  : 'border-[#0284C7] bg-[#F0F9FF] text-[#0369A1]'
              }`}
            >
              {formatNumber(currentTotal, numeralStyle)}
            </span>
            <span className="tabular-nums-arabic text-2xl font-extrabold text-[#64748B]">
              / {formatNumber(100, numeralStyle)}
            </span>
          </div>

          {/* شريط التقدم المقسم لـ 10 خانات واضحة */}
          <div
            className="grid w-full max-w-2xl grid-cols-10 gap-2"
            aria-label={`التقدم ${formatNumber(bundlesCount, numeralStyle)} من ${formatNumber(10, numeralStyle)}`}
          >
            {Array.from({ length: 10 }, (_, idx) => (
              <div
                key={idx}
                className={`h-6 rounded-lg transition-colors duration-200 ${
                  idx < bundlesCount ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* عرض الحزم المضافة */}
        <div className="flex min-h-[150px] w-full flex-wrap items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#BAE6FD] bg-[#F8FAFC] p-5">
          {bundlesCount === 0 ? (
            <p className="text-xl font-bold text-[#64748B]">
              اضغط على الزر الأخضر بالأسفل لإضافة أول حزمة عشرة!
            </p>
          ) : (
            Array.from({ length: bundlesCount }, (_, idx) => (
              <div key={idx} className="animate-pop-in">
                <TensBundleSvg
                  numeralStyle={numeralStyle}
                  size="sm"
                  highlighted={isDone || idx === bundlesCount - 1}
                />
              </div>
            ))
          )}
        </div>

        {/* زر الإضافة الكبير جداً أو زر الانتقال للنشاط التالي */}
        {!isDone ? (
          <button
            type="button"
            onClick={handleAddTen}
            className="flex min-h-[84px] w-full max-w-md items-center justify-center gap-4 rounded-3xl bg-[#16A34A] px-8 py-4 text-2xl font-black text-white shadow-md transition-transform duration-150 hover:bg-[#15803D] active:scale-95 sm:text-3xl"
          >
            <Plus className="h-9 w-9 shrink-0 stroke-[3]" aria-hidden="true" />
            <span>
              {formatTextNumbers('أضف حزمة عشرة (10)', numeralStyle)}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              playClickSound(isMuted);
              onComplete();
            }}
            className="animate-pop-in flex min-h-[76px] w-full max-w-md items-center justify-center gap-3 rounded-3xl bg-[#16A34A] px-8 py-4 text-2xl font-black text-white shadow-md transition-transform duration-150 hover:bg-[#15803D] active:scale-95"
          >
            <span>التالي: نشاط التمييز</span>
            <ArrowLeft className="h-8 w-8" aria-hidden="true" />
          </button>
        )}
      </section>
    </div>
  );
}
