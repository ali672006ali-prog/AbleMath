import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { NumeralStyle, RabbitMood } from '../../../types/game';
import {
  playApplauseSound,
  playBalloonPopSound,
  playClickSound,
  playGentleRetrySound,
  speakArabic,
} from '../../../utils/audio';
import {
  formatNumber,
  formatTextNumbers,
  getDecadeWord,
  getStudentCallout,
} from '../../../utils/numerals';
import { BalloonSvg } from '../../svg/BalloonSvg';
import { GuideBanner } from '../../ui/GuideBanner';

interface Lesson2BalloonsProps {
  studentName: string;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onCelebrate: () => void;
  onComplete: () => void;
}

interface FloatingBalloon {
  id: number;
  value: number;
  laneIndex: number; // 0..3 لضمان عدم تداخل البالونات وسهولة الضغط
  yPercent: number; // 105 في الأسفل إلى -20 في الأعلى
  speed: number; // بطيء ومريح جداً لطلاب التربية الخاصة
  color: string;
  strokeColor: string;
}

const DECADES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const BALLOON_COLORS = [
  { color: '#38BDF8', stroke: '#0284C7' },
  { color: '#4ADE80', stroke: '#16A34A' },
  { color: '#FB923C', stroke: '#EA580C' },
  { color: '#A78BFA', stroke: '#7C3AED' },
  { color: '#F472B6', stroke: '#DB2777' },
  { color: '#F59E0B', stroke: '#B45309' },
];

const LANE_X_PERCENTS = [14, 38, 62, 86];

function buildWaveBalloons(targetDecade: number, waveSeed: number): FloatingBalloon[] {
  const otherDecades = DECADES.filter((d) => d !== targetDecade);
  // اختيار 3 عقود مختلفة بوضوح كمشتتات لطيفة
  const distractors: number[] = [];
  for (let i = 0; i < 3; i++) {
    const pick = otherDecades[(waveSeed * 3 + i * 2) % otherDecades.length];
    if (!distractors.includes(pick)) {
      distractors.push(pick);
    }
  }
  while (distractors.length < 3) {
    const fallback = otherDecades.find((d) => !distractors.includes(d)) ?? 10;
    distractors.push(fallback);
  }

  const values = [targetDecade, ...distractors];
  // تبديل المسارات بشكل متوازن
  const targetLane = waveSeed % 4;
  const arranged = new Array<number>(4);
  arranged[targetLane] = targetDecade;
  let dIdx = 0;
  for (let lane = 0; lane < 4; lane++) {
    if (lane !== targetLane) {
      arranged[lane] = distractors[dIdx++];
    }
  }

  return arranged.map((val, laneIdx) => {
    const palette = BALLOON_COLORS[(laneIdx + waveSeed) % BALLOON_COLORS.length];
    return {
      id: waveSeed * 10 + laneIdx,
      value: val,
      laneIndex: laneIdx,
      yPercent: 72 + ((laneIdx * 17 + waveSeed * 11) % 34),
      speed: 7.5 + (laneIdx % 3) * 1.4, // صعود بطيء جداً (~12 ثانية لعبور الشاشة)
      color: palette.color,
      strokeColor: palette.stroke,
    };
  });
}

/**
 * الدرس الثاني - نشاط 2: لعبة البالونات (فرقعة العقد التالي بالترتيب من 10 إلى 100)
 */
