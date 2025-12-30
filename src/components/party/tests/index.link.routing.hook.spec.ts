import { test, expect } from '@playwright/test';
import { URL_PATHS, getPartyDetailUrl } from '@/commons/constants/url';

test.describe('파티 카드 라우팅 기능', () => {
  test('참여하기 버튼 클릭 시 파티 상세 페이지로 이동', async ({ page }) => {
    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    // timeout은 설정하지 않음 (요구사항: "설정하지 않거나, 500ms 미만")
    await page.waitForSelector('[data-testid="party-page"]', {
      state: 'visible',
    });

    // API 호출이 완료되고 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const mainArea = document.querySelector('[data-testid="party-page"]');
        if (!mainArea) {
          return false;
        }
        const cards = mainArea.querySelectorAll('[data-testid^="party-card-"]');
        const emptyMessage = mainArea.textContent?.includes('파티가 없습니다');
        return cards.length > 0 || emptyMessage === true;
      },
      { timeout: 1999 }
    );

    // 첫 번째 파티 카드 확인
    const firstCard = page.locator('[data-testid^="party-card-"]').first();
    const cardExists = await firstCard.isVisible().catch(() => false);

    if (cardExists) {
      // 첫 번째 카드의 partyId 추출
      const cardTestId = await firstCard.getAttribute('data-testid');
      const partyId = cardTestId?.replace('party-card-', '');

      if (partyId) {
        // 참여하기 버튼 찾기
        const joinButton = page.locator(
          `[data-testid="party-card-join-button-${partyId}"]`
        );
        await expect(joinButton).toBeVisible();

        // 버튼 클릭 후 페이지 이동 대기
        await Promise.all([
          page.waitForURL(
            (url) => {
              const expectedUrl = getPartyDetailUrl(partyId);
              return url.pathname === expectedUrl;
            },
            { timeout: 1999 }
          ),
          joinButton.click(),
        ]);

        // 올바른 URL로 이동했는지 확인
        const currentUrl = page.url();
        const expectedUrl = getPartyDetailUrl(partyId);
        expect(currentUrl).toContain(expectedUrl);
      }
    }
  });

  test('참여하기 버튼 외의 다른 영역 클릭 시 페이지 이동하지 않음', async ({
    page,
  }) => {
    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기
    // timeout은 설정하지 않음 (요구사항: "설정하지 않거나, 500ms 미만")
    await page.waitForSelector('[data-testid="party-page"]', {
      state: 'visible',
    });

    // API 호출 완료 대기
    await page.waitForFunction(
      () => {
        const mainArea = document.querySelector('[data-testid="party-page"]');
        if (!mainArea) {
          return false;
        }
        const cards = mainArea.querySelectorAll('[data-testid^="party-card-"]');
        return cards.length > 0;
      },
      { timeout: 1999 }
    );

    // 첫 번째 파티 카드 확인
    const firstCard = page.locator('[data-testid^="party-card-"]').first();
    const cardExists = await firstCard.isVisible().catch(() => false);

    if (cardExists) {
      // 현재 URL 저장
      const initialUrl = page.url();

      // 카드의 제목 영역 클릭 (참여하기 버튼이 아닌 영역)
      const titleElement = firstCard.locator(
        '[data-testid^="party-card-title-"]'
      );
      const titleExists = await titleElement.isVisible().catch(() => false);

      if (titleExists) {
        // 제목 클릭 (navigation이 발생하지 않아야 함)
        await titleElement.click();

        // 클릭 후 즉시 URL 확인 (navigation이 발생하지 않았으므로 URL이 변경되지 않아야 함)
        const currentUrl = page.url();
        expect(currentUrl).toBe(initialUrl);
      }
    }
  });

  test('참여하기 버튼 data-testid 형식 확인', async ({ page }) => {
    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기
    // timeout은 설정하지 않음 (요구사항: "설정하지 않거나, 500ms 미만")
    await page.waitForSelector('[data-testid="party-page"]', {
      state: 'visible',
    });

    // API 호출 완료 대기
    await page.waitForFunction(
      () => {
        const mainArea = document.querySelector('[data-testid="party-page"]');
        if (!mainArea) {
          return false;
        }
        const cards = mainArea.querySelectorAll('[data-testid^="party-card-"]');
        return cards.length > 0;
      },
      { timeout: 1999 }
    );

    // 첫 번째 파티 카드 확인
    const firstCard = page.locator('[data-testid^="party-card-"]').first();
    const cardExists = await firstCard.isVisible().catch(() => false);

    if (cardExists) {
      // 카드의 partyId 추출
      const cardTestId = await firstCard.getAttribute('data-testid');
      const partyId = cardTestId?.replace('party-card-', '');

      if (partyId) {
        // 참여하기 버튼의 data-testid 형식 확인
        const joinButton = page.locator(
          `[data-testid="party-card-join-button-${partyId}"]`
        );
        await expect(joinButton).toBeVisible();

        // data-testid 속성 값 확인
        const buttonTestId = await joinButton.getAttribute('data-testid');
        expect(buttonTestId).toBe(`party-card-join-button-${partyId}`);
      }
    }
  });
});
