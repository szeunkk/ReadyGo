import { test, expect } from '@playwright/test';
import { URL_PATHS, getPartyDetailUrl } from '@/commons/constants/url';

test.describe('파티 게시글 수정 기능', () => {
  let createdPartyId: number | null = null;

  test.beforeEach(async ({ page }) => {
    // 로그인 (실제 로그인 플로우 사용)
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 499,
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
      .isVisible({ timeout: 499 })
      .catch(() => false);

    if (isModalVisible) {
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 500 });
    }

    // 로그인 완료 후 홈으로 이동 대기
    await expect(page).toHaveURL(/.*\/home/, { timeout: 499 });

    // 테스트용 파티 생성 (첫 번째 테스트에서만)
    if (createdPartyId === null) {
      // /party 페이지로 이동
      await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="party-page"]', {
        state: 'visible',
        timeout: 499,
      });

      // 파티 모집 글 작성 버튼 클릭
      const createButton = page.locator('[data-testid="party-create-button"]');
      await createButton.click();

      // 모달이 열렸는지 확인
      await page.waitForSelector('[data-testid="party-submit-close-button"]', {
        state: 'visible',
      });

      // 필수 필드 입력
      const gameSearchInput = page.locator('input[placeholder="게임 검색"]');
      await gameSearchInput.fill('오버워치', { timeout: 500 });
      await page.waitForTimeout(100);
      const gameOption = page.locator('text=오버워치').first();
      await gameOption.click({ timeout: 500 });

      const partyTitleInput = page.locator(
        'input[placeholder="파티 제목을 입력해 주세요."]'
      );
      await partyTitleInput.fill('수정 테스트용 파티', { timeout: 500 });
      await partyTitleInput.evaluate((el) => {
        el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        el.dispatchEvent(
          new Event('change', { bubbles: true, cancelable: true })
        );
      });
      await page.waitForTimeout(100);

      const datePicker = page.locator('[data-testid="date-picker-trigger"]');
      await datePicker.click({ timeout: 500 });
      await page.waitForTimeout(200);
      const todayCell = page.locator('[data-today="true"]').first();
      await todayCell.click({ timeout: 500 });
      await page.waitForTimeout(100);

      const timeSelectbox = page.locator('text=시간 선택').first();
      await timeSelectbox.click({ timeout: 500 });
      await page.waitForTimeout(200);
      const timeOption = page.locator('text=오전 09:00').first();
      await timeOption.click({ timeout: 500 });
      await page.waitForTimeout(100);

      const descriptionInput = page.locator(
        'input[placeholder="파티 모집과 관련된 상세 내용을 입력해 주세요."]'
      );
      await descriptionInput.fill('수정 테스트용 설명', { timeout: 500 });
      await descriptionInput.evaluate((el) => {
        el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        el.dispatchEvent(
          new Event('change', { bubbles: true, cancelable: true })
        );
      });
      await page.waitForTimeout(100);

      const controlLevelSelectbox = page.locator('text=옵션 선택').first();
      await controlLevelSelectbox.click({ timeout: 500 });
      await page.waitForTimeout(200);
      const controlOption = page.locator('text=미숙').first();
      await controlOption.click({ timeout: 500 });
      await page.waitForTimeout(100);

      const difficultySelectbox = page.locator('text=난이도 선택').first();
      await difficultySelectbox.click({ timeout: 500 });
      await page.waitForTimeout(200);
      const difficultyOption = page.locator('text=이지').first();
      await difficultyOption.click({ timeout: 500 });
      await page.waitForTimeout(100);

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
      await expect(successModalTitle).toBeVisible({ timeout: 499 });

      // 모달 확인 버튼 클릭
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 500 });

      // /party/[id]로 이동 확인
      await expect(page).toHaveURL(/.*\/party\/\d+/, { timeout: 499 });

      // URL에서 ID 추출
      const currentUrl = page.url();
      const urlMatch = currentUrl.match(/\/party\/(\d+)/);
      expect(urlMatch).toBeTruthy();
      createdPartyId = parseInt(urlMatch?.[1] || '0', 10);
    }
  });

  test('본인이 생성한 파티 수정 시나리오: 수정 모달 열기 및 데이터 로드 확인', async ({
    page,
  }) => {
    if (!createdPartyId) {
      test.skip();
      return;
    }

    // 파티 상세 페이지로 이동
    await page.goto(getPartyDetailUrl(createdPartyId), {
      waitUntil: 'domcontentloaded',
    });

    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 499,
    });

    // 수정하기 버튼 클릭
    const editButton = page.locator('[data-testid="party-edit-button"]');
    await expect(editButton).toBeVisible({ timeout: 500 });
    await editButton.click({ timeout: 500 });

    // 수정 모달이 열렸는지 확인
    await page.waitForSelector('[data-testid="party-submit-close-button"]', {
      state: 'visible',
      timeout: 499,
    });

    // 수정 모드 확인 (헤더 제목: "파티 수정하기")
    const modalTitle = page.locator('text=파티 수정하기');
    await expect(modalTitle).toBeVisible({ timeout: 500 });

    // 수정 모드 확인 (버튼 텍스트: "수정하기")
    const updateButton = page.getByRole('button', { name: '수정하기' });
    await expect(updateButton).toBeVisible({ timeout: 500 });

    // 기존 데이터가 폼에 채워져 있는지 확인
    const partyTitleInput = page.locator(
      'input[placeholder="파티 제목을 입력해 주세요."]'
    );
    const titleValue = await partyTitleInput.inputValue();
    expect(titleValue).toBeTruthy();
  });

  test('본인이 생성한 파티 수정 시나리오: 수정 후 반영 확인', async ({
    page,
  }) => {
    if (!createdPartyId) {
      test.skip();
      return;
    }

    // 파티 상세 페이지로 이동
    await page.goto(getPartyDetailUrl(createdPartyId), {
      waitUntil: 'domcontentloaded',
    });

    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 499,
    });

    // 수정하기 버튼 클릭
    const editButton = page.locator('[data-testid="party-edit-button"]');
    await editButton.click({ timeout: 500 });

    // 수정 모달이 열렸는지 확인
    await page.waitForSelector('[data-testid="party-submit-close-button"]', {
      state: 'visible',
      timeout: 499,
    });

    // 폼 필드 수정
    const partyTitleInput = page.locator(
      'input[placeholder="파티 제목을 입력해 주세요."]'
    );
    const updatedTitle = `수정된 제목 ${Date.now()}`;
    await partyTitleInput.clear({ timeout: 500 });
    await partyTitleInput.fill(updatedTitle, { timeout: 500 });
    await partyTitleInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 수정하기 버튼 클릭
    const updateButton = page.getByRole('button', { name: '수정하기' });
    await page.waitForFunction(
      (buttonText) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const button = buttons.find((btn) =>
          btn.textContent?.includes(buttonText)
        );
        return button && !button.disabled;
      },
      '수정하기',
      { timeout: 449, polling: 10 }
    );
    await updateButton.click({ timeout: 500 });

    // 수정완료 모달 노출 확인
    const successModalTitle = page.locator('text=수정 완료');
    await expect(successModalTitle).toBeVisible({ timeout: 499 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 페이지 리프레시 대기
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 수정된 값이 반영되었는지 확인
    const detailTitle = page.locator('[data-testid="party-detail-title"]');
    await expect(detailTitle).toBeVisible({ timeout: 499 });
    const detailTitleText = await detailTitle.textContent();
    expect(detailTitleText).toContain(updatedTitle);
  });

  test('권한 검증: 다른 사용자가 생성한 파티 수정 시도 시나리오', async ({
    page: _page,
  }) => {
    // 이 테스트는 다른 사용자의 파티 ID가 필요하므로
    // 실제 데이터베이스에서 다른 사용자의 파티를 찾아야 함
    // 현재는 스킵 처리
    test.skip();
  });
});

