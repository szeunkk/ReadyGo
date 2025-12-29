import { test, expect } from '@playwright/test';

/**
 * POST /api/traits/submit API 테스트
 * 
 * 테스트 전제:
 * - 실제 Supabase Auth 사용 (mock 금지)
 * - 실제 데이터로 테스트
 * - API 응답 결과를 하드코딩하지 않음
 */

test.describe('POST /api/traits/submit', () => {
  const validPayload = {
    traits: {
      cooperation: 75,
      exploration: 60,
      strategy: 85,
      leadership: 70,
      social: 50,
    },
    animalType: 'fox',
    dayTypes: ['weekday', 'weekend'],
    timeSlots: ['morning', 'evening'],
  };

  test('401: 인증되지 않은 요청은 거부된다', async ({ request }) => {
    const response = await request.post('/api/traits/submit', {
      data: validPayload,
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('400: user_id가 body에 포함된 경우 거부된다', async ({ request, page }) => {
    // 테스트용으로 실제 인증이 필요하므로 skip
    test.skip(true, 'Requires actual authentication setup');
    
    await page.goto('/login');
    // 실제 로그인 후 세션 쿠키 획득 필요
    
    const payloadWithUserId = {
      ...validPayload,
      user_id: 'some-user-id',
    };

    const response = await request.post('/api/traits/submit', {
      data: payloadWithUserId,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toContain('user_id is not allowed');
  });

  test('400: traits가 누락된 경우 거부된다', async ({ request }) => {
    const invalidPayload = {
      animalType: 'fox',
      dayTypes: ['weekday'],
      timeSlots: ['morning'],
    };

    const response = await request.post('/api/traits/submit', {
      data: invalidPayload,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('400: traits 값이 범위를 벗어난 경우 거부된다', async ({ request }) => {
    const invalidPayload = {
      ...validPayload,
      traits: {
        cooperation: 150, // 범위 초과
        exploration: -10, // 음수
        strategy: 85,
        leadership: 70,
        social: 50,
      },
    };

    const response = await request.post('/api/traits/submit', {
      data: invalidPayload,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('400: animalType이 유효하지 않은 경우 거부된다', async ({ request }) => {
    const invalidPayload = {
      ...validPayload,
      animalType: 'invalid_animal',
    };

    const response = await request.post('/api/traits/submit', {
      data: invalidPayload,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('400: dayTypes가 유효하지 않은 경우 거부된다', async ({ request }) => {
    const invalidPayload = {
      ...validPayload,
      dayTypes: ['invalid_day'],
    };

    const response = await request.post('/api/traits/submit', {
      data: invalidPayload,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('400: timeSlots가 유효하지 않은 경우 거부된다', async ({ request }) => {
    const invalidPayload = {
      ...validPayload,
      timeSlots: ['invalid_time'],
    };

    const response = await request.post('/api/traits/submit', {
      data: invalidPayload,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test.skip('200: 유효한 요청은 성공한다 (인증 필요)', async ({ request, page }) => {
    // 실제 인증 후 테스트해야 하므로 skip
    // 실제 환경에서는 beforeEach에서 로그인 처리 필요
    
    await page.goto('/login');
    // 실제 로그인 후 세션 쿠키 획득
    
    const response = await request.post('/api/traits/submit', {
      data: validPayload,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ ok: true });
  });

  test.skip('200: 빈 schedule(dayTypes/timeSlots)도 허용된다', async ({ request, page }) => {
    await page.goto('/login');
    
    const payloadWithEmptySchedule = {
      ...validPayload,
      dayTypes: [],
      timeSlots: [],
    };

    const response = await request.post('/api/traits/submit', {
      data: payloadWithEmptySchedule,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ ok: true });
  });

  test.skip('200: 동일 유저 재요청 시 데이터가 갱신된다', async ({ request, page }) => {
    await page.goto('/login');
    
    // 첫 번째 요청
    const firstPayload = {
      ...validPayload,
      animalType: 'wolf',
    };
    
    const firstResponse = await request.post('/api/traits/submit', {
      data: firstPayload,
    });
    expect(firstResponse.status()).toBe(200);
    
    // 두 번째 요청 (다른 animal_type)
    const secondPayload = {
      ...validPayload,
      animalType: 'fox',
    };
    
    const secondResponse = await request.post('/api/traits/submit', {
      data: secondPayload,
    });
    expect(secondResponse.status()).toBe(200);
    
    // DB에서 최종 값 확인 필요 (실제 구현 시)
  });
});

