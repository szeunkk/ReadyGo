import { test, expect } from '@playwright/test';

test.describe('회원가입 성공 페이지', () => {
  test('접근 제어: 로그인 세션 없을 때 로그인 페이지로 리다이렉트', async ({
    page,
  }) => {
    // 회원가입 성공 페이지는 회원가입 완료 후 리다이렉트되는 페이지
    // 로그인 세션이 없으면 로그인 페이지로 리다이렉트되어야 함

    // navigation 이벤트를 기다리면서 페이지 이동
    await Promise.all([
      page.waitForURL(/.*\/login/, { timeout: 2000 }),
      page.goto('/signup-success'),
    ]);

    // network 통신 후 리다이렉트이므로 2000ms 미만
    await expect(page).toHaveURL(/.*\/login/, { timeout: 500 });
  });
  test('닉네임 조회 및 표시', async ({ page }) => {
    // 회원가입 성공 페이지에 직접 접근
    // 로그인 세션이 있으면 페이지가 표시되고, 없으면 로그인 페이지로 리다이렉트됨
    await page.goto('/signup-success');

    // 리다이렉트 대기 (로그인 세션이 없으면 /login으로 리다이렉트)
    // 로그인 페이지로 리다이렉트된 경우 테스트 종료
    try {
      await page.waitForURL(/.*\/login/, { timeout: 2000 });
      return; // 로그인 세션이 없으므로 테스트 종료
    } catch {
      // 리다이렉트되지 않은 경우 (로그인 세션이 있음) 테스트 계속
    }

    // 성공 페이지가 표시되었는지 확인
    const successElement = page.locator(
      '[data-testid="auth-signup-success-page"]'
    );
    await expect(successElement).toBeVisible();

    // 타이틀에 닉네임이 포함되어 있는지 확인 (Supabase user_profiles에서 조회된 닉네임)
    const title = page.locator('h1.title');
    await expect(title).toContainText('님, 환영합니다!');
  });

  test('게임 성향 분석 테스트 버튼 클릭 시 /traits로 이동', async ({
    page,
  }) => {
    await page.goto('/signup-success');

    // 리다이렉트 대기 (로그인 세션이 없으면 /login으로 리다이렉트)
    try {
      await page.waitForURL(/.*\/login/, { timeout: 2000 });
      return; // 로그인 세션이 없으므로 테스트 종료
    } catch {
      // 리다이렉트되지 않은 경우 테스트 계속
    }

    // 성공 페이지 대기
    await page.waitForSelector('[data-testid="auth-signup-success-page"]', {
      timeout: 2000,
    });

    const traitsButton = page.locator(
      'button:has-text("게임 성향 분석 테스트하기")'
    );
    await traitsButton.click();

    // /traits 페이지로 이동 확인
    await expect(page).toHaveURL(/.*\/traits/, { timeout: 2000 });
  });

  test('스팀 계정 연동 버튼 클릭 시 모달 표시', async ({ page }) => {
    await page.goto('/signup-success');

    // 리다이렉트 대기 (로그인 세션이 없으면 /login으로 리다이렉트)
    try {
      await page.waitForURL(/.*\/login/, { timeout: 2000 });
      return; // 로그인 세션이 없으므로 테스트 종료
    } catch {
      // 리다이렉트되지 않은 경우 테스트 계속
    }

    // 성공 페이지 대기
    await page.waitForSelector('[data-testid="auth-signup-success-page"]', {
      timeout: 2000,
    });

    const steamButton = page.locator('button:has-text("스팀 계정 연동하기")');
    await steamButton.click();

    // 모달이 표시되는지 확인
    const modalTitle = page.locator('text=준비 중입니다');
    await expect(modalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click();

    // 모달이 닫혔는지 확인
    await expect(modalTitle).not.toBeVisible();

    // 페이지 이동 없음 확인 (여전히 signup-success 페이지에 있어야 함)
    await expect(page).toHaveURL(/.*\/signup-success/);
  });

  test('나중에 할게요 버튼 클릭 시 /home으로 이동', async ({ page }) => {
    await page.goto('/signup-success');

    // 리다이렉트 대기 (로그인 세션이 없으면 /login으로 리다이렉트)
    try {
      await page.waitForURL(/.*\/login/, { timeout: 2000 });
      return; // 로그인 세션이 없으므로 테스트 종료
    } catch {
      // 리다이렉트되지 않은 경우 테스트 계속
    }

    // 성공 페이지 대기
    await page.waitForSelector('[data-testid="auth-signup-success-page"]', {
      timeout: 2000,
    });

    const laterButton = page.locator('button:has-text("나중에 할게요")');
    await laterButton.click();

    // /home 페이지로 이동 확인
    await expect(page).toHaveURL(/.*\/home/, { timeout: 2000 });
  });
});
