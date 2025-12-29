import { test, expect } from '@playwright/test';

test.describe('파티 상세 데이터 바인딩 기능', () => {
  test('성공시나리오: 실제 파티 ID로 데이터 바인딩 확인', async ({ page }) => {
    // 페이지 컨텍스트에서 Supabase 클라이언트를 사용하여 실제 파티 ID 조회
    // 브라우저 환경에서 직접 import하여 사용
    const validPartyId = await page.evaluate(async () => {
      try {
        // 브라우저 환경에서 동적으로 모듈 로드
        // 실제 페이지에서는 이미 Supabase 클라이언트가 초기화되어 있을 수 있음
        // 페이지에서 직접 API 호출을 통해 데이터 조회
        const response = await fetch('/api/party/first', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data.id;
        }

        // API가 없으면 직접 Supabase 사용 시도
        // window 객체에서 환경 변수 확인
        // @ts-expect-error - 브라우저 환경에서 window 객체 타입 확장
        const supabaseUrl = window.__NEXT_DATA__?.env?.NEXT_PUBLIC_SUPABASE_URL;
        // @ts-expect-error - 브라우저 환경에서 window 객체 타입 확장
        const supabaseAnonKey =
          window.__NEXT_DATA__?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnonKey) {
          // @ts-expect-error - 브라우저 환경에서 동적 import
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          const { data, error } = await supabase
            .from('party_posts')
            .select('id')
            .limit(1)
            .single();

          if (!error && data) {
            return data.id;
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
    const hasError = await errorElement
      .isVisible({ timeout: 499 })
      .catch(() => false);

    if (hasError) {
      // 에러가 있으면 테스트 실패
      const errorText = await errorElement.textContent();
      throw new Error(`파티 데이터 로드 실패: ${errorText}`);
    }

    // 제목이 존재하는지 확인
    const titleElement = page.locator('[data-testid="party-detail-title"]');
    await expect(titleElement).toBeVisible({ timeout: 499 });
    const titleText = await titleElement.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText?.trim().length).toBeGreaterThan(0);

    // 게임 제목 확인
    const gameTitleElement = page.locator(
      '[data-testid="party-detail-game-title"]'
    );
    await expect(gameTitleElement).toBeVisible({ timeout: 499 });
    const gameTitleText = await gameTitleElement.textContent();
    expect(gameTitleText).toBeTruthy();
    expect(gameTitleText?.trim().length).toBeGreaterThan(0);

    // 설명 확인
    const descriptionElement = page.locator(
      '[data-testid="party-detail-description"]'
    );
    await expect(descriptionElement).toBeVisible({ timeout: 499 });
    const descriptionText = await descriptionElement.textContent();
    expect(descriptionText).toBeTruthy();

    // 시작 날짜 형식 확인 (mm/dd 형식)
    const dateElement = page.locator('[data-testid="party-detail-start-date"]');
    await expect(dateElement).toBeVisible({ timeout: 499 });
    const dateText = await dateElement.textContent();
    expect(dateText).toMatch(/^\d{2}\/\d{2}$/);

    // 시작 시간 형식 확인 (오전/오후 hh:mm 형식)
    const timeElement = page.locator('[data-testid="party-detail-start-time"]');
    await expect(timeElement).toBeVisible({ timeout: 499 });
    const timeText = await timeElement.textContent();
    expect(timeText).toMatch(/(오전|오후)\s+\d{1,2}:\d{2}/);

    // 최대 인원 확인
    const maxMembersElement = page.locator(
      '[data-testid="party-detail-max-members"]'
    );
    await expect(maxMembersElement).toBeVisible({ timeout: 499 });
    const maxMembersText = await maxMembersElement.textContent();
    expect(maxMembersText).toMatch(/\d+명/);

    // 컨트롤 수준 확인 (한국어 값 중 하나여야 함)
    const controlLevelElement = page.locator(
      '[data-testid="party-detail-control-level"]'
    );
    await expect(controlLevelElement).toBeVisible({ timeout: 499 });
    const controlLevelText = await controlLevelElement.textContent();
    const validControlLevels = ['미숙', '반숙', '완숙', '빡숙', '장인'];
    expect(validControlLevels).toContain(controlLevelText?.trim());

    // 난이도 확인 (한국어 값 중 하나여야 함)
    const difficultyElement = page.locator(
      '[data-testid="party-detail-difficulty"]'
    );
    await expect(difficultyElement).toBeVisible({ timeout: 499 });
    const difficultyText = await difficultyElement.textContent();
    const validDifficulties = ['미정', '유동', '이지', '노멀', '하드', '지옥'];
    expect(validDifficulties).toContain(difficultyText?.trim());

    // 보이스챗 확인
    const voiceChatElement = page.locator(
      '[data-testid="party-detail-voice-chat"]'
    );
    await expect(voiceChatElement).toBeVisible({ timeout: 499 });
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

    // 페이지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 499,
    });

    // 에러 표시 확인 (에러 메시지가 표시되어야 함)
    // 에러가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="party-detail-error"]', {
      state: 'visible',
      timeout: 499,
    });

    const errorElement = page.locator('[data-testid="party-detail-error"]');
    const isErrorVisible = await errorElement.isVisible().catch(() => false);

    // 에러가 표시되어야 함
    expect(isErrorVisible).toBeTruthy();

    // 에러 메시지가 존재하는지 확인
    if (isErrorVisible) {
      const errorText = await errorElement.textContent();
      expect(errorText).toBeTruthy();
      expect(errorText?.trim().length).toBeGreaterThan(0);
    }
  });
});
