(function () {
    'use strict';

    const STORAGE_KEY = 'hwantastic-proto-language';
    const originals = new WeakMap();
    const originalAttributes = new WeakMap();

    const ko = {
        title: '보드게임 프로토타입 | 환상적인 게임즈',
        heroTitle: '보드게임 프로토타입',
        heroDesc: '환상적인 게임즈가 만든 오리지널 테이블탑 게임의 웹 프로토타입입니다. 브라우저에서 바로 플레이하고 의견을 들려주세요!',
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
                meta: ['3–6명', '9턴', '비밀 선택', '공간 배치']
            },
            'card-star-window': {
                subtitle: '천체 타일 배치 & 관측 전략',
                desc: '천체 도미노 타일로 나만의 밤하늘 지도를 넓히고, 관측 렌즈를 배치해 별·행성·혜성·성운·은하를 한 시야에 담아 배수 점수를 얻으세요.',
                meta: ['2–4명', '12번의 밤', '타일 배치', '공간 점수']
            }
        },
        modals: {
            tamersModal: {
                title: 'Tamers — 게임 소개',
                headings: ['🎯 게임 소개', '🃏 핵심 메커니즘', '🌐 온라인 플레이테스트'],
                paragraphs: [
                    '<strong>Tamers</strong>는 2~4명이 즐기는 정확한 예측 방식의 트릭테이킹 카드 게임입니다. 시작 패를 확인한 뒤, 각 플레이어는 이번 라운드에 자신이 가져갈 트릭 수를 정확히 선언합니다.',
                    '현재 Vercel에서 실시간 멀티플레이 웹 프로토타입으로 운영 중입니다. 설치 없이 데스크톱이나 모바일 브라우저에서 바로 플레이할 수 있으며, 방을 만들거나 초대 링크를 공유해 즉시 테스트를 시작할 수 있습니다.'
                ],
                items: [
                    '<strong>정확한 예측</strong>: 선언한 트릭 수를 정확히 맞혀야 보너스 점수를 얻습니다. 더 많거나 적게 가져가면 감점됩니다.',
                    '<strong>리드 수트 & 트럼프</strong>: 반드시 리드 수트를 따라야 하는 규칙과 변화하는 트럼프 시스템이 결합되어 전술적인 역전이 가능합니다.',
                    '<strong>특수 능력 카드</strong>: 단순한 숫자 대결을 넘어 트릭의 흐름을 바꾸는 고유 능력 카드를 활용합니다.'
                ]
            },
            dooreModal: {
                title: 'Doore — 게임 소개',
                headings: ['🌾 게임 소개', '🧩 핵심 메커니즘', '🌐 온라인 플레이테스트'],
                paragraphs: [
                    '<strong>Doore</strong>는 한국의 전통 공동 농경 조직인 두레를 바탕으로 한 2~4인 타일 배치 전략 보드게임입니다. 협력과 경쟁의 균형 속에서 공동 노동력을 모으고 타일을 연결해 마을을 번영시킵니다.',
                    '퍼블리셔 검토와 규칙 설명을 위해 제작된 인터랙티브 디지털 프로토타입입니다. 브라우저에서 바로 여러 명이 플레이할 수 있는 온라인 방을 지원합니다.'
                ],
                items: [
                    '<strong>타일 배치 & 길 연결</strong>: 논, 밭, 마을 중심지, 수로를 드래프트해 배치하고 연결성과 점수 보너스를 극대화합니다.',
                    '<strong>공동 노동 & 자원 배분</strong>: 일꾼과 동전을 현명하게 관리해 대규모 공동 사업을 완성하고 수확 보상을 나눕니다.',
                    '<strong>전략적 상호작용</strong>: 변화하는 마을 배치 속에서 공동체 목표와 개인 점수 기회의 균형을 잡습니다.'
                ]
            },
            waffleModal: {
                title: 'Waffle Pop! — 게임 소개',
                headings: ['🧇 게임 소개', '🧩 핵심 메커니즘', '🌐 온라인 플레이테스트'],
                paragraphs: [
                    '<strong>Waffle Pop!</strong>은 2~4명이 즐기는 유쾌하고 전술적인 디저트 보드게임입니다. 맛있는 토핑 타일이 3층으로 쌓인 4×4 와플 판(총 48개 타일)에서 공간 패턴 미션 카드를 완성하고 높은 점수의 토핑을 수확합니다.',
                    '설치 없이 완전히 플레이할 수 있는 디지털 프로토타입입니다. 영리한 솔로 AI 봇 테스트 모드와 브라우저 P2P 연결 기반의 실시간 멀티플레이 방을 제공합니다.'
                ],
                items: [
                    '<strong>3D 격자 & 공간 패턴 매칭</strong>: 좌표 카드를 드래프트해 와플 판에서 3·4·5칸 패턴 미션을 맞춥니다. 회전과 좌우 반전을 모두 지원합니다.',
                    '<strong>다층 토핑 수확</strong>: 미션을 완성하면 일치한 각 좌표의 맨 위 토핑을 가져옵니다. 아래층이 차례로 드러나며 판의 상황이 계속 달라집니다.',
                    '<strong>비대칭 토핑 점수</strong>: 선착순 VIP 리본, 황금 체리 세트, 제곱으로 커지는 딸기 조합, 공동 배당 등 7종 토핑마다 다른 전략을 제공합니다.',
                    '<strong>동일 턴 종료</strong>: 4×4 와플 판에서 5곳 이상의 3개 층이 모두 비워지면 게임 종료가 시작되며, 모두 같은 수의 턴을 진행합니다.'
                ]
            },
            orchardsModal: {
                title: 'Orchards — 게임 소개',
                headings: ['🍏 게임 소개', '🧩 핵심 메커니즘', '🌐 온라인 플레이테스트'],
                paragraphs: [
                    '<strong>Orchards (오차드)</strong>는 2~5명이 즐기는 타일 드래프트와 공간 과수원 건설 보드게임입니다. 13라운드 동안 손 타일을 비밀 입찰해 시장 선택 순서를 정하고, 지형이 나뉜 타일로 개인 과수원을 넓혀 풍성한 수확을 만듭니다.',
                    '설치 없이 브라우저에서 바로 플레이할 수 있는 인터랙티브 디지털 프로토타입입니다. 지능형 AI 봇과의 솔로 플레이(2~5인 구성) 및 WebRTC 기반 실시간 멀티플레이 테스트 방을 지원합니다.'
                ],
                items: [
                    '<strong>동시 비밀 입찰 & 시장 드래프트</strong>: 매 라운드 손에서 타일 하나를 비밀리에 고릅니다. 숫자가 낮은 입찰부터 공개 시장 타일을 선택하므로 날카로운 우선순위 판단이 필요합니다.',
                    '<strong>분할 지형 배치 & 회전</strong>: 두 색의 대각선 지형 타일을 90°씩 돌려 같은 색을 연결하고 과수원을 넓힙니다.',
                    '<strong>작물 수확 & 일꾼 배수</strong>: 작물 타일로 입찰하면 같은 색 과수원에 놓을 과일 토큰을 얻습니다. 최종 점수는 각 군집의 일꾼과 과일 토큰을 곱해 계산합니다.',
                    '<strong>와일드 허수아비 & 영역 다수</strong>: 와일드 허수아비(🎃) 토큰은 어느 지형 색에도 사용할 수 있으며, 색상별 최대 일꾼 무리에 +10점 보너스가 주어집니다.'
                ]
            },
            rotatoModal: {
                title: 'Rotato Pizza — 게임 소개',
                headings: ['🥔 게임 소개', '🧩 핵심 메커니즘', '🌐 온라인 플레이테스트'],
                paragraphs: [
                    '<strong>Rotato Pizza (로타토 피자)</strong>는 2~4명이 즐기는 중독성 있는 공간 퍼즐·중력 타일 배치 게임입니다. 테트리스처럼 개인 3열 보드에 타일을 드래프트해 떨어뜨리고, 변의 연쇄 회전을 일으켜 3단계 회전을 마친 타일로 점수를 얻습니다.',
                    '설치 없이 브라우저에서 바로 실행되는 웹 플레이테스트입니다. <strong>AI 대전</strong>(2~4인 구성)과 <strong>한 기기 멀티플레이</strong> 모드를 제공하며, 한국어와 영어 규칙 요약을 모두 지원합니다.'
                ],
                items: [
                    '<strong>중력 열 낙하</strong>: 매 턴 손 타일 하나를 3개 열 중 하나에 놓습니다. IN 표시가 아래를 향한 채 가장 낮은 빈칸까지 떨어집니다.',
                    '<strong>변 매칭 회전 연쇄</strong>: 배치 후 맞닿은 변의 색이나 기호가 같으면 해당 타일을 시계 방향으로 돌립니다. 더 이상 일치하는 변이 없을 때까지 연쇄가 이어집니다.',
                    '<strong>종류 일치 보너스 회전</strong>: 매칭 연쇄를 처리한 뒤, 놓은 타일과 같은 감자·토핑 아이콘의 타일 하나를 돌려 새로운 연쇄를 만들 수 있습니다.',
                    '<strong>3회전 완성 & 중력 붕괴</strong>: 타일이 시계 방향으로 3번 돌아 OUT 표시가 오른쪽 아래를 향하면 완성됩니다. 완성 타일은 점수 더미로 이동하고 위의 타일은 중력에 따라 내려옵니다.',
                    '<strong>시계 방향 드래프트 & 세트 점수</strong>: 매 턴 남은 손 타일을 시계 방향으로 넘깁니다. 게임 종료 시 아이콘 종류별 개수의 제곱만큼 점수를 얻고, 4종 완성 세트마다 10점을 추가합니다.'
                ]
            },
            alchemistsModal: {
                title: 'Alchemists — 게임 소개',
                headings: ['⚗️ 게임 소개', '🧩 핵심 메커니즘', '🌐 온라인 플레이테스트'],
                paragraphs: [
                    '<strong>Alchemists (연금술사)</strong>는 2~4명이 즐기는 엔진 빌딩 세트 컬렉션 보드게임입니다. 금·은·동 세 종류의 금속 재료를 모아 점점 더 강력한 물약을 만들고, 전략적인 드래프트와 자원 관리로 명성 점수를 얻습니다.',
                    '설치 없이 완전히 플레이할 수 있는 디지털 프로토타입입니다. AI 봇과의 솔로 플레이(2~4인 구성)와 WebRTC P2P 연결 기반 실시간 멀티플레이 테스트 방을 제공하며 한국어와 영어 인터페이스를 지원합니다.'
                ],
                items: [
                    '<strong>재료 드래프트 & 수집</strong>: 매 라운드 공동 시장에서 재료 카드를 가져옵니다. 금·은·동은 서로 다른 조합법의 재료가 됩니다.',
                    '<strong>엔진 빌딩</strong>: 작업장 업그레이드, 보조 연금술사, 전문 장비에 투자해 제조 효율을 높이고 고급 물약 조합법을 해제합니다.',
                    '<strong>세트 컬렉션 & 물약 제조</strong>: 일치하는 재료 세트를 조합해 다양한 명성 점수의 물약을 만듭니다. 상위 조합은 더 희귀한 구성을 요구하지만 보상도 큽니다.',
                    '<strong>공급 관리</strong>: 공동 재료 공급 때문에 긴장이 생깁니다. 공격적인 드래프트로 상대를 견제하거나, 남은 자원에 적응하는 유연한 엔진을 구축하세요.'
                ]
            },
            pyramidsModal: {
                title: 'Square Pyramids (사각 피라미드) — 게임 소개',
                headings: ['🔺 게임 소개', '🧩 핵심 메커니즘', '🌐 온라인 플레이테스트'],
                paragraphs: [
                    '<strong>Square Pyramids (사각 피라미드)</strong>는 공개 카드 드래프트와 건축적인 피라미드 공간 퍼즐을 결합한 2~5인 전략 카드 게임입니다. 4라운드 동안 기초 몸통 돌 카드와 테두리 가장자리 카드를 짝지어 가져오고, 바닥부터 꼭대기까지 고대 계단식 기념물을 건설합니다.',
                    '설치 없이 최신 데스크톱·모바일 브라우저에서 원활하게 플레이할 수 있습니다. <strong>AI 건축가와의 솔로 플레이</strong>(2~5인 구성)와 WebRTC P2P 기반 <strong>실시간 멀티플레이 방</strong>을 제공하며 한국어와 영어를 완전히 지원합니다.'
                ],
                items: [
                    '<strong>2장 카드 드래프트 시장</strong>: 매 턴 서로 다른 모서리 기호 3개가 있는 몸통 돌 카드 1장과 가장자리 카드 1장으로 구성된 한 쌍을 가져옵니다. 교차 토큰(✖)을 쓰면 서로 다른 시장 쌍에서 자유롭게 선택할 수 있습니다.',
                    '<strong>건축 중력 쌓기</strong>: 아래에서 위로 4층 기념물을 만듭니다(L1 바닥 몸통 4개부터 L4 꼭대기 몸통 1개까지). 위 블록은 바로 아래 두 돌의 교차점에 지지되어야 합니다.',
                    '<strong>교차 기호 매칭</strong>: 핵심 교차점 6곳에서 인접한 돌의 모서리를 맞춥니다. 같은 기호 3개가 교차하면 큰 종료 점수 보너스를 얻습니다.',
                    '<strong>외곽 가장자리 완성 & 배수 점수</strong>: 완성한 각 층의 좌우 외곽을 가장자리 카드로 닫습니다. 가장자리 카드는 수집한 몸통 기호 점수에 배수를 적용하고, 삼각 깃발은 다른 건축가와의 다수 경쟁 점수를 줍니다.'
                ]
            },
            drawingGameModal: {
                title: 'The Drawing Game — 게임 소개',
                headings: ['🌊 게임 소개', '🧩 핵심 메커니즘', '🌐 온라인 플레이테스트'],
                paragraphs: [
                    '<strong>The Drawing Game</strong>은 3~6명이 즐기는 동시 선택·공간 타일 배치 보드게임입니다. 9턴 동안 다채로운 바다 생물을 모아 개인 바다 캔버스에 배치하고 가능한 한 많은 물방울을 가립니다.',
                    '한국어·영어를 지원하는 브라우저 프로토타입으로, 설치 없이 AI 상대와 솔로 테스트하거나 3~6명이 실시간 멀티플레이 방에서 함께 즐길 수 있습니다.'
                ],
                items: [
                    '<strong>A/B/C 비밀 선택</strong>: 매 턴 카드 3장을 공개합니다. 모두 하나를 비밀리에 고른 뒤 동시에 공개합니다.',
                    '<strong>선택 인원별 타일 획득</strong>: 같은 카드를 고른 플레이어 수에 따라 각자가 그 카드에서 받을 바다 동물 타일이 정해집니다.',
                    '<strong>자유로운 캔버스 배치</strong>: 기존 타일과 겹치지 않게 동물을 놓고 돌려, 인쇄된 물방울을 효율적으로 가립니다.',
                    '<strong>중복 동물의 돌 전환</strong>: 이미 가진 동물을 다시 얻으면 해당 동물의 가치 단계에 맞는 더 작은 돌 타일로 바뀝니다.',
                    '<strong>동물 점수 − 물방울</strong>: 최종 점수는 수집한 동물 가치의 합에서 9턴 뒤 가리지 못한 물방울 수를 뺀 값입니다.'
                ]
            },
            starWindowModal: {
                title: 'Star Window — 게임 소개',
                headings: ['🔭 게임 소개', '🧩 핵심 메커니즘', '🌐 온라인 플레이테스트'],
                paragraphs: [
                    '<strong>Star Window (천문대의 밤)</strong>은 2~4명이 즐기는 천체 타일 배치·공간 점수 보드게임입니다. 열두 번의 밤 동안 천문대장들은 개인 밤하늘 지도를 넓히고, 렌즈로 별·행성·혜성·성운·은하의 가장 가치 있는 배열을 포착합니다.',
                    '한국어·영어를 지원하는 브라우저 프로토타입으로, 설치 없이 AI 천문대와 솔로 플레이하거나 최대 4명이 실시간 멀티플레이 방에서 함께 즐길 수 있습니다.'
                ],
                items: [
                    '<strong>관측 계획 드래프트</strong>: 자신의 턴에 관측 렌즈 1개와 도미노 모양 하늘 타일 1개가 묶인 계획을 선택합니다.',
                    '<strong>열린 밤하늘 확장</strong>: 하늘 타일을 돌려 기존 지도 옆에 놓습니다. 기호 일치 제약 없이 미래의 관측 범위를 설계합니다.',
                    '<strong>렌즈 배치 & 배수 점수</strong>: 선택한 렌즈를 유효한 칸·변·꼭짓점에 놓습니다. 시야 안에서 조건에 맞는 천체마다 렌즈 배수만큼 점수를 얻습니다.',
                    '<strong>주 망원경 턴 순서</strong>: 주 망원경을 선택하면 다음 날 밤의 첫 관측자가 되어, 매 드래프트에 타이밍 선택이 더해집니다.',
                    '<strong>구름 토큰 교차</strong>: 구름 타일을 놓으면 드래프트 전에 두 관측 계획의 하늘 타일을 서로 바꿀 수 있는 토큰을 얻습니다.'
                ]
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
                    const gameName = card.querySelector('.proto-card-title')?.textContent?.trim() || '';
                    const rulebookLabel = isKorean ? `${gameName} 전체 규칙서` : `${gameName} Full Rulebook`;
                    setAttribute(rulebook, 'title', rulebookLabel, isKorean);
                    setAttribute(rulebook, 'aria-label', rulebookLabel, isKorean);
                }
            }
        });

        Object.entries(ko.modals).forEach(([id, modalCopy]) => {
            const modal = document.getElementById(id);
            if (!modal) return;
            setInlineLabel(modal.querySelector('.proto-modal-title'), modalCopy.title, isKorean);
            modal.querySelectorAll('.proto-modal-body h4').forEach((heading, index) => setHtml(heading, modalCopy.headings[index], isKorean));
            modal.querySelectorAll('.proto-modal-body p').forEach((paragraph, index) => setHtml(paragraph, modalCopy.paragraphs[index], isKorean));
            modal.querySelectorAll('.proto-modal-body li').forEach((item, index) => setHtml(item, modalCopy.items[index], isKorean));
            setInlineLabel(modal.querySelector('.proto-modal-footer .btn-secondary'), '닫기', isKorean);
            setInlineLabel(modal.querySelector('.proto-modal-footer .btn-play-proto'), '지금 플레이', isKorean);
            setAttribute(modal.querySelector('.proto-modal-close'), 'aria-label', '상세 창 닫기', isKorean);
        });

        if (typeof window.setRulebookLanguage === 'function') {
            window.setRulebookLanguage(isKorean ? 'ko' : 'en');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'dooreRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'waffleRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'alchemistsRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'pyramidsRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'rotatoRulebookModal');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'orchardsRulebookToast');
            window.setRulebookLanguage(isKorean ? 'ko' : 'en', 'starWindowRulebookToast');
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
