import { useCallback, useEffect, useRef, useState } from 'react';
import { Lesson1Assemble } from './components/lessons/lesson1/Lesson1Assemble';
import { Lesson1Identify } from './components/lessons/lesson1/Lesson1Identify';
import { Lesson1Learn } from './components/lessons/lesson1/Lesson1Learn';
import { Lesson1Meaning } from './components/lessons/lesson1/Lesson1Meaning';
import { Lesson2Balloons } from './components/lessons/lesson2/Lesson2Balloons';
import { Lesson2CompleteTrain } from './components/lessons/lesson2/Lesson2CompleteTrain';
import { Lesson2Learn } from './components/lessons/lesson2/Lesson2Learn';
import { Lesson2Order } from './components/lessons/lesson2/Lesson2Order';
import { HomeScreen } from './components/screens/HomeScreen';
import { RewardScreen } from './components/screens/RewardScreen';
import { GardenBackdrop } from './components/svg/GardenBackdrop';
import { CelebrationOverlay } from './components/ui/CelebrationOverlay';
import { TopHudBar } from './components/ui/TopHudBar';
import { AppScreen, LessonId, NumeralStyle } from './types/game';
import { playClickSound, speakArabic, stopSpeaking } from './utils/audio';
import { formatTextNumbers, getStudentCallout } from './utils/numerals';

const LESSON_TITLES: Record<LessonId, string> = {
  1: 'الدرس الأول: العدد 100 ومدلوله',
  2: 'الدرس الثاني: العد بالعقود حتى 100',
};

