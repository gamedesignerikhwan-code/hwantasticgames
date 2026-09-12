(function () {
    'use strict';

    // Publisher sell sheets. Every fact below comes from page 1 of the matching
    // "Game Introduction - <game>.pdf", the sheets sent to publishers. The phone
    // number those PDFs carry is deliberately left out: this page is public.
    const CONTACT = {
        en: 'Ikhwan Kwon — Designer',
        ko: '권익환 (Ikhwan Kwon) — 디자이너',
        email: 'gamedesigner.ikhwan@gmail.com'
    };

    const LABELS = {
        en: {
            eyebrow: 'Publisher sell sheet',
            suffix: 'Sell Sheet',
            players: 'Players', ages: 'Ages', minutes: 'Minutes',
            points: 'Key selling points',
            how: 'How to play',
            scoring: 'Scoring',
            components: 'Components',
            prototype: 'Playable prototype',
            contact: 'Contact',
            close: 'Close',
            play: 'Play the prototype',
            langLabel: 'Sell sheet language'
        },
        ko: {
            eyebrow: '퍼블리셔 셀 시트',
            suffix: '셀 시트',
            players: '인원', ages: '연령', minutes: '분',
            points: '핵심 세일즈 포인트',
            how: '플레이 방법',
            scoring: '점수 계산',
            components: '구성물',
            prototype: '플레이 가능한 프로토타입',
            contact: '연락처',
            close: '닫기',
            play: '프로토타입 플레이',
            langLabel: '셀 시트 언어'
        }
    };

    const SHEETS = {
        doore: {
            mark: '🌾',
            name: { en: 'Doore', ko: '두레' },
            specs: { players: '2–4', ages: '8+', minutes: '30' },
            tags: {
                en: ['Set Collection', 'Tile Placement', 'Drafting'],
                ko: ['세트 수집', '타일 배치', '드래프트']
            },
            hero: {
                en: {
                    h: 'Drafting, turned inside out.',
                    p: 'Every round you decide what each opponent receives — then build the best farm you can from whatever they decided to leave you.'
                },
                ko: {
                    h: '드래프트를 뒤집다.',
                    p: '매 라운드 상대에게 갈 타일을 내가 정하고, 상대가 내게 남긴 타일로 최선의 농장을 만듭니다.'
                }
            },
            points: {
                en: [
                    'A game that <strong>twists drafting rules</strong> to create intricate interactions.',
                    'Players encounter challenges from their opponents, but ultimately <strong>they must solve the puzzles themselves</strong> to achieve the best possible score.'
                ],
                ko: [
                    '<strong>드래프트 규칙을 비틀어</strong> 촘촘한 상호작용을 만들어내는 게임입니다.',
                    '상대가 던진 문제를 마주하지만, 결국 <strong>최고의 점수는 스스로 풀어내야</strong> 얻을 수 있습니다.'
                ]
            },
            steps: {
                en: [
                    ['Set up', 'Each player has their own personal board, one Personal Tile, and 3 coins.'],
                    ['Draw', 'In each round, every player takes one more tile than the number of players.'],
                    ['Arrange the stack', 'Order your tiles: the tile for the player on your left, the tile for the next player on the left, the tile you keep for yourself, and finally the spare tile.'],
                    ['Pass left', 'Hand the arranged stack to the player on your left. Whoever receives it places the tiles on their own board.'],
                    ['Pay to look further', 'Don\'t like the tile on offer? Pay 1 coin to check the next tile, and use that one instead.'],
                    ['End of round', 'Once a tile has been used and only one tile remains, the round ends.'],
                    ['Close your board', 'If one space is still open at the end of the round, fill it with the Personal Tile you received at the start of the game.']
                ],
                ko: [
                    ['게임 준비', '각 플레이어는 개인 보드 1개, 개인 타일 1장, 동전 3개를 가집니다.'],
                    ['타일 획득', '매 라운드 각 플레이어는 인원수보다 1장 많은 타일을 가져옵니다.'],
                    ['순서 정하기', '왼쪽 플레이어에게 줄 타일, 그다음 왼쪽 플레이어에게 줄 타일, 자신이 가질 타일, 마지막으로 남는 타일 순서로 정렬합니다.'],
                    ['왼쪽으로 전달', '정렬한 타일 더미를 왼쪽 플레이어에게 넘깁니다. 받은 사람은 그 타일을 자신의 보드에 배치합니다.'],
                    ['동전으로 넘기기', '제시된 타일이 마음에 들지 않으면 동전 1개를 내고 다음 타일을 확인한 뒤, 그 타일을 사용할 수 있습니다.'],
                    ['라운드 종료', '타일을 사용한 뒤 1장만 남으면 라운드가 끝납니다.'],
                    ['보드 채우기', '라운드가 끝났을 때 개인 보드에 빈칸이 하나 남아 있다면, 게임 시작 때 받은 개인 타일로 그 칸을 채웁니다.']
                ]
            },
            scoring: {
                formula: {
                    en: ['⭐ Stars in a crop field', '👷 Workers directed at it'],
                    ko: ['⭐ 작물 밭에 모인 별', '👷 그 밭을 향한 일꾼']
                },
                note: {
                    en: 'Score every crop field this way and add the results. The player with the highest total wins the game.',
                    ko: '모든 작물 밭을 이렇게 계산해 합산하며, 총점이 가장 높은 플레이어가 승리합니다.'
                }
            },
            components: {
                en: [['4', 'Personal Boards', 'fa-table-cells'], ['4', 'Personal Tiles', 'fa-star'], ['100', 'Game Tiles', 'fa-layer-group'], ['40', 'Coin Tokens', 'fa-coins']],
                ko: [['4', '개인 보드', 'fa-table-cells'], ['4', '개인 타일', 'fa-star'], ['100', '게임 타일', 'fa-layer-group'], ['40', '동전 토큰', 'fa-coins']]
            },
            figure: {
                src: { en: '/assets/doore_ingame_table.png', ko: '/assets/doore_ingame_table.png' },
                alt: {
                    en: 'The Doore digital prototype: a personal farm board on the left and the draft stack being ordered for the pass on the right.',
                    ko: '두레 디지털 프로토타입 화면: 왼쪽에는 개인 농장 보드, 오른쪽에는 전달할 타일 순서를 정하는 드래프트 스택.'
                },
                caption: {
                    en: 'The full game runs in the browser — solo against AI or in a multiplayer room — so publishers can try it without a print-and-play.',
                    ko: '브라우저에서 솔로(AI) 또는 멀티플레이로 전체 게임을 바로 플레이할 수 있어, 퍼블리셔가 PnP 없이도 검토할 수 있습니다.'
                }
            },
            play: 'https://doore-boardgame.vercel.app/'
        },

        alchemists: {
            mark: '⚗️',
            name: { en: 'Alchemists', ko: '연금술사' },
            specs: { players: '2–4', ages: '10+', minutes: '30' },
            tags: {
                en: ['Engine Building', 'Set Collection'],
                ko: ['엔진 빌딩', '세트 수집']
            },
            hero: {
                en: {
                    h: 'Every card you play feeds the next one.',
                    p: 'Take gold, silver or copper — and the card matching that metal comes straight into your hand, so each action also chooses what your engine can do next.'
                },
                ko: {
                    h: '지금 낸 카드가 다음 카드를 데려옵니다.',
                    p: '금·은·동을 가져오면 그 금속에 대응하는 카드가 곧바로 손에 들어오므로, 한 번의 행동이 다음 엔진까지 결정합니다.'
                }
            },
            points: {
                en: [
                    'An <strong>engine-building game that creatively utilizes various engine functions</strong>.',
                    'A set collection engine-building game with a <strong>unique drafting system</strong>.'
                ],
                ko: [
                    '<strong>다양한 엔진 기능을 창의적으로 활용하는</strong> 엔진 빌딩 게임입니다.',
                    '<strong>독특한 드래프트 시스템</strong>을 갖춘 세트 수집 엔진 빌딩 게임입니다.'
                ]
            },
            steps: {
                en: [
                    ['Set up', 'Each player receives a starting card board and 4 starting game cards. The gems are separated into gold, silver and copper and placed into their respective containers.'],
                    ['Open the market', 'Shuffle the non-starting game cards into a deck. Reveal 4 cards and arrange them in ascending order of card number: the lowest matches gold, the next silver, the next copper.'],
                    ['Read a card', 'Each card consists of a unique number, a main action icon, and a secondary action.'],
                    ['Play a card', 'On your turn, play one card from your hand. The main actions are Acquire Gold, Acquire Silver, Acquire Copper, or Acquire a Card Freely. On a gem action, take the amount of that gem shown on the card, then take the corresponding matching card into your hand.'],
                    ['Place the used card', 'A "play immediately" card is placed next to you after being used. A "passive effect" card goes under your starting card board.'],
                    ['Sell gems', 'Afterwards, players may sell their gems according to the selling conditions and earn points based on their sales.'],
                    ['End of turn', 'A new card is revealed from the deck, and the revealed cards are rearranged in ascending order of card number.']
                ],
                ko: [
                    ['게임 준비', '각 플레이어는 시작 카드 보드 1개와 시작 게임 카드 4장을 받습니다. 보석은 금·은·동으로 나누어 각 용기에 담습니다.'],
                    ['시장 공개', '시작 카드를 제외한 게임 카드를 섞어 덱을 만듭니다. 덱에서 4장을 공개해 카드 번호 오름차순으로 배열하며, 가장 낮은 카드가 금, 그다음이 은, 그다음이 동에 대응합니다.'],
                    ['카드 읽기', '모든 카드에는 고유 번호, 주 행동 아이콘, 보조 행동이 있습니다.'],
                    ['카드 사용', '자기 차례에 손에서 카드 1장을 냅니다. 주 행동은 [금 획득], [은 획득], [동 획득], [카드 자유 획득]입니다. 보석 획득 행동을 하면 카드에 표시된 수만큼 해당 보석을 가져오고, 대응하는 카드를 손으로 가져옵니다.'],
                    ['사용한 카드 배치', '"즉시 사용" 카드는 사용 후 자신의 옆에 놓고, "지속 효과" 카드는 시작 카드 보드 아래에 놓습니다.'],
                    ['보석 판매', '이후 판매 조건에 따라 보석을 팔아 판매액만큼 점수를 얻습니다.'],
                    ['차례 종료', '덱에서 새 카드 1장을 공개하고, 공개된 카드들을 다시 번호 오름차순으로 정렬합니다.']
                ]
            },
            scoring: {
                single: { en: '💎 Sell gems → points', ko: '💎 보석 판매 → 점수' },
                note: {
                    en: 'The game ends when a player reaches 50 points, or after 12 cards have been played.',
                    ko: '한 플레이어가 50점에 도달하거나 카드 12장이 사용되면 게임이 끝납니다.'
                }
            },
            components: {
                en: [['67', 'Game Cards', 'fa-clone'], ['4', 'Starting Card Boards', 'fa-table-cells'], ['75', 'Gem Tokens', 'fa-gem'], ['3', 'Gem Containers', 'fa-box'], ['1', 'Score Board', 'fa-chart-simple'], ['4', 'Meeples', 'fa-chess-pawn']],
                ko: [['67', '게임 카드', 'fa-clone'], ['4', '시작 카드 보드', 'fa-table-cells'], ['75', '보석 토큰', 'fa-gem'], ['3', '보석 용기', 'fa-box'], ['1', '점수 보드', 'fa-chart-simple'], ['4', '미플', 'fa-chess-pawn']]
            },
            play: 'https://alchemists-game.vercel.app/'
        },

        rotato: {
            mark: '🍕',
            name: { en: 'Rotato Pizza', ko: '로타토 피자' },
            specs: { players: '2–4', ages: '8+', minutes: '20' },
            tags: {
                en: ['Puzzle', 'Set Collection', 'Drafting'],
                ko: ['퍼즐', '세트 수집', '드래프트']
            },
            hero: {
                en: {
                    h: 'One good placement keeps on turning.',
                    p: 'Match the edges of adjacent tiles and you may rotate. Still matching after the rotation? Rotate again — and keep the chain going.'
                },
                ko: {
                    h: '잘 놓은 한 장이 계속 돌아갑니다.',
                    p: '맞닿은 타일의 변이 일치하면 회전할 수 있고, 회전한 뒤에도 일치하면 한 번 더 회전할 수 있습니다.'
                }
            },
            points: {
                en: [
                    'If the edges of adjacent tiles match, you can rotate the tile. If the edges still match after rotation, you can rotate it again. <strong>Choose the right tile, place it in the best spot, then rotate it as many times as possible.</strong>',
                    'A game that <strong>maximizes the fun of creating combinations</strong> using puzzle mechanics.'
                ],
                ko: [
                    '맞닿은 타일의 변이 일치하면 타일을 회전할 수 있고, 회전 후에도 변이 일치하면 다시 회전할 수 있습니다. <strong>알맞은 타일을 골라 최적의 자리에 놓고, 가능한 한 여러 번 회전시키세요.</strong>',
                    '퍼즐 메커니즘으로 <strong>조합을 만들어내는 재미를 극대화한</strong> 게임입니다.'
                ]
            },
            steps: {
                en: [
                    ['Set up', 'Shuffle the game tiles well to create a tile deck. Each player receives a game board and 2 starting tiles, placed in the two designated spots on the board.'],
                    ['Draw', 'Each player draws 4 tiles from the tile deck into their hand.'],
                    ['Place a tile', 'Choose 1 tile to play on your personal board. Pick one of the three columns (like in Tetris) and place the tile in the highest available position in that column, with the "IN" symbol facing downward.'],
                    ['Rotate a match', 'After placing, rotate one tile clockwise that has the same icon as the tile you just played. In short, each turn is: place one tile, rotate one matching tile once clockwise.'],
                    ['Keep rotating', 'If tiles on the outer edge show matching symbols, you may rotate one of those clockwise as well.'],
                    ['Score a tile', 'Once a tile has been rotated three times, its "OUT" symbol appears in the bottom-right corner: remove it from the board and score it.'],
                    ['Pass left', 'After playing one tile, all players pass their remaining tiles to the player on their left.']
                ],
                ko: [
                    ['게임 준비', '게임 타일을 잘 섞어 타일 덱을 만듭니다. 각 플레이어는 게임 보드 1개와 시작 타일 2장을 받아, 보드의 지정된 두 자리에 놓습니다.'],
                    ['타일 뽑기', '각 플레이어는 타일 덱에서 4장을 손으로 가져옵니다.'],
                    ['타일 놓기', '손에서 1장을 골라 개인 보드에 놓습니다. 보드의 세 열 중 하나를 골라(테트리스처럼) 그 열의 가장 높은 빈자리에, 타일의 "IN" 기호가 아래를 향하도록 놓습니다.'],
                    ['같은 아이콘 회전', '타일을 놓은 뒤, 방금 놓은 타일과 같은 아이콘을 가진 타일 1개를 시계 방향으로 회전시킵니다. 즉 한 차례는 타일 1장 놓기 + 같은 아이콘 타일 1개 시계 방향 회전입니다.'],
                    ['연쇄 회전', '바깥쪽 가장자리의 타일 중 기호가 일치하는 것이 있다면, 그중 하나를 시계 방향으로 회전시킬 수 있습니다.'],
                    ['타일 득점', '타일이 세 번 회전하면 오른쪽 아래에 "OUT" 기호가 나타납니다. 그 타일을 보드에서 빼내 점수로 가져갑니다.'],
                    ['왼쪽으로 전달', '타일 1장을 놓은 뒤, 모든 플레이어는 남은 손 타일을 왼쪽 플레이어에게 전달합니다.']
                ]
            },
            scoring: {
                single: { en: '🔄 Rotated three times → OUT → scored', ko: '🔄 세 번 회전 → OUT → 득점' },
                note: {
                    en: 'When a player has scored 9 tiles, they replenish their hand up to 3 tiles. After playing those 3 tiles, the game ends.',
                    ko: '한 플레이어가 타일 9장을 득점하면 손을 3장까지 보충하고, 그 3장을 모두 사용하면 게임이 끝납니다.'
                }
            },
            components: {
                en: [['92', 'Tiles — 8 starting, 84 game tiles', 'fa-shapes'], ['4', 'Game Boards', 'fa-table-cells']],
                ko: [['92', '타일 — 시작 타일 8장, 게임 타일 84장', 'fa-shapes'], ['4', '게임 보드', 'fa-table-cells']]
            },
            figure: {
                src: { en: '/assets/rotato_ingame_table.png', ko: '/assets/rotato_ingame_table.png' },
                alt: {
                    en: 'The Rotato Pizza digital prototype: a personal board with three columns of tiles and the hand being drafted.',
                    ko: '로타토 피자 디지털 프로토타입 화면: 세 열로 채워지는 개인 보드와 드래프트 중인 손 타일.'
                },
                caption: {
                    en: 'Playable in the browser, so publishers can feel the rotation chains without a print-and-play.',
                    ko: '브라우저에서 바로 플레이할 수 있어, PnP 없이도 회전 연쇄의 감각을 확인할 수 있습니다.'
                }
            },
            play: 'https://vercel-rotato-site.vercel.app/'
        },

        tamers: {
            mark: '🃏',
            name: { en: 'Tamers', ko: '테이머스' },
            specs: { players: '2–5', ages: '8+', minutes: '15' },
            tags: { en: ['Trick-Taking'], ko: ['트릭테이킹'] },
            hero: {
                en: {
                    h: 'Trick-taking without suits.',
                    p: 'Only the size of the number wins a trick. Call how many tricks you will take, then watch three event cards bend the round around you.'
                },
                ko: {
                    h: '수트가 없는 트릭테이킹.',
                    p: '오직 숫자의 크기만으로 트릭의 승자가 정해집니다. 몇 번 이길지 먼저 선언하고, 매 라운드 공개되는 이벤트 카드가 판을 흔듭니다.'
                }
            },
            points: {
                en: [
                    'Removes the concept of <strong>"suits"</strong> from traditional trick-taking games to improve accessibility.',
                    'Simple rules — <strong>only the magnitude of numbers</strong> determines the winner of each trick.',
                    'Each round features <strong>event cards</strong> that create unpredictable and exciting twists.'
                ],
                ko: [
                    '전통적인 트릭테이킹의 <strong>"수트" 개념을 없애</strong> 접근성을 높였습니다.',
                    '규칙이 단순합니다 — <strong>오직 숫자의 크기</strong>로 각 트릭의 승자가 정해집니다.',
                    '매 라운드 등장하는 <strong>이벤트 카드</strong>가 예측할 수 없는 반전을 만듭니다.'
                ]
            },
            steps: {
                en: [
                    ['Set up', 'Decide the starting player. Each player takes a set of prediction (goal) tokens in one colour, then deal each player the number of game cards set by the player count and round.'],
                    ['Predict', 'After checking their hands, players predict how many tricks they will win this round: 0 wins, 1 win, 2 wins, or 3 or more.'],
                    ['Reveal predictions', 'Each player simultaneously reveals their chosen prediction token and places it in front of them.'],
                    ['Reveal events', 'Reveal 3 event cards from the event deck.'],
                    ['Play a trick', 'Starting from the first player and proceeding clockwise, everyone plays one card per turn. The player who plays the highest number wins the trick, takes all played cards, and flips them to mark one win.'],
                    ['Apply an event', 'The winner then chooses one of the revealed event cards and applies its effect: how the current trick is resolved, how the next turn is played, or card and token exchanges between players.'],
                    ['End the round', 'After everyone has played all their cards, the round ends.']
                ],
                ko: [
                    ['게임 준비', '시작 플레이어를 정합니다. 각 플레이어는 한 가지 색의 예측(목표) 토큰 세트를 가져가고, 인원수와 라운드에 따라 정해진 수만큼 게임 카드를 나눠 받습니다.'],
                    ['예측', '손패를 확인한 뒤, 이번 라운드에 몇 번의 트릭을 이길지 예측합니다 — 0승, 1승, 2승, 또는 3승 이상.'],
                    ['예측 공개', '모두 동시에 선택한 예측 토큰을 공개해 자기 앞에 놓습니다.'],
                    ['이벤트 공개', '이벤트 덱에서 이벤트 카드 3장을 공개합니다.'],
                    ['트릭 진행', '시작 플레이어부터 시계 방향으로 각자 카드 1장을 냅니다. 가장 높은 숫자를 낸 사람이 트릭을 가져가고, 낸 카드를 모두 가져와 뒤집어 1승으로 표시합니다.'],
                    ['이벤트 적용', '승자는 공개된 이벤트 카드 중 하나를 골라 효과를 적용합니다. 현재 트릭의 처리 방식, 다음 차례의 진행 방식, 또는 플레이어 간 카드·토큰 교환에 영향을 줍니다.'],
                    ['라운드 종료', '모두가 손패를 다 사용하면 라운드가 끝납니다.']
                ]
            },
            scoring: {
                formula: {
                    en: ['🏅 1 point per trick won', '🎯 Prediction bonus'],
                    ko: ['🏅 이긴 트릭 수만큼 점수', '🎯 예측 성공 보너스']
                },
                note: {
                    en: 'If a player\'s predicted wins match their actual wins, they gain the bonus points shown on their prediction token. The highest scorer becomes the first player in the next round. The game ends when a player reaches 15 points, or after 3 rounds.',
                    ko: '예측한 승수와 실제 승수가 일치하면 예측 토큰에 표시된 보너스 점수를 얻습니다. 가장 점수가 높은 사람이 다음 라운드의 시작 플레이어가 되며, 한 플레이어가 15점에 도달하거나 3라운드가 끝나면 게임이 종료됩니다.'
                }
            },
            components: {
                en: [['56', 'Game Cards', 'fa-clone'], ['24', 'Event Cards', 'fa-bolt'], ['1', 'Reference Card', 'fa-book'], ['20', 'Prediction Tokens', 'fa-bullseye'], ['80', 'Points of Score Tokens', 'fa-star']],
                ko: [['56', '게임 카드', 'fa-clone'], ['24', '이벤트 카드', 'fa-bolt'], ['1', '요약 카드', 'fa-book'], ['20', '예측 토큰', 'fa-bullseye'], ['80', '점수 토큰 (총 80점)', 'fa-star']]
            },
            figure: {
                src: { en: '/assets/tamers_ingame_table_en.png', ko: '/assets/tamers_ingame_table_ko.png' },
                alt: {
                    en: 'The Tamers digital prototype: a hand of numbered cards, the revealed event cards and each player\'s prediction token.',
                    ko: '테이머스 디지털 프로토타입 화면: 숫자 카드 손패, 공개된 이벤트 카드, 각 플레이어의 예측 토큰.'
                },
                caption: {
                    en: 'A full browser prototype, so a publisher can play a round in a couple of minutes.',
                    ko: '브라우저에서 전체 게임을 플레이할 수 있어, 퍼블리셔가 몇 분 만에 한 라운드를 돌려볼 수 있습니다.'
                }
            },
            play: 'https://tamers-game.vercel.app/'
        },

        orchards: {
            mark: '🍏',
            name: { en: 'Orchards', ko: '오차드' },
            specs: { players: '2–5', ages: '8+', minutes: '30' },
            tags: {
                en: ['Auction', 'Tile Placement', 'Set Collection'],
                ko: ['경매', '타일 배치', '세트 수집']
            },
            hero: {
                en: {
                    h: 'The number on your tile is your bid.',
                    p: 'Play low to pick from the market first, play high to keep the tile you actually want — and whatever you reveal has to be played right away.'
                },
                ko: {
                    h: '타일의 숫자가 곧 입찰가입니다.',
                    p: '낮은 숫자를 내면 시장에서 먼저 고르고, 높은 숫자를 내면 원하는 타일을 남깁니다. 공개한 타일은 그 자리에서 반드시 사용해야 합니다.'
                }
            },
            points: {
                en: [
                    'A <strong>fast-paced tile-placement game</strong> utilizing the concept of a <strong>blind auction</strong>.',
                    'A beautiful puzzle game where <strong>the outcome results in a pleasing creation</strong>.'
                ],
                ko: [
                    '<strong>비공개 경매</strong> 개념을 활용한 <strong>속도감 있는 타일 배치 게임</strong>입니다.',
                    '<strong>완성된 결과물 자체가 아름다운</strong> 퍼즐 게임입니다.'
                ]
            },
            steps: {
                en: [
                    ['Draft your hand', 'Each player draws 5 tiles, selects one to keep, and passes the rest to the left. Through the draft each player selects 4 tiles; the 4th unchosen tile is discarded and removed from the game.'],
                    ['Reveal the market', 'In each round, 5 tiles are revealed. Each tile has a unique number value.'],
                    ['Bid', 'Each player chooses one tile from their hand to reveal.'],
                    ['Pick in order', 'Players take turns picking a revealed tile in order of the lowest number.'],
                    ['Play it immediately', 'Once a tile is revealed, it must be played immediately. Terrain tiles must be placed adjacent to previously placed tiles; crop tiles are discarded and used to collect the corresponding crop.'],
                    ['Place the crops', 'Crops must be placed on terrain tiles of the matching colour. If no matching colour terrain tile is available, the crop cannot be placed.'],
                    ['Final play', 'When the tile deck runs out, each player plays one tile from their hand and the game ends.']
                ],
                ko: [
                    ['손패 드래프트', '각 플레이어가 타일 5장을 뽑아 1장을 남기고 나머지를 왼쪽으로 전달합니다. 드래프트를 거쳐 4장을 확보하며, 마지막까지 선택되지 않은 4번째 타일은 게임에서 제외합니다.'],
                    ['시장 공개', '매 라운드 타일 5장을 공개합니다. 모든 타일에는 고유한 숫자가 있습니다.'],
                    ['입찰', '각 플레이어는 손패에서 1장을 골라 공개합니다.'],
                    ['순서대로 선택', '숫자가 낮은 순서대로 공개된 타일을 한 장씩 가져옵니다.'],
                    ['즉시 사용', '공개한 타일은 즉시 사용해야 합니다. 지형 타일은 이미 놓인 타일과 인접하게 놓고, 작물 타일은 버린 뒤 해당 작물을 가져옵니다.'],
                    ['작물 배치', '작물은 같은 색 지형 타일 위에 놓아야 합니다. 일치하는 색의 지형이 없다면 그 작물은 놓을 수 없습니다.'],
                    ['마지막 사용', '타일 덱이 떨어지면 각 플레이어가 손패에서 1장을 사용하고 게임이 끝납니다.']
                ]
            },
            scoring: {
                formula: {
                    en: ['👷 Workers in a terrain', '🍎 Crops on it'],
                    ko: ['👷 지형의 일꾼', '🍎 그 지형의 작물']
                },
                note: {
                    en: 'Players also earn 10 points for having the largest area of each terrain type. The player with the most points at the end of the game wins.',
                    ko: '또한 각 지형 종류마다 가장 넓은 영역을 가진 플레이어는 10점을 얻습니다. 게임이 끝났을 때 점수가 가장 높은 플레이어가 승리합니다.'
                }
            },
            components: {
                en: [['90', 'Tiles', 'fa-shapes'], ['106', 'Tokens', 'fa-circle-dot']],
                ko: [['90', '타일', 'fa-shapes'], ['106', '토큰', 'fa-circle-dot']]
            },
            play: 'https://orchards-boardgame.vercel.app/'
        }
    };

    const PROTOTYPE_NOTE = {
        en: 'A full digital prototype runs in the browser, so publishers can try the game without a print-and-play.',
        ko: '브라우저에서 전체 디지털 프로토타입을 플레이할 수 있어, 퍼블리셔가 PnP 없이도 검토할 수 있습니다.'
    };

    function modalId(key) {
        return key + 'SellSheetModal';
    }

    function renderBody(sheet, lang) {
        const L = LABELS[lang];
        const hero = sheet.hero[lang];
        const scoring = sheet.scoring;
        const formula = scoring.formula
            ? `<em>${scoring.formula[lang][0]}</em><b>×</b><em>${scoring.formula[lang][1]}</em>`
            : `<em>${scoring.single[lang]}</em>`;

        const prototype = sheet.figure
            ? `<figure class="ss-figure">
                            <img src="${sheet.figure.src[lang]}" alt="${sheet.figure.alt[lang]}" loading="lazy">
                            <figcaption>${sheet.figure.caption[lang]}</figcaption>
                        </figure>`
            : `<p class="ss-prototype-note">${PROTOTYPE_NOTE[lang]}</p>`;

        return `
                    <div class="ss-hero">
                        <h4>${hero.h}</h4>
                        <p>${hero.p}</p>
                    </div>

                    <div class="ss-specs">
                        <div><strong>${sheet.specs.players}</strong><span>${L.players}</span></div>
                        <div><strong>${sheet.specs.ages}</strong><span>${L.ages}</span></div>
                        <div><strong>${sheet.specs.minutes}</strong><span>${L.minutes}</span></div>
                    </div>

                    <div class="ss-tags">${sheet.tags[lang].map(tag => `<span>${tag}</span>`).join('')}</div>

                    <section class="ss-section">
                        <h5><i class="fa-solid fa-star"></i> ${L.points}</h5>
                        <ul class="ss-points">${sheet.points[lang].map(point => `<li>${point}</li>`).join('')}</ul>
                    </section>

                    <section class="ss-section">
                        <h5><i class="fa-solid fa-list-ol"></i> ${L.how}</h5>
                        <ol class="ss-steps">${sheet.steps[lang].map(([title, body]) => `
                            <li><div><strong>${title}</strong><span>${body}</span></div></li>`).join('')}
                        </ol>
                    </section>

                    <section class="ss-section">
                        <h5><i class="fa-solid fa-trophy"></i> ${L.scoring}</h5>
                        <div class="ss-score">${formula}</div>
                        <p class="ss-score-note">${scoring.note[lang]}</p>
                    </section>

                    <section class="ss-section">
                        <h5><i class="fa-solid fa-box-open"></i> ${L.components}</h5>
                        <div class="ss-components">${sheet.components[lang].map(([amount, label, icon]) => `
                            <div><i class="fa-solid ${icon}"></i><span><b>${amount}</b><small>${label}</small></span></div>`).join('')}
                        </div>
                    </section>

                    <section class="ss-section">
                        <h5><i class="fa-solid fa-display"></i> ${L.prototype}</h5>
                        ${prototype}
                    </section>

                    <section class="ss-section">
                        <h5><i class="fa-solid fa-envelope"></i> ${L.contact}</h5>
                        <div class="ss-contact">
                            <strong>${CONTACT[lang]}</strong>
                            <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>
                        </div>
                    </section>`;
    }

    function renderSheet(key, sheet) {
        const id = modalId(key);
        return `
        <div class="proto-modal-overlay" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${key}SellSheetTitle" style="display:none;">
        <div class="proto-modal-card sell-sheet-card ss-${key}">
            <header class="ss-header">
                <span class="ss-mark" aria-hidden="true">${sheet.mark}</span>
                <div class="ss-heading">
                    <span class="ss-eyebrow"><span class="rb-content-en">${LABELS.en.eyebrow}</span><span class="rb-content-ko" style="display:none;">${LABELS.ko.eyebrow}</span></span>
                    <h3 class="ss-title" id="${key}SellSheetTitle">
                        <span class="rb-title-text-en">${sheet.name.en} — ${LABELS.en.suffix}</span>
                        <span class="rb-title-text-ko" style="display:none;">${sheet.name.ko} — ${LABELS.ko.suffix}</span>
                    </h3>
                </div>
                <div class="ss-actions">
                    <div class="ss-lang" role="group" aria-label="${LABELS.en.langLabel}">
                        <button type="button" class="rb-lang-btn" data-rb-lang="ko" onclick="setRulebookLanguage('ko', '${id}')">KO</button>
                        <button type="button" class="rb-lang-btn" data-rb-lang="en" onclick="setRulebookLanguage('en', '${id}')">EN</button>
                    </div>
                    <button type="button" class="ss-close" onclick="closeModal('${id}')" aria-label="Close ${sheet.name.en} sell sheet"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </header>

            <div class="ss-body">
                <div class="rb-content-en">${renderBody(sheet, 'en')}
                </div>

                <div class="rb-content-ko" style="display:none;">${renderBody(sheet, 'ko')}
                </div>
            </div>

            <footer class="ss-footer">
                <button type="button" onclick="closeModal('${id}')"><span class="rb-content-en">${LABELS.en.close}</span><span class="rb-content-ko" style="display:none;">${LABELS.ko.close}</span></button>
                <a href="${sheet.play}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> <span class="rb-content-en">${LABELS.en.play}</span><span class="rb-content-ko" style="display:none;">${LABELS.ko.play}</span></a>
            </footer>
        </div>
        </div>`;
    }

    function syncLanguage() {
        if (typeof window.setRulebookLanguage !== 'function') return;
        const lang = document.documentElement.getAttribute('lang') === 'ko' ? 'ko' : 'en';
        Object.keys(SHEETS).forEach(key => window.setRulebookLanguage(lang, modalId(key)));
    }

    function init() {
        document.body.insertAdjacentHTML('beforeend', Object.entries(SHEETS).map(([key, sheet]) => renderSheet(key, sheet)).join('\n'));
        syncLanguage();
        // The page's language switch only re-runs the rulebooks it knows about,
        // so follow the <html lang> attribute instead of being wired into it.
        new MutationObserver(syncLanguage).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang']
        });
        Object.keys(SHEETS).forEach(key => {
            const modal = document.getElementById(modalId(key));
            modal.addEventListener('click', function (event) {
                if (event.target === modal) window.closeModal(modalId(key));
            });
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
