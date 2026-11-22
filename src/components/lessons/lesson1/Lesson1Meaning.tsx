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
  getStudentCallout,
} from '../../../utils/numerals';
import { HundredsSquareSvg, TensBundleSvg } from '../../svg/TensBundleSvg';
import { GuideBanner } from '../../ui/GuideBanner';

interface Lesson1MeaningProps {
  studentName: string;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onCelebrate: () => void;
  onComplete: () => void;
}

interface MeaningOption {
  id: string;
  type: 'square' | 'bundles';
  tensCount: number;
  label: string;
}

interface MeaningRound {
  id: number;
  prompt: string;
  options: MeaningOption[];
}

const ROUNDS: MeaningRound[] = [
  {
    id: 1,
    prompt: 'طابق الرقم 100 مع مربع المئات الكبير الكامل:',
    options: [
      { id: 'm1-a', type: 'square', tensCount: 3, label: 'ثلاث عشرات' },
      { id: 'm1-b', type: 'square', tensCount: 10, label: 'مربع المئات الكامل' },
      { id: 'm1-c', type: 'square', tensCount: 6, label: 'ست عشرات' },
    ],
  },
  {
    id: 2,
    prompt: 'طابق الرقم 100 مع شكله من حزم العشرات:',
    options: [
      { id: 'm2-a', type: 'bundles', tensCount: 5, label: 'خمس حزم' },
      { id: 'm2-b', type: 'bundles', tensCount: 2, label: 'حزمتان' },
      { id: 'm2-c', type: 'bundles', tensCount: 10, label: 'عشر حزم عشرات' },
    ],
  },
];

/**
 * الدرس الأول - نشاط 3: نشاط المدلول (مطابقة الرقم 100 مع شكله البصري: مربع المئات الكبير / 10 حزم)
 */
export function Lesson1Meaning({
  studentName,
  numeralStyle,
  isMuted,
  onCelebrate,
  onComplete,
}: Lesson1MeaningProps) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'neutral' | 'success' | 'encourage'>('neutral');

  const callout = getStudentCallout(studentName);
  const round = ROUNDS[roundIdx];
  const isLastRound = roundIdx === ROUNDS.length - 1;

  const questionSpeech =
    roundIdx === 0
      ? `النشاط الثالث: هذا هو الرقم مئة. اختر مربع المئات الكبير الكامل الذي يمثل العدد مئة ${callout}.`
      : `ممتاز! الآن طابق الرقم مئة مع عشر حزم من العشرات ${callout}.`;

  useEffect(() => {
    setSolved(false);
    setShowHint(false);
    setFeedback('neutral');
    speakArabic(questionSpeech, isMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx]);

  const handleChoose = (opt: MeaningOption) => {
    if (solved) return;

    if (opt.tensCount === 10) {
      setSolved(true);
      setShowHint(false);
      setFeedback('success');
      if (isLastRound) {
        playApplauseSound(isMuted);
      } else {
        playSuccessSound(isMuted);
      }
      onCelebrate();
      speakArabic(
        isLastRound
          ? `رائع جداً ${callout}! أنهيت الدرس الأول بنجاح وتستحق شهادة التقدير!`
          : `أحسنت ${callout}! مربع المئات الكامل يمثل العدد مئة!`,
        isMuted
      );
    } else {
      playGentleRetrySound(isMuted);
      setFeedback('encourage');
      setShowHint(true);
      setWobbleId(opt.id);
      setTimeout(() => setWobbleId(null), 400);
      speakArabic(
        `حاول مرة أخرى ${callout}! انظر إلى الشكل الكامل الذي يضيء باللون الذهبي.`,
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

  const bannerMessage =
    feedback === 'success'
      ? formatTextNumbers(`بطل ${callout}! لقد طابقت العدد 100 بمدلوله الصحيح!`, numeralStyle)
      : feedback === 'encourage'
      ? `حاول مرة أخرى ${callout}! اختر الشكل الكامل الذي يضيء.`
      : formatTextNumbers(round.prompt, numeralStyle);

  const mood: RabbitMood =
    feedback === 'success'
      ? 'cheering'
      : feedback === 'encourage'
      ? 'encouraging'
      : 'happy';

  return (
    <div className="flex w-full flex-col gap-6">
      <GuideBanner
        message={bannerMessage}
        mood={mood}
        feedbackTone={feedback}
        onReplayAudio={() => speakArabic(questionSpeech, isMuted)}
      />

      {/* بطاقة الرقم الهدف 100 */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center rounded-3xl border-3 border-[#16A34A] bg-white px-12 py-5 shadow-sm">
          <span className="text-lg font-extrabold text-[#475569]">العدد المطلوب مطابقته</span>
          <span className="tabular-nums-arabic text-7xl font-black text-[#15803D] sm:text-8xl">
            {formatNumber(100, numeralStyle)}
          </span>
        </div>
      </div>

      {/* الخيارات البصرية الثلاثة */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {round.options.map((opt) => {
          const isCorrect = opt.tensCount === 10;
          const isWobbling = wobbleId === opt.id;
          const isHinted = showHint && isCorrect && !solved;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleChoose(opt)}
              aria-label={opt.label}
              className={`flex min-h-[250px] flex-col items-center justify-between gap-4 rounded-3xl border-3 bg-white p-6 shadow-sm transition-all duration-200 ${
                solved && isCorrect
                  ? 'border-[#16A34A] bg-[#ECFDF5] scale-[1.02]'
                  : isHinted
                  ? 'animate-hint-glow border-[#F59E0B] bg-[#FFFBEB]'
                  : isWobbling
                  ? 'animate-gentle-wobble border-[#FDBA74] bg-[#FFF7ED]'
                  : 'border-[#CFE5D8] hover:-translate-y-1 hover:border-[#0284C7] active:scale-[0.98]'
              }`}
            >
              <div className="flex flex-1 items-center justify-center">
                {opt.type === 'square' ? (
                  <HundredsSquareSvg
                    numeralStyle={numeralStyle}
                    columns={opt.tensCount}
                    showBadge={solved && isCorrect}
                    className="h-40 w-40"
                  />
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {Array.from({ length: opt.tensCount }, (_, i) => (
                      <TensBundleSvg
                        key={i}
                        numeralStyle={numeralStyle}
                        size="xs"
                        highlighted={solved && isCorrect}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xl font-black text-[#163029]">
                {solved && isCorrect ? (
                  <span className="flex items-center gap-2 text-[#15803D]">
                    <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                    <span>{formatTextNumbers('مدلول العدد 100', numeralStyle)}</span>
                  </span>
                ) : (
                  <span className="text-[#0369A1]">اضغط للاختيار</span>
                )}
              </div>
            </button>
          );
        })}
      </section>

      {solved && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleNext}
            className="animate-pop-in flex min-h-[74px] items-center justify-center gap-3 rounded-3xl bg-[#16A34A] px-10 py-4 text-2xl font-black text-white shadow-md transition-transform duration-150 hover:bg-[#15803D] active:scale-95"
          >
            <span>{isLastRound ? 'احصل على شهادة التقدير!' : 'الجولة التالية'}</span>
            <ArrowLeft className="h-8 w-8" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
