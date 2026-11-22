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
import { TensBundleSvg } from '../../svg/TensBundleSvg';
import { GuideBanner } from '../../ui/GuideBanner';

interface Lesson1IdentifyProps {
  studentName: string;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onCelebrate: () => void;
  onComplete: () => void;
}

interface IdentifyRound {
  id: number;
  groups: { id: string; tensCount: number }[];
}

const ROUNDS: IdentifyRound[] = [
  {
    id: 1,
    groups: [
      { id: 'r1-a', tensCount: 4 },
      { id: 'r1-b', tensCount: 10 },
      { id: 'r1-c', tensCount: 6 },
    ],
  },
  {
    id: 2,
    groups: [
      { id: 'r2-a', tensCount: 10 },
      { id: 'r2-b', tensCount: 3 },
      { id: 'r2-c', tensCount: 7 },
    ],
  },
];

/**
 * الدرس الأول - نشاط 2: نشاط التمييز بين 3 مجموعات بصرية واختيار المجموعة التي تمثل 100
 */
export function Lesson1Identify({
  studentName,
  numeralStyle,
  isMuted,
  onCelebrate,
  onComplete,
}: Lesson1IdentifyProps) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'neutral' | 'success' | 'encourage'>('neutral');

  const callout = getStudentCallout(studentName);
  const round = ROUNDS[roundIdx];
  const isLastRound = roundIdx === ROUNDS.length - 1;

  const questionSpeech = `النشاط الثاني: انظر إلى المجموعات الثلاث، واختر المجموعة التي تمثل العدد مئة ${callout}. تذكر: مئة تساوي عشر حزم من العشرات.`;

  useEffect(() => {
    setSolved(false);
    setShowHint(false);
    setFeedback('neutral');
    speakArabic(questionSpeech, isMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx]);

  const handleSelectGroup = (groupId: string, tensCount: number) => {
    if (solved) return;

    if (tensCount === 10) {
      setSolved(true);
      setShowHint(false);
      setFeedback('success');
      if (isLastRound) {
        playApplauseSound(isMuted);
      } else {
        playSuccessSound(isMuted);
      }
      onCelebrate();
      speakArabic(`برافو ${callout}! هذه المجموعة بها عشر عشرات وتساوي مئة!`, isMuted);
    } else {
      playGentleRetrySound(isMuted);
      setFeedback('encourage');
      setShowHint(true);
      setWobbleId(groupId);
      setTimeout(() => setWobbleId(null), 400);
      speakArabic(
        `حاول مرة أخرى ${callout}! هذه بها ${tensCount} عشرات فقط. ابحث عن المجموعة التي تضيء وبها عشر عشرات.`,
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
      ? formatTextNumbers(`أحسنت ${callout}! هذه المجموعة تمثل العدد 100 (10 عشرات).`, numeralStyle)
      : feedback === 'encourage'
      ? `حاول مرة أخرى ${callout}! انظر إلى المجموعة التي تضيء وعدّ الحزم.`
      : formatTextNumbers(`اختر المجموعة التي تمثل العدد 100 (عشر حزم من العشرات):`, numeralStyle);

  const mood: RabbitMood =
    feedback === 'success'
      ? 'cheering'
      : feedback === 'encourage'
      ? 'encouraging'
      : 'thinking';

  return (
    <div className="flex w-full flex-col gap-6">
      <GuideBanner
        message={bannerMessage}
        mood={mood}
        feedbackTone={feedback}
        onReplayAudio={() => speakArabic(questionSpeech, isMuted)}
      />

      {/* عداد الجولة الهادئ */}
      <div className="text-center text-xl font-extrabold text-[#475569]">
        الجولة {formatNumber(roundIdx + 1, numeralStyle)} من {formatNumber(ROUNDS.length, numeralStyle)}
      </div>

      {/* المجموعات البصرية الثلاث */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {round.groups.map((group) => {
          const isCorrect = group.tensCount === 10;
          const isWobbling = wobbleId === group.id;
          const isHintHighlighted = showHint && isCorrect && !solved;

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => handleSelectGroup(group.id, group.tensCount)}
              aria-label={`مجموعة بها ${formatNumber(group.tensCount, numeralStyle)} حزم من العشرات`}
              className={`flex min-h-[260px] flex-col items-center justify-between gap-4 rounded-3xl border-3 bg-white p-5 shadow-sm transition-all duration-200 ${
                solved && isCorrect
                  ? 'border-[#16A34A] bg-[#ECFDF5] scale-[1.02]'
                  : isHintHighlighted
                  ? 'animate-hint-glow border-[#F59E0B] bg-[#FFFBEB]'
                  : isWobbling
                  ? 'animate-gentle-wobble border-[#FDBA74] bg-[#FFF7ED]'
                  : 'border-[#CFE5D8] hover:-translate-y-1 hover:border-[#0284C7] active:scale-[0.98]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {Array.from({ length: group.tensCount }, (_, idx) => (
                  <TensBundleSvg
                    key={idx}
                    numeralStyle={numeralStyle}
                    size="xs"
                    highlighted={solved && isCorrect}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-xl font-black text-[#163029]">
                {solved && isCorrect ? (
                  <span className="flex items-center gap-2 text-[#15803D]">
                    <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                    <span>{formatTextNumbers('10 عشرات = 100', numeralStyle)}</span>
                  </span>
                ) : (
                  <span className="text-[#0369A1]">اختر هذه المجموعة</span>
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
            className="animate-pop-in flex min-h-[72px] items-center justify-center gap-3 rounded-3xl bg-[#16A34A] px-10 py-4 text-2xl font-black text-white shadow-md transition-transform duration-150 hover:bg-[#15803D] active:scale-95"
          >
            <span>{isLastRound ? 'التالي: نشاط المدلول' : 'الجولة التالية'}</span>
            <ArrowLeft className="h-8 w-8" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
