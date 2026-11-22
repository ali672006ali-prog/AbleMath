import { useEffect, useState } from 'react';
import { Download, Home, Printer, RotateCcw, Star, Volume2 } from 'lucide-react';
import { LessonId, NumeralStyle } from '../../types/game';
import { playApplauseSound, playClickSound, speakArabic } from '../../utils/audio';
import { downloadCertificatePng } from '../../utils/certificateCanvas';
import {
  formatNumber,
  formatTextNumbers,
  getStudentCallout,
  getStudentCertificateName,
} from '../../utils/numerals';
import { RabbitMascot } from '../svg/RabbitMascot';
import { SchoolSealSvg } from '../svg/SchoolSealSvg';

interface RewardScreenProps {
  studentName: string;
  lessonId: LessonId;
  stars: number;
  numeralStyle: NumeralStyle;
  isMuted: boolean;
  onReplayLesson: () => void;
  onGoHome: () => void;
}

export function RewardScreen({
  studentName,
  lessonId,
  stars,
  numeralStyle,
  isMuted,
  onReplayLesson,
  onGoHome,
}: RewardScreenProps) {
  const [isSaving, setIsSaving] = useState(false);

  const callout = getStudentCallout(studentName);
  const certificateName = getStudentCertificateName(studentName);
  const lessonTitle =
    lessonId === 1
      ? formatTextNumbers('الدرس الأول: العدد 100 ومدلوله', numeralStyle)
      : formatTextNumbers('الدرس الثاني: العد بالعقود حتى 100', numeralStyle);

  const congratsSpeech = `مبروك ${callout}! أنت بطل رائع ومجتهد! لقد جمعت ${stars} نجوم ذهبية وحصلت على شهادة تقدير من مدارس الباجور، الصف الرابع!`;

  useEffect(() => {
    playApplauseSound(isMuted);
    speakArabic(congratsSpeech, isMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = async () => {
    playClickSound(isMuted);
    setIsSaving(true);
    try {
      await downloadCertificatePng({
        studentName,
        lessonId,
        stars,
        numeralStyle,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    playClickSound(isMuted);
    window.print();
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center gap-7 px-4 py-8 sm:px-6">
      {/* ترحيب الأرنب المحتفل مع زر إعادة سماع التهنئة */}
      <div className="no-print flex w-full flex-col items-center justify-between gap-4 rounded-3xl border-2 border-[#86EFAC] bg-[#ECFDF5] p-5 shadow-sm sm:flex-row sm:px-7">
        <div className="flex items-center gap-4">
          <RabbitMascot mood="cheering" size="md" />
          <div className="text-center sm:text-right">
            <h1 className="text-3xl font-black text-[#14532D] sm:text-4xl">
              مبروك {callout}!
            </h1>
            <p className="mt-1 text-xl font-bold text-[#166534]">
              لقد جمعت{' '}
              <span className="tabular-nums-arabic font-black text-[#B45309]">
                {formatNumber(stars, numeralStyle)}
              </span>{' '}
              نجوم ذهبية واستحققت شهادة التقدير!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => speakArabic(congratsSpeech, isMuted)}
          className="flex min-h-[60px] shrink-0 items-center gap-3 rounded-2xl bg-[#0284C7] px-6 py-3 text-xl font-extrabold text-white shadow-sm transition-transform duration-150 hover:bg-[#0369A1] active:scale-95"
        >
          <Volume2 className="h-7 w-7" aria-hidden="true" />
          <span>اسمع التهنئة</span>
        </button>
      </div>

      {/* شهادة التقدير المصممة بعناية للعرض والطباعة */}
      <section
        aria-label="شهادة التقدير"
        className="print-certificate-only w-full rounded-3xl border-[10px] border-[#15803D] bg-white p-3 shadow-md sm:p-5"
      >
        <div className="flex flex-col items-center gap-5 rounded-2xl border-4 border-[#EAB308] bg-gradient-to-b from-[#FAFDFB] via-white to-[#F4FAF6] px-6 py-8 text-center sm:px-12 sm:py-10">
          <p className="text-lg font-extrabold text-[#166534] sm:text-xl">
            مدارس الباجور — التربية الخاصة — الصف الرابع
          </p>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-[#14532D] sm:text-5xl">
              شهادة تقدير وتفوق
            </h2>
            <div className="mx-auto h-1.5 w-44 rounded-full bg-[#F59E0B]" />
          </div>

          <p className="text-xl font-bold text-[#334155] sm:text-2xl">
            تُمنح بكل فخر وسعادة للطالب البطل
          </p>

          <div className="w-full max-w-lg rounded-2xl border-2 border-[#86EFAC] bg-[#ECFDF5] px-8 py-4">
            <p className="text-3xl font-black text-[#065F46] sm:text-5xl">
              {certificateName}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xl font-extrabold text-[#1E293B] sm:text-2xl">
              لإتمامه بنجاح أنشطة «{lessonTitle}»
            </p>
            <p className="text-lg font-bold text-[#475569] sm:text-xl">
              في لعبة مغامرة الأرقام بأداء رائع وتركيز مميز
            </p>
          </div>

          {/* صف النجوم */}
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: Math.min(Math.max(stars, 1), 6) }, (_, idx) => (
                <Star
                  key={idx}
                  className="h-10 w-10 fill-[#FACC15] text-[#CA8A04] sm:h-12 sm:w-12"
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="tabular-nums-arabic text-xl font-black text-[#B45309]">
              مجموع النجوم: {formatNumber(stars, numeralStyle)} نجوم
            </p>
          </div>

          {/* التذييل: التوقيع والختم الرسمي لمدارس الباجور */}
          <div className="mt-4 flex w-full flex-col items-center justify-between gap-6 border-t border-[#D1E7DA] pt-6 sm:flex-row sm:px-6">
            <div className="text-center">
              <p className="text-xl font-extrabold text-[#166534]">معلم التربية الخاصة</p>
              <div className="mx-auto mt-4 h-0.5 w-44 bg-[#94A3B8]" />
              <p className="mt-2 text-base font-bold text-[#475569]">
                مدارس الباجور - الصف الرابع
              </p>
            </div>

            <SchoolSealSvg className="h-32 w-32" />
          </div>
        </div>
      </section>

      {/* أزرار الحفظ والطباعة وإعادة اللعب والعودة للرئيسية */}
      <div className="no-print grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isSaving}
          className="flex min-h-[68px] items-center justify-center gap-3 rounded-2xl bg-[#16A34A] px-5 py-4 text-xl font-black text-white shadow-sm transition-transform duration-150 hover:bg-[#15803D] active:scale-95 disabled:opacity-70"
        >
          <Download className="h-7 w-7 shrink-0" aria-hidden="true" />
          <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ الشهادة كصورة'}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex min-h-[68px] items-center justify-center gap-3 rounded-2xl bg-[#0284C7] px-5 py-4 text-xl font-black text-white shadow-sm transition-transform duration-150 hover:bg-[#0369A1] active:scale-95"
        >
          <Printer className="h-7 w-7 shrink-0" aria-hidden="true" />
          <span>طباعة الشهادة</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound(isMuted);
            onReplayLesson();
          }}
          className="flex min-h-[68px] items-center justify-center gap-3 rounded-2xl border-3 border-[#F59E0B] bg-[#FFFBEB] px-5 py-4 text-xl font-black text-[#92400E] shadow-sm transition-transform duration-150 hover:bg-[#FEF3C7] active:scale-95"
        >
          <RotateCcw className="h-7 w-7 shrink-0" aria-hidden="true" />
          <span>العب مرة أخرى</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound(isMuted);
            onGoHome();
          }}
          className="flex min-h-[68px] items-center justify-center gap-3 rounded-2xl border-3 border-[#CFE5D8] bg-white px-5 py-4 text-xl font-black text-[#163029] shadow-sm transition-transform duration-150 hover:bg-[#F4FAF6] active:scale-95"
        >
          <Home className="h-7 w-7 shrink-0 text-[#16A34A]" aria-hidden="true" />
          <span>العودة للرئيسية</span>
        </button>
      </div>
    </main>
  );
}
