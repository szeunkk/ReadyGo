'use client';

import { generateNickname } from '@/lib/nickname/generateNickname';
import Radio from '@/commons/components/radio';
import { useState } from 'react';

export default function Home() {
  const [selectedGame, setSelectedGame] = useState('lol');
  const [selectedTier, setSelectedTier] = useState('gold');

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>readygo{generateNickname()}</h1>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '16px' }}>게임 선택</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Radio
              name="game"
              value="lol"
              checked={selectedGame === 'lol'}
              onChange={(e) => setSelectedGame(e.target.value)}
            />
            <span>League of Legends</span>
          </label>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Radio
              name="game"
              value="valorant"
              checked={selectedGame === 'valorant'}
              onChange={(e) => setSelectedGame(e.target.value)}
            />
            <span>Valorant</span>
          </label>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Radio
              name="game"
              value="tft"
              checked={selectedGame === 'tft'}
              onChange={(e) => setSelectedGame(e.target.value)}
            />
            <span>Teamfight Tactics</span>
          </label>
        </div>
        <p style={{ marginTop: '12px', color: '#666' }}>
          선택된 게임: {selectedGame}
        </p>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '16px' }}>티어 선택</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Radio
              name="tier"
              value="bronze"
              checked={selectedTier === 'bronze'}
              onChange={(e) => setSelectedTier(e.target.value)}
            />
            <span>Bronze</span>
          </label>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Radio
              name="tier"
              value="silver"
              checked={selectedTier === 'silver'}
              onChange={(e) => setSelectedTier(e.target.value)}
            />
            <span>Silver</span>
          </label>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Radio
              name="tier"
              value="gold"
              checked={selectedTier === 'gold'}
              onChange={(e) => setSelectedTier(e.target.value)}
            />
            <span>Gold</span>
          </label>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Radio
              name="tier"
              value="platinum"
              checked={selectedTier === 'platinum'}
              onChange={(e) => setSelectedTier(e.target.value)}
            />
            <span>Platinum</span>
          </label>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Radio
              name="tier"
              value="diamond"
              checked={selectedTier === 'diamond'}
              onChange={(e) => setSelectedTier(e.target.value)}
              disabled
            />
            <span style={{ opacity: 0.5 }}>Diamond (비활성화)</span>
          </label>
        </div>
        <p style={{ marginTop: '12px', color: '#666' }}>
          선택된 티어: {selectedTier}
        </p>
      </div>
    </div>
  );
}
