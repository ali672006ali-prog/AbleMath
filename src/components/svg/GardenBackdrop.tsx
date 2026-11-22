export function GardenBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#EAF6FB] via-[#F4FAF6] to-[#E6F4EC]"
    >
      {/* شمس صباحية هادئة */}
      <svg
        className="absolute top-6 left-8 h-28 w-28 opacity-90 sm:h-36 sm:w-36"
        viewBox="0 0 140 140"
        fill="none"
      >
        <circle cx="70" cy="70" r="46" fill="#FEF3C7" opacity="0.65" />
        <circle cx="70" cy="70" r="32" fill="#FDE68A" />
        <circle cx="70" cy="70" r="24" fill="#FCD34D" />
      </svg>

      {/* سحابتان ناعمتان */}
      <svg
        className="absolute top-12 right-12 h-16 w-40 opacity-80"
        viewBox="0 0 180 70"
        fill="none"
      >
        <path
          d="M28 56H148C160 56 170 47 170 36C170 25 161 17 150 17C147 8 138 2 127 2C116 2 106 8 102 18C98 14 92 12 85 12C72 12 61 21 59 33C56 31 52 30 48 30C36 30 26 39 26 51C26 53 27 55 28 56Z"
          fill="#FFFFFF"
        />
      </svg>

      <svg
        className="hidden sm:block absolute top-24 left-1/3 h-12 w-32 opacity-65"
        viewBox="0 0 180 70"
        fill="none"
      >
        <path
          d="M28 56H148C160 56 170 47 170 36C170 25 161 17 150 17C147 8 138 2 127 2C116 2 106 8 102 18C98 14 92 12 85 12C72 12 61 21 59 33C56 31 52 30 48 30C36 30 26 39 26 51C26 53 27 55 28 56Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* تلال الحديقة الخضراء الهادئة في الأسفل */}
      <svg
        className="absolute bottom-0 left-0 h-44 w-full sm:h-56"
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 155C220 95 450 90 720 145C990 200 1230 175 1440 120V240H0V155Z"
          fill="#D7F0E0"
        />
        <path
          d="M0 190C280 140 540 155 830 195C1080 230 1280 200 1440 170V240H0V190Z"
          fill="#C2E7D0"
        />
        {/* زهور صغيرة غير مشتتة */}
        <g opacity="0.85">
          <circle cx="150" cy="205" r="5" fill="#FDE047" />
          <circle cx="143" cy="205" r="3.5" fill="#FFFFFF" />
          <circle cx="157" cy="205" r="3.5" fill="#FFFFFF" />
          <circle cx="150" cy="198" r="3.5" fill="#FFFFFF" />
          <circle cx="150" cy="212" r="3.5" fill="#FFFFFF" />

          <circle cx="1290" cy="204" r="5" fill="#FDBA74" />
          <circle cx="1283" cy="204" r="3.5" fill="#FFFFFF" />
          <circle cx="1297" cy="204" r="3.5" fill="#FFFFFF" />
          <circle cx="1290" cy="197" r="3.5" fill="#FFFFFF" />
          <circle cx="1290" cy="211" r="3.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
