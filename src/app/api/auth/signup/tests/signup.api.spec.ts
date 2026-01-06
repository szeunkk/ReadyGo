import { test, expect } from '@playwright/test';

test.describe('회원가입 API', () => {
  test('성공 시나리오: 회원가입 API 호출 성공', async ({ request }) => {
    // 실제 Supabase 사용 (모킹 금지)
    // 타임스탬프 기반 고유 이메일 생성
    const timestamp = Date.now();
    const email = `test-${timestamp}@gmail.com`;
    const password = 'test1234';

    // 회원가입 API 호출
    // network 통신이므로 2000ms 미만
    const response = await request.post('/api/auth/signup', {
      data: {
        email,
        password,
      },
      timeout: 2000,
    });

    // 응답 상태 확인
    expect(response.status()).toBe(200);

    // 응답 데이터 확인
    const data = await response.json();
    expect(data.user).toBeDefined();
    expect(data.user.id).toBeTruthy();
    expect(data.user.email).toBe(email);

    // 쿠키에 세션이 설정되었는지 확인
    const setCookieHeader = response.headers()['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    // set-cookie 헤더는 문자열 또는 문자열 배열일 수 있음
    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader
        ? [setCookieHeader]
        : [];
    // Supabase 세션 쿠키 확인 (sb- 접두사)
    const hasSessionCookie = cookies.some((cookie) => cookie.includes('sb-'));
    expect(hasSessionCookie).toBe(true);
  });

  test('실패 시나리오 1: 이미 등록된 이메일', async ({ request, _page }) => {
    // 먼저 실제 회원가입으로 계정 생성
    const timestamp = Date.now();
    const email = `test-${timestamp}@gmail.com`;
    const password = 'test1234';

    // 첫 번째 회원가입 (성공)
    await request.post('/api/auth/signup', {
      data: { email, password },
      timeout: 2000,
    });

    // 동일한 이메일로 다시 회원가입 시도 (실패)
    const response = await request.post('/api/auth/signup', {
      data: { email, password },
      timeout: 2000,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(data.error).toContain('이미 등록된 이메일');
  });

  test('실패 시나리오 2: 잘못된 이메일 형식', async ({ request }) => {
    const invalidEmail = 'invalid-email';
    const password = 'test1234';

    const response = await request.post('/api/auth/signup', {
      data: { email: invalidEmail, password },
      timeout: 2000,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test('실패 시나리오 3: 잘못된 비밀번호 형식', async ({ request }) => {
    const timestamp = Date.now();
    const email = `test-${timestamp}@gmail.com`;
    const invalidPassword = '123'; // 너무 짧은 비밀번호

    const response = await request.post('/api/auth/signup', {
      data: { email, password: invalidPassword },
      timeout: 2000,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test('실패 시나리오 4: 이메일 누락', async ({ request }) => {
    const response = await request.post('/api/auth/signup', {
      data: { password: 'test1234' },
      timeout: 2000,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(data.error).toContain('이메일과 비밀번호를 입력해주세요');
  });

  test('실패 시나리오 5: 비밀번호 누락', async ({ request }) => {
    const timestamp = Date.now();
    const email = `test-${timestamp}@gmail.com`;

    const response = await request.post('/api/auth/signup', {
      data: { email },
      timeout: 2000,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(data.error).toContain('이메일과 비밀번호를 입력해주세요');
  });

  test('실패 시나리오 6: API 서버 오류 모킹', async ({ page }) => {
    // Playwright route mocking 사용
    await page.route('**/api/auth/signup', async (route) => {
      // network 통신 모킹이므로 2000ms 미만
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
      });
    });

    const timestamp = Date.now();
    const email = `test-${timestamp}@gmail.com`;
    const password = 'test1234';

    // 페이지에서 API 호출 시도
    await page.goto('/signup', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="auth-signup-page"]', {
      timeout: 2000,
    });

    // 폼 입력
    await page.fill('[data-testid="signup-email-input"]', email, {
      timeout: 500,
    });
    await page.fill('[data-testid="signup-password-input"]', password, {
      timeout: 500,
    });
    await page.fill('[data-testid="signup-password-confirm-input"]', password, {
      timeout: 500,
    });

    // 버튼 활성화 대기
    await page.waitForFunction(
      (testId) => {
        const button = document.querySelector(
          `[data-testid="${testId}"]`
        ) as HTMLButtonElement;
        return button && !button.disabled;
      },
      'signup-submit-button',
      { timeout: 449, polling: 10 }
    );

    // 회원가입 버튼 클릭
    await page.click('[data-testid="signup-submit-button"]', {
      timeout: 500,
    });

    // 에러 모달 확인
    // network 통신 후 모달 표시이므로 2000ms 미만
    const errorModal = page.locator('text=가입실패');
    await expect(errorModal).toBeVisible({ timeout: 2000 });

    // 에러 메시지 확인
    const errorMessage = await page
      .locator('dialog p, [role="dialog"] p')
      .first()
      .textContent({ timeout: 500 });
    expect(errorMessage).toContain('서버 오류');
  });
});
