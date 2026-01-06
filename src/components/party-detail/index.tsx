'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Icon from '@/commons/components/icon';
import { URL_PATHS } from '@/commons/constants/url';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import ChatNull from './ui/chat-null/chatNull';
import ChatRoom from './ui/chat-room/chatRoom';
import MemberList from './ui/member-list/memberList';
import PartyInfo from './ui/party-info/partyInfo';
import { usePartyBinding } from './hooks/index.binding.hook';
import { useLinkUpdateModal } from './hooks/index.link.update.modal.hook';
import { useDeleteParty } from './hooks/index.delete.hook';
import { useJoinParty } from './hooks/index.join.hook';
import { useLeaveParty } from './hooks/index.leave.hook';
import styles from './styles.module.css';

export default function PartyDetail() {
  const [isJoined, setIsJoined] = useState(false);
  const params = useParams();
  const partyId = params?.id as string | undefined;
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = usePartyBinding();
  const { openUpdateModal } = useLinkUpdateModal({ onRefetch: refetch });
  const { openDeleteModal } = useDeleteParty({ onRefetch: refetch });
  const { joinParty } = useJoinParty({ onRefetch: refetch });
  const { leaveParty } = useLeaveParty({ onRefetch: refetch });

  // 작성자 여부 확인
  const isCreator = data?.creator_id === user?.id;

  const handleJoinClick = async () => {
    if (partyId) {
      try {
        await joinParty(partyId);
        // 참여 성공 시 ChatRoom 렌더링
        setIsJoined(true);
      } catch {
        // 에러는 joinParty 내부에서 모달로 처리되므로 여기서는 상태만 유지
        // 참여 실패 시 isJoined는 false로 유지됨
      }
    }
  };

  const handleLeaveClick = async () => {
    if (partyId) {
      try {
        await leaveParty(partyId);
        // 참여 상태가 업데이트되면 자동으로 버튼이 변경됨
        setIsJoined(false);
      } catch {
        // 에러는 leaveParty 내부에서 모달로 처리
      }
    }
  };

  const handleEditClick = () => {
    openUpdateModal();
  };

  const handleDeleteClick = () => {
    openDeleteModal();
  };

  return (
    <div className={styles.container} data-testid="party-detail-page">
      <div className={styles.titleArea}>
        <div className={styles.titleAreaContent}>
          <Link href={URL_PATHS.PARTY} className={styles.backLink}>
            <Icon name="arrow-left" size={24} className={styles.backIcon} />
            <span className={styles.backText}>돌아가기</span>
          </Link>
          <div className={styles.titleRow}>
            <div className={styles.titleContent}>
              {isLoading ? (
                <>
                  <h1 className={styles.title}>로딩 중...</h1>
                  <p className={styles.subtitle}>데이터를 불러오는 중입니다.</p>
                </>
              ) : error ? (
                <>
                  <h1 className={styles.title}>오류 발생</h1>
                  <p
                    className={styles.subtitle}
                    data-testid="party-detail-error"
                  >
                    {error.message}
                  </p>
                </>
              ) : data ? (
                <>
                  <h1 className={styles.title} data-testid="party-detail-title">
                    {data.party_title}
                  </h1>
                  <p
                    className={styles.subtitle}
                    data-testid="party-detail-description"
                  >
                    {data.description}
                  </p>
                </>
              ) : null}
            </div>
            {isCreator && (
              <div className={styles.buttonGroup}>
                <button
                  className={styles.actionButton}
                  type="button"
                  onClick={handleEditClick}
                  data-testid="party-detail-edit-button"
                >
                  <Icon name="edit" size={20} className={styles.buttonIcon} />
                  <span className={styles.buttonText}>수정하기</span>
                </button>
                <button
                  className={styles.actionButton}
                  type="button"
                  onClick={handleDeleteClick}
                  data-testid="party-detail-delete-button"
                >
                  <Icon name="trash" size={20} className={styles.buttonIcon} />
                  <span className={styles.buttonText}>삭제하기</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.mainArea}>
        {isJoined ? <ChatRoom /> : <ChatNull />}
        <div className={styles.sideArea}>
          <MemberList />
          <PartyInfo
            data={data}
            isLoading={isLoading}
            error={error}
            onJoinClick={handleJoinClick}
            onLeaveClick={handleLeaveClick}
            isJoined={isJoined}
          />
        </div>
      </div>
    </div>
  );
}
