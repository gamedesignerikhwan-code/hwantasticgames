(function () {
    'use strict';

    const MODAL_ID = 'pastLivesRulebookModal';

    const modalMarkup = `
    <div class="proto-modal-overlay" id="${MODAL_ID}" role="dialog" aria-modal="true" aria-labelledby="${MODAL_ID}Title" style="display:none;">
        <div class="proto-modal-card rulebook-modal-card pl-rulebook-modal-card">
            <!-- Header -->
            <div class="proto-modal-header">
                <div class="proto-modal-title" id="${MODAL_ID}Title">
                    <i class="fa-solid fa-infinity" style="color: #f59e0b;"></i>
                    <span class="rb-title-text-en">Past Lives — Complete Rulebook</span>
                    <span class="rb-title-text-ko" style="display:none;">패스트 라이브즈 (Past Lives) — 전체 규칙서</span>
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
                <button type="button" class="rb-nav-link active" onclick="scrollRulebookSection('pl-sec-overview')">
                    <span class="rb-content-en">1. Overview & Setup</span>
                    <span class="rb-content-ko" style="display:none;">1. 개요 & 셋업</span>
                </button>
                <button type="button" class="rb-nav-link" onclick="scrollRulebookSection('pl-sec-bidding')">
                    <span class="rb-content-en">2. Bidding & SETs</span>
                    <span class="rb-content-ko" style="display:none;">2. 입찰 & 세트 획득</span>
                </button>
                <button type="button" class="rb-nav-link" onclick="scrollRulebookSection('pl-sec-special')">
                    <span class="rb-content-en">3. Special Cards</span>
                    <span class="rb-content-ko" style="display:none;">3. 특수 카드 규칙</span>
                </button>
                <button type="button" class="rb-nav-link" onclick="scrollRulebookSection('pl-sec-exchange')">
                    <span class="rb-content-en">4. Secret Exchange</span>
                    <span class="rb-content-ko" style="display:none;">4. 최종 비밀 인연 교환</span>
                </button>
                <button type="button" class="rb-nav-link" onclick="scrollRulebookSection('pl-sec-scoring')">
                    <span class="rb-content-en">5. Scoring & Victory</span>
                    <span class="rb-content-ko" style="display:none;">5. 점수 계산 & 승리</span>
                </button>
            </nav>

            <!-- Body -->
            <div class="proto-modal-body rulebook-body" style="padding:18px 24px; max-height:68vh; overflow-y:auto;">

                <!-- Section 1: Overview & Setup -->
                <section class="rb-section" id="pl-sec-overview">
                    <div class="rb-intro-banner" style="background:rgba(245,158,11,0.1); border-left:4px solid #f59e0b; padding:10px 14px; border-radius:4px; margin-bottom:14px;">
                        <strong class="rb-content-en">Draft timeline sets, balance karmic connections, and secretly gift your remaining fates to rivals.</strong>
                        <strong class="rb-content-ko" style="display:none;">비공개 입찰로 시대별 세트를 획득해 내 생애를 구성하고, 손에 남은 인연을 상대에게 비밀리에 선물하세요.</strong>
                    </div>

                    <div class="rb-specs-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin:14px 0;">
                        <div class="rb-spec-item" style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); border-radius:8px; padding:10px; text-align:center;">
                            <div style="color:var(--text-muted); font-size:0.75rem;"><span class="rb-content-en">Players</span><span class="rb-content-ko" style="display:none;">인원</span></div>
                            <div style="font-size:1.1rem; font-weight:800; color:#fbbf24;">2–5</div>
                        </div>
                        <div class="rb-spec-item" style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); border-radius:8px; padding:10px; text-align:center;">
                            <div style="color:var(--text-muted); font-size:0.75rem;"><span class="rb-content-en">Time</span><span class="rb-content-ko" style="display:none;">시간</span></div>
                            <div style="font-size:1.1rem; font-weight:800; color:#fbbf24;">25 Mins</div>
                        </div>
                        <div class="rb-spec-item" style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); border-radius:8px; padding:10px; text-align:center;">
                            <div style="color:var(--text-muted); font-size:0.75rem;"><span class="rb-content-en">Ages</span><span class="rb-content-ko" style="display:none;">연령</span></div>
                            <div style="font-size:1.1rem; font-weight:800; color:#fbbf24;">10+</div>
                        </div>
                        <div class="rb-spec-item" style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); border-radius:8px; padding:10px; text-align:center;">
                            <div style="color:var(--text-muted); font-size:0.75rem;"><span class="rb-content-en">Rounds</span><span class="rb-content-ko" style="display:none;">라운드</span></div>
                            <div style="font-size:1.1rem; font-weight:800; color:#fbbf24;">8 Rounds</div>
                        </div>
                    </div>

                    <h4 class="rb-section-title"><i class="fa-solid fa-shapes"></i> <span class="rb-content-en">Components (70 Cards Total)</span><span class="rb-content-ko" style="display:none;">구성물 (총 70장)</span></h4>
                    <ul>
                        <li><span class="rb-content-en"><strong>7 Eras (10 Cards each, #01–#70):</strong> Era 1 (Red #01–10), Era 2 (Orange #11–20), Era 3 (Green #21–30), Era 4 (Blue #31–40), Era 5 (Purple #41–50), Era 6 (Slate #51–60), Era 7 (Cyan #61–70).</span><span class="rb-content-ko" style="display:none;"><strong>7개 시대 (각 10장씩, 01~70번):</strong> 1시대(빨강 01~10), 2시대(주황 11~20), 3시대(초록 21~30), 4시대(파랑 31~40), 5시대(보라 41~50), 6시대(슬레이트 51~60), 7시대(하늘 61~70).</span></li>
                        <li><span class="rb-content-en"><strong>30 Positive Connections:</strong> Lover ❤ (8 cards), Friend 🤝 (10 cards), Colleague 💡 (12 cards).</span><span class="rb-content-ko" style="display:none;"><strong>긍정적 인연 30장:</strong> 연인 ❤ (8장), 친구 🤝 (10장), 동료 💡 (12장).</span></li>
                        <li><span class="rb-content-en"><strong>30 Negative Connections:</strong> War ⚔ (8 cards), Steal 🥷 (10 cards), Conflict ⚡ (12 cards).</span><span class="rb-content-ko" style="display:none;"><strong>부정적 인연 30장:</strong> 전쟁 ⚔ (8장), 도둑 🥷 (10장), 갈등 ⚡ (12장).</span></li>
                        <li><span class="rb-content-en"><strong>10 Special Cards:</strong> Ignore Left # ← (3 cards: #26, #34, #45), Ignore Right → # (3 cards: #29, #37, #42), Double Left 2*# ← (2 cards: #32, #51), Double Right → 2*# (2 cards: #20, #39).</span><span class="rb-content-ko" style="display:none;"><strong>특수 카드 10장:</strong> 좌측 무효화 # ← (3장: 26, 34, 45번), 우측 무효화 → # (3장: 29, 37, 42번), 좌측 2배 2*# ← (2장: 32, 51번), 우측 2배 → 2*# (2장: 20, 39번).</span></li>
                    </ul>

                    <h4 class="rb-section-title"><i class="fa-solid fa-users"></i> <span class="rb-content-en">Setup by Player Count</span><span class="rb-content-ko" style="display:none;">인원별 덱 세팅</span></h4>
                    <ul>
                        <li><span class="rb-content-en"><strong>5 Players:</strong> All 70 cards used. Deal 5 cards to each player. Remaining 45 cards form the deck.</span><span class="rb-content-ko" style="display:none;"><strong>5인 플레이:</strong> 70장 전체 사용. 각 플레이어에게 5장씩 분배. 남은 45장으로 덱 구성.</span></li>
                        <li><span class="rb-content-en"><strong>4 Players:</strong> 52 cards used (Era 1–5 + #51, #52). Deal 4 cards each. 36 cards form the deck.</span><span class="rb-content-ko" style="display:none;"><strong>4인 플레이:</strong> 52장 사용 (1~5시대 + 51, 52번). 각 4장 분배. 36장으로 덱 구성.</span></li>
                        <li><span class="rb-content-en"><strong>3 Players:</strong> 39 cards used (Era 1–3 + #31~#39). Deal 4 cards each. 27 cards form the deck.</span><span class="rb-content-ko" style="display:none;"><strong>3인 플레이:</strong> 39장 사용 (1~3시대 + 31~39번). 각 4장 분배. 27장으로 덱 구성.</span></li>
                        <li><span class="rb-content-en"><strong>2 Players:</strong> 26 cards used (Era 1–2 + #21~#26). Deal 4 cards each. 18 cards form the deck.</span><span class="rb-content-ko" style="display:none;"><strong>2인 플레이:</strong> 26장 사용 (1~2시대 + 21~26번). 각 4장 분배. 18장으로 덱 구성.</span></li>
                    </ul>
                </section>

                <!-- Section 2: Bidding & SETs -->
                <section class="rb-section" id="pl-sec-bidding" style="margin-top:20px;">
                    <h4 class="rb-section-title"><i class="fa-solid fa-gavel"></i> <span class="rb-content-en">2. Sealed Bidding & SET Claiming</span><span class="rb-content-ko" style="display:none;">2. 비공개 입찰 & 세트 획득</span></h4>
                    <p>
                        <span class="rb-content-en">Each round, <em>N</em> 2-card SETs are arranged face-up in the center (top row sorted ascending, bottom row placed underneath).</span>
                        <span class="rb-content-ko" style="display:none;">매 라운드 바닥에는 인원수만큼의 2장들이 세트(상단 카드는 오름차순 정렬, 하단 카드는 그 아래 배치)가 놓입니다.</span>
                    </p>
                    <ol style="padding-left:20px; display:flex; flex-direction:column; gap:6px;">
                        <li><span class="rb-content-en"><strong>Sealed Bid:</strong> All players secretly choose 1 card from their hand and place it face-down. All players reveal their bids simultaneously.</span><span class="rb-content-ko" style="display:none;"><strong>비공개 입찰:</strong> 모든 플레이어는 손패에서 1장을 골라 뒷면으로 낸 뒤 동시에 공개합니다.</span></li>
                        <li><span class="rb-content-en"><strong>SET Priority:</strong> The player with the <strong>lowest card number</strong> takes 1st SET (leftmost). 2nd lowest takes 2nd SET, and so forth.</span><span class="rb-content-ko" style="display:none;"><strong>세트 배정:</strong> <strong>가장 작은 번호</strong>를 낸 플레이어가 1번 세트(맨 왼쪽)를 가져가며, 다음으로 작은 번호를 낸 플레이어가 2번 세트를 차례대로 가져갑니다.</span></li>
                        <li><span class="rb-content-en"><strong>Play 1, Keep 1:</strong> Of the 2 cards in the claimed SET, you choose <strong>1 card to play face-up into your personal life timeline (must be placed in ascending numerical order)</strong>. The remaining 1 card goes into your <strong>hand</strong>!</span><span class="rb-content-ko" style="display:none;"><strong>1장 배치, 1장 손패:</strong> 획득한 세트의 2장 중 <strong>1장은 내 생애 타임라인에 오름차순으로 배치</strong>하고, <strong>남은 1장은 내 손패로 가져옵니다</strong>!</span></li>
                        <li><span class="rb-content-en"><strong>Next Round Setup:</strong> The cards bid in the current round are sorted in ascending order to become the new top row. <em>N</em> new cards are drawn from the deck to form the bottom row.</span><span class="rb-content-ko" style="display:none;"><strong>다음 라운드 준비:</strong> 이번 라운드에 입찰했던 카드들이 오름차순으로 정렬되어 다음 라운드 세트의 상단 카드가 되며, 덱에서 인원수만큼 새로 뽑아 하단 카드를 채웁니다.</span></li>
                    </ol>
                </section>

                <!-- Section 3: Special Cards -->
                <section class="rb-section" id="pl-sec-special" style="margin-top:20px;">
                    <h4 class="rb-section-title"><i class="fa-solid fa-wand-magic-sparkles"></i> <span class="rb-content-en">3. Special Cards Mechanics</span><span class="rb-content-ko" style="display:none;">3. 특수 카드 상세 규칙</span></h4>
                    <p>
                        <span class="rb-content-en">Special cards have directional arrows. They affect adjacent cards in your played timeline at the end of the game:</span>
                        <span class="rb-content-ko" style="display:none;">특수 카드는 방향 화살표를 가지고 있으며, 게임 종료 시 내 생애 타임라인에 배치된 인접 카드의 효과를 변형합니다:</span>
                    </p>
                    <ul style="padding-left:20px; display:flex; flex-direction:column; gap:8px;">
                        <li><span class="rb-content-en"><strong>Ignore Left / Right (# ← / → #):</strong> Completely removes 1 regular card immediately adjacent in the arrow's direction from scoring.</span><span class="rb-content-ko" style="display:none;"><strong>좌/우측 무효화 (# ← / → #):</strong> 화살표 방향으로 바로 인접한 일반 카드 1장을 점수 계산에서 완전히 제외(제거)합니다.</span></li>
                        <li><span class="rb-content-en"><strong>Double Left / Right (2*# ← / → 2*#):</strong> Treats 1 regular card immediately adjacent in the arrow's direction as <strong>2 cards</strong> of that symbol!</span><span class="rb-content-ko" style="display:none;"><strong>좌/우측 2배 (2*# ← / → 2*#):</strong> 화살표 방향으로 바로 인접한 일반 카드 1장을 <strong>동일 기호 2장</strong>으로 취급합니다!</span></li>
                        <li><span class="rb-content-en"><strong>Special Nullification (Page 9):</strong> Special cards only affect regular cards. If a special card points directly toward another special card, its effect is nullified and it is removed from the timeline, allowing the line to collapse.</span><span class="rb-content-ko" style="display:none;"><strong>특수 카드 상쇄 (룰북 9페이지):</strong> 특수 카드는 일반 카드에만 적용됩니다. 특수 카드가 다른 특수 카드를 향할 경우 효과가 무효화되어 타임라인에서 소멸합니다.</span></li>
                    </ul>
                </section>

                <!-- Section 4: Secret Exchange -->
                <section class="rb-section" id="pl-sec-exchange" style="margin-top:20px;">
                    <h4 class="rb-section-title"><i class="fa-solid fa-gift"></i> <span class="rb-content-en">4. Round 8 Climax: Secret Connection Exchange</span><span class="rb-content-ko" style="display:none;">4. 8라운드 종료: 최종 비밀 인연 교환</span></h4>
                    <p>
                        <span class="rb-content-en">After completing Round 8, each player will hold exactly <strong>(Players - 1) cards</strong> in hand.</span>
                        <span class="rb-content-ko" style="display:none;">8라운드가 종료되면 모든 플레이어의 손패에는 정확히 <strong>(인원수 - 1)장</strong>의 카드가 남습니다.</span>
                    </p>
                    <p>
                        <span class="rb-content-en">Each player secretly chooses <strong>1 card to gift to each opposing player</strong>! Cards are delivered face-down and revealed simultaneously. All received cards are immediately added to each player's final timeline scoring!</span>
                        <span class="rb-content-ko" style="display:none;">각 플레이어는 자신을 제외한 <strong>모든 상대방에게 비밀리에 1장씩 선물</strong>합니다! 전달받은 선물 카드는 상대방의 최종 생애 타임라인에 즉시 합산되어 점수 계산에 포함됩니다. 상대에게 감점 카드를 안길지, 혹은 보너스를 방해할지 치열한 심리전이 펼쳐집니다!</span>
                    </p>
                </section>

                <!-- Section 5: Scoring & Victory -->
                <section class="rb-section" id="pl-sec-scoring" style="margin-top:20px;">
                    <h4 class="rb-section-title"><i class="fa-solid fa-trophy"></i> <span class="rb-content-en">5. Scoring & Victory</span><span class="rb-content-ko" style="display:none;">5. 점수 계산 & 최종 승리</span></h4>
                    <p>
                        <span class="rb-content-en">Count the total count of each symbol in your resolved timeline (including doubled cards and received gift cards):</span>
                        <span class="rb-content-ko" style="display:none;">특수 카드가 적용되고 선물 카드가 추가된 최종 생애 타임라인에서 기호별 총 장수를 계산합니다:</span>
                    </p>
                    <ul style="padding-left:20px; display:flex; flex-direction:column; gap:6px;">
                        <li><span class="rb-content-en"><strong>Lover ❤:</strong> 3 cards: +12 VP | 4 cards: +25 VP | 5+ cards: +50 VP (0–2 cards = 0 VP)</span><span class="rb-content-ko" style="display:none;"><strong>연인 ❤:</strong> 3장: +12점 | 4장: +25점 | 5장 이상: +50점 (0~2장 = 0점)</span></li>
                        <li><span class="rb-content-en"><strong>Friend 🤝:</strong> 3 cards: +7 VP | 4 cards: +15 VP | 5+ cards: +30 VP (0–2 cards = 0 VP)</span><span class="rb-content-ko" style="display:none;"><strong>친구 🤝:</strong> 3장: +7점 | 4장: +15점 | 5장 이상: +30점 (0~2장 = 0점)</span></li>
                        <li><span class="rb-content-en"><strong>Colleague 💡:</strong> 3 cards: +5 VP | 4 cards: +10 VP | 5+ cards: +20 VP (0–2 cards = 0 VP)</span><span class="rb-content-ko" style="display:none;"><strong>동료 💡:</strong> 3장: +5점 | 4장: +10점 | 5장 이상: +20점 (0~2장 = 0점)</span></li>
                        <li><span class="rb-content-en"><strong>War ⚔:</strong> 2 cards: -10 VP | 3 cards: -20 VP | 4+ cards: -40 VP (0–1 card = 0 VP)</span><span class="rb-content-ko" style="display:none;"><strong>전쟁 ⚔:</strong> 2장: -10점 | 3장: -20점 | 4장 이상: -40점 (0~1장 = 0점)</span></li>
                        <li><span class="rb-content-en"><strong>Steal 🥷:</strong> 2 cards: -6 VP | 3 cards: -12 VP | 4+ cards: -25 VP (0–1 card = 0 VP)</span><span class="rb-content-ko" style="display:none;"><strong>도둑 🥷:</strong> 2장: -6점 | 3장: -12점 | 4장 이상: -25점 (0~1장 = 0점)</span></li>
                        <li><span class="rb-content-en"><strong>Conflict ⚡:</strong> 2 cards: -3 VP | 3 cards: -7 VP | 4+ cards: -15 VP (0–1 card = 0 VP)</span><span class="rb-content-ko" style="display:none;"><strong>갈등 ⚡:</strong> 2장: -3점 | 3장: -7점 | 4장 이상: -15점 (0~1장 = 0점)</span></li>
                        <li><span class="rb-content-en"><strong>Era Majority (+10 VP per Era):</strong> The player with the most cards belonging to an Era scores +10 VP for that era (shared if tied).</span><span class="rb-content-ko" style="display:none;"><strong>시대별 최다 보유 보너스 (시대당 +10점):</strong> 7개 각 시대(색상)별로 카드를 가장 많이 보유한 플레이어가 시대당 +10점씩 획득합니다 (동률 시 모두 획득).</span></li>
                    </ul>
                    <p style="margin-top:10px; font-weight:700; color:#fbbf24;">
                        <span class="rb-content-en">The player with the highest total score wins! In case of a tie, the player with the highest individual card number wins.</span>
                        <span class="rb-content-ko" style="display:none;">총점이 가장 높은 플레이어가 승리합니다! 동률일 경우 가장 높은 번호의 카드를 보유한 플레이어가 승리합니다.</span>
                    </p>
                </section>
            </div>

            <!-- Footer -->
            <div class="proto-modal-footer" style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-glass);">
                <button type="button" class="btn-secondary" onclick="closeModal('${MODAL_ID}')">
                    <span class="rb-content-en">Close</span>
                    <span class="rb-content-ko" style="display:none;">닫기</span>
                </button>
                <a href="/proto/past-lives/" class="btn-play-proto" style="padding: 9px 18px;">
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
