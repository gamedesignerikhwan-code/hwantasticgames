(function () {
    'use strict';

    const MODAL_ID = 'slavesAriseRulebookModal';

    const modalMarkup = `
    <div class="proto-modal-overlay" id="${MODAL_ID}" role="dialog" aria-modal="true" aria-labelledby="${MODAL_ID}Title" style="display:none;">
        <div class="proto-modal-card rulebook-modal-card pl-rulebook-modal-card">
            <!-- Header -->
            <div class="proto-modal-header">
                <div class="proto-modal-title" id="${MODAL_ID}Title">
                    <i class="fa-solid fa-scroll" style="color: #f59e0b;"></i>
                    <span class="rb-title-text-en">Slaves, Arise! — Complete Rulebook</span>
                    <span class="rb-title-text-ko" style="display:none;">노비여, 일어나라! (Slaves, Arise!) — 전체 규칙서</span>
                </div>
                <div class="rulebook-header-actions">
                    <div class="rb-lang-toggle" role="group" aria-label="Rulebook language toggle">
                        <button type="button" class="rb-lang-btn active" data-lang="en">EN</button>
                        <button type="button" class="rb-lang-btn" data-lang="ko">KO</button>
                    </div>
                    <button type="button" class="proto-modal-close" aria-label="Close rulebook" onclick="closeModal('${MODAL_ID}')">&times;</button>
                </div>
            </div>

            <!-- Body -->
            <div class="rulebook-modal-body">
                <!-- Theme Section -->
                <section class="rb-section">
                    <h3 class="rb-section-heading"><i class="fa-solid fa-landmark"></i> <span class="rb-content-en">Game Overview & Theme</span><span class="rb-content-ko" style="display:none;">게임 개요 및 배경</span></h3>
                    <p class="rb-p">
                        <span class="rb-content-en">In the late Joseon period, the social order of the class system was in decline. During this time, commoners and slaves sought their liberation by purchasing family lineages to become Yangban (nobility). In <em>Slaves, Arise!</em>, you determine the fate of dual-ended cards: flip cards strategically when losing tricks, deploy powerful special abilities (Give, Flip All, Self Flip), unleash the devastating 0-on-9 Super Ten combo, and be the first to play all cards from your hand to win!</span>
                        <span class="rb-content-ko" style="display:none;">조선 후기, 신분제 질서가 동요하던 시기. 돈과 기지만 있다면 신분의 굴레를 벗어날 수 있었고, 평민과 노비들은 좋은 족보를 사들여 양반이 되려 했습니다. <em>노비여, 일어나라!</em>에서 플레이어는 상단과 하단 숫자가 다른 양면 카드를 들고 승부합니다. 트릭에서 질 때마다 손패 1장을 뒤집어 조합을 만들고, 특수 능력(1: 양도, 5: 전원 반전, 8: 자가 반전)과 9 위의 0 필살 10 규칙을 활용하여 가장 먼저 손패를 모두 털어내세요!</span>
                    </p>
                    <div class="rb-badge-row">
                        <span class="rb-badge"><i class="fa-solid fa-users"></i> 2–6 Players</span>
                        <span class="rb-badge"><i class="fa-solid fa-clock"></i> 20 Mins</span>
                        <span class="rb-badge"><i class="fa-solid fa-layer-group"></i> 72 Dual-ended Cards</span>
                        <span class="rb-badge"><i class="fa-solid fa-trophy"></i> Shedding / Climbing</span>
                    </div>
                </section>

                <!-- Components Section -->
                <section class="rb-section">
                    <h3 class="rb-section-heading"><i class="fa-solid fa-box-open"></i> <span class="rb-content-en">Components (72 Game Cards)</span><span class="rb-content-ko" style="display:none;">구성물 (72장 양면 카드)</span></h3>
                    <p class="rb-p">
                        <span class="rb-content-en">The deck consists of 72 dual-ended cards. Each card has a <strong>Low Number (1, 2, 3, 4)</strong> on one end and a <strong>High Number (5, 6, 7, 8, 9, 0)</strong> on the other. Exactly 24 unique pairings &times; 3 copies each = 72 cards total.</span>
                        <span class="rb-content-ko" style="display:none;">덱은 72장의 상하 양면 카드로 구성됩니다. 각 카드는 한쪽 끝에 <strong>낮은 숫자 (1, 2, 3, 4)</strong>, 반대쪽 끝에 <strong>높은 숫자 (5, 6, 7, 8, 9, 0)</strong>가 적혀 있습니다. 정확히 24종의 고유 페어 &times; 각 3장씩 = 총 72장.</span>
                    </p>
                </section>

                <!-- Setup Section -->
                <section class="rb-section">
                    <h3 class="rb-section-heading"><i class="fa-solid fa-gears"></i> <span class="rb-content-en">Setup</span><span class="rb-content-ko" style="display:none;">게임 세팅</span></h3>
                    <ol class="rb-ol">
                        <li><span class="rb-content-en">Thoroughly shuffle all 72 cards to create a deck.</span><span class="rb-content-ko" style="display:none;">72장 전 카드를 충분히 섞어 덱을 만듭니다.</span></li>
                        <li><span class="rb-content-en">Each player receives <strong>12 cards</strong> into their hand. <strong>Crucial rule: Players MUST NOT alter or rotate the top and bottom orientation of the cards they receive during setup!</strong></span><span class="rb-content-ko" style="display:none;">각 플레이어는 <strong>12장</strong>씩 카드를 받습니다. <strong>가장 중요한 규칙: 처음에 카드를 받았을 때 카드의 상하 방향을 임의로 돌리거나 바꿀 수 없습니다!</strong></span></li>
                        <li><span class="rb-content-en">A starting player is determined randomly to lead the first trick.</span><span class="rb-content-ko" style="display:none;">선 플레이어를 무작위로 정하여 첫 트릭을 시작합니다.</span></li>
                    </ol>
                </section>

                <!-- How to Play -->
                <section class="rb-section">
                    <h3 class="rb-section-heading"><i class="fa-solid fa-gamepad"></i> <span class="rb-content-en">How to Play</span><span class="rb-content-ko" style="display:none;">게임 진행 방법</span></h3>
                    <ol class="rb-ol">
                        <li><span class="rb-content-en"><strong>Leading a Trick:</strong> The active leader plays a combination of <strong>1 to 3 cards of the exact same number</strong> based on the numbers currently at the <strong>TOP</strong> of their hand (Single, Pair, or Triple).</span><span class="rb-content-ko" style="display:none;"><strong>선 플레이어의 출패:</strong> 선 플레이어는 현재 자신의 손패 상단에 보이는 숫자를 기준으로 <strong>같은 숫자 1~3장</strong>(싱글, 페어, 트리플)을 냅니다.</span></li>
                        <li><span class="rb-content-en"><strong>Following:</strong> In clockwise order, the next player must play the <strong>same number of cards</strong> with a <strong>strictly higher number</strong>, or choose to <strong>Pass</strong>.</span><span class="rb-content-ko" style="display:none;"><strong>다음 플레이어:</strong> 시계 방향으로 돌아가며, 앞사람이 낸 것과 <strong>정확히 같은 장수</strong>이면서 <strong>더 높은 숫자</strong>를 내거나 <strong>패스</strong>합니다.</span></li>
                        <li><span class="rb-content-en"><strong>Special 0 Rule (Super 10 on 9):</strong> Number 9 is normally the highest number. However, if a set of 9s is on the table, playing matching count of <strong>0s is treated as 10 (the ultimate number)</strong>! The player who plays 0s on 9s <strong>immediately wins the trick without any passing</strong>! (Otherwise, 0 is simply treated as 0).</span><span class="rb-content-ko" style="display:none;"><strong>특수 0 규칙 (9 위의 필살 10):</strong> 9가 기본 최고 숫자이지만, 바닥에 9가 나와 있을 때 같은 장수의 <strong>0을 내면 10으로 취급되어 즉시 트릭을 승리</strong>하며 다른 사람은 카드를 더 낼 수 없습니다! (그 외의 상황에서는 0은 일반적인 0으로 취급됩니다).</span></li>
                        <li><span class="rb-content-en"><strong>Trick Resolution & Losers' Flip:</strong> When all other players pass in succession (or someone plays 0s on 9s), that player becomes the winner of the turn. <strong>All players OTHER than the winner (the losers) choose 1 card from their hand and flip it 180&deg;</strong>, turning weak numbers into strong numbers!</span><span class="rb-content-ko" style="display:none;"><strong>트릭 종료 및 패자 뒤집기:</strong> 모든 다른 플레이어가 연속 패스하거나 9 위에 0이 나오면 그 플레이어가 트릭의 승리자가 됩니다. <strong>승리자를 제외한 모든 패자들은 자신의 손패에서 1장을 골라 180도 뒤집습니다!</strong> (약한 숫자를 강력한 숫자로 바꾸거나 조합을 구축하는 핵심 반전 요소).</span></li>
                        <li><span class="rb-content-en"><strong>Winner Leads Next:</strong> The trick winner clears the table and leads the next fresh trick.</span><span class="rb-content-ko" style="display:none;"><strong>승리자 선:</strong> 트릭 승리자가 바닥 카드를 치우고 다음 새 트릭을 리드합니다.</span></li>
                    </ol>
                </section>

                <!-- Special Card Abilities -->
                <section class="rb-section">
                    <h3 class="rb-section-heading"><i class="fa-solid fa-wand-magic-sparkles"></i> <span class="rb-content-en">Special Number Abilities (Optional)</span><span class="rb-content-ko" style="display:none;">숫자 특수 능력 (선택 적용)</span></h3>
                    <ul class="rb-ul">
                        <li><span class="rb-content-en"><strong>Number 1 [Give Card]:</strong> You may give 1 card from your hand to another player.</span><span class="rb-content-ko" style="display:none;"><strong>1번 [양도]:</strong> 자신의 손패 1장을 다른 플레이어에게 넘겨줄 수 있습니다.</span></li>
                        <li><span class="rb-content-en"><strong>Number 5 [Flip All]:</strong> You may choose a player; that chosen player must flip ALL cards in their hand!</span><span class="rb-content-ko" style="display:none;"><strong>5번 [전원 반전]:</strong> 원하는 플레이어 1명을 지목하여 그 플레이어의 손패 전체를 180도 뒤집게 합니다!</span></li>
                        <li><span class="rb-content-en"><strong>Number 8 [Self Flip]:</strong> You may choose 1 card in your own hand and immediately flip it.</span><span class="rb-content-ko" style="display:none;"><strong>8번 [자가 반전]:</strong> 자신의 손패 중 1장을 골라 즉시 뒤집을 수 있습니다.</span></li>
                    </ul>
                </section>

                <!-- Victory Condition -->
                <section class="rb-section">
                    <h3 class="rb-section-heading"><i class="fa-solid fa-crown"></i> <span class="rb-content-en">Victory Condition</span><span class="rb-content-ko" style="display:none;">승리 조건</span></h3>
                    <p class="rb-p">
                        <span class="rb-content-en">The first player to play all the cards from their hand (0 cards remaining) breaks free from servitude, becomes the Yangban nobility, and immediately wins the game!</span>
                        <span class="rb-content-ko" style="display:none;">자신의 손패를 가장 먼저 모두 털어낸 플레이어(0장)가 신분의 굴레를 벗어나 양반에 등극하며 즉시 최종 승리합니다!</span>
                    </p>
                </section>
            </div>
        </div>
    </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
        document.body.insertAdjacentHTML('beforeend', modalMarkup);
        const modal = document.getElementById(MODAL_ID);
        if (!modal) return;

        const langBtns = modal.querySelectorAll('.rb-lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetLang = btn.getAttribute('data-lang');
                langBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const enElems = modal.querySelectorAll('.rb-content-en, .rb-title-text-en');
                const koElems = modal.querySelectorAll('.rb-content-ko, .rb-title-text-ko');

                if (targetLang === 'ko') {
                    enElems.forEach(el => el.style.display = 'none');
                    koElems.forEach(el => el.style.display = '');
                } else {
                    enElems.forEach(el => el.style.display = '');
                    koElems.forEach(el => el.style.display = 'none');
                }
            });
        });
    });
})();