export function Lesson2Balloons({
  studentName,
  numeralStyle,
  isMuted,
  onCelebrate,
  onComplete,
}: Lesson2BalloonsProps) {
  const [targetIdx, setTargetIdx] = useState(0);
  const [balloons, setBalloons] = useState<FloatingBalloon[]>(() => buildWaveBalloons(10, 1));
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'neutral' | 'success' | 'encourage'>('neutral');
  const [poppedFlash, setPoppedFlash] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const callout = getStudentCallout(studentName);
  const isFinished = targetIdx >= DECADES.length;
  const currentTarget = isFinished ? 100 : DECADES[targetIdx];

  const introSpeech = `لعبة البالونات ${callout}! فرقع البالون الذي يحمل العدد ${getDecadeWord(currentTarget)}.`;

  useEffect(() => {
    if (!isFinished) {
      speakArabic(
        targetIdx === 0
          ? `لعبة البالونات ${callout}! فرقع البالونات بالترتيب من عشرة إلى مئة. ابدأ بالبالون رقم عشرة!`
          : `الآن فرقع البالون رقم ${getDecadeWord(currentTarget)}!`,
        isMuted
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIdx]);

  // حلقة حركة سلسة وبطيئة جداً للبالونات عبر requestAnimationFrame
  useEffect(() => {
    if (isFinished) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      return;
    }

    lastTimeRef.current = null;

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const rawDt = (timestamp - lastTimeRef.current) / 1000;
      const dt = Math.min(rawDt, 0.05); // تثبيت خطوة الزمن لمنع القفزات
      lastTimeRef.current = timestamp;

      setBalloons((prev) =>
        prev.map((b) => {
          let nextY = b.yPercent - b.speed * dt;
          if (nextY < -18) {
            nextY = 104;
          }
          return { ...b, yPercent: nextY };
        })
      );

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isFinished]);

  const handlePopBalloon = (balloon: FloatingBalloon) => {
    if (isFinished) return;

    if (balloon.value === currentTarget) {
      playBalloonPopSound(isMuted);
      setShowHint(false);
      setFeedback('success');
      setPoppedFlash(formatNumber(balloon.value, numeralStyle));
      setTimeout(() => setPoppedFlash(null), 650);

      const nextIdx = targetIdx + 1;
      setTargetIdx(nextIdx);

      if (nextIdx >= DECADES.length) {
        playApplauseSound(isMuted);
        onCelebrate();
        speakArabic(`ممتاز ${callout}! فرقعت جميع بالونات العقود من عشرة حتى مئة!`, isMuted);
      } else {
        setBalloons(buildWaveBalloons(DECADES[nextIdx], nextIdx + 1));
      }
    } else {
      playGentleRetrySound(isMuted);
      setFeedback('encourage');
      setShowHint(true);
      speakArabic(
        `حاول مرة أخرى ${callout}! ابحث عن البالون المضيء الذي يحمل العدد ${getDecadeWord(currentTarget)}.`,
        isMuted
      );
    }
  };

  const bannerMessage = isFinished
    ? formatTextNumbers(`أحسنت ${callout}! فرقعت كل البالونات بالترتيب من 10 حتى 100!`, numeralStyle)
    : feedback === 'encourage'
    ? formatTextNumbers(
        `حاول مرة أخرى ${callout}! اضغط على البالون المضيء رقم ${currentTarget} (${getDecadeWord(currentTarget)}).`,
        numeralStyle
      )
    : formatTextNumbers(
        `فرقع البالون رقم ${currentTarget} (${getDecadeWord(currentTarget)})!`,
        numeralStyle
      );

  const mood: RabbitMood = isFinished
    ? 'cheering'
    : feedback === 'encourage'
    ? 'encouraging'
    : 'happy';

  return (
    <div className="flex w-full flex-col gap-5">
      <GuideBanner
        message={bannerMessage}
        mood={mood}
        feedbackTone={isFinished ? 'success' : feedback}
        onReplayAudio={() => speakArabic(introSpeech, isMuted)}
      />

      {/* شريط متابعة العقود من 10 إلى 100 */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-[#CFE5D8] bg-white px-4 py-3 shadow-sm">
        {DECADES.map((val, idx) => {
          const done = idx < targetIdx;
          const isCurrent = idx === targetIdx && !isFinished;
          return (
            <div
              key={val}
              className={`tabular-nums-arabic flex h-12 min-w-[54px] items-center justify-center rounded-xl px-2 text-xl font-black transition-all ${
                done
                  ? 'bg-[#16A34A] text-white'
                  : isCurrent
                  ? 'border-3 border-[#F59E0B] bg-[#FEF3C7] text-[#92400E] scale-110'
                  : 'bg-[#F1F5F9] text-[#94A3B8]'
              }`}
            >
              {formatNumber(val, numeralStyle)}
            </div>
          );
        })}
      </div>

      {/* ساحة طيران البالونات الهادئة */}
      <section className="relative h-[430px] w-full overflow-hidden rounded-3xl border-3 border-[#BAE6FD] bg-gradient-to-b from-[#E0F2FE] via-[#F0F9FF] to-[#DCFCE7] shadow-sm sm:h-[470px]">
        {!isFinished ? (
          <>
            {/* تلميح ثابت في أعلى الساحة للرقم المطلوب */}
            <div className="pointer-events-none absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-2xl border-2 border-[#F59E0B] bg-white/95 px-6 py-2 text-center shadow-sm">
              <span className="text-xl font-extrabold text-[#334155]">المطلوب الآن: </span>
              <span className="tabular-nums-arabic text-3xl font-black text-[#D97706]">
                {formatNumber(currentTarget, numeralStyle)}
              </span>
            </div>

            {poppedFlash && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <span className="animate-pop-in tabular-nums-arabic rounded-3xl bg-[#16A34A] px-8 py-4 text-5xl font-black text-white shadow-lg">
                  أحسنت! {poppedFlash}
                </span>
              </div>
            )}

            {balloons.map((b) => {
              const isTarget = b.value === currentTarget;
              const isHinted = showHint && isTarget;

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handlePopBalloon(b)}
                  aria-label={`بالون رقم ${formatNumber(b.value, numeralStyle)}`}
                  style={{
                    left: `${LANE_X_PERCENTS[b.laneIndex]}%`,
                    top: `${b.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-10 cursor-pointer p-2 transition-transform duration-100 hover:scale-110 active:scale-90 focus-visible:rounded-full"
                >
                  <BalloonSvg
                    value={b.value}
                    color={b.color}
                    strokeColor={b.strokeColor}
                    numeralStyle={numeralStyle}
                    isHinted={isHinted}
                  />
                </button>
              );
            })}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
            <p className="text-4xl font-black text-[#14532D]">
              {formatTextNumbers('رائع! فرقعت كل البالونات من 10 إلى 100!', numeralStyle)}
            </p>
            <button
              type="button"
              onClick={() => {
                playClickSound(isMuted);
                onComplete();
              }}
              className="animate-pop-in flex min-h-[76px] items-center justify-center gap-3 rounded-3xl bg-[#16A34A] px-10 py-4 text-2xl font-black text-white shadow-md transition-transform duration-150 hover:bg-[#15803D] active:scale-95"
            >
              <span>التالي: رتب العقود</span>
              <ArrowLeft className="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
