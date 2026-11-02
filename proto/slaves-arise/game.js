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
        lang: 'ko',
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
                addLog(
                    `[특수능력 1] 상대에게 넘겨줄 카드와 상대를 선택하세요.`,
                    `[Ability 1] Choose a card and target to give away.`
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
                playSound('special');
                addLog(
                    `[특수능력 1] ${player.name}님이 ${target.name}님에게 카드 1장을 양도했습니다!`,
                    `[Ability 1] ${player.name} gave 1 card to ${target.name}!`
                );
                advanceTurn();
            }
        } else if (num === 5) {
            // Choose a player to flip ALL their hand cards
            if (player.isHuman) {
                state.phase = 'special_5_target';
                addLog(
                    `[특수능력 5] 손패 전체를 뒤집을 대상 플레이어를 선택하세요.`,
                    `[Ability 5] Choose a target player to flip all their hand cards.`
                );
                render();
            } else {
                // AI targets opponent with lowest hand count or human
                const opponents = state.players.filter(p => p.id !== player.id && p.hand.length > 0);
                opponents.sort((a, b) => a.hand.length - b.hand.length);
                const target = opponents[0] || state.players[0];

                target.hand.forEach(flipCard);
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
                    `[특수능력 8] 내 손패 중 뒤집을 카드 1장을 클릭하세요.`,
                    `[Ability 8] Click 1 card in your hand to flip it.`
                );
                render();
            } else {
                // AI flips lowest card
                const sorted = [...player.hand].sort((a, b) => a.top - b.top);
                flipCard(sorted[0]);
                playSound('flip');
                addLog(
                    `[특수능력 8] ${player.name}님이 자신의 손패 카드 1장을 뒤집었습니다.`,
                    `[Ability 8] ${player.name} flipped 1 card in their hand.`
                );
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
            `Losers' Flip: Players who lost the trick flip 1 card in their hand.`
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
            // Prompt human to pick a card to flip
            render();
        } else {
            // AI chooses best card to flip (flip low numbers to high)
            const sorted = [...loser.hand].sort((a, b) => a.top - b.top);
            flipCard(sorted[0]);
            playSound('flip');
            addLog(
                `패자 뒤집기: ${loser.name}님이 카드 1장을 뒤집었습니다.`,
                `Loser Flip: ${loser.name} flipped a card.`
            );
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

        let classes = 'slave-card';
        if (isSelected) classes += ' selected';
        if (isInteractive) classes += ' interactive';
        if (isMini) classes += ' mini-card';
        if (isLoserFlipTarget || isSpecialTarget) classes += ' flip-highlight';

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
        const actionInfo = document.getElementById('playActionInfo');
        if (!handContainer || !btnPlay || !btnPass) return;

        const isKo = (state.lang === 'ko');
        const activePlayer = state.players[state.currentTurnPlayerId];

        // Is it active player's turn to interact?
        const isHumanTurn = activePlayer && activePlayer.isHuman && state.phase === 'play';
        const isLoserFlipPhase = (state.phase === 'loser_flip' && state.pendingLoserFlips.length > 0 && state.players[state.pendingLoserFlips[0]].isHuman);
        const isSpecialFlipPhase = (state.phase === 'special_8_flip');

        const displayPlayer = (state.gameMode === 'pvp') ? 
            (isLoserFlipPhase ? state.players[state.pendingLoserFlips[0]] : activePlayer) : 
            state.players[0];

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
                interactive: isHumanTurn || isLoserFlipPhase || isSpecialFlipPhase,
                canLoserFlip: isLoserFlipPhase,
                canSpecialFlip: isSpecialFlipPhase
            });

            const domCard = cardEl.firstElementChild;

            // Click handling
            domCard.onclick = () => {
                if (isLoserFlipPhase) {
                    // Execute loser flip on this card
                    flipCard(c);
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
                    playSound('flip');
                    addLog(
                        `[특수능력 8] ${displayPlayer.name}님이 #${c.top}번 카드로 자가 반전했습니다!`,
                        `[Ability 8] ${displayPlayer.name} flipped card to #${c.top}!`
                    );
                    state.phase = 'play';
                    advanceTurn();
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

        if (isLoserFlipPhase) {
            actionInfo.innerHTML = `<span style="color:var(--gold); font-weight:bold;">${isKo ? '패자 뒤집기: 손패에서 뒤집을 카드 1장을 클릭하세요!' : 'Loser Flip: Click 1 card in hand to flip!'}</span>`;
        } else if (isSpecialFlipPhase) {
            actionInfo.innerHTML = `<span style="color:#ec4899; font-weight:bold;">${isKo ? '특수 8 반전: 뒤집을 카드 1장을 클릭하세요!' : 'Special 8: Click 1 card to flip!'}</span>`;
        } else if (state.phase === 'special_5_target') {
            actionInfo.innerHTML = `<span style="color:#10b981; font-weight:bold;">${isKo ? '특수 5 발동: 아래 플레이어 목록에서 대상 플레이어를 클릭하세요!' : 'Special 5: Choose a target player below to flip all cards!'}</span>`;
        } else if (state.phase === 'special_1_give') {
            actionInfo.innerHTML = `<span style="color:#f59e0b; font-weight:bold;">${isKo ? '특수 1 발동: 넘겨줄 카드 1장 선택 후 대상 플레이어를 클릭하세요!' : 'Special 1: Pick 1 card and click target player!'}</span>`;
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

        state.players.forEach(p => {
            const isTurn = (p.id === state.currentTurnPlayerId && state.phase === 'play');
            const isSpecialTargetable = (state.phase === 'special_5_target' || state.phase === 'special_1_give') && (p.id !== state.currentTurnPlayerId);

            const cardEl = document.createElement('div');
            cardEl.className = `player-status-card ${isTurn ? 'active-turn' : ''} ${p.passed ? 'passed' : ''} ${isSpecialTargetable ? 'targetable' : ''}`;

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
                ${isSpecialTargetable ? `<button type="button" class="btn-target-select">${isKo ? '이 플레이어 선택' : 'Select Target'}</button>` : ''}
            `;

            if (isSpecialTargetable) {
                cardEl.onclick = () => {
                    if (state.phase === 'special_5_target') {
                        p.hand.forEach(flipCard);
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
                            alert(isKo ? '먼저 내 손패에서 넘겨줄 카드 1장을 선택해 주세요.' : 'Select 1 card from hand to give.');
                            return;
                        }
                        const cardToGive = selected[0];
                        giver.hand = giver.hand.filter(c => c.id !== cardToGive.id);
                        p.hand.push(cardToGive);
                        state.selectedCardIds.clear();
                        playSound('special');
                        addLog(
                            `[특수능력 1] ${giver.name}님이 ${p.name}님에게 #${cardToGive.top}번 카드를 양도했습니다!`,
                            `[Ability 1] ${giver.name} gave #${cardToGive.top} to ${p.name}!`
                        );
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

        const bannerText = document.getElementById('promptBannerText');
        const isKo = (state.lang === 'ko');
        const active = state.players[state.currentTurnPlayerId];

        if (bannerText) {
            if (state.phase === 'play') {
                bannerText.innerHTML = `${active.name}${isKo ? '님의 차례입니다. 바닥보다 더 높은 숫자를 내거나 패스하세요.' : '\'s turn. Play higher or pass.'}`;
            } else if (state.phase === 'loser_flip') {
                bannerText.innerHTML = isKo ? '패자 뒤집기 단계: 트릭에서 진 플레이어는 손패 1장을 뒤집습니다.' : 'Losers\' Flip Phase: Losers flip 1 card.';
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
        // Play / Pass buttons
        const btnPlay = document.getElementById('btnPlayCards');
        const btnPass = document.getElementById('btnPassTurn');

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
            };
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupEvents();
        initGame({ playerCount: 4, gameMode: 'ai' });
    });

})();