const STAGE_STARS = [1, 1, 2, 2];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeLesson, setActiveLesson] = useState<LessonId>(1);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [studentName, setStudentName] = useState<string>('');
  const [numeralStyle, setNumeralStyle] = useState<NumeralStyle>('western');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [sessionKey, setSessionKey] = useState<number>(0);

  const celebrateTimerRef = useRef<number | null>(null);

  const triggerCelebration = useCallback(() => {
    setIsCelebrating(false);
    window.requestAnimationFrame(() => {
      setIsCelebrating(true);
    });
    if (celebrateTimerRef.current !== null) {
      window.clearTimeout(celebrateTimerRef.current);
    }
    celebrateTimerRef.current = window.setTimeout(() => {
      setIsCelebrating(false);
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (celebrateTimerRef.current !== null) {
        window.clearTimeout(celebrateTimerRef.current);
      }
      stopSpeaking();
    };
  }, []);

  const handleGoHome = () => {
    stopSpeaking();
    playClickSound(isMuted);
    setScreen('home');
    setStageIndex(0);
    setStars(0);
  };

  const handleSelectLesson = (lessonId: LessonId) => {
    stopSpeaking();
    playClickSound(isMuted);
    setActiveLesson(lessonId);
    setStageIndex(0);
    setStars(0);
    setSessionKey((k) => k + 1);
    setScreen(lessonId === 1 ? 'lesson1' : 'lesson2');
  };

  const handleAdvanceStage = () => {
    stopSpeaking();
    const earned = STAGE_STARS[stageIndex] ?? 1;
    setStars((prev) => prev + earned);

    if (stageIndex < 3) {
      setStageIndex((prev) => prev + 1);
    } else {
      triggerCelebration();
      setScreen('reward');
    }
  };

  const handleReplayLesson = () => {
    stopSpeaking();
    setStageIndex(0);
    setStars(0);
    setSessionKey((k) => k + 1);
    setScreen(activeLesson === 1 ? 'lesson1' : 'lesson2');
  };

  const handleToggleNumeralStyle = () => {
    playClickSound(isMuted);
    setNumeralStyle((prev) => (prev === 'western' ? 'eastern' : 'western'));
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        stopSpeaking();
      } else {
        playClickSound(false);
      }
      return next;
    });
  };

  const handleSpeakWelcome = () => {
    const callout = getStudentCallout(studentName);
    speakArabic(
      `أهلاً بك ${callout} في مغامرة الأرقام للصف الرابع بمدارس الباجور! اختر الدرس الأول لتتعلم العدد مئة ومدلوله، أو الدرس الثاني لتلعب مع قطار العقود حتى مئة.`,
      isMuted
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col text-[#163029]" dir="rtl">
      <GardenBackdrop />
      <CelebrationOverlay active={isCelebrating} />

      <TopHudBar
        screen={screen}
        stageIndex={stageIndex}
        stars={stars}
        numeralStyle={numeralStyle}
        isMuted={isMuted}
        onGoHome={handleGoHome}
        onToggleNumeralStyle={handleToggleNumeralStyle}
        onToggleMute={handleToggleMute}
      />

      {screen === 'home' && (
        <HomeScreen
          studentName={studentName}
          numeralStyle={numeralStyle}
          onChangeName={setStudentName}
          onSelectLesson={handleSelectLesson}
          onSpeakWelcome={handleSpeakWelcome}
        />
      )}

      {(screen === 'lesson1' || screen === 'lesson2') && (
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#14532D] sm:text-3xl">
              {formatTextNumbers(LESSON_TITLES[activeLesson], numeralStyle)}
            </h1>
          </div>

          {screen === 'lesson1' && stageIndex === 0 && (
            <Lesson1Learn
              key={`l1-s0-${sessionKey}`}
              studentName={studentName}
              numeralStyle={numeralStyle}
              isMuted={isMuted}
              onCelebrate={triggerCelebration}
              onComplete={handleAdvanceStage}
            />
          )}

          {screen === 'lesson1' && stageIndex === 1 && (
            <Lesson1Assemble
              key={`l1-s1-${sessionKey}`}
              studentName={studentName}
              numeralStyle={numeralStyle}
              isMuted={isMuted}
              onCelebrate={triggerCelebration}
              onComplete={handleAdvanceStage}
            />
          )}

          {screen === 'lesson1' && stageIndex === 2 && (
            <Lesson1Identify
              key={`l1-s2-${sessionKey}`}
              studentName={studentName}
              numeralStyle={numeralStyle}
              isMuted={isMuted}
              onCelebrate={triggerCelebration}
              onComplete={handleAdvanceStage}
            />
          )}

          {screen === 'lesson1' && stageIndex === 3 && (
            <Lesson1Meaning
              key={`l1-s3-${sessionKey}`}
              studentName={studentName}
              numeralStyle={numeralStyle}
              isMuted={isMuted}
              onCelebrate={triggerCelebration}
              onComplete={handleAdvanceStage}
            />
          )}

          {screen === 'lesson2' && stageIndex === 0 && (
            <Lesson2Learn
              key={`l2-s0-${sessionKey}`}
              studentName={studentName}
              numeralStyle={numeralStyle}
              isMuted={isMuted}
              onCelebrate={triggerCelebration}
              onComplete={handleAdvanceStage}
            />
          )}

          {screen === 'lesson2' && stageIndex === 1 && (
            <Lesson2CompleteTrain
              key={`l2-s1-${sessionKey}`}
              studentName={studentName}
              numeralStyle={numeralStyle}
              isMuted={isMuted}
              onCelebrate={triggerCelebration}
              onComplete={handleAdvanceStage}
            />
          )}

          {screen === 'lesson2' && stageIndex === 2 && (
            <Lesson2Balloons
              key={`l2-s2-${sessionKey}`}
              studentName={studentName}
              numeralStyle={numeralStyle}
              isMuted={isMuted}
              onCelebrate={triggerCelebration}
              onComplete={handleAdvanceStage}
            />
          )}

          {screen === 'lesson2' && stageIndex === 3 && (
            <Lesson2Order
              key={`l2-s3-${sessionKey}`}
              studentName={studentName}
              numeralStyle={numeralStyle}
              isMuted={isMuted}
              onCelebrate={triggerCelebration}
              onComplete={handleAdvanceStage}
            />
          )}
        </main>
      )}

      {screen === 'reward' && (
        <RewardScreen
          studentName={studentName}
          lessonId={activeLesson}
          stars={stars}
          numeralStyle={numeralStyle}
          isMuted={isMuted}
          onReplayLesson={handleReplayLesson}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
