(function () {
    'use strict';

    // Publisher sell sheets. Every fact below comes from page 1 of the matching
    // "Game Introduction - <game>.pdf", the sheets sent to publishers. The phone
    // number those PDFs carry is deliberately left out: this page is public.
    const CONTACT = {
        en: 'Hwantastic Games — Studio Lead Designer',
        ko: 'Hwantastic Games — 디자이너',
        email: 'gamedesigner.ikhwan@gmail.com'
    };

    const LABELS = {
        en: {
            eyebrow: 'Publisher sell sheet',
            suffix: 'Sell Sheet',
            players: 'Players', ages: 'Ages', minutes: 'Minutes', rounds: 'Rounds', nights: 'Nights',
            points: 'Key selling points',
            how: 'How to play',
            scoring: 'Scoring',
            components: 'Components',
            prototype: 'Playable prototype',
            physicalPrototype: 'In-person prototype',
            contact: 'Contact',
            close: 'Close',
            play: 'Play the prototype',
            langLabel: 'Sell sheet language'
        },
        ko: {
            eyebrow: '퍼블리셔 셀 시트',
            suffix: '셀 시트',
            players: '인원', ages: '연령', minutes: '분', rounds: '라운드', nights: '밤',
            points: '핵심 세일즈 포인트',
            how: '플레이 방법',
            scoring: '점수 계산',
            components: '구성물',
            prototype: '플레이 가능한 프로토타입',
            physicalPrototype: '물리적 프로토타입',
            contact: '연락처',
            close: '닫기',
            play: '프로토타입 플레이',
            langLabel: '셀 시트 언어'
        }
    };

    const SHEETS = {
        'past-lives': {
            mark: '⏳',
            name: { en: "Past Lives", ko: "패스트 라이브즈" },
            specs: [['2–5', 'players'], ['10+', 'ages'], ['25', 'minutes'], ['8', 'rounds']],
            tags: {
                en: ['Sealed Bidding', 'Set Collection', 'Directional Special Cards', 'Secret Gift Exchange'],
                ko: ['비공개 동시 입찰', '세트 컬렉션', '방향성 특수 카드', '최종 비밀 선물 교환']
            },
            hero: {
                en: {
                    h: 'A sealed bidding timeline of past karmic connections.',
                    p: 'Bid secretly to claim 2-card era sets, arrange positive and negative connections along your numerical timeline, and face a dramatic final secret gift exchange where rivals bestow karmic debts upon one another.'
                },
                ko: {
                    h: '시간과 인연의 비밀 경매 & 생애 타임라인.',
                    p: '비공개 입찰로 2장들이 세트를 획득해 오름차순으로 생애를 엮어가고, 8라운드 종료 후 남은 인연을 상대에게 비밀리에 선물하는 치열한 심리전 카드 게임입니다.'
                }
            },
            points: {
                en: [
                    '<strong>Pure Sealed Bidding without Inflation:</strong> Lowest bids get first choice of central card sets, with bid cards ascending to form the next round’s top floor.',
                    '<strong>Directional Special Cards (# ←, → #, 2*# ←, → 2*#):</strong> Strategically cancel out enemy curses or double up lovers and friends in your life ribbon.',
                    '<strong>Dramatic Final Secret Gift Exchange:</strong> In the final phase, players secretly pass their remaining cards to rivals — gifting devastating wars or unexpected salvation.'
                ],
                ko: [
                    '<strong>인플레이션 없는 깔끔한 동시 비공개 입찰:</strong> 가장 낮은 번호의 카드를 낸 사람이 1번 세트를 선점하고, 입찰 카드들이 다음 라운드의 바닥 세트로 이어지는 유기적인 순환 구조.',
                    '<strong>방향성 특수 카드의 전술적 콤보:</strong> 좌우 무효화 및 2배 카드로 전쟁과 갈등을 지우거나 연인·친구 점수를 극대화합니다.',
                    '<strong>최종 비밀 인연 교환의 대역전 드라마:</strong> 8라운드 후 손에 남은 카드를 상대방에게 비밀리에 1장씩 선물하여 승부를 뒤집는 강렬한 인터랙션.'
                ]
            },
            steps: {
                en: [
                    ['Sealed Bid', 'Simultaneously reveal 1 card from hand. Lowest card number chooses first from the available 2-card floor sets.'],
                    ['Play 1, Keep 1', 'From your claimed set, place 1 card in ascending order onto your life timeline and add the other to your hand.'],
                    ['Sort Next Round', 'Current round bid cards are sorted ascending to become the top row of the next round; new cards fill the bottom row.'],
                    ['Special Card Resolution', 'Directional arrows modify adjacent cards (cancel out or double count; facing specials nullify each other).'],
                    ['Secret Gift Exchange', 'After 8 rounds, secretly gift remaining cards to rivals, adding them directly to their final timeline scoring.'],
                    ['Score Connections & Eras', 'Score positive connections (Lover, Friend, Colleague), subtract negative connections (War, Steal, Conflict), and earn +10 VP for each era majority!']
                ],
                ko: [
                    ['동시 비공개 입찰', '손패에서 1장을 뒷면으로 낸 뒤 동시 공개. 가장 작은 번호부터 바닥 세트를 우선 선택합니다.'],
                    ['1장 배치, 1장 손패', '획득한 2장 중 1장을 내 생애 타임라인에 오름차순으로 배치하고, 남은 1장은 손패에 챙깁니다.'],
                    ['다음 라운드 바닥 구성', '이번 라운드 입찰 카드가 다음 라운드 세트 상단이 되고, 덱에서 카드를 뽑아 하단 세트를 채웁니다.'],
                    ['특수 카드 효과 적용', '화살표 방향에 따라 인접 카드를 무효화하거나 2배로 계산하며, 마주보는 특수 카드는 서로 상쇄됩니다.'],
                    ['최종 비밀 선물 교환', '8라운드 후 손에 남은 카드를 다른 플레이어들에게 비밀리에 1장씩 선물하여 타임라인에 추가합니다.'],
                    ['인연 & 시대 점수 계산', '긍정적 인연(연인·친구·동료) 득점, 부정적 인연(전쟁·도둑·갈등) 감점, 7개 각 시대별 최다 보유자에게 시대당 +10점 보너스를 부여합니다!']
                ]
            },
            scoring: {
                single: {
                    en: '⏳ Lover (+12~50) + Friend (+7~30) + Colleague (+5~20) - War (-10~-40) - Steal (-6~-25) - Conflict (-3~-15) + Era Majorities (+10 VP each)',
                    ko: '⏳ 연인(+12~50점) + 친구(+7~30점) + 동료(+5~20점) - 전쟁(-10~-40점) - 도둑(-6~-25점) - 갈등(-3~-15점) + 시대별 최다 보너스(각 10점)'
                },
                note: {
                    en: 'Carefully curate your timeline numbers and connections while anticipating the hidden cards rivals will pass to you in the final exchange.',
                    ko: '오름차순 번호 규칙 속에서 인연의 균형을 맞추고, 마지막 비밀 교환에서 상대가 건넬 카드를 예측하여 승리를 쟁취하세요.'
                }
            },
            components: {
                en: [['70', 'Timeline Cards (7 Eras × 10 cards)', 'fa-clone'], ['30', 'Positive Connection Cards', 'fa-heart'], ['30', 'Negative Connection Cards', 'fa-skull-crossbones'], ['10', 'Directional Special Cards', 'fa-wand-magic-sparkles']],
                ko: [['70', '타임라인 카드 (7개 시대 × 10장)', 'fa-clone'], ['30', '긍정적 인연 카드', 'fa-heart'], ['30', '부정적 인연 카드', 'fa-skull-crossbones'], ['10', '방향성 특수 카드', 'fa-wand-magic-sparkles']]
            },
            figure: {
                src: { en: '/proto/assets/tangent-code-table.webp', ko: '/proto/assets/tangent-code-table.webp' },
                alt: {
                    en: 'Past Lives sealed bidding and life timeline prototype.',
                    ko: '패스트 라이브즈 비공개 입찰 및 생애 타임라인 프로토타입.'
                },
                caption: {
                    en: 'Experience the 8-round tension and the dramatic final secret gift exchange in the online prototype.',
                    ko: '8라운드의 치열한 비딩과 드라마틱한 최종 비밀 인연 교환을 온라인 프로토타입에서 직접 즐겨보세요.'
                }
            },
            play: '/proto/past-lives/'
        },
        'heavens-door': {
            mark: '🚪',
            name: { en: "Heaven's Door", ko: "헤븐스 도어" },
            specs: [['2–4', 'players'], ['8+', 'ages'], ['30', 'minutes']],
            tags: {
                en: ['3D Tile Drafting', 'Set Collection', 'Variable Scoring'],
                ko: ['3D 타일 드래프트', '세트 수집', '가변 점수 조건']
            },
            hero: {
                en: {
                    h: 'A stepped pyramid of matching pairs.',
                    p: 'Draft two exposed tiles that share a color or symbol, organize your constellation across 6 personal scoring tracks, and turn identical pairs into game-winning combos.'
                },
                ko: {
                    h: '계단식 피라미드에서 찾는 일치의 문.',
                    p: '색상이나 기호가 일치하는 외곽 타일 2장을 드래프트하고, 6개 기호 열과 양면 점수 타일을 조합해 콤보와 세트를 완성하세요.'
                }
            },
            points: {
                en: [
                    'A <strong>beautiful 3D stepped pyramid drafting mechanic</strong>: only uncovered tiles with an exposed outer edge can be taken.',
                    '<strong>Double-sided scoring condition tiles (Type A / Type B)</strong>: choose your scoring mode or mix and match for endless replayability.',
                    '<strong>Tactical Combo & Duplicate rules</strong>: draft completely identical pairs for 7 VP combos, or manage duplicate colors to maximize bonuses.'
                ],
                ko: [
                    '<strong>아름다운 3D 계단식 피라미드 드래프트</strong>: 덮여 있지 않고 외곽에 노출된 타일만 가져올 수 있습니다.',
                    '<strong>양면 점수 조건 타일 (Type A / Type B)</strong>: 표준 밸런스형과 고득점 전략형을 선택하거나 혼합해 무한한 리플레이성을 제공합니다.',
                    '<strong>전술적인 콤보 & 중복 규칙</strong>: 완전 일치 쌍으로 7점 콤보를 터뜨리고, 중복 타일을 관리해 점수를 극대화합니다.'
                ]
            },
            steps: {
                en: [
                    ['Stack the pyramid', 'Form the stepped pyramid based on player count (2P: 6×5 & 5×4 layers; 3P: 7×6 & 6×5; 4P: 7×6, 6×5 & 5×4). The top layer is face up, lower layers randomized.'],
                    ['Draft a pair', 'On your turn, choose two acquirable tiles (visible and possessing at least one exposed edge) that match in either Color or Symbol.'],
                    ['Resolve combos & duplicates', 'Completely identical pairs yield 1 tile for your board and 1 for the COMBO stack (+7 VP). Tiles with duplicate colors on an existing symbol go to DUPLICATE (+2 VP).'],
                    ['Place on personal board', 'Place new symbols in left-to-right order into your 6 column slots. In mixed mode, choose Type A or B for newly placed symbols.'],
                    ['Reveal lower tiles', 'When tiles are removed, any newly uncovered face-down tiles flip face-up immediately.'],
                    ['Score after 10 turns', 'After 10 turns (20 tiles collected per player), score symbol conditions, set collection bonus (up to 30 VP), combos, and duplicates. Highest total wins!']
                ],
                ko: [
                    ['피라미드 적재', '인원수에 맞게 계단식 피라미드를 쌓습니다 (2인: 6×5 및 5×4층, 3인: 7×6 및 6×5층, 4인: 7×6, 6×5 및 5×4층). 최상층은 앞면, 아래층은 무작위로 놓습니다.'],
                    ['타일 쌍 드래프트', '자신의 차례에 색상 또는 기호가 일치하는 획득 가능 타일(앞면 노출 및 외곽 모서리 노출) 2장을 가져옵니다.'],
                    ['콤보 & 중복 처리', '색상과 기호가 완전 일치하는 쌍은 1장을 보드에, 1장을 콤보 스택(+7점)에 놓습니다. 기존 기호에 이미 있는 색상은 중복 스택(+2점)으로 갑니다.'],
                    ['개인 보드 배치', '가져온 기호는 왼쪽부터 6개 열에 순서대로 배치합니다. 혼합 모드에서는 처음 놓는 기호의 A/B면을 결정합니다.'],
                    ['뒷면 타일 공개', '타일이 빠져 아래층 타일이 완전히 드러나면 즉시 앞면으로 뒤집습니다.'],
                    ['10턴 후 최종 계산', '각자 10턴(총 20장)을 진행한 뒤 기호별 점수, 세트 보너스(최대 30점), 콤보(장당 7점), 중복(장당 2점)을 합산하여 승자를 가립니다.']
                ]
            },
            scoring: {
                single: {
                    en: '🚪 6 Symbol scoring conditions + Set bonus (0~30 VP) + Combos (7 VP) + Duplicates (2 VP)',
                    ko: '🚪 6종 기호 점수 + 세트 보너스(0~30점) + 콤보(장당 7점) + 중복(장당 2점)'
                },
                note: {
                    en: 'Type A offers stable tactical milestones, while Type B rewards exponential quadratic planning (N+1)². The player with the highest total score wins.',
                    ko: 'Type A는 안정적인 단계별 목표를, Type B는 (N+1)² 제곱 형태의 공격적인 고득점 기회를 제공합니다. 총점이 가장 높은 플레이어가 승리합니다.'
                }
            },
            components: {
                en: [['96', 'Game Tiles (6 symbols × 8 colors × 2)', 'fa-layer-group'], ['4', 'Personal Boards', 'fa-table-cells'], ['32', 'Personal Scoring & Combo Tiles', 'fa-gem']],
                ko: [['96', '게임 타일 (6종 기호 × 8종 색상 × 2장)', 'fa-layer-group'], ['4', '개인 보드', 'fa-table-cells'], ['32', '개인 점수 & 콤보 타일', 'fa-gem']]
            },
            figure: {
                src: { en: '/proto/assets/tangent-code-table.webp', ko: '/proto/assets/tangent-code-table.webp' },
                alt: {
                    en: "Heaven's Door 3D tile pyramid and personal board setup.",
                    ko: '헤븐스 도어 3D 타일 피라미드와 개인 보드 배치.'
                },
                caption: {
                    en: 'Play the full digital prototype in your browser — draft against AI and experience the layered 3D puzzle firsthand.',
                    ko: '브라우저에서 전체 디지털 프로토타입을 AI를 상대로 직접 플레이하며 3D 피라미드 퍼즐을 경험해 보세요.'
                }
            },
            play: '/proto/heavens-door/'
        },

        "dondurma": {
            "mark": "🍦",
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
            "tags": {
                "en": [
                    "Dexterity",
                    "Simultaneous Action",
                    "Family Game"
                ],
                "ko": [
                    "손재주",
                    "동시 행동",
                    "패밀리 게임"
                ]
            },
            "hero": {
                "en": {
                    "h": "Keep your ice cream. Take theirs.",
                    "p": "Inspired by Turkish ice cream tricks, Dondurma turns cones and Velcro sticks into a quick, hands-on showdown."
                },
                "ko": {
                    "h": "내 아이스크림은 지키고, 상대 것은 가져오세요.",
                    "p": "튀르키예 아이스크림의 장난스러운 움직임에서 착안한 게임입니다. 콘과 벨크로 막대로 짧고 직관적인 손재주 대결을 즐기세요."
                }
            },
            "points": {
                "en": [
                    "A <strong>dexterity game inspired by dondurma</strong>, the Turkish ice cream.",
                    "A distinctive physical gimmick delivers <strong>immediate, instinctive fun</strong>."
                ],
                "ko": [
                    "튀르키예 아이스크림 <strong>돈두르마의 기믹을 활용한 손재주 게임</strong>입니다.",
                    "독특한 물리적 기믹으로 <strong>직관적이고 즉각적인 재미</strong>를 제공합니다."
                ]
            },
            "steps": {
                "en": [
                    [
                        "Take your ice cream",
                        "Each player holds an ice cream on its cone in their left hand and a Velcro stick in their right hand."
                    ],
                    [
                        "Choose your play space",
                        "At a table, keep your left elbow on the tabletop. When playing standing up, stand an arm’s length apart."
                    ],
                    [
                        "Play simultaneously",
                        "Use the stick’s Velcro to take another player’s ice cream while keeping your own ice cream on its cone."
                    ],
                    [
                        "Stay in the game",
                        "You are eliminated if another player takes your ice cream, if it separates from your cone, or—when playing at a table—if you lift your left elbow off the tabletop."
                    ],
                    [
                        "Last player wins",
                        "Continue until only one player remains. That player wins."
                    ]
                ],
                "ko": [
                    [
                        "아이스크림 들기",
                        "각 플레이어는 왼손에 아이스크림이 얹힌 콘을 들고, 오른손에 벨크로가 달린 막대를 듭니다."
                    ],
                    [
                        "플레이 공간 정하기",
                        "테이블에서는 왼쪽 팔꿈치를 테이블에 붙이고 플레이합니다. 서서 플레이할 때는 서로 팔 길이만큼 떨어져 섭니다."
                    ],
                    [
                        "동시에 플레이",
                        "내 아이스크림이 콘에서 떨어지지 않도록 지키면서, 막대의 벨크로로 상대 아이스크림을 가져옵니다."
                    ],
                    [
                        "탈락 조건",
                        "다른 플레이어에게 아이스크림을 빼앗기거나, 아이스크림이 콘에서 떨어지면 탈락합니다. 테이블 플레이에서는 왼쪽 팔꿈치를 테이블에서 떼어도 탈락합니다."
                    ],
                    [
                        "마지막 생존자가 승리",
                        "한 명만 남을 때까지 플레이합니다. 마지막으로 남은 플레이어가 승리합니다."
                    ]
                ]
            },
            "scoring": {
                "single": {
                    "en": "The last player remaining wins",
                    "ko": "마지막으로 남은 플레이어가 승리"
                },
                "note": {
                    "en": "Protect your ice cream from other players and keep it attached to your cone. At a table, keep your left elbow down.",
                    "ko": "아이스크림을 상대에게 빼앗기지 않고 콘 위에 유지하세요. 테이블에서는 왼쪽 팔꿈치도 붙이고 있어야 합니다."
                }
            },
            "components": {
                "en": [
                    [
                        "4",
                        "Sticks with Velcro",
                        "fa-wand-magic"
                    ],
                    [
                        "4",
                        "Ice Creams",
                        "fa-ice-cream"
                    ],
                    [
                        "4",
                        "Cones",
                        "fa-caret-up"
                    ]
                ],
                "ko": [
                    [
                        "4",
                        "벨크로 막대",
                        "fa-wand-magic"
                    ],
                    [
                        "4",
                        "아이스크림",
                        "fa-ice-cream"
                    ],
                    [
                        "4",
                        "콘",
                        "fa-caret-up"
                    ]
                ]
            },
            "figure": {
                "src": {
                    "en": "/proto/assets/dondurma-table.webp",
                    "ko": "/proto/assets/dondurma-table.webp"
                },
                "alt": {
                    "en": "Two players holding ice cream cones and Velcro sticks while playing Dondurma at a table.",
                    "ko": "테이블에서 아이스크림 콘과 벨크로 막대를 들고 돈두르마를 플레이하는 두 사람."
                },
                "caption": {
                    "en": "The physical prototype in play. Handling the cones, ice creams, and sticks is the game; no browser demo is provided.",
                    "ko": "물리적 프로토타입 플레이 모습입니다. 콘·아이스크림·막대를 직접 조작하는 게임으로, 웹 데모는 제공하지 않습니다."
                }
            }
        },

        doore: {
            mark: '🌾',
            name: { en: 'Doore', ko: '두레' },
            specs: [['2–4', 'players'], ['8+', 'ages'], ['30', 'minutes']],
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
            specs: [['2–4', 'players'], ['10+', 'ages'], ['30', 'minutes']],
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
                en: [['51', 'Game Cards', 'fa-clone'], ['4', 'Starting Card Boards', 'fa-table-cells'], ['75', 'Gem Tokens', 'fa-gem'], ['3', 'Gem Containers', 'fa-box'], ['1', 'Score Board', 'fa-chart-simple'], ['4', 'Meeples', 'fa-chess-pawn']],
                ko: [['51', '게임 카드', 'fa-clone'], ['4', '시작 카드 보드', 'fa-table-cells'], ['75', '보석 토큰', 'fa-gem'], ['3', '보석 용기', 'fa-box'], ['1', '점수 보드', 'fa-chart-simple'], ['4', '미플', 'fa-chess-pawn']]
            },
            figure: {
                src: { en: '/assets/alchemists_ingame_table.png', ko: '/assets/alchemists_ingame_table.png' },
                alt: {
                    en: 'The Alchemists digital prototype: a hand of four action cards above the market columns for gold, silver and bronze.',
                    ko: '연금술사 디지털 프로토타입 화면: 손에 든 행동 카드 4장과 금·은·동 시장 열.'
                },
                caption: {
                    en: 'Playable in the browser against AI, so a publisher can watch the engine come together in a few turns.',
                    ko: 'AI를 상대로 브라우저에서 바로 플레이할 수 있어, 몇 차례만에 엔진이 굴러가는 것을 확인할 수 있습니다.'
                }
            },
            play: 'https://alchemists-game.vercel.app/'
        },

        rotato: {
            mark: '🍕',
            name: { en: 'Rotato Pizza', ko: '로타토 피자' },
            specs: [['2–4', 'players'], ['8+', 'ages'], ['20', 'minutes']],
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
            specs: [['2–5', 'players'], ['8+', 'ages'], ['15', 'minutes']],
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
                    op: '+',
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

        'drawing-game': {
            mark: '🎨',
            name: { en: 'The Drawing Game', ko: '드로잉 게임' },
            specs: [['3–6', 'players'], ['9', 'rounds'], ['10–20', 'minutes']],
            tags: {
                en: ['Simultaneous Selection', 'Spatial Placement'],
                ko: ['동시 비밀 선택', '공간 배치']
            },
            hero: {
                en: {
                    h: 'Read the table, land where two or three meet.',
                    p: 'Every card pays by how many players picked it, and the payoff peaks in the middle: two or three on the same card take the big animals, while going alone or piling in with everyone pays the small ones.'
                },
                ko: {
                    h: '눈치를 읽고, 둘이나 셋이 모이는 자리를 노리세요.',
                    p: '카드의 보상은 그 카드를 고른 사람 수로 정해지며, 가장 좋은 자리는 가운데입니다. 둘 또는 셋이 겹치면 큰 동물을 가져가고, 혼자 고르거나 넷 이상이 몰리면 작은 동물이 돌아옵니다.'
                }
            },
            points: {
                en: [
                    'Rewards depend on <strong>how many players chose that card</strong>, and they peak in the middle: the two- and three-player rows hold almost every gold animal, while the alone row and the four-or-more row pay the small ones.',
                    'Every animal is a <strong>tile you have to fit</strong> on your own 20-bubble canvas: tiles may never overlap, and each bubble left uncovered costs a point.',
                    'A duplicate animal converts into a <strong>stone worth no points</strong> — but a compact shape that erases the bubbles a big animal can no longer reach.'
                ],
                ko: [
                    '보상은 <strong>그 카드를 고른 사람 수</strong>로 정해지며, 가장 큰 보상은 가운데에 있습니다. 2명·3명 행에 큰 동물이 몰려 있고, 혼자 고른 행과 4명 이상 행에는 작은 동물이 배치되어 있습니다.',
                    '얻은 동물은 모두 <strong>내 캔버스에 직접 맞춰 넣어야 하는 타일</strong>입니다. 타일은 겹칠 수 없고, 덮지 못한 물방울마다 1점씩 깎입니다.',
                    '이미 가진 동물이 중복되면 <strong>0점짜리 스톤</strong>으로 바뀝니다. 점수는 없지만 큰 동물이 들어갈 수 없는 좁은 틈을 메워 줍니다.'
                ]
            },
            steps: {
                en: [
                    ['Set up', 'Each player takes an ocean canvas showing 20 uncovered bubbles and one set of A, B and C choice tokens. Shuffle the A, B and C decks separately — never mix them.'],
                    ['Reveal three options', 'At the start of each of the 9 rounds, reveal the top card of each deck.'],
                    ['Read the rewards', 'Every card shows what it pays when 1, 2, 3, or 4 or more players choose it.'],
                    ['Choose in secret', 'All players secretly select A, B or C. Choices stay hidden until everyone has committed.'],
                    ['Reveal and count', 'All selections are revealed at once; count how many players chose each card.'],
                    ['Take your animal', 'Gain the animal on the row matching that count. If you already own that animal, gain its matching-tier stone instead.'],
                    ['Place it on the canvas', 'Rotate and position the tile to cover as many bubbles as possible. It may never overlap a confirmed tile, and once confirmed it is locked in place.']
                ],
                ko: [
                    ['게임 준비', '각 플레이어는 물방울 20개가 그려진 바다 캔버스와 A·B·C 선택 토큰 한 세트를 받습니다. A·B·C 덱은 각각 따로 섞으며 절대 섞지 않습니다.'],
                    ['카드 3장 공개', '9라운드 각각의 시작에 세 덱에서 맨 위 카드를 1장씩 공개합니다.'],
                    ['보상 확인', '모든 카드에는 1명·2명·3명·4명 이상이 선택했을 때의 보상이 각각 표시되어 있습니다.'],
                    ['비밀 선택', '모두 A·B·C 중 하나를 비밀리에 고릅니다. 전원이 선택을 마칠 때까지 공개하지 않습니다.'],
                    ['공개와 집계', '선택을 동시에 공개하고, 각 카드를 몇 명이 골랐는지 셉니다.'],
                    ['동물 획득', '그 인원수에 해당하는 줄의 동물을 얻습니다. 이미 가진 동물이라면 같은 등급의 스톤을 대신 받습니다.'],
                    ['캔버스에 배치', '타일을 회전·이동해 물방울을 최대한 덮습니다. 이미 확정한 타일과 겹칠 수 없으며, 확정하면 다시 옮길 수 없습니다.']
                ]
            },
            scoring: {
                formula: {
                    op: '−',
                    en: ['🐋 Animal points — gold 3, silver 2, bronze 1', '🫧 1 per uncovered bubble'],
                    ko: ['🐋 동물 점수 — 금 3, 은 2, 동 1', '🫧 덮지 못한 물방울 1개당 1점']
                },
                note: {
                    en: 'After the 9th round, add up your animal points and subtract one for every bubble still uncovered on your 20-bubble board. Stones score nothing but still cover bubbles. The highest final score wins.',
                    ko: '9라운드가 끝나면 동물 점수를 모두 더한 뒤, 캔버스에 남은 물방울 1개당 1점씩 뺍니다. 스톤은 점수가 없지만 물방울을 덮어 줍니다. 최종 점수가 가장 높은 플레이어가 승리합니다.'
                }
            },
            components: {
                en: [['27', 'Cards — nine each in the A, B and C decks', 'fa-clone'], ['20', 'Bubbles on every personal ocean board', 'fa-droplet'], ['3', 'Choice tokens (A, B, C) per player', 'fa-circle-half-stroke'], ['4', 'Tile tiers — gold, silver, bronze and stones', 'fa-fish']],
                ko: [['27', '카드 — A·B·C 덱 각 9장', 'fa-clone'], ['20', '개인 바다 보드의 물방울', 'fa-droplet'], ['3', '플레이어당 선택 토큰 (A·B·C)', 'fa-circle-half-stroke'], ['4', '타일 등급 — 금·은·동·스톤', 'fa-fish']]
            },
            figure: {
                src: { en: '/assets/drawing_game_table_layout.png', ko: '/assets/drawing_game_table_layout.png' },
                alt: {
                    en: 'The Drawing Game digital prototype: a personal ocean canvas beside the three revealed cards and the secret choice tokens.',
                    ko: '드로잉 게임 디지털 프로토타입 화면: 개인 바다 캔버스와 공개된 카드 3장, 비밀 선택 토큰.'
                },
                caption: {
                    en: 'Playable in the browser with AI filling the empty seats, so a publisher can try it solo.',
                    ko: '빈 자리를 AI가 채워 주므로 퍼블리셔가 혼자서도 브라우저에서 바로 시험해 볼 수 있습니다.'
                }
            },
            play: 'https://the-drawing-game.vercel.app/'
        },

        'star-window': {
            mark: '🔭',
            name: { en: 'Star Window', ko: '천문대의 밤' },
            specs: [['2–4', 'players'], ['10+', 'ages'], ['25–40', 'minutes']],
            tags: {
                en: ['Tile Placement', 'Spatial Scoring'],
                ko: ['타일 배치', '공간 점수']
            },
            hero: {
                en: {
                    h: 'The tile you want never comes with the lens you want.',
                    p: 'Each plan pairs one sky tile with one observation lens and must be taken as a pair — and the plan you leave behind waits on the table for the next observer.'
                },
                ko: {
                    h: '원하는 타일은 원하는 렌즈와 함께 오지 않습니다.',
                    p: '모든 계획은 하늘 타일 1장과 관측 렌즈 1개가 한 쌍이며, 반드시 함께 가져와야 합니다. 남긴 계획은 다음 관측자를 기다립니다.'
                }
            },
            points: {
                en: [
                    'A lens and its sky tile are <strong>taken as a pair</strong>, so every choice is a compromise — and what you pass up stays on the table for your opponents.',
                    'Lenses <strong>keep scoring as the chart grows</strong>: a wide lens hung over empty sky is worth nothing tonight and a great deal three nights later.',
                    '<strong>Twelve nights, one shrinking stack</strong> of sky tiles — the deck runs out exactly when the final night is laid out.'
                ],
                ko: [
                    '렌즈와 하늘 타일은 <strong>반드시 한 쌍으로</strong> 가져옵니다. 모든 선택이 절충이며, 포기한 계획은 상대에게 넘어갑니다.',
                    '렌즈는 <strong>별지도가 자랄수록 계속 다시 계산</strong>됩니다. 빈 하늘에 걸어둔 넓은 렌즈는 오늘은 0점이지만 사흘 뒤에는 큰 점수가 됩니다.',
                    '<strong>열두 번의 밤, 줄어드는 타일 더미</strong> — 덱은 마지막 밤을 펼칠 때 정확히 바닥납니다.'
                ]
            },
            steps: {
                en: [
                    ['Set up', 'Each player takes one L-shaped observatory chart. Count out the sky tiles for the player count, then lay out players + 1 observation plans, each pairing a sky tile with one lens or the prime scope.'],
                    ['Take a plan', 'Choose any plan on the table and take its sky tile and lens together. The current state of your chart never restricts the choice. Taking the prime scope makes you first observer next night.'],
                    ['Lay the sky tile', 'Both cells must cover empty spaces and at least one must touch your chart orthogonally. Diagonal contact does not count.'],
                    ['Set the lens', 'Place it so every cell its focus requires lies on sky tiles. Two lenses may never share a focus, but fields of view may overlap freely.'],
                    ['No focus, no lens', 'If your chart offers no legal focus for that lens, it is discarded and scores nothing — so look one move ahead before laying the tile.'],
                    ['Spend a cloud', 'A tile with a cloud cell earns a cloud marker. Before taking a plan you may spend one to swap the sky tiles between two plans.'],
                    ['End the night', 'Exactly one plan is always left over; it stays on the table and carries into the next night. Refill back to players + 1.']
                ],
                ko: [
                    ['게임 준비', '각 플레이어는 L자 모양의 천문대 별지도를 1장 받습니다. 인원수에 맞는 하늘 타일을 세어 두고, 인원수 + 1개의 관측 계획을 펼칩니다. 각 계획은 하늘 타일 1장과 렌즈(또는 주 관측경) 1개로 이루어집니다.'],
                    ['계획 가져오기', '테이블의 계획 중 하나를 골라 하늘 타일과 렌즈를 함께 가져옵니다. 내 별지도 상태가 선택을 제한하지 않습니다. 주 관측경이 딸린 계획을 가져오면 다음 밤의 첫 관측자가 됩니다.'],
                    ['하늘 타일 놓기', '두 칸 모두 빈 공간을 덮어야 하며, 그중 최소 한 칸이 기존 별지도와 상하좌우로 맞닿아야 합니다. 대각선 접촉은 인정되지 않습니다.'],
                    ['렌즈 놓기', '렌즈의 초점에 해당하는 칸이 모두 하늘 타일 위에 오도록 놓습니다. 두 렌즈가 같은 초점을 공유할 수는 없지만, 시야는 얼마든지 겹쳐도 됩니다.'],
                    ['초점이 없으면', '별지도에 놓을 수 있는 초점이 하나도 없다면 그 렌즈는 버리며 점수가 되지 않습니다. 타일을 놓기 전에 한 수 앞을 보세요.'],
                    ['구름 사용', '구름 칸이 있는 타일을 놓으면 구름 표식을 1개 얻습니다. 계획을 가져오기 전에 1개를 내면 두 계획의 하늘 타일을 서로 맞바꿀 수 있습니다.'],
                    ['밤의 끝', '계획은 항상 정확히 하나가 남으며, 버리지 않고 다음 밤으로 이월됩니다. 다시 인원수 + 1개가 되도록 보충합니다.']
                ]
            },
            scoring: {
                formula: {
                    en: ['✦ That object inside the lens field', '🔭 The lens multiplier'],
                    ko: ['✦ 시야 안의 해당 천체 수', '🔭 렌즈의 배수']
                },
                note: {
                    en: 'Every lens is recounted whenever the chart grows, so tiles laid later raise the score of older lenses. After the twelfth night, the observatory with the highest total wins.',
                    ko: '별지도가 자랄 때마다 모든 렌즈를 다시 셉니다. 나중에 놓은 타일이 예전 렌즈의 점수를 올려 줍니다. 열두 번째 밤이 끝났을 때 총점이 가장 높은 천문대가 승리합니다.'
                }
            },
            components: {
                en: [['50', 'Sky Tiles — two-cell dominoes', 'fa-clone'], ['40', 'Observation Lenses — 8 per object', 'fa-border-all'], ['15', 'Prime Scopes — 2×2 fields at ×1', 'fa-circle-dot'], ['5', 'Observatory Charts — L-shaped starts', 'fa-table-cells'], ['20', 'Cloud Markers', 'fa-cloud']],
                ko: [['50', '하늘 타일 — 두 칸 도미노', 'fa-clone'], ['40', '관측 렌즈 — 천체별 8개', 'fa-border-all'], ['15', '주 관측경 — 2×2 시야, ×1', 'fa-circle-dot'], ['5', '천문대 별지도 — L자 시작 하늘', 'fa-table-cells'], ['20', '구름 표식', 'fa-cloud']]
            },
            figure: {
                src: { en: '/assets/star_window_ingame_table.png', ko: '/assets/star_window_ingame_table.png' },
                alt: {
                    en: 'The Star Window digital prototype: a personal sky chart on the left and the observation plans on the right, each pairing a lens with a sky tile.',
                    ko: '천문대의 밤 디지털 프로토타입 화면: 왼쪽의 개인 별지도와, 렌즈와 하늘 타일이 짝지어진 오른쪽의 관측 계획들.'
                },
                caption: {
                    en: 'Playable in the browser against AI observatories, so a publisher can see how a chart grows over a few nights.',
                    ko: 'AI 천문대를 상대로 브라우저에서 플레이할 수 있어, 몇 번의 밤만에 별지도가 자라는 모습을 확인할 수 있습니다.'
                }
            },
            play: 'https://star-window.vercel.app/'
        },
        hutch: {
            mark: '🏡',
            name: { en: 'My Little Hutch', ko: '나의 작은 오두막' },
            specs: [['2–4', 'players'], ['8+', 'ages'], ['30–45', 'minutes']],
            tags: {
                en: ['Dual-Layer Puzzle', 'Tile Placement', 'Worker Placement', 'Drafting'],
                ko: ['2중 퍼즐', '타일 배치', '일꾼 드래프팅', '엔진 빌딩']
            },
            hero: {
                en: {
                    h: 'A dual-layer farm puzzle with shepherd engine-building.',
                    p: 'Draft domino and single tiles to complete lines on your 5×5 farm, then position specialized shepherds over dense animal clusters for explosive harvest scores.'
                },
                ko: {
                    h: '타일 배치와 목동 배치가 결합된 2중 농장 퍼즐.',
                    p: '도미노와 싱글 타일로 5×5 농장의 줄을 채워 최고 점수의 빙고를 선점하고, 동물들이 모인 곳에 목동을 배치해 폭발적인 수확 점수를 얻으세요.'
                }
            },
            points: {
                en: [
                    'A <strong>dual-layer spatial puzzle</strong> combining domino and single tile placement with shepherd worker overlays.',
                    '<strong>Competitive drafting with a single worker</strong>: Navigate tight market actions under a mandatory movement rule where you cannot stay in the same space.',
                    '<strong>Engine-building satisfaction</strong>: Harvest silver coins from placed tiles to purchase expensive high-tier tiles and crucial shepherds.'
                ],
                ko: [
                    '타일 놓기와 타일 위 목동 놓기를 유기적으로 결합한 <strong>2중 공간 퍼즐 게임</strong>입니다.',
                    '<strong>제한된 선택지에서 일꾼 하나만을 운영하는 경쟁적 드래프팅</strong>: 머물렀던 칸을 연속으로 선택할 수 없는 의무 이동 규칙이 깊은 수를 만듭니다.',
                    '<strong>퍼즐 게임 안의 엔진 빌딩</strong>: 농장에 축적된 은화 심볼을 수확해 값비싼 고득점 타일과 핵심 목동을 선점하는 성취감을 제공합니다.'
                ]
            },
            steps: {
                en: [
                    ['Setup & Starting Coins', 'Each player receives a 5×5 farm board and 1 worker. Players receive 3, 5, 8, or 12 starting coins by turn order.'],
                    ['5 Action Choices', 'On your turn, send your worker to 1 of 5 spaces: Buy Domino, Buy Single, Hire Shepherd, Gain 5 Coins, or Claim Farm Coins.'],
                    ['Must Move & Opponent Cost', 'You cannot choose the space where your worker currently stays. If other players are on a market space, pay +2 extra coins per opponent worker.'],
                    ['Tile Placement', 'Immediately place drafted domino (2 cells) or single (1 cell) tiles onto empty spaces of your 5×5 personal board.'],
                    ['Line Completion & Bingo', 'Completing any 5-cell row or column immediately awards the highest available White Bingo Bonus tile (15 down to 4 pts).'],
                    ['Shepherd Scoring Engines', 'Place shepherds onto filled cells to activate 1 of 5 scoring area patterns (1-cell, 2-line, 3-line, 2×2 square, 5-line) for matching animals.'],
                    ['Game End & Victory', 'When all white bingo bonus tiles are claimed, the current round finishes. Sum bingo tiles and shepherd scores to crown the winning farm!']
                ],
                ko: [
                    ['게임 준비 & 차례별 코인', '각 플레이어는 5×5 개인 보드와 일꾼 1개를 받습니다. 턴 순서에 따라 3, 5, 8, 12코인을 지급받습니다.'],
                    ['5대 액션 선택', '자신의 턴에 일꾼을 도미노 구매, 싱글 구매, 목동 고용, 5코인 획득, 또는 개인 은화 수확 중 하나의 액션 칸으로 보냅니다.'],
                    ['의무 이동 & 상대 일꾼 비용', '현재 머물고 있는 액션 칸은 연속 선택이 불가합니다. 마켓 액션에 다른 플레이어 일꾼이 있다면 1명당 2코인을 추가 지불합니다.'],
                    ['타일 배치', '가져온 도미노 타일(2칸)이나 싱글 타일(1칸)을 개인 농장 보드의 빈칸에 즉시 배치합니다.'],
                    ['줄 완성 & 빙고 보너스', '가로 또는 세로 5칸 줄을 빈틈없이 채우면 공용 스택에서 가장 높은 흰색 빙고 보너스 타일(15~4점)을 선점합니다.'],
                    ['목동 고용 & 점수 패턴', '타일이 놓인 칸에 목동을 배치하여 5가지 영역 패턴(1칸, 2칸 직선, 3칸 직선, 2×2 사각, 5칸 줄)으로 동물 점수 엔진을 가동합니다.'],
                    ['게임 종료 & 승리', '준비된 흰색 빙고 타일이 모두 떨어지면 해당 라운드의 마지막 플레이어까지 동등하게 진행 후 종료되며, 빙고 점수와 목동 점수의 합으로 승자를 가립니다.']
                ]
            },
            scoring: {
                formula: {
                    op: '+',
                    en: ['🏆 Bingo Bonus Tiles', '🐮 Shepherd Animal Multipliers'],
                    ko: ['🏆 빙고 보너스 타일 점수', '🐮 목동 패턴 동물 점수']
                },
                note: {
                    en: 'Sum all earned bingo bonus tiles and the animal scores evaluated by each placed shepherd. In case of a tie, the player with more remaining coins wins.',
                    ko: '획득한 모든 빙고 보너스 타일 점수와 각 목동이 평가한 동물 배수 점수를 합산합니다. 동점 시 남은 보유 코인이 더 많은 플레이어가 승리합니다.'
                }
            },
            components: {
                en: [['1', 'Public Game Board', 'fa-map'], ['4', 'Personal Boards (5×5)', 'fa-table-cells'], ['35', 'Domino Tiles', 'fa-clone'], ['35', 'Single Tiles', 'fa-square'], ['40', 'Shepherds & 1 Bag', 'fa-hat-cowboy'], ['21', 'Bingo Bonus Tiles', 'fa-award'], ['100', 'Coin Value Tokens', 'fa-coins'], ['4', 'Player Workers', 'fa-person']],
                ko: [['1', '공용 게임 보드', 'fa-map'], ['4', '개인 보드 (5×5)', 'fa-table-cells'], ['35', '도미노 타일', 'fa-clone'], ['35', '싱글 타일', 'fa-square'], ['40', '목동 토큰 & 주머니 1개', 'fa-hat-cowboy'], ['21', '빙고 보너스 타일', 'fa-award'], ['100', '코인 가치 토큰', 'fa-coins'], ['4', '플레이어 일꾼', 'fa-person']]
            },
            figure: {
                src: { en: '/assets/hutch_ingame_table.png', ko: '/assets/hutch_ingame_table.png' },
                alt: {
                    en: 'My Little Hutch digital prototype: personal 5x5 farm board on the left, public market with dominoes, singles, and shepherds on the right.',
                    ko: '나의 작은 오두막 디지털 프로토타입 화면: 왼쪽의 5×5 개인 농장 보드와 오른쪽의 도미노·싱글·목동 공용 마켓.'
                },
                caption: {
                    en: 'Playable directly in the browser against smart AI bots or in real-time multiplayer rooms, allowing publishers to fully test the dual-puzzle dynamics.',
                    ko: '브라우저에서 AI 봇 또는 실시간 멀티플레이 룸으로 바로 플레이할 수 있어, 2중 퍼즐 드래프팅의 재미를 검토할 수 있습니다.'
                }
            },
            play: 'https://my-little-hutch.vercel.app/'
        }
    };

    const PROTOTYPE_NOTE = {
        en: 'A full digital prototype runs in the browser, so publishers can try the game without a print-and-play.',
        ko: '브라우저에서 전체 디지털 프로토타입을 플레이할 수 있어, 퍼블리셔가 PnP 없이도 검토할 수 있습니다.'
    };

    function modalId(key) {
        return key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'SellSheetModal';
    }

    function renderBody(sheet, lang) {
        const L = LABELS[lang];
        const hero = sheet.hero[lang];
        const scoring = sheet.scoring;
        const formula = scoring.formula
            ? `<em>${scoring.formula[lang][0]}</em><b>${scoring.formula.op || '×'}</b><em>${scoring.formula[lang][1]}</em>`
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

                    <div class="ss-specs">${sheet.specs.map(([value, label]) => `
                        <div><strong>${value}</strong><span>${typeof label === 'string' ? L[label] : label[lang]}</span></div>`).join('')}
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
                        <h5><i class="fa-solid fa-display"></i> ${sheet.play ? L.prototype : L.physicalPrototype}</h5>
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
        <div class="proto-modal-overlay" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}Title" style="display:none;">
        <div class="proto-modal-card sell-sheet-card ss-${key}">
            <header class="ss-header">
                <span class="ss-mark" aria-hidden="true">${sheet.mark}</span>
                <div class="ss-heading">
                    <span class="ss-eyebrow"><span class="rb-content-en">${LABELS.en.eyebrow}</span><span class="rb-content-ko" style="display:none;">${LABELS.ko.eyebrow}</span></span>
                    <h3 class="ss-title" id="${id}Title">
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
                ${sheet.play ? `<a href="${sheet.play}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> <span class="rb-content-en">${LABELS.en.play}</span><span class="rb-content-ko" style="display:none;">${LABELS.ko.play}</span></a>` : ''}
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
