/**
 * Color Design Tokens
 * 피그마 파운데이션에서 추출한 컬러 토큰
 * 다크모드를 포함하여 모든 경우에 color를 토큰화하여 사용할 수 있도록 구성
 */

// Base Colors
export const base = {
  black: '#000000',
  white: '#FFFFFF',
} as const;

// Teal Colors (Brand)
export const teal = {
  50: '#EFFFFC',
  100: '#CDFEF6',
  200: '#B5FEF2',
  300: '#94FDEC',
  400: '#7FFDE8',
  500: '#5FFCE2',
  600: '#56E5CE',
  700: '#43B3A0',
  800: '#348B7C',
  900: '#286A5F',
} as const;

// Red Colors (Danger)
export const red = {
  50: '#FEEBEB',
  100: '#FBC0C0',
  200: '#F9A1A1',
  300: '#F77676',
  400: '#F55C5C',
  500: '#F33333',
  600: '#DD2E2E',
  700: '#AD2424',
  800: '#861C1C',
  900: '#661515',
} as const;

// Blue Colors (Info)
export const blue = {
  50: '#EBF3FE',
  100: '#C2D8FC',
  200: '#A5C6FB',
  300: '#7CABF9',
  400: '#629BF8',
  500: '#3B82F6',
  600: '#3676E0',
  700: '#2A5CAF',
  800: '#204887',
  900: '#193767',
} as const;

// Gray Colors (Neutral)
export const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#A9AFB9',
  500: '#747982',
  600: '#353A42',
  700: '#31323A',
  800: '#11121C',
  900: '#030712',
} as const;

// Green Colors (Success)
export const green = {
  50: '#ECFCF2',
  100: '#C5F7D7',
  200: '#A9F3C4',
  300: '#81EEA9',
  400: '#69EA98',
  500: '#43E57E',
  600: '#3DD073',
  700: '#30A359',
  800: '#257E45',
  900: '#1C6035',
} as const;

