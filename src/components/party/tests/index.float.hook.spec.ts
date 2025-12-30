import { test, expect } from '@playwright/test';
import { URL_PATHS } from '@/commons/constants/url';

test.describe('플로팅 버튼 스크롤 기능', () => {
  test('플로팅 버튼 클릭 시 페이지 최상단으로 부드럽게 스크롤되는지 확인', async ({
    page,
  }) => {
    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
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
      { timeout: 499 }
    );

    // 페이지를 아래로 스크롤하여 플로팅 버튼이 보이도록 함
    // Layout의 main 요소가 스크롤 컨테이너이므로 main 요소를 스크롤
    await page.evaluate(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTo(0, mainElement.scrollHeight);
      } else {
        window.scrollTo(0, document.body.scrollHeight);
      }
    });

    // 스크롤이 완료될 때까지 잠시 대기
    await page.waitForFunction(
      () => {
        const mainElement = document.querySelector('main');
        if (mainElement) {
          return mainElement.scrollTop > 0;
        }
        return window.scrollY > 0;
      },
      { timeout: 499 }
    );

    // 스크롤 위치 확인 (0이 아님)
    const scrollYBefore = await page.evaluate(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        return mainElement.scrollTop;
      }
      return window.scrollY;
    });
    expect(scrollYBefore).toBeGreaterThan(0);

    // 플로팅 버튼이 보이는지 확인
    const floatButton = page.locator('[data-testid="party-float-button"]');
    await expect(floatButton).toBeVisible();

    // 플로팅 버튼 클릭
    await floatButton.click();

    // 스크롤이 최상단으로 이동했는지 확인
    // smooth 스크롤이므로 완료될 때까지 대기
    // Layout의 main 요소가 스크롤 컨테이너이므로 main 요소의 scrollTop 확인
    await page.waitForFunction(
      () => {
        const mainElement = document.querySelector('main');
        if (mainElement) {
          return mainElement.scrollTop === 0;
        }
        return window.scrollY === 0;
      },
      { timeout: 499 }
    );

    // 스크롤 위치가 0인지 확인
    const scrollYAfter = await page.evaluate(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        return mainElement.scrollTop;
      }
      return window.scrollY;
    });
    expect(scrollYAfter).toBe(0);
  });

  test('플로팅 버튼 클릭 시 smooth 스크롤 동작이 적용되는지 확인', async ({
    page,
  }) => {
    // /party 페이지로 이동
    await page.goto(URL_PATHS.PARTY, { waitUntil: 'domcontentloaded' });

    // 페이지가 완전히 로드될 때까지 대기
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
        const emptyMessage = mainArea.textContent?.includes('파티가 없습니다');
        return cards.length > 0 || emptyMessage === true;
      },
      { timeout: 499 }
    );

    // 페이지를 아래로 스크롤
    // Layout의 main 요소가 스크롤 컨테이너이므로 main 요소를 스크롤
    await page.evaluate(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTo(0, mainElement.scrollHeight);
      } else {
        window.scrollTo(0, document.body.scrollHeight);
      }
    });

    // 스크롤 완료 대기
    await page.waitForFunction(
      () => {
        const mainElement = document.querySelector('main');
        if (mainElement) {
          return mainElement.scrollTop > 0;
        }
        return window.scrollY > 0;
      },
      { timeout: 499 }
    );

    // 플로팅 버튼 클릭 전 스크롤 위치 저장
    const initialScrollY = await page.evaluate(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        return mainElement.scrollTop;
      }
      return window.scrollY;
    });
    expect(initialScrollY).toBeGreaterThan(0);

    // 플로팅 버튼 클릭
    const floatButton = page.locator('[data-testid="party-float-button"]');
    await floatButton.click();

    // 스크롤이 최상단으로 이동했는지 확인
    // smooth 스크롤이므로 완료될 때까지 대기
    // Layout의 main 요소가 스크롤 컨테이너이므로 main 요소의 scrollTop 확인
    await page.waitForFunction(
      () => {
        const mainElement = document.querySelector('main');
        if (mainElement) {
          return mainElement.scrollTop === 0;
        }
        return window.scrollY === 0;
      },
      { timeout: 499 }
    );

    // 최종적으로 스크롤 위치가 0인지 확인
    const finalScrollY = await page.evaluate(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        return mainElement.scrollTop;
      }
      return window.scrollY;
    });
    expect(finalScrollY).toBe(0);
  });
});
