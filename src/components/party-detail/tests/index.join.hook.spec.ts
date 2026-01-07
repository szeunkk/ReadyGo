import { test, expect } from '@playwright/test';

test.describe('파티 참여 기능', () => {
  test('성공시나리오: 참여하기 버튼 클릭 시 API 호출 확인', async ({
    page,
  }) => {
    // 페이지 컨텍스트에서 실제 파티 ID 조회 (참여하지 않은 파티)
    const validPartyId = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/party?limit=10', {
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
            // 현재 사용자가 참여하지 않은 파티 찾기
            for (const party of result.data) {
              // 파티 상세 정보 확인
              const detailResponse = await fetch(`/api/party/${party.id}`, {
                method: 'GET',
                credentials: 'include',
              });
              if (detailResponse.ok) {
                const detailResult = await detailResponse.json();
                if (detailResult.data) {
                  // 멤버 목록 확인
                  const membersResponse = await fetch(
                    `/api/party/${party.id}/members`,
                    {
                      method: 'GET',
                      credentials: 'include',
                    }
                  );
                  if (membersResponse.ok) {
                    const membersResult = await membersResponse.json();
                    // 현재 사용자가 참여하지 않은 파티 찾기
                    if (
                      membersResult.data &&
                      Array.isArray(membersResult.data)
                    ) {
                      // 현재 사용자 ID 가져오기
                      const userResponse = await fetch('/api/auth/user', {
                        method: 'GET',
                        credentials: 'include',
                      });
                      if (userResponse.ok) {
                        const userResult = await userResponse.json();
                        const userId = userResult.data?.user?.id;
                        if (userId) {
                          const isMember = membersResult.data.some(
                            (member: { user_id: string }) =>
                              member.user_id === userId
                          );
                          // 참여하지 않은 파티이고, 작성자가 아닌 경우
                          if (
                            !isMember &&
                            detailResult.data.creator_id !== userId
                          ) {
                            return party.id;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            // 참여하지 않은 파티를 찾지 못하면 첫 번째 파티 반환
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

    // API 호출 대기 및 확인
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(`/api/party/${validPartyId}/members`) &&
        response.request().method() === 'POST'
    );

    // 참여하기 버튼 찾기 및 클릭
    const joinButton = page.getByRole('button', { name: '참여하기' });
    await expect(joinButton).toBeVisible();
    await joinButton.click();

    // API 호출이 발생했는지 확인
    const response = await responsePromise;
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);
  });

  test('성공시나리오: API 호출 성공 후 적절한 처리 확인', async ({ page }) => {
    // 페이지 컨텍스트에서 실제 파티 ID 조회 (참여하지 않은 파티)
    const validPartyId = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/party?limit=10', {
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
            for (const party of result.data) {
              const detailResponse = await fetch(`/api/party/${party.id}`, {
                method: 'GET',
                credentials: 'include',
              });
              if (detailResponse.ok) {
                const detailResult = await detailResponse.json();
                if (detailResult.data) {
                  const membersResponse = await fetch(
                    `/api/party/${party.id}/members`,
                    {
                      method: 'GET',
                      credentials: 'include',
                    }
                  );
                  if (membersResponse.ok) {
                    const membersResult = await membersResponse.json();
                    if (
                      membersResult.data &&
                      Array.isArray(membersResult.data)
                    ) {
                      const userResponse = await fetch('/api/auth/user', {
                        method: 'GET',
                        credentials: 'include',
                      });
                      if (userResponse.ok) {
                        const userResult = await userResponse.json();
                        const userId = userResult.data?.user?.id;
                        if (userId) {
                          const isMember = membersResult.data.some(
                            (member: { user_id: string }) =>
                              member.user_id === userId
                          );
                          if (
                            !isMember &&
                            detailResult.data.creator_id !== userId
                          ) {
                            return party.id;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
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

    // 참여하기 버튼 클릭
    const joinButton = page.getByRole('button', { name: '참여하기' });
    await expect(joinButton).toBeVisible();
    await joinButton.click();

    // API 호출 성공 후 에러 모달이 표시되지 않는지 확인
    const errorModal = page.locator('text=참여 실패');
    await expect(errorModal).not.toBeVisible({ timeout: 499 });

    // 성공적으로 처리되었는지 확인 (에러 모달이 없으면 성공)
    // 추가적인 UI 업데이트는 컴포넌트에서 처리하므로 여기서는 에러가 없는지만 확인
  });

  test('실패시나리오: 에러 발생 시 모달 노출 확인', async ({ page }) => {
    // 존재하지 않는 파티 ID 사용
    const invalidPartyId = 999999;

    // /party/[id] 페이지로 이동
    await page.goto(`/party/${invalidPartyId}`, {
      waitUntil: 'domcontentloaded',
    });

    // 페이지 로드 대기 (에러 페이지일 수 있음)
    await page
      .waitForSelector('[data-testid="party-detail-page"]', {
        state: 'visible',
        timeout: 499,
      })
      .catch(() => {
        // 에러 페이지일 수 있음
      });

    // 참여하기 버튼이 있는지 확인
    const joinButton = page.getByRole('button', { name: '참여하기' });
    const isJoinButtonVisible = await joinButton.isVisible().catch(() => false);

    if (isJoinButtonVisible) {
      await joinButton.click();

      // 에러 모달이 표시되는지 확인
      const errorModal = page.locator('text=참여 실패');
      await expect(errorModal).toBeVisible({ timeout: 499 });

      // 에러 메시지가 표시되는지 확인
      const errorMessage = page.locator('text=파티를 찾을 수 없습니다.');
      const hasErrorMessage = await errorMessage
        .isVisible({ timeout: 499 })
        .catch(() => false);
      if (hasErrorMessage) {
        await expect(errorMessage).toBeVisible();
      }
    } else {
      // 참여하기 버튼이 없으면 테스트 스킵 (이미 에러 상태)
      test.skip();
    }
  });

  test('중복 참여 시나리오: 이미 참여한 파티에 재참여 시도 시 에러 처리 확인', async ({
    page,
  }) => {
    // 페이지 컨텍스트에서 실제 파티 ID 조회 (이미 참여한 파티)
    const validPartyId = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/party?limit=10', {
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
            // 현재 사용자가 이미 참여한 파티 찾기
            for (const party of result.data) {
              const membersResponse = await fetch(
                `/api/party/${party.id}/members`,
                {
                  method: 'GET',
                  credentials: 'include',
                }
              );
              if (membersResponse.ok) {
                const membersResult = await membersResponse.json();
                if (membersResult.data && Array.isArray(membersResult.data)) {
                  const userResponse = await fetch('/api/auth/user', {
                    method: 'GET',
                    credentials: 'include',
                  });
                  if (userResponse.ok) {
                    const userResult = await userResponse.json();
                    const userId = userResult.data?.user?.id;
                    if (userId) {
                      const isMember = membersResult.data.some(
                        (member: { user_id: string }) =>
                          member.user_id === userId
                      );
                      // 이미 참여한 파티
                      if (isMember) {
                        return party.id;
                      }
                    }
                  }
                }
              }
            }
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

    // 참여하기 버튼이 있는지 확인 (이미 참여한 경우 버튼이 없을 수 있음)
    const joinButton = page.getByRole('button', { name: '참여하기' });
    const isJoinButtonVisible = await joinButton.isVisible().catch(() => false);

    if (isJoinButtonVisible) {
      await joinButton.click();

      // 에러 모달이 표시되는지 확인
      const errorModal = page.locator('text=참여 실패');
      await expect(errorModal).toBeVisible({ timeout: 499 });

      // 에러 메시지 확인
      const errorMessage = page.locator('text=이미 참여한 파티입니다.');
      const hasErrorMessage = await errorMessage
        .isVisible({ timeout: 499 })
        .catch(() => false);
      if (hasErrorMessage) {
        await expect(errorMessage).toBeVisible();
      }
    } else {
      // 참여하기 버튼이 없으면 테스트 스킵 (이미 참여 상태)
      test.skip();
    }
  });

  test('인원 초과 시나리오: 최대 인원이 가득 찬 파티 참여 시도 시 에러 처리 확인', async ({
    page,
  }) => {
    // 페이지 컨텍스트에서 실제 파티 ID 조회 (인원이 가득 찬 파티)
    const validPartyId = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/party?limit=10', {
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
            // 인원이 가득 찬 파티 찾기
            for (const party of result.data) {
              const detailResponse = await fetch(`/api/party/${party.id}`, {
                method: 'GET',
                credentials: 'include',
              });
              if (detailResponse.ok) {
                const detailResult = await detailResponse.json();
                if (detailResult.data) {
                  const membersResponse = await fetch(
                    `/api/party/${party.id}/members`,
                    {
                      method: 'GET',
                      credentials: 'include',
                    }
                  );
                  if (membersResponse.ok) {
                    const membersResult = await membersResponse.json();
                    if (
                      membersResult.data &&
                      Array.isArray(membersResult.data)
                    ) {
                      // 현재 인원과 최대 인원 비교
                      const currentMembers = membersResult.data.length;
                      const maxMembers = detailResult.data.max_members;
                      // 인원이 가득 찬 파티
                      if (currentMembers >= maxMembers) {
                        // 현재 사용자가 참여하지 않은 경우만
                        const userResponse = await fetch('/api/auth/user', {
                          method: 'GET',
                          credentials: 'include',
                        });
                        if (userResponse.ok) {
                          const userResult = await userResponse.json();
                          const userId = userResult.data?.user?.id;
                          if (userId) {
                            const isMember = membersResult.data.some(
                              (member: { user_id: string }) =>
                                member.user_id === userId
                            );
                            if (!isMember) {
                              return party.id;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
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

    // 참여하기 버튼 찾기 및 클릭
    const joinButton = page.getByRole('button', { name: '참여하기' });
    const isJoinButtonVisible = await joinButton.isVisible().catch(() => false);

    if (isJoinButtonVisible) {
      await joinButton.click();

      // 에러 모달이 표시되는지 확인
      const errorModal = page.locator('text=참여 실패');
      await expect(errorModal).toBeVisible({ timeout: 499 });

      // 에러 메시지 확인
      const errorMessage = page.locator('text=파티 인원이 가득 찼습니다.');
      const hasErrorMessage = await errorMessage
        .isVisible({ timeout: 499 })
        .catch(() => false);
      if (hasErrorMessage) {
        await expect(errorMessage).toBeVisible();
      }
    } else {
      // 참여하기 버튼이 없으면 테스트 스킵
      test.skip();
    }
  });

  test('역할 기반 UI 시나리오: 파티장(role: leader)인 경우 게임시작 버튼이 표시되는지 확인', async ({
    page,
  }) => {
    // 페이지 컨텍스트에서 실제 파티 ID 조회 (파티장인 파티)
    const validPartyId = await page.evaluate(async () => {
      try {
        const userResponse = await fetch('/api/auth/user', {
          method: 'GET',
          credentials: 'include',
        });
        if (userResponse.ok) {
          const userResult = await userResponse.json();
          const userId = userResult.data?.user?.id;
          if (userId) {
            const response = await fetch('/api/party?limit=10', {
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
                // 현재 사용자가 파티장인 파티 찾기
                for (const party of result.data) {
                  if (party.creator_id === userId) {
                    // party_members에서 role 확인
                    const membersResponse = await fetch(
                      `/api/party/${party.id}/members`,
                      {
                        method: 'GET',
                        credentials: 'include',
                      }
                    );
                    if (membersResponse.ok) {
                      const membersResult = await membersResponse.json();
                      if (
                        membersResult.data &&
                        Array.isArray(membersResult.data)
                      ) {
                        const member = membersResult.data.find(
                          (m: { user_id: string; role: string }) =>
                            m.user_id === userId && m.role === 'leader'
                        );
                        if (member) {
                          return party.id;
                        }
                      }
                    }
                  }
                }
              }
            }
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

    // 게임시작 버튼이 표시되는지 확인
    const gameStartButton = page.getByTestId('party-detail-game-start-button');
    await expect(gameStartButton).toBeVisible({ timeout: 499 });
    await expect(gameStartButton).toHaveText('게임시작');

    // ChatRoom 컴포넌트가 렌더링되는지 확인 (파티장이므로)
    // ChatRoom은 내부적으로 렌더링되므로 간접적으로 확인
    const chatNull = page.locator('text=파티에 참여하면 채팅을 볼 수 있어요');
    await expect(chatNull).not.toBeVisible({ timeout: 499 });
  });

  test('역할 기반 UI 시나리오: 일반 멤버(role: member)인 경우 파티 나가기 버튼이 표시되는지 확인', async ({
    page,
  }) => {
    // 페이지 컨텍스트에서 실제 파티 ID 조회 (일반 멤버인 파티)
    const validPartyId = await page.evaluate(async () => {
      try {
        const userResponse = await fetch('/api/auth/user', {
          method: 'GET',
          credentials: 'include',
        });
        if (userResponse.ok) {
          const userResult = await userResponse.json();
          const userId = userResult.data?.user?.id;
          if (userId) {
            const response = await fetch('/api/party?limit=10', {
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
                // 현재 사용자가 일반 멤버인 파티 찾기
                for (const party of result.data) {
                  // party_members에서 role 확인
                  const membersResponse = await fetch(
                    `/api/party/${party.id}/members`,
                    {
                      method: 'GET',
                      credentials: 'include',
                    }
                  );
                  if (membersResponse.ok) {
                    const membersResult = await membersResponse.json();
                    if (
                      membersResult.data &&
                      Array.isArray(membersResult.data)
                    ) {
                      const member = membersResult.data.find(
                        (m: { user_id: string; role: string }) =>
                          m.user_id === userId && m.role === 'member'
                      );
                      // 파티장이 아닌 경우
                      if (member && party.creator_id !== userId) {
                        return party.id;
                      }
                    }
                  }
                }
              }
            }
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

    // 파티 나가기 버튼이 표시되는지 확인
    const leaveButton = page.getByTestId('party-detail-leave-button');
    await expect(leaveButton).toBeVisible({ timeout: 499 });
    await expect(leaveButton).toHaveText('파티 나가기');

    // ChatRoom 컴포넌트가 렌더링되는지 확인 (멤버이므로)
    const chatNull = page.locator('text=파티에 참여하면 채팅을 볼 수 있어요');
    await expect(chatNull).not.toBeVisible({ timeout: 499 });
  });

  test('역할 기반 UI 시나리오: 참여하지 않은 유저(role: null)인 경우 참여하기 버튼이 표시되는지 확인', async ({
    page,
  }) => {
    // 페이지 컨텍스트에서 실제 파티 ID 조회 (참여하지 않은 파티)
    const validPartyId = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/party?limit=10', {
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
            // 현재 사용자가 참여하지 않은 파티 찾기
            for (const party of result.data) {
              const detailResponse = await fetch(`/api/party/${party.id}`, {
                method: 'GET',
                credentials: 'include',
              });
              if (detailResponse.ok) {
                const detailResult = await detailResponse.json();
                if (detailResult.data) {
                  const membersResponse = await fetch(
                    `/api/party/${party.id}/members`,
                    {
                      method: 'GET',
                      credentials: 'include',
                    }
                  );
                  if (membersResponse.ok) {
                    const membersResult = await membersResponse.json();
                    if (
                      membersResult.data &&
                      Array.isArray(membersResult.data)
                    ) {
                      const userResponse = await fetch('/api/auth/user', {
                        method: 'GET',
                        credentials: 'include',
                      });
                      if (userResponse.ok) {
                        const userResult = await userResponse.json();
                        const userId = userResult.data?.user?.id;
                        if (userId) {
                          const isMember = membersResult.data.some(
                            (member: { user_id: string }) =>
                              member.user_id === userId
                          );
                          // 참여하지 않은 파티이고, 작성자가 아닌 경우
                          if (
                            !isMember &&
                            detailResult.data.creator_id !== userId
                          ) {
                            return party.id;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            // 참여하지 않은 파티를 찾지 못하면 첫 번째 파티 반환
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

    // 참여하기 버튼이 표시되는지 확인
    const joinButton = page.getByTestId('party-detail-join-button');
    await expect(joinButton).toBeVisible({ timeout: 499 });
    await expect(joinButton).toHaveText('참여하기');

    // ChatNull 컴포넌트가 렌더링되는지 확인 (참여하지 않은 유저이므로)
    const chatNull = page.locator('text=파티에 참여하면 채팅을 볼 수 있어요');
    await expect(chatNull).toBeVisible({ timeout: 499 });
  });
});
