import { test, expect } from '@playwright/test';
import { URL_PATHS } from '@/commons/constants/url';

test.describe('등록취소모달 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 (실제 로그인 플로우 사용)
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 2000,
    });

    // 로그인 정보 입력 (실제 개발 환경 계정 사용)
    const email = 'a@c.com';
    const password = '1234qwer';

    const emailInput = page.locator('[data-testid="login-email-input"]');
    await emailInput.clear({ timeout: 500 });
    await emailInput.type(email, { delay: 0, timeout: 500 });
    await emailInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(50);
    await emailInput.blur({ timeout: 500 });

    const passwordInput = page.locator('[data-testid="login-password-input"]');
    await passwordInput.clear({ timeout: 500 });
    await passwordInput.type(password, { delay: 0, timeout: 500 });
    await passwordInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(50);
    await passwordInput.blur({ timeout: 500 });

    // 로그인 버튼 활성화 대기
    const loginButton = page.locator('[data-testid="login-submit-button"]');
    await page.waitForTimeout(50);
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

    // 로그인완료 모달이 나타날 수 있으므로 확인 후 닫기
    const successModalTitle = page.locator('text=로그인완료');
    const isModalVisible = await successModalTitle
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isModalVisible) {
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 500 });
    }

    // 로그인 완료 후 홈으로 이동 대기
    await expect(page).toHaveURL(/.*\/home/, { timeout: 2000 });

    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="party-page"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 파티 모집 글 작성 버튼 클릭
    const createButton = page.locator('[data-testid="party-create-button"]');
    await createButton.click();

    // 파티만들기폼모달이 열렸는지 확인
    await page.waitForSelector('[data-testid="party-submit-close-button"]', {
      state: 'visible',
    });
  });

  test('취소버튼 클릭 시: 등록취소모달 노출 확인', async ({ page }) => {
    // 취소 버튼 클릭
    const cancelButton = page.getByRole('button', { name: '취소' });
    await cancelButton.click({ timeout: 500 });

    // 등록취소모달이 표시되는지 확인
    const cancelModalTitle = page.locator('text=등록 취소');
    await expect(cancelModalTitle).toBeVisible({ timeout: 500 });
  });

  test('계속작성버튼 클릭 시: 등록취소모달만 닫히고 파티만들기폼모달은 열려있는지 확인', async ({
    page,
  }) => {
    // 취소 버튼 클릭하여 등록취소모달 열기
    const cancelButton = page.getByRole('button', { name: '취소' });
    await cancelButton.click({ timeout: 500 });

    // 등록취소모달이 표시되는지 확인
    const cancelModalTitle = page.locator('text=등록 취소');
    await expect(cancelModalTitle).toBeVisible({ timeout: 500 });

    // 계속작성 버튼 클릭
    const continueButton = page.getByRole('button', { name: '계속 작성' });
    await continueButton.click({ timeout: 500 });

    // 등록취소모달이 닫혔는지 확인
    await expect(cancelModalTitle).not.toBeVisible({ timeout: 500 });

    // 파티만들기폼모달이 여전히 열려있는지 확인
    const partySubmitCloseButton = page.locator(
      '[data-testid="party-submit-close-button"]'
    );
    await expect(partySubmitCloseButton).toBeVisible({ timeout: 500 });
  });

  test('등록취소버튼 클릭 시: 등록취소모달과 파티만들기폼모달 모두 닫히는지 확인', async ({
    page,
  }) => {
    // 취소 버튼 클릭하여 등록취소모달 열기
    const cancelButton = page.getByRole('button', { name: '취소' });
    await cancelButton.click({ timeout: 500 });

    // 등록취소모달이 표시되는지 확인
    const cancelModalTitle = page.locator('text=등록 취소');
    await expect(cancelModalTitle).toBeVisible({ timeout: 500 });

    // 등록취소 버튼 클릭
    const confirmCancelButton = page.getByRole('button', {
      name: '등록 취소',
    });
    await confirmCancelButton.click({ timeout: 500 });

    // 등록취소모달이 닫혔는지 확인
    await expect(cancelModalTitle).not.toBeVisible({ timeout: 500 });

    // 파티만들기폼모달이 닫혔는지 확인
    const partySubmitCloseButton = page.locator(
      '[data-testid="party-submit-close-button"]'
    );
    await expect(partySubmitCloseButton).not.toBeVisible({ timeout: 500 });

    // 모든 모달이 닫혔는지 확인
    const modalOverlay = page.locator('[role="dialog"]');
    const isModalVisible = await modalOverlay
      .isVisible({ timeout: 500 })
      .catch(() => false);
    expect(isModalVisible).toBe(false);
  });
});

