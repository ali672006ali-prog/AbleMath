import { NumeralStyle } from '../types/game';

const EASTERN_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * تحويل الأرقام حسب النمط المختار (الأرقام القياسية 10 أو الشرقية ١٠)
 */
export function formatNumber(value: number | string, style: NumeralStyle): string {
  const str = String(value);
  if (style === 'western') {
    return str;
  }
  return str.replace(/\d/g, (digit) => EASTERN_DIGITS[Number(digit)] ?? digit);
}

/**
 * تحويل أي أرقام موجودة داخل نص عربي حسب نمط الأرقام المختار
 */
export function formatTextNumbers(text: string, style: NumeralStyle): string {
  if (style === 'western') {
    return text;
  }
  return text.replace(/\d/g, (digit) => EASTERN_DIGITS[Number(digit)] ?? digit);
}

/**
 * أسماء العقود بالعربية الفصيحة الواضحة للنطق السليم
 */
export const DECADE_WORDS: Record<number, string> = {
  0: 'صفر',
  10: 'عشرة',
  20: 'عشرون',
  30: 'ثلاثون',
  40: 'أربعون',
  50: 'خمسون',
  60: 'ستون',
  70: 'سبعون',
  80: 'ثمانون',
  90: 'تسعون',
  100: 'مئة',
};

export function getDecadeWord(num: number): string {
  return DECADE_WORDS[num] ?? String(num);
}

/**
 * إرجاع اسم الطالب للمناداة في التشجيع (أو "يا بطل")
 */
export function getStudentCallout(studentName: string): string {
  const clean = studentName.trim();
  return clean.length > 0 ? `يا ${clean}` : 'يا بطل';
}

/**
 * إرجاع اسم الطالب للشهادة (أو "البطل")
 */
export function getStudentCertificateName(studentName: string): string {
  const clean = studentName.trim();
  return clean.length > 0 ? clean : 'البطل';
}
