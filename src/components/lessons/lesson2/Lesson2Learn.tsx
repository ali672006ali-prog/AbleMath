import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Play, Square } from 'lucide-react';
import { NumeralStyle, RabbitMood } from '../../../types/game';
import {
  playApplauseSound,
  playClickSound,
  speakArabic,
  stopSpeaking,
} from '../../../utils/audio';
import {
  formatNumber,
  formatTextNumbers,
  getDecadeWord,
  getStudentCallout,
} from '../../../utils/numerals';
import { TrainCarriageButton, TrainLocomotiveSvg } from '../../svg/DecadesTrainSvg';
import { GuideBanner } from '../../ui/GuideBanner';

interface Lesson2LearnProps {
  studentName: string;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onCelebrate: () => void;
  onComplete: () => void;
}

const DECADES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/**
 * الدرس الثاني - مرحلة التعلم التفاعلي: قطار العقود من 10 إلى 100
 */
export function Lesson2Learn({
  studentName,
  numeralStyle,
  isMuted,
  onCelebrate,
  onComplete,
}: Lesson2LearnProps) {
  const [activeDecade, setActiveDecade] = useState<number | null>(null);
  const [visited, setVisited] = useState<number[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoTimerRef = useRef<number | null>(null);

  const callout = getStudentCallout(studentName);
  const allVisited = visited.length === DECADES.length;

  const introSpeech = `أهلاً ${callout} في قطار العقود! اضغط على أي عربة في القطار لتضيء وتسمع رقمها، أو اضغط على زر شغّل القطار بالترتيب.`;

  useEffect(() => {
    speakArabic(introSpeech, isMuted);
    return () => {
      if (autoTimerRef.current !== null) {
        window.clearTimeout(autoTimerRef.current);
      }
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopAutoPlay = () => {
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    setIsAutoPlaying(false);
  };

  const markVisited = (decade: number) => {
    setVisited((prev) => {
      if (prev.includes(decade)) return prev;
      const next = [...prev, decade];
      if (next.length === DECADES.length) {
        playApplauseSound(isMuted);
        onCelebrate();
      }
      return next;
    });
  };

  const handleCarriageClick = (decade: number) => {
    stopAutoPlay();
    setActiveDecade(decade);
    markVisited(decade);
    playClickSound(isMuted);
    speakArabic(getDecadeWord(decade), isMuted);
  };

  const handleToggleAutoPlay = () => {
    if (isAutoPlaying) {
      stopAutoPlay();
      stopSpeaking();
      return;
    }

    setIsAutoPlaying(true);
    let idx = 0;

    const step = () => {
      if (idx >= DECADES.length) {
        setIsAutoPlaying(false);
        playApplauseSound(isMuted);
        onCelebrate();
        speakArabic(`أحسنت ${callout}! هذه هي العقود من عشرة حتى مئة!`, isMuted);
        return;
      }
      const val = DECADES[idx];
      setActiveDecade(val);
      markVisited(val);
      playClickSound(isMuted);
      speakArabic(getDecadeWord(val), isMuted);
      idx += 1;
      autoTimerRef.current = window.setTimeout(step, 1350);
    };

    step();
  };

  const bannerMessage = allVisited
    ? formatTextNumbers(`رائع ${callout}! تعرّفت على كل عربات قطار العقود حتى 100!`, numeralStyle)
    : activeDecade !== null
    ? formatTextNumbers(
        `العربة رقم ${activeDecade} — «${getDecadeWord(activeDecade)}»! اضغط على عربة أخرى لتسمعها.`,
        numeralStyle
      )
    : formatTextNumbers(
        `اضغط على أي عربة في قطار العقود لتضيء وتنطق الرقم من 10 حتى 100!`,
        numeralStyle
      );

  const mood: RabbitMood = allVisited ? 'cheering' : 'happy';

  return (
    <div className="flex w-full flex-col gap-6">
      <GuideBanner
        message={bannerMessage}
        mood={mood}
        feedbackTone={allVisited ? 'success' : 'neutral'}
        onReplayAudio={() => speakArabic(introSpeech, isMuted)}
      />

      {/* عرض العدد المنطوق حالياً بشكل واضح وكبير */}
      <section className="flex flex-col items-center gap-6 rounded-3xl border-2 border-[#CFE5D8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-4">
            <span className="text-xl font-extrabold text-[#334155]">العربة المختارة:</span>
            {activeDecade !== null ? (
              <div className="animate-pop-in flex items-center gap-3 rounded-2xl border-2 border-[#86EFAC] bg-[#ECFDF5] px-5 py-2">
                <span className="tabular-nums-arabic text-4xl font-black text-[#15803D]">
                  {formatNumber(activeDecade, numeralStyle)}
                </span>
                <span className="text-2xl font-extrabold text-[#166534]">
                  ({getDecadeWord(activeDecade)})
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-[#64748B]">اضغط على أي عربة</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleAutoPlay}
            className={`flex min-h-[60px] items-center gap-3 rounded-2xl px-6 py-3 text-xl font-black text-white shadow-sm transition-transform duration-150 active:scale-95 ${
              isAutoPlaying
                ? 'bg-[#EA580C] hover:bg-[#C2410C]'
                : 'bg-[#0284C7] hover:bg-[#0369A1]'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Square className="h-6 w-6 fill-current" aria-hidden="true" />
                <span>إيقاف القطار</span>
              </>
            ) : (
              <>
                <Play className="h-6 w-6 fill-current" aria-hidden="true" />
                <span>شغّل القطار بالترتيب</span>
              </>
            )}
          </button>
        </div>

        {/* قطار العقود في صفين واضحين وسهلي الضغط على التابلت والكمبيوتر */}
        <div className="flex w-full flex-col gap-6 rounded-3xl bg-[#F4FAF6] p-5 border-2 border-[#D7F0E0]">
          {/* الصف الأول: القاطرة + 10 إلى 50 */}
          <div className="flex flex-wrap items-end justify-center gap-1" dir="ltr">
            <TrainLocomotiveSvg className="h-28 w-36 sm:h-32 sm:w-40" />
            {DECADES.slice(0, 5).map((val, idx) => (
              <TrainCarriageButton
                key={val}
                value={val}
                colorIndex={idx}
                numeralStyle={numeralStyle}
                isActive={activeDecade === val}
                isVisited={visited.includes(val)}
                onClick={() => handleCarriageClick(val)}
              />
            ))}
          </div>

          {/* خط السكة الحديدية البسيط */}
          <div className="h-2 w-full rounded-full bg-[#CBD5E1]" aria-hidden="true" />

          {/* الصف الثاني: 60 إلى 100 */}
          <div className="flex flex-wrap items-end justify-center gap-1" dir="ltr">
            {DECADES.slice(5, 10).map((val, idx) => (
              <TrainCarriageButton
                key={val}
                value={val}
                colorIndex={idx + 5}
                numeralStyle={numeralStyle}
                isActive={activeDecade === val}
                isVisited={visited.includes(val)}
                onClick={() => handleCarriageClick(val)}
              />
            ))}
          </div>
        </div>

        {/* زر الانتقال إلى الأنشطة */}
        <div className="flex w-full flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
          <p className="text-lg font-bold text-[#475569]">
            استمعت إلى {formatNumber(visited.length, numeralStyle)} من{' '}
            {formatNumber(DECADES.length, numeralStyle)} عربات
          </p>

          <button
            type="button"
            onClick={() => {
              stopAutoPlay();
              playClickSound(isMuted);
              onComplete();
            }}
            className="flex min-h-[68px] items-center justify-center gap-3 rounded-2xl bg-[#16A34A] px-8 py-4 text-2xl font-black text-white shadow-sm transition-transform duration-150 hover:bg-[#15803D] active:scale-95"
          >
            <span>التالي: أكمل القطار</span>
            <ArrowLeft className="h-7 w-7" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
