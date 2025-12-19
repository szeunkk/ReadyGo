'use client';

/**
 * ModalProvider 사용 예제
 *
 * 이 파일은 중첩 모달 기능을 테스트하기 위한 예제입니다.
 * 실제 프로젝트에서는 필요에 따라 삭제하거나 참고용으로 사용하세요.
 */

import React from 'react';
import { useModal } from './modal.provider';

export function ModalExample() {
  const { openModal, closeModal, modalCount } = useModal();

  // 단일 모달 예제
  const handleSingleModal = () => {
    openModal({
      variant: 'single',
      title: '알림',
      description: '단일 버튼 모달입니다.',
      confirmText: '확인',
      onConfirm: () => {
        console.log('확인 클릭');
      },
    });
  };

  // 이중 버튼 모달 예제
  const handleDualModal = () => {
    openModal({
      variant: 'dual',
      title: '친구 추가',
      description: '게이머호랑이님을 친구로 추가하시겠습니까?',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: () => {
        console.log('친구 추가 확인');
      },
      onCancel: () => {
        console.log('친구 추가 취소');
      },
    });
  };

  // 중첩 모달 예제 1단계
  const handleNestedModal1 = () => {
    openModal({
      variant: 'dual',
      title: '첫 번째 모달',
      description: '두 번째 모달을 열어보세요.',
      confirmText: '두 번째 모달 열기',
      cancelText: '닫기',
      onConfirm: () => {
        handleNestedModal2();
      },
    });
  };

  // 중첩 모달 예제 2단계
  const handleNestedModal2 = () => {
    openModal({
      variant: 'dual',
      title: '두 번째 모달',
      description: '세 번째 모달을 열어보세요.',
      confirmText: '세 번째 모달 열기',
      cancelText: '닫기',
      onConfirm: () => {
        handleNestedModal3();
      },
    });
  };

  // 중첩 모달 예제 3단계
  const handleNestedModal3 = () => {
    openModal({
      variant: 'single',
      title: '세 번째 모달',
      description:
        '최종 모달입니다. ESC 키를 누르거나 배경을 클릭하면 닫힙니다.',
      confirmText: '완료',
      onConfirm: () => {
        console.log('중첩 모달 완료');
      },
    });
  };

  // 여러 개의 모달을 동시에 열기
  const handleMultipleModals = () => {
    openModal({
      variant: 'single',
      title: '첫 번째',
      description: '첫 번째 모달',
      confirmText: '확인',
    });

    setTimeout(() => {
      openModal({
        variant: 'single',
        title: '두 번째',
        description: '두 번째 모달',
        confirmText: '확인',
      });
    }, 100);

    setTimeout(() => {
      openModal({
        variant: 'single',
        title: '세 번째',
        description: '세 번째 모달',
        confirmText: '확인',
      });
    }, 200);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Modal Provider 테스트</h1>
      <p>현재 열린 모달 수: {modalCount}</p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        <button onClick={handleSingleModal}>단일 버튼 모달 열기</button>

        <button onClick={handleDualModal}>이중 버튼 모달 열기</button>

        <button onClick={handleNestedModal1}>중첩 모달 열기 (3단계)</button>

        <button onClick={handleMultipleModals}>여러 모달 동시에 열기</button>
      </div>

      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3>사용 방법</h3>
        <ul>
          <li>ESC 키를 누르면 가장 최근에 열린 모달이 닫힙니다.</li>
          <li>배경(backdrop)을 클릭하면 해당 모달이 닫힙니다.</li>
          <li>여러 모달이 쌓이면 각각의 backdrop이 보입니다.</li>
          <li>모달이 하나라도 열려 있으면 body 스크롤이 비활성화됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
