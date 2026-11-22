import { Volume2 } from 'lucide-react';
import { LessonId, NumeralStyle } from '../../types/game';
import { formatTextNumbers, getStudentCallout } from '../../utils/numerals';
import { MiniTrainIllustration } from '../svg/DecadesTrainSvg';
import { RabbitMascot } from '../svg/RabbitMascot';
import { HundredsSquareSvg, TensBundleSvg } from '../svg/TensBundleSvg';

interface HomeScreenProps {
  studentName: string;
  numeralStyle: NumeralStyle;
  onChangeName: (name: string) => void;
  onSelectLesson: (lessonId: LessonId) => void;
  onSpeakWelcome: () => void;
}

export function HomeScreen({
  studentName,
  numeralStyle,
  onChangeName,
  onSelectLesson,
  onSpeakWelcome,
}: HomeScreenProps) {
  const callout = getStudentCallout(studentName);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-8 sm:px-6 sm:py-10">
      {/* الترحيب الرئيسي وشخصية الأرنب */}
      <section className="flex w-full flex-col items-center gap-5 rounded-3xl border-2 border-[#CFE5D8] bg-white/95 p-6 text-center shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <div className="animate-gentle-float">
            <RabbitMascot mood="happy" size="lg" />
          </div>
          <div className="flex flex-col items-center gap-3 sm:items-start sm:text-right">
            <h1 className="text-3xl font-black leading-snug text-[#14532D] sm:text-4xl lg:text-5xl">
              مغامرة الأرقام - الصف الرابع (مدارس الباجور)
            </h1>
            <p className="text-xl font-bold text-[#334155] sm:text-2xl">
              أهلاً بك {callout}! هيا نتعلم ونلعب معاً في حديقة الأرقام.
            </p>
            <button
              type="button"
              onClick={onSpeakWelcome}
              className="mt-1 flex min-h-[56px] items-center gap-3 rounded-2xl bg-[#0284C7] px-6 py-3 text-xl font-extrabold text-white shadow-sm transition-transform duration-150 hover:bg-[#0369A1] active:scale-95"
            >
              <Volume2 className="h-7 w-7" aria-hidden="true" />
              <span>اسمع مرة أخرى</span>
            </button>
          </div>
        </div>

        {/* حقل اختياري لكتابة اسم الطالب */}
        <div className="mt-2 flex w-full max-w-xl flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <label
            htmlFor="student-name-input"
            className="shrink-0 text-xl font-extrabold text-[#163029]"
          >
            اسم الطالب (اختياري):
          </label>
          <input
            id="student-name-input"
            type="text"
            value={studentName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="اكتب اسمك هنا أو ابدأ مباشرة..."
            maxLength={35}
            className="min-h-[60px] w-full rounded-2xl border-2 border-[#94D3AC] bg-[#F8FDF9] px-5 py-3 text-xl font-bold text-[#14532D] placeholder:text-[#64748B] focus:border-[#16A34A] focus:bg-white"
          />
        </div>
      </section>

      {/* بطاقتا اختيار الدرس الكبيرتان */}
      <section aria-label="اختيار الدرس" className="grid w-full grid-cols-1 gap-7 md:grid-cols-2">
        {/* بطاقة الدرس الأول */}
        <button
          type="button"
          onClick={() => onSelectLesson(1)}
          className="group flex flex-col items-center justify-between gap-5 rounded-3xl border-3 border-[#86EFAC] bg-white p-7 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1.5 hover:border-[#16A34A] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-4 py-2">
            <TensBundleSvg numeralStyle={numeralStyle} size="md" highlighted />
            <span className="text-3xl font-black text-[#16A34A]" aria-hidden="true">
              =
            </span>
            <HundredsSquareSvg
              numeralStyle={numeralStyle}
              columns={10}
              showBadge
              className="h-28 w-28"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#14532D] sm:text-3xl">
              {formatTextNumbers('الدرس الأول: العدد 100 ومدلوله', numeralStyle)}
            </h2>
            <p className="text-lg font-bold text-[#475569] sm:text-xl">
              {formatTextNumbers(
                'نتعلم كيف تصنع عشر عشرات العدد 100 ونلعب بالجمع والتمييز',
                numeralStyle
              )}
            </p>
          </div>

          <span className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-[#16A34A] px-6 py-3 text-2xl font-black text-white transition-colors group-hover:bg-[#15803D]">
            ابدأ الدرس الأول
          </span>
        </button>

        {/* بطاقة الدرس الثاني */}
        <button
          type="button"
          onClick={() => onSelectLesson(2)}
          className="group flex flex-col items-center justify-between gap-5 rounded-3xl border-3 border-[#7DD3FC] bg-white p-7 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1.5 hover:border-[#0284C7] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center overflow-hidden">
            <MiniTrainIllustration numeralStyle={numeralStyle} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#0C4A6E] sm:text-3xl">
              {formatTextNumbers('الدرس الثاني: العد بالعقود حتى 100', numeralStyle)}
            </h2>
            <p className="text-lg font-bold text-[#475569] sm:text-xl">
              نركب قطار العقود ونفرقع البالونات ونرتب الأرقام معاً
            </p>
          </div>

          <span className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-[#0284C7] px-6 py-3 text-2xl font-black text-white transition-colors group-hover:bg-[#0369A1]">
            ابدأ الدرس الثاني
          </span>
        </button>
      </section>
    </main>
  );
}
