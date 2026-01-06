import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 미들웨어
 *
 * 현재는 특별한 처리가 필요하지 않음
 * OAuth 콜백은 루트 레이아웃의 OAuthCallbackHandler 컴포넌트에서 처리
 */
export const middleware = function (_request: NextRequest) {
  return NextResponse.next();
};

export const config = {
  matcher: '/',
};
