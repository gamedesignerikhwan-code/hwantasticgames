(function () {
    'use strict';

    // Past Lives Card Database (70 Cards from 212. Past Lives 250326)
    const SYMBOLS = {
        LOVER: { id: 'LOVER', icon: '❤', name: { ko: '연인', en: 'Lover' }, color: '#f43f5e', type: 'positive' },
        FRIEND: { id: 'FRIEND', icon: '🤝', name: { ko: '친구', en: 'Friend' }, color: '#10b981', type: 'positive' },
        COLLEAGUE: { id: 'COLLEAGUE', icon: '💡', name: { ko: '동료', en: 'Colleague' }, color: '#f59e0b', type: 'positive' },
        WAR: { id: 'WAR', icon: '⚔', name: { ko: '전쟁', en: 'War' }, color: '#ef4444', type: 'negative' },
        STEAL: { id: 'STEAL', icon: '🥷', name: { ko: '도둑', en: 'Steal' }, color: '#6366f1', type: 'negative' },
        CONFLICT: { id: 'CONFLICT', icon: '⚡', name: { ko: '갈등', en: 'Conflict' }, color: '#eab308', type: 'negative' },
        IGNORE_LEFT: { id: 'IGNORE_LEFT', icon: '# ←', name: { ko: '좌측 무효화', en: 'Ignore Left' }, color: '#14b8a6', type: 'special' },
        IGNORE_RIGHT: { id: 'IGNORE_RIGHT', icon: '→ #', name: { ko: '우측 무효화', en: 'Ignore Right' }, color: '#06b6d4', type: 'special' },
        DOUBLE_LEFT: { id: 'DOUBLE_LEFT', icon: '2*# ←', name: { ko: '좌측 2배', en: 'Double Left' }, color: '#ec4899', type: 'special' },
        DOUBLE_RIGHT: { id: 'DOUBLE_RIGHT', icon: '→ 2*#', name: { ko: '우측 2배', en: 'Double Right' }, color: '#8b5cf6', type: 'special' }
    };

    const ERA_COLORS = {
        1: '#ef4444',
        2: '#f59e0b',
        3: '#10b981',
        4: '#3b82f6',
        5: '#a855f7',
        6: '#64748b'
    };

    const ERA_NAMES = {
        ko: { 1: '1시대 (01~10)', 2: '2시대 (11~20)', 3: '3시대 (21~30)', 4: '4시대 (31~40)', 5: '5시대 (41~50)', 6: '6시대 (51~60)' },
        en: { 1: 'Era 1 (01~10)', 2: 'Era 2 (11~20)', 3: 'Era 3 (21~30)', 4: 'Era 4 (31~40)', 5: 'Era 5 (41~50)', 6: 'Era 6 (51~60)' }
    };

    const CARDS_MAP = {
        // 1시대 (01~10): 유년기
        1: 'COLLEAGUE', 2: 'CONFLICT', 3: 'STEAL', 4: 'FRIEND', 5: 'COLLEAGUE',
        6: 'CONFLICT', 7: 'STEAL', 8: 'FRIEND', 9: 'CONFLICT', 10: 'COLLEAGUE',
        // 2시대 (11~20): 청소년기
        11: 'CONFLICT', 12: 'STEAL', 13: 'FRIEND', 14: 'IGNORE_RIGHT', 15: 'WAR',
        16: 'CONFLICT', 17: 'LOVER', 18: 'DOUBLE_RIGHT', 19: 'FRIEND', 20: 'COLLEAGUE',
        // 3시대 (21~30): 청년기
        21: 'LOVER', 22: 'WAR', 23: 'FRIEND', 24: 'DOUBLE_LEFT', 25: 'WAR',
        26: 'IGNORE_LEFT', 27: 'STEAL', 28: 'LOVER', 29: 'COLLEAGUE', 30: 'LOVER',
        // 4시대 (31~40): 중년기
        31: 'FRIEND', 32: 'IGNORE_RIGHT', 33: 'WAR', 34: 'DOUBLE_RIGHT', 35: 'LOVER',
        36: 'LOVER', 37: 'WAR', 38: 'CONFLICT', 39: 'STEAL', 40: 'COLLEAGUE',
        // 5시대 (41~50): 장년기
        41: 'COLLEAGUE', 42: 'DOUBLE_LEFT', 43: 'WAR', 44: 'IGNORE_LEFT', 45: 'LOVER',
        46: 'CONFLICT', 47: 'COLLEAGUE', 48: 'FRIEND', 49: 'STEAL', 50: 'CONFLICT',
        // 6시대 (51~60): 노년기
        51: 'COLLEAGUE', 52: 'CONFLICT', 53: 'STEAL', 54: 'FRIEND', 55: 'COLLEAGUE',
        56: 'CONFLICT', 57: 'STEAL', 58: 'FRIEND', 59: 'WAR', 60: 'COLLEAGUE'
    };

    const SCORING_TABLE = {
        LOVER: { 3: 12, 4: 25, 5: 50 },
        FRIEND: { 3: 7, 4: 15, 5: 30 },
        COLLEAGUE: { 3: 5, 4: 10, 5: 20 },
        WAR: { 2: -10, 3: -20, 4: -40 },
        STEAL: { 2: -6, 3: -12, 4: -25 },
        CONFLICT: { 2: -3, 3: -7, 4: -15 }
    };

    function buildMasterDeck() {
        const deck = [];
        for (let order = 1; order <= 60; order++) {
            const symKey = CARDS_MAP[order];
            const era = Math.floor((order - 1) / 10) + 1;
            deck.push({
                order,
                orderStr: order < 10 ? `0${order}` : `${order}`,
                symbol: symKey,
                symInfo: SYMBOLS[symKey],
                era,
                eraColor: ERA_COLORS[era]
            });
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
        if (type === 'select') {
            playTone(520, 'sine', 0.08, 0.08);
        } else if (type === 'bid') {
            playTone(440, 'triangle', 0.12, 0.1);
            setTimeout(() => playTone(660, 'triangle', 0.16, 0.1), 80);
        } else if (type === 'reveal') {
            [330, 440, 550, 660].forEach((f, i) => {
                setTimeout(() => playTone(f, 'sine', 0.18, 0.08), i * 70);
            });
        } else if (type === 'play') {
            playTone(600, 'sine', 0.1, 0.08);
            setTimeout(() => playTone(800, 'sine', 0.15, 0.08), 70);
        } else if (type === 'special') {
            [587, 740, 880, 1174].forEach((f, i) => {
                setTimeout(() => playTone(f, 'triangle', 0.22, 0.1), i * 90);
            });
        } else if (type === 'win') {
            [523, 659, 784, 1046, 1318].forEach((f, i) => {
                setTimeout(() => playTone(f, 'sine', 0.35, 0.12), i * 110);
            });
        }
    }

    // State
    const state = {
        lang: 'ko',
        soundEnabled: true,
        playerCount: 3,
        round: 1,
        totalRounds: 6,
        phase: 'bid', // 'bid', 'set_choice', 'exchange', 'game_over'
        deck: [],
        floorSets: [], // Array of { topCard, bottomCard, awardedToPlayerId }
        prevBids: [],  // To become next round's top cards
        players: [],
        selectedBidCard: null,
        pendingSetChoice: null, // { player, set, topCard, bottomCard }
        exchangeData: null
    };

    // Shuffling
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Game Setup
    function initGame(options = {}) {
        state.playerCount = options.playerCount || 3;
        state.round = 1;
        state.totalRounds = 6;
        state.phase = 'bid';
        state.selectedBidCard = null;
        state.pendingSetChoice = null;
        state.prevBids = [];

        // Player count rules (60 Cards / 6 Eras Edition):
        // 5P: 60 cards (0 removed), hand 5, 6 rounds
        // 4P: 44 cards (16 removed), hand 4, 6 rounds
        // 3P: 33 cards (27 removed), hand 4, 6 rounds
        // 2P: 22 cards (38 removed), hand 4, 6 rounds
        let totalCardsUsing = 60;
        let startHandSize = 5;
        state.totalRounds = 6;

        if (state.playerCount === 2) {
            totalCardsUsing = 22;
            startHandSize = 4;
        } else if (state.playerCount === 3) {
            totalCardsUsing = 33;
            startHandSize = 4;
        } else if (state.playerCount === 4) {
            totalCardsUsing = 44;
            startHandSize = 4;
        } else {
            totalCardsUsing = 60;
            startHandSize = 5;
        }

        const master = shuffle(buildMasterDeck());
        const gameDeck = master.slice(0, totalCardsUsing);

        // Initialize Players
        state.players = [];
        for (let i = 0; i < state.playerCount; i++) {
            const isHuman = (i === 0);
            const hand = gameDeck.splice(0, startHandSize);
            hand.sort((a, b) => a.order - b.order);

            state.players.push({
                id: i,
                name: isHuman ? (state.lang === 'ko' ? '나 (플레이어)' : 'You (Player)') : `AI ${i}`,
                isHuman,
                hand,
                played: [], // Array of played cards (sorted ascending)
                bidCard: null,
                score: 0
            });
        }

        state.deck = gameDeck;

        // Setup Round 1 Floor SETs
        setupFloorRound1();

        render();
    }

    // Round 1 Floor: N top cards (sorted ascending), N bottom cards (random)
    function setupFloorRound1() {
        const N = state.playerCount;
        const topCards = state.deck.splice(0, N);
        topCards.sort((a, b) => a.order - b.order);

        const bottomCards = state.deck.splice(0, N);

        state.floorSets = [];
        for (let i = 0; i < N; i++) {
            state.floorSets.push({
                setIndex: i,
                topCard: topCards[i],
                bottomCard: bottomCards[i],
                awardedPlayerId: null
            });
        }
    }

    // Subsequent Rounds Floor:
    // Top row = previous round's bids (sorted ascending)
    // Bottom row = N new cards from deck
    function setupFloorNextRound() {
        const N = state.playerCount;
        const topCards = [...state.prevBids];
        topCards.sort((a, b) => a.order - b.order);

        const bottomCards = state.deck.splice(0, N);

        state.floorSets = [];
        for (let i = 0; i < N; i++) {
            state.floorSets.push({
                setIndex: i,
                topCard: topCards[i],
                bottomCard: bottomCards[i],
                awardedPlayerId: null
            });
        }
        state.prevBids = [];
    }

    // AI Bid Card Selection Heuristic
    function chooseAiBidCard(ai) {
        if (!ai.hand || ai.hand.length === 0) return null;

        // Evaluate floor sets value
        const setScores = state.floorSets.map((s, idx) => {
            let val = 0;
            [s.topCard, s.bottomCard].forEach(c => {
                if (!c) return;
                const sym = c.symbol;
                if (sym === 'LOVER') val += 5;
                else if (sym === 'FRIEND') val += 3;
                else if (sym === 'COLLEAGUE') val += 2;
                else if (sym === 'WAR') val -= 4;
                else if (sym === 'STEAL') val -= 3;
                else if (sym === 'CONFLICT') val -= 2;
                else if (sym.startsWith('DOUBLE')) val += 4;
                else if (sym.startsWith('IGNORE')) val += 3;
            });
            return { idx, val };
        });

        // Lowest index gets Set with lowest top card (idx 0)
        // If Set 0 is best, AI wants lowest card in hand!
        // If Set N-1 is best, AI wants highest card in hand!
        setScores.sort((a, b) => b.val - a.val);
        const desiredSetRank = setScores[0].idx; // 0 to N-1

        const ratio = desiredSetRank / Math.max(1, state.playerCount - 1);
        const handSorted = [...ai.hand].sort((a, b) => a.order - b.order);
        let targetIndex = Math.round(ratio * (handSorted.length - 1));
        // Add minor randomness
        if (Math.random() < 0.3) {
            targetIndex = Math.max(0, Math.min(handSorted.length - 1, targetIndex + (Math.random() < 0.5 ? 1 : -1)));
        }

        return handSorted[targetIndex];
    }

    // AI Play vs Keep Choice
    function chooseAiPlayCard(ai, c1, c2) {
        // Evaluate which card is better to play into played line vs keep in hand
        function evalCardForPlay(c) {
            let score = 0;
            const sym = c.symbol;
            if (sym === 'LOVER') score += 10;
            else if (sym === 'FRIEND') score += 7;
            else if (sym === 'COLLEAGUE') score += 5;
            else if (sym === 'WAR') score -= 8;
            else if (sym === 'STEAL') score -= 6;
            else if (sym === 'CONFLICT') score -= 4;
            else if (sym.startsWith('DOUBLE')) score += 6;
            else if (sym.startsWith('IGNORE')) score += 4;
            return score;
        }

        return evalCardForPlay(c1) >= evalCardForPlay(c2) ? c1 : c2;
    }

    // Submit Human Bid
    function submitHumanBid() {
        if (!state.selectedBidCard) return;

        const human = state.players[0];
        human.bidCard = state.selectedBidCard;
        human.hand = human.hand.filter(c => c.order !== state.selectedBidCard.order);
        state.selectedBidCard = null;

        // AI Bids
        for (let i = 1; i < state.playerCount; i++) {
            const ai = state.players[i];
            const bid = chooseAiBidCard(ai);
            ai.bidCard = bid;
            ai.hand = ai.hand.filter(c => c.order !== bid.order);
        }

        playSound('bid');
        resolveBidsAndAwardSets();
    }

    // Reveal Bids & Award SETs
    function resolveBidsAndAwardSets() {
        state.phase = 'reveal';
        playSound('reveal');

        // Sort all bids in ascending order
        const bidsWithPlayers = state.players.map(p => ({
            player: p,
            bidCard: p.bidCard
        }));
        bidsWithPlayers.sort((a, b) => a.bidCard.order - b.bidCard.order);

        // Keep bids for next round's top row!
        state.prevBids = bidsWithPlayers.map(bp => bp.bidCard);

        // Award SETs in order: lowest bid gets Set 0, 2nd gets Set 1, etc.
        const awards = [];
        bidsWithPlayers.forEach((bp, rankIdx) => {
            const set = state.floorSets[rankIdx];
            set.awardedPlayerId = bp.player.id;
            awards.push({
                player: bp.player,
                set,
                rankIdx
            });
        });

        // Trigger Play/Keep modal for Human
        const humanAward = awards.find(a => a.player.isHuman);
        const aiAwards = awards.filter(a => !a.player.isHuman);

        // AI resolves immediately
        aiAwards.forEach(a => {
            const cToPlay = chooseAiPlayCard(a.player, a.set.topCard, a.set.bottomCard);
            const cToKeep = (cToPlay.order === a.set.topCard.order) ? a.set.bottomCard : a.set.topCard;

            a.player.played.push(cToPlay);
            a.player.played.sort((x, y) => x.order - y.order);
            a.player.hand.push(cToKeep);
            a.player.hand.sort((x, y) => x.order - y.order);
        });

        render();

        // Prompt human
        showSetChoiceModal(humanAward.set, (playedCard, keptCard) => {
            humanAward.player.played.push(playedCard);
            humanAward.player.played.sort((x, y) => x.order - y.order);
            humanAward.player.hand.push(keptCard);
            humanAward.player.hand.sort((x, y) => x.order - y.order);

            playSound('play');
            completeRound();
        });
    }

    // Modal: Choose which card to Play vs Keep
    function showSetChoiceModal(set, callback) {
        const modal = document.getElementById('setChoiceModal');
        const container = document.getElementById('setChoiceCardsContainer');
        if (!modal || !container) {
            callback(set.topCard, set.bottomCard);
            return;
        }

        const isKo = (state.lang === 'ko');
        document.getElementById('setChoiceModalTitle').textContent = isKo ? '세트 획득! 배치할 카드 선택' : 'SET Claimed! Choose Card to Play';
        document.getElementById('setChoiceModalDesc').textContent = isKo ? 
            '획득한 2장 중 1장을 내 배치 영역(Play)에 놓고, 다른 1장은 손(Hand)으로 가져옵니다.' :
            'Choose 1 card to PLAY into your scoring area. The other returns to your hand.';

        const renderMiniCard = (c) => `
            <div class="pl-card" style="pointer-events:none;">
                <div class="card-symbol-top ${c.symInfo.type === 'special' ? 'sym-special' : 'sym-' + c.symbol.toLowerCase()}">
                    ${c.symInfo.icon}
                </div>
                <div class="card-order-bottom">
                    <span class="card-order-num" style="color:${c.eraColor};">${c.orderStr}</span>
                    <span class="card-era-pip" style="background:${c.eraColor};"></span>
                </div>
            </div>
        `;

        container.innerHTML = `
            <button type="button" class="set-choice-btn" id="btnChooseTop">
                ${renderMiniCard(set.topCard)}
                <div style="font-weight:800; font-size:0.85rem; color:var(--gold);">${isKo ? '이 카드 배치 (Play)' : 'Play this card'}</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">${set.topCard.symInfo.name[state.lang]} (#${set.topCard.orderStr})</div>
            </button>
            <button type="button" class="set-choice-btn" id="btnChooseBottom">
                ${renderMiniCard(set.bottomCard)}
                <div style="font-weight:800; font-size:0.85rem; color:var(--gold);">${isKo ? '이 카드 배치 (Play)' : 'Play this card'}</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">${set.bottomCard.symInfo.name[state.lang]} (#${set.bottomCard.orderStr})</div>
            </button>
        `;

        document.getElementById('btnChooseTop').onclick = () => {
            modal.classList.remove('active');
            callback(set.topCard, set.bottomCard);
        };

        document.getElementById('btnChooseBottom').onclick = () => {
            modal.classList.remove('active');
            callback(set.bottomCard, set.topCard);
        };

        modal.classList.add('active');
    }

    // Complete Round
    function completeRound() {
        // Reset player bids
        state.players.forEach(p => p.bidCard = null);

        if (state.deck.length === 0 || state.round >= state.totalRounds) {
            // Deck is depleted! Enter Final Round: Secret Connection Exchange
            startExchangePhase();
        } else {
            state.round++;
            state.phase = 'bid';
            setupFloorNextRound();
            render();
        }
    }

    // Secret Exchange Phase (End Game Step 5)
    // Each player secretly gives 1 card to each opponent and keeps 1 card.
    function startExchangePhase() {
        state.phase = 'exchange';
        playSound('special');
        showExchangeModal();
        render();
    }

    function showExchangeModal() {
        const modal = document.getElementById('exchangeModal');
        const container = document.getElementById('exchangeAssignmentsContainer');
        if (!modal || !container) {
            resolveExchange([]);
            return;
        }

        const isKo = (state.lang === 'ko');
        const human = state.players[0];
        const opponents = state.players.slice(1);

        document.getElementById('exchangeModalTitle').textContent = isKo ? '마지막 비밀 인연 교환' : 'Final Secret Connection Exchange';
        document.getElementById('exchangeModalDesc').textContent = isKo ?
            `손에 남은 카드(${human.hand.length}장) 중 각 상대 플레이어에게 1장씩 건네고, 1장은 자신이 가집니다.` :
            `Secretly give 1 card to each opponent, and keep 1 card for yourself.`;

        // Render cards and assignment dropdowns/buttons
        const assignments = {}; // cardOrder -> target: 'keep' or opponent.id

        function renderExchangeUI() {
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:12px; width:100%;">
                    <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
                        ${human.hand.map(c => {
                            const currentTarget = assignments[c.order] !== undefined ? assignments[c.order] : 'keep';
                            return `
                                <div style="display:flex; flex-direction:column; align-items:center; gap:4px; background:rgba(255,255,255,0.04); padding:6px; border-radius:6px; border:1px solid var(--border-glass);">
                                    <div class="pl-card" style="pointer-events:none;">
                                        <div class="card-symbol-top ${c.symInfo.type === 'special' ? 'sym-special' : 'sym-' + c.symbol.toLowerCase()}">
                                            ${c.symInfo.icon}
                                        </div>
                                        <div class="card-order-bottom">
                                            <span class="card-order-num" style="color:${c.eraColor};">${c.orderStr}</span>
                                            <span class="card-era-pip" style="background:${c.eraColor};"></span>
                                        </div>
                                    </div>
                                    <select class="exchange-assign-select" data-card="${c.order}" style="font-size:0.75rem; padding:3px; background:#0f172a; color:#fff; border:1px solid var(--border-glass); border-radius:4px;">
                                        <option value="keep" ${currentTarget === 'keep' ? 'selected' : ''}>${isKo ? '내 배치 (Keep)' : 'Keep for Self'}</option>
                                        ${opponents.map(o => `
                                            <option value="${o.id}" ${currentTarget === o.id ? 'selected' : ''}>${o.name}에게 주기</option>
                                        `).join('')}
                                        <option value="discard" ${currentTarget === 'discard' ? 'selected' : ''}>${isKo ? '버리기 (Discard)' : 'Discard'}</option>
                                    </select>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <button type="button" class="btn-play-again" id="btnConfirmExchange" style="margin-top:10px;">${isKo ? '인연 교환 확정' : 'Confirm Exchange'}</button>
                </div>
            `;

            container.querySelectorAll('.exchange-assign-select').forEach(sel => {
                sel.onchange = () => {
                    const cOrder = parseInt(sel.getAttribute('data-card'), 10);
                    const val = sel.value;
                    assignments[cOrder] = (val === 'keep' || val === 'discard') ? val : parseInt(val, 10);
                };
            });

            document.getElementById('btnConfirmExchange').onclick = () => {
                modal.classList.remove('active');
                resolveExchange(assignments);
            };
        }

        // Initialize default assignment
        human.hand.forEach((c, i) => {
            if (i < opponents.length) {
                assignments[c.order] = opponents[i].id;
            } else if (i === opponents.length) {
                assignments[c.order] = 'keep';
            } else {
                assignments[c.order] = 'discard';
            }
        });

        renderExchangeUI();
        modal.classList.add('active');
    }

    // Resolve Secret Exchange & Score
    function resolveExchange(humanAssignments) {
        // Collect cards to distribute
        // Human player distribution
        const human = state.players[0];
        const humanCardsToOpponents = {};
        let humanKeep = null;

        human.hand.forEach(c => {
            const dest = humanAssignments[c.order];
            if (dest === 'keep') {
                humanKeep = c;
            } else if (typeof dest === 'number') {
                humanCardsToOpponents[dest] = c;
            }
        });

        if (!humanKeep && human.hand.length > 0) humanKeep = human.hand[0];

        // AI distributions
        const aiDistributions = {};
        for (let i = 1; i < state.playerCount; i++) {
            const ai = state.players[i];
            const sortedHand = [...ai.hand].sort((a, b) => {
                // negative cards first (give away bad cards!)
                const getPrio = (c) => (c.symInfo.type === 'negative' ? -10 : 10);
                return getPrio(a) - getPrio(b);
            });

            const otherPlayers = state.players.filter(p => p.id !== ai.id);
            aiDistributions[ai.id] = {
                give: {},
                keep: sortedHand[sortedHand.length - 1] // keep best positive card
            };

            otherPlayers.forEach((op, opIdx) => {
                aiDistributions[ai.id].give[op.id] = sortedHand[opIdx];
            });
        }

        // Merge all exchanged cards into players' played lines
        // 1. Human receives from AI opponents + keeps 1
        human.played.push(humanKeep);
        for (let i = 1; i < state.playerCount; i++) {
            const givenCard = aiDistributions[i].give[human.id];
            if (givenCard) human.played.push(givenCard);
        }
        human.played.sort((a, b) => a.order - b.order);

        // 2. AI players receive from Human and other AIs + keep 1
        for (let i = 1; i < state.playerCount; i++) {
            const ai = state.players[i];
            ai.played.push(aiDistributions[ai.id].keep);
            if (humanCardsToOpponents[ai.id]) {
                ai.played.push(humanCardsToOpponents[ai.id]);
            }
            // from other AIs
            for (let j = 1; j < state.playerCount; j++) {
                if (j !== i && aiDistributions[j].give[ai.id]) {
                    ai.played.push(aiDistributions[j].give[ai.id]);
                }
            }
            ai.played.sort((a, b) => a.order - b.order);
        }

        // Empty all hands
        state.players.forEach(p => p.hand = []);

        // Step 5 & 6: Resolve Special Cards & Final Scoring
        resolveFinalScoring();
    }

    // Special Cards Resolution Engine
    function resolveSpecialCards(playedCards) {
        const line = playedCards.map(c => ({ ...c }));
        line.sort((a, b) => a.order - b.order);

        const SPECIAL_TYPES = new Set(['IGNORE_LEFT', 'IGNORE_RIGHT', 'DOUBLE_LEFT', 'DOUBLE_RIGHT']);

        // Step 1: Remove special cards pointing to another special card or out of bounds
        let changed = true;
        while (changed) {
            changed = false;
            for (let i = 0; i < line.length; i++) {
                const sym = line[i].symbol;
                if (SPECIAL_TYPES.has(sym)) {
                    let targetIdx = (sym === 'IGNORE_LEFT' || sym === 'DOUBLE_LEFT') ? i - 1 : i + 1;
                    if (targetIdx < 0 || targetIdx >= line.length || SPECIAL_TYPES.has(line[targetIdx].symbol)) {
                        line.splice(i, 1);
                        changed = true;
                        break;
                    }
                }
            }
        }

        // Step 2: Apply valid special cards to adjacent regular cards
        const ignoredIndices = new Set();
        const multipliers = {};
        for (let i = 0; i < line.length; i++) multipliers[i] = 1;

        for (let i = 0; i < line.length; i++) {
            const sym = line[i].symbol;
            if (SPECIAL_TYPES.has(sym)) {
                let targetIdx = (sym === 'IGNORE_LEFT' || sym === 'DOUBLE_LEFT') ? i - 1 : i + 1;
                if (targetIdx >= 0 && targetIdx < line.length && !SPECIAL_TYPES.has(line[targetIdx].symbol)) {
                    if (sym === 'IGNORE_LEFT' || sym === 'IGNORE_RIGHT') {
                        ignoredIndices.add(targetIdx);
                    } else if (sym === 'DOUBLE_LEFT' || sym === 'DOUBLE_RIGHT') {
                        multipliers[targetIdx] *= 2;
                    }
                }
            }
        }

        // Step 3: Count symbols and eras
        const symbolCounts = {};
        const eraCounts = {};
        const activeCards = [];

        for (let i = 0; i < line.length; i++) {
            const card = line[i];
            if (SPECIAL_TYPES.has(card.symbol) || ignoredIndices.has(i)) continue;

            const mult = multipliers[i];
            symbolCounts[card.symbol] = (symbolCounts[card.symbol] || 0) + mult;
            eraCounts[card.era] = (eraCounts[card.era] || 0) + mult;
            activeCards.push({ ...card, effectiveCount: mult });
        }

        return { symbolCounts, eraCounts, activeCards, line, ignoredIndices, multipliers };
    }

    // Final Scoring
    function resolveFinalScoring() {
        state.phase = 'game_over';

        // 1. Calculate symbol scores
        const playerResults = state.players.map(p => {
            const res = resolveSpecialCards(p.played);
            let score = 0;

            const breakdown = {};
            for (const [sym, count] of Object.entries(res.symbolCounts)) {
                const tbl = SCORING_TABLE[sym];
                let pts = 0;
                if (sym === 'LOVER' || sym === 'FRIEND' || sym === 'COLLEAGUE') {
                    if (count >= 5) pts = tbl[5];
                    else if (count === 4) pts = tbl[4];
                    else if (count === 3) pts = tbl[3];
                } else {
                    if (count >= 4) pts = tbl[4];
                    else if (count === 3) pts = tbl[3];
                    else if (count === 2) pts = tbl[2];
                }
                breakdown[sym] = { count, pts };
                score += pts;
            }

            // Highest count in any single era
            let maxEraCount = 0;
            let bestEra = null;
            for (const [era, count] of Object.entries(res.eraCounts)) {
                if (count > maxEraCount) {
                    maxEraCount = count;
                    bestEra = era;
                }
            }

            return {
                player: p,
                res,
                breakdown,
                maxEraCount,
                bestEra,
                rawScore: score,
                totalScore: score
            };
        });

        // 2. Same-Era majority bonus (+10 pts)
        let highestEraCountAcrossPlayers = 0;
        playerResults.forEach(pr => {
            if (pr.maxEraCount > highestEraCountAcrossPlayers) {
                highestEraCountAcrossPlayers = pr.maxEraCount;
            }
        });

        playerResults.forEach(pr => {
            pr.hasEraBonus = (highestEraCountAcrossPlayers > 0 && pr.maxEraCount === highestEraCountAcrossPlayers);
            if (pr.hasEraBonus) {
                pr.totalScore += 10;
            }
            pr.player.score = pr.totalScore;
        });

        // Sort descending
        playerResults.sort((a, b) => b.totalScore - a.totalScore);

        render();
        playSound('win');
        showVictoryModal(playerResults);
    }

    // Victory Screen
    function showVictoryModal(results) {
        const modal = document.getElementById('victoryModal');
        const list = document.getElementById('victoryScoresList');
        const title = document.getElementById('victoryWinnerTitle');
        if (!modal || !list) return;

        const isKo = (state.lang === 'ko');
        const winner = results[0];
        const isHumanWinner = winner.player.isHuman;

        title.textContent = isHumanWinner ? 
            (isKo ? '🎉 승리! 전생의 좋은 인연이 맺어졌습니다!' : '🎉 Victory! Beautiful Past Connections Reunited!') :
            (isKo ? `👑 ${winner.player.name} 승리!` : `👑 ${winner.player.name} Won!`);

        list.innerHTML = `
            <table class="scores-comparison">
                <thead>
                    <tr>
                        <th>${isKo ? '순위' : 'Rank'}</th>
                        <th>${isKo ? '플레이어' : 'Player'}</th>
                        <th>${isKo ? '길연 (연·친·동)' : 'Positive'}</th>
                        <th>${isKo ? '악연 (전·도·갈)' : 'Negative'}</th>
                        <th>${isKo ? '시대 보너스' : 'Era Bonus'}</th>
                        <th>${isKo ? '총점' : 'Total'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map((r, rank) => {
                        let pos = 0;
                        let neg = 0;
                        ['LOVER', 'FRIEND', 'COLLEAGUE'].forEach(s => {
                            if (r.breakdown[s]) pos += r.breakdown[s].pts;
                        });
                        ['WAR', 'STEAL', 'CONFLICT'].forEach(s => {
                            if (r.breakdown[s]) neg += r.breakdown[s].pts;
                        });

                        return `
                            <tr style="${r.player.isHuman ? 'background:rgba(245,158,11,0.12); font-weight:800;' : ''}">
                                <td>#${rank + 1}</td>
                                <td>${r.player.name}</td>
                                <td style="color:#34d399;">+${pos}p</td>
                                <td style="color:#f87171;">${neg}p</td>
                                <td style="color:${r.hasEraBonus ? 'var(--gold)' : 'var(--text-muted)'}; font-weight:${r.hasEraBonus ? '900' : '400'};">
                                    ${r.hasEraBonus ? '+10p' : '0p'}
                                </td>
                                <td style="font-size:0.95rem; font-weight:900; color:var(--gold);">${r.totalScore} pt</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        modal.classList.add('active');
    }

    // Render Function
    function render() {
        const isKo = (state.lang === 'ko');

        // Update Turn Status
        const statusBadge = document.getElementById('turnStatusBadge');
        if (statusBadge) {
            if (state.phase === 'exchange') {
                statusBadge.className = 'status-badge phase-exchange';
                statusBadge.innerHTML = `<i class="fa-solid fa-arrows-split-up-and-left"></i> ${isKo ? '비밀 인연 교환 단계' : 'Secret Exchange Phase'}`;
            } else if (state.phase === 'game_over') {
                statusBadge.className = 'status-badge';
                statusBadge.innerHTML = `<i class="fa-solid fa-trophy"></i> ${isKo ? '게임 종료 및 정산' : 'Game Over'}`;
            } else {
                statusBadge.className = 'status-badge';
                statusBadge.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ${isKo ? `라운드 ${state.round}/${state.totalRounds}` : `Round ${state.round}/${state.totalRounds}`}`;
            }
        }

        // Update Prompt Banner
        const promptText = document.getElementById('promptText');
        if (promptText) {
            if (state.phase === 'bid') {
                promptText.innerHTML = isKo ? 
                    `<i class="fa-solid fa-hand-pointer"></i> 손에서 이번 라운드에 입찰할 카드 1장을 선택하세요.` : 
                    `<i class="fa-solid fa-hand-pointer"></i> Select 1 card from your hand to bid for this round.`;
            } else if (state.phase === 'exchange') {
                promptText.innerHTML = isKo ?
                    `<i class="fa-solid fa-gift"></i> 각 상대에게 줄 1장과 내가 가질 1장을 배분하세요.` :
                    `<i class="fa-solid fa-gift"></i> Assign 1 card to each opponent and keep 1 for yourself.`;
            } else if (state.phase === 'game_over') {
                promptText.innerHTML = isKo ?
                    `<i class="fa-solid fa-flag-checkered"></i> 게임이 종료되었습니다. 최종 점수를 확인하세요.` :
                    `<i class="fa-solid fa-flag-checkered"></i> Game over! Check the final relationship scores.`;
            }
        }

        // Deck Badge
        const deckBadge = document.getElementById('deckCountBadge');
        if (deckBadge) {
            deckBadge.textContent = isKo ? `남은 덱: ${state.deck.length}장` : `Deck: ${state.deck.length}`;
        }

        // Render Floor SETs
        renderFloorSets();

        // Render Human Hand
        renderHumanHand();

        // Render Players' Played Boards
        renderPlayerBoards();
    }

    // Render Floor SETs Grid
    function renderFloorSets() {
        const grid = document.getElementById('floorSetsGrid');
        if (!grid) return;

        const isKo = (state.lang === 'ko');

        grid.innerHTML = state.floorSets.map((set, idx) => {
            const isAwarded = (set.awardedPlayerId !== null);
            const awardedPlayer = isAwarded ? state.players.find(p => p.id === set.awardedPlayerId) : null;

            return `
                <div class="set-column ${isAwarded ? 'awarded' : ''}">
                    <div class="set-rank-badge">
                        <span>#${idx + 1}</span>
                        <span>${isAwarded ? (awardedPlayer ? awardedPlayer.name : '') : (isKo ? (idx === 0 ? '최저가 획득' : `${idx + 1}번째`) : `Rank ${idx + 1}`)}</span>
                    </div>
                    <div class="set-cards-pair">
                        <div class="set-card-slot slot-top">
                            ${renderCardMarkup(set.topCard)}
                        </div>
                        <div class="set-card-slot slot-bottom">
                            ${renderCardMarkup(set.bottomCard)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Human Hand
    function renderHumanHand() {
        const container = document.getElementById('handCardsRow');
        const btnBid = document.getElementById('btnSubmitBid');
        if (!container) return;

        const human = state.players[0];
        if (!human) return;

        container.innerHTML = human.hand.map(card => {
            const isSelected = (state.selectedBidCard && state.selectedBidCard.order === card.order);
            return `
                <div class="pl-card selectable ${isSelected ? 'selected' : ''}" data-order="${card.order}">
                    <div class="card-symbol-top ${card.symInfo.type === 'special' ? 'sym-special' : 'sym-' + card.symbol.toLowerCase()}">
                        ${card.symInfo.icon}
                    </div>
                    <div class="card-order-bottom">
                        <span class="card-order-num" style="color:${card.eraColor};">${card.orderStr}</span>
                        <span class="card-era-pip" style="background:${card.eraColor};"></span>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.pl-card').forEach(el => {
            el.onclick = () => {
                if (state.phase !== 'bid') return;
                const order = parseInt(el.getAttribute('data-order'), 10);
                const card = human.hand.find(c => c.order === order);
                if (state.selectedBidCard && state.selectedBidCard.order === order) {
                    state.selectedBidCard = null;
                } else {
                    state.selectedBidCard = card;
                    playSound('select');
                }
                renderHumanHand();
            };
        });

        if (btnBid) {
            btnBid.disabled = (state.phase !== 'bid' || !state.selectedBidCard);
            btnBid.onclick = () => submitHumanBid();
        }
    }

    // Render Player Boards (Horizontal Ribbon of Played Cards)
    function renderPlayerBoards() {
        const area = document.getElementById('playersArea');
        if (!area) return;

        const isKo = (state.lang === 'ko');

        area.innerHTML = state.players.map(p => {
            const isHuman = p.isHuman;
            const res = (state.phase === 'game_over') ? resolveSpecialCards(p.played) : null;

            return `
                <div class="player-card-board">
                    <div class="pb-header">
                        <div class="player-info">
                            <div class="player-avatar ${isHuman ? 'human' : 'ai'}">${isHuman ? '나' : p.id}</div>
                            <span class="player-name">${p.name}</span>
                            ${p.bidCard ? `<span class="bid-status-pill ready">${isKo ? '입찰 완료' : 'Bid Placed'}</span>` : ''}
                        </div>
                        <div class="total-score-badge">
                            <i class="fa-solid fa-trophy"></i>
                            <span>${p.score} pt</span>
                        </div>
                    </div>
                    <div class="played-cards-strip">
                        ${p.played.length === 0 ? 
                            `<span style="color:var(--text-muted); font-size:0.75rem; padding-left:4px;">${isKo ? '아직 배치된 카드가 없습니다.' : 'No played cards yet.'}</span>` : 
                            p.played.map((card, cIdx) => {
                                let specialClass = '';
                                if (res && res.ignoredIndices && res.ignoredIndices.has(cIdx)) {
                                    specialClass = 'card-ignored';
                                } else if (res && res.multipliers && res.multipliers[cIdx] > 1) {
                                    specialClass = 'card-doubled';
                                }

                                return `
                                    <div class="played-mini-card ${specialClass}" title="${card.symInfo.name[state.lang]} (#${card.orderStr}) - ${ERA_NAMES[state.lang][card.era]}">
                                        <div class="card-symbol-top ${card.symInfo.type === 'special' ? 'sym-special' : 'sym-' + card.symbol.toLowerCase()}">
                                            ${card.symInfo.icon}
                                        </div>
                                        <div class="card-order-bottom">
                                            <span class="card-order-num" style="color:${card.eraColor};">${card.orderStr}</span>
                                            <span class="card-era-pip" style="background:${card.eraColor};"></span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Helper: Card Markup
    function renderCardMarkup(card) {
        if (!card) return '<div class="pl-card empty" style="opacity:0.2;"></div>';
        return `
            <div class="pl-card" title="${card.symInfo.name[state.lang]} (#${card.orderStr})">
                <div class="card-symbol-top ${card.symInfo.type === 'special' ? 'sym-special' : 'sym-' + card.symbol.toLowerCase()}">
                    ${card.symInfo.icon}
                </div>
                <div class="card-order-bottom">
                    <span class="card-order-num" style="color:${card.eraColor};">${card.orderStr}</span>
                    <span class="card-era-pip" style="background:${card.eraColor};"></span>
                </div>
            </div>
        `;
    }

    // Static text update (i18n)
    function updateStaticTexts() {
        const isKo = (state.lang === 'ko');
        document.title = isKo ? "패스트 라이브즈 (Past Lives) | 환상적인 게임즈" : "Past Lives | Hwantastic Games";
        document.querySelectorAll('[data-i18n-ko]').forEach(el => {
            el.innerHTML = isKo ? el.getAttribute('data-i18n-ko') : el.getAttribute('data-i18n-en');
        });
    }

    // Modal Setups
    function setupModalEvents() {
        // Rulebook modal
        const btnRulebook = document.getElementById('btnRulebook');
        const modalRulebook = document.getElementById('rulebookModal');
        const closeRulebook = document.getElementById('closeRulebookModal');
        if (btnRulebook && modalRulebook) {
            btnRulebook.onclick = () => modalRulebook.classList.add('active');
        }
        if (closeRulebook && modalRulebook) {
            closeRulebook.onclick = () => modalRulebook.classList.remove('active');
        }

        // New game modal
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
        if (btnStart && modalNew) {
            btnStart.onclick = () => {
                const count = parseInt(document.getElementById('selectPlayers').value, 10);
                modalNew.classList.remove('active');
                initGame({ playerCount: count });
            };
        }

        // Play again in victory modal
        const btnPlayAgain = document.getElementById('btnPlayAgain');
        const modalVictory = document.getElementById('victoryModal');
        if (btnPlayAgain && modalVictory) {
            btnPlayAgain.onclick = () => {
                modalVictory.classList.remove('active');
                initGame({ playerCount: state.playerCount });
            };
        }

        // Lang switch
        const btnLang = document.getElementById('btnLangSwitch');
        if (btnLang) {
            btnLang.onclick = () => {
                state.lang = (state.lang === 'ko') ? 'en' : 'ko';
                btnLang.textContent = (state.lang === 'ko') ? 'EN' : '한국어';
                updateStaticTexts();
                render();
            };
        }

        // Sound switch
        const btnSound = document.getElementById('btnSoundSwitch');
        if (btnSound) {
            btnSound.onclick = () => {
                state.soundEnabled = !state.soundEnabled;
                btnSound.innerHTML = state.soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
            };
        }

        // Close on backdrop
        window.onclick = (e) => {
            if (e.target.classList.contains('game-modal-overlay') && !e.target.id.includes('setChoice') && !e.target.id.includes('exchange')) {
                e.target.classList.remove('active');
            }
        };
    }

    // Startup
    window.addEventListener('DOMContentLoaded', () => {
        setupModalEvents();
        updateStaticTexts();
        initGame({ playerCount: 3 });
    });

})();
