/**
 * 프로필 이미지 매핑.
 *
 * public/avatars/01.png ~ 42.png (원형 프로필 사진 42장).
 * 명단(PEOPLE)은 42명보다 많으므로, 최근검색·검색 상단 등 "먼저 노출되는"
 * 앞쪽 인원부터 1:1로 프로필을 배정하고, 나머지는 회색 폴백으로 둔다.
 */
import { PEOPLE } from "./people";

export const AVATARS: string[] = Array.from(
  { length: 42 },
  (_, i) => `/avatars/${String(i + 1).padStart(2, "0")}.png`,
);

// 이름 → 프로필 경로 (앞쪽 42명만). 42명을 넘으면 매핑이 없어 회색으로 남는다.
const byName = new Map<string, string>();
PEOPLE.slice(0, AVATARS.length).forEach((name, i) => byName.set(name, AVATARS[i]));

/** 이름에 배정된 프로필 경로 (없으면 null → 회색) */
export function avatarFor(name: string): string | null {
  return byName.get(name) ?? null;
}

/** 이름이 없는 아바타 그룹(아젠다 +N 등)용 — 인덱스로 순환 배정 */
export function avatarByIndex(i: number): string {
  return AVATARS[((i % AVATARS.length) + AVATARS.length) % AVATARS.length];
}
