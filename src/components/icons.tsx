/**
 * 인라인 SVG 아이콘 모음.
 * 레이아웃 토글 아이콘과 로고 글리프는 Figma 원본 SVG path를 그대로 사용했고,
 * 나머지 얇은 선(bell/search/chat 등)은 시안의 thin 스타일에 맞춰 그렸습니다.
 * currentColor 를 쓰므로 부모의 text-* 색상으로 색이 결정됩니다.
 */

type IconProps = {
  className?: string;
  size?: number;
};

const base = (size: number) => ({ width: size, height: size });

/** Toss 스타일 로고 글리프 (흰색) — Figma "Place Your Icon Here" 그룹 */
export function LogoGlyph({ className, size = 30 }: IconProps) {
  return (
    <svg
      {...base(size)}
      className={className}
      viewBox="0 0 785.389 513.74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M500.115 504.317C592.219 504.316 662.007 477.715 708.388 419.382C754.391 361.525 775.966 274.135 775.966 155.645V146.221H642.588V155.645C642.588 236.666 628.759 290.686 603.814 324.314C579.334 357.312 542.972 372.178 493.574 372.178H86.4766L83.8096 377.142L23.2042 489.929L15.752 503.796L31.4952 503.813L500.105 504.317H500.115Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="18.8471"
      />
      <path
        d="M279.609 18.8927L219.942 124.23L622.684 124.23L684.837 20.5738L279.609 18.8927Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="37.6942"
      />
    </svg>
  );
}

export function BellIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 8.4c0-1.7-.63-3.32-1.76-4.52A5.9 5.9 0 0 0 12 2c-1.59 0-3.12.66-4.24 1.88A6.6 6.6 0 0 0 6 8.4c0 5.6-2.25 7.2-2.25 7.2h16.5S18 14 18 8.4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 19.2a1.86 1.86 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m20 20-4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChatIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5a8 8 0 0 1-8 8H8l-4 2v-4.34A8 8 0 1 1 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronLeftIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 5 8 12l7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m9 5 7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ className, size = 18 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** X (닫기/삭제) */
export function CloseIcon({ className, size = 18 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LocationIcon({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

/** 체크 표시 — Figma icon_check_regular */
export function CheckIcon({ className, size = 18 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5 10 17.5 19 6.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 휴지통 (채움) — Figma icon_trash_fill */
export function TrashIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9 3a1 1 0 0 0-.95.68L7.72 5H4.5a1 1 0 1 0 0 2h.62l.86 12.07A2 2 0 0 0 7.97 21h8.06a2 2 0 0 0 1.99-1.93L18.88 7h.62a1 1 0 1 0 0-2h-3.22l-.33-1.32A1 1 0 0 0 15 3H9Zm1.2 6a.8.8 0 0 1 .8.8v6a.8.8 0 0 1-1.6 0v-6a.8.8 0 0 1 .8-.8Zm3.6 0a.8.8 0 0 1 .8.8v6a.8.8 0 0 1-1.6 0v-6a.8.8 0 0 1 .8-.8Z" />
    </svg>
  );
}

/** 보내기 (종이비행기, 채움) — Figma lets-icons:send-fill */
export function SendIcon({ className, size = 30 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.4 3.06a1.2 1.2 0 0 0-1.66 1.4l1.7 5.9a1 1 0 0 0 .8.71l7.3 1.18a.25.25 0 0 1 0 .49l-7.3 1.18a1 1 0 0 0-.8.71l-1.7 5.9a1.2 1.2 0 0 0 1.66 1.4l15.9-7.9a1.2 1.2 0 0 0 0-2.16l-15.9-7.9Z" />
    </svg>
  );
}

/** 월간(칸이 넓은) 뷰 토글 아이콘 — Figma ri:layout-2-fill */
export function LayoutMonthIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 3V21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3H11ZM21 13V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21H13V13H21ZM20 3C20.2652 3 20.5196 3.10536 20.7071 3.29289C20.8946 3.48043 21 3.73478 21 4V11H13V3H20Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** 주간(세로 분할) 뷰 토글 아이콘 — Figma ri:layout-2-fill (2) */
export function LayoutWeekIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9.5 3V12V21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3H9.5ZM20 3C20.2652 3 20.5196 3.10536 20.7071 3.29289C20.8946 3.48043 21 3.73478 21 4V21L12 20.9998V2.99981L20 3Z"
        fill="currentColor"
      />
    </svg>
  );
}
