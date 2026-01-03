import { test, expect } from '@playwright/test';
import { URL_PATHS } from '@/commons/constants/url';

test.describe('파티 수정 기능', () => {
  let partyId: string | null = null;

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

    // 테스트용 파티 생성 (partyId가 없을 경우에만)
    if (!partyId) {
      // /party 페이지로 이동
      await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

      // 페이지가 완전히 로드될 때까지 대기
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
      const uniqueTitle = `수정 테스트 파티 ${Date.now()}`;
      await partyTitleInput.fill(uniqueTitle, { timeout: 500 });
      await partyTitleInput.evaluate((el) => {
        el.dispatchEvent(
          new Event('input', { bubbles: true, cancelable: true })
        );
        el.dispatchEvent(
          new Event('change', { bubbles: true, cancelable: true })
        );
      });
      await page.waitForTimeout(100);

      // 시작일 선택
      const datePicker = page.locator('[data-testid="date-picker-trigger"]');
      await datePicker.click({ timeout: 500 });
      await page.waitForTimeout(200);
      const todayCell = page.locator('[data-today="true"]').first();
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
      await descriptionInput.fill('수정 테스트 설명입니다', { timeout: 500 });
      await descriptionInput.evaluate((el) => {
        el.dispatchEvent(
          new Event('input', { bubbles: true, cancelable: true })
        );
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

      // URL에서 ID 추출
      const currentUrl = page.url();
      const urlMatch = currentUrl.match(/\/party\/(\d+)/);
      expect(urlMatch).toBeTruthy();
      partyId = urlMatch?.[1] || null;
    }
  });

  test('수정하기 버튼 클릭 시: 수정 모달이 열리고 isEdit=true로 설정된 PartySubmit 컴포넌트가 모달로 표시됨을 확인', async ({
    page,
  }) => {
    // 파티 상세 페이지로 이동
    if (partyId) {
      await page.goto(`/party/${partyId}`, { waitUntil: 'domcontentloaded' });
    } else {
      // partyId가 없으면 파티 목록에서 첫 번째 파티로 이동
      await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testid="party-page"]', {
        state: 'visible',
        timeout: 2000,
      });
      // 첫 번째 파티 카드 클릭 (실제 구현에 맞게 수정 필요)
      // 임시로 URL에서 partyId 추출
      const currentUrl = page.url();
      const urlMatch = currentUrl.match(/\/party\/(\d+)/);
      if (urlMatch) {
        const [, extractedPartyId] = urlMatch;
        partyId = extractedPartyId;
        await page.goto(`/party/${partyId}`, { waitUntil: 'domcontentloaded' });
      }
    }

    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 수정하기 버튼 클릭
    const editButton = page.locator('[data-testid="party-detail-edit-button"]');
    await editButton.click({ timeout: 500 });

    // 수정 모달이 열렸는지 확인
    await page.waitForSelector('[data-testid="party-submit-modal"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 모달 제목이 "파티 수정하기"인지 확인 (isEdit=true 확인)
    const modalTitle = page.locator('[data-testid="party-submit-modal-title"]');
    await expect(modalTitle).toHaveText('파티 수정하기', { timeout: 500 });
  });

  test('수정 모달에서: 기존 파티 데이터가 폼에 로드되었음을 확인', async ({
    page,
  }) => {
    // 파티 상세 페이지로 이동
    if (partyId) {
      await page.goto(`/party/${partyId}`, { waitUntil: 'domcontentloaded' });
    } else {
      await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testid="party-page"]', {
        state: 'visible',
        timeout: 2000,
      });
    }

    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 기존 데이터 저장 (수정 전 데이터)
    const originalTitle = await page
      .locator('[data-testid="party-detail-title"]')
      .textContent();
    const originalDescription = await page
      .locator('[data-testid="party-detail-description"]')
      .textContent();

    // 수정하기 버튼 클릭
    const editButton = page.locator('[data-testid="party-detail-edit-button"]');
    await editButton.click({ timeout: 500 });

    // 수정 모달이 열렸는지 확인
    await page.waitForSelector('[data-testid="party-submit-modal"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 로딩 완료 대기
    const loadingElement = page.locator('[data-testid="party-submit-loading"]');
    const isLoading = await loadingElement
      .isVisible({ timeout: 500 })
      .catch(() => false);
    if (isLoading) {
      await page.waitForSelector('[data-testid="party-submit-loading"]', {
        state: 'hidden',
        timeout: 2000,
      });
    }

    // 폼에 기존 데이터가 로드되었는지 확인
    const partyTitleInput = page.locator(
      '[data-testid="party-submit-party-title"]'
    );
    const descriptionInput = page.locator(
      '[data-testid="party-submit-description"]'
    );

    await expect(partyTitleInput).toHaveValue(originalTitle || '', {
      timeout: 500,
    });
    await expect(descriptionInput).toHaveValue(originalDescription || '', {
      timeout: 500,
    });
  });

  test('수정 모달에서: 파티 정보를 변경하고 수정하기 버튼을 클릭하여 수정 요청', async ({
    page,
  }) => {
    // 파티 상세 페이지로 이동
    if (partyId) {
      await page.goto(`/party/${partyId}`, { waitUntil: 'domcontentloaded' });
    } else {
      await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testid="party-page"]', {
        state: 'visible',
        timeout: 2000,
      });
    }

    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 수정하기 버튼 클릭
    const editButton = page.locator('[data-testid="party-detail-edit-button"]');
    await editButton.click({ timeout: 500 });

    // 수정 모달이 열렸는지 확인
    await page.waitForSelector('[data-testid="party-submit-modal"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 로딩 완료 대기
    const loadingElement = page.locator('[data-testid="party-submit-loading"]');
    const isLoading = await loadingElement
      .isVisible({ timeout: 500 })
      .catch(() => false);
    if (isLoading) {
      await page.waitForSelector('[data-testid="party-submit-loading"]', {
        state: 'hidden',
        timeout: 2000,
      });
    }

    // 파티 제목 변경
    const partyTitleInput = page.locator(
      '[data-testid="party-submit-party-title"]'
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

    // 설명 변경
    const descriptionInput = page.locator(
      '[data-testid="party-submit-description"]'
    );
    const updatedDescription = `수정된 설명 ${Date.now()}`;
    await descriptionInput.clear({ timeout: 500 });
    await descriptionInput.fill(updatedDescription, { timeout: 500 });
    await descriptionInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // React 상태 업데이트를 위한 대기
    await page.waitForTimeout(200);

    // 수정하기 버튼 클릭
    const submitButton = page.locator('[data-testid="party-submit-button"]');
    await page.waitForFunction(
      (testId) => {
        const button = document.querySelector(
          `[data-testid="${testId}"]`
        ) as HTMLButtonElement;
        return button && !button.disabled;
      },
      'party-submit-button',
      { timeout: 449, polling: 10 }
    );
    await submitButton.click({ timeout: 500 });

    // 수정 완료 모달 노출 확인
    const successModalTitle = page.locator('text=수정 완료');
    await expect(successModalTitle).toBeVisible({ timeout: 2000 });
  });

  test('수정 완료 모달 확인 클릭 후: 수정 모달이 닫히고 페이지 새로고침 없이 파티 상세 페이지의 데이터가 자동으로 갱신되어 수정된 내용이 표시됨을 확인', async ({
    page,
  }) => {
    // 파티 상세 페이지로 이동
    if (partyId) {
      await page.goto(`/party/${partyId}`, { waitUntil: 'domcontentloaded' });
    } else {
      await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testid="party-page"]', {
        state: 'visible',
        timeout: 2000,
      });
    }

    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 수정하기 버튼 클릭
    const editButton = page.locator('[data-testid="party-detail-edit-button"]');
    await editButton.click({ timeout: 500 });

    // 수정 모달이 열렸는지 확인
    await page.waitForSelector('[data-testid="party-submit-modal"]', {
      state: 'visible',
      timeout: 2000,
    });

    // 로딩 완료 대기
    const loadingElement = page.locator('[data-testid="party-submit-loading"]');
    const isLoading = await loadingElement
      .isVisible({ timeout: 500 })
      .catch(() => false);
    if (isLoading) {
      await page.waitForSelector('[data-testid="party-submit-loading"]', {
        state: 'hidden',
        timeout: 2000,
      });
    }

    // 파티 제목 변경
    const partyTitleInput = page.locator(
      '[data-testid="party-submit-party-title"]'
    );
    const updatedTitle = `자동 갱신 테스트 ${Date.now()}`;
    await partyTitleInput.clear({ timeout: 500 });
    await partyTitleInput.fill(updatedTitle, { timeout: 500 });
    await partyTitleInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // 설명 변경
    const descriptionInput = page.locator(
      '[data-testid="party-submit-description"]'
    );
    const updatedDescription = `자동 갱신 설명 ${Date.now()}`;
    await descriptionInput.clear({ timeout: 500 });
    await descriptionInput.fill(updatedDescription, { timeout: 500 });
    await descriptionInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(100);

    // React 상태 업데이트를 위한 대기
    await page.waitForTimeout(200);

    // 수정하기 버튼 클릭
    const submitButton = page.locator('[data-testid="party-submit-button"]');
    await page.waitForFunction(
      (testId) => {
        const button = document.querySelector(
          `[data-testid="${testId}"]`
        ) as HTMLButtonElement;
        return button && !button.disabled;
      },
      'party-submit-button',
      { timeout: 449, polling: 10 }
    );
    await submitButton.click({ timeout: 500 });

    // 수정 완료 모달 노출 확인
    const successModalTitle = page.locator('text=수정 완료');
    await expect(successModalTitle).toBeVisible({ timeout: 2000 });

    // 모달 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ timeout: 500 });

    // 수정 모달이 닫혔는지 확인
    await page.waitForSelector('[data-testid="party-submit-modal"]', {
      state: 'hidden',
      timeout: 2000,
    });

    // 페이지 새로고침 없이 데이터가 자동으로 갱신되었는지 확인
    // URL이 변경되지 않았는지 확인 (페이지 새로고침 없음)
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/party\/\d+/);

    // 수정된 제목이 상세 페이지에 표시되는지 확인
    const detailTitle = page.locator('[data-testid="party-detail-title"]');
    await expect(detailTitle).toHaveText(updatedTitle, { timeout: 2000 });

    // 수정된 설명이 상세 페이지에 표시되는지 확인
    const detailDescription = page.locator(
      '[data-testid="party-detail-description"]'
    );
    await expect(detailDescription).toHaveText(updatedDescription, {
      timeout: 2000,
    });
  });
});
