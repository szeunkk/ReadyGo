import { test, expect } from '@playwright/test';

/**
 * Traits 설문 E2E 테스트
 * 실제 UI(/traits)를 통한 통합 테스트
 * 
 * 테스트 대상:
 * - 설문 진행 흐름 (next/prev)
 * - 답변 선택 및 저장
 * - 스케줄 질문 처리
 * - 진행률 표시
 * - 전체 설문 완료
 */

test.describe('Traits Survey E2E: 설문 기본 흐름', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/traits');
    await page.waitForSelector('[data-testid="survey-step-counter"]');
  });

  test('초기 상태: 첫 번째 질문이 표시된다', async ({ page }) => {
    const stepCounter = await page.textContent('[data-testid="survey-step-counter"]');
    const progress = await page.textContent('[data-testid="survey-progress"]');

    expect(stepCounter).toContain('1 /');
    expect(progress).toBe('0%');
  });

  test('답변 선택: 답변 버튼 클릭 시 자동으로 다음 질문으로 이동', async ({ page }) => {
    const initialStep = await page.textContent('[data-testid="survey-step-counter"]');
    
    // 첫 번째 답변 선택 (5점)
    await page.click('[data-testid="answer-button-5"]');
    
    // 자동 이동 대기 (300ms 애니메이션)
    await page.waitForTimeout(400);
    
    const nextStep = await page.textContent('[data-testid="survey-step-counter"]');
    
    expect(initialStep).not.toBe(nextStep);
  });

  test('이전 버튼: 이전 질문으로 이동', async ({ page }) => {
    // 첫 번째 질문에서 답변
    await page.click('[data-testid="answer-button-5"]');
    await page.waitForTimeout(400);
    
    // 두 번째 질문에서 이전 버튼 클릭
    await page.click('[data-testid="survey-prev-button"]');
    
    const stepCounter = await page.textContent('[data-testid="survey-step-counter"]');
    expect(stepCounter).toContain('1 /');
  });

  test('이전 버튼 비활성화: 첫 번째 질문에서는 이전 버튼이 비활성화', async ({ page }) => {
    const prevButton = page.locator('[data-testid="survey-prev-button"]');
    
    await expect(prevButton).toBeDisabled();
  });

  test('진행률: 답변 진행에 따라 진행률이 증가', async ({ page }) => {
    const initialProgress = await page.textContent('[data-testid="survey-progress"]');
    
    // 답변 선택
    await page.click('[data-testid="answer-button-5"]');
    await page.waitForTimeout(400);
    
    const newProgress = await page.textContent('[data-testid="survey-progress"]');
    
    const initial = parseInt(initialProgress || '0');
    const updated = parseInt(newProgress || '0');
    
    expect(updated).toBeGreaterThan(initial);
  });

  test('답변 유지: 이전/다음 이동 시 선택한 답변이 유지됨', async ({ page }) => {
    // 5점 답변 선택
    await page.click('[data-testid="answer-button-5"]');
    await page.waitForTimeout(400);
    
    // 이전으로 돌아가기
    await page.click('[data-testid="survey-prev-button"]');
    await page.waitForTimeout(200);
    
    // 선택된 버튼 확인
    const selectedButton = page.locator('[data-testid="answer-button-5"]');
    await expect(selectedButton).toHaveClass(/answerButtonSelected/);
  });
});

test.describe('Traits Survey E2E: 스케줄 질문', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/traits');
    await page.waitForSelector('[data-testid="survey-step-counter"]');
  });

  test('스케줄 질문 도달: 마지막 질문은 스케줄 질문', async ({ page }) => {
    // 총 단계 수 확인
    const stepCounter = await page.textContent('[data-testid="survey-step-counter"]');
    const totalSteps = parseInt(stepCounter?.split('/')[1]?.trim() || '0');

    // 마지막 질문까지 이동 (마지막 - 1까지)
    await Array.from({ length: totalSteps - 1 }).reduce(async (prev) => {
      await prev;
      await page.click('[data-testid="answer-button-5"]');
      await page.waitForTimeout(400);
    }, Promise.resolve());

    // 스케줄 질문인지 확인 (요일 버튼 존재)
    const weekdayButton = page.locator('[data-testid="schedule-day-weekday"]');
    await expect(weekdayButton).toBeVisible();
  });

  test('스케줄 선택: 요일과 시간대 선택 시 자동 완료', async ({ page }) => {
    // 총 단계 수 확인
    const stepCounter = await page.textContent('[data-testid="survey-step-counter"]');
    const totalSteps = parseInt(stepCounter?.split('/')[1]?.trim() || '0');

    // 스케줄 질문까지 이동
    await Array.from({ length: totalSteps - 1 }).reduce(async (prev) => {
      await prev;
      await page.click('[data-testid="answer-button-5"]');
      await page.waitForTimeout(400);
    }, Promise.resolve());

    // 요일 선택
    await page.click('[data-testid="schedule-day-weekday"]');
    
    // 시간대 선택
    await page.click('[data-testid="schedule-time-evening"]');
    
    // 자동 완료 대기
    await page.waitForTimeout(400);

    // 결과 페이지로 이동했는지 확인 (URL 확인)
    await expect(page).toHaveURL(/\/traits\/result/);
  });
});

