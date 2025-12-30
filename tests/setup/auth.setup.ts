import { test as setup } from '@playwright/test';
import path from 'path';

/**
 * 인증 설정 파일
 * 모든 테스트 전에 한 번만 실행되어 로그인 상태를 생성합니다.
 *
 * 환경 변수 요구사항:
 * - TEST_USER_EMAIL: 테스트용 사용자 이메일
 * - TEST_USER_PASSWORD: 테스트용 사용자 비밀번호
 */

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ page }) => {
  // 환경 변수에서 테스트 계정 정보 가져오기
  const testEmail = process.env.TEST_USER_EMAIL;
  const testPassword = process.env.TEST_USER_PASSWORD;

  if (!testEmail || !testPassword) {
    throw new Error(
      'TEST_USER_EMAIL 및 TEST_USER_PASSWORD 환경 변수가 필요합니다.'
    );
  }

  // 1. 로그인 페이지로 이동
  await page.goto('http://localhost:3000/login');
  console.log('[Auth Setup] 로그인 페이지 이동 완료');

  // 2. 로그인 폼 대기
  await page.waitForSelector('[data-testid="login-email-input"]', {
    timeout: 10000,
  });
  console.log('[Auth Setup] 로그인 폼 로드 완료');

  // 3. 이메일 입력
  await page.fill('[data-testid="login-email-input"]', testEmail);
  console.log('[Auth Setup] 이메일 입력 완료');

  // 4. 비밀번호 입력
  await page.fill('[data-testid="login-password-input"]', testPassword);
  console.log('[Auth Setup] 비밀번호 입력 완료');

  // 5. 폼 검증 완료 대기
  await page.waitForTimeout(500);

  // 6. 로그인 버튼 클릭
  await page.click('[data-testid="login-submit-button"]');
  console.log('[Auth Setup] 로그인 버튼 클릭');

  // 7. 로그인 완료 대기 (URL 변경 또는 특정 요소 확인)
  try {
    // 방법 1: URL이 /login이 아닌 곳으로 이동했는지 확인
    await page.waitForURL((url) => !url.pathname.includes('/login'), {
      timeout: 15000,
    });
    console.log('[Auth Setup] ✓ 로그인 성공 - URL 변경 확인');
  } catch {
    // 방법 2: 특정 시간 대기 후 쿠키 확인
    await page.waitForTimeout(3000);

    // 쿠키 확인
    const cookies = await page.context().cookies();
    const hasAuthCookie = cookies.some(
      (cookie) =>
        cookie.name.includes('auth') ||
        cookie.name.includes('session') ||
        cookie.name.includes('token')
    );

    if (hasAuthCookie) {
      console.log('[Auth Setup] ✓ 로그인 성공 - 인증 쿠키 확인');
    } else {
      console.warn('[Auth Setup] ⚠ 인증 쿠키가 확인되지 않음');
    }
  }

  // 8. 인증 상태 저장 (쿠키 + localStorage 모두 포함)
  await page.context().storageState({ path: authFile });
  console.log('[Auth Setup] 인증 상태 저장 완료:', authFile);

  // 9. 저장된 쿠키 확인 (디버깅용)
  const savedCookies = await page.context().cookies();
  console.log('[Auth Setup] 저장된 쿠키 개수:', savedCookies.length);
  savedCookies.forEach((cookie) => {
    console.log(`  - ${cookie.name} (httpOnly: ${cookie.httpOnly})`);
  });
});
