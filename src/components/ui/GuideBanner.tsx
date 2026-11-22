import { Volume2 } from 'lucide-react';
import { RabbitMood } from '../../types/game';
import { RabbitMascot } from '../svg/RabbitMascot';

interface GuideBannerProps {
  message: string;
  mood: RabbitMood;
  feedbackTone?: 'neutral' | 'success' | 'encourage';
  onReplayAudio: () => void;
}

/**
 * شريط التوجيه والتشجيع الموحد في جميع مراحل اللعبة:
 * يضم شخصية الأرنب المبتسم + النص الواضح + زر كبير "اسمع مرة أخرى"
 */
export function GuideBanner({
  message,
  mood,
  feedbackTone = 'neutral',
  onReplayAudio,
}: GuideBannerProps) {
  const containerStyles =
    feedbackTone === 'success'
      ? 'bg-[#ECFDF5] border-[#86EFAC]'
      : feedbackTone === 'encourage'
      ? 'bg-[#FFF7ED] border-[#FDBA74]'
      : 'bg-white border-[#D1E7DA]';

  const textStyles =
    feedbackTone === 'success'
      ? 'text-[#14532D]'
      : feedbackTone === 'encourage'
      ? 'text-[#9A3412]'
      : 'text-[#163029]';

  return (
    <div
      className={`flex flex-col items-center justify-between gap-4 rounded-3xl border-2 px-5 py-4 shadow-sm transition-colors duration-200 sm:flex-row sm:px-7 ${containerStyles}`}
    >
      <div className="flex items-center gap-4">
        <RabbitMascot mood={mood} size="sm" />
        <p className={`text-xl font-extrabold leading-relaxed sm:text-2xl ${textStyles}`}>
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onReplayAudio}
        aria-label="اسمع مرة أخرى"
        className="flex min-h-[60px] shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#0284C7] px-6 py-3 text-xl font-extrabold text-white shadow-sm transition-transform duration-150 hover:bg-[#0369A1] active:scale-95 whitespace-nowrap"
      >
        <Volume2 className="h-7 w-7 shrink-0" aria-hidden="true" />
        <span>اسمع مرة أخرى</span>
      </button>
    </div>
  );
}
