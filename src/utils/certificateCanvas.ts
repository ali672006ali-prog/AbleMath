import { LessonId, NumeralStyle } from '../types/game';
import { formatNumber, formatTextNumbers, getStudentCertificateName } from './numerals';

interface CertificateOptions {
  studentName: string;
  lessonId: LessonId;
  stars: number;
  numeralStyle: NumeralStyle;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  fillStyle: string,
  strokeStyle: string
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

/**
 * رسم وتصدير شهادة التقدير كملف صورة PNG عالية الدقة باللغة العربية
 */
export async function downloadCertificatePng({
  studentName,
  lessonId,
  stars,
  numeralStyle,
}: CertificateOptions): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const width = 1600;
  const height = 1130;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.direction = 'rtl';

  // خلفية كريمية هادئة بتدرج ناعم
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#F7FCF9');
  bgGrad.addColorStop(0.5, '#FFFFFF');
  bgGrad.addColorStop(1, '#F1FAF4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // إطار خارجي أخضر زمردي هادئ
  ctx.strokeStyle = '#15803D';
  ctx.lineWidth = 18;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // إطار داخلي ذهبي دافئ
  ctx.strokeStyle = '#EAB308';
  ctx.lineWidth = 6;
  ctx.strokeRect(64, 64, width - 128, height - 128);

  // زخارف الزوايا الهادئة
  const corners: [number, number][] = [
    [96, 96],
    [width - 96, 96],
    [96, height - 96],
    [width - 96, height - 96],
  ];
  corners.forEach(([cx, cy]) => {
    drawStar(ctx, cx, cy, 5, 22, 10, '#FDE047', '#CA8A04');
  });

  // العنوان المدرسي العلوي
  ctx.textAlign = 'center';
  ctx.fillStyle = '#166534';
  ctx.font = '700 34px "Cairo", "Tajawal", sans-serif';
  ctx.fillText('مدارس الباجور — التربية الخاصة — الصف الرابع', width / 2, 155);

  // عنوان الشهادة
  ctx.fillStyle = '#14532D';
  ctx.font = '900 76px "Cairo", "Tajawal", sans-serif';
  ctx.fillText('شهادة تقدير وتفوق', width / 2, 265);

  // خط فاصل ذهبي
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 220, 298);
  ctx.lineTo(width / 2 + 220, 298);
  ctx.stroke();

  // نص المنح
  ctx.fillStyle = '#334155';
  ctx.font = '600 36px "Cairo", "Tajawal", sans-serif';
  ctx.fillText('تُمنح بكل فخر وسعادة للطالب البطل', width / 2, 382);

  // اسم الطالب داخل إطار لطيف
  const displayName = getStudentCertificateName(studentName);
  ctx.fillStyle = '#ECFDF5';
  ctx.strokeStyle = '#86EFAC';
  ctx.lineWidth = 4;
  const nameBoxW = 760;
  const nameBoxH = 114;
  const nameBoxX = (width - nameBoxW) / 2;
  const nameBoxY = 418;
  ctx.beginPath();
  ctx.roundRect(nameBoxX, nameBoxY, nameBoxW, nameBoxH, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#065F46';
  ctx.font = '900 58px "Cairo", "Tajawal", sans-serif';
  ctx.fillText(displayName, width / 2, 494);

  // تفاصيل الدرس المنجز
  const lessonTitle =
    lessonId === 1
      ? formatTextNumbers('الدرس الأول: العدد 100 ومدلوله', numeralStyle)
      : formatTextNumbers('الدرس الثاني: العد بالعقود حتى 100', numeralStyle);

  ctx.fillStyle = '#1E293B';
  ctx.font = '700 38px "Cairo", "Tajawal", sans-serif';
  ctx.fillText(`لإتمامه بنجاح أنشطة «${lessonTitle}»`, width / 2, 608);

  ctx.fillStyle = '#475569';
  ctx.font = '600 30px "Cairo", "Tajawal", sans-serif';
  ctx.fillText('في لعبة مغامرة الأرقام بأداء رائع وتركيز مميز', width / 2, 666);

  // صف النجوم الذهبية
  const starCountDisplay = Math.min(Math.max(stars, 1), 6);
  const gap = 82;
  const startX = width / 2 - ((starCountDisplay - 1) * gap) / 2;
  for (let i = 0; i < starCountDisplay; i++) {
    drawStar(ctx, startX + i * gap, 755, 5, 34, 15, '#FACC15', '#B45309');
  }

  ctx.fillStyle = '#B45309';
  ctx.font = '800 32px "Cairo", "Tajawal", sans-serif';
  ctx.fillText(
    `مجموع النجوم المكتسبة: ${formatNumber(stars, numeralStyle)} نجوم`,
    width / 2,
    838
  );

  // الختم الرسمي لمدارس الباجور في اليسار السفلي
  const sealX = 290;
  const sealY = 930;
  ctx.save();
  ctx.beginPath();
  ctx.arc(sealX, sealY, 108, 0, Math.PI * 2);
  ctx.fillStyle = '#FEFCE8';
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#15803D';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sealX, sealY, 92, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = '#CA8A04';
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#14532D';
  ctx.font = '800 28px "Cairo", "Tajawal", sans-serif';
  ctx.fillText('ختم التميز', sealX, sealY - 34);
  ctx.font = '900 27px "Cairo", "Tajawal", sans-serif';
  ctx.fillText('مدارس الباجور', sealX, sealY + 6);
  ctx.fillStyle = '#166534';
  ctx.font = '700 24px "Cairo", "Tajawal", sans-serif';
  ctx.fillText('الصف الرابع', sealX, sealY + 46);
  ctx.restore();

  // توقيع المعلم / المدرسة في اليمين السفلي
  const sigX = width - 310;
  ctx.fillStyle = '#166534';
  ctx.font = '800 30px "Cairo", "Tajawal", sans-serif';
  ctx.fillText('معلم التربية الخاصة', sigX, 910);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sigX - 150, 956);
  ctx.lineTo(sigX + 150, 956);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.font = '600 24px "Cairo", "Tajawal", sans-serif';
  ctx.fillText('مدارس الباجور - الصف الرابع', sigX, 996);

  // تنزيل الصورة
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const safeName = displayName.replace(/\s+/g, '_');
  link.download = `شهادة_تقدير_${safeName}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
