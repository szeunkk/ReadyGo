import { test, expect } from '@playwright/test';

test.describe('OAuth 로그인', () => {
  test.describe('Google OAuth', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testid="auth-login-page"]', {
        timeout: 2000,
      });
    });

    test.skip('신규 유저: Google OAuth 로그인 후 회원가입 성공 페이지 이동', async ({
      page,
    }) => {
      // 실제 Supabase Auth 사용 (모킹 금지)
      // 주의: 이 테스트는 실제 Google 인증이 필요합니다.
      // OAuth 콜백은 /api/auth/oauth/callback에서 서버 사이드로 처리됩니다.

      // OAuth 콜백 API 호출 대기
      const callbackApiPromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/auth/oauth/callback') &&
          response.status() === 307, // 리다이렉트
        { timeout: 2000 }
      );

      // Google 로그인 버튼 클릭
      const googleButton = page.locator('[data-testid="login-google-button"]');
      await googleButton.click({ timeout: 500 });

      // Google 인증 페이지로 리다이렉트 대기
      await page.waitForURL(/.*accounts\.google\.com.*/, { timeout: 2000 });

      // 실제 Google 인증을 완료한 후 콜백 API로 리다이렉트될 때까지 대기
      // 주의: 실제 Google 인증을 완료해야 합니다.
      await callbackApiPromise.catch(() => {
        // 콜백이 호출되지 않은 경우 (실제 인증 미완료)
      });

      // 회원가입 성공 페이지로 리다이렉트 확인 (신규 유저)
      await page.waitForURL(/.*\/signup-success/, { timeout: 2000 });

      // 세션 동기화 확인
      const syncSessionApiPromise = page
        .waitForResponse(
          (response) =>
            response.url().includes('/api/auth/session') &&
            response.request().method() === 'GET',
          { timeout: 2000 }
        )
        .catch(() => null);

      // 성공 페이지 표시 확인
      await page.waitForSelector('[data-testid="auth-signup-success-page"]', {
        timeout: 2000,
      });

      // syncSession 호출 확인
      if (syncSessionApiPromise) {
        await syncSessionApiPromise;
      }

      // 쿠키에 세션이 설정되었는지 확인
      const cookies = await page.context().cookies();
      const hasSessionCookie = cookies.some((cookie) =>
        cookie.name.includes('sb-')
      );
      expect(hasSessionCookie).toBe(true);
    });

    test.skip('기존 유저: Google OAuth 로그인 후 홈 페이지 이동', async ({
      page,
    }) => {
      // 실제 Supabase Auth 사용 (모킹 금지)
      // 주의: 이미 user_profiles 레코드가 존재하는 Google 계정으로 로그인해야 합니다.

      // OAuth 콜백 API 호출 대기
      const callbackApiPromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/auth/oauth/callback') &&
          response.status() === 307, // 리다이렉트
        { timeout: 2000 }
      );

      // Google 로그인 버튼 클릭
      const googleButton = page.locator('[data-testid="login-google-button"]');
      await googleButton.click({ timeout: 500 });

      // Google 인증 페이지로 리다이렉트 대기
      await page.waitForURL(/.*accounts\.google\.com.*/, { timeout: 2000 });

      // 실제 Google 인증을 완료한 후 콜백 API로 리다이렉트될 때까지 대기
      await callbackApiPromise.catch(() => {
        // 콜백이 호출되지 않은 경우 (실제 인증 미완료)
      });

      // 홈 페이지로 리다이렉트 확인 (기존 유저)
      await page.waitForURL(/.*\/home/, { timeout: 2000 });

      // 세션 동기화 확인
      const syncSessionApiPromise = page
        .waitForResponse(
          (response) =>
            response.url().includes('/api/auth/session') &&
            response.request().method() === 'GET',
          { timeout: 2000 }
        )
        .catch(() => null);

      // syncSession 호출 확인
      if (syncSessionApiPromise) {
        await syncSessionApiPromise;
      }

      // 쿠키에 세션이 설정되었는지 확인
      const cookies = await page.context().cookies();
      const hasSessionCookie = cookies.some((cookie) =>
        cookie.name.includes('sb-')
      );
      expect(hasSessionCookie).toBe(true);
    });

    test('실패 시나리오: OAuth 콜백 API 오류', async ({ page }) => {
      // OAuth 콜백 API 모킹 (리다이렉트 시뮬레이션)
      await page.route('**/api/auth/oauth/callback*', async (route) => {
        const error = 'OAuth 처리 중 오류가 발생했습니다.';
        const loginUrl = `http://localhost:3000/login?error=${encodeURIComponent(error)}`;
        await route.fulfill({
          status: 307,
          headers: {
            Location: loginUrl,
          },
        });
      });

      // OAuth 콜백 시뮬레이션: code 파라미터와 함께 콜백 URL로 이동
      await page.goto('/api/auth/oauth/callback?code=test-oauth-code', {
        waitUntil: 'domcontentloaded',
      });

      // 로그인 페이지로 리다이렉트 확인 (에러 처리)
      await page.waitForURL(/.*\/login/, { timeout: 2000 });

      // 에러 메시지 확인
      const url = page.url();
      expect(url).toContain('error');
    });
  });

  test.describe('Kakao OAuth', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testid="auth-login-page"]', {
        timeout: 2000,
      });
    });

    test.skip('신규 유저: Kakao OAuth 로그인 후 회원가입 성공 페이지 이동', async ({
      page,
    }) => {
      // 실제 Supabase Auth 사용 (모킹 금지)
      // 주의: 이 테스트는 실제 Kakao 인증이 필요합니다.

      // OAuth 콜백 API 호출 대기
      const callbackApiPromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/auth/oauth/callback') &&
          response.status() === 307, // 리다이렉트
        { timeout: 2000 }
      );

      // Kakao 로그인 버튼 클릭
      const kakaoButton = page.locator('[data-testid="login-kakao-button"]');
      await kakaoButton.click({ timeout: 500 });

      // Kakao 인증 페이지로 리다이렉트 대기
      await page.waitForURL(/.*kauth\.kakao\.com.*/, { timeout: 2000 });

      // 실제 Kakao 인증을 완료한 후 콜백 API로 리다이렉트될 때까지 대기
      await callbackApiPromise.catch(() => {
        // 콜백이 호출되지 않은 경우 (실제 인증 미완료)
      });

      // 회원가입 성공 페이지로 리다이렉트 확인 (신규 유저)
      await page.waitForURL(/.*\/signup-success/, { timeout: 2000 });

      // 세션 동기화 확인
      const syncSessionApiPromise = page
        .waitForResponse(
          (response) =>
            response.url().includes('/api/auth/session') &&
            response.request().method() === 'GET',
          { timeout: 2000 }
        )
        .catch(() => null);

      // 성공 페이지 표시 확인
      await page.waitForSelector('[data-testid="auth-signup-success-page"]', {
        timeout: 2000,
      });

      // syncSession 호출 확인
      if (syncSessionApiPromise) {
        await syncSessionApiPromise;
      }

      // 쿠키에 세션이 설정되었는지 확인
      const cookies = await page.context().cookies();
      const hasSessionCookie = cookies.some((cookie) =>
        cookie.name.includes('sb-')
      );
      expect(hasSessionCookie).toBe(true);
    });

    test.skip('기존 유저: Kakao OAuth 로그인 후 홈 페이지 이동', async ({
      page,
    }) => {
      // 실제 Supabase Auth 사용 (모킹 금지)
      // 주의: 이미 user_profiles 레코드가 존재하는 Kakao 계정으로 로그인해야 합니다.

      // OAuth 콜백 API 호출 대기
      const callbackApiPromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/auth/oauth/callback') &&
          response.status() === 307, // 리다이렉트
        { timeout: 2000 }
      );

      // Kakao 로그인 버튼 클릭
      const kakaoButton = page.locator('[data-testid="login-kakao-button"]');
      await kakaoButton.click({ timeout: 500 });

      // Kakao 인증 페이지로 리다이렉트 대기
      await page.waitForURL(/.*kauth\.kakao\.com.*/, { timeout: 2000 });

      // 실제 Kakao 인증을 완료한 후 콜백 API로 리다이렉트될 때까지 대기
      await callbackApiPromise.catch(() => {
        // 콜백이 호출되지 않은 경우 (실제 인증 미완료)
      });

      // 홈 페이지로 리다이렉트 확인 (기존 유저)
      await page.waitForURL(/.*\/home/, { timeout: 2000 });

      // 세션 동기화 확인
      const syncSessionApiPromise = page
        .waitForResponse(
          (response) =>
            response.url().includes('/api/auth/session') &&
            response.request().method() === 'GET',
          { timeout: 2000 }
        )
        .catch(() => null);

      // syncSession 호출 확인
      if (syncSessionApiPromise) {
        await syncSessionApiPromise;
      }

      // 쿠키에 세션이 설정되었는지 확인
      const cookies = await page.context().cookies();
      const hasSessionCookie = cookies.some((cookie) =>
        cookie.name.includes('sb-')
      );
      expect(hasSessionCookie).toBe(true);
    });

    test('실패 시나리오: OAuth 콜백 API 오류', async ({ page }) => {
      // OAuth 콜백 API 모킹 (리다이렉트 시뮬레이션)
      await page.route('**/api/auth/oauth/callback*', async (route) => {
        const error = 'OAuth 처리 중 오류가 발생했습니다.';
        const loginUrl = `http://localhost:3000/login?error=${encodeURIComponent(error)}`;
        await route.fulfill({
          status: 307,
          headers: {
            Location: loginUrl,
          },
        });
      });

      // OAuth 콜백 시뮬레이션: code 파라미터와 함께 콜백 URL로 이동
      await page.goto('/api/auth/oauth/callback?code=test-oauth-code', {
        waitUntil: 'domcontentloaded',
      });

      // 로그인 페이지로 리다이렉트 확인 (에러 처리)
      await page.waitForURL(/.*\/login/, { timeout: 2000 });

      // 에러 메시지 확인
      const url = page.url();
      expect(url).toContain('error');
    });
  });
});
