(function () {
    'use strict';

    const MODAL_ID = 'hutchRulebookModal';

    const modalMarkup = `
    <div class="proto-modal-overlay" id="${MODAL_ID}" role="dialog" aria-modal="true" aria-labelledby="${MODAL_ID}Title" style="display:none;">
        <div class="proto-modal-card rulebook-modal-card">
            <!-- Header -->
            <div class="proto-modal-header">
                <div class="proto-modal-title" id="${MODAL_ID}Title">
                    <i class="fa-solid fa-house-chimney-window" style="color: #2e7d32;"></i>
                    <span class="rb-title-text-en">My Little Hutch — Full Rulebook</span>
                    <span class="rb-title-text-ko" style="display:none;">나의 작은 오두막 — 전체 규칙서</span>
                </div>
                <div class="rulebook-header-actions">
                    <div class="rb-lang-toggle" role="group" aria-label="Rulebook language toggle">
                        <button type="button" class="rb-lang-btn active" data-rb-lang="ko" onclick="setRulebookLanguage('ko', '${MODAL_ID}')">KO</button>
                        <button type="button" class="rb-lang-btn" data-rb-lang="en" onclick="setRulebookLanguage('en', '${MODAL_ID}')">EN</button>
                    </div>
                    <button type="button" class="proto-modal-close" onclick="closeModal('${MODAL_ID}')" aria-label="Close rulebook modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <!-- 5-Step Tab Navigation Bar -->
            <nav class="hutch-rulebook-tabs" aria-label="Rulebook sections">
                <button type="button" class="hutch-tab-btn active" data-target="hutch-step1">
                    <span class="rb-content-en">1. Overview & Setup</span>
                    <span class="rb-content-ko" style="display:none;">1. 개요 & 셋업</span>
                </button>
                <button type="button" class="hutch-tab-btn" data-target="hutch-step2">
                    <span class="rb-content-en">2. 5 Actions & Rules</span>
                    <span class="rb-content-ko" style="display:none;">2. 일꾼 5대 액션 & 규칙</span>
                </button>
                <button type="button" class="hutch-tab-btn" data-target="hutch-step3">
                    <span class="rb-content-en">3. Placement & Bingo</span>
                    <span class="rb-content-ko" style="display:none;">3. 타일 배치 & 빙고</span>
                </button>
                <button type="button" class="hutch-tab-btn" data-target="hutch-step4">
                    <span class="rb-content-en">4. Shepherds & Scoring</span>
                    <span class="rb-content-ko" style="display:none;">4. 목동 패턴 & 점수표</span>
                </button>
                <button type="button" class="hutch-tab-btn" data-target="hutch-step5">
                    <span class="rb-content-en">5. Game End & Victory</span>
                    <span class="rb-content-ko" style="display:none;">5. 게임 종료 & 승리</span>
                </button>
            </nav>

            <!-- Body -->
            <div class="proto-modal-body rulebook-body" style="padding-top: 14px;">

                <!-- ===============================================================
                     TAB 1: 개요 및 셋업 (Overview & Setup)
                     =============================================================== -->
                <div class="hutch-tab-panel active" id="hutch-step1">
                    <!-- Korean Content -->
                    <div class="rb-content-ko" style="display:none;">
                        <div class="rule-box" style="border-left: 4px solid #2e7d32;">
                            <h4>🎯 게임 개요</h4>
                            <p>
                                <strong>나의 작은 오두막 (My Little Hutch)</strong>은 2~4명의 플레이어가 자신의 5×5 개인 보드에 도미노 타일과 싱글 타일을 배치하여 가로/세로 줄 빙고를 달성하고, 가축이 밀집된 구역에 목동을 고용하여 대량의 점수를 획득하는 <strong>2중 퍼즐 & 전략 일꾼 드래프팅</strong> 보드게임입니다.
                            </p>
                        </div>

                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">🖼️ 게임 구성물 및 보드 셋업 다이어그램</div>
                            <div class="rule-setup-diagram">
                                <!-- LEFT: Public Board -->
                                <div class="setup-section">
                                    <div class="setup-section-title">🗺️ 공용 게임 보드</div>
                                    <div class="setup-market-row">
                                        <div class="setup-market-label">🧱 도미노</div>
                                        <div class="setup-market-slots">
                                            <div class="setup-slot domino-slot">0원</div>
                                            <div class="setup-slot domino-slot">1원</div>
                                            <div class="setup-slot domino-slot">2원</div>
                                            <div class="setup-slot domino-slot">3원</div>
                                            <div class="setup-slot domino-slot">5원</div>
                                        </div>
                                        <div class="setup-market-deck">덱<br>35장</div>
                                    </div>
                                    <div class="setup-market-row">
                                        <div class="setup-market-label">🔲 싱글</div>
                                        <div class="setup-market-slots">
                                            <div class="setup-slot single-slot">1원</div>
                                            <div class="setup-slot single-slot">3원</div>
                                            <div class="setup-slot single-slot">5원</div>
                                            <div class="setup-slot single-slot">7원</div>
                                            <div class="setup-slot single-slot">9원</div>
                                        </div>
                                        <div class="setup-market-deck">덱<br>35장</div>
                                    </div>
                                    <div class="setup-market-row">
                                        <div class="setup-market-label">🐑 목동</div>
                                        <div class="setup-market-slots">
                                            <div class="setup-slot shepherd-slot">1원</div>
                                            <div class="setup-slot shepherd-slot">3원</div>
                                            <div class="setup-slot shepherd-slot">5원</div>
                                            <div class="setup-slot shepherd-slot">7원</div>
                                            <div class="setup-slot shepherd-slot">9원</div>
                                        </div>
                                        <div class="setup-market-deck">주머니<br>40개</div>
                                    </div>
                                    <div class="setup-special-row">
                                        <div class="setup-special-card">
                                            <div class="icon">💰</div>
                                            <div>5코인 획득 칸</div>
                                            <div style="font-size: 0.64rem; color: var(--text-muted);">빈 자리: 5원 / 일꾼 존재: 3원</div>
                                        </div>
                                        <div class="setup-special-card">
                                            <div class="icon">🏆</div>
                                            <div>빙고 보너스 스택</div>
                                            <div style="font-size: 0.64rem; color: var(--text-muted);">15→4점 (12장)</div>
                                        </div>
                                    </div>
                                    <div class="setup-components-row">
                                        <div class="setup-component-badge"><i class="fa-solid fa-person"></i> 일꾼 ×4</div>
                                        <div class="setup-component-badge"><i class="fa-solid fa-coins"></i> 코인 100개</div>
                                        <div class="setup-component-badge"><i class="fa-solid fa-bag-shopping"></i> 목동 주머니 1개</div>
                                    </div>
                                    <div style="font-size: 0.75rem; font-weight: 700; margin-top: 6px;">🪙 시작 코인 규칙:</div>
                                    <div class="setup-start-coins">
                                        <div class="coin-chip">1번: 3원</div>
                                        <div class="coin-chip">2번: 5원</div>
                                        <div class="coin-chip">3번: 8원</div>
                                        <div class="coin-chip">4번: 12원</div>
                                    </div>
                                </div>

                                <!-- RIGHT: Personal Board -->
                                <div class="setup-section">
                                    <div class="setup-section-title">🏡 개인 보드 (5×5 그리드 ×4)</div>
                                    <div class="setup-mini-board">
                                        <div class="setup-mini-grid">
                                            <div class="setup-mini-cell corner"></div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell corner"></div>
                                            <div class="setup-mini-cell claim-bar">CLAIM COINS</div>
                                        </div>
                                        <p style="font-size: 0.72rem; color: var(--text-muted); text-align: center; margin-top: 6px;">
                                            5×5 타일 그리드 + 파란색(B) 빙고 슬롯 10개 + 하단 은화 수확 바
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="rule-flow-grid">
                            <div class="rule-flow-card">
                                <div class="rule-flow-card-head">🗺️ 공용 보드 (Public Board)</div>
                                <p style="font-size: 0.82rem; color: var(--text-main);">
                                    • 도미노 마켓 5칸 (비용: 0, 1, 2, 3, 5원)<br>
                                    • 싱글 마켓 5칸 (비용: 1, 3, 5, 7, 9원)<br>
                                    • 목동 마켓 5칸 (비용: 1, 3, 5, 7, 9원)<br>
                                    • 5코인 획득 칸 & 흰색 빙고 타일 스택
                                </p>
                            </div>
                            <div class="rule-flow-card">
                                <div class="rule-flow-card-head">🏡 개인 보드 (Personal Board)</div>
                                <p style="font-size: 0.82rem; color: var(--text-main);">
                                    • 5×5 타일 그리드 (총 25칸)<br>
                                    • 상단(세로 5열) & 좌측(가로 5행) 빙고 슬롯<br>
                                    • 하단 개인 은화 수확 액션 바 (CLAIM COINS)<br>
                                    • 플레이어별 일꾼 1개씩 보유
                                </p>
                            </div>
                            <div class="rule-flow-card">
                                <div class="rule-flow-card-head">🪙 시작 코인 규칙</div>
                                <p style="font-size: 0.82rem; color: var(--text-main);">
                                    턴 순서에 따른 밸런스 조정:<br>
                                    • 1번: <strong>3코인</strong> | 2번: <strong>5코인</strong><br>
                                    • 3번: <strong>8코인</strong> | 4번: <strong>12코인</strong>
                                </p>
                            </div>
                            <div class="rule-flow-card">
                                <div class="rule-flow-card-head">🏆 빙고 타일 준비</div>
                                <p style="font-size: 0.82rem; color: var(--text-main);">
                                    • 4~15점 흰색 빙고 타일 12개 내림차순 정렬<br>
                                    • 2인 게임: 무작위 6개 제거 (6개 사용)<br>
                                    • 3인 게임: 무작위 3개 제거 (9개 사용)<br>
                                    • 4인 게임: 12개 전체 사용 (소진 시 3점 타일)
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- English Content -->
                    <div class="rb-content-en">
                        <div class="rule-box" style="border-left: 4px solid #2e7d32;">
                            <h4>🎯 Game Overview</h4>
                            <p>
                                <strong>My Little Hutch</strong> is a 2–4 player board game combining <strong>dual-layer puzzle tile placement</strong>, <strong>worker drafting</strong>, and <strong>engine building</strong>. Players draft domino and single tiles to complete rows and columns on their 5×5 farm board to claim valuable bingo bonuses, while placing specialized shepherds over dense animal clusters to trigger massive score engines.
                            </p>
                        </div>

                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">🖼️ Components & Setup Diagram</div>
                            <div class="rule-setup-diagram">
                                <!-- LEFT: Public Board -->
                                <div class="setup-section">
                                    <div class="setup-section-title">🗺️ Public Game Board</div>
                                    <div class="setup-market-row">
                                        <div class="setup-market-label">🧱 Domino</div>
                                        <div class="setup-market-slots">
                                            <div class="setup-slot domino-slot">0c</div>
                                            <div class="setup-slot domino-slot">1c</div>
                                            <div class="setup-slot domino-slot">2c</div>
                                            <div class="setup-slot domino-slot">3c</div>
                                            <div class="setup-slot domino-slot">5c</div>
                                        </div>
                                        <div class="setup-market-deck">Deck<br>35</div>
                                    </div>
                                    <div class="setup-market-row">
                                        <div class="setup-market-label">🔲 Single</div>
                                        <div class="setup-market-slots">
                                            <div class="setup-slot single-slot">1c</div>
                                            <div class="setup-slot single-slot">3c</div>
                                            <div class="setup-slot single-slot">5c</div>
                                            <div class="setup-slot single-slot">7c</div>
                                            <div class="setup-slot single-slot">9c</div>
                                        </div>
                                        <div class="setup-market-deck">Deck<br>35</div>
                                    </div>
                                    <div class="setup-market-row">
                                        <div class="setup-market-label">🐑 Shepherd</div>
                                        <div class="setup-market-slots">
                                            <div class="setup-slot shepherd-slot">1c</div>
                                            <div class="setup-slot shepherd-slot">3c</div>
                                            <div class="setup-slot shepherd-slot">5c</div>
                                            <div class="setup-slot shepherd-slot">7c</div>
                                            <div class="setup-slot shepherd-slot">9c</div>
                                        </div>
                                        <div class="setup-market-deck">Bag<br>40</div>
                                    </div>
                                    <div class="setup-special-row">
                                        <div class="setup-special-card">
                                            <div class="icon">💰</div>
                                            <div>Get 5 Coins</div>
                                            <div style="font-size: 0.64rem; color: var(--text-muted);">Empty: 5c / Occupied: 3c</div>
                                        </div>
                                        <div class="setup-special-card">
                                            <div class="icon">🏆</div>
                                            <div>Bingo Stack</div>
                                            <div style="font-size: 0.64rem; color: var(--text-muted);">15→4 pts (12 tiles)</div>
                                        </div>
                                    </div>
                                    <div class="setup-components-row">
                                        <div class="setup-component-badge"><i class="fa-solid fa-person"></i> Workers ×4</div>
                                        <div class="setup-component-badge"><i class="fa-solid fa-coins"></i> 100 Coins</div>
                                        <div class="setup-component-badge"><i class="fa-solid fa-bag-shopping"></i> 1 Bag</div>
                                    </div>
                                    <div style="font-size: 0.75rem; font-weight: 700; margin-top: 6px;">🪙 Starting Coins:</div>
                                    <div class="setup-start-coins">
                                        <div class="coin-chip">P1: 3c</div>
                                        <div class="coin-chip">P2: 5c</div>
                                        <div class="coin-chip">P3: 8c</div>
                                        <div class="coin-chip">P4: 12c</div>
                                    </div>
                                </div>

                                <!-- RIGHT: Personal Board -->
                                <div class="setup-section">
                                    <div class="setup-section-title">🏡 Personal Board (5×5 Grid ×4)</div>
                                    <div class="setup-mini-board">
                                        <div class="setup-mini-grid">
                                            <div class="setup-mini-cell corner"></div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-col">B</div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell bingo-row">B</div>
                                            <div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div><div class="setup-mini-cell"></div>
                                            <div class="setup-mini-cell corner"></div>
                                            <div class="setup-mini-cell claim-bar">CLAIM COINS</div>
                                        </div>
                                        <p style="font-size: 0.72rem; color: var(--text-muted); text-align: center; margin-top: 6px;">
                                            5×5 Tile Grid + 10 Blue (B) Bingo Slots + Silver Coin Claim Bar
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="rule-flow-grid">
                            <div class="rule-flow-card">
                                <div class="rule-flow-card-head">🗺️ Public Board</div>
                                <p style="font-size: 0.82rem; color: var(--text-main);">
                                    • Domino Market (5 slots: 0, 1, 2, 3, 5 coins)<br>
                                    • Single Market (5 slots: 1, 3, 5, 7, 9 coins)<br>
                                    • Shepherd Market (5 slots: 1, 3, 5, 7, 9 coins)<br>
                                    • 5-Coin Action Space & Bingo Stack
                                </p>
                            </div>
                            <div class="rule-flow-card">
                                <div class="rule-flow-card-head">🏡 Personal Board</div>
                                <p style="font-size: 0.82rem; color: var(--text-main);">
                                    • 5×5 Grid (25 cells)<br>
                                    • Top & Left Bingo Slots (5 cols + 5 rows)<br>
                                    • Bottom Personal Action Bar (CLAIM COINS)<br>
                                    • 1 Worker per player
                                </p>
                            </div>
                            <div class="rule-flow-card">
                                <div class="rule-flow-card-head">🪙 Starting Coins</div>
                                <p style="font-size: 0.82rem; color: var(--text-main);">
                                    Balanced by turn order:<br>
                                    • P1: <strong>3 coins</strong> | P2: <strong>5 coins</strong><br>
                                    • P3: <strong>8 coins</strong> | P4: <strong>12 coins</strong>
                                </p>
                            </div>
                            <div class="rule-flow-card">
                                <div class="rule-flow-card-head">🏆 Bingo Tiles Setup</div>
                                <p style="font-size: 0.82rem; color: var(--text-main);">
                                    • 12 White Bingo Tiles (15 down to 4 pts)<br>
                                    • 2 Players: Remove 6 at random (6 used)<br>
                                    • 3 Players: Remove 3 at random (9 used)<br>
                                    • 4 Players: Use all 12 (fallback 3pt tiles)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ===============================================================
                     TAB 2: 일꾼 5대 액션 & 이동 규칙 (The 5 Actions & Movement Rules)
                     =============================================================== -->
                <div class="hutch-tab-panel" id="hutch-step2">
                    <!-- Korean Content -->
                    <div class="rb-content-ko" style="display:none;">
                        <div class="rule-box" style="border-left: 4px solid #d97706;">
                            <h4>⚙️ 턴 진행: 5가지 액션 공간 중 하나로 일꾼 보내기</h4>
                            <p>
                                자신의 차례가 되면, 플레이어는 일꾼을 다음 <strong>5가지 액션 공간 중 하나</strong>에 배치하고 해당 액션을 수행합니다.
                            </p>
                        </div>

                        <div class="rule-flow-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                            <div class="rule-flow-card" style="border-top: 3px solid #2563eb;">
                                <div class="rule-flow-card-head"><span>🧱</span> 1. 도미노 타일 구매</div>
                                <p style="font-size: 0.82rem;">슬롯 비용 지불 후 내 개인 보드의 인접한 빈 2칸에 배치. 회전(가로/세로) 및 반전 가능.</p>
                            </div>
                            <div class="rule-flow-card" style="border-top: 3px solid #7c3aed;">
                                <div class="rule-flow-card-head"><span>🔲</span> 2. 싱글 타일 구매</div>
                                <p style="font-size: 0.82rem;">슬롯 비용 지불 후 내 개인 보드의 원하는 빈 1칸에 배치. 정밀한 빈틈 메우기 및 빙고에 최적.</p>
                            </div>
                            <div class="rule-flow-card" style="border-top: 3px solid #059669;">
                                <div class="rule-flow-card-head"><span>🤠</span> 3. 목동 고용</div>
                                <p style="font-size: 0.82rem;">슬롯 비용 지불 후 이미 타일이 놓이고 목동이 없는 칸에 배치. 해당 동물의 점수 엔진 활성화.</p>
                            </div>
                            <div class="rule-flow-card" style="border-top: 3px solid #d97706;">
                                <div class="rule-flow-card-head"><span>💰</span> 4. 5코인 즉시 획득</div>
                                <p style="font-size: 0.82rem;">빈 칸이면 5코인 즉시 획득. 이미 다른 일꾼이 머물고 있다면 3코인 획득.</p>
                            </div>
                            <div class="rule-flow-card" style="border-top: 3px solid #dc2626;">
                                <div class="rule-flow-card-head"><span>🪙</span> 5. 오두막 은화 수확</div>
                                <p style="font-size: 0.82rem;">개인 보드 액션 (CLAIM COINS). 현재 내 보드에 놓인 모든 은화 심볼 수만큼 코인 수확.</p>
                            </div>
                        </div>

                        <!-- KEY RULE 1: STAY RESTRICTION -->
                        <div class="rule-diagram-box" style="border: 2px solid #f87171; background: #fffdfd; margin-top: 14px;">
                            <div class="rule-diagram-title" style="color: #dc2626;">
                                🚨 ★ [핵심 필수 규칙] 머물고 있는 선택지 재선택 불가 (일꾼 의무 이동)
                            </div>
                            <p style="font-size: 0.84rem; color: #7f1d1d; font-weight: 600;">
                                자신의 일꾼이 현재 머물고 있는 액션 칸은 다음 턴에 연속해서 다시 선택할 수 없습니다! 반드시 다른 4개 선택지 중 하나로 일꾼을 이동해야 합니다.
                            </p>
                            <div class="rule-step-compare">
                                <div class="rule-compare-col state-prev">
                                    <div style="font-weight: 800; color: #475569;">[이전 턴 선택]</div>
                                    <div style="font-size: 0.92rem; font-weight: 700; color: #1e293b;">🧱 도미노 마켓 선택</div>
                                    <p style="font-size: 0.78rem; color: #64748b;">내 일꾼이 도미노 마켓에 머무는 상태로 턴 종료</p>
                                </div>
                                <div class="rule-compare-arrow">➔</div>
                                <div class="rule-compare-col state-next">
                                    <div style="font-weight: 800; color: #dc2626;">[현재 턴 선택 제한]</div>
                                    <div style="font-size: 0.92rem; font-weight: 700; color: #dc2626;">🚫 도미노 마켓 선택 불가!</div>
                                    <p style="font-size: 0.78rem; color: #991b1b;">
                                        싱글 마켓, 목동 마켓, 5코인 칸, 은화 수확 중 <strong>반드시 다른 곳으로 이동</strong>해야 함!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- KEY RULE 2: +2 EXTRA COST -->
                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">👥 타 플레이어 일꾼 존재 시 +2원 추가 비용 규칙</div>
                            <p style="font-size: 0.85rem; color: var(--text-main);">
                                마켓 3종(도미노, 싱글, 목동)을 이용할 때, 해당 액션 칸에 <strong>다른 플레이어의 일꾼이 있다면 일꾼 1명당 2코인씩 추가 비용</strong>을 지불해야 합니다.
                            </p>
                            <div style="background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.84rem; margin-top: 8px;">
                                <strong>💡 계산 공식:</strong> <code>최종 지불 비용 = 마켓 슬롯 기본가 + (해당 칸의 다른 일꾼 수 × 2코인)</code><br>
                                <em>예: 3코인 도미노 슬롯을 구매하려는데 이미 상대방 일꾼 1명이 있다면 ➔ 3 + 2 = <strong>총 5코인</strong> 지불!</em>
                            </div>
                        </div>

                        <!-- KEY RULE 3: MARKET SLIDE -->
                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">🔄 마켓 슬라이딩 및 보충 규칙</div>
                            <p style="font-size: 0.85rem; color: var(--text-main);">
                                플레이어가 마켓에서 타일이나 목동을 구매하면 빈자리가 생깁니다. 이때 <strong>오른쪽의 비싼 타일들이 왼쪽(더 저렴한 빈칸)으로 미끄러져 이동</strong>하고, 덱/주머니에서 새로운 타일 1장을 뽑아 가장 오른쪽 빈자리를 채웁니다.
                            </p>
                            <div style="display: flex; align-items: center; justify-content: space-around; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px dashed #94a3b8; font-size: 0.8rem; margin-top: 8px;">
                                <span>[슬롯 1: 0원]</span> ➔ <span>[슬롯 2: 1원]</span> ➔ <span>[슬롯 3: 2원]</span> ➔ <span>[슬롯 4: 3원]</span> ➔ <span>[슬롯 5: 5원 보충]</span>
                            </div>
                        </div>
                    </div>

                    <!-- English Content -->
                    <div class="rb-content-en">
                        <div class="rule-box" style="border-left: 4px solid #d97706;">
                            <h4>⚙️ Turn Flow: Placing Your Worker on 1 of 5 Action Spaces</h4>
                            <p>
                                On your turn, place your single worker onto <strong>one of the 5 available action spaces</strong> and resolve the action immediately.
                            </p>
                        </div>

                        <div class="rule-flow-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                            <div class="rule-flow-card" style="border-top: 3px solid #2563eb;">
                                <div class="rule-flow-card-head"><span>🧱</span> 1. Buy Domino Tile</div>
                                <p style="font-size: 0.82rem;">Pay market slot cost and place onto 2 adjacent empty cells. Rotate (horizontal/vertical) & flip halves freely.</p>
                            </div>
                            <div class="rule-flow-card" style="border-top: 3px solid #7c3aed;">
                                <div class="rule-flow-card-head"><span>🔲</span> 2. Buy Single Tile</div>
                                <p style="font-size: 0.82rem;">Pay market slot cost and place onto any 1 empty cell. Perfect for filling gaps and completing bingos.</p>
                            </div>
                            <div class="rule-flow-card" style="border-top: 3px solid #059669;">
                                <div class="rule-flow-card-head"><span>🤠</span> 3. Hire Shepherd</div>
                                <p style="font-size: 0.82rem;">Pay market slot cost and place onto an already filled cell without a shepherd. Activates scoring engine.</p>
                            </div>
                            <div class="rule-flow-card" style="border-top: 3px solid #d97706;">
                                <div class="rule-flow-card-head"><span>💰</span> 4. Get 5 Coins</div>
                                <p style="font-size: 0.82rem;">If empty, gain 5 coins immediately. If another worker is present, gain 3 coins instead.</p>
                            </div>
                            <div class="rule-flow-card" style="border-top: 3px solid #dc2626;">
                                <div class="rule-flow-card-head"><span>🪙</span> 5. Harvest Coins (CLAIM)</div>
                                <p style="font-size: 0.82rem;">Personal board action (CLAIM COINS). Harvest silver coins equal to all coin symbols on your board.</p>
                            </div>
                        </div>

                        <div class="rule-diagram-box" style="border: 2px solid #f87171; background: #fffdfd; margin-top: 14px;">
                            <div class="rule-diagram-title" style="color: #dc2626;">
                                🚨 ★ [MANDATORY RULE] Cannot Re-Select Current Action Space (Must Move)
                            </div>
                            <p style="font-size: 0.84rem; color: #7f1d1d; font-weight: 600;">
                                You CANNOT choose the action space where your worker currently stays! You MUST move your worker to one of the other 4 action spaces each turn.
                            </p>
                            <div class="rule-step-compare">
                                <div class="rule-compare-col state-prev">
                                    <div style="font-weight: 800; color: #475569;">[Previous Turn Action]</div>
                                    <div style="font-size: 0.92rem; font-weight: 700; color: #1e293b;">🧱 Chose Domino Market</div>
                                    <p style="font-size: 0.78rem; color: #64748b;">Worker stays at Domino Market at end of turn</p>
                                </div>
                                <div class="rule-compare-arrow">➔</div>
                                <div class="rule-compare-col state-next">
                                    <div style="font-weight: 800; color: #dc2626;">[Current Turn Restriction]</div>
                                    <div style="font-size: 0.92rem; font-weight: 700; color: #dc2626;">🚫 Domino Market Prohibited!</div>
                                    <p style="font-size: 0.78rem; color: #991b1b;">
                                        Must move to Single Market, Shepherd Market, 5-Coin space, or Claim Coins!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">👥 +2 Extra Coins per Other Player's Worker</div>
                            <p style="font-size: 0.85rem; color: var(--text-main);">
                                When taking any of the 3 Market actions (Domino, Single, Shepherd), pay <strong>+2 extra coins for each other player's worker</strong> currently occupying that space.
                            </p>
                            <div style="background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.84rem; margin-top: 8px;">
                                <strong>💡 Formula:</strong> <code>Total Cost = Slot Base Cost + (Other Workers × 2 Coins)</code><br>
                                <em>Example: Buying a 3-coin Domino slot while 1 opponent worker is present ➔ 3 + 2 = <strong>5 coins</strong>!</em>
                            </div>
                        </div>

                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">🔄 Market Sliding & Refill</div>
                            <p style="font-size: 0.85rem; color: var(--text-main);">
                                When a tile/shepherd is bought, the gap is filled by <strong>sliding tiles to the left (cheaper slots)</strong>. A new tile/shepherd is drawn from the deck/bag to fill the rightmost slot.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- ===============================================================
                     TAB 3: 타일 배치 & 빙고 보너스 (Tile Placement & Bingo)
                     =============================================================== -->
                <div class="hutch-tab-panel" id="hutch-step3">
                    <!-- Korean Content -->
                    <div class="rb-content-ko" style="display:none;">
                        <div class="rule-box" style="border-left: 4px solid #2563eb;">
                            <h4>📐 5×5 오두막 농장 타일 배치 & 줄 완성</h4>
                            <p>
                                개인 보드는 <strong>5×5 그리드 (총 25칸)</strong>로 구성됩니다. 도미노(2칸)와 싱글(1칸) 타일을 배치하여 빈칸을 전략적으로 메워나갑니다.
                            </p>
                        </div>

                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">🏆 가로/세로 5칸 완성 시 빙고 보너스 획득 메커니즘</div>
                            <div class="rule-step-compare">
                                <div class="rule-compare-col" style="background: #eff6ff; border: 1px solid #bfdbfe;">
                                    <div style="font-weight: 800; color: #1e40af;">1) 가로 또는 세로 5칸 줄 완성</div>
                                    <p style="font-size: 0.82rem; color: #1e3a8a;">
                                        타일을 놓아 가로(R1~R5) 또는 세로(C1~C5) 5칸 중 한 줄이 빈틈없이 가득 차면 즉시 줄 완성이 선언됩니다!
                                    </p>
                                </div>
                                <div class="rule-compare-arrow">➔</div>
                                <div class="rule-compare-col" style="background: #fef3c7; border: 1px solid #fde68a;">
                                    <div style="font-weight: 800; color: #92400e;">2) 가장 높은 흰색 빙고 타일 획득</div>
                                    <p style="font-size: 0.82rem; color: #78350f;">
                                        공용 빙고 스택의 맨 위에 있는 <strong>가장 높은 점수(15, 12, 10...) 타일</strong>을 가져와 해당 줄의 슬롯에 놓습니다.
                                    </p>
                                </div>
                            </div>

                            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.84rem; line-height: 1.6; margin-top: 10px;">
                                • <strong>동시 다중 줄 완성 보너스</strong>: 도미노 타일 1개로 가로줄과 세로줄이 동시에 완성되면, 빙고 타일 <strong>2장</strong>을 동시에 획득합니다!<br>
                                • <strong>흰색 타일 소진 시</strong>: 흰색 타일(15~4점)이 모두 바닥나면 <strong>3점 타일</strong>을 대신 획득하며, 게임 종료 카운트다운이 시작됩니다.
                            </div>
                        </div>
                    </div>

                    <!-- English Content -->
                    <div class="rb-content-en">
                        <div class="rule-box" style="border-left: 4px solid #2563eb;">
                            <h4>📐 5×5 Farm Grid Placement & Completing Lines</h4>
                            <p>
                                Your personal farm is a <strong>5×5 grid (25 cells)</strong>. Place dominoes (2 cells) and singles (1 cell) to cultivate your land and align rows/cols.
                            </p>
                        </div>

                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">🏆 Completing a Row/Col & Claiming Bingo Bonus Tiles</div>
                            <div class="rule-step-compare">
                                <div class="rule-compare-col" style="background: #eff6ff; border: 1px solid #bfdbfe;">
                                    <div style="font-weight: 800; color: #1e40af;">1) Complete 5 cells in a Row/Col</div>
                                    <p style="font-size: 0.82rem; color: #1e3a8a;">
                                        Whenever any row (R1~R5) or column (C1~C5) is completely filled with tiles, a bingo is triggered immediately!
                                    </p>
                                </div>
                                <div class="rule-compare-arrow">➔</div>
                                <div class="rule-compare-col" style="background: #fef3c7; border: 1px solid #fde68a;">
                                    <div style="font-weight: 800; color: #92400e;">2) Claim the Highest White Bingo Tile</div>
                                    <p style="font-size: 0.82rem; color: #78350f;">
                                        Take the top (highest available, e.g. 15, 12, 10 pts) White Bingo Tile from the public stack and place it in that line's bingo slot.
                                    </p>
                                </div>
                            </div>

                            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.84rem; line-height: 1.6; margin-top: 10px;">
                                • <strong>Double Bingo</strong>: If a domino tile completes both a row and a column simultaneously, you claim <strong>2 bingo tiles</strong>!<br>
                                • <strong>White Tile Depletion</strong>: Once all white tiles (15 down to 4) are claimed, subsequent line completions award <strong>3-point fallback tiles</strong>.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ===============================================================
                     TAB 4: 목동 패턴 & 점수표 (Shepherd Patterns & Scoring)
                     =============================================================== -->
                <div class="hutch-tab-panel" id="hutch-step4">
                    <!-- Korean Content -->
                    <div class="rb-content-ko" style="display:none;">
                        <div class="rule-box" style="border-left: 4px solid #059669;">
                            <h4>🤠 목동 배치 및 5가지 점수 영역 패턴</h4>
                            <p>
                                목동은 <strong>이미 타일이 놓여있고 목동이 없는 칸</strong>에 고용할 수 있습니다. 각 목동은 지정된 <strong>영역 패턴</strong> 내에 있는 <strong>해당 동물 1마리당 점수</strong>를 획득합니다! (영역 내 가장 많은 동물이 포함되도록 자동/최적 계산)
                            </p>
                        </div>

                        <!-- 5 Pattern Cards Visualizer -->
                        <div class="rule-pattern-visualizer-grid">
                            <!-- Pattern 1: Single 1-Cell -->
                            <div class="rule-pattern-card">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell center-sh active-pat" title="목동 칸 1개"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">1. 단독 1칸 (1-Cell)</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">목동이 위치한 바로 그 칸 1개만을 평가합니다. 범위가 가장 좁은 대신 <strong>마리당 점수 배수가 가장 높습니다</strong>.</p>
                                </div>
                            </div>

                            <!-- Pattern 2: Line 2-Cell -->
                            <div class="rule-pattern-card">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell center-sh active-pat" title="목동 칸"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">2. 직선 2칸 (2-Cell Line)</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">목동을 포함한 가로 또는 세로 방향 연속된 2칸을 선택합니다. 인접한 도미노 타일과 강력한 시너지를 냅니다.</p>
                                </div>
                            </div>

                            <!-- Pattern 3: Line 3-Cell -->
                            <div class="rule-pattern-card">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell center-sh active-pat" title="목동 칸"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">3. 직선 3칸 (3-Cell Line)</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">목동을 포함한 가로 또는 세로 연속된 3칸을 선택합니다. 넓은 직선 구간의 가축들을 일괄 포섭합니다.</p>
                                </div>
                            </div>

                            <!-- Pattern 4: Square 2x2 -->
                            <div class="rule-pattern-card">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell center-sh active-pat" title="목동 칸"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">4. 2×2 정사각형 (2×2 Square)</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">목동 칸을 포함하는 주변 4칸(정사각형) 블록을 선택합니다. 2×2 블록에 동물들이 밀집되어 있을 때 위력을 발휘합니다.</p>
                                </div>
                            </div>

                            <!-- Pattern 5: Line 5-Cell Full -->
                            <div class="rule-pattern-card" style="grid-column: 1 / -1;">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell center-sh active-pat" title="목동 칸"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell active-pat"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">5. 5칸 줄 전체 (5-Cell Line)</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">목동이 있는 가로 줄 5칸 전체 또는 세로 줄 5칸 전체를 선택합니다. 한 줄 전체에 흩어진 가축들을 모두 계산합니다.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Animal Points Table -->
                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">📊 동물별 & 패턴별 마리당 점수 배수표</div>
                            <table class="rule-animal-table">
                                <thead>
                                    <tr>
                                        <th>동물 (Animal)</th>
                                        <th>1칸 단독</th>
                                        <th>직선 2칸</th>
                                        <th>직선 3칸</th>
                                        <th>2×2 사각</th>
                                        <th>5칸 줄 전체</th>
                                        <th>희귀도</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>🐮 소 (Cow)</strong></td>
                                        <td style="color: #2563eb; font-weight: 800;">18점</td>
                                        <td style="color: #2563eb; font-weight: 800;">12점</td>
                                        <td style="color: #2563eb; font-weight: 800;">9점</td>
                                        <td style="color: #2563eb; font-weight: 800;">7점</td>
                                        <td style="color: #2563eb; font-weight: 800;">7점</td>
                                        <td>가장 희귀 (최고점)</td>
                                    </tr>
                                    <tr>
                                        <td><strong>🐑 양 (Sheep)</strong></td>
                                        <td style="color: #059669; font-weight: 800;">10점</td>
                                        <td style="color: #059669; font-weight: 800;">7점</td>
                                        <td style="color: #059669; font-weight: 800;">5점</td>
                                        <td style="color: #059669; font-weight: 800;">4점</td>
                                        <td style="color: #059669; font-weight: 800;">4점</td>
                                        <td>희귀</td>
                                    </tr>
                                    <tr>
                                        <td><strong>🐷 돼지 (Pig)</strong></td>
                                        <td style="color: #d97706; font-weight: 800;">6점</td>
                                        <td style="color: #d97706; font-weight: 800;">4점</td>
                                        <td style="color: #d97706; font-weight: 800;">3점</td>
                                        <td style="color: #d97706; font-weight: 800;">2점</td>
                                        <td style="color: #d97706; font-weight: 800;">2점</td>
                                        <td>보통</td>
                                    </tr>
                                    <tr>
                                        <td><strong>🐔 닭 (Rooster)</strong></td>
                                        <td style="color: #dc2626; font-weight: 800;">3점</td>
                                        <td style="color: #dc2626; font-weight: 800;">2점</td>
                                        <td style="color: #dc2626; font-weight: 800;">2점</td>
                                        <td style="color: #dc2626; font-weight: 800;">1점</td>
                                        <td style="color: #dc2626; font-weight: 800;">1점</td>
                                        <td>가장 흔함</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">
                                ※ 점수 예시: 3칸 직선 소 목동(마리당 9점)의 영역에 소가 3마리 있다면 ➔ 3 × 9 = <strong>27점 획득!</strong>
                            </p>
                        </div>
                    </div>

                    <!-- English Content -->
                    <div class="rb-content-en">
                        <div class="rule-box" style="border-left: 4px solid #059669;">
                            <h4>🤠 Shepherd Placement & The 5 Area Patterns</h4>
                            <p>
                                Shepherds must be placed on an <strong>already filled cell with no shepherd yet</strong>. Each shepherd scores points for <strong>every matching animal</strong> inside its defined pattern area. (The game automatically selects the orientation that yields the maximum points!)
                            </p>
                        </div>

                        <!-- 5 Pattern Cards Visualizer -->
                        <div class="rule-pattern-visualizer-grid">
                            <div class="rule-pattern-card">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell center-sh active-pat" title="Shepherd cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">1. 1-Cell Solo</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">Evaluates only the single cell where the shepherd stands. Narrowest reach, but <strong>highest multiplier per animal</strong>.</p>
                                </div>
                            </div>

                            <div class="rule-pattern-card">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell center-sh active-pat" title="Shepherd cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">2. 2-Cell Line</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">Includes 2 continuous cells (horizontal or vertical) covering the shepherd. Synergizes with domino tiles.</p>
                                </div>
                            </div>

                            <div class="rule-pattern-card">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell center-sh active-pat" title="Shepherd cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">3. 3-Cell Line</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">Includes 3 continuous cells (horizontal or vertical) covering the shepherd.</p>
                                </div>
                            </div>

                            <div class="rule-pattern-card">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell center-sh active-pat" title="Shepherd cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">4. 2×2 Square Block</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">Covers a 2×2 square (4 cells) containing the shepherd cell. Powerful over dense 2×2 clusters.</p>
                                </div>
                            </div>

                            <div class="rule-pattern-card" style="grid-column: 1 / -1;">
                                <div class="rule-mini-grid">
                                    <div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell center-sh active-pat" title="Shepherd cell"></div><div class="rule-mini-cell active-pat"></div><div class="rule-mini-cell active-pat"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                    <div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div><div class="rule-mini-cell"></div>
                                </div>
                                <div>
                                    <h5 style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">5. 5-Cell Full Line</h5>
                                    <p style="font-size: 0.78rem; color: #64748b;">Evaluates an entire 5-cell row or column containing the shepherd.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Animal Points Table -->
                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">📊 Points Multiplier Table by Animal & Pattern</div>
                            <table class="rule-animal-table">
                                <thead>
                                    <tr>
                                        <th>Animal</th>
                                        <th>1-Cell</th>
                                        <th>2-Line</th>
                                        <th>3-Line</th>
                                        <th>2×2 Square</th>
                                        <th>5-Line</th>
                                        <th>Rarity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>🐮 Cow</strong></td>
                                        <td style="color: #2563eb; font-weight: 800;">18 pts</td>
                                        <td style="color: #2563eb; font-weight: 800;">12 pts</td>
                                        <td style="color: #2563eb; font-weight: 800;">9 pts</td>
                                        <td style="color: #2563eb; font-weight: 800;">7 pts</td>
                                        <td style="color: #2563eb; font-weight: 800;">7 pts</td>
                                        <td>Rarest (Top Value)</td>
                                    </tr>
                                    <tr>
                                        <td><strong>🐑 Sheep</strong></td>
                                        <td style="color: #059669; font-weight: 800;">10 pts</td>
                                        <td style="color: #059669; font-weight: 800;">7 pts</td>
                                        <td style="color: #059669; font-weight: 800;">5 pts</td>
                                        <td style="color: #059669; font-weight: 800;">4 pts</td>
                                        <td style="color: #059669; font-weight: 800;">4 pts</td>
                                        <td>Rare</td>
                                    </tr>
                                    <tr>
                                        <td><strong>🐷 Pig</strong></td>
                                        <td style="color: #d97706; font-weight: 800;">6 pts</td>
                                        <td style="color: #d97706; font-weight: 800;">4 pts</td>
                                        <td style="color: #d97706; font-weight: 800;">3 pts</td>
                                        <td style="color: #d97706; font-weight: 800;">2 pts</td>
                                        <td style="color: #d97706; font-weight: 800;">2 pts</td>
                                        <td>Common</td>
                                    </tr>
                                    <tr>
                                        <td><strong>🐔 Rooster</strong></td>
                                        <td style="color: #dc2626; font-weight: 800;">3 pts</td>
                                        <td style="color: #dc2626; font-weight: 800;">2 pts</td>
                                        <td style="color: #dc2626; font-weight: 800;">2 pts</td>
                                        <td style="color: #dc2626; font-weight: 800;">1 pt</td>
                                        <td style="color: #dc2626; font-weight: 800;">1 pt</td>
                                        <td>Abundant</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- ===============================================================
                     TAB 5: 게임 종료 & 최종 점수 (Game End & Victory)
                     =============================================================== -->
                <div class="hutch-tab-panel" id="hutch-step5">
                    <!-- Korean Content -->
                    <div class="rb-content-ko" style="display:none;">
                        <div class="rule-box" style="border-left: 4px solid #2e7d32;">
                            <h4>🏁 게임 종료 조건 (End Trigger)</h4>
                            <p>
                                공용 보드에 준비된 <strong>흰색 빙고 보너스 타일(15~4점)이 모두 소진</strong>되면 게임 종료 조건이 발동됩니다.<br>
                                모든 플레이어가 동등한 수의 턴을 가질 수 있도록 <strong>현재 라운드의 마지막 순번 플레이어까지 턴을 완료한 후</strong> 게임이 종료됩니다.
                            </p>
                        </div>

                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">🏆 최종 점수 계산 공식 및 승리 조건</div>
                            <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; margin: 10px 0;">
                                <div style="font-size: 1.1rem; font-weight: 800; color: #2e7d32;">
                                    최종 승점 = 획득한 빙고 타일 점수 합 + 모든 목동들의 패턴 점수 합
                                </div>
                                <div style="font-size: 0.84rem; color: var(--text-muted); margin-top: 4px;">
                                    (잔여 코인은 기본 점수에는 미포함되나, 동점 발생 시 타이 브레이커로 사용)
                                </div>
                            </div>

                            <div class="rule-flow-grid">
                                <div class="rule-flow-card">
                                    <div class="rule-flow-card-head">🥇 승리 조건</div>
                                    <p style="font-size: 0.82rem;">최종 승점이 가장 높은 플레이어가 승리하여 영광의 최고 농장주가 됩니다!</p>
                                </div>
                                <div class="rule-flow-card">
                                    <div class="rule-flow-card-head">⚖️ 동점자 처리 (Tie-Breaker)</div>
                                    <p style="font-size: 0.82rem;">최종 점수가 동점일 경우, <strong>남은 보유 코인이 더 많은 플레이어</strong>가 승리합니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- English Content -->
                    <div class="rb-content-en">
                        <div class="rule-box" style="border-left: 4px solid #2e7d32;">
                            <h4>🏁 Game End Trigger</h4>
                            <p>
                                The game end is triggered when <strong>all available White Bingo Bonus tiles (15 down to 4 pts) are exhausted</strong>.<br>
                                Play continues until the <strong>last player in turn order completes their turn</strong> so all players have had an equal number of turns.
                            </p>
                        </div>

                        <div class="rule-diagram-box">
                            <div class="rule-diagram-title">🏆 Final Scoring Formula & Victory Conditions</div>
                            <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; margin: 10px 0;">
                                <div style="font-size: 1.1rem; font-weight: 800; color: #2e7d32;">
                                    Final Score = Sum of Claimed Bingo Tiles + Sum of All Shepherd Animal Multipliers
                                </div>
                                <div style="font-size: 0.84rem; color: var(--text-muted); margin-top: 4px;">
                                    (Remaining coins are not added to score, but serve as the tie-breaker)
                                </div>
                            </div>

                            <div class="rule-flow-grid">
                                <div class="rule-flow-card">
                                    <div class="rule-flow-card-head">🥇 Victory</div>
                                    <p style="font-size: 0.82rem;">The player with the highest total score wins and becomes the Master Shepherd!</p>
                                </div>
                                <div class="rule-flow-card">
                                    <div class="rule-flow-card-head">⚖️ Tie-Breaker</div>
                                    <p style="font-size: 0.82rem;">If tied, the player with the <strong>most remaining coins</strong> wins.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Footer -->
            <div class="proto-modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('${MODAL_ID}')">
                    <span class="rb-content-en">Close</span>
                    <span class="rb-content-ko" style="display:none;">닫기</span>
                </button>
                <a href="https://my-little-hutch.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-play-proto" style="padding: 9px 18px;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span class="rb-content-en">Play Now</span>
                    <span class="rb-content-ko" style="display:none;">지금 플레이</span>
                </a>
            </div>
        </div>
    </div>`;

    function getModal() {
        return document.getElementById(MODAL_ID);
    }

    function setupTabSwitching(modal) {
        const tabs = modal.querySelectorAll('.hutch-tab-btn');
        const panels = modal.querySelectorAll('.hutch-tab-panel');

        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                tabs.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const targetPanel = modal.querySelector('#' + targetId);
                if (targetPanel) targetPanel.classList.add('active');
            });
        });
    }

    window.openHutchRulebookToast = function () {
        if (typeof window.openModal === 'function') {
            window.openModal(MODAL_ID);
        }
    };

    window.closeHutchRulebookToast = function () {
        if (typeof window.closeModal === 'function') {
            window.closeModal(MODAL_ID);
        }
    };

    function init() {
        if (!getModal()) {
            document.body.insertAdjacentHTML('beforeend', modalMarkup);
        }
        const modal = getModal();
        if (modal) {
            setupTabSwitching(modal);
            const isKo = document.documentElement.getAttribute('lang') === 'ko';
            if (typeof window.setRulebookLanguage === 'function') {
                window.setRulebookLanguage(isKo ? 'ko' : 'en', MODAL_ID);
            }
            modal.addEventListener('click', function (event) {
                if (event.target === modal) window.closeHutchRulebookToast();
            });
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && getModal()?.classList.contains('active')) {
            window.closeHutchRulebookToast();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
