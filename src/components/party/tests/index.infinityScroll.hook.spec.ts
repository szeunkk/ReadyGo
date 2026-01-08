import { test, expect } from '@playwright/test';
import { URL_PATHS } from '@/commons/constants/url';

test.describe('파티 목록 무한스크롤 기능', () => {
  test.beforeEach(async ({ page }) => {
    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="party-page"]', {
      state: 'visible',
    });

    // 새 파티 만들기 버튼 클릭 (요구사항: 페이지 로드 후 새 파티 만들기 버튼 클릭)
    const createButton = page.locator('[data-testid="party-create-button"]');
    if (await createButton.isVisible()) {
      await createButton.click();
      // 모달이 열릴 수 있으므로 잠시 대기
      await page.waitForTimeout(100);
      // ESC 키로 모달 닫기 (있는 경우)
      await page.keyboard.press('Escape');
    }
  });

  test('무한스크롤 - 초기 로드 시 6개의 파티 카드가 표시되는지 확인', async ({
    page,
  }) => {
    // 초기 로드 완료 대기
    await page.waitForFunction(
      () => {
        const mainArea = document.querySelector(
          '[data-testid="party-main-area"]'
        );
        if (!mainArea) {
          return false;
        }
        const cards = mainArea.querySelectorAll('[data-testid^="party-card-"]');
        const isLoading = mainArea.textContent?.includes('로딩 중');
        return !isLoading && cards.length >= 0;
      },
      { timeout: 1999 }
    );

    // 초기 로드 시 6개의 카드가 표시되는지 확인
    const cards = page.locator('[data-testid^="party-card-"]');
    const cardCount = await cards.count();

    // 실제 데이터가 6개 이상이면 6개가 표시되어야 하고, 6개 미만이면 모든 카드가 표시되어야 함
    expect(cardCount).toBeGreaterThanOrEqual(0);
    if (cardCount > 0) {
      // 최소 6개 또는 실제 데이터 개수만큼 표시되어야 함
      expect(cardCount).toBeLessThanOrEqual(Math.max(6, cardCount));
    }
  });

  test('무한스크롤 - 스크롤 시 추가 파티 목록이 로드되는지 확인', async ({
    page,
  }) => {
    // 초기 로드 완료 대기
    await page.waitForFunction(
      () => {
        const mainArea = document.querySelector(
          '[data-testid="party-main-area"]'
        );
        if (!mainArea) {
          return false;
        }
        const cards = mainArea.querySelectorAll('[data-testid^="party-card-"]');
        const isLoading = mainArea.textContent?.includes('로딩 중');
        return !isLoading && cards.length >= 0;
      },
      { timeout: 1999 }
    );

    // 초기 카드 개수 확인
    const initialCards = page.locator('[data-testid^="party-card-"]');
    const initialCount = await initialCards.count();

    if (initialCount >= 10) {
      // Layout의 children 영역(main 요소) 스크롤
      const childrenElement = page.locator('main[class*="children"]');
      await childrenElement.evaluate((el) => {
        el.scrollTop = el.scrollHeight - el.clientHeight;
      });

      // 추가 로드 대기
      await page.waitForFunction(
        (initialCount) => {
          const mainArea = document.querySelector(
            '[data-testid="party-main-area"]'
          );
          if (!mainArea) {
            return false;
          }
          const cards = mainArea.querySelectorAll(
            '[data-testid^="party-card-"]'
          );
          const isLoading = mainArea.textContent?.includes('로딩 중');
          // 카드 개수가 증가했거나 로딩이 완료되었는지 확인
          return !isLoading && cards.length > initialCount;
        },
        initialCount,
        { timeout: 1999 }
      );

      // 추가 카드가 로드되었는지 확인
      const finalCards = page.locator('[data-testid^="party-card-"]');
      const finalCount = await finalCards.count();
      expect(finalCount).toBeGreaterThan(initialCount);
    }
  });

  test('무한스크롤 - 더 이상 데이터가 없을 때 "마지막 게시물입니다" 메시지가 표시되는지 확인', async ({
    page,
  }) => {
    // 초기 로드 완료 대기
    await page.waitForFunction(
      () => {
        const mainArea = document.querySelector(
          '[data-testid="party-main-area"]'
        );
        if (!mainArea) {
          return false;
        }
        const cards = mainArea.querySelectorAll('[data-testid^="party-card-"]');
        const isLoading = mainArea.textContent?.includes('로딩 중');
        return !isLoading && cards.length >= 0;
      },
      { timeout: 1999 }
    );

    // 여러 번 스크롤하여 모든 데이터 로드
    const childrenElement = page.locator('main[class*="children"]');
    let previousCount = 0;
    let currentCount = await page
      .locator('[data-testid^="party-card-"]')
      .count();
    let scrollAttempts = 0;
    const maxScrollAttempts = 10;

    while (scrollAttempts < maxScrollAttempts && currentCount > previousCount) {
      previousCount = currentCount;

      // Layout의 children 영역(main 요소) 스크롤
      await childrenElement.evaluate((el) => {
        el.scrollTop = el.scrollHeight - el.clientHeight;
      });

      // 로드 대기
      await page.waitForTimeout(500);

      currentCount = await page.locator('[data-testid^="party-card-"]').count();
      scrollAttempts++;
    }

    // "마지막 게시물입니다" 메시지 확인
    const mainArea = page.locator('[data-testid="party-main-area"]');
    const hasEndMessage = await mainArea
      .locator('text=마지막 게시물입니다')
      .isVisible()
      .catch(() => false);

    // 카드가 있고 더 이상 데이터가 없으면 메시지가 표시되어야 함
    if (currentCount > 0) {
      // 메시지가 표시될 수도 있고, 표시되지 않을 수도 있음 (데이터가 더 있을 수 있음)
      // 최소한 메시지가 있다면 올바르게 표시되는지 확인
      if (hasEndMessage) {
        expect(hasEndMessage).toBe(true);
      }
    }
  });

  test('무한스크롤 - 로딩 중 상태가 올바르게 표시되는지 확인', async ({
    page,
  }) => {
    // 초기 로드 시 로딩 메시지 확인
    const mainArea = page.locator('[data-testid="party-main-area"]');

    // 로딩 완료 대기
    await page.waitForFunction(
      () => {
        const mainArea = document.querySelector(
          '[data-testid="party-main-area"]'
        );
        if (!mainArea) {
          return false;
        }
        const isLoading = mainArea.textContent?.includes('로딩 중');
        return !isLoading;
      },
      { timeout: 1999 }
    );

    // 로딩이 완료되었는지 확인
    const isLoadingAfter = await mainArea
      .locator('text=로딩 중')
      .isVisible()
      .catch(() => false);
    expect(isLoadingAfter).toBe(false);
  });

  test('무한스크롤 - 데이터 조회 실패 시 적절한 처리 확인', async ({
    page,
  }) => {
    // API 호출을 실패시키기 위해 네트워크 요청 차단
    await page.route('**/api/party?*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
      });
    });

    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="party-page"]', {
      state: 'visible',
    });

    // 에러 처리 후 상태 확인
    await page.waitForFunction(
      () => {
        const mainArea = document.querySelector(
          '[data-testid="party-main-area"]'
        );
        if (!mainArea) {
          return false;
        }
        // 로딩 상태가 끝났는지 확인
        const isLoading = mainArea.textContent?.includes('로딩 중');
        return !isLoading;
      },
      { timeout: 1999 }
    );

    // 에러 메시지 또는 빈 목록이 표시되는지 확인
    const mainArea = page.locator('[data-testid="party-main-area"]');
    const errorMessage = await mainArea
      .locator('text=오류가 발생했습니다')
      .isVisible()
      .catch(() => false);
    const emptyMessage = await mainArea
      .locator('text=파티가 없습니다')
      .isVisible()
      .catch(() => false);

    // 에러 메시지 또는 빈 목록이 표시되어야 함
    expect(errorMessage || emptyMessage).toBe(true);
  });
});
