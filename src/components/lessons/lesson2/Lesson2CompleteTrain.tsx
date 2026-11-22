import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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
import { TrainCarriageButton, TrainLocomotiveSvg } from '../../svg/DecadesTrainSvg';
import { GuideBanner } from '../../ui/GuideBanner';

interface Lesson2CompleteTrainProps {
  studentName: string;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onCelebrate: () => void;
  onComplete: () => void;
}

interface TrainRound {
  sequence: (number | null)[];
  answer: number;
  choices: number[];
  hintBefore: number;
}

const ROUNDS: TrainRound[] = [
  {
    sequence: [10, 20, null, 40],
    answer: 30,
    choices: [30, 50, 80],
    hintBefore: 20,
  },
  {
    sequence: [40, 50, null, 70],
    answer: 60,
    choices: [20, 60, 90],
    hintBefore: 50,
  },
  {
    sequence: [70, 80, 90, null],
    answer: 100,
    choices: [40, 60, 100],
    hintBefore: 90,
  },
];

/**
 * الدرس الثاني - نشاط 1: أكمل العربة المفقودة في قطار العقود
 */
export function Lesson2CompleteTrain({
  studentName,
  numeralStyle,
  isMuted,
  onCelebrate,
  onComplete,
}: Lesson2CompleteTrainProps) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wobbleChoice, setWobbleChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'neutral' | 'success' | 'encourage'>('neutral');

  const callout = getStudentCallout(studentName);
  const round = ROUNDS[roundIdx];
  const isLastRound = roundIdx === ROUNDS.length - 1;

  const spokenSequence = round.sequence
    .map((n) => (n === null ? 'ما هو الرقم المفقود؟' : getDecadeWord(n)))
    .join('، ');
  const questionSpeech = `أكمل قطار العقود ${callout}: ${spokenSequence} اختر الرقم الصحيح من الأسفل.`;

  useEffect(() => {
    setSolved(false);
    setShowHint(false);
    setFeedback('neutral');
    speakArabic(questionSpeech, isMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx]);

  const handleChoice = (choice: number) => {
    if (solved) return;

    if (choice === round.answer) {
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
        `ممتاز ${callout}! الإجابة هي ${getDecadeWord(round.answer)}!`,
        isMuted
      );
    } else {
      playGentleRetrySound(isMuted);
      setFeedback('encourage');
      setShowHint(true);
      setWobbleChoice(choice);
      setTimeout(() => setWobbleChoice(null), 400);
      speakArabic(
        `حاول مرة أخرى ${callout}! ما العقد الذي يأتي بعد ${getDecadeWord(round.hintBefore)}؟ انظر إلى الزر الذي يضيء.`,
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
      ? formatTextNumbers(
          `رائع ${callout}! العربة المفقودة هي ${round.answer} (${getDecadeWord(round.answer)})!`,
          numeralStyle
        )
      : feedback === 'encourage'
      ? formatTextNumbers(
          `حاول مرة أخرى ${callout}! ما الرقم الذي يأتي بعد ${round.hintBefore}؟`,
          numeralStyle
        )
      : `اختر الرقم الصحيح لتكمل العربة المفقودة في القطار:`;

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

      <div className="text-center text-xl font-extrabold text-[#475569]">
        السؤال {formatNumber(roundIdx + 1, numeralStyle)} من{' '}
        {formatNumber(ROUNDS.length, numeralStyle)}
      </div>

      {/* القطار مع العربة المفقودة */}
      <section className="flex flex-col items-center gap-8 rounded-3xl border-2 border-[#CFE5D8] bg-white p-6 shadow-sm sm:p-8">
        <div
          className="flex w-full flex-wrap items-end justify-center gap-1 rounded-3xl bg-[#F4FAF6] p-5 border-2 border-[#D7F0E0]"
          dir="ltr"
        >
          <TrainLocomotiveSvg className="h-28 w-36 sm:h-36 sm:w-44" />
          {round.sequence.map((val, idx) => {
            const displayVal = val === null && solved ? round.answer : val;
            return (
              <TrainCarriageButton
                key={`${roundIdx}-${idx}`}
                value={displayVal}
                colorIndex={idx + roundIdx * 2}
                numeralStyle={numeralStyle}
                isActive={val === null}
                size="lg"
              />
            );
          })}
        </div>

        {/* ثلاث اختيارات كبيرة جداً */}
        <div className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-3">
          {round.choices.map((choice) => {
            const isCorrect = choice === round.answer;
            const isHinted = showHint && isCorrect && !solved;
            const isWobbling = wobbleChoice === choice;

            return (
              <button
                key={choice}
                type="button"
                onClick={() => handleChoice(choice)}
                aria-label={`الرقم ${formatNumber(choice, numeralStyle)}`}
                className={`tabular-nums-arabic flex min-h-[96px] flex-col items-center justify-center rounded-3xl border-3 px-6 py-4 text-5xl font-black shadow-sm transition-all duration-150 ${
                  solved && isCorrect
                    ? 'border-[#16A34A] bg-[#DCFCE7] text-[#14532D] scale-105'
                    : isHinted
                    ? 'animate-hint-glow border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]'
                    : isWobbling
                    ? 'animate-gentle-wobble border-[#FDBA74] bg-[#FFF7ED] text-[#9A3412]'
                    : 'border-[#7DD3FC] bg-[#F0F9FF] text-[#0C4A6E] hover:-translate-y-1 hover:border-[#0284C7] hover:bg-[#E0F2FE] active:scale-95'
                }`}
              >
                <span>{formatNumber(choice, numeralStyle)}</span>
                <span className="mt-1 text-lg font-bold opacity-80">
                  {getDecadeWord(choice)}
                </span>
              </button>
            );
          })}
        </div>

        {solved && (
          <button
            type="button"
            onClick={handleNext}
            className="animate-pop-in flex min-h-[72px] items-center justify-center gap-3 rounded-3xl bg-[#16A34A] px-10 py-4 text-2xl font-black text-white shadow-md transition-transform duration-150 hover:bg-[#15803D] active:scale-95"
          >
            <span>{isLastRound ? 'التالي: لعبة البالونات' : 'السؤال التالي'}</span>
            <ArrowLeft className="h-8 w-8" aria-hidden="true" />
          </button>
        )}
      </section>
    </div>
  );
}
