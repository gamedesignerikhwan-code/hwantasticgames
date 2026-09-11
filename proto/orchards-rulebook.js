(function () {
    'use strict';

    const toastMarkup = `
        <aside class="orchards-rulebook-toast" id="orchardsRulebookToast" role="dialog" aria-modal="false" aria-labelledby="orchardsRulebookToastTitle" aria-hidden="true">
            <header class="orchards-toast-header">
                <span class="orchards-toast-mark" aria-hidden="true">🍏</span>
                <div class="orchards-toast-heading">
                    <span class="orchards-toast-eyebrow"><span class="rb-content-en">Official digital rulebook</span><span class="rb-content-ko" style="display:none;">공식 디지털 규칙서</span></span>
                    <h3 class="orchards-toast-title" id="orchardsRulebookToastTitle">
                        <span class="rb-title-text-en">Orchards Rulebook</span>
                        <span class="rb-title-text-ko" style="display:none;">오차드 공식 규칙서</span>
                    </h3>
                </div>
                <div class="orchards-toast-actions">
                    <div class="orchards-toast-lang" role="group" aria-label="Rulebook language">
                        <button type="button" class="rb-lang-btn" data-rb-lang="ko" onclick="setRulebookLanguage('ko', 'orchardsRulebookToast')">KO</button>
                        <button type="button" class="rb-lang-btn" data-rb-lang="en" onclick="setRulebookLanguage('en', 'orchardsRulebookToast')">EN</button>
                    </div>
                    <button type="button" class="orchards-toast-close" onclick="closeOrchardsRulebookToast()" aria-label="Close Orchards rulebook"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </header>

            <div class="orchards-toast-body">
                <div class="rb-content-en">
                    <p class="orchards-toast-lead"><strong>Grow a connected orchard. Harvest at the perfect moment.</strong><br>Use the number on every tile as a blind bid, draft from the shared market, then turn that bid into a growing orchard or a fresh harvest.</p>
                    <div class="orchards-toast-specs"><span>2–5 Players</span><span>30 Minutes</span><span>Ages 8+</span></div>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">01</span> Overview &amp; objective</h4><p>Build a productive orchard from five terrain types. Terrain brings workers; crop tiles bring fruit. At game end, each connected orchard scores <strong>workers × fruit</strong>. The highest total score wins.</p></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">02</span> Components</h4><ul><li><strong>50 terrain tiles:</strong> two diagonal color halves and 1–5 workers in total.</li><li><strong>40 crop tiles:</strong> each provides 1–4 fruit and/or scarecrow tokens.</li><li><strong>106 tokens:</strong> 15 Apple · 17 Banana · 19 Pear · 21 Blueberry · 23 Grape · 11 Scarecrow.</li></ul><div class="orchards-toast-callout"><strong>Tile numbers matter.</strong> Every tile has a unique number from 1 to 90. Lower numbers act earlier when bids are revealed.</div></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">03</span> Setup</h4><ol><li>Randomly remove tiles according to player count and return them unseen.</li><li>Deal <strong>5 tiles</strong> to each player.</li><li>Place the remaining tiles face down as the deck and keep all tokens within reach.</li></ol><table class="orchards-toast-table"><thead><tr><th>Players</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><th>Remove</th><td>15</td><td>10</td><td>5</td><td>0</td></tr></tbody></table></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">04</span> Initial hand draft</h4><p>Everyone chooses 1 tile from their 5-tile hand and keeps it. Pass all remaining tiles left. Repeat until everyone has kept 4 tiles. The single unchosen tile in each packet is removed.</p><div class="orchards-toast-callout">You begin round 1 with exactly <strong>4 tiles in hand</strong>. Example: keep tile #34 and pass the other four tiles left.</div></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">05</span> Round flow</h4><p>The game has <strong>13 rounds</strong>. Complete these steps in order:</p><ol><li><strong>Reveal the market:</strong> reveal 5 tiles from the deck.</li><li><strong>Bid secretly:</strong> each player chooses 1 hand tile; it will also be played this round.</li><li><strong>Reveal &amp; order:</strong> reveal together; lowest tile number goes first.</li><li><strong>Draft:</strong> in bid order, take 1 market tile into your hand.</li><li><strong>Play bids:</strong> in the same order, resolve the tile each player submitted.</li></ol><div class="orchards-toast-callout">Hand size stays at 4: bid one tile and draft one replacement every round. The lowest bid drafts first; the market tile enters your hand, while the submitted bid tile is played now.</div></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">06</span> Playing tiles</h4><p><strong>🌿 Terrain tile</strong></p><ul><li>Your first terrain tile may be placed in any open space.</li><li>Every later terrain tile must share an edge with your orchard. Diagonal contact is not enough.</li><li>Rotate in 90° steps before placing. Colors do not need to match.</li></ul><p><strong>🧺 Crop tile</strong></p><ul><li>Discard it and take every token shown.</li><li>Place each fruit on a terrain half of the matching color; any number may share a half.</li><li>Discard any token with no matching terrain.</li></ul><p><strong>🎃 Scarecrow</strong></p><ul><li>Place it on any terrain color.</li><li>It counts as +1 worker in that connected orchard, not as fruit.</li></ul><div class="orchards-toast-callout"><strong>Early crop risk:</strong> fruit may be lost if you play a crop before you have matching terrain. Example: tile #55 gives two apples and one scarecrow; apples go on red terrain and the scarecrow may go on either terrain.</div></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">07</span> Final play &amp; game end</h4><p>After round 13, every player still has 4 tiles. Choose <strong>one</strong> final tile and play it normally, then discard the other 3. Resolve all final tiles and tokens, then score.</p></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">08</span> Scoring</h4><p><strong>A. Connected-orchard points</strong><br>A connected orchard is a group of same-color terrain halves joined through shared edges. Rotated diagonal halves connect only where that color reaches the shared edge. Score each orchard separately: <strong>workers × fruit = points</strong>. Scarecrows count as workers.</p><div class="orchards-toast-callout">Example: a two-tile red orchard with 4 printed workers, 1 scarecrow and 3 apples scores <strong>5 × 3 = 15 points</strong>.</div><p><strong>B. Largest-orchard bonus</strong><br>For each color, compare each player's largest connected orchard by terrain-tile count. A sole leader gains <strong>10 points</strong>; all tied leaders gain <strong>7 points</strong>. No bonus if nobody has that color.</p><p><strong>C. Victory</strong><br>Add all connected-orchard points and largest-orchard bonuses. Highest total wins.</p></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">✓</span> Quick reference</h4><div class="orchards-toast-quick"><span>Market: 5 tiles</span><span>Hand: 4 tiles</span><span>13 rounds + final</span><span>Lowest bid first</span><span>Workers × fruit</span><span>Largest: 10 / tied 7</span></div><details><summary>What counts as connected?</summary><p>Same-color terrain halves must meet directly across an edge. Corners do not connect, and rotating a tile changes which edges each diagonal half reaches.</p></details><details><summary>Does the market tile get played immediately?</summary><p>No. It enters your hand. The tile submitted as your bid is played this round.</p></details><details><summary>Can I save a crop token for later?</summary><p>No. Resolve every token immediately by placing it legally or discarding it.</p></details></section>
                </div>

                <div class="rb-content-ko" style="display:none;">
                    <p class="orchards-toast-lead"><strong>과수원을 연결하고, 가장 좋은 순간에 수확하세요.</strong><br>타일의 고유 번호로 비공개 입찰하고, 공동 시장에서 타일을 가져온 뒤, 입찰에 사용한 타일로 과수원을 넓히거나 과일을 수확합니다.</p>
                    <div class="orchards-toast-specs"><span>2–5인</span><span>30분</span><span>8세 이상</span></div>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">01</span> 게임 개요와 목표</h4><p>다섯 종류의 지형을 연결해 풍성한 과수원을 만듭니다. 지형 타일은 일꾼을, 작물 타일은 과일을 제공합니다. 게임이 끝나면 연결된 과수원마다 <strong>일꾼 × 과일</strong>로 점수를 얻으며, 총점이 가장 높은 플레이어가 승리합니다.</p></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">02</span> 구성물</h4><ul><li><strong>지형 타일 50장:</strong> 대각선으로 나뉜 두 색 지형과 총 1–5명의 일꾼.</li><li><strong>작물 타일 40장:</strong> 과일 및 허수아비 토큰 1–4개를 제공합니다.</li><li><strong>토큰 106개:</strong> 사과 15 · 바나나 17 · 배 19 · 블루베리 21 · 포도 23 · 허수아비 11.</li></ul><div class="orchards-toast-callout"><strong>타일 번호가 중요합니다.</strong> 모든 타일에는 1부터 90까지 서로 다른 번호가 있으며, 낮은 번호일수록 입찰 공개 후 먼저 행동합니다.</div></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">03</span> 게임 준비</h4><ol><li>플레이어 수에 맞춰 타일을 무작위로 제거하고, 내용을 보지 않은 채 제외합니다.</li><li>각 플레이어에게 타일을 <strong>5장씩</strong> 나눠 줍니다.</li><li>남은 타일은 뒷면으로 덱을 만들고, 모든 토큰을 손이 닿는 곳에 둡니다.</li></ol><table class="orchards-toast-table"><thead><tr><th>인원</th><th>2인</th><th>3인</th><th>4인</th><th>5인</th></tr></thead><tbody><tr><th>제거</th><td>15장</td><td>10장</td><td>5장</td><td>0장</td></tr></tbody></table></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">04</span> 초기 손패 드래프트</h4><p>자신의 5장 중 1장을 골라 보관한 뒤, 남은 타일을 왼쪽 플레이어에게 전달합니다. 모두가 4장을 확보할 때까지 반복합니다. 각 묶음에 마지막으로 남은 1장은 게임에서 제거합니다.</p><div class="orchards-toast-callout">1라운드는 정확히 <strong>4장의 손패</strong>로 시작합니다. 예: #34를 선택하고 나머지 4장을 왼쪽으로 전달합니다.</div></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">05</span> 라운드 진행</h4><p>게임은 <strong>13라운드</strong> 동안 진행합니다.</p><ol><li><strong>시장 공개:</strong> 덱에서 타일 5장을 공개합니다.</li><li><strong>비공개 입찰:</strong> 각자 손패 1장을 고릅니다. 이번 라운드에 실제로 사용할 타일입니다.</li><li><strong>동시 공개와 순서 결정:</strong> 타일 번호가 낮은 플레이어부터 차례를 정합니다.</li><li><strong>시장 드래프트:</strong> 정해진 순서대로 시장에서 타일 1장을 손패에 가져옵니다.</li><li><strong>입찰 타일 사용:</strong> 같은 순서대로 입찰에 낸 타일을 해결합니다.</li></ol><div class="orchards-toast-callout">손패는 계속 4장입니다. 낮은 번호가 시장을 먼저 고르며, 시장 타일은 손패로 들어가고 입찰한 타일은 지금 사용합니다.</div></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">06</span> 타일 사용</h4><p><strong>🌿 지형 타일</strong></p><ul><li>첫 지형 타일은 비어 있는 아무 칸에 놓을 수 있습니다.</li><li>두 번째부터는 이미 놓인 타일과 변으로 맞닿아야 합니다. 모서리만 닿는 배치는 연결이 아닙니다.</li><li>놓기 전에 90° 단위로 회전할 수 있으며, 맞닿는 색은 달라도 됩니다.</li></ul><p><strong>🧺 작물 타일</strong></p><ul><li>작물 타일을 버리고 표시된 토큰을 모두 가져옵니다.</li><li>각 과일은 같은 색 지형의 반쪽에 놓습니다. 한 반쪽에 여러 토큰을 놓을 수 있습니다.</li><li>일치하는 지형이 없는 토큰은 버립니다.</li></ul><p><strong>🎃 허수아비</strong></p><ul><li>아무 색 지형에나 놓을 수 있습니다.</li><li>그 연결 과수원에서 일꾼 +1로 계산하며 과일 수에는 포함하지 않습니다.</li></ul><div class="orchards-toast-callout"><strong>초반 작물 주의:</strong> 같은 색 지형이 없으면 과일을 잃을 수 있습니다. 예: #55의 사과 2개는 빨간 지형에 놓고, 허수아비는 원하는 지형에 놓습니다.</div></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">07</span> 마지막 타일과 게임 종료</h4><p>13라운드가 끝나면 손에 남은 4장 중 <strong>1장만</strong> 골라 일반 규칙대로 사용하고 나머지 3장은 버립니다. 모두 마지막 타일과 토큰을 해결하면 점수를 계산합니다.</p></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">08</span> 점수 계산</h4><p><strong>A. 연결 과수원 점수</strong><br>같은 색 지형 반쪽들이 서로 맞닿은 변으로 이어진 묶음입니다. 대각선 지형은 해당 색 반쪽이 실제로 닿는 변에서만 연결됩니다. 과수원마다 <strong>일꾼 × 과일 = 점수</strong>로 계산하며 허수아비도 일꾼 수에 포함합니다.</p><div class="orchards-toast-callout">예: 빨간 2타일 과수원에 기본 일꾼 4명, 허수아비 1개, 사과 3개가 있다면 <strong>5 × 3 = 15점</strong>입니다.</div><p><strong>B. 가장 큰 과수원 보너스</strong><br>다섯 색마다 가장 큰 연결 과수원을 지형 타일 수로 비교합니다. 단독 1위는 <strong>10점</strong>, 공동 1위는 모두 <strong>7점</strong>을 얻습니다. 누구도 해당 색이 없다면 보너스가 없습니다.</p><p><strong>C. 승리</strong><br>모든 연결 과수원 점수와 가장 큰 과수원 보너스를 합쳐 총점이 가장 높은 플레이어가 승리합니다.</p></section>

                    <section class="orchards-toast-section"><h4><span class="orchards-toast-no">✓</span> 빠른 참조</h4><div class="orchards-toast-quick"><span>시장 5장</span><span>손패 4장</span><span>13라운드 + 마지막</span><span>낮은 번호부터</span><span>일꾼 × 과일</span><span>최대 10 / 공동 7</span></div><details><summary>어디까지 연결된 과수원인가요?</summary><p>같은 색 지형 반쪽이 변으로 직접 맞닿아야 합니다. 모서리는 연결되지 않으며, 회전 방향에 따라 각 대각선 반쪽이 닿는 변도 달라집니다.</p></details><details><summary>시장에서 가져온 타일을 바로 사용하나요?</summary><p>아닙니다. 시장 타일은 손패로 들어갑니다. 이번 라운드에 사용하는 것은 입찰에 제출한 타일입니다.</p></details><details><summary>작물 토큰을 다음 라운드까지 보관할 수 있나요?</summary><p>아닙니다. 모든 토큰을 즉시 합법적으로 배치하거나 버려야 합니다.</p></details></section>
                </div>
            </div>

            <footer class="orchards-toast-footer">
                <button type="button" onclick="closeOrchardsRulebookToast()"><span class="rb-content-en">Close</span><span class="rb-content-ko" style="display:none;">닫기</span></button>
                <a href="https://orchards-boardgame.vercel.app/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> <span class="rb-content-en">Open game</span><span class="rb-content-ko" style="display:none;">게임 열기</span></a>
            </footer>
        </aside>`;

    let returnFocus = null;

    function getToast() {
        return document.getElementById('orchardsRulebookToast');
    }

    window.openOrchardsRulebookToast = function () {
        const toast = getToast();
        if (!toast) return;
        returnFocus = document.activeElement;
        const isKo = document.documentElement.getAttribute('lang') === 'ko';
        if (typeof window.setRulebookLanguage === 'function') {
            window.setRulebookLanguage(isKo ? 'ko' : 'en', 'orchardsRulebookToast');
        }
        toast.classList.add('active');
        toast.setAttribute('aria-hidden', 'false');
        document.querySelector('#card-orchards .btn-rulebook-proto')?.setAttribute('aria-expanded', 'true');
        toast.querySelector('.orchards-toast-close')?.focus();
    };

    window.closeOrchardsRulebookToast = function () {
        const toast = getToast();
        if (!toast) return;
        toast.classList.remove('active');
        toast.setAttribute('aria-hidden', 'true');
        document.querySelector('#card-orchards .btn-rulebook-proto')?.setAttribute('aria-expanded', 'false');
        if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
    };

    function init() {
        document.body.insertAdjacentHTML('beforeend', toastMarkup);
        const isKo = document.documentElement.getAttribute('lang') === 'ko';
        if (typeof window.setRulebookLanguage === 'function') {
            window.setRulebookLanguage(isKo ? 'ko' : 'en', 'orchardsRulebookToast');
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && getToast()?.classList.contains('active')) {
            window.closeOrchardsRulebookToast();
        }
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
