(function () {
    'use strict';

    // Publisher sell sheet for Doore. Every fact here comes from page 1 of
    // "Game Introduction - Doore.pdf", the sheet sent to publishers.
    const modalMarkup = `
        <div class="proto-modal-overlay doore-sell-sheet-overlay" id="dooreSellSheetModal" role="dialog" aria-modal="true" aria-labelledby="dooreSellSheetTitle" style="display:none;">
        <div class="proto-modal-card doore-sell-sheet-card" id="dooreSellSheetToast">
            <header class="doore-ss-header">
                <span class="doore-ss-mark" aria-hidden="true">🌾</span>
                <div class="doore-ss-heading">
                    <span class="doore-ss-eyebrow"><span class="rb-content-en">Publisher sell sheet</span><span class="rb-content-ko" style="display:none;">퍼블리셔 셀 시트</span></span>
                    <h3 class="doore-ss-title" id="dooreSellSheetTitle">
                        <span class="rb-title-text-en">Doore — Sell Sheet</span>
                        <span class="rb-title-text-ko" style="display:none;">두레 — 셀 시트</span>
                    </h3>
                </div>
                <div class="doore-ss-actions">
                    <div class="doore-ss-lang" role="group" aria-label="Sell sheet language">
                        <button type="button" class="rb-lang-btn" data-rb-lang="ko" onclick="setRulebookLanguage('ko', 'dooreSellSheetModal')">KO</button>
                        <button type="button" class="rb-lang-btn" data-rb-lang="en" onclick="setRulebookLanguage('en', 'dooreSellSheetModal')">EN</button>
                    </div>
                    <button type="button" class="doore-ss-close" onclick="closeDooreSellSheet()" aria-label="Close Doore sell sheet"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </header>

            <div class="doore-ss-body">
                <div class="rb-content-en">
                    <div class="doore-ss-hero">
                        <h4>Drafting, turned inside out.</h4>
                        <p>Every round you decide what each opponent receives — then build the best farm you can from whatever they decided to leave you.</p>
                    </div>

                    <div class="doore-ss-specs">
                        <div><strong>2–4</strong><span>Players</span></div>
                        <div><strong>8+</strong><span>Ages</span></div>
                        <div><strong>30</strong><span>Minutes</span></div>
                    </div>

                    <div class="doore-ss-tags">
                        <span>Set Collection</span><span>Tile Placement</span><span>Drafting</span>
                    </div>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-star"></i> Key selling points</h5>
                        <ul class="doore-ss-points">
                            <li>A game that <strong>twists drafting rules</strong> to create intricate interactions.</li>
                            <li>Players encounter challenges from their opponents, but ultimately <strong>they must solve the puzzles themselves</strong> to achieve the best possible score.</li>
                        </ul>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-list-ol"></i> How to play</h5>
                        <ol class="doore-ss-steps">
                            <li><div><strong>Set up</strong><span>Each player has their own personal board, one Personal Tile, and 3 coins.</span></div></li>
                            <li><div><strong>Draw</strong><span>In each round, every player takes one more tile than the number of players.</span></div></li>
                            <li><div><strong>Arrange the stack</strong><span>Order your tiles: the tile for the player on your left, the tile for the next player on the left, the tile you keep for yourself, and finally the spare tile.</span></div></li>
                            <li><div><strong>Pass left</strong><span>Hand the arranged stack to the player on your left. Whoever receives it places the tiles on their own board.</span></div></li>
                            <li><div><strong>Pay to look further</strong><span>Don't like the tile on offer? Pay 1 coin to check the next tile, and use that one instead.</span></div></li>
                            <li><div><strong>End of round</strong><span>Once a tile has been used and only one tile remains, the round ends.</span></div></li>
                            <li><div><strong>Close your board</strong><span>If one space is still open at the end of the round, fill it with the Personal Tile you received at the start of the game.</span></div></li>
                        </ol>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-trophy"></i> Scoring</h5>
                        <div class="doore-ss-score">
                            <em>⭐ Stars in a crop field</em><b>×</b><em>👷 Workers directed at it</em>
                        </div>
                        <p class="doore-ss-score-note">Score every crop field this way and add the results. The player with the highest total wins the game.</p>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-box-open"></i> Components</h5>
                        <div class="doore-ss-components">
                            <div><i class="fa-solid fa-table-cells"></i><span><b>4</b><small>Personal Boards</small></span></div>
                            <div><i class="fa-solid fa-star"></i><span><b>4</b><small>Personal Tiles</small></span></div>
                            <div><i class="fa-solid fa-layer-group"></i><span><b>100</b><small>Game Tiles</small></span></div>
                            <div><i class="fa-solid fa-coins"></i><span><b>40</b><small>Coin Tokens</small></span></div>
                        </div>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-display"></i> Playable prototype</h5>
                        <figure class="doore-ss-figure">
                            <img src="/assets/doore_ingame_table.png" alt="The Doore digital prototype: a personal farm board on the left and the draft stack being ordered for the pass on the right." loading="lazy">
                            <figcaption>The full game runs in the browser — solo against AI or in a multiplayer room — so publishers can try it without a print-and-play.</figcaption>
                        </figure>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-envelope"></i> Contact</h5>
                        <div class="doore-ss-contact">
                            <strong>Ikhwan Kwon — Designer</strong>
                            <a href="mailto:gamedesigner.ikhwan@gmail.com">gamedesigner.ikhwan@gmail.com</a>
                        </div>
                    </section>
                </div>

                <div class="rb-content-ko" style="display:none;">
                    <div class="doore-ss-hero">
                        <h4>드래프트를 뒤집다.</h4>
                        <p>매 라운드 상대에게 갈 타일을 내가 정하고, 상대가 내게 남긴 타일로 최선의 농장을 만듭니다.</p>
                    </div>

                    <div class="doore-ss-specs">
                        <div><strong>2–4</strong><span>인원</span></div>
                        <div><strong>8+</strong><span>연령</span></div>
                        <div><strong>30</strong><span>분</span></div>
                    </div>

                    <div class="doore-ss-tags">
                        <span>세트 수집</span><span>타일 배치</span><span>드래프트</span>
                    </div>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-star"></i> 핵심 세일즈 포인트</h5>
                        <ul class="doore-ss-points">
                            <li><strong>드래프트 규칙을 비틀어</strong> 촘촘한 상호작용을 만들어내는 게임입니다.</li>
                            <li>상대가 던진 문제를 마주하지만, 결국 <strong>최고의 점수는 스스로 풀어내야</strong> 얻을 수 있습니다.</li>
                        </ul>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-list-ol"></i> 플레이 방법</h5>
                        <ol class="doore-ss-steps">
                            <li><div><strong>게임 준비</strong><span>각 플레이어는 개인 보드 1개, 개인 타일 1장, 동전 3개를 가집니다.</span></div></li>
                            <li><div><strong>타일 획득</strong><span>매 라운드 각 플레이어는 인원수보다 1장 많은 타일을 가져옵니다.</span></div></li>
                            <li><div><strong>순서 정하기</strong><span>왼쪽 플레이어에게 줄 타일, 그다음 왼쪽 플레이어에게 줄 타일, 자신이 가질 타일, 마지막으로 남는 타일 순서로 정렬합니다.</span></div></li>
                            <li><div><strong>왼쪽으로 전달</strong><span>정렬한 타일 더미를 왼쪽 플레이어에게 넘깁니다. 받은 사람은 그 타일을 자신의 보드에 배치합니다.</span></div></li>
                            <li><div><strong>동전으로 넘기기</strong><span>제시된 타일이 마음에 들지 않으면 동전 1개를 내고 다음 타일을 확인한 뒤, 그 타일을 사용할 수 있습니다.</span></div></li>
                            <li><div><strong>라운드 종료</strong><span>타일을 사용한 뒤 1장만 남으면 라운드가 끝납니다.</span></div></li>
                            <li><div><strong>보드 채우기</strong><span>라운드가 끝났을 때 개인 보드에 빈칸이 하나 남아 있다면, 게임 시작 때 받은 개인 타일로 그 칸을 채웁니다.</span></div></li>
                        </ol>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-trophy"></i> 점수 계산</h5>
                        <div class="doore-ss-score">
                            <em>⭐ 작물 밭에 모인 별</em><b>×</b><em>👷 그 밭을 향한 일꾼</em>
                        </div>
                        <p class="doore-ss-score-note">모든 작물 밭을 이렇게 계산해 합산하며, 총점이 가장 높은 플레이어가 승리합니다.</p>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-box-open"></i> 구성물</h5>
                        <div class="doore-ss-components">
                            <div><i class="fa-solid fa-table-cells"></i><span><b>4</b><small>개인 보드</small></span></div>
                            <div><i class="fa-solid fa-star"></i><span><b>4</b><small>개인 타일</small></span></div>
                            <div><i class="fa-solid fa-layer-group"></i><span><b>100</b><small>게임 타일</small></span></div>
                            <div><i class="fa-solid fa-coins"></i><span><b>40</b><small>동전 토큰</small></span></div>
                        </div>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-display"></i> 플레이 가능한 프로토타입</h5>
                        <figure class="doore-ss-figure">
                            <img src="/assets/doore_ingame_table.png" alt="두레 디지털 프로토타입 화면: 왼쪽에는 개인 농장 보드, 오른쪽에는 전달할 타일 순서를 정하는 드래프트 스택." loading="lazy">
                            <figcaption>브라우저에서 솔로(AI) 또는 멀티플레이로 전체 게임을 바로 플레이할 수 있어, 퍼블리셔가 PnP 없이도 검토할 수 있습니다.</figcaption>
                        </figure>
                    </section>

                    <section class="doore-ss-section">
                        <h5><i class="fa-solid fa-envelope"></i> 연락처</h5>
                        <div class="doore-ss-contact">
                            <strong>권익환 (Ikhwan Kwon) — 디자이너</strong>
                            <a href="mailto:gamedesigner.ikhwan@gmail.com">gamedesigner.ikhwan@gmail.com</a>
                        </div>
                    </section>
                </div>
            </div>

            <footer class="doore-ss-footer">
                <button type="button" onclick="closeDooreSellSheet()"><span class="rb-content-en">Close</span><span class="rb-content-ko" style="display:none;">닫기</span></button>
                <a href="https://doore-boardgame.vercel.app/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> <span class="rb-content-en">Play the prototype</span><span class="rb-content-ko" style="display:none;">프로토타입 플레이</span></a>
            </footer>
        </div>
        </div>`;

    const MODAL_ID = 'dooreSellSheetModal';

    function getModal() {
        return document.getElementById(MODAL_ID);
    }

    function syncLanguage() {
        const isKo = document.documentElement.getAttribute('lang') === 'ko';
        if (typeof window.setRulebookLanguage === 'function') {
            window.setRulebookLanguage(isKo ? 'ko' : 'en', MODAL_ID);
        }
    }

    window.openDooreSellSheet = function () {
        if (!getModal()) return;
        if (typeof window.openModal === 'function') {
            window.openModal(MODAL_ID);
        }
    };

    window.closeDooreSellSheet = function () {
        if (!getModal()) return;
        if (typeof window.closeModal === 'function') {
            window.closeModal(MODAL_ID);
        }
    };

    function init() {
        document.body.insertAdjacentHTML('beforeend', modalMarkup);
        const modal = getModal();
        syncLanguage();
        // The page's language switch only re-runs the rulebooks it knows about,
        // so follow the <html lang> attribute instead of being wired into it.
        new MutationObserver(syncLanguage).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang']
        });
        modal.addEventListener('click', function (event) {
            if (event.target === modal) window.closeDooreSellSheet();
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && getModal()?.classList.contains('active')) {
            window.closeDooreSellSheet();
        }
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
