(function () {
    'use strict';

    // Slaves, Arise! (노비여, 일어나라!)
    // Dual-ended cards: Low [1, 2, 3, 4] <-> High [5, 6, 7, 8, 9, 0]
    // 24 unique pairs x 3 copies = 72 cards

    const LOW_NUMS = [1, 2, 3, 4];
    const HIGH_NUMS = [5, 6, 7, 8, 9, 0];

    const SPECIAL_INFO = {
        1: { name: { ko: '양도 (Give)', en: 'Give Card' }, desc: { ko: '내 손패 1장을 다른 플레이어에게 넘길 수 있습니다.', en: 'Give 1 card from hand to another player.' }, icon: 'fa-arrow-up' },
        5: { name: { ko: '전원 반전 (Flip All)', en: 'Flip All' }, desc: { ko: '지목한 플레이어의 손패 전체를 뒤집습니다.', en: 'Target player flips all cards in hand.' }, icon: 'fa-rotate' },
        8: { name: { ko: '자가 반전 (Flip One)', en: 'Flip One' }, desc: { ko: '내 손패 1장을 즉시 뒤집을 수 있습니다.', en: 'Flip 1 card in your own hand.' }, icon: 'fa-repeat' },
        0: { name: { ko: '필살 10 (Beats 9)', en: 'Beats 9 as 10' }, desc: { ko: '9 위에 내면 10으로 취급되며 트릭을 즉시 승리합니다.', en: 'Beats 9 as 10 and immediately wins trick.' }, icon: 'fa-bolt' }
    };

    function buildMasterDeck() {
        const deck = [];
        let idCounter = 1;
        for (let copy = 0; copy < 3; copy++) {
            for (const low of LOW_NUMS) {
                for (const high of HIGH_NUMS) {
                    // Random 50% initial orientation
                    const flip = Math.random() < 0.5;
                    const top = flip ? high : low;
                    const bottom = flip ? low : high;
                    deck.push({
                        id: idCounter++,
                        top,
                        bottom,
                        low,
                        high
                    });
                }
            }
        }
        return deck;
    }

    // Audio SFX
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    function playTone(freq, type = 'sine', duration = 0.15, gain = 0.1) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gainNode.gain.setValueAtTime(gain, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    }

    function playSound(type) {
        if (!state.soundEnabled) return;
        switch (type) {
            case 'play':
                playTone(440, 'sine', 0.1, 0.12);
                setTimeout(() => playTone(660, 'sine', 0.12, 0.1), 60);
                break;
            case 'flip':
                playTone(350, 'triangle', 0.08, 0.15);
                setTimeout(() => playTone(500, 'triangle', 0.1, 0.12), 50);
                break;
            case 'pass':
                playTone(280, 'sine', 0.12, 0.08);
                break;
            case 'super_ten':
                playTone(523.25, 'square', 0.15, 0.15);
                setTimeout(() => playTone(783.99, 'square', 0.2, 0.15), 100);
                setTimeout(() => playTone(1046.50, 'square', 0.35, 0.18), 200);
                break;
            case 'special':
                playTone(600, 'sine', 0.1, 0.12);
                setTimeout(() => playTone(900, 'sine', 0.18, 0.12), 80);
                break;
            case 'win':
                [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                    setTimeout(() => playTone(f, 'triangle', 0.25, 0.15), i * 140);
                });
                break;
        }
    }

    function shuffle(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // Global Game State
    const state = {
        lang: 'en',
        soundEnabled: true,
        playerCount: 4,
        gameMode: 'ai', // 'ai' or 'pvp'
        players: [],
        currentTurnPlayerId: 0,
        currentTrick: {
            leadPlayerId: 0,
            currentWinnerId: null,
            cardCount: 0,      // 1, 2, or 3
            currentValue: -1,  // 0 to 10
            plays: []
        },
        selectedCardIds: new Set(),
        phase: 'play', // 'play', 'special_1_give', 'special_5_target', 'special_8_flip', 'loser_flip', 'curtain', 'game_over'
        pendingLoserFlips: [],
        winnerRanks: [],
        historyLogs: []
    };

    function addLog(msgKo, msgEn) {
        state.historyLogs.unshift({
            ko: msgKo,
            en: msgEn,
            time: new Date().toLocaleTimeString()
        });
        if (state.historyLogs.length > 20) state.historyLogs.pop();
    }

    function initGame(options = {}) {
        state.playerCount = options.playerCount || 4;
        state.gameMode = options.gameMode || 'ai';
        state.selectedCardIds.clear();
        state.phase = 'play';
        state.pendingLoserFlips = [];
        state.winnerRanks = [];
        state.historyLogs = [];

        const master = shuffle(buildMasterDeck());
        state.players = [];

        for (let i = 0; i < state.playerCount; i++) {
            const isHuman = (state.gameMode === 'pvp') ? true : (i === 0);
            let name = '';
            if (state.gameMode === 'pvp') {
                name = (state.lang === 'ko') ? `플레이어 ${i + 1}` : `Player ${i + 1}`;
            } else {
                name = (i === 0) ? ((state.lang === 'ko') ? '나 (노비 탈출자)' : 'You') : `AI ${i}`;
            }

            // Deal exactly 12 cards as per rulebook
            const hand = master.splice(0, 12);
            sortHand(hand);

            state.players.push({
                id: i,
                name,
                isHuman,
                hand,
                passed: false,
                rank: null
            });
        }

        // Random starting player
        state.currentTurnPlayerId = Math.floor(Math.random() * state.playerCount);
        resetTrick(state.currentTurnPlayerId);

        addLog(
            `새 게임이 시작되었습니다! ${state.players[state.currentTurnPlayerId].name}부터 선(Lead)으로 카드를 냅니다.`,
            `New game started! ${state.players[state.currentTurnPlayerId].name} leads the first trick.`
        );

        render();
        playSound('play');

        checkAiTurn();
    }

    function resetTrick(leaderId) {
        state.currentTrick = {
            leadPlayerId: leaderId,
            currentWinnerId: null,
            cardCount: 0,
            currentValue: -1,
            plays: []
        };
        state.players.forEach(p => p.passed = false);
        state.currentTurnPlayerId = leaderId;
    }

        // Card Sorting Comparator (Ascending by top, then ascending by bottom)
    function sortCardComparator(a, b) {
        if (a.top !== b.top) {
            return a.top - b.top;
        }
        return a.bottom - b.bottom;
    }

    function sortHand(hand) {
        if (!hand || !Array.isArray(hand)) return hand;
        return hand.sort(sortCardComparator);
    }

    // Card Flip Utility
    function flipCard(card) {
        const temp = card.top;
        card.top = card.bottom;
        card.bottom = temp;
    }

    // Validation: Can player play selected cards?
    function getSelectedCards(player) {
        return player.hand.filter(c => state.selectedCardIds.has(c.id));
    }

    function canPlayCombination(cards) {
        if (!cards || cards.length < 1 || cards.length > 3) return false;

        // All selected cards must have the exact same top number
        const topNum = cards[0].top;
        if (!cards.every(c => c.top === topNum)) return false;

        const count = cards.length;
        const trick = state.currentTrick;

        // If leading trick (no cards played yet)
        if (trick.cardCount === 0) {
            return true; // Any single, pair, or triple
        }

        // Must match exact card count of the current trick
        if (count !== trick.cardCount) return false;

        // Special 0 played after 9 rule (PDF 1 Page 3)
        // If current top play is 9, 0 is treated as 10 (highest card)
        if (trick.currentValue === 9 && topNum === 0) {
            return true; // Beats 9 as Super Ten!
        }

        // Normal play: top number must be strictly higher than current trick value
        return topNum > trick.currentValue;
    }

    // Play action
    function executePlay(player, cards) {
        const count = cards.length;
        const topNum = cards[0].top;
        const isSuperTen = (state.currentTrick.currentValue === 9 && topNum === 0);
        const playVal = isSuperTen ? 10 : topNum;

        // Remove from hand
        const cardIds = new Set(cards.map(c => c.id));
        player.hand = player.hand.filter(c => !cardIds.has(c.id));
        state.selectedCardIds.clear();

        // Update trick
        state.currentTrick.cardCount = count;
        state.currentTrick.currentValue = playVal;
        state.currentTrick.currentWinnerId = player.id;
        state.currentTrick.plays.push({
            playerId: player.id,
            cards: [...cards],
            value: playVal,
            isSuperTen
        });

        playSound(isSuperTen ? 'super_ten' : 'play');

        const cardName = isSuperTen ? 
            ((state.lang === 'ko') ? `필살 0 (10으로 변환!)` : `Super 0 (Beats 9 as 10!)`) : 
            `${topNum}번`;

        addLog(
            `${player.name}님이 ${cardName} ${count}장을 냈습니다.`,
            `${player.name} played ${count}x #${cardName}.`
        );

        // Check if player emptied hand
        if (player.hand.length === 0 && player.rank === null) {
            player.rank = state.winnerRanks.length + 1;
            state.winnerRanks.push(player.id);
            addLog(
                `🎉 ${player.name}님이 손패를 모두 털어내고 탈출에 성공했습니다! (${player.rank}등)`,
                `🎉 ${player.name} emptied their hand and escaped! (${player.rank}th place)`
            );
            playSound('win');

            // First player to shed all cards wins!
            state.phase = 'game_over';
            render();
            showVictoryModal();
            return;
        }

        // Immediate trick win by 0 on 9!
        if (isSuperTen) {
            addLog(
                `⚡ 9 위에 0이 나와 즉시 트릭 승리자가 되었습니다!`,
                `⚡ 0 played on 9! Instant trick victory!`
            );
            handleTrickEnd(player.id);
            return;
        }

        // Check Special Abilities of played number (PDF 1 Page 3 Item 4)
        if (topNum === 1 || topNum === 5 || topNum === 8) {
            triggerSpecialAbility(player, topNum);
            return;
        }

        advanceTurn();
    }

    function executePass(player) {
        player.passed = true;
        playSound('pass');
        addLog(
            `${player.name}님이 패스했습니다.`,
            `${player.name} passed.`
        );

        // Check if trick is won (all other active players passed)
        const unpassed = state.players.filter(p => !p.passed && p.hand.length > 0);
        if (unpassed.length <= 1) {
            const winnerId = state.currentTrick.currentWinnerId !== null ? 
                state.currentTrick.currentWinnerId : 
                state.currentTrick.leadPlayerId;
            handleTrickEnd(winnerId);
        } else {
            advanceTurn();
        }
    }

    function advanceTurn() {
        let nextId = (state.currentTurnPlayerId + 1) % state.playerCount;
        let loops = 0;
        while ((state.players[nextId].passed || state.players[nextId].hand.length === 0) && loops < state.playerCount) {
            nextId = (nextId + 1) % state.playerCount;
            loops++;
        }

        if (loops >= state.playerCount || nextId === state.currentTrick.currentWinnerId) {
            handleTrickEnd(state.currentTrick.currentWinnerId);
            return;
        }

        state.currentTurnPlayerId = nextId;
        render();

        if (state.gameMode === 'pvp' && state.players[nextId].isHuman) {
            showPassCurtainModal(
                `${state.players[nextId].name}님의 차례입니다.`,
                (state.lang === 'ko') ? `기기를 건네받은 후 [준비 완료]를 눌러주세요.` : `Pass device and click Ready.`,
                () => checkAiTurn()
            );
        } else {
            checkAiTurn();
        }
    }

    // Trigger Special Abilities (1, 5, 8)
    function triggerSpecialAbility(player, num) {
        if (num === 1) {
            // Give 1 card from hand to an opponent
            if (player.hand.length === 0) {
                advanceTurn();
                return;
            }
            if (player.isHuman) {
                state.phase = 'special_1_give';
                state.selectedCardIds.clear();
                addLog(
                    `[특수능력 1] 상대에게 넘겨줄 손패 카드 1장을 선택한 후 대상 플레이어를 클릭하세요. (양도하지 않으려면 [양도 건너뛰기] 클릭)`,
                    `[Ability 1] Choose 1 card from hand to give, then click the target player.`
                );
                render();
            } else {
                // AI chooses worst card (lowest value) and gives to leading/strongest opponent
                const sorted = [...player.hand].sort((a, b) => a.top - b.top);
                const cardToGive = sorted[0];
                const opponents = state.players.filter(p => p.id !== player.id && p.hand.length > 0);
                opponents.sort((a, b) => a.hand.length - b.hand.length); // target with least cards
                const target = opponents[0] || state.players[0];

                player.hand = player.hand.filter(c => c.id !== cardToGive.id);
                target.hand.push(cardToGive);
                sortHand(player.hand);
                sortHand(target.hand);
                playSound('special');
                addLog(
                    `[특수능력 1] ${player.name}님이 ${target.name}님에게 카드 1장을 양도했습니다!`,
                    `[Ability 1] ${player.name} gave 1 card to ${target.name}!`
                );
                if (player.hand.length === 0 && player.rank === null) {
                    player.rank = state.winnerRanks.length + 1;
                    state.winnerRanks.push(player.id);
                    addLog(
                        `🎉 ${player.name}님이 손패를 모두 털어내고 탈출에 성공했습니다! (${player.rank}등)`,
                        `🎉 ${player.name} emptied their hand and escaped! (${player.rank}th place)`
                    );
                    playSound('win');
                    state.phase = 'game_over';
                    render();
                    showVictoryModal();
                    return;
                }
                advanceTurn();
            }
        } else if (num === 5) {
            // Choose a player to flip ALL their hand cards
            if (player.isHuman) {
                state.phase = 'special_5_target';
                addLog(
                    `[특수능력 5] 손패 전체를 뒤집을 대상 플레이어를 선택하세요. (뒤집지 않으려면 [반전 건너뛰기] 클릭)`,
                    `[Ability 5] Choose a target player to flip all their hand cards.`
                );
                render();
            } else {
                // AI targets opponent with lowest hand count or human
                const opponents = state.players.filter(p => p.id !== player.id && p.hand.length > 0);
                opponents.sort((a, b) => a.hand.length - b.hand.length);
                const target = opponents[0] || state.players[0];

                target.hand.forEach(flipCard);
            sortHand(target.hand);
                playSound('special');
                addLog(
                    `[특수능력 5] ${player.name}님이 ${target.name}님의 손패 전체를 뒤집었습니다!`,
                    `[Ability 5] ${player.name} flipped ALL hand cards of ${target.name}!`
                );
                advanceTurn();
            }
        } else if (num === 8) {
            // Flip 1 card in own hand
            if (player.hand.length === 0) {
                advanceTurn();
                return;
            }
            if (player.isHuman) {
                state.phase = 'special_8_flip';
                addLog(
                    `[특수능력 8] 내 손패 중 뒤집을 카드 1장을 클릭하세요. (뒤집지 않으려면 [반전 건너뛰기] 클릭)`,
                    `[Ability 8] Click 1 card in hand to flip, or click [Skip Flip Ability].`
                );
                render();
            } else {
                // AI flips lowest card if bottom > top, else skips
                const canImprove = player.hand.filter(c => c.bottom > c.top);
                if (canImprove.length > 0) {
                    canImprove.sort((a, b) => (b.bottom - b.top) - (a.bottom - a.top));
                    flipCard(canImprove[0]);
                    sortHand(player.hand);
                    playSound('flip');
                    addLog(
                        `[특수능력 8] ${player.name}님이 자신의 손패 카드 1장을 뒤집었습니다.`,
                        `[Ability 8] ${player.name} flipped 1 card in their hand.`
                    );
                } else {
                    addLog(
                        `[특수능력 8] ${player.name}님은 카드를 뒤집지 않고 유지했습니다.`,
                        `[Ability 8] ${player.name} chose not to flip any card in hand.`
                    );
                }
                advanceTurn();
            }
        }
    }

    // Trick Resolution & Loser Flips (PDF 1 Page 3 Item 3)
    function handleTrickEnd(winnerId) {
        const winner = state.players[winnerId];
        addLog(
            `🏆 ${winner.name}님이 트릭을 승리했습니다!`,
            `🏆 ${winner.name} won the trick!`
        );

        // Losers eligible to flip 1 card
        const losers = state.players.filter(p => p.id !== winnerId && p.hand.length > 0);

        if (losers.length === 0) {
            resetTrick(winnerId);
            render();
            checkAiTurn();
            return;
        }

        // Trigger loser flip phase
        state.phase = 'loser_flip';
        state.pendingLoserFlips = losers.map(l => l.id);

        addLog(
            `패자 뒤집기: 트릭에서 진 플레이어들은 각자 손패 1장을 뒤집습니다.`,
            `The Losers Flip: Players who lost the trick flip 1 card in their hand.`
        );

        render();
        processNextLoserFlip(winnerId);
    }

    function processNextLoserFlip(trickWinnerId) {
        if (state.pendingLoserFlips.length === 0) {
            // All flips resolved, winner leads next trick!
            state.phase = 'play';
            resetTrick(trickWinnerId);
            render();
            checkAiTurn();
            return;
        }

        const nextLoserId = state.pendingLoserFlips[0];
        const loser = state.players[nextLoserId];

        if (loser.isHuman) {
            // Prompt human to pick a card to flip or skip
            render();
        } else {
            // AI chooses best card to flip (only if bottom > top)
            const canImprove = loser.hand.filter(c => c.bottom > c.top);
            if (canImprove.length > 0) {
                canImprove.sort((a, b) => (b.bottom - b.top) - (a.bottom - a.top));
                flipCard(canImprove[0]);
                sortHand(loser.hand);
                playSound('flip');
                addLog(
                    `패자 뒤집기: ${loser.name}님이 카드 1장을 뒤집었습니다.`,
                    `Loser Flip: ${loser.name} flipped a card.`
                );
            } else {
                addLog(
                    `패자 뒤집기: ${loser.name}님은 카드를 뒤집지 않고 유지했습니다.`,
                    `Loser Flip: ${loser.name} chose to keep hand without flipping.`
                );
            }
            state.pendingLoserFlips.shift();
            processNextLoserFlip(trickWinnerId);
        }
    }

    // AI Heuristic Turn Decision
    function checkAiTurn() {
        if (state.phase !== 'play') return;

        const curPlayer = state.players[state.currentTurnPlayerId];
        if (!curPlayer || curPlayer.isHuman || curPlayer.hand.length === 0) return;

        setTimeout(() => {
            if (state.phase !== 'play') return;
            aiDecidePlay(curPlayer);
        }, 600);
    }

    function aiDecidePlay(ai) {
        const trick = state.currentTrick;
        const hand = ai.hand;

        // Group cards by top number
        const groups = {};
        hand.forEach(c => {
            groups[c.top] = groups[c.top] || [];
            groups[c.top].push(c);
        });

        // 1. If leading
        if (trick.cardCount === 0) {
            // Prefer playing pairs or triples first, or lowest single
            const availableNums = Object.keys(groups).map(Number).sort((a, b) => a - b);

            // Find best combo
            let chosenCards = null;
            // Check for triple
            for (const n of availableNums) {
                if (groups[n].length >= 3) {
                    chosenCards = groups[n].slice(0, 3);
                    break;
                }
            }
            // Check for pair
            if (!chosenCards) {
                for (const n of availableNums) {
                    if (groups[n].length >= 2) {
                        chosenCards = groups[n].slice(0, 2);
                        break;
                    }
                }
            }
            // Otherwise single lowest (skip 0 unless only choice)
            if (!chosenCards) {
                const nonZero = availableNums.filter(n => n !== 0);
                const pickNum = nonZero.length > 0 ? nonZero[0] : availableNums[0];
                chosenCards = [groups[pickNum][0]];
            }

            executePlay(ai, chosenCards);
            return;
        }

        // 2. Following play: must match trick.cardCount and beat trick.currentValue
        const count = trick.cardCount;
        const curVal = trick.currentValue;

        // Check if we can play 0 as 10 on 9
        if (curVal === 9 && groups[0] && groups[0].length >= count) {
            executePlay(ai, groups[0].slice(0, count));
            return;
        }

        // Find candidate numbers strictly higher than curVal
        const validNums = Object.keys(groups)
            .map(Number)
            .filter(n => n > curVal && groups[n].length >= count)
            .sort((a, b) => a - b);

        if (validNums.length > 0) {
            // Play lowest valid match
            const pickNum = validNums[0];
            executePlay(ai, groups[pickNum].slice(0, count));
        } else {
            // Pass
            executePass(ai);
        }
    }

    // Render Helpers
    function renderCardMarkup(card, options = {}) {
        const isSelected = options.isSelected || false;
        const isInteractive = options.interactive || false;
        const isMini = options.mini || false;
        const isLoserFlipTarget = (state.phase === 'loser_flip' && options.canLoserFlip);
        const isSpecialTarget = (state.phase === 'special_8_flip' && options.canSpecialFlip);
        const isSpecialGiveTarget = (state.phase === 'special_1_give' && options.canSpecialGive);

        let classes = 'slave-card';
        if (isSelected) classes += ' selected';
        if (isInteractive) classes += ' interactive';
        if (isMini) classes += ' mini-card';
        if (isLoserFlipTarget || isSpecialTarget) classes += ' flip-highlight';
        if (isSpecialGiveTarget) classes += ' give-highlight';

        const topSpecial = SPECIAL_INFO[card.top];
        const bottomSpecial = SPECIAL_INFO[card.bottom];

        return `
            <div class="${classes}" data-card-id="${card.id}">
                <!-- Top active number -->
                <div class="card-side side-top num-${card.top}">
                    <span class="card-num-main">${card.top}</span>
                    ${topSpecial ? `<span class="card-badge-special"><i class="fa-solid ${topSpecial.icon}"></i></span>` : ''}
                </div>
                <!-- Card middle divider with flip indicator -->
                <div class="card-divider">
                    <span class="divider-line"></span>
                    <span class="divider-icon"><i class="fa-solid fa-arrows-up-down"></i></span>
                    <span class="divider-line"></span>
                </div>
                <!-- Bottom inactive number (upside down) -->
                <div class="card-side side-bottom num-${card.bottom}">
                    <span class="card-num-sub">${card.bottom}</span>
                    ${bottomSpecial ? `<span class="card-sub-special"><i class="fa-solid ${bottomSpecial.icon}"></i></span>` : ''}
                </div>
            </div>
        `;
    }

    function renderTrickArea() {
        const area = document.getElementById('trickTableArea');
        if (!area) return;

        const isKo = (state.lang === 'ko');
        const trick = state.currentTrick;

        let content = '';
        if (trick.plays.length === 0) {
            const leader = state.players[trick.leadPlayerId];
            content = `
                <div class="trick-empty-placeholder">
                    <i class="fa-solid fa-hand-holding" style="font-size:2rem; color:var(--text-muted); margin-bottom:8px;"></i>
                    <p>${leader ? leader.name : ''}${isKo ? '님이 새로운 트릭을 시작할 카드를 냅니다 (1~3장).' : ' leads a new trick (1~3 cards).'}</p>
                </div>
            `;
        } else {
            content = `
                <div class="trick-plays-row">
                    ${trick.plays.map((p, idx) => {
                        const player = state.players[p.playerId];
                        const isLatest = (idx === trick.plays.length - 1);
                        return `
                            <div class="trick-play-slot ${isLatest ? 'latest' : ''}">
                                <div class="play-slot-header">
                                    <span class="play-player-name">${player.name}</span>
                                    ${p.isSuperTen ? `<span class="super-ten-tag">★ 필살 10</span>` : ''}
                                </div>
                                <div class="play-cards-group">
                                    ${p.cards.map(c => renderCardMarkup(c, { mini: true })).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        area.innerHTML = content;
    }

    function renderHand() {
        const handContainer = document.getElementById('handCardsRow');
        const btnPlay = document.getElementById('btnPlayCards');
        const btnPass = document.getElementById('btnPassTurn');
        const btnSkip = document.getElementById('btnSkipAction');
        const btnSkipLabel = document.getElementById('btnSkipActionLabel');
        const actionInfo = document.getElementById('playActionInfo');
        if (!handContainer || !btnPlay || !btnPass) return;

        const isKo = (state.lang === 'ko');
        const activePlayer = state.players[state.currentTurnPlayerId];

        // Is it active player's turn to interact?
        const isHumanTurn = activePlayer && activePlayer.isHuman && state.phase === 'play';
        const isLoserFlipPhase = (state.phase === 'loser_flip' && state.pendingLoserFlips.length > 0 && state.players[state.pendingLoserFlips[0]].isHuman);
        const isSpecialFlipPhase = (state.phase === 'special_8_flip' && activePlayer && activePlayer.isHuman);
        const isSpecialGivePhase = (state.phase === 'special_1_give' && activePlayer && activePlayer.isHuman);
        const isSpecialTargetPhase = (state.phase === 'special_5_target' && activePlayer && activePlayer.isHuman);

        const displayPlayer = (state.gameMode === 'pvp') ? 
            (isLoserFlipPhase ? state.players[state.pendingLoserFlips[0]] : activePlayer) : 
            state.players[0];

        if (displayPlayer && displayPlayer.hand) {
            sortHand(displayPlayer.hand);
        }

        handContainer.innerHTML = '';

        if (!displayPlayer || displayPlayer.hand.length === 0) {
            handContainer.innerHTML = `<div style="color:var(--text-muted); padding:16px;">${isKo ? '손패를 모두 비웠습니다!' : 'Hand empty!'}</div>`;
            btnPlay.disabled = true;
            btnPass.disabled = true;
            return;
        }

        displayPlayer.hand.forEach(c => {
            const isSel = state.selectedCardIds.has(c.id);
            const cardEl = document.createElement('div');
            cardEl.innerHTML = renderCardMarkup(c, {
                isSelected: isSel,
                interactive: isHumanTurn || isLoserFlipPhase || isSpecialFlipPhase || isSpecialGivePhase,
                canLoserFlip: isLoserFlipPhase,
                canSpecialFlip: isSpecialFlipPhase,
                canSpecialGive: isSpecialGivePhase
            });

            const domCard = cardEl.firstElementChild;

            // Click handling
            domCard.onclick = () => {
                if (isLoserFlipPhase) {
                    // Execute loser flip on this card
                    flipCard(c);
                    sortHand(displayPlayer.hand);
                    playSound('flip');
                    addLog(
                        `패자 뒤집기: ${displayPlayer.name}님이 #${c.bottom}번 카드를 뒤집어 #${c.top}번으로 만들었습니다!`,
                        `Loser Flip: ${displayPlayer.name} flipped card to #${c.top}!`
                    );
                    state.pendingLoserFlips.shift();
                    processNextLoserFlip(state.currentTrick.currentWinnerId);
                    return;
                }

                if (isSpecialFlipPhase) {
                    flipCard(c);
                    sortHand(displayPlayer.hand);
                    playSound('flip');
                    addLog(
                        `[특수능력 8] ${displayPlayer.name}님이 #${c.top}번 카드로 자가 반전했습니다!`,
                        `[Ability 8] ${displayPlayer.name} flipped card to #${c.top}!`
                    );
                    state.phase = 'play';
                    advanceTurn();
                    return;
                }

                if (isSpecialGivePhase) {
                    if (state.selectedCardIds.has(c.id)) {
                        state.selectedCardIds.delete(c.id);
                    } else {
                        state.selectedCardIds.clear();
                        state.selectedCardIds.add(c.id);
                    }
                    playSound('play');
                    render();
                    return;
                }

                if (isHumanTurn) {
                    if (state.selectedCardIds.has(c.id)) {
                        state.selectedCardIds.delete(c.id);
                    } else {
                        // If selecting a card with a different top number than already selected, clear previous
                        const selected = getSelectedCards(displayPlayer);
                        if (selected.length > 0 && selected[0].top !== c.top) {
                            state.selectedCardIds.clear();
                        }
                        // Max 3 cards
                        if (state.selectedCardIds.size < 3) {
                            state.selectedCardIds.add(c.id);
                        }
                    }
                    renderHand();
                }
            };

            handContainer.appendChild(domCard);
        });

        // Controls update
        const selectedCards = getSelectedCards(displayPlayer);
        const canPlay = isHumanTurn && canPlayCombination(selectedCards);

        btnPlay.disabled = !canPlay;
        // Cannot pass if leading a fresh trick
        btnPass.disabled = !isHumanTurn || (state.currentTrick.cardCount === 0);

        if (btnSkip) {
            if (isLoserFlipPhase) {
                btnSkip.style.display = 'inline-flex';
                btnSkip.disabled = false;
                if (btnSkipLabel) btnSkipLabel.textContent = isKo ? '뒤집지 않고 건너뛰기' : 'Skip Flip (Keep Cards)';
            } else if (isSpecialGivePhase) {
                btnSkip.style.display = 'inline-flex';
                btnSkip.disabled = false;
                if (btnSkipLabel) btnSkipLabel.textContent = isKo ? '양도 건너뛰기' : 'Skip Give Ability';
            } else if (isSpecialTargetPhase) {
                btnSkip.style.display = 'inline-flex';
                btnSkip.disabled = false;
                if (btnSkipLabel) btnSkipLabel.textContent = isKo ? '반전 건너뛰기' : 'Skip Flip All Ability';
            } else if (isSpecialFlipPhase) {
                btnSkip.style.display = 'inline-flex';
                btnSkip.disabled = false;
                if (btnSkipLabel) btnSkipLabel.textContent = isKo ? '반전 건너뛰기' : 'Skip Flip Ability';
            } else {
                btnSkip.style.display = 'none';
                btnSkip.disabled = true;
            }
        }

        if (isLoserFlipPhase) {
            actionInfo.innerHTML = `<span style="color:var(--gold); font-weight:bold;">${isKo ? '패자 뒤집기: 손패에서 뒤집을 카드 1장을 클릭하거나, [뒤집지 않고 건너뛰기]를 누르세요!' : 'Loser Flip: Click 1 card in hand to flip, or click [Skip Flip] to keep cards!'}</span>`;
        } else if (isSpecialFlipPhase) {
            actionInfo.innerHTML = `<span style="color:#ec4899; font-weight:bold;">${isKo ? '특수 8 반전: 뒤집을 카드 1장을 클릭하거나, [반전 건너뛰기]를 누르세요!' : 'Special 8: Click 1 card to flip, or click [Skip Flip] to keep cards!'}</span>`;
        } else if (state.phase === 'special_5_target') {
            actionInfo.innerHTML = `<span style="color:#10b981; font-weight:bold;">${isKo ? '특수 5 발동: 우측에서 대상을 클릭하거나, [반전 건너뛰기]를 누르세요!' : 'Special 5: Choose a target player on the right, or click [Skip Flip All]!'}</span>`;
        } else if (state.phase === 'special_1_give') {
            const selected = getSelectedCards(displayPlayer);
            if (selected.length === 0) {
                actionInfo.innerHTML = `<span style="color:#f59e0b; font-weight:bold;">${isKo ? '🎁 특수 1 발동: 넘겨줄 손패 카드를 선택 후 대상을 클릭하거나, [양도 건너뛰기]를 누르세요.' : '🎁 Special 1: Click 1 card in hand to give, or click [Skip Give]!'}</span>`;
            } else {
                actionInfo.innerHTML = `<span style="color:#10b981; font-weight:bold;">${isKo ? `🎁 #${selected[0].top}번 카드 선택됨! 우측 대상을 클릭하거나 [양도 건너뛰기]를 누르세요.` : `🎁 Card #${selected[0].top} selected! Click target player or [Skip Give].`}</span>`;
            }
        } else if (isHumanTurn) {
            if (canPlay) {
                const isSuperTen = (state.currentTrick.currentValue === 9 && selectedCards[0].top === 0);
                actionInfo.innerHTML = isSuperTen ? 
                    `<span style="color:#fbbf24; font-weight:900;">★ 필살 10 발동 가능! (즉시 승리)</span>` : 
                    `<span style="color:#10b981; font-weight:bold;">${selectedCards.length}장 (#${selectedCards[0].top}) 내기 가능</span>`;
            } else if (selectedCards.length > 0) {
                actionInfo.innerHTML = `<span style="color:#ef4444;">낼 수 없는 조합입니다 (같은 숫자 1~3장이거나 더 높은 숫자여야 함).</span>`;
            } else {
                actionInfo.innerHTML = isKo ? 
                    `낼 카드(같은 숫자 1~3장)를 선택하거나 패스하세요.` : 
                    `Select cards (1~3 matching numbers) or pass.`;
            }
        } else {
            actionInfo.innerHTML = `<span style="color:var(--text-muted);">${state.players[state.currentTurnPlayerId].name}${isKo ? '님의 차례 진행 중...' : ' is thinking...'}</span>`;
        }
    }

    function renderPlayers() {
        const list = document.getElementById('otherPlayersList');
        if (!list) return;

        const isKo = (state.lang === 'ko');
        list.innerHTML = '';

        const activePlayer = state.players[state.currentTurnPlayerId];
        const selectedForGive = (state.phase === 'special_1_give') ? getSelectedCards(activePlayer) : [];
        const hasSelectedCard = selectedForGive.length > 0;

        state.players.forEach(p => {
            const isTurn = (p.id === state.currentTurnPlayerId && state.phase === 'play');
            const isSpecialTargetable = (state.phase === 'special_5_target' || state.phase === 'special_1_give') && (p.id !== state.currentTurnPlayerId);
            const isReadyTarget = isSpecialTargetable && (state.phase === 'special_5_target' || (state.phase === 'special_1_give' && hasSelectedCard));

            const cardEl = document.createElement('div');
            cardEl.className = `player-status-card ${isTurn ? 'active-turn' : ''} ${p.passed ? 'passed' : ''} ${isSpecialTargetable ? 'targetable' : ''} ${isReadyTarget ? 'ready-target' : ''}`;

            let buttonLabel = isKo ? '이 플레이어 선택' : 'Select Target';
            if (state.phase === 'special_1_give') {
                buttonLabel = hasSelectedCard ? 
                    (isKo ? `이 플레이어에게 #${selectedForGive[0].top} 넘겨주기` : `Give #${selectedForGive[0].top} to this player`) : 
                    (isKo ? '카드 선택 후 클릭' : 'Select card first');
            }

            cardEl.innerHTML = `
                <div class="psc-top">
                    <span class="psc-name">${p.name} ${p.isHuman ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>'}</span>
                    ${p.rank ? `<span class="psc-rank-badge">🏆 ${p.rank}등</span>` : (p.passed ? `<span class="psc-pass-badge">${isKo ? '패스' : 'Pass'}</span>` : '')}
                </div>
                <div class="psc-cards-count">
                    <i class="fa-solid fa-layer-group"></i> ${isKo ? '남은 손패:' : 'Cards:'} <strong>${p.hand.length}</strong>${isKo ? '장' : ''}
                </div>
                <div class="psc-mini-hand">
                    ${p.hand.map(c => `
                        <div class="psc-card-pip num-${c.top}" title="${p.isHuman ? `Top: ${c.top} / Bottom: ${c.bottom}` : `Card #${c.top}`}">
                            <span>${p.isHuman ? c.top : '·'}</span>
                        </div>
                    `).join('')}
                </div>
                ${isSpecialTargetable ? `<button type="button" class="btn-target-select">${buttonLabel}</button>` : ''}
            `;

            if (isSpecialTargetable) {
                cardEl.onclick = () => {
                    if (state.phase === 'special_5_target') {
                        p.hand.forEach(flipCard);
                        sortHand(p.hand);
                        playSound('special');
                        addLog(
                            `[특수능력 5] ${state.players[state.currentTurnPlayerId].name}님이 ${p.name}님의 손패 전체를 뒤집었습니다!`,
                            `[Ability 5] ${state.players[state.currentTurnPlayerId].name} flipped all cards of ${p.name}!`
                        );
                        state.phase = 'play';
                        advanceTurn();
                    } else if (state.phase === 'special_1_give') {
                        const giver = state.players[state.currentTurnPlayerId];
                        const selected = getSelectedCards(giver);
                        if (selected.length === 0) {
                            alert(isKo ? '먼저 내 손패에서 넘겨줄 카드 1장을 클릭해 선택해 주세요.' : 'Please click and select 1 card from your hand first.');
                            return;
                        }
                        const cardToGive = selected[0];
                        giver.hand = giver.hand.filter(c => c.id !== cardToGive.id);
                        p.hand.push(cardToGive);
                        sortHand(giver.hand);
                        sortHand(p.hand);
                        state.selectedCardIds.clear();
                        playSound('special');
                        addLog(
                            `[특수능력 1] ${giver.name}님이 ${p.name}님에게 #${cardToGive.top}번 카드를 양도했습니다!`,
                            `[Ability 1] ${giver.name} gave #${cardToGive.top} to ${p.name}!`
                        );
                        if (giver.hand.length === 0 && giver.rank === null) {
                            giver.rank = state.winnerRanks.length + 1;
                            state.winnerRanks.push(giver.id);
                            addLog(
                                `🎉 ${giver.name}님이 손패를 모두 털어내고 탈출에 성공했습니다! (${giver.rank}등)`,
                                `🎉 ${giver.name} emptied their hand and escaped! (${giver.rank}th place)`
                            );
                            playSound('win');
                            state.phase = 'game_over';
                            render();
                            showVictoryModal();
                            return;
                        }
                        state.phase = 'play';
                        advanceTurn();
                    }
                };
            }

            list.appendChild(cardEl);
        });
    }

    function renderLogs() {
        const container = document.getElementById('historyLogsList');
        if (!container) return;
        const isKo = (state.lang === 'ko');

        container.innerHTML = state.historyLogs.map(l => `
            <div class="log-item">
                <span class="log-time">${l.time}</span>
                <span class="log-msg">${isKo ? l.ko : l.en}</span>
            </div>
        `).join('');
    }

    function render() {
        renderTrickArea();
        renderHand();
        renderPlayers();
        renderLogs();

        // Translate all data-i18n attributes
        document.querySelectorAll('[data-i18n-ko]').forEach(el => {
            const txt = (state.lang === 'ko') ? el.getAttribute('data-i18n-ko') : (el.getAttribute('data-i18n-en') || el.getAttribute('data-i18n-ko'));
            if (txt) el.textContent = txt;
        });

        const bannerText = document.getElementById('promptBannerText');
        const isKo = (state.lang === 'ko');
        const active = state.players[state.currentTurnPlayerId];

        if (bannerText) {
            if (state.phase === 'play') {
                bannerText.innerHTML = `${active.name}${isKo ? '님의 차례입니다. 바닥보다 더 높은 숫자를 내거나 패스하세요.' : '\'s turn. Play higher or pass.'}`;
            } else if (state.phase === 'loser_flip') {
                bannerText.innerHTML = isKo ? '패자 뒤집기 단계: 손패 카드 1장을 뒤집거나 [뒤집지 않고 건너뛰기]를 선택하세요.' : 'Losers\' Flip Phase: Losers may flip 1 card or click [Skip Flip].';
            } else if (state.phase === 'special_1_give') {
                const selected = getSelectedCards(active);
                if (selected.length === 0) {
                    bannerText.innerHTML = isKo ? '🎁 특수능력 1: 넘겨줄 손패 카드를 선택 후 대상을 클릭하거나 [양도 건너뛰기]를 누르세요.' : '🎁 Special Ability 1: Click 1 card in hand to give or click [Skip Give]!';
                } else {
                    bannerText.innerHTML = isKo ? `🎁 특수능력 1: #${selected[0].top}번 카드가 선택되었습니다. 우측 대상을 클릭하거나 [양도 건너뛰기]를 누르세요.` : `🎁 Special Ability 1: Card #${selected[0].top} selected. Click target or [Skip Give]!`;
                }
            } else if (state.phase === 'special_5_target') {
                bannerText.innerHTML = isKo ? '⚡ 특수능력 5: 손패 전체를 뒤집을 대상을 클릭하거나 [반전 건너뛰기]를 누르세요.' : '⚡ Special Ability 5: Choose a target player or click [Skip Flip All]!';
            } else if (state.phase === 'special_8_flip') {
                bannerText.innerHTML = isKo ? '🔄 특수능력 8: 내 손패에서 뒤집을 카드 1장을 클릭하거나 [반전 건너뛰기]를 누르세요.' : '🔄 Special Ability 8: Click 1 card in hand to flip or click [Skip Flip]!';
            } else if (state.phase === 'game_over') {
                bannerText.innerHTML = isKo ? '🎉 게임 종료! 탈출에 성공한 양반이 탄생했습니다!' : '🎉 Game Over! A new Yangban emerged!';
            }
        }
    }

    // Modal Helpers
    function showPassCurtainModal(title, desc, onReady) {
        const modal = document.getElementById('passCurtainModal');
        if (!modal) {
            if (onReady) onReady();
            return;
        }
        document.getElementById('passCurtainTitle').textContent = title;
        document.getElementById('passCurtainDesc').textContent = desc;
        const btn = document.getElementById('btnPassCurtainReady');
        btn.onclick = () => {
            modal.classList.remove('active');
            if (onReady) onReady();
        };
        modal.classList.add('active');
    }

    function showVictoryModal() {
        const modal = document.getElementById('victoryModal');
        const body = document.getElementById('victoryModalBody');
        if (!modal || !body) return;

        const isKo = (state.lang === 'ko');
        const winner = state.players[state.winnerRanks[0]];

        body.innerHTML = `
            <div style="text-align:center; margin-bottom:16px;">
                <div style="font-size:3rem; margin-bottom:8px;">👑</div>
                <h2 style="color:var(--gold); font-size:1.4rem;">${winner.name} ${isKo ? '최종 승리 (양반 등극)!' : 'Wins the Game!'}</h2>
                <p style="color:var(--text-muted); font-size:0.9rem; margin-top:4px;">
                    ${isKo ? '가장 먼저 운명의 굴레(손패 12장)를 모두 털어내고 신분 탈출에 성공했습니다!' : 'First player to shed all cards and escape servitude!'}
                </p>
            </div>
            <table class="scores-table" style="width:100%; border-collapse:collapse; margin-top:14px; font-size:0.85rem;">
                <thead>
                    <tr style="background:rgba(255,255,255,0.06); color:var(--gold);">
                        <th style="padding:6px;">${isKo ? '순위' : 'Rank'}</th>
                        <th style="padding:6px;">${isKo ? '플레이어' : 'Player'}</th>
                        <th style="padding:6px;">${isKo ? '남은 손패' : 'Remaining'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.players.map((p, i) => `
                        <tr style="text-align:center; border-bottom:1px solid var(--border-glass); ${p.id === winner.id ? 'background:rgba(245,158,11,0.15); font-weight:bold;' : ''}">
                            <td style="padding:6px;">${p.id === winner.id ? '🥇 1위 (탈출)' : `${p.hand.length}장 남음`}</td>
                            <td style="padding:6px;">${p.name}</td>
                            <td style="padding:6px;">${p.hand.length}장</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        modal.classList.add('active');
    }

    function setupEvents() {
        // Play / Pass / Skip buttons
        const btnPlay = document.getElementById('btnPlayCards');
        const btnPass = document.getElementById('btnPassTurn');
        const btnSkip = document.getElementById('btnSkipAction');

        if (btnPlay) {
            btnPlay.onclick = () => {
                const player = state.players[state.currentTurnPlayerId];
                const selected = getSelectedCards(player);
                if (canPlayCombination(selected)) {
                    executePlay(player, selected);
                }
            };
        }

        if (btnPass) {
            btnPass.onclick = () => {
                const player = state.players[state.currentTurnPlayerId];
                executePass(player);
            };
        }

        if (btnSkip) {
            btnSkip.onclick = () => {
                if (state.phase === 'loser_flip') {
                    if (state.pendingLoserFlips.length === 0) return;
                    const loserId = state.pendingLoserFlips[0];
                    const loser = state.players[loserId];
                    addLog(
                        `패자 뒤집기: ${loser.name}님이 카드를 뒤집지 않고 유지했습니다.`,
                        `Loser Flip: ${loser.name} chose to keep hand without flipping.`
                    );
                    playSound('pass');
                    state.pendingLoserFlips.shift();
                    processNextLoserFlip(state.currentTrick.currentWinnerId);
                    return;
                }

                if (state.phase === 'special_1_give') {
                    const p = state.players[state.currentTurnPlayerId];
                    state.selectedCardIds.clear();
                    addLog(
                        `[특수능력 1] ${p.name}님이 카드 양도 능력을 건너뛰었습니다.`,
                        `[Ability 1] ${p.name} skipped the Give ability.`
                    );
                    playSound('pass');
                    state.phase = 'play';
                    advanceTurn();
                    return;
                }

                if (state.phase === 'special_5_target') {
                    const p = state.players[state.currentTurnPlayerId];
                    addLog(
                        `[특수능력 5] ${p.name}님이 상대 뒤집기 능력을 건너뛰었습니다.`,
                        `[Ability 5] ${p.name} skipped the Flip All ability.`
                    );
                    playSound('pass');
                    state.phase = 'play';
                    advanceTurn();
                    return;
                }

                if (state.phase === 'special_8_flip') {
                    const p = state.players[state.currentTurnPlayerId];
                    addLog(
                        `[특수능력 8] ${p.name}님이 자가 뒤집기 능력을 건너뛰었습니다.`,
                        `[Ability 8] ${p.name} skipped the Self Flip ability.`
                    );
                    playSound('pass');
                    state.phase = 'play';
                    advanceTurn();
                    return;
                }
            };
        }

        // New Game Modal
        const btnNew = document.getElementById('btnNewGame');
        const modalNew = document.getElementById('newGameModal');
        const closeNew = document.getElementById('closeNewGameModal');
        const btnStart = document.getElementById('btnStartNewGame');

        if (btnNew && modalNew) {
            btnNew.onclick = () => modalNew.classList.add('active');
        }
        if (closeNew && modalNew) {
            closeNew.onclick = () => modalNew.classList.remove('active');
        }

        const modeBtns = document.querySelectorAll('.mode-btn');
        let selectedMode = 'ai';
        modeBtns.forEach(b => {
            b.onclick = () => {
                modeBtns.forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                selectedMode = b.getAttribute('data-mode') || 'ai';
            };
        });

        if (btnStart && modalNew) {
            btnStart.onclick = () => {
                const sel = document.getElementById('selectPlayers');
                const pCount = sel ? parseInt(sel.value, 10) : 4;
                modalNew.classList.remove('active');
                initGame({ playerCount: pCount, gameMode: selectedMode });
            };
        }

        // Rulebook Modal
        const btnRb = document.getElementById('btnRulebook');
        const modalRb = document.getElementById('rulebookModal');
        const closeRb = document.getElementById('closeRulebookModal');
        if (btnRb && modalRb) {
            btnRb.onclick = () => modalRb.classList.add('active');
        }
        if (closeRb && modalRb) {
            closeRb.onclick = () => modalRb.classList.remove('active');
        }

        // Victory Play Again
        const btnPlayAgain = document.getElementById('btnPlayAgain');
        const modalVic = document.getElementById('victoryModal');
        if (btnPlayAgain && modalVic) {
            btnPlayAgain.onclick = () => {
                modalVic.classList.remove('active');
                initGame({ playerCount: state.playerCount, gameMode: state.gameMode });
            };
        }

        // Sound Switch
        const btnSound = document.getElementById('btnSoundSwitch');
        if (btnSound) {
            btnSound.onclick = () => {
                state.soundEnabled = !state.soundEnabled;
                btnSound.innerHTML = state.soundEnabled ? 
                    '<i class="fa-solid fa-volume-high"></i>' : 
                    '<i class="fa-solid fa-volume-xmark"></i>';
            };
        }

        // Language Switch
        const btnLang = document.getElementById('btnLangSwitch');
        if (btnLang) {
            btnLang.onclick = () => {
                state.lang = (state.lang === 'ko') ? 'en' : 'ko';
                btnLang.textContent = (state.lang === 'ko') ? 'EN' : 'KO';
                render();

                // Translate all data-i18n attributes
                document.querySelectorAll('[data-i18n-ko]').forEach(el => {
                    const txt = (state.lang === 'ko') ? el.getAttribute('data-i18n-ko') : (el.getAttribute('data-i18n-en') || el.getAttribute('data-i18n-ko'));
                    if (txt) el.textContent = txt;
                });
                if (document.getElementById('tutorialModal')?.classList.contains('active')) {
                    renderTutorialSlideSA();
                }
            };
        }
    }

    
    // ============================================================
    // Interactive Tutorial System - Slaves, Arise!
    // ============================================================
    const TUTORIAL_STEPS_SA = [
        {
            step: 1,
            title: { ko: '1. 게임 목표 & 신분 상승 대결', en: '1. Goal & The Struggle for Nobility' },
            desc: {
                ko: '<strong>노비여, 일어나라! (Slaves, Arise!)</strong>는 조선 후기 신분제 질서를 뒤흔드는 통쾌한 클라이밍 카드 게임입니다.<br>플레이어들은 각자 12장의 손패를 받고 시작합니다. <span class="tut-highlight">가장 먼저 손패 12장을 모두 털어내는(Shedding) 사람</span>이 즉시 게임에서 승리하여 양반으로 등극합니다!',
                en: 'In <strong>Slaves, Arise!</strong>, you battle to overthrow the rigid Joseon caste hierarchy in an electrifying trick-taking / climbing game.<br>Players start with 12 cards in hand. <span class="tut-highlight">The first player to shed all 12 cards</span> wins immediately and ascends to the noble Yangban class!'
            },
            keyBox: {
                ko: '• <strong>승리 조건:</strong> 손패 0장을 만드는 즉시 게임 종료 & 승리!<br>• <strong>양반 등극:</strong> 손패의 운명을 바꾸고 상대를 제압하여 조선 최고의 가문으로 우뚝 서세요.',
                en: '• <strong>Win Condition:</strong> Shed all 12 cards to achieve immediate victory!<br>• <strong>Ascension:</strong> Manipulate your card orientations and outwit opponents to rise from servitude to supreme prestige!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-crown"></i> ${isKo ? '신분 상승 로드맵' : 'Road to Nobility'}
                    </div>
                    <div class="tut-visual-row" style="gap:16px;">
                        <div style="text-align:center; padding:10px 16px; border-radius:10px; background:rgba(30,34,46,0.8); border:1px solid #78716c;">
                            <div style="font-size:0.75rem; color:#a8a29e;">${isKo ? '시작 신분: 노비/평민' : 'Starting Class: Servitude'}</div>
                            <div style="font-size:1.2rem; font-weight:900; color:#cbd5e1; margin-top:2px;">손패 12장</div>
                        </div>

                        <div style="font-size:1.4rem; color:#f59e0b;"><i class="fa-solid fa-arrow-right"></i></div>

                        <div style="text-align:center; padding:10px 16px; border-radius:10px; background:linear-gradient(135deg, rgba(217,119,6,0.25), rgba(245,158,11,0.1)); border:2px solid #f59e0b; box-shadow:0 0 15px rgba(245,158,11,0.25);">
                            <div style="font-size:0.75rem; color:#fbbf24; font-weight:700;">${isKo ? '최종 목표: 양반 등극!' : 'Goal: Noble Yangban!'}</div>
                            <div style="font-size:1.2rem; font-weight:900; color:#fbbf24; margin-top:2px;">손패 0장 (즉시 승리!)</div>
                        </div>
                    </div>
                    <div class="tut-interactive-note">
                        <i class="fa-solid fa-circle-check"></i> ${isKo ? '점수 계산 없이, 가장 먼저 손을 비운 사람이 그 즉시 판을 끝냅니다.' : 'No complicated point counting: the first player to empty their hand wins on the spot.'}
                    </div>
                </div>
            `
        },
        {
            step: 2,
            title: { ko: '2. 상하 반전 카드 (180° Dual-ended)', en: '2. Dual-ended Cards & 180° Inversion' },
            desc: {
                ko: '덱의 72장 모든 카드는 <strong>위아래에 서로 다른 숫자</strong>가 적힌 양면 카드입니다!<br>• <strong>상단 숫자 (정방향)</strong>: 지금 낼 수 있는 <span class="tut-highlight">현재 유효 숫자</span>입니다.<br>• <strong>하단 숫자 (역방향)</strong>: 거꾸로 뒤집힌 잠재적 숫자입니다.<br>• 한쪽 끝은 <strong>낮은 숫자 (1~4, 노비/평민)</strong>, 다른 쪽 끝은 <strong>높은 숫자 (5~9, 0, 양반/관직)</strong>로 구성됩니다.<br>• <span class="tut-highlight">절대 주의</span>: 플레이어는 임의로 카드를 뒤집을 수 없습니다!',
                en: 'All 72 cards feature <strong>different numbers on opposite ends</strong>!<br>• <strong>Top Number (Upright)</strong>: The <span class="tut-highlight">currently active, playable number</span>.<br>• <strong>Bottom Number (Inverted)</strong>: The upside-down latent number.<br>• One end is <strong>Low (1~4, Slave/Peasant)</strong>, opposite is <strong>High (5~9, 0, Noble/Official)</strong>.<br>• <span class="tut-highlight">Strict Rule</span>: You cannot voluntarily flip cards in your hand!'
            },
            keyBox: {
                ko: '<strong>직접 카드를 돌려보세요:</strong> 아래 [🔄 카드 180° 뒤집기] 버튼을 누르면 카드가 3D 회전하며 상단 숫자가 [3]에서 강력한 [8]로 바뀝니다!',
                en: '<strong>Interactive 3D Demo:</strong> Click the button below to flip the card 180°. Watch how a humble [3] transforms into a powerful [8]!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-arrows-spin"></i> ${isKo ? '상하 반전 3D 카드 체험' : '3D Dual-ended Card Demo'}
                    </div>
                    <div class="tut-visual-row">
                        <div class="sa-tut-card-demo" id="saDemoCard">
                            <div class="tut-card-num-top" id="saDemoTopNum">3</div>
                            <div class="tut-card-class-badge" id="saDemoClassBadge">${isKo ? '평민' : 'Peasant'}</div>
                            <div class="tut-card-num-bot" id="saDemoBotNum">8</div>
                        </div>
                    </div>
                    <button type="button" class="tut-interactive-btn" id="btnToggleSaCardFlip">
                        <i class="fa-solid fa-rotate"></i> ${isKo ? '🔄 카드 180° 뒤집기 체험 (클릭)' : '🔄 Flip Card 180° (Click)'}
                    </button>
                    <div class="tut-interactive-note" id="saDemoFlipDesc">
                        <i class="fa-solid fa-circle-info"></i> ${isKo ? '현재 활성 숫자: [3] (하단의 [8]은 뒤집히기 전까지 쓸 수 없음)' : 'Currently active: [3] (the bottom [8] is dormant until flipped)'}
                    </div>
                </div>
            `
        },
        {
            step: 3,
            title: { ko: '3. 카드 내기 & 클라이밍 규칙', en: '3. Card Playing & Climbing' },
            desc: {
                ko: '트릭의 선 플레이어는 상단 숫자가 같은 카드 <strong>1장(싱글), 2장(페어), 또는 3장(트리플)</strong>을 출패합니다.<br>다음 플레이어들은 순서대로:<br>1. 앞사람이 낸 것과 <strong>동일한 장수</strong>이면서,<br>2. <strong>더 높은 숫자</strong>를 내야 합니다!<br>낼 수 없거나 카드를 아끼고 싶다면 <strong>[패스(Pass)]</strong>합니다. 전원 패스하면 마지막 출패자가 트릭을 승리하고 다음 선이 됩니다.',
                en: 'The lead player plays <strong>1 card (Single), 2 cards (Pair), or 3 cards (Triple)</strong> of matching numbers.<br>Next players must:<br>1. Match the <strong>exact same quantity</strong> of cards, AND<br>2. Play a <strong>strictly higher number</strong>!<br>If unable or unwilling to play, you <strong>Pass</strong>. When all opponents pass, the last player wins the trick and leads the next.'
            },
            keyBox: {
                ko: '• <strong>예시:</strong> 선이 페어 [4, 4]를 냄 ➔ 다음 사람이 페어 [7, 7]로 밟음 ➔ 나머지는 [8, 8] 이상이 없어서 패스 ➔ 페어 [7, 7]을 낸 플레이어 승리!',
                en: '• <strong>Example:</strong> Lead plays Pair [4, 4] ➔ Next player beats with Pair [7, 7] ➔ Others pass ➔ Pair [7, 7] player wins the trick!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-stairs"></i> ${isKo ? '클라이밍 흐름 예시' : 'Climbing Sequence Example'}
                    </div>
                    <div class="tut-visual-row" style="gap:18px;">
                        <div style="text-align:center;">
                            <div style="font-size:0.7rem; color:#a8a29e; margin-bottom:4px;">선 (Lead)</div>
                            <div style="padding:6px 12px; border-radius:6px; background:#232734; border:1px solid #78716c; color:#d97706; font-weight:800; font-size:1.1rem;">
                                페어 [4, 4]
                            </div>
                        </div>

                        <div style="font-size:1.2rem; color:#f59e0b;"><i class="fa-solid fa-arrow-right"></i></div>

                        <div style="text-align:center;">
                            <div style="font-size:0.7rem; color:#38bdf8; font-weight:700; margin-bottom:4px;">뒷사람 (Beat!)</div>
                            <div style="padding:6px 12px; border-radius:6px; background:#232734; border:2px solid #38bdf8; color:#38bdf8; font-weight:800; font-size:1.1rem; box-shadow:0 0 10px rgba(56,189,248,0.25);">
                                페어 [7, 7]
                            </div>
                        </div>

                        <div style="font-size:1.2rem; color:#f59e0b;"><i class="fa-solid fa-arrow-right"></i></div>

                        <div style="text-align:center;">
                            <div style="font-size:0.7rem; color:#ef4444; margin-bottom:4px;">나머지 플레이어</div>
                            <div style="padding:6px 12px; border-radius:6px; background:#232734; border:1px dashed #ef4444; color:#f87171; font-weight:700; font-size:0.9rem;">
                                패스 (Pass)
                            </div>
                        </div>
                    </div>
                    <div class="tut-interactive-note">
                        <i class="fa-solid fa-check"></i> ${isKo ? '페어 [7, 7]을 낸 플레이어가 트릭을 따내고 다음 선을 잡습니다!' : 'The player who played Pair [7, 7] takes the trick and leads the next one!'}
                    </div>
                </div>
            `
        },
        {
            step: 4,
            title: { ko: '4. 필살 0 on 9 규칙 (Super 10 on 9)', en: '4. The Ultimate Weapon: 0 on 9' },
            desc: {
                ko: '숫자 0은 평소에는 가장 약하거나 특수하지만, <span class="tut-highlight">바닥에 9가 나와 있을 때 0을 내면 10(천하무적)으로 취급</span>됩니다!<br>• 바닥에 싱글 9가 나왔을 때 ➔ 싱글 0을 내면 10!<br>• 바닥에 페어 9가 나왔을 때 ➔ 페어 0을 내면 더블 10!<br>• <span class="tut-highlight">필살 효과</span>: 0을 내는 즉시 트릭이 종료되며 0을 낸 플레이어가 승리하고 선을 획득합니다!',
                en: 'The number 0 is normally modest, but <span class="tut-highlight">when played onto a 9, 0 counts as a 10 (Invincible)!</span><br>• Single 9 on table ➔ Play 0 as 10!<br>• Pair 9 on table ➔ Play Pair 0 as Double 10!<br>• <span class="tut-highlight">Instant Win</span>: Playing 0 on 9 terminates the trick immediately, awarding you the victory and next lead!'
            },
            keyBox: {
                ko: '• <strong>역전의 비책:</strong> 상대가 강력한 9를 내어 트릭을 굳히려고 할 때, 품고 있던 0을 내어 판을 뒤집어버리세요!',
                en: '• <strong>Turning the Tables:</strong> When an opponent plays a dominant 9, drop your hidden 0 to snatch the trick away instantly!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-bolt"></i> ${isKo ? '0 on 9 필살 발동 연출' : 'Super 10 on 9 Execution'}
                    </div>
                    <div class="tut-visual-row" style="gap:16px;">
                        <div style="text-align:center;">
                            <div style="font-size:0.7rem; color:#a8a29e; margin-bottom:4px;">바닥 카드</div>
                            <div style="width:60px; height:80px; border-radius:8px; background:#232734; border:2px solid #ef4444; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:900; color:#ef4444;">
                                9
                            </div>
                        </div>

                        <div style="font-size:1.5rem; color:#fbbf24;"><i class="fa-solid fa-bolt-lightning"></i></div>

                        <div style="text-align:center;">
                            <div style="font-size:0.7rem; color:#fbbf24; font-weight:700; margin-bottom:4px;">0 출패!</div>
                            <div style="width:60px; height:80px; border-radius:8px; background:linear-gradient(135deg, #b45309, #d97706); border:2px solid #fbbf24; display:flex; flex-direction:column; align-items:center; justify-content:center; font-weight:900; color:#fff; box-shadow:0 0 16px rgba(251,191,36,0.5);">
                                <div style="font-size:0.65rem; color:#fde68a;">변신!</div>
                                <div style="font-size:1.6rem; line-height:1;">10</div>
                            </div>
                        </div>

                        <div style="font-size:1.5rem; color:#10b981;"><i class="fa-solid fa-trophy"></i></div>

                        <div style="text-align:center;">
                            <div style="font-size:0.7rem; color:#10b981; font-weight:700; margin-bottom:4px;">즉시 승리!</div>
                            <div style="padding:6px 10px; border-radius:6px; background:rgba(16,185,129,0.2); border:1px solid #10b981; color:#34d399; font-weight:800; font-size:0.85rem;">
                                트릭 종료 & 선 획득
                            </div>
                        </div>
                    </div>
                    <div class="tut-interactive-note">
                        <i class="fa-solid fa-crown"></i> ${isKo ? '9가 깔렸을 때 0은 어떤 카드도 이길 수 없는 궁극의 무기입니다.' : 'Against a 9, 0 is utterly unbeatable.'}
                    </div>
                </div>
            `
        },
        {
            step: 5,
            title: { ko: "5. 패자 뒤집기 (The Losers Flip - 핵심 메카닉)", en: "5. The Losers Flip: Rising From Defeat" },
            desc: {
                ko: '트릭이 끝났을 때, <span class="tut-highlight">트릭에서 패배한 모든 플레이어(승자 제외)는 자신의 손패 중 1장을 골라 180도 뒤집습니다!</span><br>• 손에 남아 있는 약한 숫자(1, 2, 3, 4)를 강력한 높은 숫자(5, 6, 7, 8, 9, 0)로 업그레이드할 절호의 기회!<br>• 트릭을 져도 카드를 뒤집어 다음 기회를 준비할 수 있는 것이 이 게임의 가장 큰 반전 묘미입니다.',
                en: 'Whenever a trick finishes, <span class="tut-highlight">every player who lost the trick (everyone except the trick winner) chooses 1 card in hand and flips it 180°!</span><br>• Upgrade sluggish low cards (1, 2, 3, 4) into mighty high numbers (5, 6, 7, 8, 9, 0)!<br>• Losing a trick is never wasted—it gives you the strategic fuel to engineer your next trick victory.'
            },
            keyBox: {
                ko: '• <strong>전략적 패배:</strong> 당장 이길 수 없다면 패배를 수용하고 [패자 뒤집기]로 페어나 트리플을 완성하세요!',
                en: '• <strong>Strategic Loss:</strong> If you cannot win the trick, gracefully accept defeat and use the The Losers Flip to forge potent pairs or triples!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-hand-fist"></i> ${isKo ? '패배자의 대반전 업그레이드' : 'The The Losers Upgrade'}
                    </div>
                    <div class="tut-visual-row" style="gap:20px;">
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:4px;">${isKo ? '패배 전: 약한 카드' : 'Before: Weak Card'}</div>
                            <div style="width:68px; height:96px; border-radius:8px; background:#232734; border:1px solid #78716c; display:flex; flex-direction:column; justify-content:space-between; padding:6px; margin:0 auto;">
                                <div style="font-size:1.2rem; font-weight:900; color:#d97706;">2</div>
                                <div style="font-size:0.6rem; color:#78716c; text-align:center;">노비</div>
                                <div style="font-size:0.9rem; color:#57534e; transform:rotate(180deg); align-self:flex-end;">9</div>
                            </div>
                        </div>

                        <div style="font-size:1.5rem; color:#f59e0b;"><i class="fa-solid fa-arrows-spin"></i></div>

                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#10b981; font-weight:700; margin-bottom:4px;">${isKo ? '뒤집은 후: 강력한 9!' : 'After Flip: Mighty 9!'}</div>
                            <div style="width:68px; height:96px; border-radius:8px; background:#232734; border:2px solid #10b981; display:flex; flex-direction:column; justify-content:space-between; padding:6px; margin:0 auto; box-shadow:0 0 12px rgba(16,185,129,0.3);">
                                <div style="font-size:1.3rem; font-weight:900; color:#10b981;">9</div>
                                <div style="font-size:0.6rem; color:#10b981; text-align:center;">양반</div>
                                <div style="font-size:0.9rem; color:#57534e; transform:rotate(180deg); align-self:flex-end;">2</div>
                            </div>
                        </div>
                    </div>
                    <div class="tut-interactive-note">
                        <i class="fa-solid fa-arrow-trend-up"></i> ${isKo ? '패배할 때마다 핸드가 점점 더 강력해집니다!' : 'Every defeat crafts a stronger, deadlier hand for future tricks!'}
                    </div>
                </div>
            `
        },
        {
            step: 6,
            title: { ko: '6. 특수 능력 카드 (1, 5, 8)', en: '6. Special Ability Numbers (1, 5, 8)' },
            desc: {
                ko: '특정 숫자를 낼 때 발동하는 강력한 특수 능력들:<br>• <strong>[1번 (나눔/양도)]</strong>: 내 손패 1장을 상대방 1명에게 떠넘깁니다! <span class="tut-highlight">내 손패가 1장 줄어들어</span> 승리에 결정적 기여!<br>• <strong>[5번 (혼란)]</strong>: 지목한 상대 1명의 <span class="tut-highlight">손패 전체를 180도 뒤집어버립니다!</span> (상대의 빌드업을 와해)<br>• <strong>[8번 (자체 반전)]</strong>: 내 손패 중 1장을 즉시 180도 뒤집습니다!',
                en: 'Special abilities trigger whenever these numbers are played:<br>• <strong>[1 (Giving)]</strong>: Pass 1 card from hand to an opponent! <span class="tut-highlight">Shrinks your hand by 1</span>, rushing you to victory!<br>• <strong>[5 (Flip All)]</strong>: Target an opponent and <span class="tut-highlight">flip their ENTIRE hand 180°!</span> (Shatters their prepared combos!)<br>• <strong>[8 (Self Flip)]</strong>: Immediately flip 1 card of your choice in your own hand!'
            },
            keyBox: {
                ko: '🎉 <strong>튜토리얼 완료!</strong> 이제 운명을 뒤집고 양반으로 등극할 모든 준비가 끝났습니다. 아래 [게임 시작하기]를 눌러 승부를 겨뤄보세요!',
                en: '🎉 <strong>Tutorial Complete!</strong> You are ready to manipulate your destiny and claim nobility. Click [Start Game] below to play!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box" style="background:linear-gradient(135deg, rgba(217,119,6,0.12), rgba(16,185,129,0.12)); border-color:rgba(217,119,6,0.4);">
                    <div class="tut-visual-row" style="gap:12px;">
                        <div style="text-align:center; padding:8px 10px; border-radius:8px; background:rgba(30,34,46,0.8); border:1px solid #d97706;">
                            <div style="font-size:1.2rem; font-weight:900; color:#fbbf24;">1</div>
                            <div style="font-size:0.7rem; color:#d6d3d1; margin-top:2px;">${isKo ? '손패 1장 선물' : 'Pass 1 Card'}</div>
                        </div>
                        <div style="text-align:center; padding:8px 10px; border-radius:8px; background:rgba(30,34,46,0.8); border:1px solid #d97706;">
                            <div style="font-size:1.2rem; font-weight:900; color:#fbbf24;">5</div>
                            <div style="font-size:0.7rem; color:#d6d3d1; margin-top:2px;">${isKo ? '상대 손패 전체 뒤집기' : 'Flip All Hand'}</div>
                        </div>
                        <div style="text-align:center; padding:8px 10px; border-radius:8px; background:rgba(30,34,46,0.8); border:1px solid #d97706;">
                            <div style="font-size:1.2rem; font-weight:900; color:#fbbf24;">8</div>
                            <div style="font-size:0.7rem; color:#d6d3d1; margin-top:2px;">${isKo ? '내 손패 1장 즉시 반전' : 'Self 1 Card Flip'}</div>
                        </div>
                    </div>
                    <button type="button" class="tut-nav-btn finish" id="btnTutStartGameNowSA" style="padding:10px 24px; font-size:0.95rem; margin-top:4px;">
                        <i class="fa-solid fa-play"></i> ${isKo ? '지금 바로 게임 시작하기' : 'Start Playing Now'}
                    </button>
                </div>
            `
        }
    ];

    let currentTutStepSA = 1;
    let demoCardFlippedSA = false;

    function openTutorialSA(step = 1) {
        currentTutStepSA = Math.max(1, Math.min(step, TUTORIAL_STEPS_SA.length));
        const modal = document.getElementById('tutorialModal');
        if (modal) {
            modal.classList.add('active');
            renderTutorialSlideSA();
        }
    }

    function closeTutorialSA() {
        const modal = document.getElementById('tutorialModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    function renderTutorialSlideSA() {
        const isKo = (state.lang === 'ko');
        const data = TUTORIAL_STEPS_SA[currentTutStepSA - 1];
        if (!data) return;

        // Step Badge
        const stepBadge = document.getElementById('tutStepBadge');
        if (stepBadge) {
            stepBadge.textContent = `Step ${currentTutStepSA} / ${TUTORIAL_STEPS_SA.length}`;
        }

        // Progress Bar
        const barItems = document.querySelectorAll('#tutProgressBar .tut-step-bar-item');
        barItems.forEach((item, idx) => {
            const stepNum = idx + 1;
            item.classList.remove('active', 'completed');
            if (stepNum === currentTutStepSA) item.classList.add('active');
            else if (stepNum < currentTutStepSA) item.classList.add('completed');
        });

        // Body Content
        const body = document.getElementById('tutBody');
        if (body) {
            body.innerHTML = `
                <div class="tut-slide-title">
                    <i class="fa-solid fa-scroll" style="color:var(--gold);"></i> ${data.title[isKo ? 'ko' : 'en']}
                </div>
                <div class="tut-slide-desc">
                    ${data.desc[isKo ? 'ko' : 'en']}
                </div>
                ${data.renderDemo(isKo)}
                <div class="tut-key-box">
                    ${data.keyBox[isKo ? 'ko' : 'en']}
                </div>
            `;
        }

        // Dots
        const dots = document.getElementById('tutDots');
        if (dots) {
            dots.innerHTML = TUTORIAL_STEPS_SA.map((_, idx) => `
                <div class="tut-step-dot ${idx + 1 === currentTutStepSA ? 'active' : ''}" data-step="${idx + 1}"></div>
            `).join('');
            dots.querySelectorAll('.tut-step-dot').forEach(d => {
                d.onclick = () => {
                    currentTutStepSA = parseInt(d.getAttribute('data-step'), 10);
                    renderTutorialSlideSA();
                };
            });
        }

        // Prev Button
        const btnPrev = document.getElementById('btnTutPrev');
        if (btnPrev) {
            btnPrev.disabled = (currentTutStepSA === 1);
            btnPrev.onclick = () => {
                if (currentTutStepSA > 1) {
                    currentTutStepSA--;
                    renderTutorialSlideSA();
                }
            };
        }

        // Next Button
        const btnNext = document.getElementById('btnTutNext');
        if (btnNext) {
            if (currentTutStepSA === TUTORIAL_STEPS_SA.length) {
                btnNext.className = 'tut-nav-btn finish';
                btnNext.innerHTML = `<i class="fa-solid fa-play"></i> <span>${isKo ? '게임 시작하기' : 'Start Playing'}</span>`;
                btnNext.onclick = () => {
                    closeTutorialSA();
                };
            } else {
                btnNext.className = 'tut-nav-btn next';
                btnNext.innerHTML = `<span>${isKo ? '다음' : 'Next'}</span> <i class="fa-solid fa-arrow-right"></i>`;
                btnNext.onclick = () => {
                    if (currentTutStepSA < TUTORIAL_STEPS_SA.length) {
                        currentTutStepSA++;
                        renderTutorialSlideSA();
                    }
                };
            }
        }

        // Hook up 3D card flip toggle in Step 2
        const btnFlip = document.getElementById('btnToggleSaCardFlip');
        const demoCard = document.getElementById('saDemoCard');
        const flipAction = () => {
            demoCardFlippedSA = !demoCardFlippedSA;
            if (demoCard) {
                if (demoCardFlippedSA) demoCard.classList.add('flipped');
                else demoCard.classList.remove('flipped');
            }
            const desc = document.getElementById('saDemoFlipDesc');
            if (desc) {
                desc.innerHTML = demoCardFlippedSA ?
                    `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> ${isKo ? '뒤집힌 활성 숫자: <strong>[8] (강력한 양반 카드!)</strong>' : 'Flipped active number: <strong>[8] (Mighty Noble Card!)</strong>'}` :
                    `<i class="fa-solid fa-circle-info"></i> ${isKo ? '현재 활성 숫자: [3] (하단의 [8]은 뒤집히기 전까지 쓸 수 없음)' : 'Currently active: [3] (bottom [8] is dormant until flipped)'}`;
            }
        };

        if (btnFlip) btnFlip.onclick = flipAction;
        if (demoCard) demoCard.onclick = flipAction;

        // Hook up Start Game Now button in step 6
        const btnStartNow = document.getElementById('btnTutStartGameNowSA');
        if (btnStartNow) {
            btnStartNow.onclick = () => {
                closeTutorialSA();
            };
        }
    }

    function setupTutorialEventsSA() {
        const btnTut = document.getElementById('btnTutorial');
        if (btnTut) {
            btnTut.onclick = () => openTutorialSA(1);
        }

        const btnTutModal = document.getElementById('btnOpenTutorialFromModal');
        if (btnTutModal) {
            btnTutModal.onclick = () => {
                const modalNew = document.getElementById('newGameModal');
                if (modalNew) modalNew.classList.remove('active');
                openTutorialSA(1);
            };
        }

        const closeBtn = document.getElementById('closeTutorialModal');
        if (closeBtn) {
            closeBtn.onclick = closeTutorialSA;
        }

        // Progress bar click
        const barItems = document.querySelectorAll('#tutProgressBar .tut-step-bar-item');
        barItems.forEach(item => {
            item.onclick = () => {
                const s = parseInt(item.getAttribute('data-step'), 10);
                if (s) {
                    currentTutStepSA = s;
                    renderTutorialSlideSA();
                }
            };
        });

        // Auto-open via URL parameter ?tutorial=1
        try {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('tutorial') === '1' || urlParams.get('t') === '1') {
                setTimeout(() => openTutorialSA(1), 350);
            }
        } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupEvents();
        setupTutorialEventsSA();
        initGame({ playerCount: 4, gameMode: 'ai' });
        window.__sa_game = { state, handleTrickEnd, triggerSpecialAbility, render, processNextLoserFlip };
    });

})();
