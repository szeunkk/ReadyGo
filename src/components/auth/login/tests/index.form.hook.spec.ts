import { test, expect } from '@playwright/test';

test.describe('로그인 폼', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    // 페이지 로드 완료 대기 (data-testid 기반)
    // network 통신 후 페이지 로드이므로 2000ms 미만
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 2000,
    });
  });

  test.skip('성공 시나리오: 로그인 성공 후 localStorage 저장 및 홈페이지 이동', async ({
    page,
  }) => {
    // 실제 Supabase Auth 사용 (모킹 금지)
    const email = 'a@c.com';
    const password = '1234qwer';

    // 이메일 입력
    const emailInput = page.locator('[data-testid="login-email-input"]');
    await emailInput.clear({ timeout: 500 });
    await emailInput.type(email, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await emailInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    // React 상태 업데이트를 위한 짧은 대기 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    await emailInput.blur({ timeout: 500 });
    await emailInput.press('Tab', { timeout: 500 });

    // 비밀번호 입력
    const passwordInput = page.locator('[data-testid="login-password-input"]');
    await passwordInput.clear({ timeout: 500 });
    await passwordInput.type(password, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await passwordInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    // React 상태 업데이트를 위한 짧은 대기 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    await passwordInput.blur({ timeout: 500 });
    await passwordInput.press('Tab', { timeout: 500 });

    // 버튼이 활성화될 때까지 대기 (validation 완료 대기)
    // network 통신이 아닌 UI 상태 확인이므로 500ms 미만
    // React 상태 업데이트를 고려하여 폴링 방식으로 확인
    const loginButton = page.locator('[data-testid="login-submit-button"]');
    // React 상태 업데이트를 위해 짧은 대기 후 확인 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    // disabled 속성이 false가 될 때까지 대기 (최대 449ms, 총 499ms 미만)
    // 폴링 간격을 10ms로 줄여 더 빠르게 반응하도록 설정
    await page.waitForFunction(
      (testId) => {
        const button = document.querySelector(
          `[data-testid="${testId}"]`
        ) as HTMLButtonElement;
        return button && !button.disabled;
      },
      'login-submit-button',
      { timeout: 449, polling: 10 }
    );

    // 로그인 버튼 클릭
    await loginButton.click({ timeout: 500 });

    // 로그인완료모달 노출 확인
    // network 통신 후 모달 표시이므로 2000ms 미만
    const successModalTitle = page.locator('text=로그인완료');
    await expect(successModalTitle).toBeVisible({ timeout: 2000 });

    // localStorage에 accessToken이 저장되었는지 확인
    const accessToken = await page.evaluate(() => {
      return localStorage.getItem('accessToken');
    });
    expect(accessToken).toBeTruthy();

    // localStorage에 user가 저장되었는지 확인
    const userStr = await page.evaluate(() => {
      return localStorage.getItem('user');
    });
    expect(userStr).toBeTruthy();
    if (userStr) {
      const user = JSON.parse(userStr);
      expect(user.id).toBeTruthy();
      expect(user.email).toBeTruthy();
      // fetchUserLoggedIn API: _id, name이 정상적으로 반환되는지 확인
      expect(user._id).toBeTruthy();
      // name(nickname)은 null일 수 있으므로 존재 여부만 확인
      expect(user.hasOwnProperty('name')).toBe(true);
    }

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 모달이 닫혔는지 확인
    await expect(successModalTitle).not.toBeVisible({ timeout: 500 });

    // 홈페이지로 이동 확인
    // network 통신 후 페이지 이동이므로 2000ms 미만
    await expect(page).toHaveURL(/.*\/home/, { timeout: 2000 });
  });

  test.skip('실패 시나리오 1: 로그인 실패 (401 Unauthorized)', async ({ page }) => {
    // Supabase Auth 로그인 요청 모킹
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid login credentials',
        }),
      });
    });

    const email = 'test@example.com';
    const password = 'wrongpassword';

    // 폼 입력
    const emailInput = page.locator('[data-testid="login-email-input"]');
    await emailInput.clear({ timeout: 500 });
    await emailInput.type(email, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await emailInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    // React 상태 업데이트를 위한 짧은 대기 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    await emailInput.press('Tab', { timeout: 500 });

    const passwordInput = page.locator('[data-testid="login-password-input"]');
    await passwordInput.clear({ timeout: 500 });
    await passwordInput.type(password, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await passwordInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    // React 상태 업데이트를 위한 짧은 대기 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    await passwordInput.press('Tab', { timeout: 500 });

    // 버튼이 활성화될 때까지 대기 (validation 완료 대기)
    // network 통신이 아닌 UI 상태 확인이므로 500ms 미만
    // React 상태 업데이트를 고려하여 폴링 방식으로 확인
    const loginButton = page.locator('[data-testid="login-submit-button"]');
    // React 상태 업데이트를 위해 짧은 대기 후 확인 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    // disabled 속성이 false가 될 때까지 대기 (최대 449ms, 총 499ms 미만)
    // 폴링 간격을 10ms로 줄여 더 빠르게 반응하도록 설정
    await page.waitForFunction(
      (testId) => {
        const button = document.querySelector(
          `[data-testid="${testId}"]`
        ) as HTMLButtonElement;
        return button && !button.disabled;
      },
      'login-submit-button',
      { timeout: 449, polling: 10 }
    );

    // 로그인 버튼 클릭
    await loginButton.click({ timeout: 500 });

    // 로그인실패모달 노출 확인
    // network 통신 후 모달 표시이므로 2000ms 미만
    const errorModalTitle = page.locator('text=로그인실패');
    await expect(errorModalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 모달이 닫혔는지 확인 (모달이 사라질 때까지 대기)
    await expect(errorModalTitle).not.toBeVisible({ timeout: 500 });

    // 페이지 이동 없음 확인
    await expect(page).toHaveURL(/.*\/login/, { timeout: 500 });

    // 동일 실패 상태에서 재렌더링되어도 모달이 다시 자동으로 열리지 않는지 확인
    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 2000,
    });

    // 모달이 자동으로 열리지 않았는지 확인
    const isModalVisible = await page
      .locator('text=로그인실패')
      .isVisible({ timeout: 500 })
      .catch(() => false);
    expect(isModalVisible).toBe(false);
  });

  test.skip('실패 시나리오 2: 로그인 실패 (400 Bad Request)', async ({ page }) => {
    // Supabase Auth 로그인 요청 모킹
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'invalid_request',
          error_description: 'Invalid request parameters',
        }),
      });
    });

    const email = 'invalid-email';
    const password = 'test1234';

    // 폼 입력
    const emailInput = page.locator('[data-testid="login-email-input"]');
    await emailInput.clear({ timeout: 500 });
    await emailInput.type(email, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await emailInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    // React 상태 업데이트를 위한 짧은 대기 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    await emailInput.press('Tab', { timeout: 500 });

    const passwordInput = page.locator('[data-testid="login-password-input"]');
    await passwordInput.clear({ timeout: 500 });
    await passwordInput.type(password, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await passwordInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    // React 상태 업데이트를 위한 짧은 대기 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    await passwordInput.press('Tab', { timeout: 500 });

    // 버튼이 활성화될 때까지 대기 (validation 완료 대기)
    // network 통신이 아닌 UI 상태 확인이므로 500ms 미만
    // React 상태 업데이트를 고려하여 폴링 방식으로 확인
    const loginButton = page.locator('[data-testid="login-submit-button"]');
    // React 상태 업데이트를 위해 짧은 대기 후 확인 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    // disabled 속성이 false가 될 때까지 대기 (최대 449ms, 총 499ms 미만)
    // 폴링 간격을 10ms로 줄여 더 빠르게 반응하도록 설정
    await page.waitForFunction(
      (testId) => {
        const button = document.querySelector(
          `[data-testid="${testId}"]`
        ) as HTMLButtonElement;
        return button && !button.disabled;
      },
      'login-submit-button',
      { timeout: 449, polling: 10 }
    );

    // 로그인 버튼 클릭
    await loginButton.click({ timeout: 500 });

    // 로그인실패모달 노출 확인
    // network 통신 후 모달 표시이므로 2000ms 미만
    const errorModalTitle = page.locator('text=로그인실패');
    await expect(errorModalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 모달이 닫혔는지 확인 (모달이 사라질 때까지 대기)
    await expect(errorModalTitle).not.toBeVisible({ timeout: 500 });

    // 페이지 이동 없음 확인
    await expect(page).toHaveURL(/.*\/login/, { timeout: 500 });

    // 동일 실패 상태에서 재렌더링되어도 모달이 다시 자동으로 열리지 않는지 확인
    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 2000,
    });

    // 모달이 자동으로 열리지 않았는지 확인
    const isModalVisible = await page
      .locator('text=로그인실패')
      .isVisible({ timeout: 500 })
      .catch(() => false);
    expect(isModalVisible).toBe(false);
  });
});

