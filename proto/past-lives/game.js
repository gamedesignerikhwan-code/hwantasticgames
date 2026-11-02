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
        1: '#ef4444', // Red (01~10)
        2: '#f59e0b', // Amber/Yellow (11~20)
        3: '#10b981', // Emerald Green (21~30)
        4: '#3b82f6', // Royal Blue (31~40)
        5: '#a855f7', // Purple/Violet (41~50)
        6: '#475569', // Dark Slate/Steel (51~60)
        7: '#06b6d4'  // Cyan/Light Blue (61~70)
    };

    const ERA_NAMES = {
        ko: { 1: '1시대 (01~10)', 2: '2시대 (11~20)', 3: '3시대 (21~30)', 4: '4시대 (31~40)', 5: '5시대 (41~50)', 6: '6시대 (51~60)', 7: '7시대 (61~70)' },
        en: { 1: 'Era 1 (01~10)', 2: 'Era 2 (11~20)', 3: 'Era 3 (21~30)', 4: 'Era 4 (31~40)', 5: 'Era 5 (41~50)', 6: 'Era 6 (51~60)', 7: 'Era 7 (61~70)' }
    };

    // Full 70 Card Database exactly matching PDF 2
    const CARDS_MAP = {
        1: 'COLLEAGUE', 2: 'CONFLICT', 3: 'STEAL', 4: 'CONFLICT', 5: 'COLLEAGUE',
        6: 'STEAL', 7: 'CONFLICT', 8: 'FRIEND', 9: 'CONFLICT', 10: 'COLLEAGUE',
        11: 'CONFLICT', 12: 'STEAL', 13: 'FRIEND', 14: 'COLLEAGUE', 15: 'WAR',
        16: 'CONFLICT', 17: 'COLLEAGUE', 18: 'FRIEND', 19: 'STEAL', 20: 'DOUBLE_RIGHT',
        21: 'LOVER', 22: 'WAR', 23: 'FRIEND', 24: 'WAR', 25: 'COLLEAGUE',
        26: 'IGNORE_LEFT', 27: 'STEAL', 28: 'LOVER', 29: 'IGNORE_RIGHT', 30: 'LOVER',
        31: 'FRIEND', 32: 'DOUBLE_LEFT', 33: 'WAR', 34: 'IGNORE_LEFT', 35: 'LOVER',
        36: 'LOVER', 37: 'IGNORE_RIGHT', 38: 'WAR', 39: 'DOUBLE_RIGHT', 40: 'FRIEND',
        41: 'LOVER', 42: 'IGNORE_RIGHT', 43: 'LOVER', 44: 'STEAL', 45: 'IGNORE_LEFT',
        46: 'COLLEAGUE', 47: 'WAR', 48: 'FRIEND', 49: 'WAR', 50: 'LOVER',
        51: 'DOUBLE_LEFT', 52: 'STEAL', 53: 'FRIEND', 54: 'COLLEAGUE', 55: 'CONFLICT',
        56: 'WAR', 57: 'COLLEAGUE', 58: 'FRIEND', 59: 'STEAL', 60: 'CONFLICT',
        61: 'COLLEAGUE', 62: 'CONFLICT', 63: 'FRIEND', 64: 'CONFLICT', 65: 'STEAL',
        66: 'COLLEAGUE', 67: 'CONFLICT', 68: 'STEAL', 69: 'CONFLICT', 70: 'COLLEAGUE'
    };

    // Scoring reference card (PDF 1 Page 8 & PDF 2 Page 8)
    const SCORING_TABLE = {
        LOVER: { 3: 12, 4: 25, 5: 50 },
        FRIEND: { 3: 7, 4: 15, 5: 30 },
        COLLEAGUE: { 3: 5, 4: 10, 5: 20 },
        WAR: { 2: -10, 3: -20, 4: -40 },
        STEAL: { 2: -6, 3: -12, 4: -25 },
        CONFLICT: { 2: -3, 3: -7, 4: -15 }
    };

    // Setup configuration matching PDF 2 Page 1
    // 5P: 70 cards (0 removed), start hand 5
    // 4P: 56 cards (14 removed), start hand 4
    // 3P: 45 cards (25 removed), start hand 4
    // 2P: 32 cards (38 removed), start hand 4
    const PLAYER_SETUP_CONFIG = {
        2: { totalCards: 32, removedCards: 38, handSize: 4, rounds: 11 },
        3: { totalCards: 45, removedCards: 25, handSize: 4, rounds: 10 },
        4: { totalCards: 56, removedCards: 14, handSize: 4, rounds: 9 },
        5: { totalCards: 70, removedCards: 0,  handSize: 5, rounds: 8 }
    };

    function buildMasterDeck() {
        const deck = [];
        for (let order = 1; order <= 70; order++) {
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

    // Audio SFX Synthesizer
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
        } catch (e) {
            // Audio ignore
        }
    }

    function playSound(type) {
        if (!state.soundEnabled) return;
        switch (type) {
            case 'deal':
                playTone(320, 'triangle', 0.08, 0.08);
                break;
            case 'bid':
                playTone(440, 'sine', 0.12, 0.1);
                setTimeout(() => playTone(660, 'sine', 0.15, 0.1), 80);
                break;
            case 'reveal':
                playTone(523.25, 'triangle', 0.15, 0.12);
                setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.12), 120);
                setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.15), 240);
                break;
            case 'play':
                playTone(587.33, 'sine', 0.18, 0.1);
                break;
            case 'special':
                playTone(880, 'sine', 0.12, 0.12);
                setTimeout(() => playTone(1174.66, 'sine', 0.25, 0.12), 100);
                break;
            case 'win':
                [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                    setTimeout(() => playTone(f, 'triangle', 0.25, 0.15), i * 140);
                });
                break;
        }
    }

    // Utility: Array Shuffle
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
        playerCount: 3,
        gameMode: 'ai', // 'ai' = Solo vs AI, 'pvp' = Pass & Play (Local Multi-player)
        currentPvpBidIndex: 0, // For Pass & Play bidding sequence
        currentPvpAwardIndex: 0, // For Pass & Play set claim sequence
        currentPvpExchangeIndex: 0, // For Pass & Play exchange sequence
        pvpPendingAwards: [],
        pvpExchangeStore: {}, // playerId -> assignments
        round: 1,
        totalRounds: 10,
        phase: 'bid', // 'bid', 'curtain_bid', 'reveal', 'curtain_claim', 'exchange', 'curtain_exchange', 'game_over'
        selectedBidCard: null,
        pendingSetChoice: null,
        prevBids: [],
        deck: [],
        floorSets: [],
        players: []
    };

    // Initialize Game
    function initGame(options = {}) {
        state.playerCount = options.playerCount || 3;
        state.gameMode = options.gameMode || 'ai';
        state.round = 1;
        state.phase = 'bid';
        state.selectedBidCard = null;
        state.pendingSetChoice = null;
        state.prevBids = [];
        state.currentPvpBidIndex = 0;
        state.currentPvpAwardIndex = 0;
        state.currentPvpExchangeIndex = 0;
        state.pvpPendingAwards = [];
        state.pvpExchangeStore = {};

        const cfg = PLAYER_SETUP_CONFIG[state.playerCount] || PLAYER_SETUP_CONFIG[3];
        const totalCardsUsing = cfg.totalCards;
        const startHandSize = cfg.handSize;
        state.totalRounds = cfg.rounds;

        const master = shuffle(buildMasterDeck());
        // Randomly remove cards as per rulebook and PDF 2 setup
        const gameDeck = master.slice(0, totalCardsUsing);

        // Initialize Players
        state.players = [];
        for (let i = 0; i < state.playerCount; i++) {
            const isHuman = (state.gameMode === 'pvp') ? true : (i === 0);
            let pName = '';
            if (state.gameMode === 'pvp') {
                pName = (state.lang === 'ko') ? `플레이어 ${i + 1}` : `Player ${i + 1}`;
            } else {
                pName = (i === 0) ? ((state.lang === 'ko') ? '나 (플레이어)' : 'You (Player)') : `AI ${i}`;
            }

            const hand = gameDeck.splice(0, startHandSize);
            hand.sort((a, b) => a.order - b.order);

            state.players.push({
                id: i,
                name: pName,
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

        // Render UI
        render();
        playSound('deal');
    }

    // Floor Setup Round 1:
    // Top row = N cards from deck (sorted ascending)
    // Bottom row = N cards from deck (random)
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

    // Subsequent Rounds Floor Setup:
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

        // Best set index
        let bestSetIdx = 0;
        let maxVal = -999;
        setScores.forEach(ss => {
            if (ss.val > maxVal) {
                maxVal = ss.val;
                bestSetIdx = ss.idx;
            }
        });

        // Pick bid card closest to rank
        const sortedHand = [...ai.hand].sort((a, b) => a.order - b.order);
        const targetPercent = state.playerCount <= 1 ? 0 : bestSetIdx / (state.playerCount - 1);
        const targetHandIdx = Math.min(Math.floor(targetPercent * sortedHand.length), sortedHand.length - 1);

        return sortedHand[targetHandIdx];
    }

    // AI Card Play Choice Heuristic
    function chooseAiPlayCard(ai, cTop, cBottom) {
        const scoreTop = evalCardForPlay(ai, cTop);
        const scoreBottom = evalCardForPlay(ai, cBottom);
        return (scoreTop >= scoreBottom) ? cTop : cBottom;
    }

    function evalCardForPlay(player, card) {
        if (!card) return 0;
        const sym = card.symbol;
        if (sym === 'LOVER') return 10;
        if (sym === 'FRIEND') return 7;
        if (sym === 'COLLEAGUE') return 5;
        if (sym === 'WAR') return -8;
        if (sym === 'STEAL') return -5;
        if (sym === 'CONFLICT') return -3;
        if (sym.startsWith('DOUBLE')) return 8;
        if (sym.startsWith('IGNORE')) return 6;
        return 0;
    }

    // Bidding: Submit Bid
    function submitHumanBid() {
        if (!state.selectedBidCard) return;

        if (state.gameMode === 'ai') {
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
        } else {
            // Pass & Play Mode: sequential secret bidding
            const curPlayer = state.players[state.currentPvpBidIndex];
            curPlayer.bidCard = state.selectedBidCard;
            curPlayer.hand = curPlayer.hand.filter(c => c.order !== state.selectedBidCard.order);
            state.selectedBidCard = null;

            playSound('bid');

            if (state.currentPvpBidIndex + 1 < state.playerCount) {
                // Next human player needs to bid privately
                state.currentPvpBidIndex++;
                showPassCurtainModal(
                    (state.lang === 'ko') ? `${curPlayer.name}님의 입찰 완료!` : `${curPlayer.name}'s Bid Submitted!`,
                    (state.lang === 'ko') ? `기기를 ${state.players[state.currentPvpBidIndex].name}님에게 건네주세요.` : `Pass the device to ${state.players[state.currentPvpBidIndex].name}.`,
                    (state.lang === 'ko') ? `${state.players[state.currentPvpBidIndex].name} 차례 시작` : `Start ${state.players[state.currentPvpBidIndex].name}'s Turn`,
                    () => {
                        state.phase = 'bid';
                        render();
                    }
                );
            } else {
                // All players have bid! Reveal!
                state.currentPvpBidIndex = 0;
                resolveBidsAndAwardSets();
            }
        }
    }

    // Pass & Play Device Curtain Modal
    function showPassCurtainModal(titleText, descText, btnText, onReadyCallback) {
        const modal = document.getElementById('passCurtainModal');
        if (!modal) {
            if (onReadyCallback) onReadyCallback();
            return;
        }

        document.getElementById('passCurtainTitle').textContent = titleText;
        document.getElementById('passCurtainDesc').textContent = descText;
        const btn = document.getElementById('btnPassCurtainReady');
        btn.textContent = btnText;
        btn.onclick = () => {
            modal.classList.remove('active');
            if (onReadyCallback) onReadyCallback();
        };

        modal.classList.add('active');
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

        if (state.gameMode === 'ai') {
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
            showSetChoiceModal(humanAward.player, humanAward.set, (playedCard, keptCard) => {
                humanAward.player.played.push(playedCard);
                humanAward.player.played.sort((x, y) => x.order - y.order);
                humanAward.player.hand.push(keptCard);
                humanAward.player.hand.sort((x, y) => x.order - y.order);

                playSound('play');
                completeRound();
            });
        } else {
            // Pass & Play: Prompt each human player in order of rank
            state.pvpPendingAwards = awards;
            state.currentPvpAwardIndex = 0;
            render();
            processNextPvpSetChoice();
        }
    }

    function processNextPvpSetChoice() {
        if (state.currentPvpAwardIndex >= state.pvpPendingAwards.length) {
            completeRound();
            return;
        }

        const award = state.pvpPendingAwards[state.currentPvpAwardIndex];
        const curPlayer = award.player;

        showPassCurtainModal(
            (state.lang === 'ko') ? `${curPlayer.name}님의 세트 획득!` : `${curPlayer.name}'s SET Claim!`,
            (state.lang === 'ko') ? `획득한 세트에서 타임라인에 배치할 카드와 손으로 가져갈 카드를 선택해 주세요.` : `Choose which card from your won set to play and keep.`,
            (state.lang === 'ko') ? `${curPlayer.name} 카드 선택` : `Select Card as ${curPlayer.name}`,
            () => {
                showSetChoiceModal(curPlayer, award.set, (playedCard, keptCard) => {
                    curPlayer.played.push(playedCard);
                    curPlayer.played.sort((x, y) => x.order - y.order);
                    curPlayer.hand.push(keptCard);
                    curPlayer.hand.sort((x, y) => x.order - y.order);

                    playSound('play');
                    state.currentPvpAwardIndex++;
                    render();
                    processNextPvpSetChoice();
                });
            }
        );
    }

    // Modal: Choose which card to Play vs Keep
    function showSetChoiceModal(player, set, callback) {
        const modal = document.getElementById('setChoiceModal');
        const container = document.getElementById('setChoiceCardsContainer');
        if (!modal || !container) {
            callback(set.topCard, set.bottomCard);
            return;
        }

        const isKo = (state.lang === 'ko');
        const pName = player ? player.name : '';
        document.getElementById('setChoiceModalTitle').textContent = isKo ? 
            `${pName} 세트 획득! 배치할 카드 선택` : 
            `${pName}: SET Claimed! Choose Card to Play`;
        document.getElementById('setChoiceModalDesc').textContent = isKo ? 
            '획득한 2장 중 1장을 내 생애 타임라인(Play)에 놓고, 다른 1장은 손패(Hand)로 가져옵니다.' :
            'Choose 1 card to PLAY into your life timeline. The other returns to your hand.';

        container.innerHTML = `
            <button type="button" class="set-choice-btn" id="btnChooseTop">
                ${renderCardMarkup(set.topCard, { mini: true, nonClickable: true })}
                <div class="choice-action-badge">${isKo ? '이 카드 배치 (Play)' : 'Play this card'}</div>
                <div class="choice-subtext">${(set.topCard.symInfo.name[state.lang] || set.topCard.symInfo.name.ko)} (#${set.topCard.orderStr})</div>
            </button>
            <button type="button" class="set-choice-btn" id="btnChooseBottom">
                ${renderCardMarkup(set.bottomCard, { mini: true, nonClickable: true })}
                <div class="choice-action-badge">${isKo ? '이 카드 배치 (Play)' : 'Play this card'}</div>
                <div class="choice-subtext">${(set.bottomCard.symInfo.name[state.lang] || set.bottomCard.symInfo.name.ko)} (#${set.bottomCard.orderStr})</div>
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

    // Complete Round & Check End
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

    // Final Phase: Secret Connection Exchange
    function startExchangePhase() {
        state.phase = 'exchange';
        playSound('special');

        if (state.gameMode === 'ai') {
            showExchangeModal(state.players[0], (humanAssignments) => {
                resolveExchange({ 0: humanAssignments });
            });
        } else {
            // Pass & Play: sequential private exchange for all players
            state.pvpExchangeStore = {};
            state.currentPvpExchangeIndex = 0;
            processNextPvpExchange();
        }
        render();
    }

    function processNextPvpExchange() {
        if (state.currentPvpExchangeIndex >= state.playerCount) {
            resolveExchange(state.pvpExchangeStore);
            return;
        }

        const curPlayer = state.players[state.currentPvpExchangeIndex];
        showPassCurtainModal(
            (state.lang === 'ko') ? `${curPlayer.name}님의 최종 인연 교환` : `${curPlayer.name}'s Final Connection Exchange`,
            (state.lang === 'ko') ? `손에 남은 카드들을 다른 플레이어들에게 은밀히 전달하고 1장을 보관합니다.` : `Secretly gift cards to rivals and keep 1 for your timeline.`,
            (state.lang === 'ko') ? `${curPlayer.name} 교환 시작` : `Start Exchange as ${curPlayer.name}`,
            () => {
                showExchangeModal(curPlayer, (assignments) => {
                    state.pvpExchangeStore[curPlayer.id] = assignments;
                    state.currentPvpExchangeIndex++;
                    processNextPvpExchange();
                });
            }
        );
    }

    function showExchangeModal(player, onConfirmCallback) {
        const modal = document.getElementById('exchangeModal');
        const container = document.getElementById('exchangeAssignmentsContainer');
        if (!modal || !container) {
            onConfirmCallback({});
            return;
        }

        const isKo = (state.lang === 'ko');
        const opponents = state.players.filter(p => p.id !== player.id);

        document.getElementById('exchangeModalTitle').textContent = isKo ? 
            `${player.name}: 최종 비밀 인연 교환` : 
            `${player.name}: Final Secret Connection Exchange`;
        document.getElementById('exchangeModalDesc').textContent = isKo ?
            `손패(${player.hand.length}장) 중 각 상대에게 정확히 1장씩 비밀 선물하고, 1장은 내 생애에 보관합니다.${player.hand.length > (opponents.length + 1) ? ' 남은 카드는 게임에서 제외됩니다.' : ''}` :
            `Secretly gift 1 card to each opponent, keep 1 card for yourself.${player.hand.length > (opponents.length + 1) ? ' Leftover cards are discarded.' : ''}`;

        // Track assignments: cardOrder -> 'keep' | opponentId | 'discard'
        const assignments = {};
        // Default assignment: first card keep, next cards to opponents
        player.hand.forEach((c, idx) => {
            if (idx === 0) {
                assignments[c.order] = 'keep';
            } else if (idx <= opponents.length) {
                assignments[c.order] = opponents[idx - 1].id;
            } else {
                assignments[c.order] = 'discard';
            }
        });

        function renderExchangeUI() {
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
                    <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
                        ${player.hand.map(c => {
                            const curTarget = assignments[c.order] !== undefined ? assignments[c.order] : 'discard';
                            return `
                                <div class="exchange-card-wrapper" style="display:flex; flex-direction:column; align-items:center; gap:6px; background:rgba(255,255,255,0.04); padding:8px; border-radius:8px; border:1px solid var(--border-glass);">
                                    ${renderCardMarkup(c, { mini: true, nonClickable: true })}
                                    <select class="exchange-assign-select" data-card="${c.order}" style="font-size:0.8rem; padding:4px 6px; background:#0f172a; color:#fff; border:1px solid var(--border-gold); border-radius:4px; font-weight:700;">
                                        <option value="keep" ${curTarget === 'keep' ? 'selected' : ''}>★ ${isKo ? '내 타임라인 보관' : 'Keep for Self'}</option>
                                        ${opponents.map(o => `
                                            <option value="${o.id}" ${curTarget === o.id ? 'selected' : ''}>🎁 ${o.name}에게 선물</option>
                                        `).join('')}
                                        ${(player.hand.length > opponents.length + 1) ? `<option value="discard" ${curTarget === 'discard' ? 'selected' : ''}>🗑 ${isKo ? '제외 (Discard)' : 'Discard'}</option>` : ''}
                                    </select>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div id="exchangeValidationMsg" style="font-size:0.8rem; color:#ef4444; text-align:center; min-height:1.2rem;"></div>
                    <button type="button" class="btn-play-again" id="btnConfirmExchange">${isKo ? '인연 교환 확정' : 'Confirm Exchange'}</button>
                </div>
            `;

            const btnConfirm = document.getElementById('btnConfirmExchange');
            const msgEl = document.getElementById('exchangeValidationMsg');

            function validateAssignments() {
                // Check that exactly 1 keep is selected
                const keepCount = Object.values(assignments).filter(v => v === 'keep').length;
                // Check that each opponent gets exactly 1 card
                const missingOpponents = opponents.filter(o => !Object.values(assignments).includes(o.id));

                if (keepCount !== 1) {
                    msgEl.textContent = isKo ? '내 타임라인에 보관할 카드를 정확히 1장 지정해야 합니다.' : 'You must choose exactly 1 card to Keep.';
                    btnConfirm.disabled = true;
                    btnConfirm.style.opacity = '0.5';
                    return false;
                }
                if (missingOpponents.length > 0) {
                    msgEl.textContent = isKo ? `${missingOpponents[0].name}님에게 보낼 선물이 지정되지 않았습니다.` : `Must gift 1 card to ${missingOpponents[0].name}.`;
                    btnConfirm.disabled = true;
                    btnConfirm.style.opacity = '0.5';
                    return false;
                }

                msgEl.textContent = '';
                btnConfirm.disabled = false;
                btnConfirm.style.opacity = '1';
                return true;
            }

            container.querySelectorAll('.exchange-assign-select').forEach(sel => {
                sel.onchange = () => {
                    const cOrder = parseInt(sel.getAttribute('data-card'), 10);
                    const val = sel.value;
                    assignments[cOrder] = (val === 'keep' || val === 'discard') ? val : parseInt(val, 10);
                    validateAssignments();
                };
            });

            validateAssignments();

            btnConfirm.onclick = () => {
                if (!validateAssignments()) return;
                modal.classList.remove('active');
                onConfirmCallback(assignments);
            };
        }

        renderExchangeUI();
        modal.classList.add('active');
    }

    // Resolve Final Exchange & Merge into Timelines
    function resolveExchange(allHumanAssignments) {
        // Collect AI distributions if in AI mode
        const allDistributions = {};

        state.players.forEach(p => {
            if (p.isHuman && allHumanAssignments[p.id]) {
                const userAssign = allHumanAssignments[p.id];
                let keepCard = null;
                const giftCards = {};

                p.hand.forEach(c => {
                    const dest = userAssign[c.order];
                    if (dest === 'keep') {
                        keepCard = c;
                    } else if (typeof dest === 'number') {
                        giftCards[dest] = c;
                    }
                });

                if (!keepCard && p.hand.length > 0) keepCard = p.hand[0];

                allDistributions[p.id] = {
                    keep: keepCard,
                    give: giftCards
                };
            } else {
                // AI distribution heuristic
                const sortedHand = [...p.hand].sort((a, b) => {
                    // negative cards first (give away bad cards to enemies!)
                    const getPrio = (c) => (c.symInfo.type === 'negative' ? -10 : 10);
                    return getPrio(a) - getPrio(b);
                });

                const otherPlayers = state.players.filter(op => op.id !== p.id);
                const gifts = {};
                otherPlayers.forEach((op, opIdx) => {
                    if (opIdx < sortedHand.length) {
                        gifts[op.id] = sortedHand[opIdx];
                    }
                });

                allDistributions[p.id] = {
                    keep: sortedHand[sortedHand.length - 1], // keep best card
                    give: gifts
                };
            }
        });

        // Add kept card + gifts into played lines
        state.players.forEach(p => {
            const dist = allDistributions[p.id];
            if (dist && dist.keep) {
                p.played.push(dist.keep);
            }
            // Gifts received from other players
            state.players.forEach(otherP => {
                if (otherP.id !== p.id) {
                    const otherDist = allDistributions[otherP.id];
                    if (otherDist && otherDist.give && otherDist.give[p.id]) {
                        p.played.push(otherDist.give[p.id]);
                    }
                }
            });

            p.played.sort((a, b) => a.order - b.order);
            p.hand = []; // Clear hands
        });

        // Resolve special cards and calculate final scores
        resolveFinalScoring();
    }

    // Special Cards Resolution Engine (PDF 1 Page 8 & 9)
    function resolveSpecialCards(playedCards) {
        const line = playedCards.map(c => ({ ...c }));
        line.sort((a, b) => a.order - b.order);

        const SPECIAL_TYPES = new Set(['IGNORE_LEFT', 'IGNORE_RIGHT', 'DOUBLE_LEFT', 'DOUBLE_RIGHT']);

        // Step 1: Remove special cards pointing to another special card or out of bounds
        // (As per rulebook: "Check the special cards and remove a card if the special card is indicating a special card by ascending order.")
        let changed = true;
        while (changed) {
            changed = false;
            for (let i = 0; i < line.length; i++) {
                const sym = line[i].symbol;
                if (SPECIAL_TYPES.has(sym)) {
                    const targetIdx = (sym === 'IGNORE_LEFT' || sym === 'DOUBLE_LEFT') ? i - 1 : i + 1;
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
                const targetIdx = (sym === 'IGNORE_LEFT' || sym === 'DOUBLE_LEFT') ? i - 1 : i + 1;
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

            const mult = multipliers[i] || 1;
            symbolCounts[card.symbol] = (symbolCounts[card.symbol] || 0) + mult;
            eraCounts[card.era] = (eraCounts[card.era] || 0) + mult;
            activeCards.push({ ...card, effectiveCount: mult });
        }

        return { symbolCounts, eraCounts, activeCards, line, ignoredIndices, multipliers };
    }

    // Final Scoring Resolution
    function resolveFinalScoring() {
        state.phase = 'game_over';

        // 1. Calculate symbol scores for all players
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

        // Sort descending by total score
        playerResults.sort((a, b) => b.totalScore - a.totalScore);

        render();
        playSound('win');
        showVictoryModal(playerResults);
    }

    // Victory Screen Modal
    function showVictoryModal(results) {
        const modal = document.getElementById('victoryModal');
        const list = document.getElementById('victoryScoresList');
        const title = document.getElementById('victoryWinnerTitle');
        if (!modal || !list) return;

        const isKo = (state.lang === 'ko');
        const winner = results[0];

        title.innerHTML = `🎉 ${winner.player.name} ${isKo ? '최종 승리!' : 'Wins the Game!'}`;

        let html = `
            <div style="margin-bottom:16px; text-align:center;">
                <span style="font-size:1.1rem; font-weight:800; color:var(--gold);">
                    ${isKo ? '최종 점수: ' : 'Final Score: '}${winner.totalScore} VP
                </span>
            </div>
            <table class="scores-comparison">
                <thead>
                    <tr>
                        <th>${isKo ? '순위' : 'Rank'}</th>
                        <th>${isKo ? '플레이어' : 'Player'}</th>
                        <th>${isKo ? '인연 점수' : 'Cards VP'}</th>
                        <th>${isKo ? '동일시대 보너스' : 'Era Bonus'}</th>
                        <th>${isKo ? '총점' : 'Total'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map((r, i) => `
                        <tr style="${i === 0 ? 'background:rgba(245,158,11,0.15); font-weight:bold;' : ''}">
                            <td>${i === 0 ? '🥇 1위' : (i === 1 ? '🥈 2위' : (i === 2 ? '🥉 3위' : `${i + 1}위`))}</td>
                            <td>${r.player.name}</td>
                            <td>${r.rawScore} VP</td>
                            <td style="${r.hasEraBonus ? 'color:#10b981; font-weight:bold;' : 'color:var(--text-muted);'}">
                                ${r.hasEraBonus ? `+10 VP (${ERA_NAMES[state.lang][r.bestEra]} ×${r.maxEraCount})` : '-'}
                            </td>
                            <td style="color:var(--gold); font-size:1rem; font-weight:900;">${r.totalScore} VP</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        list.innerHTML = html;
        modal.classList.add('active');
    }

    // Symbol Content Renderer with Crisp Icons
    function renderSymbolContent(card) {
        if (!card || !card.symInfo) return '';
        const sym = card.symbol;

        if (sym === 'IGNORE_LEFT') {
            return `<span class="sym-hash-red">#</span> <span class="sym-arrow-green">←</span>`;
        }
        if (sym === 'IGNORE_RIGHT') {
            return `<span class="sym-arrow-green">→</span> <span class="sym-hash-red">#</span>`;
        }
        if (sym === 'DOUBLE_LEFT') {
            return `<span class="sym-double-green">2*# ←</span>`;
        }
        if (sym === 'DOUBLE_RIGHT') {
            return `<span class="sym-double-green">→ 2*#</span>`;
        }

        const symKey = sym.toLowerCase();
        return `
            <img src="/proto/past-lives/icons/${symKey}.png" class="card-symbol-img" alt="${card.symInfo.name.ko}" onerror="this.onerror=null; this.outerHTML='<span class=\\'fallback-sym-icon\\'>${card.symInfo.icon}</span>';">
        `;
    }

    // Card HTML Markup
    function renderCardMarkup(card, options = {}) {
        if (!card) return '<div class="pl-card empty"></div>';

        const isSelected = options.isSelected || false;
        const isMini = options.mini || false;
        const isInteractive = !options.nonClickable;
        const isDoubled = options.isDoubled || false;
        const isIgnored = options.isIgnored || false;

        let extraClasses = '';
        if (isSelected) extraClasses += ' selected';
        if (isMini) extraClasses += ' played-mini-card';
        if (isInteractive) extraClasses += ' selectable';
        if (isDoubled) extraClasses += ' card-doubled';
        if (isIgnored) extraClasses += ' card-ignored';

        return `
            <div class="pl-card ${extraClasses}" data-order="${card.order}" style="border-top-color:${card.eraColor};">
                ${isDoubled ? '<span class="badge-doubled">×2</span>' : ''}
                ${isIgnored ? '<span class="badge-ignored">CANCEL</span>' : ''}
                <div class="card-symbol-top ${card.symInfo.type === 'special' ? 'sym-special' : 'sym-' + card.symbol.toLowerCase()}">
                    ${renderSymbolContent(card)}
                </div>
                <div class="card-order-bottom">
                    <span class="card-order-num" style="color:${card.eraColor};">${card.orderStr}</span>
                    <span class="card-era-pip" style="background:${card.eraColor};"></span>
                </div>
            </div>
        `;
    }

    // Render Floor SETs
    function renderFloorSets() {
        const grid = document.getElementById('floorSetsGrid');
        if (!grid) return;

        const isKo = (state.lang === 'ko');
        grid.innerHTML = '';

        state.floorSets.forEach((set, idx) => {
            const setCol = document.createElement('div');
            setCol.className = 'floor-set-col';

            const awardedPlayer = (set.awardedPlayerId !== null) ? state.players[set.awardedPlayerId] : null;

            setCol.innerHTML = `
                <div class="set-col-header">
                    <span class="set-rank-badge">${isKo ? `${idx + 1}위 세트` : `SET #${idx + 1}`}</span>
                    ${awardedPlayer ? `<span class="set-claimed-tag">✔ ${awardedPlayer.name}</span>` : ''}
                </div>
                <div class="set-cards-pair">
                    <div class="floor-card-slot slot-top">
                        <span class="slot-label">${isKo ? '상단' : 'Top'}</span>
                        ${renderCardMarkup(set.topCard, { nonClickable: true })}
                    </div>
                    <div class="floor-card-slot slot-bottom">
                        <span class="slot-label">${isKo ? '하단' : 'Bottom'}</span>
                        ${renderCardMarkup(set.bottomCard, { nonClickable: true })}
                    </div>
                </div>
            `;
            grid.appendChild(setCol);
        });

        // Update Deck Count Badge
        const deckBadge = document.getElementById('deckCountBadge');
        if (deckBadge) {
            deckBadge.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${isKo ? '남은 덱: ' : 'Deck: '}<strong>${state.deck.length}</strong>${isKo ? '장' : ' cards'}`;
        }
    }

    // Render Active Player's Hand
    function renderHumanHand() {
        const handRow = document.getElementById('handCardsRow');
        const btnBid = document.getElementById('btnSubmitBid');
        if (!handRow || !btnBid) return;

        const isKo = (state.lang === 'ko');
        handRow.innerHTML = '';

        // In AI mode, active is player 0. In Pass & Play, active is currentPvpBidIndex
        const activePlayer = (state.gameMode === 'pvp') ? 
            state.players[state.currentPvpBidIndex] : 
            state.players[0];

        if (!activePlayer || !activePlayer.hand || activePlayer.hand.length === 0) {
            handRow.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem; padding:12px;">${isKo ? '손패가 비어 있습니다.' : 'No cards in hand.'}</div>`;
            btnBid.disabled = true;
            return;
        }

        activePlayer.hand.forEach(c => {
            const isSel = (state.selectedBidCard && state.selectedBidCard.order === c.order);
            const cardEl = document.createElement('div');
            cardEl.innerHTML = renderCardMarkup(c, { isSelected: isSel, isInteractive: (state.phase === 'bid') });

            const innerCard = cardEl.firstElementChild;
            if (state.phase === 'bid') {
                innerCard.onclick = () => {
                    if (state.selectedBidCard && state.selectedBidCard.order === c.order) {
                        state.selectedBidCard = null;
                    } else {
                        state.selectedBidCard = c;
                    }
                    renderHumanHand();
                };
            }
            handRow.appendChild(innerCard);
        });

        if (state.selectedBidCard && state.phase === 'bid') {
            btnBid.disabled = false;
            btnBid.innerHTML = `<i class="fa-solid fa-gavel"></i> ${isKo ? `#${state.selectedBidCard.orderStr}번 카드로 입찰 확정` : `Confirm Bid (#${state.selectedBidCard.orderStr})`}`;
        } else {
            btnBid.disabled = true;
            btnBid.innerHTML = `<i class="fa-solid fa-gavel"></i> ${isKo ? '손패에서 입찰할 카드 선택' : 'Select Card to Bid'}`;
        }
    }

    // Render Player Timelines / Boards
    function renderPlayerBoards() {
        const area = document.getElementById('playersArea');
        if (!area) return;

        const isKo = (state.lang === 'ko');
        area.innerHTML = '';

        state.players.forEach(p => {
            const board = document.createElement('div');
            board.className = `player-board ${p.isHuman ? 'human' : 'ai'}`;

            // Resolve special cards for active visual indicators
            const res = resolveSpecialCards(p.played);

            board.innerHTML = `
                <div class="pb-header">
                    <div class="player-info">
                        <span class="player-name">${p.name}</span>
                        <span class="player-role-badge">${p.isHuman ? 'Human' : 'AI'}</span>
                        <span class="player-cards-count">${isKo ? `배치 ${p.played.length}장 / 손패 ${p.hand.length}장` : `Played: ${p.played.length} / Hand: ${p.hand.length}`}</span>
                    </div>
                    <div class="pb-bid-status">
                        ${p.bidCard ? `<span class="bid-placed-tag">✔ ${isKo ? '입찰 완료' : 'Bid Placed'}</span>` : `<span class="bid-waiting-tag">${isKo ? '입찰 대기중' : 'Thinking...'}</span>`}
                    </div>
                </div>
                <div class="pb-timeline-row">
                    ${p.played.length === 0 ? `
                        <div class="timeline-empty-hint">${isKo ? '아직 배치된 카드가 없습니다. 세트에서 1장을 골라 타임라인을 만듭니다.' : 'No cards played yet.'}</div>
                    ` : p.played.map((c, i) => {
                        const isDoubled = (res.multipliers[i] && res.multipliers[i] > 1);
                        const isIgnored = res.ignoredIndices && res.ignoredIndices.has(i);
                        return renderCardMarkup(c, { mini: true, nonClickable: true, isDoubled, isIgnored });
                    }).join('')}
                </div>
            `;
            area.appendChild(board);
        });
    }

    // Master Render Function
    function render() {
        renderFloorSets();
        renderHumanHand();
        renderPlayerBoards();
        updateStaticTexts();
    }

    // Update Banner Prompt & Static Texts
    function updateStaticTexts() {
        const prompt = document.getElementById('promptText');
        const turnStatus = document.getElementById('turnStatusBadge');
        const isKo = (state.lang === 'ko');

        if (turnStatus) {
            turnStatus.textContent = isKo ? 
                `라운드 ${state.round} / ${state.totalRounds}` : 
                `Round ${state.round} of ${state.totalRounds}`;
        }

        if (prompt) {
            if (state.phase === 'bid') {
                if (state.gameMode === 'pvp') {
                    const curP = state.players[state.currentPvpBidIndex];
                    prompt.innerHTML = `<i class="fa-solid fa-circle-info" style="color:var(--gold);"></i> ${isKo ? `<strong>${curP.name}</strong>님의 차례: 바닥의 세트를 확인하고 손패에서 입찰할 카드 1장을 선택하세요.` : `<strong>${curP.name}</strong>'s Turn: Choose 1 card from your hand to bid secretly.`}`;
                } else {
                    prompt.innerHTML = `<i class="fa-solid fa-circle-info" style="color:var(--gold);"></i> ${isKo ? '바닥의 세트를 확인하고, 손패에서 이번 라운드에 입찰할 카드 1장을 선택하세요.' : 'Inspect the floor SETs and choose 1 card from your hand to bid.'}`;
                }
            } else if (state.phase === 'reveal') {
                prompt.innerHTML = `<i class="fa-solid fa-award" style="color:var(--gold);"></i> ${isKo ? '모든 입찰이 공개되었습니다! 낮은 번호부터 차례대로 세트를 가져옵니다.' : 'All bids revealed! SETs are awarded in ascending order of bids.'}`;
            } else if (state.phase === 'exchange') {
                prompt.innerHTML = `<i class="fa-solid fa-handshake" style="color:var(--gold);"></i> ${isKo ? '최종 인연 교환 단계: 손패를 각 상대에게 비밀 선물하고 1장을 보관합니다.' : 'Final Karma Exchange: Secretly gift hand cards to rivals and keep 1 for your life timeline.'}`;
            } else if (state.phase === 'game_over') {
                prompt.innerHTML = `<i class="fa-solid fa-trophy" style="color:var(--gold);"></i> ${isKo ? '게임 종료! 최종 점수를 확인하세요.' : 'Game Over! Inspect your final relationship scores.'}`;
            }
        }
    }

    // Setup Modal & Header Events
    function setupModalEvents() {
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

        // Bid Button
        const btnBid = document.getElementById('btnSubmitBid');
        if (btnBid) {
            btnBid.onclick = submitHumanBid;
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

        // Mode buttons inside newGameModal
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
                const pCount = sel ? parseInt(sel.value, 10) : 3;
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

        // Play Again from Victory
        const btnPlayAgain = document.getElementById('btnPlayAgain');
        const modalVic = document.getElementById('victoryModal');
        if (btnPlayAgain && modalVic) {
            btnPlayAgain.onclick = () => {
                modalVic.classList.remove('active');
                initGame({ playerCount: state.playerCount, gameMode: state.gameMode });
            };
        }
    }

    // DOM Ready Initialization
    document.addEventListener('DOMContentLoaded', () => {
        setupModalEvents();
        initGame({ playerCount: 3, gameMode: 'ai' });
    });

})();
