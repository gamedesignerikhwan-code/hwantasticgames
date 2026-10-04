(function () {
    'use strict';

    // Adapted from the designer's supplied Game Introduction PDFs.
    // Tangent Code includes its complete rulebook; Dondurma's rules are all
    // contained in its one-page introduction. Neither game has a web demo.
    const RULEBOOKS = {
    "tangent-code": {
        "name": {
            "en": "Tangent Code",
            "ko": "Tangent Code · 탠전트 코드"
        },
        "specs": [
            [
                "2–8",
                "players"
            ],
            [
                "8+",
                "ages"
            ],
            [
                "10–15",
                "minutes"
            ]
        ],
        "mark": "🙌",
        "sections": {
            "en": [
                [
                    "components",
                    "1. Components & Symbols",
                    "<ul><li><strong>8</strong> Screens</li><li><strong>8</strong> Dice (O / O / ☆ / ☆ / blank / blank)</li><li><strong>8</strong> Double-sided O / ☆ Coins</li><li><strong>80</strong> Word Cards</li><li><strong>≈50 pts</strong> Score Tokens</li><li><strong>1</strong> Special 10-second Timer</li></ul><p>Each die has six faces: <strong>O / O / ☆ / ☆ / blank / blank</strong>. Each word card has three words: top = O, middle = blank, bottom = ☆. Coins show O on one side and ☆ on the other.</p><p>The special timer provides a loud, noisy countdown that ends after <strong>10 seconds</strong>.</p>"
                ],
                [
                    "setup",
                    "2. Setup",
                    "<p>Give each player a screen and a die, with a coin in front of the screen. Randomly select 10 word cards, prepare the score tokens and timer, and choose the first seeker.</p><figure class=\"ss-figure\"><img src=\"/proto/assets/tangent-code-table.webp\" alt=\"Tangent Code table setup with screens, dice, O and star coins, word cards, score tokens, and a timer.\" loading=\"lazy\"><figcaption>An in-person prototype: reading real hand gestures and facial expressions is essential to play. No browser demo is provided.</figcaption></figure>"
                ],
                [
                    "play",
                    "3. How to Play",
                    "<ol class=\"physical-rule-steps\"><li><strong>Set up</strong><p>Give each player a screen and a die, with a coin in front of the screen. Randomly select 10 word cards, prepare the score tokens and timer, and choose the first seeker.</p></li><li><strong>Reveal & roll</strong><p>The seeker reveals one card and starts the 10-second timer. Everyone else rolls their die behind their screen: O, ☆, or blank.</p></li><li><strong>Choose your expression</strong><p>The top word corresponds to O, the bottom word to ☆, and the middle word to blank. Think of a hand gesture and facial expression for your word before time runs out.</p></li><li><strong>Freeze together</strong><p>When time is up, everyone except the seeker simultaneously holds a frozen hand gesture and facial expression.</p></li><li><strong>Read the room</strong><p>The seeker guesses each player’s word: place their coin O-side up or ☆-side up, or remove the coin for a blank result.</p></li><li><strong>Reveal & score</strong><p>Lift the screens. The team scores 1 point per correct guess, plus 3 bonus points if every guess is correct.</p></li><li><strong>Pass the role</strong><p>The player to the seeker’s left becomes the next seeker. Play all 10 cards, then compare the team’s total with the grade table.</p></li></ol><figure class=\"ss-figure\"><img src=\"/proto/assets/tangent-code-gestures.webp\" alt=\"Players holding gestures while the seeker chooses O, star, or blank.\" loading=\"lazy\"></figure>"
                ],
                [
                    "scoring",
                    "4. Scoring, Game End & Grades",
                    "<p>The team earns <strong>1 point per correct guess</strong> and <strong>3 extra points</strong> if the seeker guesses every player correctly. After each round, the role passes to the player on the seeker’s left. The game ends after all <strong>10 cards</strong> are played.</p><table class=\"physical-grade-table\"><thead><tr><th>Team score</th><th>Grade</th></tr></thead><tbody><tr><td>40+</td><td>SSS</td></tr><tr><td>35–39</td><td>SS</td></tr><tr><td>30–34</td><td>S</td></tr><tr><td>25–29</td><td>A</td></tr><tr><td>20–24</td><td>B</td></tr><tr><td>15–19</td><td>C</td></tr><tr><td>10–14</td><td>D</td></tr><tr><td>0–9</td><td>F</td></tr></tbody></table>"
                ]
            ],
            "ko": [
                [
                    "components",
                    "1. 구성물과 기호",
                    "<ul><li><strong>8</strong> 가림막</li><li><strong>8</strong> 주사위 (O / O / ☆ / ☆ / 빈칸 / 빈칸)</li><li><strong>8</strong> O / ☆ 양면 동전</li><li><strong>80</strong> 단어 카드</li><li><strong>약 50점</strong> 점수 토큰</li><li><strong>1</strong> 특수 10초 타이머</li></ul><p>주사위의 여섯 면은 <strong>O / O / ☆ / ☆ / 빈칸 / 빈칸</strong>입니다. 단어 카드의 위쪽은 O, 가운데는 빈칸, 아래쪽은 ☆에 해당하며, 동전에는 O와 ☆가 앞뒤로 표시되어 있습니다.</p><p>특수 타이머는 큰 소리로 카운트다운하며 <strong>10초</strong> 뒤에 끝납니다.</p>"
                ],
                [
                    "setup",
                    "2. 게임 준비",
                    "<p>각 플레이어에게 가림막과 주사위를 주고 가림막 앞에 동전을 놓습니다. 단어 카드 10장을 무작위로 골라 덱을 만들고, 점수 토큰과 타이머를 준비한 뒤 첫 술래를 정합니다.</p><figure class=\"ss-figure\"><img src=\"/proto/assets/tangent-code-table.webp\" alt=\"가림막, 주사위, O·별 동전, 단어 카드, 점수 토큰, 타이머를 배치한 탠전트 코드 테이블.\" loading=\"lazy\"><figcaption>실제 손동작과 표정을 읽는 현장 플레이가 핵심인 프로토타입입니다. 웹 데모는 제공하지 않습니다.</figcaption></figure>"
                ],
                [
                    "play",
                    "3. 플레이 방법",
                    "<ol class=\"physical-rule-steps\"><li><strong>게임 준비</strong><p>각 플레이어에게 가림막과 주사위를 주고 가림막 앞에 동전을 놓습니다. 단어 카드 10장을 무작위로 골라 덱을 만들고, 점수 토큰과 타이머를 준비한 뒤 첫 술래를 정합니다.</p></li><li><strong>카드 공개와 주사위</strong><p>술래가 카드 한 장을 공개하고 10초 타이머를 시작합니다. 나머지 플레이어는 가림막 뒤에서 주사위를 굴려 O, ☆, 빈칸 중 결과를 확인합니다.</p></li><li><strong>표현 생각하기</strong><p>카드의 위쪽 단어는 O, 아래쪽 단어는 ☆, 가운데 단어는 빈칸에 해당합니다. 시간이 끝나기 전에 자신의 단어를 표현할 손동작과 표정을 생각합니다.</p></li><li><strong>동시에 멈춘 자세</strong><p>시간이 끝나면 술래를 제외한 모두가 손동작과 표정만으로 단어를 동시에 표현하고 그 자세를 유지합니다.</p></li><li><strong>술래의 추리</strong><p>술래는 각 플레이어가 표현한 단어를 추리합니다. O 또는 ☆라고 생각하면 동전의 해당 면을 위로 놓고, 빈칸이라면 동전을 치웁니다.</p></li><li><strong>공개와 점수</strong><p>가림막을 들어 결과를 공개합니다. 맞힌 사람마다 팀 점수 1점을 얻고, 전원을 맞히면 추가 3점을 얻습니다.</p></li><li><strong>술래 교대</strong><p>술래 왼쪽 사람이 다음 술래가 됩니다. 준비한 카드 10장을 모두 플레이한 뒤 팀 총점으로 등급을 확인합니다.</p></li></ol><figure class=\"ss-figure\"><img src=\"/proto/assets/tangent-code-gestures.webp\" alt=\"멈춘 자세를 표현하는 플레이어들과 O·별·빈칸을 추리하는 술래.\" loading=\"lazy\"></figure>"
                ],
                [
                    "scoring",
                    "4. 점수·게임 종료·등급",
                    "<p>맞힌 사람마다 <strong>팀 점수 1점</strong>을 얻으며, 전원을 맞히면 <strong>추가 3점</strong>을 얻습니다. 매 라운드 술래 왼쪽 사람이 다음 술래가 됩니다. 준비한 <strong>카드 10장</strong>을 모두 플레이하면 게임이 끝납니다.</p><table class=\"physical-grade-table\"><thead><tr><th>팀 총점</th><th>등급</th></tr></thead><tbody><tr><td>40+</td><td>SSS</td></tr><tr><td>35–39</td><td>SS</td></tr><tr><td>30–34</td><td>S</td></tr><tr><td>25–29</td><td>A</td></tr><tr><td>20–24</td><td>B</td></tr><tr><td>15–19</td><td>C</td></tr><tr><td>10–14</td><td>D</td></tr><tr><td>0–9</td><td>F</td></tr></tbody></table>"
                ]
            ]
        }
    },
    "dondurma": {
        "name": {
            "en": "Dondurma",
            "ko": "Dondurma · 돈두르마"
        },
        "specs": [
            [
                "2–4",
                "players"
            ],
            [
                "5+",
                "ages"
            ],
            [
                "5",
                "minutes"
            ]
        ],
        "mark": "🍦",
        "sections": {
            "en": [
                [
                    "components",
                    "1. Components",
                    "<ul><li><strong>4</strong> Sticks with Velcro</li><li><strong>4</strong> Ice Creams</li><li><strong>4</strong> Cones</li></ul>"
                ],
                [
                    "setup",
                    "2. Setup",
                    "<p>Each player holds an ice cream on its cone in their left hand and a Velcro stick in their right hand.</p><p>At a table, keep your left elbow on the tabletop. When playing standing up, stand an arm’s length apart.</p><figure class=\"ss-figure\"><img src=\"/proto/assets/dondurma-table.webp\" alt=\"Two players holding ice cream cones and Velcro sticks while playing Dondurma at a table.\" loading=\"lazy\"><figcaption>The physical prototype in play. Handling the cones, ice creams, and sticks is the game; no browser demo is provided.</figcaption></figure>"
                ],
                [
                    "play",
                    "3. Play & Elimination",
                    "<ol class=\"physical-rule-steps\"><li><strong>Take your ice cream</strong><p>Each player holds an ice cream on its cone in their left hand and a Velcro stick in their right hand.</p></li><li><strong>Choose your play space</strong><p>At a table, keep your left elbow on the tabletop. When playing standing up, stand an arm’s length apart.</p></li><li><strong>Play simultaneously</strong><p>Use the stick’s Velcro to take another player’s ice cream while keeping your own ice cream on its cone.</p></li><li><strong>Stay in the game</strong><p>You are eliminated if another player takes your ice cream, if it separates from your cone, or—when playing at a table—if you lift your left elbow off the tabletop.</p></li><li><strong>Last player wins</strong><p>Continue until only one player remains. That player wins.</p></li></ol>"
                ],
                [
                    "victory",
                    "4. Victory",
                    "<p>Continue until only one player remains. That player wins.</p>"
                ]
            ],
            "ko": [
                [
                    "components",
                    "1. 구성물",
                    "<ul><li><strong>4</strong> 벨크로 막대</li><li><strong>4</strong> 아이스크림</li><li><strong>4</strong> 콘</li></ul>"
                ],
                [
                    "setup",
                    "2. 게임 준비",
                    "<p>각 플레이어는 왼손에 아이스크림이 얹힌 콘을 들고, 오른손에 벨크로가 달린 막대를 듭니다.</p><p>테이블에서는 왼쪽 팔꿈치를 테이블에 붙이고 플레이합니다. 서서 플레이할 때는 서로 팔 길이만큼 떨어져 섭니다.</p><figure class=\"ss-figure\"><img src=\"/proto/assets/dondurma-table.webp\" alt=\"테이블에서 아이스크림 콘과 벨크로 막대를 들고 돈두르마를 플레이하는 두 사람.\" loading=\"lazy\"><figcaption>물리적 프로토타입 플레이 모습입니다. 콘·아이스크림·막대를 직접 조작하는 게임으로, 웹 데모는 제공하지 않습니다.</figcaption></figure>"
                ],
                [
                    "play",
                    "3. 플레이와 탈락",
                    "<ol class=\"physical-rule-steps\"><li><strong>아이스크림 들기</strong><p>각 플레이어는 왼손에 아이스크림이 얹힌 콘을 들고, 오른손에 벨크로가 달린 막대를 듭니다.</p></li><li><strong>플레이 공간 정하기</strong><p>테이블에서는 왼쪽 팔꿈치를 테이블에 붙이고 플레이합니다. 서서 플레이할 때는 서로 팔 길이만큼 떨어져 섭니다.</p></li><li><strong>동시에 플레이</strong><p>내 아이스크림이 콘에서 떨어지지 않도록 지키면서, 막대의 벨크로로 상대 아이스크림을 가져옵니다.</p></li><li><strong>탈락 조건</strong><p>다른 플레이어에게 아이스크림을 빼앗기거나, 아이스크림이 콘에서 떨어지면 탈락합니다. 테이블 플레이에서는 왼쪽 팔꿈치를 테이블에서 떼어도 탈락합니다.</p></li><li><strong>마지막 생존자가 승리</strong><p>한 명만 남을 때까지 플레이합니다. 마지막으로 남은 플레이어가 승리합니다.</p></li></ol>"
                ],
                [
                    "victory",
                    "4. 승리",
                    "<p>한 명만 남을 때까지 플레이합니다. 마지막으로 남은 플레이어가 승리합니다.</p>"
                ]
            ]
        }
    }
};

    function idFor(key) {
        return key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) + 'RulebookModal';
    }

    function renderLanguage(key, book, language) {
        const labels = language === 'ko' ? ['인원', '연령', '분'] : ['Players', 'Ages', 'Minutes'];
        const navigation = book.sections[language].map(([id, heading]) =>
            `<a href="#${key}-${language}-${id}">${heading}</a>`).join('');
        const sections = book.sections[language].map(([id, heading, body]) =>
            `<section class="ss-section" id="${key}-${language}-${id}"><h4>${heading}</h4>${body}</section>`).join('');
        return `<div class="rb-content-${language}" ${language === 'ko' ? 'style="display:none;"' : ''}>
            <div class="ss-specs">${book.specs.map(([value], index) => `<div><strong>${value}</strong><span>${labels[index]}</span></div>`).join('')}</div>
            <nav class="physical-rule-nav" aria-label="${language === 'ko' ? '규칙서 목차' : 'Rulebook contents'}">${navigation}</nav>
            ${sections}
        </div>`;
    }

    function render(key, book) {
        const id = idFor(key);
        return `<div class="proto-modal-overlay" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}Title" style="display:none;">
            <div class="proto-modal-card sell-sheet-card physical-rulebook-card ss-${key}">
                <header class="ss-header">
                    <span class="ss-mark" aria-hidden="true">${book.mark}</span>
                    <div class="ss-heading">
                        <span class="ss-eyebrow"><span class="rb-content-en">In-person game · Full rulebook</span><span class="rb-content-ko" style="display:none;">현장 플레이 게임 · 전체 규칙서</span></span>
                        <h3 class="ss-title" id="${id}Title"><span class="rb-title-text-en">${book.name.en} — Rulebook</span><span class="rb-title-text-ko" style="display:none;">${book.name.ko} — 규칙서</span></h3>
                    </div>
                    <div class="ss-actions">
                        <div class="ss-lang" role="group" aria-label="Rulebook language">
                            <button type="button" class="rb-lang-btn" data-rb-lang="ko" onclick="setRulebookLanguage('ko', '${id}')">KO</button>
                            <button type="button" class="rb-lang-btn" data-rb-lang="en" onclick="setRulebookLanguage('en', '${id}')">EN</button>
                        </div>
                        <button type="button" class="ss-close" onclick="closeModal('${id}')" aria-label="Close ${book.name.en} rulebook"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </header>
                <div class="ss-body">${renderLanguage(key, book, 'en')}${renderLanguage(key, book, 'ko')}</div>
                <footer class="ss-footer"><button type="button" onclick="closeModal('${id}')"><span class="rb-content-en">Close</span><span class="rb-content-ko" style="display:none;">닫기</span></button></footer>
            </div>
        </div>`;
    }

    function init() {
        document.body.insertAdjacentHTML('beforeend', Object.entries(RULEBOOKS).map(([key, book]) => render(key, book)).join(''));
        const sync = () => {
            const language = document.documentElement.lang === 'ko' ? 'ko' : 'en';
            Object.keys(RULEBOOKS).forEach(key => window.setRulebookLanguage(language, idFor(key)));
        };
        sync();
        new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

        const physicalIds = new Set(Object.keys(RULEBOOKS).flatMap(key => [idFor(key), idFor(key).replace('Rulebook', 'SellSheet')]));
        const open = window.openModal;
        const close = window.closeModal;
        const returnFocus = new Map();
        window.openModal = function (id) {
            if (physicalIds.has(id)) returnFocus.set(id, document.activeElement);
            open(id);
            if (physicalIds.has(id)) document.getElementById(id).querySelector('.ss-close').focus();
        };
        window.closeModal = function (id) {
            close(id);
            if (physicalIds.has(id)) {
                const trigger = returnFocus.get(id);
                if (trigger && trigger.isConnected) trigger.focus();
                returnFocus.delete(id);
            }
        };
        Object.keys(RULEBOOKS).forEach(key => {
            const modal = document.getElementById(idFor(key));
            modal.querySelectorAll('.physical-rule-nav a').forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault();
                    const section = document.getElementById(link.getAttribute('href').slice(1));
                    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
            modal.addEventListener('click', event => {
                if (event.target === modal) window.closeModal(modal.id);
            });
        });
        document.addEventListener('keydown', event => {
            if (event.key !== 'Tab') return;
            const modal = Array.from(physicalIds).map(id => document.getElementById(id)).find(element => element && element.classList.contains('active'));
            if (!modal) return;
            const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled])')).filter(element => element.getClientRects().length);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
