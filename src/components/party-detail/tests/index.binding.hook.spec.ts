import { test, expect } from '@playwright/test';

test.describe('파티 상세 데이터 바인딩 기능', () => {
  test('성공시나리오: 실제 파티 ID로 데이터 바인딩 확인', async ({ page }) => {
    // 페이지 컨텍스트에서 Supabase 클라이언트를 사용하여 실제 파티 ID 조회
    // 브라우저 환경에서 직접 import하여 사용
    const validPartyId = await page.evaluate(async () => {
      try {
        // 새로운 API Route를 통해 파티 목록 조회
        // 실제 데이터를 사용 (하드코딩하지 않음)
        const response = await fetch('/api/party?limit=1', {
          method: 'GET',
          credentials: 'include', // HttpOnly 쿠키 포함
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          // 응답 형식: { data: [...] }
          if (
            result.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            return result.data[0].id;
          }
        }
      } catch (err) {
        console.error('파티 ID 조회 실패:', err);
      }
      return null;
    });

    // 유효한 ID를 찾지 못한 경우 테스트 스킵
    if (!validPartyId) {
      // 테스트 실행 시 실제 데이터가 없을 수 있으므로 스킵
      test.skip();
      return;
    }

    // /party/[id] 페이지로 이동
    await page.goto(`/party/${validPartyId}`, {
      waitUntil: 'domcontentloaded',
    });

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 499,
    });

    // 로딩이 완료되고 데이터가 로드될 때까지 대기 (title 요소가 나타날 때까지)
    await page.waitForSelector('[data-testid="party-detail-title"]', {
      state: 'visible',
      timeout: 499,
    });

    // 에러가 표시되지 않았는지 확인
    const errorElement = page.locator('[data-testid="party-detail-error"]');
    const hasError = await errorElement.isVisible().catch(() => false);

    if (hasError) {
      // 에러가 있으면 테스트 실패
      const errorText = await errorElement.textContent();
      throw new Error(`파티 데이터 로드 실패: ${errorText}`);
    }

    // 제목이 존재하는지 확인 (이미 waitForSelector로 대기했으므로 timeout 불필요)
    const titleElement = page.locator('[data-testid="party-detail-title"]');
    await expect(titleElement).toBeVisible();
    const titleText = await titleElement.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText?.trim().length).toBeGreaterThan(0);

    // 게임 제목 확인
    const gameTitleElement = page.locator(
      '[data-testid="party-detail-game-title"]'
    );
    await expect(gameTitleElement).toBeVisible();
    const gameTitleText = await gameTitleElement.textContent();
    expect(gameTitleText).toBeTruthy();
    expect(gameTitleText?.trim().length).toBeGreaterThan(0);

    // 설명 확인
    const descriptionElement = page.locator(
      '[data-testid="party-detail-description"]'
    );
    await expect(descriptionElement).toBeVisible();
    const descriptionText = await descriptionElement.textContent();
    expect(descriptionText).toBeTruthy();

    // 시작 날짜 형식 확인 (mm/dd 형식)
    const dateElement = page.locator('[data-testid="party-detail-start-date"]');
    await expect(dateElement).toBeVisible();
    const dateText = await dateElement.textContent();
    expect(dateText).toMatch(/^\d{2}\/\d{2}$/);

    // 시작 시간 형식 확인 (오전/오후 hh:mm 형식)
    const timeElement = page.locator('[data-testid="party-detail-start-time"]');
    await expect(timeElement).toBeVisible();
    const timeText = await timeElement.textContent();
    expect(timeText).toMatch(/(오전|오후)\s+\d{1,2}:\d{2}/);

    // 최대 인원 확인
    const maxMembersElement = page.locator(
      '[data-testid="party-detail-max-members"]'
    );
    await expect(maxMembersElement).toBeVisible();
    const maxMembersText = await maxMembersElement.textContent();
    expect(maxMembersText).toMatch(/\d+명/);

    // 컨트롤 수준 확인 (한국어 값 중 하나여야 함)
    const controlLevelElement = page.locator(
      '[data-testid="party-detail-control-level"]'
    );
    await expect(controlLevelElement).toBeVisible();
    const controlLevelText = await controlLevelElement.textContent();
    const validControlLevels = ['미숙', '반숙', '완숙', '빡숙', '장인'];
    expect(validControlLevels).toContain(controlLevelText?.trim());

    // 난이도 확인 (한국어 값 중 하나여야 함)
    const difficultyElement = page.locator(
      '[data-testid="party-detail-difficulty"]'
    );
    await expect(difficultyElement).toBeVisible();
    const difficultyText = await difficultyElement.textContent();
    const validDifficulties = ['미정', '유동', '이지', '노멀', '하드', '지옥'];
    expect(validDifficulties).toContain(difficultyText?.trim());

    // 보이스챗 확인
    const voiceChatElement = page.locator(
      '[data-testid="party-detail-voice-chat"]'
    );
    await expect(voiceChatElement).toBeVisible();
    const voiceChatText = await voiceChatElement.textContent();
    const validVoiceChatValues = ['사용 안함', '필수 사용', '선택적 사용'];
    expect(validVoiceChatValues).toContain(voiceChatText?.trim());
  });

  test('실패시나리오: 존재하지 않는 파티 ID로 에러 처리 확인', async ({
    page,
  }) => {
    // 존재하지 않는 ID로 페이지 이동
    const invalidPartyId = 999999;
    await page.goto(`/party/${invalidPartyId}`, {
      waitUntil: 'domcontentloaded',
    });

    // 페이지가 로드될 때까지 대기 (API 호출 시간 고려하여 timeout 조정)
    const pageElement = page.locator('[data-testid="party-detail-page"]');
    await expect(pageElement).toBeVisible({ timeout: 1999 });

    // 에러 표시 확인 (에러 메시지가 표시되어야 함)
    // API 호출 완료 후 에러가 나타날 때까지 대기
    const errorElement = page.locator('[data-testid="party-detail-error"]');
    await expect(errorElement).toBeVisible({ timeout: 1999 });

    // 에러 메시지가 존재하는지 확인
    const errorText = await errorElement.textContent();
    expect(errorText).toBeTruthy();
    expect(errorText?.trim().length).toBeGreaterThan(0);
  });
});
