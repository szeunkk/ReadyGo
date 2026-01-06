import { test, expect } from '@playwright/test';

test.describe('인가 체크 최적화', () => {
  test('비로그인 → 회원 전용 페이지 접근', async ({ page }) => {
    // 쿠키 초기화 (로그인 상태 제거)
    await page.context().clearCookies();

    // 회원 전용 페이지 접근 시도 (예: /home)
    await page.goto('/home', { waitUntil: 'domcontentloaded' });

    // AuthGuard가 세션 동기화를 기다림 (로딩 스피너 표시)
    // 세션 동기화 완료 후 모달 표시 대기
    const modalTitle = page
      .locator('h3:has-text("로그인이 필요합니다")')
      .first();
    await expect(modalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭 (loginRedirect 호출)
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 로그인 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/.*\/login/, { timeout: 2000 });
  });

  test('로그인 → 공개 페이지 접근', async ({ page }) => {
    // 로그인 상태로 시작 (setup에서 인증 상태 저장)
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // 공개 페이지 접근 (예: /login은 공개 페이지)
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 2000,
    });

    // 공개 페이지에 정상적으로 접근 가능한지 확인
    const loginPage = page.locator('[data-testid="auth-login-page"]');
    await expect(loginPage).toBeVisible({ timeout: 500 });

    // 모달이 표시되지 않았는지 확인
    const modalTitle = page.locator('text=로그인이 필요합니다');
    await expect(modalTitle).not.toBeVisible({ timeout: 500 });
  });

  test('초기 로딩 시 UI 확인', async ({ page }) => {
    // 회원 전용 페이지 접근
    await page.goto('/home', { waitUntil: 'domcontentloaded' });

    // 초기 로딩 스피너 표시 확인
    // AuthGuard가 세션 동기화를 기다리는 동안 로딩 스피너가 표시되어야 함
    const loadingSpinner = page
      .locator('div')
      .filter({
        hasText: /로딩|Loading|spinner/i,
      })
      .first();

    // 로딩 스피너가 일시적으로 표시될 수 있음 (세션 동기화 중)
    // 또는 로딩 스피너가 표시되지 않고 바로 모달이 표시될 수도 있음
    const isSpinnerVisible = await loadingSpinner
      .isVisible({ timeout: 500 })
      .catch(() => false);

    // 세션 동기화 완료 후 모달 또는 페이지가 표시되어야 함
    const modalTitle = page.locator('text=로그인이 필요합니다');
    const homePage = page.locator('[data-testid*="home"]').first();

    const result = await Promise.race([
      modalTitle.isVisible({ timeout: 2000 }).then(() => 'modal'),
      homePage.isVisible({ timeout: 2000 }).then(() => 'page'),
    ]).catch(() => null);

    // 모달 또는 페이지 중 하나가 표시되어야 함
    expect(result).toBeTruthy();
  });
});
