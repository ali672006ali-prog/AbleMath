import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { NumeralStyle, RabbitMood } from '../../../types/game';
import {
  playApplauseSound,
  playClickSound,
  playGentleRetrySound,
  playSuccessSound,
  speakArabic,
} from '../../../utils/audio';
import {
  formatNumber,
  formatTextNumbers,
  getDecadeWord,
  getStudentCallout,
} from '../../../utils/numerals';
import { GuideBanner } from '../../ui/GuideBanner';

interface Lesson2OrderProps {
  studentName: string;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onCelebrate: () => void;
  onComplete: () => void;
}

interface OrderRound {
  cards: number[]; // غير مرتبة
  sorted: number[]; // تصاعدياً من الأصغر للأكبر
}

const ROUNDS: OrderRound[] = [
  { cards: [30, 10, 20], sorted: [10, 20, 30] },
  { cards: [60, 40, 50], sorted: [40, 50, 60] },
  { cards: [100, 70, 90], sorted: [70, 90, 100] },
];

const SLOT_LABELS = ['الأصغر', 'الأوسط', 'الأكبر'];

/**
 * الدرس الثاني - نشاط 3: رتب 3 عقود تصاعدياً (من الأصغر للأكبر) بالضغط عليها بالترتيب
 */
export function Lesson2Order({
  studentName,
  numeralStyle,
  isMuted,
  onCelebrate,
  onComplete,
}: Lesson2OrderProps) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [wobbleVal, setWobbleVal] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'neutral' | 'success' | 'encourage'>('neutral');

  const callout = getStudentCallout(studentName);
  const round = ROUNDS[roundIdx];
  const isRoundComplete = picked.length === round.sorted.length;
  const isLastRound = roundIdx === ROUNDS.length - 1;
  const nextExpected = round.sorted[picked.length];

  const questionSpeech = `رتب العقود من الأصغر إلى الأكبر ${callout}! اضغط أولاً على أصغر رقم، ثم الذي يليه، ثم الأكبر.`;

  useEffect(() => {
    setPicked([]);
    setShowHint(false);
    setFeedback('neutral');
    speakArabic(questionSpeech, isMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx]);

  const handleCardTap = (value: number) => {
    if (isRoundComplete || picked.includes(value)) return;

    if (value === nextExpected) {
      const nextPicked = [...picked, value];
      setPicked(nextPicked);
      setShowHint(false);

      if (nextPicked.length === round.sorted.length) {
        setFeedback('success');
        if (isLastRound) {
          playApplauseSound(isMuted);
        } else {
          playSuccessSound(isMuted);
        }
        onCelebrate();
        speakArabic(
          isLastRound
            ? `بطل رائع ${callout}! رتبت كل العقود بنجاح وأنهيت الدرس الثاني!`
            : `أحسنت ${callout}! الترتيب صحيح: ${round.sorted.map(getDecadeWord).join('، ثم ')}!`,
          isMuted
        );
      } else {
        setFeedback('neutral');
        playClickSound(isMuted);
        speakArabic(`${getDecadeWord(value)}، ممتاز!`, isMuted);
      }
    } else {
      playGentleRetrySound(isMuted);
      setFeedback('encourage');
      setShowHint(true);
      setWobbleVal(value);
      setTimeout(() => setWobbleVal(null), 400);
      speakArabic(
        `حاول مرة أخرى ${callout}! نريد الرقم الأصغر أولاً وهو ${getDecadeWord(nextExpected)}. انظر إلى البطاقة المضيئة.`,
        isMuted
      );
    }
  };

  const handleNext = () => {
    playClickSound(isMuted);
    if (isLastRound) {
      onComplete();
    } else {
      setRoundIdx((prev) => prev + 1);
    }
  };

  const bannerMessage = isRoundComplete
    ? formatTextNumbers(
        `أحسنت ${callout}! الترتيب التصاعدي الصحيح هو: ${round.sorted.join(' ← ')}`,
        numeralStyle
      )
    : feedback === 'encourage'
    ? formatTextNumbers(
        `حاول مرة أخرى ${callout}! اضغط على البطاقة المضيئة لأنها الأصغر الآن.`,
        numeralStyle
      )
    : `اضغط على الأرقام بالترتيب من الأصغر إلى الأكبر:`;

  const mood: RabbitMood = isRoundComplete
    ? 'cheering'
    : feedback === 'encourage'
    ? 'encouraging'
    : 'thinking';

  return (
    <div className="flex w-full flex-col gap-6">
      <GuideBanner
        message={bannerMessage}
        mood={mood}
        feedbackTone={isRoundComplete ? 'success' : feedback}
        onReplayAudio={() => speakArabic(questionSpeech, isMuted)}
      />

      <div className="text-center text-xl font-extrabold text-[#475569]">
        الجولة {formatNumber(roundIdx + 1, numeralStyle)} من{' '}
        {formatNumber(ROUNDS.length, numeralStyle)}
      </div>

      <section className="flex flex-col items-center gap-8 rounded-3xl border-2 border-[#CFE5D8] bg-white p-6 shadow-sm sm:p-8">
        {/* خانات الترتيب التصاعدي من الأصغر للأكبر */}
        <div className="w-full max-w-3xl">
          <p className="mb-3 text-center text-xl font-extrabold text-[#166534]">
            الترتيب من الأصغر ← إلى الأكبر:
          </p>
          <div className="grid grid-cols-3 gap-4">
            {SLOT_LABELS.map((slotLabel, idx) => {
              const placedVal = picked[idx];
              const isNextSlot = idx === picked.length && !isRoundComplete;

              return (
                <div
                  key={slotLabel}
                  className={`flex min-h-[126px] flex-col items-center justify-center rounded-3xl border-3 p-4 text-center transition-all ${
                    placedVal !== undefined
                      ? 'animate-pop-in border-[#16A34A] bg-[#ECFDF5]'
                      : isNextSlot
                      ? 'border-dashed border-[#0284C7] bg-[#F0F9FF]'
                      : 'border-dashed border-[#CBD5E1] bg-[#F8FAFC]'
                  }`}
                >
                  <span className="text-lg font-extrabold text-[#475569]">{slotLabel}</span>
                  {placedVal !== undefined ? (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="tabular-nums-arabic text-4xl font-black text-[#15803D] sm:text-5xl">
                        {formatNumber(placedVal, numeralStyle)}
                      </span>
                      <CheckCircle2 className="h-7 w-7 text-[#16A34A]" aria-hidden="true" />
                    </div>
                  ) : (
                    <span className="mt-2 text-3xl font-black text-[#94A3B8]">؟</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* بطاقات الاختيار غير المرتبة */}
        <div className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-3">
          {round.cards.map((val) => {
            const isAlreadyPicked = picked.includes(val);
            const isHinted = showHint && val === nextExpected && !isRoundComplete;
            const isWobbling = wobbleVal === val;

            return (
              <button
                key={val}
                type="button"
                disabled={isAlreadyPicked}
                onClick={() => handleCardTap(val)}
                aria-label={`الرقم ${formatNumber(val, numeralStyle)}`}
                className={`tabular-nums-arabic flex min-h-[104px] flex-col items-center justify-center rounded-3xl border-3 px-6 py-4 text-5xl font-black shadow-sm transition-all duration-150 ${
                  isAlreadyPicked
                    ? 'scale-90 border-[#E2E8F0] bg-[#F8FAFC] text-[#CBD5E1] opacity-35'
                    : isHinted
                    ? 'animate-hint-glow border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]'
                    : isWobbling
                    ? 'animate-gentle-wobble border-[#FDBA74] bg-[#FFF7ED] text-[#9A3412]'
                    : 'border-[#7DD3FC] bg-[#F0F9FF] text-[#0C4A6E] hover:-translate-y-1 hover:border-[#0284C7] hover:bg-[#E0F2FE] active:scale-95'
                }`}
              >
                <span>{formatNumber(val, numeralStyle)}</span>
                <span className="mt-1 text-lg font-bold opacity-80">
                  {getDecadeWord(val)}
                </span>
              </button>
            );
          })}
        </div>

        {isRoundComplete && (
          <button
            type="button"
            onClick={handleNext}
            className="animate-pop-in flex min-h-[74px] items-center justify-center gap-3 rounded-3xl bg-[#16A34A] px-10 py-4 text-2xl font-black text-white shadow-md transition-transform duration-150 hover:bg-[#15803D] active:scale-95"
          >
            <span>{isLastRound ? 'احصل على شهادة التقدير!' : 'الجولة التالية'}</span>
            <ArrowLeft className="h-8 w-8" aria-hidden="true" />
          </button>
        )}
      </section>
    </div>
  );
}