test.describe('Traits Survey E2E: 전체 설문 완료', () => {
  test('전체 시나리오: 모든 질문에 답변하고 결과 페이지 도달', async ({ page }) => {
    await page.goto('/traits');
    await page.waitForSelector('[data-testid="survey-step-counter"]');

    // 총 단계 수 확인
    const stepCounter = await page.textContent('[data-testid="survey-step-counter"]');
    const totalSteps = parseInt(stepCounter?.split('/')[1]?.trim() || '0');

    // 일반 질문들 답변 (마지막 스케줄 제외)
    await Array.from({ length: totalSteps - 1 }).reduce(async (prev) => {
      await prev;
      // 랜덤하게 1~5 선택
      const answer = Math.floor(Math.random() * 5) + 1;
      await page.click(`[data-testid="answer-button-${answer}"]`);
      await page.waitForTimeout(400);
    }, Promise.resolve());

    // 스케줄 질문 답변
    await page.click('[data-testid="schedule-day-weekday"]');
    await page.click('[data-testid="schedule-time-evening"]');
    await page.waitForTimeout(400);

    // 결과 페이지 도달 확인
    await expect(page).toHaveURL(/\/traits\/result/);
  });

  test('부분 완료: 중간에 멈춰도 답변은 유지됨', async ({ page }) => {
    await page.goto('/traits');
    await page.waitForSelector('[data-testid="survey-step-counter"]');

    // 3개 질문만 답변
    await page.click('[data-testid="answer-button-5"]');
    await page.waitForTimeout(400);
    
    await page.click('[data-testid="answer-button-3"]');
    await page.waitForTimeout(400);
    
    await page.click('[data-testid="answer-button-4"]');
    await page.waitForTimeout(400);

    // 이전으로 2번 이동
    await page.click('[data-testid="survey-prev-button"]');
    await page.waitForTimeout(200);
    
    await page.click('[data-testid="survey-prev-button"]');
    await page.waitForTimeout(200);

    // 첫 번째 답변이 유지되는지 확인
    const firstAnswer = page.locator('[data-testid="answer-button-5"]');
    await expect(firstAnswer).toHaveClass(/answerButtonSelected/);
  });
});

test.describe('Traits Survey E2E: 다양한 답변 패턴', () => {
  test('모두 최고점: 모든 질문에 5점으로 답변', async ({ page }) => {
    await page.goto('/traits');
    await page.waitForSelector('[data-testid="survey-step-counter"]');

    const stepCounter = await page.textContent('[data-testid="survey-step-counter"]');
    const totalSteps = parseInt(stepCounter?.split('/')[1]?.trim() || '0');

    // 모든 일반 질문에 5점
    await Array.from({ length: totalSteps - 1 }).reduce(async (prev) => {
      await prev;
      await page.click('[data-testid="answer-button-5"]');
      await page.waitForTimeout(400);
    }, Promise.resolve());

    // 스케줄 선택
    await page.click('[data-testid="schedule-day-weekend"]');
    await page.click('[data-testid="schedule-time-dawn"]');
    await page.waitForTimeout(400);

    await expect(page).toHaveURL(/\/traits\/result/);
  });

  test('모두 중립: 모든 질문에 3점으로 답변', async ({ page }) => {
    await page.goto('/traits');
    await page.waitForSelector('[data-testid="survey-step-counter"]');

    const stepCounter = await page.textContent('[data-testid="survey-step-counter"]');
    const totalSteps = parseInt(stepCounter?.split('/')[1]?.trim() || '0');

    // 모든 일반 질문에 3점
    await Array.from({ length: totalSteps - 1 }).reduce(async (prev) => {
      await prev;
      await page.click('[data-testid="answer-button-3"]');
      await page.waitForTimeout(400);
    }, Promise.resolve());

    // 스케줄 선택
    await page.click('[data-testid="schedule-day-weekday"]');
    await page.click('[data-testid="schedule-time-afternoon"]');
    await page.waitForTimeout(400);

    await expect(page).toHaveURL(/\/traits\/result/);
  });
});

