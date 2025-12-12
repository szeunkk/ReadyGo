/**
 * Typography Design Tokens
 * 피그마 파운데이션에서 추출한 타이포그래피 토큰
 * 모바일과 데스크톱이 분기될 수 있도록 구성
 * 추후 영문 typography는 다른 값을 사용할 수 있도록 구성
 */

// Font Families
export const fontFamily = {
  korean: {
    default:
      "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    code: "Source Code Pro, 'Courier New', monospace",
  },
  english: {
    default:
      "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif", // 추후 변경 가능
    code: "Source Code Pro, 'Courier New', monospace",
  },
} as const;

// Font Weights
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Typography Scale - Desktop
export const desktop = {
  // Headings
  "heading/4xl": {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: fontWeight.bold,
    letterSpacing: 0,
  },
  "heading/3xl": {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "heading/2xl": {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "heading/xl": {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "heading/lg": {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "heading/md": {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "heading/sm": {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  // Body
  "body/lg": {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  },
  "body/lg/semibold": {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "body/lg/medium": {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
  },
  "body/md": {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  },
  "body/md/semibold": {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "body/md/medium": {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
  },
  "body/md/underline": {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
    textDecoration: "underline",
  },
  "body/md/encode": {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
    fontFamily: fontFamily.korean.code,
  },
  "body/sm": {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  },
  "body/sm/medium": {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
  },
} as const;

// Typography Scale - Mobile
export const mobile = {
  // Headings
  "heading/4xl": {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: fontWeight.bold,
    letterSpacing: 0,
  },
  "heading/3xl": {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "heading/2xl": {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: fontWeight.bold,
    letterSpacing: 0,
  },
  "heading/xl": {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "heading/lg": {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "heading/md": {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  "heading/sm": {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  },
  // Body (모바일과 데스크톱 동일)
  "body/lg": desktop["body/lg"],
  "body/lg/semibold": desktop["body/lg/semibold"],
  "body/lg/medium": desktop["body/lg/medium"],
  "body/md": desktop["body/md"],
  "body/md/semibold": desktop["body/md/semibold"],
  "body/md/medium": desktop["body/md/medium"],
  "body/md/underline": desktop["body/md/underline"],
  "body/md/encode": desktop["body/md/encode"],
  "body/sm": desktop["body/sm"],
  "body/sm/medium": desktop["body/sm/medium"],
} as const;

// Typography Tokens Export
export const typography = {
  fontFamily,
  fontWeight,
  desktop,
  mobile,
} as const;

// Type Definitions
export type FontFamily = typeof fontFamily;
export type FontWeight = typeof fontWeight;
export type TypographyScale = typeof desktop;
export type DesktopTypography = typeof desktop;
export type MobileTypography = typeof mobile;
export type TypographyToken = typeof typography;
