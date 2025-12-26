import { test, expect } from '@playwright/test';
import { URL_PATHS } from '@/commons/constants/url';

test.describe('파티 만들기 모달 연동', () => {
  test('새 파티 만들기 버튼 클릭 시 모달이 열리는지 확인', async ({ page }) => {
    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    // timeout은 설정하지 않거나 500ms 미만으로 설정
    await page.waitForSelector('[data-testid="party-page"]', {
      state: 'visible',
    });

    // 새 파티 만들기 버튼 찾기
    const newPartyButton = page.getByRole('button', { name: '새 파티 만들기' });

    // 버튼이 보이는지 확인
    await expect(newPartyButton).toBeVisible();

    // 버튼 클릭
    await newPartyButton.click();

    // 모달이 열렸는지 확인 (PartySubmit 컴포넌트의 제목 확인)
    // 모달은 portal로 body에 렌더링되므로 text locator 사용
    // 모달이 나타날 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="party-submit-close-button"]', {
      state: 'visible',
    });

    const modalTitle = page.locator('text=새 파티 만들기');
    await expect(modalTitle).toBeVisible();

    // 모달 오버레이가 표시되는지 확인 (role="dialog"는 overlay div에 있음)
    const modalOverlay = page.locator('[role="dialog"]');
    await expect(modalOverlay).toBeVisible();
  });

  test('모달 닫기 버튼 클릭 시 모달이 닫히는지 확인', async ({ page }) => {
    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    // timeout은 설정하지 않거나 500ms 미만으로 설정
    await page.waitForSelector('[data-testid="party-page"]', {
      state: 'visible',
    });

    // 새 파티 만들기 버튼 클릭
    const newPartyButton = page.getByRole('button', { name: '새 파티 만들기' });
    await newPartyButton.click();

    // 모달이 열렸는지 확인 (모달은 portal로 body에 렌더링됨)
    // 모달이 나타날 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="party-submit-close-button"]', {
      state: 'visible',
    });

    const modalTitle = page.locator('text=새 파티 만들기');
    await expect(modalTitle).toBeVisible();

    // 모달 닫기 버튼 찾기 및 클릭
    const closeButton = page.locator(
      '[data-testid="party-submit-close-button"]'
    );
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // 모달이 닫혔는지 확인 (모달 제목이 보이지 않아야 함)
    await expect(modalTitle).not.toBeVisible();
  });
});
