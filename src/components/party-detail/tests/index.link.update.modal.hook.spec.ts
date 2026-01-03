import { test, expect } from '@playwright/test';

test.describe('파티 수정 모달 열기 기능', () => {
  test('성공시나리오: 수정하기 버튼 클릭 시 모달이 열리고 수정 모드로 표시됨', async ({
    page,
  }) => {
    // 페이지 컨텍스트에서 실제 파티 ID 조회
    const validPartyId = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/party?limit=1', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
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

    // 로딩이 완료되고 데이터가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="party-detail-title"]', {
      state: 'visible',
      timeout: 499,
    });

    // 수정하기 버튼 찾기 및 클릭
    const editButton = page.locator('[data-testid="party-detail-edit-button"]');
    await expect(editButton).toBeVisible();
    await editButton.click();

    // 모달이 열렸는지 확인 (PartySubmit 컴포넌트가 표시되어야 함)
    // 모달의 제목이 "파티 수정하기"로 표시되는지 확인
    const modalTitle = page.locator('[data-testid="party-submit-modal-title"]');
    await expect(modalTitle).toBeVisible({ timeout: 499 });
    const modalTitleText = await modalTitle.textContent();
    expect(modalTitleText).toBe('파티 수정하기');

    // 모달이 표시되었는지 확인 (party-submit 컨테이너)
    const modalContainer = page.locator('[data-testid="party-submit-modal"]');
    await expect(modalContainer).toBeVisible({ timeout: 499 });

    // 로딩이 완료될 때까지 대기 (data-testid 사용)
    const loadingElement = page.locator('[data-testid="party-submit-loading"]');
    await loadingElement.waitFor({ state: 'hidden', timeout: 499 }).catch(() => {
      // 로딩 요소가 없으면 이미 로드된 것으로 간주
    });

    // 폼 필드들이 채워져 있는지 확인
    // 파티 제목 필드 확인
    const partyTitleInput = page.locator(
      '[data-testid="party-submit-party-title"]'
    );
    await expect(partyTitleInput).toBeVisible({ timeout: 499 });
    const partyTitleValue = await partyTitleInput.inputValue();
    expect(partyTitleValue).toBeTruthy();
    expect(partyTitleValue.trim().length).toBeGreaterThan(0);

    // 설명 필드 확인
    const descriptionInput = page.locator(
      '[data-testid="party-submit-description"]'
    );
    await expect(descriptionInput).toBeVisible({ timeout: 499 });
    const descriptionValue = await descriptionInput.inputValue();
    expect(descriptionValue).toBeTruthy();
    expect(descriptionValue.trim().length).toBeGreaterThan(0);

    // 모달 닫기 버튼 클릭하여 모달 닫기
    const closeButton = page.locator(
      '[data-testid="party-submit-close-button"]'
    );
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // 모달이 닫혔는지 확인
    await expect(modalTitle).not.toBeVisible({ timeout: 499 });
  });

  test('성공시나리오: 모달 내 모든 필드가 파티 데이터로 채워져 있음', async ({
    page,
  }) => {
    // 페이지 컨텍스트에서 실제 파티 ID 조회
    const validPartyId = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/party?limit=1', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
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

    if (!validPartyId) {
      test.skip();
      return;
    }

    // 파티 데이터 조회
    const partyData = await page.evaluate(
      async (id) => {
        try {
          const response = await fetch(`/api/party/${id}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (response.ok) {
            const result = await response.json();
            return result.data;
          }
        } catch (err) {
          console.error('파티 데이터 조회 실패:', err);
        }
        return null;
      },
      validPartyId
    );

    if (!partyData) {
      test.skip();
      return;
    }

    // /party/[id] 페이지로 이동
    await page.goto(`/party/${validPartyId}`, {
      waitUntil: 'domcontentloaded',
    });

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="party-detail-page"]', {
      state: 'visible',
      timeout: 499,
    });

    await page.waitForSelector('[data-testid="party-detail-title"]', {
      state: 'visible',
      timeout: 499,
    });

    // 수정하기 버튼 클릭
    const editButton = page.locator('[data-testid="party-detail-edit-button"]');
    await expect(editButton).toBeVisible();
    await editButton.click();

    // 모달이 열렸는지 확인
    const modalTitle = page.locator('[data-testid="party-submit-modal-title"]');
    await expect(modalTitle).toBeVisible({ timeout: 499 });
    const modalTitleText = await modalTitle.textContent();
    expect(modalTitleText).toBe('파티 수정하기');

    // 로딩이 완료될 때까지 대기 (data-testid 사용)
    const loadingElement = page.locator('[data-testid="party-submit-loading"]');
    await loadingElement.waitFor({ state: 'hidden', timeout: 499 }).catch(() => {
      // 로딩 요소가 없으면 이미 로드된 것으로 간주
    });

    // 폼 필드 값 확인
    // 파티 제목 확인
    const partyTitleInput = page.locator(
      '[data-testid="party-submit-party-title"]'
    );
    await expect(partyTitleInput).toBeVisible({ timeout: 499 });
    const partyTitleValue = await partyTitleInput.inputValue();
    expect(partyTitleValue).toBe(partyData.party_title);

    // 설명 확인
    const descriptionInput = page.locator(
      '[data-testid="party-submit-description"]'
    );
    await expect(descriptionInput).toBeVisible({ timeout: 499 });
    const descriptionValue = await descriptionInput.inputValue();
    expect(descriptionValue).toBe(partyData.description);

    // 최대 인원 확인
    const maxMembersElement = page.locator(
      '[data-testid="party-submit-max-members"]'
    );
    await expect(maxMembersElement).toBeVisible({ timeout: 499 });
    const maxMembersText = await maxMembersElement.textContent();
    expect(maxMembersText).toBe(partyData.max_members.toString());
  });
});

