import { test, expect } from '@playwright/test';

test.describe('회원가입 폼', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'domcontentloaded' });
    // 페이지 로드 완료 대기 (data-testid 기반)
    // network 통신 후 페이지 로드이므로 2000ms 미만
    await page.waitForSelector('[data-testid="auth-signup-page"]', {
      timeout: 2000,
    });
  });

  test.skip('성공 시나리오: 회원가입 성공 후 초기 데이터 생성 및 성공 페이지 이동', async ({
    page,
  }) => {
    // 타임스탬프를 포함한 고유 이메일 생성
    // Supabase는 실제 이메일 형식을 요구할 수 있으므로 실제 도메인 사용
    const timestamp = Date.now();
    const email = `test-${timestamp}@gmail.com`;
    const password = 'test1234';

    // 이메일 입력
    const emailInput = page.locator('[data-testid="signup-email-input"]');
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
    const passwordInput = page.locator('[data-testid="signup-password-input"]');
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

    // 비밀번호 확인 입력
    const passwordConfirmInput = page.locator(
      '[data-testid="signup-password-confirm-input"]'
    );
    await passwordConfirmInput.clear({ timeout: 500 });
    await passwordConfirmInput.type(password, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await passwordConfirmInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    // React 상태 업데이트를 위한 짧은 대기 (timeout이 아닌 단순 대기)
    await page.waitForTimeout(50);
    await passwordConfirmInput.blur({ timeout: 500 });
    await passwordConfirmInput.press('Tab', { timeout: 500 });

    // 버튼이 활성화될 때까지 대기 (validation 완료 대기)
    // network 통신이 아닌 UI 상태 확인이므로 500ms 미만
    // React 상태 업데이트를 고려하여 폴링 방식으로 확인
    const signupButton = page.locator('[data-testid="signup-submit-button"]');
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
      'signup-submit-button',
      { timeout: 449, polling: 10 }
    );

    // 회원가입 버튼 클릭
    await signupButton.click({ timeout: 500 });

    // 성공 페이지로 이동 확인 (data-testid 기반)
    // 실제 Supabase 연결이므로 시간이 더 걸릴 수 있음
    // 에러가 발생하면 모달이 표시될 수 있으므로 에러 모달도 확인
    // network 통신 후 페이지 이동 확인이므로 2000ms 미만
    const successPageSelector = '[data-testid="auth-signup-success-page"]';
    const errorModalSelector = 'text=가입실패';

    // 성공 페이지 또는 에러 모달 중 하나가 나타날 때까지 대기
    const result = await Promise.race([
      page
        .waitForSelector(successPageSelector, { timeout: 2000 })
        .then(() => 'success'),
      page
        .waitForSelector(errorModalSelector, { timeout: 2000 })
        .then(() => 'error')
        .catch(() => null),
    ]).catch(() => null);

    if (result === 'success') {
      // URL 확인
      await expect(page).toHaveURL(/.*signup-success/, { timeout: 500 });
    } else if (result === 'error') {
      // 에러 모달이 표시된 경우
      // 에러 메시지 추출 (모달 내의 paragraph에서)
      let errorMessage = '';
      try {
        // paragraph 태그에서 직접 추출 시도
        const paragraph = page.locator('dialog p, [role="dialog"] p').first();
        // network 통신이 아닌 UI 상태 확인이므로 500ms 미만
        errorMessage = (await paragraph.textContent({ timeout: 500 })) || '';

        // paragraph에서 찾지 못한 경우 전체 모달 텍스트에서 검색
        if (!errorMessage || errorMessage.trim() === '') {
          const modalText = await page
            .locator('text=가입실패')
            .locator('..')
            .textContent({ timeout: 500 });
          errorMessage = modalText || '';
        }
      } catch {
        errorMessage = '알 수 없는 에러';
      }

      // Rate limit 에러인 경우 스킵 (Supabase 제한)
      if (
        errorMessage.toLowerCase().includes('rate limit') ||
        errorMessage.toLowerCase().includes('rate limit exceeded')
      ) {
        test.skip(
          true,
          `Supabase rate limit 에러: ${errorMessage}. 테스트를 나중에 다시 실행하세요.`
        );
        return;
      }

      throw new Error(
        `회원가입 실패: ${errorMessage}. Supabase 이메일 검증 설정을 확인하거나, 실제 이메일 주소를 사용하세요.`
      );
    } else {
      // 둘 다 나타나지 않은 경우 (timeout)
      // 에러 모달이 있는지 다시 확인
      const isErrorModalVisible = await page
        .locator(errorModalSelector)
        .isVisible({ timeout: 500 })
        .catch(() => false);

      if (isErrorModalVisible) {
        let errorMessage = '';
        try {
          const paragraph = page.locator('dialog p, [role="dialog"] p').first();
          errorMessage = (await paragraph.textContent({ timeout: 500 })) || '';
          if (!errorMessage || errorMessage.trim() === '') {
            const modalText = await page
              .locator('text=가입실패')
              .locator('..')
              .textContent({ timeout: 500 });
            errorMessage = modalText || '';
          }
        } catch {
          errorMessage = '알 수 없는 에러';
        }

        if (
          errorMessage.toLowerCase().includes('rate limit') ||
          errorMessage.toLowerCase().includes('rate limit exceeded')
        ) {
          test.skip(
            true,
            `Supabase rate limit 에러: ${errorMessage}. 테스트를 나중에 다시 실행하세요.`
          );
          return;
        }

        throw new Error(
          `회원가입 실패: ${errorMessage}. Supabase 이메일 검증 설정을 확인하거나, 실제 이메일 주소를 사용하세요.`
        );
      }

      throw new Error(
        '회원가입 성공 페이지로 이동하지 않았고, 에러 모달도 표시되지 않았습니다. 네트워크 지연 또는 Supabase 연결 문제일 수 있습니다.'
      );
    }
  });

  test.skip('실패 시나리오 1: auth.signUp 실패', async ({ page }) => {
    // Supabase Auth signup 요청 모킹
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'signup_failed',
          error_description: '회원가입에 실패했습니다.',
        }),
      });
    });

    const email = `test-${Date.now()}@example.com`;
    const password = 'test1234';

    // 폼 입력
    const emailInput = page.locator('[data-testid="signup-email-input"]');
    await emailInput.clear({ timeout: 500 });
    await emailInput.type(email, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await emailInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    await emailInput.press('Tab', { timeout: 500 });

    const passwordInput = page.locator('[data-testid="signup-password-input"]');
    await passwordInput.clear({ timeout: 500 });
    await passwordInput.type(password, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await passwordInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    await passwordInput.press('Tab', { timeout: 500 });

    const passwordConfirmInput = page.locator(
      '[data-testid="signup-password-confirm-input"]'
    );
    await passwordConfirmInput.clear({ timeout: 500 });
    await passwordConfirmInput.type(password, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await passwordConfirmInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    await passwordConfirmInput.press('Tab', { timeout: 500 });

    // 버튼이 활성화될 때까지 대기 (validation 완료 대기)
    // network 통신이 아닌 UI 상태 확인이므로 500ms 미만
    // React 상태 업데이트를 고려하여 폴링 방식으로 확인
    const signupButton = page.locator('[data-testid="signup-submit-button"]');
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
      'signup-submit-button',
      { timeout: 449, polling: 10 }
    );

    // 회원가입 버튼 클릭
    await signupButton.click({ timeout: 500 });

    // 가입실패모달 노출 확인
    const modalTitle = page.locator('text=가입실패');
    await expect(modalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 모달이 닫혔는지 확인 (모달이 사라질 때까지 대기)
    await expect(modalTitle).not.toBeVisible({ timeout: 500 });

    // 페이지 이동 없음 확인
    await expect(page).toHaveURL(/.*signup/, { timeout: 500 });
  });

  test.skip('실패 시나리오 2: 초기 데이터 생성 실패 (user_settings insert 실패)', async ({
    page,
  }) => {
    // user_settings insert 요청만 실패시키기
    await page.route('**/rest/v1/user_settings**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error',
          code: 'PGRST500',
        }),
      });
    });

    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;
    const password = 'test1234';

    // 폼 입력
    const emailInput = page.locator('[data-testid="signup-email-input"]');
    await emailInput.clear({ timeout: 500 });
    await emailInput.type(email, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await emailInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    await emailInput.press('Tab', { timeout: 500 });

    const passwordInput = page.locator('[data-testid="signup-password-input"]');
    await passwordInput.clear({ timeout: 500 });
    await passwordInput.type(password, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await passwordInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    await passwordInput.press('Tab', { timeout: 500 });

    const passwordConfirmInput = page.locator(
      '[data-testid="signup-password-confirm-input"]'
    );
    await passwordConfirmInput.clear({ timeout: 500 });
    await passwordConfirmInput.type(password, { delay: 0, timeout: 500 });
    // react-hook-form의 onChange를 트리거하기 위해 명시적 이벤트 dispatch
    await passwordConfirmInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    });
    await passwordConfirmInput.press('Tab', { timeout: 500 });

    // 버튼이 활성화될 때까지 대기 (validation 완료 대기)
    // network 통신이 아닌 UI 상태 확인이므로 500ms 미만
    // React 상태 업데이트를 고려하여 폴링 방식으로 확인
    const signupButton = page.locator('[data-testid="signup-submit-button"]');
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
      'signup-submit-button',
      { timeout: 449, polling: 10 }
    );

    // 회원가입 버튼 클릭
    await signupButton.click({ timeout: 500 });

    // 가입실패모달 노출 확인
    const modalTitle = page.locator('text=가입실패');
    await expect(modalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 모달이 닫혔는지 확인
    await expect(modalTitle).not.toBeVisible({ timeout: 500 });

    // 페이지 이동 없음 확인
    await expect(page).toHaveURL(/.*signup/, { timeout: 500 });
  });
});
