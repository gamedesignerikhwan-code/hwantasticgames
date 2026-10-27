(function () {
    'use strict';

    // Adapted from the designer's supplied Game Introduction PDFs.
    // Dondurma's rules are all contained in its one-page introduction. No web demo.
    const RULEBOOKS = {
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
