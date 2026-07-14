/** @type {import('tailwindcss').Config} */
export default {
  // admin-proto 만 스캔 → 공개 사이트(App.jsx)엔 Tailwind 클래스 미생성
  content: ["./src/admin-proto.jsx"],
  // 모든 유틸을 .sd-admin 하위로 스코프 + 특이도 상향 → (1) 공개 사이트 무영향
  // (2) admin-proto.css 스코프 리셋(.sd-admin button 등)보다 유틸이 우선
  important: ".sd-admin",
  // preflight(전역 리셋) 비활성. 어드민은 admin-proto.css 스코프 리셋 사용
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
};
