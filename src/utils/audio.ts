/**
 * نظام الصوت العربي المتكامل:
 * - Web Speech API لنطق التعليمات والأرقام بالعربية (ar-EG / ar-SA) بسرعة هادئة 0.85
 * - Web Audio API لتوليد مؤثرات صوتية مبهجة وهادئة دون ملفات خارجية
 */

let audioCtx: AudioContext | null = null;
let cachedArabicVoice: SpeechSynthesisVoice | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function selectBestArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return cachedArabicVoice;

  const exactEg = voices.find((v) => v.lang.toLowerCase().startsWith('ar-eg'));
  if (exactEg) {
    cachedArabicVoice = exactEg;
    return exactEg;
  }
  const exactSa = voices.find((v) => v.lang.toLowerCase().startsWith('ar-sa'));
  if (exactSa) {
    cachedArabicVoice = exactSa;
    return exactSa;
  }
  const anyArabic = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
  if (anyArabic) {
    cachedArabicVoice = anyArabic;
    return anyArabic;
  }
  return null;
}

// تحميل الأصوات فور توفرها في المتصفح
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  selectBestArabicVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    selectBestArabicVoice();
  };
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // تجاهل أخطاء المتصفحات المقيدة
    }
  }
}

export function speakArabic(
  text: string,
  isMuted: boolean,
  options?: { rate?: number; onEnd?: () => void }
): void {
  if (isMuted || !text.trim()) {
    options?.onEnd?.();
    return;
  }
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = selectBestArabicVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'ar-EG';
    }
    utterance.rate = options?.rate ?? 0.85;
    utterance.pitch = 1.04;
    utterance.volume = 1;

    if (options?.onEnd) {
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = () => options.onEnd?.();
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    options?.onEnd?.();
  }
}

/**
 * صوت نقر لطيف وناعم للأزرار
 */
export function playClickSound(isMuted: boolean): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(720, now + 0.06);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.14, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.09);
}

/**
 * نغمة نجاح مبهجة (سلم موسيقي صاعد ناعم)
 */
export function playSuccessSound(isMuted: boolean): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const start = now + idx * 0.085;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.3);
  });
}

/**
 * نغمة تنبيه هادئة ولطيفة عند المحاولة مرة أخرى (بدون صوت خطأ مزعج)
 */
export function playGentleRetrySound(isMuted: boolean): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [392.0, 349.23]; // G4 -> F4 دافئة وهادئة

  notes.forEach((freq, idx) => {
    const start = now + idx * 0.12;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.24);
  });
}

/**
 * صوت فرقعة بالون مرحة
 */
export function playBalloonPopSound(isMuted: boolean): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(980, now + 0.07);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * صوت تصفيق واحتفال مرح عند إتمام المرحلة أو الدرس
 */
export function playApplauseSound(isMuted: boolean): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // نغمة احتفالية مشرقة
  const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  fanfare.forEach((freq, i) => {
    const t = now + i * 0.09;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  });

  // محاكاة تصفيق لطيف عبر نبضات ضوضاء مفلترة
  const bufferSize = Math.floor(ctx.sampleRate * 0.06);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.32));
  }

  for (let clap = 0; clap < 9; clap++) {
    const t = now + 0.15 + clap * 0.12 + (clap % 2) * 0.02;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100 + (clap % 3) * 260, t);
    filter.Q.setValueAtTime(1.4, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
  }
}
