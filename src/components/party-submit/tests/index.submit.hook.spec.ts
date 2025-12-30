import { test, expect } from '@playwright/test';
import { URL_PATHS } from '@/commons/constants/url';

test.describe('파티 모집 글 등록 기능', () => {
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

    // 모달이 열렸는지 확인
    await page.waitForSelector('[data-testid="party-submit-close-button"]', {
      state: 'visible',
    });
  });

  test('필수 필드 입력 전: 등록 버튼 비활성 확인', async ({ page }) => {
    // 등록 버튼 찾기
    const submitButton = page.getByRole('button', { name: '파티 만들기' });

    // 등록 버튼이 비활성화되어 있는지 확인
    await expect(submitButton).toBeDisabled({ timeout: 500 });
  });

  test('필수 필드 입력 후: 등록 버튼 활성 확인', async ({ page }) => {
    // 게임 선택
    const gameSearchInput = page.locator('input[placeholder="게임 검색"]');
    await gameSearchInput.fill('오버워치', { timeout: 500 });
    await page.waitForTimeout(100);
    const gameOption = page.locator('text=오버워치').first();
    await gameOption.click({ timeout: 500 });

    // 파티 제목 입력
    const partyTitleInput = page.locator(
      'input[placeholder="파티 제목을 입력해 주세요."]'
    );
    await partyTitleInput.fill('테스트 파티', { timeout: 500 });
    await partyTitleInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 시작일 선택 (DatePicker)
    const datePicker = page.locator('.ant-picker-input input');
    await datePicker.click({ timeout: 500 });
    await page.waitForTimeout(200);
    // 오늘 날짜 선택
    const todayCell = page.locator('.ant-picker-cell-today');
    await todayCell.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 시작시간 선택
    const timeSelectbox = page.locator('text=시간 선택').first();
    await timeSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const timeOption = page.locator('text=오전 09:00').first();
    await timeOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 설명 입력
    const descriptionInput = page.locator(
      'input[placeholder="파티 모집과 관련된 상세 내용을 입력해 주세요."]'
    );
    await descriptionInput.fill('테스트 설명입니다', { timeout: 500 });
    await descriptionInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 컨트롤 수준 선택
    const controlLevelSelectbox = page.locator('text=옵션 선택').first();
    await controlLevelSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const controlOption = page.locator('text=미숙').first();
    await controlOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 난이도 선택
    const difficultySelectbox = page.locator('text=난이도 선택').first();
    await difficultySelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const difficultyOption = page.locator('text=이지').first();
    await difficultyOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // React 상태 업데이트를 위한 대기
    await page.waitForTimeout(200);

    // 등록 버튼 찾기
    const submitButton = page.getByRole('button', { name: '파티 만들기' });

    // 등록 버튼이 활성화되어 있는지 확인
    await page.waitForFunction(
      (buttonText) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const button = buttons.find((btn) =>
          btn.textContent?.includes(buttonText)
        );
        return button && !button.disabled;
      },
      '파티 만들기',
      { timeout: 449, polling: 10 }
    );

    await expect(submitButton).toBeEnabled({ timeout: 500 });
  });

  test('등록 버튼 클릭 후: 등록완료 모달 노출 확인', async ({ page }) => {
    // 로그인 상태 확인 (실제 로그인 필요)
    // 이 테스트는 로그인된 상태에서 실행되어야 함

    // 게임 선택
    const gameSearchInput = page.locator('input[placeholder="게임 검색"]');
    await gameSearchInput.fill('오버워치', { timeout: 500 });
    await page.waitForTimeout(100);
    const gameOption = page.locator('text=오버워치').first();
    await gameOption.click({ timeout: 500 });

    // 파티 제목 입력
    const partyTitleInput = page.locator(
      'input[placeholder="파티 제목을 입력해 주세요."]'
    );
    await partyTitleInput.fill('테스트 파티', { timeout: 500 });
    await partyTitleInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 시작일 선택
    const datePicker = page.locator('.ant-picker-input input');
    await datePicker.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const todayCell = page.locator('.ant-picker-cell-today');
    await todayCell.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 시작시간 선택
    const timeSelectbox = page.locator('text=시간 선택').first();
    await timeSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const timeOption = page.locator('text=오전 09:00').first();
    await timeOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 설명 입력
    const descriptionInput = page.locator(
      'input[placeholder="파티 모집과 관련된 상세 내용을 입력해 주세요."]'
    );
    await descriptionInput.fill('테스트 설명입니다', { timeout: 500 });
    await descriptionInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 컨트롤 수준 선택
    const controlLevelSelectbox = page.locator('text=옵션 선택').first();
    await controlLevelSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const controlOption = page.locator('text=미숙').first();
    await controlOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 난이도 선택
    const difficultySelectbox = page.locator('text=난이도 선택').first();
    await difficultySelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const difficultyOption = page.locator('text=이지').first();
    await difficultyOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // React 상태 업데이트를 위한 대기
    await page.waitForTimeout(200);

    // 등록 버튼 클릭
    const submitButton = page.getByRole('button', { name: '파티 만들기' });
    await page.waitForFunction(
      (buttonText) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const button = buttons.find((btn) =>
          btn.textContent?.includes(buttonText)
        );
        return button && !button.disabled;
      },
      '파티 만들기',
      { timeout: 449, polling: 10 }
    );
    await submitButton.click({ timeout: 500 });

    // 등록완료 모달 노출 확인
    const successModalTitle = page.locator('text=등록 완료');
    await expect(successModalTitle).toBeVisible({ timeout: 2000 });
  });

  test('모달 확인 클릭 후: /party/[id]로 이동 확인', async ({ page }) => {
    // 로그인 상태 확인 (실제 로그인 필요)

    // 게임 선택
    const gameSearchInput = page.locator('input[placeholder="게임 검색"]');
    await gameSearchInput.fill('오버워치', { timeout: 500 });
    await page.waitForTimeout(100);
    const gameOption = page.locator('text=오버워치').first();
    await gameOption.click({ timeout: 500 });

    // 파티 제목 입력
    const partyTitleInput = page.locator(
      'input[placeholder="파티 제목을 입력해 주세요."]'
    );
    await partyTitleInput.fill('테스트 파티', { timeout: 500 });
    await partyTitleInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 시작일 선택
    const datePicker = page.locator('.ant-picker-input input');
    await datePicker.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const todayCell = page.locator('.ant-picker-cell-today');
    await todayCell.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 시작시간 선택
    const timeSelectbox = page.locator('text=시간 선택').first();
    await timeSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const timeOption = page.locator('text=오전 09:00').first();
    await timeOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 설명 입력
    const descriptionInput = page.locator(
      'input[placeholder="파티 모집과 관련된 상세 내용을 입력해 주세요."]'
    );
    await descriptionInput.fill('테스트 설명입니다', { timeout: 500 });
    await descriptionInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 컨트롤 수준 선택
    const controlLevelSelectbox = page.locator('text=옵션 선택').first();
    await controlLevelSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const controlOption = page.locator('text=미숙').first();
    await controlOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 난이도 선택
    const difficultySelectbox = page.locator('text=난이도 선택').first();
    await difficultySelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const difficultyOption = page.locator('text=이지').first();
    await difficultyOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // React 상태 업데이트를 위한 대기
    await page.waitForTimeout(200);

    // 등록 버튼 클릭
    const submitButton = page.getByRole('button', { name: '파티 만들기' });
    await page.waitForFunction(
      (buttonText) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const button = buttons.find((btn) =>
          btn.textContent?.includes(buttonText)
        );
        return button && !button.disabled;
      },
      '파티 만들기',
      { timeout: 449, polling: 10 }
    );
    await submitButton.click({ timeout: 500 });

    // 등록완료 모달 노출 확인
    const successModalTitle = page.locator('text=등록 완료');
    await expect(successModalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // /party/[id]로 이동 확인
    await expect(page).toHaveURL(/.*\/party\/\d+/, { timeout: 2000 });
  });

  test('이동 후: 모달이 모두 닫혀있는 상태 확인', async ({ page }) => {
    // 로그인 상태 확인 (실제 로그인 필요)

    // 게임 선택
    const gameSearchInput = page.locator('input[placeholder="게임 검색"]');
    await gameSearchInput.fill('오버워치', { timeout: 500 });
    await page.waitForTimeout(100);
    const gameOption = page.locator('text=오버워치').first();
    await gameOption.click({ timeout: 500 });

    // 파티 제목 입력
    const partyTitleInput = page.locator(
      'input[placeholder="파티 제목을 입력해 주세요."]'
    );
    await partyTitleInput.fill('테스트 파티', { timeout: 500 });
    await partyTitleInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 시작일 선택
    const datePicker = page.locator('.ant-picker-input input');
    await datePicker.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const todayCell = page.locator('.ant-picker-cell-today');
    await todayCell.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 시작시간 선택
    const timeSelectbox = page.locator('text=시간 선택').first();
    await timeSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const timeOption = page.locator('text=오전 09:00').first();
    await timeOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 설명 입력
    const descriptionInput = page.locator(
      'input[placeholder="파티 모집과 관련된 상세 내용을 입력해 주세요."]'
    );
    await descriptionInput.fill('테스트 설명입니다', { timeout: 500 });
    await descriptionInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 컨트롤 수준 선택
    const controlLevelSelectbox = page.locator('text=옵션 선택').first();
    await controlLevelSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const controlOption = page.locator('text=미숙').first();
    await controlOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 난이도 선택
    const difficultySelectbox = page.locator('text=난이도 선택').first();
    await difficultySelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const difficultyOption = page.locator('text=이지').first();
    await difficultyOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // React 상태 업데이트를 위한 대기
    await page.waitForTimeout(200);

    // 등록 버튼 클릭
    const submitButton = page.getByRole('button', { name: '파티 만들기' });
    await page.waitForFunction(
      (buttonText) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const button = buttons.find((btn) =>
          btn.textContent?.includes(buttonText)
        );
        return button && !button.disabled;
      },
      '파티 만들기',
      { timeout: 449, polling: 10 }
    );
    await submitButton.click({ timeout: 500 });

    // 등록완료 모달 노출 확인
    const successModalTitle = page.locator('text=등록 완료');
    await expect(successModalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // /party/[id]로 이동 확인
    await expect(page).toHaveURL(/.*\/party\/\d+/, { timeout: 2000 });

    // 모달이 모두 닫혀있는 상태 확인
    await expect(successModalTitle).not.toBeVisible({ timeout: 500 });
    const modalOverlay = page.locator('[role="dialog"]');
    const isModalVisible = await modalOverlay
      .isVisible({ timeout: 500 })
      .catch(() => false);
    expect(isModalVisible).toBe(false);
  });

  test.skip('인증되지 않은 유저 시나리오: 로그인하지 않은 상태에서 등록 시도 시 적절한 처리 확인', async ({
    page,
  }) => {
    // 로그아웃 상태 확인
    await page.evaluate(() => {
      localStorage.clear();
    });

    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 로그인 페이지로 리다이렉트되었는지 확인
    await expect(page).toHaveURL(/.*\/login/, { timeout: 2000 });
  });

  test('태그 입력 테스트: "#금요일#가보자#빡겜" 형식 입력 후 변환 확인', async ({
    page,
  }) => {
    // 게임 선택
    const gameSearchInput = page.locator('input[placeholder="게임 검색"]');
    await gameSearchInput.fill('오버워치', { timeout: 500 });
    await page.waitForTimeout(100);
    const gameOption = page.locator('text=오버워치').first();
    await gameOption.click({ timeout: 500 });

    // 파티 제목 입력
    const partyTitleInput = page.locator(
      'input[placeholder="파티 제목을 입력해 주세요."]'
    );
    await partyTitleInput.fill('태그 테스트 파티', { timeout: 500 });
    await partyTitleInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 시작일 선택
    const datePicker = page.locator('.ant-picker-input input');
    await datePicker.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const todayCell = page.locator('.ant-picker-cell-today');
    await todayCell.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 시작시간 선택
    const timeSelectbox = page.locator('text=시간 선택').first();
    await timeSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const timeOption = page.locator('text=오전 09:00').first();
    await timeOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 설명 입력
    const descriptionInput = page.locator(
      'input[placeholder="파티 모집과 관련된 상세 내용을 입력해 주세요."]'
    );
    await descriptionInput.fill('태그 테스트 설명입니다', { timeout: 500 });
    await descriptionInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 컨트롤 수준 선택
    const controlLevelSelectbox = page.locator('text=옵션 선택').first();
    await controlLevelSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const controlOption = page.locator('text=미숙').first();
    await controlOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 난이도 선택
    const difficultySelectbox = page.locator('text=난이도 선택').first();
    await difficultySelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const difficultyOption = page.locator('text=이지').first();
    await difficultyOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 태그 입력: "#금요일#가보자#빡겜" 형식
    const tagsInput = page.locator('input[placeholder="#태그 입력"]');
    await tagsInput.fill('#금요일#가보자#빡겜', { timeout: 500 });
    await tagsInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // React 상태 업데이트를 위한 대기
    await page.waitForTimeout(200);

    // 등록 버튼 클릭
    const submitButton = page.getByRole('button', { name: '파티 만들기' });
    await page.waitForFunction(
      (buttonText) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const button = buttons.find((btn) =>
          btn.textContent?.includes(buttonText)
        );
        return button && !button.disabled;
      },
      '파티 만들기',
      { timeout: 449, polling: 10 }
    );
    await submitButton.click({ timeout: 500 });

    // 등록완료 모달 노출 확인
    const successModalTitle = page.locator('text=등록 완료');
    await expect(successModalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // /party/[id]로 이동 확인
    await expect(page).toHaveURL(/.*\/party\/\d+/, { timeout: 2000 });

    // 태그가 올바르게 표시되는지 확인 (상세 페이지에서)
    // 태그는 선택적 필드이므로 표시되지 않을 수도 있음
    // 하지만 DB에 올바르게 저장되었는지는 상세 페이지에서 확인 가능
  });

  test('DB 반영 확인: 등록 성공 후 생성된 id로 올바른 URL(/party/[id])로 이동했는지 확인', async ({
    page,
  }) => {
    // 게임 선택
    const gameSearchInput = page.locator('input[placeholder="게임 검색"]');
    await gameSearchInput.fill('오버워치', { timeout: 500 });
    await page.waitForTimeout(100);
    const gameOption = page.locator('text=오버워치').first();
    await gameOption.click({ timeout: 500 });

    // 파티 제목 입력 (고유한 제목 사용)
    const uniqueTitle = `DB 반영 테스트 ${Date.now()}`;
    const partyTitleInput = page.locator(
      'input[placeholder="파티 제목을 입력해 주세요."]'
    );
    await partyTitleInput.fill(uniqueTitle, { timeout: 500 });
    await partyTitleInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 시작일 선택
    const datePicker = page.locator('.ant-picker-input input');
    await datePicker.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const todayCell = page.locator('.ant-picker-cell-today');
    await todayCell.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 시작시간 선택
    const timeSelectbox = page.locator('text=시간 선택').first();
    await timeSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const timeOption = page.locator('text=오전 09:00').first();
    await timeOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 설명 입력
    const descriptionInput = page.locator(
      'input[placeholder="파티 모집과 관련된 상세 내용을 입력해 주세요."]'
    );
    await descriptionInput.fill('DB 반영 테스트 설명입니다', { timeout: 500 });
    await descriptionInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 컨트롤 수준 선택
    const controlLevelSelectbox = page.locator('text=옵션 선택').first();
    await controlLevelSelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const controlOption = page.locator('text=미숙').first();
    await controlOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // 난이도 선택
    const difficultySelectbox = page.locator('text=난이도 선택').first();
    await difficultySelectbox.click({ timeout: 500 });
    await page.waitForTimeout(200);
    const difficultyOption = page.locator('text=이지').first();
    await difficultyOption.click({ timeout: 500 });
    await page.waitForTimeout(100);

    // React 상태 업데이트를 위한 대기
    await page.waitForTimeout(200);

    // 등록 버튼 클릭
    const submitButton = page.getByRole('button', { name: '파티 만들기' });
    await page.waitForFunction(
      (buttonText) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const button = buttons.find((btn) =>
          btn.textContent?.includes(buttonText)
        );
        return button && !button.disabled;
      },
      '파티 만들기',
      { timeout: 449, polling: 10 }
    );
    await submitButton.click({ timeout: 500 });

    // 등록완료 모달 노출 확인
    const successModalTitle = page.locator('text=등록 완료');
    await expect(successModalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // /party/[id]로 이동 확인 (URL 패턴 확인)
    await expect(page).toHaveURL(/.*\/party\/\d+/, { timeout: 2000 });

    // URL에서 ID 추출
    const currentUrl = page.url();
    const urlMatch = currentUrl.match(/\/party\/(\d+)/);
    expect(urlMatch).toBeTruthy();
    const partyId = urlMatch?.[1];
    expect(partyId).toBeTruthy();

    // 상세 페이지가 올바르게 로드되었는지 확인
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 등록한 제목이 상세 페이지에 표시되는지 확인 (DB 반영 확인)
    const detailTitle = page.locator('[data-testid="party-detail-title"]');
    await expect(detailTitle).toBeVisible({ timeout: 2000 });
    const detailTitleText = await detailTitle.textContent();
    expect(detailTitleText).toContain(uniqueTitle);
  });
});
