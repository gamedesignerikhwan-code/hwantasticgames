(function () {
    'use strict';

    const STORAGE_KEY = 'hwantastic-proto-language';
    const originals = new WeakMap();
    const originalAttributes = new WeakMap();

    const ko = {
        title: '보드게임 프로토타입 | 환상적인 게임즈',
        heroTitle: '보드게임 프로토타입',
        heroDesc: '권익환(Ikhwan Kwon)이 디자인한 오리지널 테이블탑 게임의 웹 프로토타입입니다. 브라우저에서 바로 플레이하고 의견을 들려주세요!<br><span class="proto-hero-note" style="opacity: 0.85; font-size: 0.95em;">(웹사이트 구현에는 AI 기술이 사용되었지만 사람의 아이디어로 구현된 게임들입니다.)</span>',
        filters: ['전체', '카드 게임', '보드게임'],
        categories: { 'card-game': '카드 게임', 'board-game': '보드게임' },
        actions: ['소개서', '규칙서', '플레이'],
        rulebookSoon: '규칙서는 곧 공개됩니다',
        cards: {
            'card-tamers': {
                subtitle: '트릭테이킹 & 예측 카드 게임',
                desc: '동물 조련사들의 팽팽한 심리 트릭테이킹 게임! 매 라운드 획득할 트릭 수를 정확히 예측하고, 수트 규칙과 특수 능력 카드를 활용해 선언한 수를 정밀하게 맞혀 보세요.',
                meta: ['2–5명', '15분', '트릭테이킹', '정확한 예측']
            },
            'card-doore': {
                subtitle: '타일 배치 & 마을 농경 보드게임',
                desc: '한국 전통 공동 농경 문화인 두레에서 영감을 받은 전략 타일 배치 게임입니다. 길을 연결하고 노동력과 자원을 함께 관리해 번영하는 마을을 만들어 보세요.',
                meta: ['2–4명', '20–30분', '타일 배치', '자원 관리']
            },
            'card-waffle-pop': {
                subtitle: '3D 토핑 & 패턴 완성 디저트 보드게임',
                desc: '사랑스럽고 전술적인 디저트 보드게임! 좌표 카드를 드래프트하고, 3층 구조의 4×4 와플 판에서 공간 패턴 미션을 완성해 다양한 점수 조합의 달콤한 토핑을 수확하세요.',
                meta: ['2–4명', '20–30분', '패턴 만들기', '세트 컬렉션']
            },
            'card-orchards': {
                subtitle: '타일 드래프트 & 수확 전략 보드게임',
                desc: '생동감 넘치는 전술 타일 드래프트와 과수원 건설 게임! 손의 타일로 동시에 입찰해 시장 타일을 가져오고, 지형이 나뉜 타일로 정원을 확장하며 과일을 수확하고 일꾼 다수를 차지하세요.',
                meta: ['2–5명', '25–40분', '타일 드래프트', '수확 점수']
            },
            'card-rotato': {
                subtitle: '중력 낙하 & 변 회전 연결 보드게임',
                desc: '역동적인 공간 퍼즐과 타일 드래프트 게임! 테트리스처럼 3열 보드에 타일을 떨어뜨리고, 맞닿은 변의 연쇄 회전을 일으켜 360° 회전을 완성한 타일로 점수를 얻으세요.',
                meta: ['2–4명', '20–30분', '변 회전', '중력 낙하', '세트 컬렉션']
            },
            'card-alchemists': {
                subtitle: '엔진 빌딩 & 세트 컬렉션 보드게임',
                desc: '독특한 드래프트 시스템을 갖춘 엔진 빌딩 세트 컬렉션 게임! 금·은·동 재료를 모아 강력한 물약을 만들고, 가장 명망 높은 연금술사의 자리를 차지하세요.',
                meta: ['2–4명', '30–45분', '엔진 빌딩', '세트 컬렉션']
            },
            'card-square-pyramids': {
                subtitle: '드래프트 & 피라미드 건설 카드 게임',
                desc: '전략적인 드래프트와 건축 퍼즐을 결합한 피라미드 건설 카드 게임! 몸통·가장자리 카드 쌍을 가져와 4라운드 동안 층층이 쌓고, 꼭짓점과 교차 기호를 맞춘 뒤 각 층의 테두리를 완성해 다수와 배수 점수를 노리세요.',
                meta: ['2–5명', '20–30분', '카드 드래프트', '피라미드 건설', '세트 매칭']
            },
            'card-drawing-game': {
                subtitle: '비밀 선택 & 바다 캔버스 타일 배치',
                desc: '공개된 카드 3장 중 하나를 비밀리에 고르고, 같은 카드를 선택한 인원수에 따라 바다 동물 타일을 받습니다. 개인 바다 캔버스의 물방울을 최대한 가리도록 신중하게 배치하세요.',
                meta: ['3–6명', '10–20분', '비밀 선택', '공간 배치']
            },
            'card-star-window': {
                subtitle: '천체 타일 배치 & 관측 전략',
                desc: '천체 도미노 타일로 나만의 밤하늘 지도를 넓히고, 관측 렌즈를 배치해 별·행성·혜성·성운·은하를 한 시야에 담아 배수 점수를 얻으세요.',
                meta: ['2–4명', '25–40분', '타일 배치', '공간 점수']
            }
        }
    };

    function remember(element) {
        if (element && !originals.has(element)) originals.set(element, element.innerHTML);
    }

    function setHtml(element, value, isKorean) {
        if (!element) return;
        remember(element);
        element.innerHTML = isKorean ? value : originals.get(element);
    }

    function setInlineLabel(element, value, isKorean) {
        if (!element) return;
        remember(element);
        if (!isKorean) {
            element.innerHTML = originals.get(element);
            return;
        }
        const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (textNode) textNode.textContent = ` ${value} `;
    }

    function rememberAttribute(element, name) {
        if (!element) return;
        if (!originalAttributes.has(element)) originalAttributes.set(element, {});
        const stored = originalAttributes.get(element);
        if (!(name in stored)) stored[name] = element.getAttribute(name);
    }

    function setAttribute(element, name, value, isKorean) {
        if (!element) return;
        rememberAttribute(element, name);
        const original = originalAttributes.get(element)[name];
        if (isKorean) element.setAttribute(name, value);
        else if (original === null) element.removeAttribute(name);
        else element.setAttribute(name, original);
    }

    function applyLanguage(language) {
        const isKorean = language === 'ko';
        document.documentElement.lang = language;
        document.title = isKorean ? ko.title : 'Board Game Prototypes | Hwantastic Games';

        setHtml(document.querySelector('.proto-hero-title'), ko.heroTitle, isKorean);
        setHtml(document.querySelector('.proto-hero-desc'), ko.heroDesc, isKorean);
        document.querySelectorAll('.filter-btn').forEach((button, index) => setInlineLabel(button, ko.filters[index], isKorean));

        // Toggle Korean subtitles in card titles and headers
        document.querySelectorAll('.rb-title-text-ko').forEach(el => el.style.display = isKorean ? '' : 'none');
        document.querySelectorAll('.rb-title-text-en').forEach(el => el.style.display = isKorean ? 'none' : '');

        Object.entries(ko.cards).forEach(([id, cardCopy]) => {
            const card = document.getElementById(id);
            if (!card) return;
            setInlineLabel(card.querySelector('.thumb-category-badge'), ko.categories[card.dataset.category], isKorean);
            setHtml(card.querySelector('.proto-card-subtitle'), cardCopy.subtitle, isKorean);
            setHtml(card.querySelector('.proto-card-desc'), cardCopy.desc, isKorean);
            card.querySelectorAll('.meta-chip').forEach((chip, index) => setInlineLabel(chip, cardCopy.meta[index], isKorean));
            card.querySelectorAll('.proto-card-actions > *').forEach((action, index) => setInlineLabel(action, ko.actions[index], isKorean));
            const rulebook = card.querySelector('.btn-rulebook-proto');
            if (rulebook) {
                if (rulebook.disabled) {
                    setAttribute(rulebook, 'title', ko.rulebookSoon, isKorean);
                    setAttribute(rulebook, 'aria-label', ko.rulebookSoon, isKorean);
                } else {
                    const titleEl = card.querySelector('.proto-card-title');
                    let gameName = '';
                    if (titleEl) {
                        if (isKorean) {
                            gameName = titleEl.textContent.trim().replace(/\s+/g, ' ');
                        } else {
                            const clone = titleEl.cloneNode(true);
                            clone.querySelectorAll('.rb-title-text-ko, .rb-content-ko, [class*="-ko"]').forEach(n => n.remove());
                            gameName = clone.textContent.trim().replace(/\s+/g, ' ');
                        }
                    }
                    const rulebookLabel = isKorean ? `${gameName} 전체 규칙서` : `${gameName} Full Rulebook`;
                    setAttribute(rulebook, 'title', rulebookLabel, isKorean);
                    setAttribute(rulebook, 'aria-label', rulebookLabel, isKorean);
                }
            }
        });

        if (typeof window.setRulebookLanguage === 'function') {
            window.setRulebookLanguage(isKorean ? 'ko' : 'en');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'tamersRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'dooreRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'waffleRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'alchemistsRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'pyramidsRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'rotatoRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'drawingGameRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'orchardsRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'starWindowRulebookModal');
        }

        const switcher = document.querySelector('.proto-language-switch');
        if (switcher) switcher.setAttribute('aria-label', isKorean ? '언어 선택' : 'Language selection');
        document.querySelectorAll('.proto-language-btn').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.lang === language));
        });
        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch (_) {
            // Language switching still works when storage is unavailable.
        }
    }

    function createSwitcher() {
        const header = document.querySelector('.proto-hero');
        if (!header || document.querySelector('.proto-language-toolbar')) return;
        const toolbar = document.createElement('div');
        toolbar.className = 'proto-language-toolbar';
        toolbar.innerHTML = `
            <div class="proto-language-switch" role="group" aria-label="Language selection">
                <button type="button" class="proto-language-btn" data-lang="ko" aria-pressed="false">한국어</button>
                <button type="button" class="proto-language-btn" data-lang="en" aria-pressed="false">EN</button>
            </div>`;
        header.insertBefore(toolbar, header.firstChild);
        toolbar.querySelectorAll('.proto-language-btn').forEach(button => {
            button.addEventListener('click', () => applyLanguage(button.dataset.lang));
        });
    }

    function init() {
        createSwitcher();
        let language;
        try {
            language = localStorage.getItem(STORAGE_KEY);
        } catch (_) {
            language = null;
        }
        if (language !== 'ko' && language !== 'en') {
            language = navigator.language && navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
        }
        applyLanguage(language);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
