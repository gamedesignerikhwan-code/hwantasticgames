(function () {
    'use strict';

    const MODAL_ID = 'heavensDoorRulebookModal';

    const modalMarkup = `
    <div class="proto-modal-overlay" id="${MODAL_ID}" role="dialog" aria-modal="true" aria-labelledby="${MODAL_ID}Title" style="display:none;">
        <div class="proto-modal-card rulebook-modal-card hd-rulebook-modal-card">
            <!-- Header -->
            <div class="proto-modal-header">
                <div class="proto-modal-title" id="${MODAL_ID}Title">
                    <i class="fa-solid fa-gem" style="color: #f59e0b;"></i>
                    <span class="rb-title-text-en">Heaven's Door — Complete Rulebook</span>
                    <span class="rb-title-text-ko" style="display:none;">헤븐스 도어 (Heaven's Door) — 전체 규칙서</span>
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
            <nav class="rulebook-nav-bar" aria-label="Rulebook sections" style="display:flex; gap:8px; padding:10px 18px; border-bottom:1px solid var(--border-glass); overflow-x:auto;">
                <button type="button" class="rb-nav-link active" onclick="scrollRulebookSection('hd-sec-overview')">
                    <span class="rb-content-en">1. Overview & Setup</span>
                    <span class="rb-content-ko" style="display:none;">1. 개요 & 셋업</span>
                </button>
                <button type="button" class="rb-nav-link" onclick="scrollRulebookSection('hd-sec-drafting')">
                    <span class="rb-content-en">2. 3D Drafting Rules</span>
                    <span class="rb-content-ko" style="display:none;">2. 타일 획득 조건</span>
                </button>
                <button type="button" class="rb-nav-link" onclick="scrollRulebookSection('hd-sec-placement')">
                    <span class="rb-content-en">3. Board & Combos</span>
                    <span class="rb-content-ko" style="display:none;">3. 보드 배치 & 콤보</span>
                </button>
                <button type="button" class="rb-nav-link" onclick="scrollRulebookSection('hd-sec-scoring')">
                    <span class="rb-content-en">4. Symbol Formulas (A/B)</span>
                    <span class="rb-content-ko" style="display:none;">4. 기호별 점수 공식 (A/B)</span>
                </button>
                <button type="button" class="rb-nav-link" onclick="scrollRulebookSection('hd-sec-endgame')">
                    <span class="rb-content-en">5. Game End & Victory</span>
                    <span class="rb-content-ko" style="display:none;">5. 게임 종료 & 승리</span>
                </button>
            </nav>

            <!-- Body -->
            <div class="proto-modal-body rulebook-body" style="padding:18px 24px;">

                <!-- Section 1: Overview & Setup -->
                <section class="rb-section" id="hd-sec-overview">
                    <div class="rb-intro-banner">
                        <strong class="rb-content-en">Stack the stepped pyramid, draft matching pairs, and customize your scoring constellation.</strong>
                        <strong class="rb-content-ko" style="display:none;">계단식 피라미드에서 일치하는 타일 쌍을 드래프트하고, 나만의 기호 점수 조합을 완성하세요.</strong>
                    </div>

                    <div class="rb-specs-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin:14px 0;">
                        <div class="rb-spec-item" style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); border-radius:8px; padding:10px; text-align:center;">
                            <div style="color:var(--text-muted); font-size:0.75rem;"><span class="rb-content-en">Players</span><span class="rb-content-ko" style="display:none;">인원</span></div>
                            <div style="font-size:1.1rem; font-weight:800; color:#fbbf24;">2–4</div>
                        </div>
                        <div class="rb-spec-item" style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); border-radius:8px; padding:10px; text-align:center;">
                            <div style="color:var(--text-muted); font-size:0.75rem;"><span class="rb-content-en">Time</span><span class="rb-content-ko" style="display:none;">시간</span></div>
                            <div style="font-size:1.1rem; font-weight:800; color:#fbbf24;">30 Mins</div>
                        </div>
                        <div class="rb-spec-item" style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); border-radius:8px; padding:10px; text-align:center;">
                            <div style="color:var(--text-muted); font-size:0.75rem;"><span class="rb-content-en">Ages</span><span class="rb-content-ko" style="display:none;">연령</span></div>
                            <div style="font-size:1.1rem; font-weight:800; color:#fbbf24;">8+</div>
                        </div>
                        <div class="rb-spec-item" style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); border-radius:8px; padding:10px; text-align:center;">
                            <div style="color:var(--text-muted); font-size:0.75rem;"><span class="rb-content-en">Turns</span><span class="rb-content-ko" style="display:none;">진행</span></div>
                            <div style="font-size:1.1rem; font-weight:800; color:#fbbf24;">10 Turns (20 Tiles)</div>
                        </div>
                    </div>

                    <h4 class="rb-section-title"><i class="fa-solid fa-shapes"></i> <span class="rb-content-en">Components</span><span class="rb-content-ko" style="display:none;">구성물</span></h4>
                    <ul>
                        <li><span class="rb-content-en"><strong>96 Game Tiles:</strong> 6 Symbols (Triangle ▲, Trapezoid ⏢, Square ■, Circle ●, Star ★, Hexagon ⬢) × 8 Colors (Black, Red, Yellow, Green, Blue, Purple, Gray, White) × 2 identical tiles each.</span><span class="rb-content-ko" style="display:none;"><strong>게임 타일 96개:</strong> 6종 기호(삼각 ▲, 사다리꼴 ⏢, 사각 ■, 원 ●, 별 ★, 육각 ⬢) × 8종 색상 × 각 2장씩 쌍으로 구성.</span></li>
                        <li><span class="rb-content-en"><strong>4 Personal Boards:</strong> Elongated layout displaying 6 symbol slots (values 0, 0, 0, 5, 15, 30 VP) and side compartments for COMBO and DUPLICATE tiles.</span><span class="rb-content-ko" style="display:none;"><strong>개인 보드 4개:</strong> 6개 기호 배치 슬롯(세트 보너스 0, 0, 0, 5, 15, 30점) 및 COMBO, DUPLICATE 타일 보관 영역.</span></li>
                        <li><span class="rb-content-en"><strong>32 Personal Tiles (8 per player):</strong> 6 double-sided scoring condition tiles (Type A front, Type B back) + 1 COMBO (7 VP) tile + 1 DUPLICATE (2 VP) tile.</span><span class="rb-content-ko" style="display:none;"><strong>개인 타일 32개 (인당 8개):</strong> 양면 점수 조건 타일 6개(앞면 Type A / 뒷면 Type B) + COMBO (7점) 타일 1개 + DUPLICATE (2점) 타일 1개.</span></li>
                    </ul>

                    <h4 class="rb-section-title"><i class="fa-solid fa-layer-group"></i> <span class="rb-content-en">Pyramid Setup by Player Count</span><span class="rb-content-ko" style="display:none;">인원수별 피라미드 적재 셋업</span></h4>
                    <ul>
                        <li><span class="rb-content-en"><strong>2-Player Game:</strong> 2 Layers — Layer 1 (bottom): 6×5 tiles (30 tiles), Layer 2 (top): 5×4 tiles (20 tiles).</span><span class="rb-content-ko" style="display:none;"><strong>2인 게임:</strong> 2개 층 — 1층: 6×5개 (30장), 2층: 5×4개 (20장).</span></li>
                        <li><span class="rb-content-en"><strong>3-Player Game:</strong> 2 Layers — Layer 1 (bottom): 7×6 tiles (42 tiles), Layer 2 (top): 6×5 tiles (30 tiles).</span><span class="rb-content-ko" style="display:none;"><strong>3인 게임:</strong> 2개 층 — 1층: 7×6개 (42장), 2층: 6×5개 (30장).</span></li>
                        <li><span class="rb-content-en"><strong>4-Player Game:</strong> 3 Layers — Layer 1 (bottom): 7×6 tiles (42 tiles), Layer 2 (middle): 6×5 tiles (30 tiles), Layer 3 (top): 5×4 tiles (20 tiles).</span><span class="rb-content-ko" style="display:none;"><strong>4인 게임:</strong> 3개 층 — 1층: 7×6개 (42장), 2층: 6×5개 (30장), 3층: 5×4개 (20장).</span></li>
                        <li><span class="rb-content-en">The tiles on the topmost layer are placed <strong>face-up</strong>. Lower layer tiles are placed randomly face-up or face-down.</span><span class="rb-content-ko" style="display:none;">최상층 타일은 모두 <strong>앞면</strong>으로 놓으며, 아래층 타일들은 무작위로 앞면 또는 뒷면으로 놓습니다.</span></li>
                    </ul>
                </section>

                <!-- Section 2: 3D Drafting Rules -->
                <section class="rb-section" id="hd-sec-drafting" style="margin-top:20px;">
                    <h4 class="rb-section-title"><i class="fa-solid fa-hand-pointer"></i> <span class="rb-content-en">2. 3D Drafting Rules</span><span class="rb-content-ko" style="display:none;">2. 타일 획득 조건</span></h4>
                    <p>
                        <span class="rb-content-en">On each turn, take <strong>two tiles</strong> from the board that satisfy the matching condition: they must either have the <strong>SAME COLOR</strong> or the <strong>SAME SYMBOL</strong>.</span>
                        <span class="rb-content-ko" style="display:none;">자신의 차례마다 <strong>두 개의 타일</strong>을 가져옵니다. 두 타일은 반드시 <strong>색상이 일치</strong>하거나 <strong>기호가 일치</strong>해야 합니다.</span>
                    </p>
                    <div style="background:rgba(245,158,11,0.08); border-left:4px solid #f59e0b; padding:12px; border-radius:0 8px 8px 0; margin:10px 0;">
                        <strong class="rb-content-en">Acquisition Requirements:</strong>
                        <strong class="rb-content-ko" style="display:none;">타일 획득 가능 조건:</strong>
                        <ol style="margin-top:6px; margin-left:18px;">
                            <li><span class="rb-content-en">The front face must be visible (not covered by any tile resting on it).</span><span class="rb-content-ko" style="display:none;">앞면이 노출되어 있어야 합니다 (위층 타일에 덮여 있지 않아야 함).</span></li>
                            <li><span class="rb-content-en">At least one edge must be exposed to the outside (meaning at least one orthogonal edge has an empty space or borders the perimeter).</span><span class="rb-content-ko" style="display:none;">적어도 한 쪽 변이 외곽에 노출되어 있어야 합니다 (상·하·좌·우 중 적어도 한 곳이 빈칸이거나 층의 바깥 테두리여야 함).</span></li>
                        </ol>
                    </div>
                    <p>
                        <span class="rb-content-en"><strong>Flipping Revealed Tiles:</strong> Whenever an uncovered lower-layer tile has all covering tiles removed and becomes completely exposed, flip it face-up immediately.</span>
                        <span class="rb-content-ko" style="display:none;"><strong>뒷면 타일 공개:</strong> 게임 진행 중 위층 타일이 제거되어 아래층의 뒷면 타일이 완전히 드러나면 즉시 앞면으로 뒤집습니다.</span>
                    </p>
                </section>

                <!-- Section 3: Board Placement & Combos -->
                <section class="rb-section" id="hd-sec-placement" style="margin-top:20px;">
                    <h4 class="rb-section-title"><i class="fa-solid fa-table-columns"></i> <span class="rb-content-en">3. Personal Board Placement & Combos</span><span class="rb-content-ko" style="display:none;">3. 개인 보드 배치 & 콤보 규칙</span></h4>
                    <ul>
                        <li><span class="rb-content-en"><strong>Symbol Column Order:</strong> Acquired tiles are placed from left to right in the order each symbol is first drafted. Duplicate colors cannot be placed in the same symbol stack.</span><span class="rb-content-ko" style="display:none;"><strong>기호 배치 순서:</strong> 기호가 처음 획득된 순서대로 보드의 왼쪽 열부터 순서대로 배치됩니다. 한 기호 더미에는 중복된 색상을 올릴 수 없습니다.</span></li>
                        <li><span class="rb-content-en"><strong>Simultaneous New Symbols:</strong> If two new symbols are drafted in the same turn, you choose which symbol occupies the left column and which occupies the right.</span><span class="rb-content-ko" style="display:none;"><strong>새 기호 동시 획득:</strong> 한 턴에 2개의 새로운 기호를 동시에 획득했다면, 어느 기호를 왼쪽에 놓을지 플레이어가 결정합니다.</span></li>
                        <li><span class="rb-content-en"><strong>[COMBO] (7 VP Each):</strong> If in a single turn you draft 2 tiles that are completely identical in both color AND symbol, 1 tile goes to your personal board normally, and the other tile goes under the [COMBO] tile!</span><span class="rb-content-ko" style="display:none;"><strong>[COMBO] 콤보 (장당 7점):</strong> 한 차례에 색상과 기호가 완전히 동일한 2장을 가져오면, 1장은 보드 기호 열에 놓고 다른 1장은 [COMBO] 타일 아래에 보관합니다!</span></li>
                        <li><span class="rb-content-en"><strong>[DUPLICATE] (2 VP Each):</strong> If you acquire a tile whose color already exists in that symbol's stack on your board, it cannot be stacked and is placed under the [DUPLICATE] tile.</span><span class="rb-content-ko" style="display:none;"><strong>[DUPLICATE] 중복 (장당 2점):</strong> 이미 보유한 기호 더미에 존재하는 색상의 타일을 가져오면, 해당 타일은 더미에 쌓지 못하고 [DUPLICATE] 타일 아래에 보관합니다.</span></li>
                    </ul>
                </section>

                <!-- Section 4: Scoring Formulas Table -->
                <section class="rb-section" id="hd-sec-scoring" style="margin-top:20px;">
                    <h4 class="rb-section-title"><i class="fa-solid fa-calculator"></i> <span class="rb-content-en">4. Symbol Scoring Formulas (Type A vs Type B)</span><span class="rb-content-ko" style="display:none;">4. 기호별 점수 공식표 (Type A vs Type B)</span></h4>
                    <table class="rb-table" style="width:100%; border-collapse:collapse; margin:12px 0;">
                        <thead>
                            <tr style="background:rgba(255,255,255,0.06);">
                                <th style="padding:8px 10px; border:1px solid var(--border-glass);">Symbol</th>
                                <th style="padding:8px 10px; border:1px solid var(--border-glass);">Type A</th>
                                <th style="padding:8px 10px; border:1px solid var(--border-glass);">Type B</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><strong>▲ Triangle</strong></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">Score increases only on ODD tile counts: 5/5/15/15/25/25/35/35 VP</span><span class="rb-content-ko" style="display:none;">홀수 개일 때만 득점 증가: 5 / 5 / 15 / 15 / 25 / 25 / 35 / 35 점</span></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">Odd counts scored as (N+1)²: 4/4/16/16/36/36/64/64 VP</span><span class="rb-content-ko" style="display:none;">홀수 개일 때만 (N+1)² 득점: 4 / 4 / 16 / 16 / 36 / 36 / 64 / 64 점</span></td>
                            </tr>
                            <tr>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><strong>⏢ Trapezoid</strong></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">Score increases only on EVEN tile counts: 0/10/10/20/20/30/30/40 VP</span><span class="rb-content-ko" style="display:none;">짝수 개일 때만 득점 증가: 0 / 10 / 10 / 20 / 20 / 30 / 30 / 40 점</span></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">Even counts scored as (N+1)²: 0/9/9/25/25/49/49/81 VP</span><span class="rb-content-ko" style="display:none;">짝수 개일 때만 (N+1)² 득점: 0 / 9 / 9 / 25 / 25 / 49 / 49 / 81 점</span></td>
                            </tr>
                            <tr>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><strong>■ Square</strong></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">1 VP per COMBO achieved for every square tile.</span><span class="rb-content-ko" style="display:none;">정사각형 1장당 나의 콤보 수 점 (1점/콤보)</span></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">3 VP per DUPLICATE tile for every square tile.</span><span class="rb-content-ko" style="display:none;">정사각형 1장당 나의 중복(DUPLICATE) 타일 수 × 3점</span></td>
                            </tr>
                            <tr>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><strong>● Circle</strong></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">Points per circle = count of tiles in your most collected color.</span><span class="rb-content-ko" style="display:none;">원 1장당 내가 가장 많이 모은 단일 색상의 총 타일 수 점</span></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">Points per circle = count of tiles in your leftmost 1st column.</span><span class="rb-content-ko" style="display:none;">원 1장당 내 개인 보드의 맨 왼쪽(1번째) 열 타일 수 점</span></td>
                            </tr>
                            <tr>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><strong>★ Star</strong></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">40 VP for sole most stars (20 VP each if tied for most).</span><span class="rb-content-ko" style="display:none;">동점 없는 단독 최다 별 보유 시 <strong>40점</strong> (동점 최다 시 전원 20점)</span></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">25 VP if you are NOT the player with the fewest stars.</span><span class="rb-content-ko" style="display:none;">최소 보유자가 아니면 <strong>25점</strong></span></td>
                            </tr>
                            <tr>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><strong>⬢ Hexagon</strong></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">50 / 30 / 15 VP for 5+ / 4 / 3 hexagons collected.</span><span class="rb-content-ko" style="display:none;">육각형 3개(15점) / 4개(30점) / 5개 이상 <strong>50점</strong></span></td>
                                <td style="padding:8px 10px; border:1px solid var(--border-glass);"><span class="rb-content-en">If NOT the player with the most hexagons, earn 6 VP per hexagon.</span><span class="rb-content-ko" style="display:none;">최다 보유자가 아니라면 육각형 1장당 <strong>6점</strong> (최다는 0점)</span></td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <!-- Section 5: Game End & Victory -->
                <section class="rb-section" id="hd-sec-endgame" style="margin-top:20px;">
                    <h4 class="rb-section-title"><i class="fa-solid fa-trophy"></i> <span class="rb-content-en">5. Game End & Victory</span><span class="rb-content-ko" style="display:none;">5. 게임 종료 & 승리</span></h4>
                    <p>
                        <span class="rb-content-en">The game ends when all players have completed <strong>10 turns</strong> (each collecting exactly 20 tiles).</span>
                        <span class="rb-content-ko" style="display:none;">모든 플레이어가 <strong>10차례</strong>를 진행하면(각자 20장 수집) 게임이 종료됩니다.</span>
                    </p>
                    <ul>
                        <li><span class="rb-content-en"><strong>Symbol Points:</strong> Points earned across your 6 symbol columns.</span><span class="rb-content-ko" style="display:none;"><strong>기호별 점수:</strong> 내 6개 기호 열에서 얻은 점수 합계</span></li>
                        <li><span class="rb-content-en"><strong>Set Collection Bonus:</strong> Awarded for distinct symbols collected: 1: 0 / 2: 0 / 3: 0 / 4: 5 / 5: 15 / 6: 30 VP!</span><span class="rb-content-ko" style="display:none;"><strong>세트 컬렉션 보너스:</strong> 모은 기호 종류 수에 따라 1종: 0 / 2종: 0 / 3종: 0 / 4종: 5 / 5종: 15 / 6종: 30점!</span></li>
                        <li><span class="rb-content-en"><strong>[COMBO] Bonus:</strong> 7 VP per tile collected under COMBO.</span><span class="rb-content-ko" style="display:none;"><strong>[COMBO] 보너스:</strong> 콤보 타일 1장당 7점</span></li>
                        <li><span class="rb-content-en"><strong>[DUPLICATE] Bonus:</strong> 2 VP per tile collected under DUPLICATE.</span><span class="rb-content-ko" style="display:none;"><strong>[DUPLICATE] 보너스:</strong> 중복 타일 1장당 2점</span></li>
                    </ul>
                    <p style="margin-top:10px; font-weight:700; color:#fbbf24;">
                        <span class="rb-content-en">The player with the highest total score wins!</span>
                        <span class="rb-content-ko" style="display:none;">총점이 가장 높은 플레이어가 승리합니다!</span>
                    </p>
                </section>
            </div>

            <!-- Footer -->
            <div class="proto-modal-footer" style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-glass);">
                <button type="button" class="btn-secondary" onclick="closeModal('${MODAL_ID}')">
                    <span class="rb-content-en">Close</span>
                    <span class="rb-content-ko" style="display:none;">닫기</span>
                </button>
                <a href="/proto/heavens-door/" class="btn-play-proto" style="padding: 9px 18px;">
                    <i class="fa-solid fa-play"></i>
                    <span class="rb-content-en">Play Online Now</span>
                    <span class="rb-content-ko" style="display:none;">지금 온라인 플레이</span>
                </a>
            </div>
        </div>
    </div>
    `;

    function init() {
        if (!document.getElementById(MODAL_ID)) {
            const wrap = document.createElement('div');
            wrap.innerHTML = modalMarkup;
            document.body.appendChild(wrap.firstElementChild);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
