/**
 * 완료 화면 배경의 소프트 원 글로우 (Figma Ellipse 2980).
 * #FF9364 반투명 원에 블러를 준 에셋(public/completion-glow.svg)을 상단 중앙에 깐다.
 * 부모 오버레이는 `isolate overflow-hidden`, 이 요소는 -z-10 이라 콘텐츠 뒤에 놓인다.
 * (Figma 기준: 원 지름 1655px, 상단 86px, 가로 중앙)
 */
export default function CompletionGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[86px] -z-10 size-[1655px] max-w-none -translate-x-1/2 bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/completion-glow.svg')" }}
    />
  );
}
