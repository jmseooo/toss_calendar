import { avatarFor } from "@/data/avatars";

import type { CSSProperties } from "react";

interface AvatarProps {
  /** 참석자 이름 — 배정된 프로필이 있으면 그 사진을 쓴다 */
  name?: string;
  /** 직접 지정하는 프로필 경로 (이름 없는 아바타 그룹 등) */
  src?: string | null;
  /** 크기·여백 등 추가 클래스 (예: "size-[30px]") */
  className?: string;
  /** 겹침 여백 등 인라인 스타일 (배경 이미지와 병합된다) */
  style?: CSSProperties;
}

/**
 * 원형 프로필 아바타.
 * 배정된 프로필이 있으면 사진을, 없으면 회색 원을 보여준다.
 * (기존 `bg-gray-600 rounded-full` 자리표시자를 대체)
 */
export default function Avatar({ name, src, className = "", style }: AvatarProps) {
  const url = src ?? (name ? avatarFor(name) : null);
  return (
    <span
      aria-hidden
      className={`shrink-0 rounded-full bg-gray-400 bg-cover bg-center ${className}`}
      style={{ ...(url ? { backgroundImage: `url('${url}')` } : {}), ...style }}
    />
  );
}
