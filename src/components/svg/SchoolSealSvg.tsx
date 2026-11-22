export function SchoolSealSvg({ className = 'h-28 w-28' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      className={`${className} select-none`}
      role="img"
      aria-label="ختم مدارس الباجور - الصف الرابع"
    >
      <circle cx="80" cy="80" r="74" fill="#FEFCE8" stroke="#15803D" strokeWidth="6" />
      <circle
        cx="80"
        cy="80"
        r="63"
        fill="none"
        stroke="#CA8A04"
        strokeWidth="2.5"
        strokeDasharray="6 5"
      />
      {/* ثلاث نجوم صغيرة في الأعلى */}
      <path
        d="M80 24L82.5 30L89 30.5L84 34.5L85.5 41L80 37.5L74.5 41L76 34.5L71 30.5L77.5 30L80 24Z"
        fill="#EAB308"
      />
      <text
        x="80"
        y="68"
        textAnchor="middle"
        fill="#166534"
        fontSize="16"
        fontWeight="800"
        fontFamily="Cairo, Tajawal, sans-serif"
      >
        ختم التميز
      </text>
      <text
        x="80"
        y="94"
        textAnchor="middle"
        fill="#14532D"
        fontSize="20"
        fontWeight="900"
        fontFamily="Cairo, Tajawal, sans-serif"
      >
        مدارس الباجور
      </text>
      <text
        x="80"
        y="120"
        textAnchor="middle"
        fill="#15803D"
        fontSize="16"
        fontWeight="700"
        fontFamily="Cairo, Tajawal, sans-serif"
      >
        الصف الرابع
      </text>
    </svg>
  );
}
