/**
 * Color Design Tokens
 * 피그마 파운데이션에서 추출한 컬러 토큰
 * 다크모드를 포함하여 모든 경우에 color를 토큰화하여 사용할 수 있도록 구성
 */

// Base Colors
export const base = {
  black: "#000000",
  white: "#FFFFFF",
} as const;

// Teal Colors (Brand)
export const teal = {
  50: "#EFFFFC",
  100: "#CDFEF6",
  200: "#B5FEF2",
  300: "#94FDEC",
  400: "#7FFDE8",
  500: "#5FFCE2",
  600: "#56E5CE",
  700: "#43B3A0",
  800: "#348B7C",
  900: "#286A5F",
} as const;

// Red Colors (Danger)
export const red = {
  50: "#FEEBEB",
  100: "#FBC0C0",
  200: "#F9A1A1",
  300: "#F77676",
  400: "#F55C5C",
  500: "#F33333",
  600: "#DD2E2E",
  700: "#AD2424",
  800: "#861C1C",
  900: "#661515",
} as const;

// Blue Colors (Info)
export const blue = {
  50: "#EBF3FE",
  100: "#C2D8FC",
  200: "#A5C6FB",
  300: "#7CABF9",
  400: "#629BF8",
  500: "#3B82F6",
  600: "#3676E0",
  700: "#2A5CAF",
  800: "#204887",
  900: "#193767",
} as const;

// Gray Colors (Neutral)
export const gray = {
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DB",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#030712",
} as const;

// Green Colors (Success)
export const green = {
  50: "#ECFCF2",
  100: "#C5F7D7",
  200: "#A9F3C4",
  300: "#81EEA9",
  400: "#69EA98",
  500: "#43E57E",
  600: "#3DD073",
  700: "#30A359",
  800: "#257E45",
  900: "#1C6035",
} as const;

// Yellow Colors (Warning)
export const yellow = {
  50: "#FFF9E7",
  100: "#FFEBB5",
  200: "#FFE291",
  300: "#FFD45E",
  400: "#FFCC3F",
  500: "#FFBF0F",
  600: "#E8AE0E",
  700: "#B5880B",
  800: "#8C6908",
  900: "#6B5006",
} as const;

// Semantic Colors - Brand
export const brand = {
  50: teal[50],
  100: teal[100],
  200: teal[200],
  400: teal[400],
  500: teal[500],
  600: teal[600],
  700: teal[700],
  800: teal[800],
  900: teal[900],
} as const;

// Semantic Colors - Danger
export const danger = {
  50: red[50],
  100: red[100],
  300: red[300],
  400: red[400],
  500: red[500],
  600: red[600],
  700: red[700],
  800: red[800],
} as const;

// Semantic Colors - Info
export const info = {
  50: blue[50],
  100: blue[100],
  200: blue[200],
  300: blue[300],
  400: blue[400],
  600: blue[600],
  700: blue[700],
  800: blue[800],
} as const;

// Semantic Colors - Neutral
export const neutral = {
  50: gray[50],
  100: gray[100],
  200: gray[200],
  300: gray[300],
  400: gray[400],
  500: gray[500],
  600: gray[600],
  700: gray[700],
  800: gray[800],
  900: gray[900],
} as const;

// Semantic Colors - Success
export const success = {
  50: green[50],
  100: green[100],
  200: green[200],
  300: green[300],
  400: green[400],
  600: green[600],
  700: green[700],
  800: green[800],
} as const;

// Semantic Colors - Warning
export const warning = {
  50: yellow[50],
  100: yellow[100],
  200: yellow[200],
  300: yellow[300],
  400: yellow[400],
  600: yellow[600],
  700: yellow[700],
  800: yellow[800],
} as const;

// Shadow Colors - Light Mode
export const shadowLight = {
  subtle: "#0000001F", // color/transparent/12
  default: "#00000029", // color/transparent/16
  bold: "#00000033", // color/transparent/20
  bolder: "#0000003D", // color/transparent/24
} as const;

// Shadow Colors - Dark Mode
export const shadowDark = {
  subtle: "#00000033", // color/transparent/20
  default: "#0000003D", // color/transparent/24
  bold: "#00000047", // color/transparent/28
  bolder: "#00000052", // color/transparent/32
} as const;

// Shadow Colors (Mode-aware)
export const shadow = {
  light: shadowLight,
  dark: shadowDark,
} as const;

// Transparent Colors - Light Mode
export const transparentLight = {
  12: "#0000001F",
  16: "#00000029",
  20: "#00000033",
  24: "#0000003D",
} as const;

// Transparent Colors - Dark Mode
export const transparentDark = {
  20: "#00000033",
  24: "#0000003D",
  28: "#00000047",
  32: "#00000052",
} as const;

// Transparent Colors (Mode-aware)
export const transparent = {
  light: transparentLight,
  dark: transparentDark,
} as const;

// Color Tokens by Mode
export const light = {
  base,
  teal,
  red,
  blue,
  gray,
  green,
  yellow,
  brand,
  danger,
  info,
  neutral,
  success,
  warning,
  shadow: shadowLight,
  transparent: transparentLight,
} as const;

export const dark = {
  base,
  teal,
  red,
  blue,
  gray,
  green,
  yellow,
  brand,
  danger,
  info,
  neutral,
  success,
  warning,
  shadow: shadowDark,
  transparent: transparentDark,
} as const;

// Color Tokens Export
export const color = {
  base,
  teal,
  red,
  blue,
  gray,
  green,
  yellow,
  brand,
  danger,
  info,
  neutral,
  success,
  warning,
  shadow,
  transparent,
  light,
  dark,
} as const;

// Type Definitions
export type BaseColor = typeof base;
export type TealColor = typeof teal;
export type RedColor = typeof red;
export type BlueColor = typeof blue;
export type GrayColor = typeof gray;
export type GreenColor = typeof green;
export type YellowColor = typeof yellow;
export type BrandColor = typeof brand;
export type DangerColor = typeof danger;
export type InfoColor = typeof info;
export type NeutralColor = typeof neutral;
export type SuccessColor = typeof success;
export type WarningColor = typeof warning;
export type ShadowColor = typeof shadow;
export type TransparentColor = typeof transparent;
export type LightColor = typeof light;
export type DarkColor = typeof dark;
export type ColorToken = typeof color;