// Yellow Colors (Warning)
export const yellow = {
  50: '#FFF9E7',
  100: '#FFEBB5',
  200: '#FFE291',
  300: '#FFD45E',
  400: '#FFCC3F',
  500: '#FFBF0F',
  600: '#E8AE0E',
  700: '#B5880B',
  800: '#8C6908',
  900: '#6B5006',
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

// Semantic Colors - Background
export const bg = {
  light: {
    default: base.white,
    secondary: gray[50],
    tertiary: gray[100],
    disabled: gray[200],
    danger: red[50],
    dangerSubtle: red[100],
    info: blue[50],
    infoSubtle: blue[100],
    success: green[50],
    successSubtle: green[100],
    warning: yellow[50],
    warningSubtle: yellow[100],
    interactivePrimary: brand[50],
    interactivePrimaryHover: brand[100],
    interactivePrimaryPressed: brand[200],
    interactiveSecondary: gray[50],
    interactiveSecondaryHover: gray[100],
    interactiveSecondaryPressed: gray[200],
  },
  dark: {
    default: gray[900],
    secondary: gray[800],
    tertiary: gray[700],
    disabled: gray[600],
    danger: red[900],
    dangerSubtle: red[800],
    info: blue[900],
    infoSubtle: blue[800],
    success: green[900],
    successSubtle: green[800],
    warning: yellow[900],
    warningSubtle: yellow[800],
    interactivePrimary: brand[900],
    interactivePrimaryHover: brand[800],
    interactivePrimaryPressed: brand[700],
    interactiveSecondary: gray[800],
    interactiveSecondaryHover: gray[700],
    interactiveSecondaryPressed: gray[600],
  },
} as const;

// Semantic Colors - Border
export const border = {
  light: {
    primary: gray[300],
    secondary: gray[100],
    disabled: gray[400],
    danger: danger[600],
    dangerSubtle: danger[100],
    info: info[600],
    infoSubtle: info[100],
    success: success[600],
    successSubtle: success[100],
    warning: warning[600],
    warningSubtle: warning[100],
    focusRing: brand[600],
    interactivePrimary: brand[700],
    interactivePrimaryHover: brand[800],
    interactivePrimaryPressed: brand[900],
    interactiveSecondary: gray[400],
    interactiveSecondaryHover: gray[500],
    interactiveSecondaryPressed: gray[600],
  },
  dark: {
    primary: gray[500],
    secondary: gray[700],
    disabled: gray[700],
    danger: danger[400],
    dangerSubtle: danger[700],
    info: info[400],
    infoSubtle: info[700],
    success: success[400],
    successSubtle: success[700],
    warning: warning[400],
    warningSubtle: warning[700],
    focusRing: brand[400],
    interactivePrimary: brand[500],
    interactivePrimaryHover: brand[200],
    interactivePrimaryPressed: brand[100],
    interactiveSecondary: gray[400],
    interactiveSecondaryHover: gray[300],
    interactiveSecondaryPressed: gray[100],
  },
} as const;

// Semantic Colors - Icon
export const icon = {
  light: {
    primary: gray[900],
    secondary: gray[700],
    disabled: gray[400],
    danger: danger[600],
    info: info[600],
    success: success[600],
    warning: warning[600],
    interactivePrimary: brand[700],
    interactivePrimaryHover: brand[800],
    interactivePrimaryPressed: brand[900],
    interactiveSecondary: gray[700],
    interactiveSecondaryHover: gray[800],
    interactiveSecondaryPressed: gray[900],
    interactiveInverse: base.white,
    interactiveVisited: brand[700],
  },
  dark: {
    primary: base.white,
    secondary: gray[400],
    disabled: gray[700],
    danger: danger[400],
    info: info[400],
    success: success[400],
    warning: warning[400],
    interactivePrimary: brand[500],
    interactivePrimaryHover: brand[200],
    interactivePrimaryPressed: brand[100],
    interactiveSecondary: gray[400],
    interactiveSecondaryHover: gray[300],
    interactiveSecondaryPressed: gray[100],
    interactiveInverse: base.black,
    interactiveVisited: brand[400],
  },
} as const;

// Semantic Colors - Text
export const text = {
  light: {
    primary: gray[900],
    secondary: gray[700],
    tertiary: gray[600],
    disabled: gray[400],
    danger: danger[600],
    dangerBold: red[700],
    info: info[600],
    infoBold: info[700],
    success: success[600],
    successBold: success[700],
    warning: warning[600],
    warningBold: warning[800],
    interactivePrimary: brand[700],
    interactivePrimaryHover: brand[800],
    interactivePrimaryPressed: brand[900],
    interactiveSecondary: gray[700],
    interactiveSecondaryHover: gray[800],
    interactiveSecondaryPressed: gray[900],
    interactiveInverse: base.white,
    interactiveSelected: brand[600],
    interactiveVisited: brand[700],
  },
  dark: {
    primary: base.white,
    secondary: gray[100],
    tertiary: gray[200],
    disabled: gray[700],
    danger: danger[400],
    dangerBold: red[200],
    info: info[400],
    infoBold: info[200],
    success: success[400],
    successBold: success[200],
    warning: warning[400],
    warningBold: warning[200],
    interactivePrimary: brand[500],
    interactivePrimaryHover: brand[200],
    interactivePrimaryPressed: brand[100],
    interactiveSecondary: gray[400],
    interactiveSecondaryHover: gray[300],
    interactiveSecondaryPressed: gray[100],
    interactiveInverse: base.black,
    interactiveSelected: brand[500],
    interactiveVisited: brand[400],
  },
} as const;

// Shadow Colors - Light Mode (teal-400 based)
export const shadowLight = {
  subtle: '#7FFDE81F', // color/transparent/12 -> teal-400 12%
  default: '#7FFDE829', // color/transparent/16 -> teal-400 16%
  bold: '#7FFDE833', // color/transparent/20 -> teal-400 20%
  bolder: '#7FFDE83D', // color/transparent/24 -> teal-400 24%
} as const;

// Shadow Colors - Dark Mode (teal-400 based)
export const shadowDark = {
  subtle: '#7FFDE833', // color/transparent/20 -> teal-400 20%
  default: '#7FFDE83D', // color/transparent/24 -> teal-400 24%
  bold: '#7FFDE847', // color/transparent/28 -> teal-400 28%
  bolder: '#7FFDE852', // color/transparent/32 -> teal-400 32%
} as const;

// Shadow Colors (Mode-aware)
export const shadow = {
  light: shadowLight,
  dark: shadowDark,
} as const;

// Transparent Colors - Light Mode
export const transparentLight = {
  12: '#0000001F',
  16: '#00000029',
  20: '#00000033',
  24: '#0000003D',
} as const;

// Transparent Colors - Dark Mode
export const transparentDark = {
  20: '#00000033',
  24: '#0000003D',
  28: '#00000047',
  32: '#00000052',
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
  bg: bg.light,
  border: border.light,
  icon: icon.light,
  text: text.light,
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
  bg: bg.dark,
  border: border.dark,
  icon: icon.dark,
  text: text.dark,
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
  bg,
  border,
  icon,
  text,
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
export type BgColor = typeof bg;
export type BorderColor = typeof border;
export type IconColor = typeof icon;
export type TextColor = typeof text;
export type LightColor = typeof light;
export type DarkColor = typeof dark;
export type ColorToken = typeof color;
