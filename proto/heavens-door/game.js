(function () {
    'use strict';

    // Game Constants
    const SYMBOLS = ['triangle', 'trapezoid', 'square', 'circle', 'star', 'hexagon'];
    const COLORS = ['black', 'red', 'yellow', 'green', 'blue', 'purple', 'orange', 'white'];
    
        const COLOR_NAMES = {
        en: { black: 'Black', red: 'Red', yellow: 'Yellow', green: 'Green', blue: 'Blue', purple: 'Purple', orange: 'Orange', white: 'White', gray: 'Orange' },
        ko: { black: '검정', red: '빨강', yellow: '노랑', green: '초록', blue: '파랑', purple: '보라', orange: '주황', white: '흰색', gray: '주황' },
        fr: { black: 'Noir', red: 'Rouge', yellow: 'Jaune', green: 'Vert', blue: 'Bleu', purple: 'Violet', orange: 'Orange', white: 'Blanc', gray: 'Orange' },
        de: { black: 'Schwarz', red: 'Rot', yellow: 'Gelb', green: 'Grün', blue: 'Blau', purple: 'Lila', orange: 'Orange', white: 'Weiß', gray: 'Orange' }
    };

    const SYMBOL_NAMES = {
        en: { triangle: 'Triangle', trapezoid: 'Trapezoid', square: 'Square', circle: 'Circle', star: 'Star', hexagon: 'Hexagon' },
        ko: { triangle: '삼각형', trapezoid: '사다리꼴', square: '정사각형', circle: '원', star: '별', hexagon: '육각형' },
        fr: { triangle: 'Triangle', trapezoid: 'Trapèze', square: 'Carré', circle: 'Cercle', star: 'Étoile', hexagon: 'Hexagone' },
        de: { triangle: 'Dreieck', trapezoid: 'Trapez', square: 'Quadrat', circle: 'Kreis', star: 'Stern', hexagon: 'Sechseck' }
    };

    const SYMBOL_ICONS = {
        triangle: '▲',
        trapezoid: '⏢',
        square: '■',
        circle: '●',
        star: '★',
        hexagon: '⬢'
    };

    
    const SYMBOL_RULES = {
        triangle: {
            icon: '▲',
            color: '#38bdf8',
            A: {
                short: { ko: '1/3/5/7개: 5/15/25/35p', en: '5/15/25/35p per 1/3/5/7 stacks', fr: '5/15/25/35p par 1/3/5/7 piles', de: '5/15/25/35p je 1/3/5/7 Stapel' },
                boardLines: { ko: ['1/3/5/7개', '5/15/25/35p'], en: ['1/3/5/7 pcs', '5/15/25/35p'], fr: ['1/3/5/7 tuiles', '5/15/25/35p'], de: ['1/3/5/7 Plättchen', '5/15/25/35p'] },
                full: {
                    ko: '홀수 스택마다 점수: 1/3/5/7개 시 5/15/25/35점 (짝수 개수는 직전 점수 유지)',
                    en: '5/15/25/35 VP per 1/3/5/7 stacks (even counts keep previous tier)',
                    fr: 'Score aux paliers impairs : 5/15/25/35 points pour 1/3/5/7 tuiles (les nombres pairs conservent le palier précédent)',
                    de: 'Punkte für ungerade Stapel: 5/15/25/35 Punkte bei 1/3/5/7 Plättchen (gerade Anzahlen behalten vorherige Stufe)'
                }
            },
            B: {
                short: { ko: '1/3/5/7개: 4/16/36/64p', en: '4/16/36/64p per 1/3/5/7 stacks', fr: '4/16/36/64p par 1/3/5/7 piles', de: '4/16/36/64p je 1/3/5/7 Stapel' },
                boardLines: { ko: ['1/3/5/7개', '4/16/36/64p'], en: ['1/3/5/7 pcs', '4/16/36/64p'], fr: ['1/3/5/7 tuiles', '4/16/36/64p'], de: ['1/3/5/7 Plättchen', '4/16/36/64p'] },
                full: {
                    ko: '홀수 스택마다 (N+1)² 점수: 1/3/5/7개 시 4/16/36/64점 (짝수 개수는 직전 점수 유지)',
                    en: '4/16/36/64 VP per 1/3/5/7 stacks ((N+1)², even counts keep previous tier)',
                    fr: 'Score (N+1)² aux paliers impairs : 4/16/36/64 points pour 1/3/5/7 tuiles (les nombres pairs conservent le palier précédent)',
                    de: '(N+1)²-Wertung für ungerade Stapel: 4/16/36/64 Punkte bei 1/3/5/7 Plättchen (gerade behalten Vorstufe)'
                }
            }
        },
        trapezoid: {
            icon: '⏢',
            color: '#fb923c',
            A: {
                short: { ko: '2/4/6/8개: 10/20/30/40p', en: '10/20/30/40p per 2/4/6/8 stacks', fr: '10/20/30/40p par 2/4/6/8 piles', de: '10/20/30/40p je 2/4/6/8 Stapel' },
                boardLines: { ko: ['2/4/6/8개', '10/20/30/40p'], en: ['2/4/6/8 pcs', '10/20/30/40p'], fr: ['2/4/6/8 tuiles', '10/20/30/40p'], de: ['2/4/6/8 Plättchen', '10/20/30/40p'] },
                full: {
                    ko: '짝수 스택마다 점수: 2/4/6/8개 시 10/20/30/40점 (1개 0점, 홀수 개수는 직전 점수 유지)',
                    en: '10/20/30/40 VP per 2/4/6/8 stacks (1 tile = 0 VP, odd counts keep previous tier)',
                    fr: 'Score aux paliers pairs : 10/20/30/40 points pour 2/4/6/8 tuiles (1 tuile = 0 pt, les nombres impairs conservent le palier précédent)',
                    de: 'Punkte für gerade Stapel: 10/20/30/40 Punkte bei 2/4/6/8 Plättchen (1 Plättchen = 0, ungerade behalten Vorstufe)'
                }
            },
            B: {
                short: { ko: '2/4/6/8개: 9/25/49/81p', en: '9/25/49/81p per 2/4/6/8 stacks', fr: '9/25/49/81p par 2/4/6/8 piles', de: '9/25/49/81p je 2/4/6/8 Stapel' },
                boardLines: { ko: ['2/4/6/8개', '9/25/49/81p'], en: ['2/4/6/8 pcs', '9/25/49/81p'], fr: ['2/4/6/8 tuiles', '9/25/49/81p'], de: ['2/4/6/8 Plättchen', '9/25/49/81p'] },
                full: {
                    ko: '짝수 스택마다 (N+1)² 점수: 2/4/6/8개 시 9/25/49/81점 (1개 0점, 홀수 개수는 직전 점수 유지)',
                    en: '9/25/49/81 VP per 2/4/6/8 stacks ((N+1)², even counts keep previous tier)',
                    fr: 'Score (N+1)² aux paliers pairs : 9/25/49/81 points pour 2/4/6/8 tuiles (1 tuile = 0 pt, les nombres impairs conservent le palier précédent)',
                    de: '(N+1)²-Wertung für gerade Stapel: 9/25/49/81 Punkte bei 2/4/6/8 Plättchen (1 Plättchen = 0, ungerade behalten Vorstufe)'
                }
            }
        },
        square: {
            icon: '■',
            color: '#4ade80',
            A: {
                short: { ko: '개수 × 콤보p', en: 'Count × Combos p', fr: 'Nb tuiles × Combos p', de: 'Anzahl × Kombos p' },
                boardLines: { ko: ['개수 × 콤보', '(콤보당 1p)'], en: ['Count ×', 'Combos (1p)'], fr: ['Tuiles ×', 'Combos (1p)'], de: ['Anzahl ×', 'Kombos (1p)'] },
                full: {
                    ko: '정사각형 1장당 나의 콤보 수 점 (1점/콤보)',
                    en: '1 VP per COMBO for each square tile',
                    fr: '1 point par tuile COMBO pour chaque carré possédé',
                    de: '1 Punkt pro KOMBO-Plättchen für jedes Quadrat'
                }
            },
            B: {
                short: { ko: '개수 × 중복 × 3p', en: 'Count × Dupl × 3p', fr: 'Nb tuiles × Doublons × 3p', de: 'Anzahl × Doppelt × 3p' },
                boardLines: { ko: ['개수 × 중복', '× 3p'], en: ['Count × Dupl', '× 3p'], fr: ['Tuiles × Doubl.', '× 3p'], de: ['Anzahl × Doppel', '× 3p'] },
                full: {
                    ko: '정사각형 1장당 나의 중복(DUPLICATE) 타일 수 × 3점',
                    en: '3 VP per DUPLICATE tile for each square tile',
                    fr: '3 points par tuile DOUBLON pour chaque carré possédé',
                    de: '3 Punkte pro DOPPELTES Plättchen für jedes Quadrat'
                }
            }
        },
        circle: {
            icon: '●',
            color: '#c084fc',
            A: {
                short: { ko: '개수 × 최다 색상 수', en: 'Count × Max Color', fr: 'Nb tuiles × Coul. max', de: 'Anzahl × Meiste Farbe' },
                boardLines: { ko: ['개수 ×', '최다 색상 수'], en: ['Count ×', 'Max Color'], fr: ['Tuiles ×', 'Coul. max'], de: ['Anzahl ×', 'Meiste Farbe'] },
                full: {
                    ko: '원 1장당 내가 가장 많이 모은 단일 색상의 총 타일 수 점',
                    en: 'Points per circle = count of tiles in most collected color',
                    fr: '1 point par cercle multiplié par le nombre total de tuiles de votre couleur la plus fréquente',
                    de: 'Punkte pro Kreis = Anzahl der Plättchen deiner am häufigsten gesammelten Farbe'
                }
            },
            B: {
                short: { ko: '개수 × 1번째 열 수', en: 'Count × 1st Col', fr: 'Nb tuiles × 1ère colonne', de: 'Anzahl × 1. Spalte' },
                boardLines: { ko: ['개수 ×', '1번째 열 수'], en: ['Count ×', '1st Col Count'], fr: ['Tuiles ×', '1ère colonne'], de: ['Anzahl ×', '1. Spalte'] },
                full: {
                    ko: '원 1장당 개인 보드 맨 왼쪽 1번째 열의 타일 수 점',
                    en: 'Points per circle = count of tiles in leftmost 1st column',
                    fr: '1 point par cercle multiplié par le nombre de tuiles dans la 1ère colonne de votre plateau',
                    de: 'Punkte pro Kreis = Anzahl der Plättchen in der 1. (ganz linken) Spalte deines Spielertableaus'
                }
            }
        },
        star: {
            icon: '★',
            color: '#facc15',
            A: {
                short: { ko: '단독 40p (동점 20p)', en: 'Sole 40p (Tie 20p)', fr: 'Unique 40p (Égalité 20p)', de: 'Allein 40p (Gleich 20p)' },
                boardLines: { ko: ['단독 40p', '(동점 20p)'], en: ['Sole 40p', '(Tie 20p)'], fr: ['Unique 40p', '(Égalité 20p)'], de: ['Allein 40p', '(Gleich 20p)'] },
                full: {
                    ko: '동점 없는 단독 최다 별 보유 시 40점 (동점 최다 시 전원 20점)',
                    en: '40 VP for sole most stars (20 VP each if tied for most)',
                    fr: "40 points si vous avez strictement le plus d'étoiles (20 points chacun en cas d'égalité en tête)",
                    de: '40 Punkte für alleinige meiste Sterne (je 20 Punkte bei Gleichstand an der Spitze)'
                }
            },
            B: {
                short: { ko: '최소 아니면 25p', en: 'Not Fewest: 25p', fr: 'Pas le moins : 25p', de: 'Nicht Letzter: 25p' },
                boardLines: { ko: ['최소 아니면', '25p'], en: ['Not Fewest:', '25p'], fr: ['Pas le moins :', '25p'], de: ['Nicht Letzter:', '25p'] },
                full: {
                    ko: '최소 보유자가 아니면 25점',
                    en: '25 VP if you are not the player with the fewest stars',
                    fr: "25 points si vous n'êtes pas le joueur avec le moins d'étoiles",
                    de: '25 Punkte, wenn du nicht die wenigsten Sterne aller Spieler hast'
                }
            }
        },
        hexagon: {
            icon: '⬢',
            color: '#f43f5e',
            A: {
                short: { ko: '3/4/5개: 15/30/50p', en: '3/4/5+: 15/30/50p', fr: '3/4/5+ tuiles : 15/30/50p', de: '3/4/5+ Plättchen: 15/30/50p' },
                boardLines: { ko: ['3/4/5개', '15/30/50p'], en: ['3/4/5+ pcs', '15/30/50p'], fr: ['3/4/5+ tuiles', '15/30/50p'], de: ['3/4/5+ Plättchen', '15/30/50p'] },
                full: {
                    ko: '육각형 3개(15점) / 4개(30점) / 5개 이상(50점)',
                    en: 'Thresholds: 3 tiles (15p) / 4 tiles (30p) / 5+ tiles (50p)',
                    fr: "Paliers d'hexagones : 3 tuiles (15p) / 4 tuiles (30p) / 5 tuiles ou plus (50p)",
                    de: 'Stufen für Sechsecke: 3 Plättchen (15p) / 4 Plättchen (30p) / 5+ Plättchen (50p)'
                }
            },
            B: {
                short: { ko: '최다 아니면 개당 6p', en: 'Not Most: 6p / tile', fr: 'Pas le plus : 6p / tuile', de: 'Nicht Erster: 6p / Plättchen' },
                boardLines: { ko: ['최다 아니면', '개당 6p'], en: ['Not Leader:', '6p / tile'], fr: ['Pas le leader :', '6p / tile'], de: ['Nicht Erster:', '6p / Plättchen'] },
                full: {
                    ko: '최다 보유자가 아니면 개당 6점 (최다 보유자는 0점)',
                    en: '6 VP per tile if not the leader (leader gets 0 VP)',
                    fr: "6 points par hexagone si vous n'êtes pas le joueur qui en possède le plus (le leader marque 0 pt)",
                    de: '6 Punkte pro Sechseck, wenn du nicht die meisten hast (der Führende erhält 0 Punkte)'
                }
            }
        }
    };

    const I18N_STRINGS = {
        title: {
            ko: "헤븐스 도어 (Heaven's Door) | 환상적인 게임즈",
            en: "Heaven's Door | Hwantastic Games",
            fr: "Heaven's Door | Hwantastic Games",
            de: "Heaven's Door | Hwantastic Games"
        },
        youPlayer: {
            ko: '나 (플레이어)',
            en: 'You (Player)',
            fr: 'Vous (Joueur)',
            de: 'Du (Spieler)'
        },
        turn: {
            ko: (cur, max) => `턴 ${cur}/${max}`,
            en: (cur, max) => `Turn ${cur}/${max}`,
            fr: (cur, max) => `Tour ${cur}/${max}`,
            de: (cur, max) => `Zug ${cur}/${max}`
        },
        yourTurn: {
            ko: '내 차례',
            en: 'Your Turn',
            fr: 'Votre tour',
            de: 'Du bist am Zug'
        },
        aiThinking: {
            ko: name => `${name} 생각 중...`,
            en: name => `${name} Thinking...`,
            fr: name => `${name} réfléchit...`,
            de: name => `${name} denkt nach...`
        },
        gameOverPrompt: {
            ko: '<i class="fa-solid fa-flag-checkered"></i> 게임이 종료되었습니다!',
            en: '<i class="fa-solid fa-flag-checkered"></i> Game Over!',
            fr: '<i class="fa-solid fa-flag-checkered"></i> Partie terminée !',
            de: '<i class="fa-solid fa-flag-checkered"></i> Spiel beendet!'
        },
        aiEvaluatingPrompt: {
            ko: '<i class="fa-solid fa-robot"></i> AI가 최적의 조합을 선택하고 있습니다...',
            en: '<i class="fa-solid fa-robot"></i> AI is evaluating the best pair...',
            fr: '<i class="fa-solid fa-robot"></i> L\'IA évalue la meilleure paire...',
            de: '<i class="fa-solid fa-robot"></i> KI wählt das beste Paar aus...'
        },
        pickFirstPrompt: {
            ko: '<i class="fa-solid fa-hand-pointer"></i> 첫 번째 타일을 선택하세요 (외곽에 노출된 앞면 타일)',
            en: '<i class="fa-solid fa-hand-pointer"></i> Select your first tile (Exposed face-up tile)',
            fr: '<i class="fa-solid fa-hand-pointer"></i> Choisissez votre première tuile (visible en bordure)',
            de: '<i class="fa-solid fa-hand-pointer"></i> Erstes Plättchen wählen (offen am Rand liegend)'
        },
        pickSecondPrompt: {
            ko: (c, s) => `<i class="fa-solid fa-check-double"></i> 두 번째 타일을 선택하세요 (${c} 색상 또는 ${s} 기호 일치)`,
            en: (c, s) => `<i class="fa-solid fa-check-double"></i> Select your second tile (Matching ${c} or ${s})`,
            fr: (c, s) => `<i class="fa-solid fa-check-double"></i> Choisissez la deuxième tuile (de couleur ${c} ou symbole ${s})`,
            de: (c, s) => `<i class="fa-solid fa-check-double"></i> Zweites Plättchen wählen (passend zu ${c} oder ${s})`
        },
        firstOrderTitle: {
            ko: '첫 배치 순서 결정',
            en: 'First Symbol Order Choice',
            fr: 'Ordre de placement initial',
            de: 'Reihenfolge der ersten Symbole'
        },
        firstOrderDesc: {
            ko: '획득한 2개 타일의 기호가 다릅니다. 어떤 기호를 먼저(좌측) 배치할지 선택하세요.',
            en: 'The 2 drafted tiles have different symbols. Choose which one to place first (on the left column).',
            fr: 'Les 2 tuiles choisies ont des symboles différents. Choisissez lequel placer en premier (à gauche).',
            de: 'Die 2 gezogenen Plättchen haben verschiedene Symbole. Wähle, welches zuerst (links) platziert wird.'
        },
        leftSubtext: {
            ko: '(좌측)',
            en: '(Left)',
            fr: '(Gauche)',
            de: '(Links)'
        },
        ruleChoiceTitle: {
            ko: (icon, name) => `[${icon} ${name}] 점수 규칙 면 선택`,
            en: (icon, name) => `Choose Scoring Rule for [${icon} ${name}]`,
            fr: (icon, name) => `Choisir la règle pour [${icon} ${name}]`,
            de: (icon, name) => `Wertungsregel für [${icon} ${name}] wählen`
        },
        ruleChoiceDesc: {
            ko: '새로운 기호를 처음 획득했습니다. 이번 게임에서 적용할 규칙 면을 선택하세요.',
            en: 'You acquired a new symbol! Choose which scoring rule side to apply for this symbol.',
            fr: 'Nouveau symbole acquis ! Choisissez la face de score à appliquer pour cette partie.',
            de: 'Neues Symbol erworben! Wähle die Wertungsseite für dieses Symbol in diesem Spiel.'
        },
        victoryTitle: {
            ko: (name, score) => `🎉 ${name} 승리! (${score}점)`,
            en: (name, score) => `🎉 ${name} Wins! (${score} VP)`,
            fr: (name, score) => `🎉 ${name} gagne ! (${score} PV)`,
            de: (name, score) => `🎉 ${name} gewinnt! (${score} SP)`
        },
        breakdownSymbols: { ko: '기호', en: 'Symbols', fr: 'Symboles', de: 'Symbole' },
        breakdownSet: { ko: '세트', en: 'Set', fr: 'Série', de: 'Set' },
        breakdownCombo: { ko: '콤보', en: 'Combo', fr: 'Combo', de: 'Kombo' },
        breakdownDupl: { ko: '중복', en: 'Dupl', fr: 'Doublon', de: 'Doppelt' },
        faceDownTile: { ko: '뒷면 타일', en: 'Face-down tile', fr: 'Tuile face cachée', de: 'Verdecktes Plättchen' },
        flipHintTitle: {
            ko: (type, desc) => `클릭하여 A/B 규칙 면 뒤집기 (현재 ${type}형)\n${desc}`,
            en: (type, desc) => `Click to flip A/B side (Current Type ${type})\n${desc}`,
            fr: (type, desc) => `Cliquez pour retourner la face A/B (Actuel Type ${type})\n${desc}`,
            de: (type, desc) => `Klicken zum Wenden der A/B-Seite (Aktuell Typ ${type})\n${desc}`
        },
        flipHintShort: { ko: 'A/B 뒤집기', en: 'Flip side', fr: 'Retourner face', de: 'Seite wenden' }
    };

    const SUPPORTED_LANGS = ['en', 'fr', 'de', 'ko'];
    const LANG_BUTTON_TEXT = { en: 'EN', fr: 'FR', de: 'DE', ko: 'KO' };
    const LANG_SWITCH_HEADER = { en: 'EN', fr: 'FR', de: 'DE', ko: '한국어' };

    const SET_BONUSES = [0, 0, 0, 0, 5, 15, 30]; // 0 to 6 distinct symbols

    // Audio SFX using Web Audio API
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playTone(freq, type, duration, gainVal = 0.1) {
        const ctx = getAudioCtx();
        if (!ctx) return;
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (_) {}
    }

    function playSound(type) {
        if (!state.soundEnabled) return;
        if (type === 'select') {
            playTone(480, 'sine', 0.12, 0.08);
        } else if (type === 'match') {
            playTone(560, 'triangle', 0.15, 0.1);
            setTimeout(() => playTone(840, 'triangle', 0.22, 0.1), 100);
        } else if (type === 'combo') {
            [523, 659, 784, 1046].forEach((f, i) => {
                setTimeout(() => playTone(f, 'sine', 0.25, 0.12), i * 80);
            });
        } else if (type === 'flip') {
            playTone(600, 'sine', 0.1, 0.08);
            setTimeout(() => playTone(750, 'sine', 0.15, 0.08), 80);
        } else if (type === 'win') {
            [440, 554, 659, 880].forEach((f, i) => {
                setTimeout(() => playTone(f, 'triangle', 0.35, 0.14), i * 120);
            });
        }
    }

    // State
    const state = {
        lang: 'en',
        soundEnabled: true,
        playerCount: 2, // 2P (Player vs AI)
        scoringMode: 'mixed', // 'A', 'B', 'mixed', or 'custom'
        customRules: { triangle: 'A', trapezoid: 'A', square: 'A', circle: 'A', star: 'A', hexagon: 'A' },
        turn: 1,
        maxTurns: 10,
        activePlayerIndex: 0,
        selectedTile: null,
        gameOver: false,
        players: [],
        boardLayers: [], // 3D pyramid grid
        pendingDraft: null // For modal resolution if 2 new symbols chosen simultaneously
    };

    // Helper: generate full 96 tiles deck
    function createTileDeck() {
        const deck = [];
        let id = 1;
        SYMBOLS.forEach(symbol => {
            COLORS.forEach(color => {
                // 2 of each pair
                for (let copy = 0; copy < 2; copy++) {
                    deck.push({ id: id++, symbol, color });
                }
            });
        });
        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    // Initialize Game
    function initGame(options = {}) {
        state.scoringMode = options.scoringMode || 'mixed';
        if (options.customRules) {
            state.customRules = { ...options.customRules };
        } else if (!state.customRules) {
            state.customRules = { triangle: 'A', trapezoid: 'A', square: 'A', circle: 'A', star: 'A', hexagon: 'A' };
        }
        state.playerCount = options.playerCount || 2;
        state.turn = 1;
        state.activePlayerIndex = 0;
        state.selectedTile = null;
        state.gameOver = false;
        state.pendingDraft = null;

        // Players initialization
        state.players = [];
        for (let i = 0; i < state.playerCount; i++) {
            const isHuman = (i === 0);
            state.players.push({
                id: i,
                name: isHuman ? (I18N_STRINGS.youPlayer[state.lang] || I18N_STRINGS.youPlayer.en) : `AI ${i}`,
                isHuman,
                // Board columns: ordered list of symbol placements { symbol, ruleType: 'A'|'B', tiles: [] }
                columns: [],
                combos: [],
                duplicates: [],
                totalScore: 0
            });
        }

        const deck = createTileDeck();

        // Stacking Setup based on player count (Landscape / 가로형 피라미드)
        // 2P: Layer 0 (가로 6 x 세로 5 = 30장), Layer 1 (가로 5 x 세로 4 = 20장)
        // 3P: Layer 0 (가로 7 x 세로 6 = 42장), Layer 1 (가로 6 x 세로 5 = 30장)
        // 4P: Layer 0 (가로 7 x 세로 6 = 42장), Layer 1 (가로 6 x 세로 5 = 30장), Layer 2 (가로 5 x 세로 4 = 20장)
        let layerConfigs;
        if (state.playerCount === 2) {
            layerConfigs = [
                { rows: 5, cols: 6 }, // Layer 0: 가로 6 x 세로 5
                { rows: 4, cols: 5 }  // Layer 1: 가로 5 x 세로 4 (Top)
            ];
        } else if (state.playerCount === 3) {
            layerConfigs = [
                { rows: 6, cols: 7 }, // Layer 0: 가로 7 x 세로 6
                { rows: 5, cols: 6 }  // Layer 1: 가로 6 x 세로 5 (Top)
            ];
        } else {
            layerConfigs = [
                { rows: 6, cols: 7 }, // Layer 0: 가로 7 x 세로 6
                { rows: 5, cols: 6 }, // Layer 1: 가로 6 x 세로 5
                { rows: 4, cols: 5 }  // Layer 2: 가로 5 x 세로 4 (Top)
            ];
        }

        state.boardLayers = layerConfigs.map((cfg, layerIndex) => {
            const isTopmost = (layerIndex === layerConfigs.length - 1);
            const grid = [];
            for (let r = 0; r < cfg.rows; r++) {
                grid[r] = [];
                for (let c = 0; c < cfg.cols; c++) {
                    const tile = deck.pop();
                    if (tile) {
                        // Topmost layer is always face up. Lower layers randomly 50% face-up
                        const faceUp = isTopmost ? true : (Math.random() < 0.5);
                        grid[r][c] = {
                            ...tile,
                            layer: layerIndex,
                            r,
                            c,
                            faceUp,
                            exists: true
                        };
                    } else {
                        grid[r][c] = null;
                    }
                }
            }
            return { rows: cfg.rows, cols: cfg.cols, grid };
        });

        calculateTileAccessibility();
        render();
    }

    // Accessibility & Visibility Calculation
    function calculateTileAccessibility() {
        // Step 1: determine which lower-layer tiles are covered
        for (let l = 0; l < state.boardLayers.length; l++) {
            const currentLayer = state.boardLayers[l];
            const upperLayer = (l + 1 < state.boardLayers.length) ? state.boardLayers[l + 1] : null;

            for (let r = 0; r < currentLayer.rows; r++) {
                for (let c = 0; c < currentLayer.cols; c++) {
                    const tile = currentLayer.grid[r][c];
                    if (!tile || !tile.exists) continue;

                    let isCovered = false;
                    if (upperLayer) {
                        // In offset brick stacking, upper tile at (ur, uc) covers (ur, uc), (ur, uc+1), (ur+1, uc), (ur+1, uc+1) of current layer
                        // So current tile at (r, c) is covered if any upper tile at:
                        // (r-1, c-1), (r-1, c), (r, c-1), (r, c) exists
                        const checkPositions = [
                            [r - 1, c - 1],
                            [r - 1, c],
                            [r, c - 1],
                            [r, c]
                        ];
                        for (const [ur, uc] of checkPositions) {
                            if (ur >= 0 && ur < upperLayer.rows && uc >= 0 && uc < upperLayer.cols) {
                                if (upperLayer.grid[ur][uc] && upperLayer.grid[ur][uc].exists) {
                                    isCovered = true;
                                    break;
                                }
                            }
                        }
                    }

                    tile.covered = isCovered;

                    // Rule 4: If tile was face-down and is no longer covered, flip face-up immediately!
                    if (!isCovered && !tile.faceUp) {
                        tile.faceUp = true;
                    }
                }
            }
        }

        // Step 2: determine which uncovered & face-up tiles have at least one exposed edge to the outside
        for (let l = 0; l < state.boardLayers.length; l++) {
            const layer = state.boardLayers[l];
            for (let r = 0; r < layer.rows; r++) {
                for (let c = 0; c < layer.cols; c++) {
                    const tile = layer.grid[r][c];
                    if (!tile || !tile.exists) continue;

                    if (tile.covered || !tile.faceUp) {
                        tile.acquirable = false;
                        continue;
                    }

                    // Check orthogonal neighbors on same layer: N, S, E, W
                    // An edge is exposed if neighbor is out of bounds OR empty/removed!
                    const neighbors = [
                        [r - 1, c],
                        [r + 1, c],
                        [r, c - 1],
                        [r, c + 1]
                    ];

                    let hasExposedEdge = false;
                    for (const [nr, nc] of neighbors) {
                        if (nr < 0 || nr >= layer.rows || nc < 0 || nc >= layer.cols) {
                            hasExposedEdge = true;
                            break;
                        }
                        const neighborTile = layer.grid[nr][nc];
                        if (!neighborTile || !neighborTile.exists) {
                            hasExposedEdge = true;
                            break;
                        }
                    }

                    tile.acquirable = hasExposedEdge;
                }
            }
        }
    }

    // Get all currently acquirable tiles
    function getAcquirableTiles() {
        const list = [];
        state.boardLayers.forEach(layer => {
            layer.grid.forEach(row => {
                row.forEach(tile => {
                    if (tile && tile.exists && tile.acquirable) {
                        list.push(tile);
                    }
                });
            });
        });
        return list;
    }

    // Check if tile t2 can be paired with t1
    function canPair(t1, t2) {
        if (!t1 || !t2) return false;
        if (t1.layer === t2.layer && t1.r === t2.r && t1.c === t2.c) return false;
        return (t1.color === t2.color || t1.symbol === t2.symbol);
    }

    // Click handler on tile
    function handleTileClick(tile) {
        if (state.gameOver) return;
        const activePlayer = state.players[state.activePlayerIndex];
        if (!activePlayer.isHuman) return;

        if (!tile || !tile.exists || !tile.acquirable) return;

        // First tile selection
        if (!state.selectedTile) {
            state.selectedTile = tile;
            playSound('select');
            render();
            return;
        }

        // Clicked same tile -> deselect
        if (state.selectedTile.layer === tile.layer && state.selectedTile.r === tile.r && state.selectedTile.c === tile.c) {
            state.selectedTile = null;
            playSound('select');
            render();
            return;
        }

        // Second tile selection -> check pair validity
        if (canPair(state.selectedTile, tile)) {
            const firstTile = state.selectedTile;
            state.selectedTile = null;
            executeDraft(activePlayer, firstTile, tile);
        } else {
            // Not a valid pair -> select new first tile if acquirable
            state.selectedTile = tile;
            playSound('select');
            render();
        }
    }

    // Execute drafted pair
    function executeDraft(player, tile1, tile2) {
        // Remove tiles from board
        state.boardLayers[tile1.layer].grid[tile1.r][tile1.c].exists = false;
        state.boardLayers[tile2.layer].grid[tile2.r][tile2.c].exists = false;

        // Recalculate accessibility & uncoverings
        calculateTileAccessibility();

        // Check Combo (completely identical color and symbol)
        if (tile1.color === tile2.color && tile1.symbol === tile2.symbol) {
            playSound('combo');
            const isNewSymbol = !player.columns.some(col => col.symbol === tile1.symbol);
            if (player.isHuman && isNewSymbol && state.scoringMode === 'mixed') {
                showScoringRuleChoiceModal(tile1.symbol, (ruleType) => {
                    addTileToPlayerBoard(player, tile1, ruleType);
                    player.combos.push(tile2);
                    postTurnCheck();
                });
                return;
            }
            addTileToPlayerBoard(player, tile1);
            player.combos.push(tile2);
            postTurnCheck();
            return;
        }

        playSound('match');

        // Check if both tiles introduce NEW symbols not yet on the player board
        const has1 = player.columns.some(col => col.symbol === tile1.symbol);
        const has2 = player.columns.some(col => col.symbol === tile2.symbol);
        const diffSymbols = (tile1.symbol !== tile2.symbol);

        if (player.isHuman) {
            // Case A: Two DIFFERENT new symbols -> decide order first (Rule 2)
            if (!has1 && !has2 && diffSymbols && player.columns.length < 5) {
                showSymbolOrderModal(tile1, tile2, (firstTile, secondTile) => {
                    if (state.scoringMode === 'mixed') {
                        showScoringRuleChoiceModal(firstTile.symbol, (rule1) => {
                            showScoringRuleChoiceModal(secondTile.symbol, (rule2) => {
                                addTileToPlayerBoard(player, firstTile, rule1);
                                addTileToPlayerBoard(player, secondTile, rule2);
                                postTurnCheck();
                            });
                        });
                    } else {
                        addTileToPlayerBoard(player, firstTile);
                        addTileToPlayerBoard(player, secondTile);
                        postTurnCheck();
                    }
                });
                return;
            }

            // Case B: Same new symbol (e.g. Red Star + Blue Star)
            if (!diffSymbols && !has1 && state.scoringMode === 'mixed') {
                showScoringRuleChoiceModal(tile1.symbol, (rule) => {
                    addTileToPlayerBoard(player, tile1, rule);
                    addTileToPlayerBoard(player, tile2, rule);
                    postTurnCheck();
                });
                return;
            }

            // Case C: Exactly one new symbol
            if (state.scoringMode === 'mixed') {
                if (!has1 && has2) {
                    showScoringRuleChoiceModal(tile1.symbol, (rule) => {
                        addTileToPlayerBoard(player, tile1, rule);
                        addTileToPlayerBoard(player, tile2);
                        postTurnCheck();
                    });
                    return;
                } else if (has1 && !has2) {
                    showScoringRuleChoiceModal(tile2.symbol, (rule) => {
                        addTileToPlayerBoard(player, tile1);
                        addTileToPlayerBoard(player, tile2, rule);
                        postTurnCheck();
                    });
                    return;
                }
            }
        }

        // Normal placement for both tiles
        addTileToPlayerBoard(player, tile1);
        addTileToPlayerBoard(player, tile2);

        postTurnCheck();
    }

    // Place single tile on player board (handles duplicate check and column placement)
    function addTileToPlayerBoard(player, tile, preferredRuleType = null) {
        let col = player.columns.find(c => c.symbol === tile.symbol);

        if (!col) {
            // New symbol column
            if (player.columns.length < 6) {
                let ruleType = 'A';
                if (preferredRuleType) {
                    ruleType = preferredRuleType;
                } else if (state.scoringMode === 'A') {
                    ruleType = 'A';
                } else if (state.scoringMode === 'B') {
                    ruleType = 'B';
                } else if (state.scoringMode === 'custom' && state.customRules && state.customRules[tile.symbol]) {
                    ruleType = state.customRules[tile.symbol];
                } else if (state.scoringMode === 'mixed') {
                    // For AI or fallback
                    ruleType = Math.random() < 0.5 ? 'A' : 'B';
                }
                col = {
                    symbol: tile.symbol,
                    ruleType,
                    tiles: []
                };
                player.columns.push(col);
            }
        }

        if (col) {
            // Duplicate color check on this symbol stack
            const hasDuplicateColor = col.tiles.some(t => t.color === tile.color);
            if (hasDuplicateColor) {
                player.duplicates.push(tile);
            } else {
                col.tiles.push(tile);
            }
        } else {
            // Fallback to duplicate if columns full
            player.duplicates.push(tile);
        }
    }

    // Interactive flip scoring tile
    window.flipPlayerScoringTile = function(playerId, symbol) {
        const player = state.players.find(p => p.id === playerId);
        if (!player || !player.isHuman) return;
        const col = player.columns.find(c => c.symbol === symbol);
        if (!col) return;

        col.ruleType = (col.ruleType === 'A' ? 'B' : 'A');
        playSound('flip');
        calculateScores();
        render();
    };

    // Advance Turn
    function postTurnCheck() {
        calculateScores();

        // Advance active player
        state.activePlayerIndex = (state.activePlayerIndex + 1) % state.playerCount;

        // If cycled back to player 0, advance turn count
        if (state.activePlayerIndex === 0) {
            state.turn++;
        }

        // Check game end: completed 10 turns or board empty
        const acquirables = getAcquirableTiles();
        let legalPairsExist = false;
        for (let i = 0; i < acquirables.length; i++) {
            for (let j = i + 1; j < acquirables.length; j++) {
                if (canPair(acquirables[i], acquirables[j])) {
                    legalPairsExist = true;
                    break;
                }
            }
            if (legalPairsExist) break;
        }

        if (state.turn > state.maxTurns || !legalPairsExist) {
            state.gameOver = true;
            playSound('win');
            calculateScores();
            render();
            showVictoryModal();
            return;
        }

        render();

        // Trigger AI turn if current active player is AI
        const nextPlayer = state.players[state.activePlayerIndex];
        if (!nextPlayer.isHuman && !state.gameOver) {
            setTimeout(executeAiTurn, 700);
        }
    }

    // AI logic
    function executeAiTurn() {
        if (state.gameOver) return;
        const ai = state.players[state.activePlayerIndex];
        if (ai.isHuman) return;

        const acquirables = getAcquirableTiles();
        const candidatePairs = [];

        for (let i = 0; i < acquirables.length; i++) {
            for (let j = i + 1; j < acquirables.length; j++) {
                const t1 = acquirables[i];
                const t2 = acquirables[j];
                if (canPair(t1, t2)) {
                    let weight = 10;
                    // Combo preference
                    if (t1.color === t2.color && t1.symbol === t2.symbol) weight += 50;
                    // Star priority
                    if (t1.symbol === 'star' || t2.symbol === 'star') weight += 20;
                    // Hexagon priority
                    if (t1.symbol === 'hexagon' || t2.symbol === 'hexagon') weight += 15;
                    // Matching existing symbol to build stack
                    if (ai.columns.some(c => c.symbol === t1.symbol)) weight += 10;
                    if (ai.columns.some(c => c.symbol === t2.symbol)) weight += 10;

                    candidatePairs.push({ t1, t2, weight });
                }
            }
        }

        if (candidatePairs.length === 0) {
            postTurnCheck();
            return;
        }

        // Pick highest weighted pair with slight randomness
        candidatePairs.sort((a, b) => b.weight - a.weight);
        const chosen = candidatePairs[0];

        // Animate selection visual briefly
        state.selectedTile = chosen.t1;
        render();

        setTimeout(() => {
            state.selectedTile = null;
            executeDraft(ai, chosen.t1, chosen.t2);
        }, 600);
    }

    // Scoring Engine
    function calculateScores() {
        // Collect star and hexagon stats across all players for majorities
        const starCounts = state.players.map(p => {
            const col = p.columns.find(c => c.symbol === 'star');
            return col ? col.tiles.length : 0;
        });

        const hexCounts = state.players.map(p => {
            const col = p.columns.find(c => c.symbol === 'hexagon');
            return col ? col.tiles.length : 0;
        });

        const maxStars = Math.max(...starCounts);
        const minStars = Math.min(...starCounts);
        const maxHex = Math.max(...hexCounts);

        state.players.forEach((p, pIdx) => {
            let symbolPoints = 0;
            const details = {};

            // 1. Symbol Scoring
            p.columns.forEach((col, colIdx) => {
                const count = col.tiles.length;
                let pts = 0;
                const isTypeA = (col.ruleType === 'A');

                if (col.symbol === 'triangle') {
                    if (isTypeA) {
                        pts = count === 0 ? 0 : (Math.floor((count - 1) / 2) * 10 + 5);
                    } else {
                        pts = count === 0 ? 0 : Math.pow((count % 2 === 1 ? count : count - 1) + 1, 2);
                    }
                } else if (col.symbol === 'trapezoid') {
                    if (isTypeA) {
                        pts = Math.floor(count / 2) * 10;
                    } else {
                        pts = count < 2 ? 0 : Math.pow((count % 2 === 0 ? count : count - 1) + 1, 2);
                    }
                } else if (col.symbol === 'square') {
                    if (isTypeA) {
                        pts = count * p.combos.length;
                    } else {
                        pts = count * p.duplicates.length * 3;
                    }
                } else if (col.symbol === 'circle') {
                    if (isTypeA) {
                        // Max tiles in single color
                        const colorCounts = {};
                        p.columns.forEach(c => c.tiles.forEach(t => {
                            colorCounts[t.color] = (colorCounts[t.color] || 0) + 1;
                        }));
                        p.combos.forEach(t => colorCounts[t.color] = (colorCounts[t.color] || 0) + 1);
                        p.duplicates.forEach(t => colorCounts[t.color] = (colorCounts[t.color] || 0) + 1);
                        const maxColorCount = Math.max(0, ...Object.values(colorCounts));
                        pts = count * maxColorCount;
                    } else {
                        // Tiles in leftmost 1st column
                        const firstCol = p.columns[0];
                        const firstColCount = firstCol ? firstCol.tiles.length : 0;
                        pts = count * firstColCount;
                    }
                } else if (col.symbol === 'star') {
                    const myStars = starCounts[pIdx];
                    if (isTypeA) {
                        // Sole majority 40p, tied majority 20p
                        const tied = starCounts.filter(s => s === maxStars).length > 1;
                        if (myStars === maxStars && myStars > 0) {
                            pts = tied ? 20 : 40;
                        } else {
                            pts = 0;
                        }
                    } else {
                        // Not the fewest
                        const isFewest = (myStars === minStars);
                        pts = !isFewest ? 25 : 0;
                    }
                } else if (col.symbol === 'hexagon') {
                    const myHex = hexCounts[pIdx];
                    if (isTypeA) {
                        // 3/4/5+: 15/30/50p
                        if (myHex >= 5) {
                            pts = 50;
                        } else if (myHex >= 4) {
                            pts = 30;
                        } else if (myHex >= 3) {
                            pts = 15;
                        } else {
                            pts = 0;
                        }
                    } else {
                        // If not the leader
                        pts = (myHex < maxHex) ? (myHex * 6) : 0;
                    }
                }

                col.currentScore = pts;
                symbolPoints += pts;
                details[col.symbol] = pts;
            });

            // 2. Set Collection Bonus
            const distinctCount = p.columns.length;
            const setBonus = SET_BONUSES[distinctCount] || 0;

            // 3. Combos & Duplicates
            const comboPts = p.combos.length * 7;
            const duplicatePts = p.duplicates.length * 2;

            p.totalScore = symbolPoints + setBonus + comboPts + duplicatePts;
            p.scoreBreakdown = {
                symbolPoints,
                setBonus,
                comboPts,
                duplicatePts,
                total: p.totalScore,
                details
            };
        });
    }

    // Modal: symbol order selection dialog
    function showSymbolOrderModal(tile1, tile2, callback) {
        const modal = document.getElementById('choiceModal');
        const container = document.getElementById('choiceOptionsGrid');
        if (!modal || !container) {
            if (callback) callback(tile1, tile2);
            return;
        }

        const lang = state.lang || 'en';
        document.getElementById('choiceModalTitle').textContent = I18N_STRINGS.firstOrderTitle[lang] || I18N_STRINGS.firstOrderTitle.en;
        document.getElementById('choiceModalDesc').textContent = I18N_STRINGS.firstOrderDesc[lang] || I18N_STRINGS.firstOrderDesc.en;
        const subtext = I18N_STRINGS.leftSubtext[lang] || I18N_STRINGS.leftSubtext.en;

        container.innerHTML = `
            <button type="button" class="btn-choice" id="btnOrder1">
                <span style="font-size: 1.8rem; color:${SYMBOL_RULES[tile1.symbol].color};">${SYMBOL_ICONS[tile1.symbol]}</span>
                <span>${(SYMBOL_NAMES[lang] || SYMBOL_NAMES.en)[tile1.symbol]} ${subtext}</span>
            </button>
            <button type="button" class="btn-choice" id="btnOrder2">
                <span style="font-size: 1.8rem; color:${SYMBOL_RULES[tile2.symbol].color};">${SYMBOL_ICONS[tile2.symbol]}</span>
                <span>${(SYMBOL_NAMES[lang] || SYMBOL_NAMES.en)[tile2.symbol]} ${subtext}</span>
            </button>
        `;

        document.getElementById('btnOrder1').onclick = () => {
            modal.classList.remove('active');
            playSound('select');
            if (callback) callback(tile1, tile2);
        };

        document.getElementById('btnOrder2').onclick = () => {
            modal.classList.remove('active');
            playSound('select');
            if (callback) callback(tile2, tile1);
        };

        modal.classList.add('active');
    }

    // Modal: scoring rule choice dialog (Type A vs Type B)
    function showScoringRuleChoiceModal(symbol, callback) {
        const modal = document.getElementById('ruleChoiceModal');
        const container = document.getElementById('ruleChoiceOptionsGrid');
        if (!modal || !container) {
            if (callback) callback('A');
            return;
        }

        const rule = SYMBOL_RULES[symbol];
        const lang = state.lang || 'en';
        const name = (SYMBOL_NAMES[lang] || SYMBOL_NAMES.en)[symbol];

        document.getElementById('ruleChoiceSymbolIcon').innerHTML = `<span style="color:${rule.color};">${rule.icon}</span>`;
        document.getElementById('ruleChoiceModalTitle').textContent = (I18N_STRINGS.ruleChoiceTitle[lang] || I18N_STRINGS.ruleChoiceTitle.en)(rule.icon, name);
        document.getElementById('ruleChoiceModalDesc').textContent = I18N_STRINGS.ruleChoiceDesc[lang] || I18N_STRINGS.ruleChoiceDesc.en;

        container.innerHTML = `
            <button type="button" class="btn-choice rule-select-btn type-a" id="btnRuleChoiceA" style="padding:16px 14px; text-align:left; border-top:4px solid #38bdf8; background:rgba(15, 23, 42, 0.85);">
                <div style="display:flex; align-items:center; margin-bottom:4px;">
                    <span class="guide-rule-tag tag-a" style="font-size:0.75rem; padding:2px 8px;">Type A</span>
                </div>
                <div style="font-size:1rem; font-weight:800; color:#fff; margin:8px 0 4px 0;">${rule.A.short[lang] || rule.A.short.en}</div>
                <div style="font-size:0.76rem; color:#94a3b8; line-height:1.4; word-break:keep-all;">${rule.A.full[lang] || rule.A.full.en}</div>
            </button>
            <button type="button" class="btn-choice rule-select-btn type-b" id="btnRuleChoiceB" style="padding:16px 14px; text-align:left; border-top:4px solid #f472b6; background:rgba(15, 23, 42, 0.85);">
                <div style="display:flex; align-items:center; margin-bottom:4px;">
                    <span class="guide-rule-tag tag-b" style="font-size:0.75rem; padding:2px 8px;">Type B</span>
                </div>
                <div style="font-size:1rem; font-weight:800; color:#fff; margin:8px 0 4px 0;">${rule.B.short[lang] || rule.B.short.en}</div>
                <div style="font-size:0.76rem; color:#94a3b8; line-height:1.4; word-break:keep-all;">${rule.B.full[lang] || rule.B.full.en}</div>
            </button>
        `;

        document.getElementById('btnRuleChoiceA').onclick = () => {
            modal.classList.remove('active');
            playSound('select');
            if (callback) callback('A');
        };

        document.getElementById('btnRuleChoiceB').onclick = () => {
            modal.classList.remove('active');
            playSound('select');
            if (callback) callback('B');
        };

        modal.classList.add('active');
    }

    // Modal: Victory screen
    function showVictoryModal() {
        const modal = document.getElementById('victoryModal');
        const list = document.getElementById('victoryScoresList');
        if (!modal || !list) return;

        const lang = state.lang || 'en';
        const sorted = [...state.players].sort((a, b) => b.totalScore - a.totalScore);
        const winner = sorted[0];

        document.getElementById('victoryWinnerTitle').textContent = (I18N_STRINGS.victoryTitle[lang] || I18N_STRINGS.victoryTitle.en)(winner.name, winner.totalScore);

        const lblSymbols = I18N_STRINGS.breakdownSymbols[lang] || I18N_STRINGS.breakdownSymbols.en;
        const lblSet = I18N_STRINGS.breakdownSet[lang] || I18N_STRINGS.breakdownSet.en;
        const lblCombo = I18N_STRINGS.breakdownCombo[lang] || I18N_STRINGS.breakdownCombo.en;
        const lblDupl = I18N_STRINGS.breakdownDupl[lang] || I18N_STRINGS.breakdownDupl.en;

        list.innerHTML = sorted.map((p, idx) => `
            <div class="score-row ${idx === 0 ? 'winner' : ''}">
                <div>
                    <strong style="font-size: 1.05rem; display:block;">${p.name}</strong>
                    <div class="score-breakdown-details">
                        <span>${lblSymbols}: ${p.scoreBreakdown.symbolPoints}pt</span>
                        <span>${lblSet}: ${p.scoreBreakdown.setBonus}pt</span>
                        <span>${lblCombo}: ${p.scoreBreakdown.comboPts}pt</span>
                        <span>${lblDupl}: ${p.scoreBreakdown.duplicatePts}pt</span>
                    </div>
                </div>
                <div style="font-size: 1.45rem; font-weight: 900; color: var(--gold);">${p.totalScore}</div>
            </div>
        `).join('');

        modal.classList.add('active');
    }

    // Render SVG Symbol
    function renderSymbolSvg(symbol) {
        let path = '';
        if (symbol === 'triangle') {
            path = '<polygon points="50,15 90,85 10,85" class="symbol-shape" />';
        } else if (symbol === 'trapezoid') {
            path = '<polygon points="28,20 72,20 88,80 12,80" class="symbol-shape" />';
        } else if (symbol === 'square') {
            path = '<rect x="18" y="18" width="64" height="64" rx="4" class="symbol-shape" />';
        } else if (symbol === 'circle') {
            path = '<circle cx="50" cy="50" r="36" class="symbol-shape" />';
        } else if (symbol === 'star') {
            path = '<polygon points="50,10 62,38 92,38 68,56 77,85 50,67 23,85 32,56 8,38 38,38" class="symbol-shape" />';
        } else if (symbol === 'hexagon') {
            path = '<polygon points="50,12 85,31 85,69 50,88 15,69 15,31" class="symbol-shape" />';
        }
        return `<svg viewBox="0 0 100 100" class="tile-symbol-svg">${path}</svg>`;
    }

    // DOM Rendering
    function render() {
        const isKo = (state.lang === 'ko');

        const lang = state.lang || 'en';

        // Status bar
        const badge = document.getElementById('turnStatusBadge');
        const activeP = state.players[state.activePlayerIndex];
        if (badge && activeP) {
            badge.className = `status-badge ${activeP.isHuman ? '' : 'ai-turn'}`;
            const turnText = (I18N_STRINGS.turn[lang] || I18N_STRINGS.turn.en)(state.turn, state.maxTurns);
            const playerText = activeP.isHuman ? 
                (I18N_STRINGS.yourTurn[lang] || I18N_STRINGS.yourTurn.en) : 
                (I18N_STRINGS.aiThinking[lang] || I18N_STRINGS.aiThinking.en)(activeP.name);
            badge.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ${turnText} · ${playerText}`;
        }

        // Prompt Banner
        const promptEl = document.getElementById('promptText');
        if (promptEl) {
            if (state.gameOver) {
                promptEl.innerHTML = I18N_STRINGS.gameOverPrompt[lang] || I18N_STRINGS.gameOverPrompt.en;
            } else if (!activeP.isHuman) {
                promptEl.innerHTML = I18N_STRINGS.aiEvaluatingPrompt[lang] || I18N_STRINGS.aiEvaluatingPrompt.en;
            } else if (!state.selectedTile) {
                promptEl.innerHTML = I18N_STRINGS.pickFirstPrompt[lang] || I18N_STRINGS.pickFirstPrompt.en;
            } else {
                const matchC = (COLOR_NAMES[lang] || COLOR_NAMES.en)[state.selectedTile.color] || state.selectedTile.color;
                const matchS = (SYMBOL_NAMES[lang] || SYMBOL_NAMES.en)[state.selectedTile.symbol] || state.selectedTile.symbol;
                promptEl.innerHTML = (I18N_STRINGS.pickSecondPrompt[lang] || I18N_STRINGS.pickSecondPrompt.en)(matchC, matchS);
            }
        }

        // Render 3D Pyramid Board
        renderScoringGuide();
        renderPyramid();

        // Render Personal Boards
        renderPlayers();
    }

    
    function renderScoringGuide() {
        const grid = document.getElementById('scoringGuideGrid');
        if (!grid) return;

        const isKo = (state.lang === 'ko');

        const humanPlayer = state.players ? state.players.find(p => p.isHuman) : null;

        grid.innerHTML = SYMBOLS.map(symbol => {
            const rule = SYMBOL_RULES[symbol];
            const name = SYMBOL_NAMES[state.lang][symbol];
            const humanCol = humanPlayer ? humanPlayer.columns.find(c => c.symbol === symbol) : null;
            let aActive = false;
            let bActive = false;

            if (humanCol) {
                aActive = (humanCol.ruleType === 'A');
                bActive = (humanCol.ruleType === 'B');
            } else if (state.scoringMode === 'A') {
                aActive = true;
            } else if (state.scoringMode === 'B') {
                bActive = true;
            } else if (state.scoringMode === 'custom' && state.customRules) {
                aActive = (state.customRules[symbol] === 'A');
                bActive = (state.customRules[symbol] === 'B');
            }

            return `
                <div class="guide-symbol-card">
                    <div class="guide-symbol-icon" style="color: ${rule.color};">${rule.icon}</div>
                    <div class="guide-symbol-name">${name}</div>
                    <div class="guide-rules-wrap">
                        <div class="guide-rule-pill ${aActive ? 'active' : ''}" title="${rule.A.full[state.lang]}">
                            <span class="guide-rule-tag tag-a">A</span>
                            <span class="guide-rule-text">${rule.A.short[state.lang]}</span>
                        </div>
                        <div class="guide-rule-pill ${bActive ? 'active' : ''}" title="${rule.B.full[state.lang]}">
                            <span class="guide-rule-tag tag-b">B</span>
                            <span class="guide-rule-text">${rule.B.short[state.lang]}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderPyramid() {
        const stage = document.getElementById('pyramidGridWrap');
        if (!stage) return;
        stage.innerHTML = '';

        const tileSize = window.innerWidth <= 768 ? 36 : 46;
        const tileGap = 0; // Seamless tight fit with zero gap, so lower tiles are not visible through cracks
        const stride = tileSize;

        // Base layer offset
        const baseRows = state.boardLayers[0].rows;
        const baseCols = state.boardLayers[0].cols;

        stage.style.width = `${baseCols * stride}px`;
        stage.style.height = `${baseRows * stride}px`;

        state.boardLayers.forEach((layer, lIdx) => {
            // Offset for upper layers in brick style
            const rOffset = (lIdx * stride) / 2;
            const cOffset = (lIdx * stride) / 2;

            for (let r = 0; r < layer.rows; r++) {
                for (let c = 0; c < layer.cols; c++) {
                    const tile = layer.grid[r][c];
                    if (!tile || !tile.exists) continue;

                    const el = document.createElement('div');
                    el.className = `hd-tile tile-color-${tile.color}`;
                    el.style.width = `${tileSize}px`;
                    el.style.height = `${tileSize}px`;
                    el.title = tile.faceUp ? `${(COLOR_NAMES[state.lang] || COLOR_NAMES.en)[tile.color] || tile.color} ${(SYMBOL_NAMES[state.lang] || SYMBOL_NAMES.en)[tile.symbol] || tile.symbol}` : (I18N_STRINGS.faceDownTile[state.lang] || I18N_STRINGS.faceDownTile.en);

                    if (!tile.faceUp) {
                        el.classList.add('face-down');
                    } else {
                        el.innerHTML = renderSymbolSvg(tile.symbol);
                    }

                    if (tile.covered) el.classList.add('covered-tile');
                    if (tile.acquirable) el.classList.add('acquirable');

                    // Selection classes
                    if (state.selectedTile) {
                        if (state.selectedTile.layer === lIdx && state.selectedTile.r === r && state.selectedTile.c === c) {
                            el.classList.add('selected');
                        } else if (tile.acquirable && canPair(state.selectedTile, tile)) {
                            el.classList.add('match-candidate');
                        } else {
                            el.classList.add('disabled');
                        }
                    }

                    const topPx = r * stride + rOffset;
                    const leftPx = c * stride + cOffset;
                    el.style.top = `${topPx}px`;
                    el.style.left = `${leftPx}px`;
                    // Higher layer gets higher z-index
                    el.style.zIndex = lIdx * 10 + 1;

                    if (lIdx > 0) {
                        el.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
                    } else {
                        el.style.boxShadow = 'inset 0 0 0 1px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
                    }

                    el.onclick = () => handleTileClick(tile);

                    stage.appendChild(el);
                }
            }
        });
    }

    function renderPlayers() {
        const container = document.getElementById('playersArea');
        if (!container) return;

        const isKo = (state.lang === 'ko');

        container.innerHTML = state.players.map((p, idx) => {
            const isActive = (idx === state.activePlayerIndex && !state.gameOver);

            // Columns
            let colsHtml = '';
            for (let cIdx = 0; cIdx < 6; cIdx++) {
                const col = p.columns[cIdx];
                const setVal = SET_BONUSES[cIdx + 1];

                if (col) {
                    const icon = SYMBOL_ICONS[col.symbol];
                    const count = col.tiles.length;
                    const pts = col.currentScore || 0;
                    const ruleData = SYMBOL_RULES[col.symbol][col.ruleType];
                    const lines = ruleData.boardLines ? (ruleData.boardLines[state.lang] || ruleData.boardLines.en) : [ruleData.short[state.lang]];
                    const descHtml = lines.map(line => `<span class="pb-rule-line">${line}</span>`).join('');

                    colsHtml += `
                        <div class="pb-symbol-col">
                            <div class="pb-scoring-tile type-${col.ruleType.toLowerCase()} ${p.isHuman ? 'clickable-tile' : ''}" 
                                 title="${p.isHuman ? (I18N_STRINGS.flipHintTitle[state.lang] || I18N_STRINGS.flipHintTitle.en)(col.ruleType, (ruleData.full[state.lang] || ruleData.full.en)) : (ruleData.full[state.lang] || ruleData.full.en)}"
                                 ${p.isHuman ? `onclick="window.flipPlayerScoringTile(${p.id}, '${col.symbol}')"` : ''}>
                                <div class="pb-tile-top">
                                    <span class="pb-rule-badge">${col.ruleType}</span>
                                    ${p.isHuman ? `<span class="pb-flip-hint" title="${I18N_STRINGS.flipHintShort[state.lang] || I18N_STRINGS.flipHintShort.en}"><i class="fa-solid fa-repeat"></i></span>` : ''}
                                    <span class="pb-col-score">${pts} pt</span>
                                </div>
                                <div class="pb-symbol-mark">${icon}</div>
                                <div class="pb-rule-desc">${descHtml}</div>
                            </div>
                            <span class="pb-bonus-indicator">+${setVal} VP</span>
                            <div class="pb-tile-stack">
                                ${col.tiles.map(t => `
                                    <div class="mini-tile tile-color-${t.color}" title="${(COLOR_NAMES[state.lang] || COLOR_NAMES.en)[t.color] || t.color} ${(SYMBOL_NAMES[state.lang] || SYMBOL_NAMES.en)[col.symbol] || col.symbol}">
                                        ${renderSymbolSvg(t.symbol)}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                } else {
                    colsHtml += `
                        <div class="pb-symbol-col empty" style="border-style:dashed; opacity:0.5;">
                            <span style="font-size:0.75rem; color:var(--text-muted); margin-top:20px;">[ ${cIdx + 1} ]</span>
                            <span class="pb-bonus-indicator">+${setVal} VP</span>
                        </div>
                    `;
                }
            }

            return `
                <div class="personal-board-card ${isActive ? 'active-turn' : ''}">
                    <div class="pb-header">
                        <div class="player-info">
                            <div class="player-avatar ${p.isHuman ? 'human' : 'ai'}">${p.isHuman ? 'P' : 'AI'}</div>
                            <span class="player-name">${p.name}</span>
                        </div>
                        <div class="player-score-tag">
                            <i class="fa-solid fa-trophy"></i> ${p.totalScore} VP
                        </div>
                    </div>
                    <div class="pb-main-grid">
                        ${colsHtml}
                        <div class="pb-side-box">
                            <div class="pb-side-header">
                                COMBO
                                <small>7 VP</small>
                            </div>
                            <div class="pb-side-count">${p.combos.length}</div>
                            <div class="pb-side-total">${p.combos.length * 7} pt</div>
                            <div class="pb-tile-stack">
                                ${p.combos.map(t => `<div class="mini-tile tile-color-${t.color}">${renderSymbolSvg(t.symbol)}</div>`).join('')}
                            </div>
                        </div>
                        <div class="pb-side-box">
                            <div class="pb-side-header">
                                DUPLICATE
                                <small>2 VP</small>
                            </div>
                            <div class="pb-side-count">${p.duplicates.length}</div>
                            <div class="pb-side-total">${p.duplicates.length * 2} pt</div>
                            <div class="pb-tile-stack">
                                ${p.duplicates.map(t => `<div class="mini-tile tile-color-${t.color}">${renderSymbolSvg(t.symbol)}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Modal Events
    function setupModalEvents() {
        // Rulebook modal open/close
        const btnRules = document.getElementById('btnRulebook');
        const modalRules = document.getElementById('rulebookModal');
        const closeRules = document.getElementById('closeRulebookModal');
        if (btnRules && modalRules) {
            btnRules.onclick = () => modalRules.classList.add('active');
        }
        if (closeRules && modalRules) {
            closeRules.onclick = () => modalRules.classList.remove('active');
        }

        // Entry page setup & interactions
        const entryPage = document.getElementById('gameEntryPage');
        const entryState = {
            playerCount: 2,
            scoringMode: 'mixed'
        };

        // Player count cards in entry page
        document.querySelectorAll('#entryPlayerCountPicker .entry-choice-card').forEach(card => {
            card.onclick = () => {
                document.querySelectorAll('#entryPlayerCountPicker .entry-choice-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                entryState.playerCount = parseInt(card.dataset.players, 10) || 2;
                playSound('select');
            };
        });

        // Scoring mode cards in entry page
        document.querySelectorAll('#entryScoringModePicker .entry-choice-card').forEach(card => {
            card.onclick = () => {
                document.querySelectorAll('#entryScoringModePicker .entry-choice-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                entryState.scoringMode = card.dataset.mode || 'mixed';
                playSound('select');
            };
        });

        // Start game button on entry page
        const btnEntryStart = document.getElementById('btnEntryStartGame');
        if (btnEntryStart && entryPage) {
            btnEntryStart.onclick = () => {
                playSound('match');
                initGame({ playerCount: entryState.playerCount, scoringMode: entryState.scoringMode });
                entryPage.classList.add('hidden');
            };
        }

        // Open Rulebook from entry page
        const btnEntryRulebook = document.getElementById('btnEntryOpenRulebook');
        if (btnEntryRulebook && modalRules) {
            btnEntryRulebook.onclick = () => modalRules.classList.add('active');
        }

        // Return to entry page (Lobby buttons)
        const btnEntryLobby = document.getElementById('btnEntryLobby');
        const btnTitleLobby = document.getElementById('btnTitleLobby');
        if (btnEntryLobby && entryPage) {
            btnEntryLobby.onclick = () => {
                playSound('select');
                entryPage.classList.remove('hidden');
            };
        }
        if (btnTitleLobby && entryPage) {
            btnTitleLobby.onclick = () => {
                playSound('select');
                entryPage.classList.remove('hidden');
            };
        }

        function cycleLanguage() {
            const idx = SUPPORTED_LANGS.indexOf(state.lang);
            state.lang = SUPPORTED_LANGS[(idx + 1) % SUPPORTED_LANGS.length];
            if (state.players) {
                state.players.forEach(p => {
                    if (p.isHuman) p.name = I18N_STRINGS.youPlayer[state.lang] || I18N_STRINGS.youPlayer.en;
                });
            }
            updateStaticTexts();
            render();
        }

        // Entry page lang button
        const btnEntryLang = document.getElementById('btnEntryLang');
        const btnLang = document.getElementById('btnLangSwitch');
        if (btnEntryLang) {
            btnEntryLang.onclick = cycleLanguage;
        }

        // Entry page sound button
        const btnEntrySound = document.getElementById('btnEntrySound');
        const btnSound = document.getElementById('btnSoundSwitch');
        if (btnEntrySound) {
            btnEntrySound.onclick = () => {
                state.soundEnabled = !state.soundEnabled;
                btnEntrySound.innerHTML = state.soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
                if (btnSound) btnSound.innerHTML = state.soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
            };
        }

        // New game button -> opens entry page for re-setup
        const btnNew = document.getElementById('btnNewGame');
        const modalNew = document.getElementById('newGameModal');
        const closeNew = document.getElementById('closeNewGameModal');
        const btnStart = document.getElementById('btnStartNewGame');

        if (btnNew) {
            btnNew.onclick = () => {
                playSound('select');
                if (entryPage) entryPage.classList.remove('hidden');
                else if (modalNew) modalNew.classList.add('active');
            };
        }
        if (closeNew && modalNew) closeNew.onclick = () => modalNew.classList.remove('active');

        if (btnStart && modalNew) {
            btnStart.onclick = () => {
                const pCount = parseInt(document.getElementById('selectPlayers').value, 10) || 2;
                const sMode = document.getElementById('selectScoringMode').value || 'mixed';
                modalNew.classList.remove('active');
                initGame({ playerCount: pCount, scoringMode: sMode });
            };
        }

        // Restart from victory modal
        const btnAgain = document.getElementById('btnPlayAgain');
        const victoryModal = document.getElementById('victoryModal');
        if (btnAgain && victoryModal) {
            btnAgain.onclick = () => {
                victoryModal.classList.remove('active');
                if (entryPage) entryPage.classList.remove('hidden');
                else initGame({ playerCount: state.playerCount, scoringMode: state.scoringMode });
            };
        }

        // Rulebook Tabs in modal
        document.querySelectorAll('.rule-tab-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.rule-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.rule-tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const target = document.getElementById(btn.dataset.target);
                if (target) target.classList.add('active');
            };
        });

        // Lang switch
        if (btnLang) {
            btnLang.onclick = cycleLanguage;
        }

        // Sound switch
        if (btnSound) {
            btnSound.onclick = () => {
                state.soundEnabled = !state.soundEnabled;
                btnSound.innerHTML = state.soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
                if (btnEntrySound) btnEntrySound.innerHTML = state.soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
            };
        }
    }

    function updateStaticTexts() {
        const lang = state.lang || 'en';
        document.title = (I18N_STRINGS.title[lang] || I18N_STRINGS.title.en);
        if (document.documentElement) document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n-ko]').forEach(el => {
            const val = el.getAttribute(`data-i18n-${lang}`) || el.getAttribute('data-i18n-en') || el.getAttribute('data-i18n-ko');
            if (val) el.innerHTML = val;
        });
        const btnEntryLang = document.getElementById('btnEntryLang');
        if (btnEntryLang) {
            btnEntryLang.textContent = LANG_BUTTON_TEXT[lang] || lang.toUpperCase();
            btnEntryLang.title = `Language: ${lang.toUpperCase()} (Click to switch)`;
        }
        const btnLang = document.getElementById('btnLangSwitch');
        if (btnLang) {
            btnLang.textContent = LANG_SWITCH_HEADER[lang] || lang.toUpperCase();
            btnLang.title = `Language: ${lang.toUpperCase()} (Click to switch)`;
        }
    }

    // Startup
    window.addEventListener('DOMContentLoaded', () => {
        setupModalEvents();
        updateStaticTexts();
        initGame({ playerCount: 2, scoringMode: 'mixed' });

        // Auto-skip entry page if URL has #play or ?play=1
        if (window.location.hash.includes('play') || window.location.search.includes('play=1')) {
            const entryPage = document.getElementById('gameEntryPage');
            if (entryPage) entryPage.classList.add('hidden');
        }
    });

})();
