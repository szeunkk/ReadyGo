import { test, expect } from '@playwright/test';

test.describe('구글 OAuth 로그인', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test.skip('성공 시나리오: 구글 최초 로그인 시 초기 데이터 생성 및 회원가입 성공 페이지 이동', async ({
    page,
    context,
  }) => {
    // 실제 Supabase Auth 사용 (모킹 금지)
    // 주의: 이 테스트는 실제 구글 인증이 필요합니다.
    // 구글 로그인 버튼을 클릭하면 구글 인증 페이지로 리다이렉트되며,
    // 인증 완료 후 /home?code=... 형태로 리다이렉트됩니다.

    // 로그인 페이지로 이동
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 2000,
    });

    // 네트워크 요청 모니터링 시작
    const networkRequests: {
      url: string;
      method: string;
      status?: number;
      requestBody?: unknown;
      responseBody?: unknown;
    }[] = [];

    page.on('request', (request) => {
      const url = request.url();
      if (
        url.includes('/rest/v1/user_profiles') ||
        url.includes('/rest/v1/user_settings')
      ) {
        networkRequests.push({
          url,
          method: request.method(),
        });
      }
    });

    page.on('response', async (response) => {
      const url = response.url();
      const requestIndex = networkRequests.findIndex((r) => r.url === url);
      if (requestIndex !== -1) {
        networkRequests[requestIndex].status = response.status();
        try {
          networkRequests[requestIndex].responseBody = await response.json();
        } catch {
          // JSON 파싱 실패 시 무시
        }
      }
    });

    // 구글 로그인 버튼 클릭
    const googleButton = page.locator('[data-testid="login-google-button"]');

    // 버튼 클릭 시 새 창이 열릴 수 있으므로 Promise.all 사용
    const [_newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
      googleButton.click({ timeout: 500 }),
    ]);

    // 구글 인증 페이지로 리다이렉트되었는지 확인
    // 실제로는 현재 페이지가 구글 인증 페이지로 리다이렉트됩니다.
    // 또는 새 창이 열릴 수 있습니다.

    // 실제 구글 인증을 완료한 후 홈 페이지로 리다이렉트될 때까지 대기
    // OAuth 콜백은 /home?code=... 형태로 리다이렉트됩니다.
    // 주의: 실제 구글 인증을 완료해야 합니다.

    // 홈 페이지로 리다이렉트될 때까지 대기 (OAuth 콜백 처리)
    // 실제로는 구글 인증 후 자동으로 리다이렉트됩니다.
    await page.waitForURL(/.*\/home/, { timeout: 30000 }).catch(() => {
      // 리다이렉트가 안 되면 수동으로 홈 페이지로 이동
      // (실제 구글 인증을 완료한 후)
    });

    // OAuth 콜백 처리 대기 (useEffect에서 자동 처리)
    // 최초 로그인인 경우 초기 데이터 생성 및 회원가입 성공 페이지로 이동

    // 성공 페이지로 이동 확인 (data-testid 기반)
    // network 통신 후 페이지 이동이므로 10000ms 이하
    const successPageSelector = '[data-testid="auth-signup-success-page"]';
    const errorModalSelector = 'text=로그인실패';

    // 성공 페이지 또는 에러 모달 중 하나가 나타날 때까지 대기
    const result = await Promise.race([
      page
        .waitForSelector(successPageSelector, { timeout: 10000 })
        .then(() => 'success'),
      page
        .waitForSelector(errorModalSelector, { timeout: 10000 })
        .then(() => 'error')
        .catch(() => null),
    ]).catch(() => null);

    if (result === 'success') {
      // URL 확인
      await expect(page).toHaveURL(/.*signup-success/, { timeout: 500 });

      // 네트워크 요청 확인: user_profiles insert 요청이 있었는지 확인
      const profileInsertRequest = networkRequests.find(
        (r) =>
          r.url.includes('/rest/v1/user_profiles') &&
          r.method === 'POST' &&
          (r.status === 201 || r.status === 200)
      );
      expect(profileInsertRequest).toBeTruthy();

      // 네트워크 요청 확인: user_settings insert 요청이 있었는지 확인
      const settingsInsertRequest = networkRequests.find(
        (r) =>
          r.url.includes('/rest/v1/user_settings') &&
          r.method === 'POST' &&
          (r.status === 201 || r.status === 200)
      );
      expect(settingsInsertRequest).toBeTruthy();

      // localStorage에 user 정보가 저장되었는지 확인
      const userStr = await page.evaluate(() => {
        return localStorage.getItem('user');
      });
      expect(userStr).toBeTruthy();
      if (userStr) {
        const user = JSON.parse(userStr);
        expect(user.id).toBeTruthy();
        expect(user.email).toBeTruthy();
        expect(user._id).toBeTruthy();
        expect(user.name).toBeTruthy(); // 최초 로그인인 경우 nickname이 생성되어야 함
      }

      // localStorage에 accessToken이 저장되었는지 확인
      const accessToken = await page.evaluate(() => {
        return localStorage.getItem('accessToken');
      });
      expect(accessToken).toBeTruthy();
    } else if (result === 'error') {
      // 에러 모달이 표시된 경우
      let errorMessage = '';
      try {
        const paragraph = page.locator('dialog p, [role="dialog"] p').first();
        errorMessage = (await paragraph.textContent({ timeout: 500 })) || '';
        if (!errorMessage || errorMessage.trim() === '') {
          const modalText = await page
            .locator('text=로그인실패')
            .locator('..')
            .textContent({ timeout: 500 });
          errorMessage = modalText || '';
        }
      } catch {
        errorMessage = '알 수 없는 에러';
      }

      throw new Error(
        `구글 로그인 실패: ${errorMessage}. OAuth 설정을 확인하거나, 실제 구글 계정으로 로그인을 완료했는지 확인하세요.`
      );
    } else {
      throw new Error(
        '구글 로그인 후 회원가입 성공 페이지로 이동하지 않았고, 에러 모달도 표시되지 않았습니다. 네트워크 지연 또는 OAuth 설정 문제일 수 있습니다. 실제 구글 인증을 완료했는지 확인하세요.'
      );
    }
  });

  test.skip('실패 시나리오 1: user_profiles insert 실패', async ({ page }) => {
    // user_profiles insert 요청만 실패시키기
    await page.route('**/rest/v1/user_profiles**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Internal server error',
            code: 'PGRST500',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 로그인 페이지로 이동
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 2000,
    });

    // 구글 로그인 버튼 클릭
    const googleButton = page.locator('[data-testid="login-google-button"]');
    await googleButton.click({ timeout: 500 });

    // OAuth 콜백 시뮬레이션: 홈 페이지로 리다이렉트
    // 실제로는 구글 인증 후 /home?code=... 형태로 리다이렉트됩니다.
    await page.goto('/home?code=test-oauth-code', {
      waitUntil: 'domcontentloaded',
    });

    // 로그인실패모달 노출 확인
    const errorModalTitle = page.locator('text=로그인실패');
    await expect(errorModalTitle).toBeVisible({ timeout: 10000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 모달이 닫혔는지 확인
    await expect(errorModalTitle).not.toBeVisible({ timeout: 500 });

    // 페이지 이동 없음 확인 (에러 발생 시 홈 페이지에 머물러야 함)
    await expect(page).toHaveURL(/.*\/home/, { timeout: 500 });
  });

  test.skip('실패 시나리오 2: user_settings insert 실패', async ({ page }) => {
    // user_settings insert 요청만 실패시키기
    await page.route('**/rest/v1/user_settings**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Internal server error',
            code: 'PGRST500',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 로그인 페이지로 이동
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 2000,
    });

    // 구글 로그인 버튼 클릭
    const googleButton = page.locator('[data-testid="login-google-button"]');
    await googleButton.click({ timeout: 500 });

    // OAuth 콜백 시뮬레이션: 홈 페이지로 리다이렉트
    await page.goto('/home?code=test-oauth-code', {
      waitUntil: 'domcontentloaded',
    });

    // 로그인실패모달 노출 확인
    const errorModalTitle = page.locator('text=로그인실패');
    await expect(errorModalTitle).toBeVisible({ timeout: 10000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 모달이 닫혔는지 확인
    await expect(errorModalTitle).not.toBeVisible({ timeout: 500 });

    // 페이지 이동 없음 확인
    await expect(page).toHaveURL(/.*\/home/, { timeout: 500 });
  });
});
