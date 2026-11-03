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
        IGNORE_LEFT: { id: 'IGNORE_LEFT', icon: '#[✕] ←', name: { ko: '좌측 무효화', en: 'Ignore Left' }, color: '#14b8a6', type: 'special' },
        IGNORE_RIGHT: { id: 'IGNORE_RIGHT', icon: '→ #[✕]', name: { ko: '우측 무효화', en: 'Ignore Right' }, color: '#06b6d4', type: 'special' },
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

            state.phase = 'choose_set_card';
            state.pendingHumanAward = humanAward;
            render();

            // Prompt human
            showSetChoiceModal(humanAward.player, humanAward.set, (playedCard, keptCard) => {
                humanAward.player.played.push(playedCard);
                humanAward.player.played.sort((x, y) => x.order - y.order);
                humanAward.player.hand.push(keptCard);
                humanAward.player.hand.sort((x, y) => x.order - y.order);

                state.phase = 'bid';
                state.pendingHumanAward = null;
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
        state.pendingSetCallback = callback;
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
            state.pendingSetCallback = null;
            modal.classList.remove('active');
            callback(set.topCard, set.bottomCard);
        };

        document.getElementById('btnChooseBottom').onclick = () => {
            state.pendingSetCallback = null;
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
            return `<svg class="special-sym-svg" viewBox="0 0 62 26" width="58" height="24">
                    <text x="16" y="21" text-anchor="middle" font-family="'Outfit', 'Arial Black', sans-serif" font-weight="900" font-size="24" fill="#10b981">#</text>
                    <line x1="7" y1="5" x2="25" y2="21" stroke="#ff2244" stroke-width="4.5" stroke-linecap="round"/>
                    <line x1="25" y1="5" x2="7" y2="21" stroke="#ff2244" stroke-width="4.5" stroke-linecap="round"/>
                    <path d="M58 13 L38 13 M45 6 L38 13 L45 20" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>`;
        }
        if (sym === 'IGNORE_RIGHT') {
            return `<svg class="special-sym-svg" viewBox="0 0 62 26" width="58" height="24">
                    <path d="M4 13 L24 13 M17 6 L24 13 L17 20" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <text x="46" y="21" text-anchor="middle" font-family="'Outfit', 'Arial Black', sans-serif" font-weight="900" font-size="24" fill="#10b981">#</text>
                    <line x1="37" y1="5" x2="55" y2="21" stroke="#ff2244" stroke-width="4.5" stroke-linecap="round"/>
                    <line x1="55" y1="5" x2="37" y2="21" stroke="#ff2244" stroke-width="4.5" stroke-linecap="round"/>
                </svg>`;
        }
        if (sym === 'DOUBLE_LEFT') {
            return `<svg class="special-sym-svg" viewBox="0 0 74 26" width="62" height="24">
                    <text x="24" y="21" text-anchor="middle" font-family="'Outfit', 'Arial Black', sans-serif" font-weight="900" font-size="20" fill="#10b981">2*#</text>
                    <path d="M70 13 L50 13 M57 6 L50 13 L57 20" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>`;
        }
        if (sym === 'DOUBLE_RIGHT') {
            return `<svg class="special-sym-svg" viewBox="0 0 74 26" width="62" height="24">
                    <path d="M4 13 L24 13 M17 6 L24 13 L17 20" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <text x="50" y="21" text-anchor="middle" font-family="'Outfit', 'Arial Black', sans-serif" font-weight="900" font-size="20" fill="#10b981">2*#</text>
                </svg>`;
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

            // Make human's awarded set interactive during choose_set_card phase
            if (state.phase === 'choose_set_card' && state.pendingHumanAward && state.pendingHumanAward.set === set) {
                setCol.classList.add('pending-choice-set');
                const slotTop = setCol.querySelector('.slot-top');
                const slotBottom = setCol.querySelector('.slot-bottom');
                if (slotTop) {
                    slotTop.style.cursor = 'pointer';
                    slotTop.onclick = () => {
                        const modal = document.getElementById('setChoiceModal');
                        if (modal) modal.classList.remove('active');
                        if (state.pendingSetCallback) {
                            const cb = state.pendingSetCallback;
                            state.pendingSetCallback = null;
                            cb(set.topCard, set.bottomCard);
                        }
                    };
                }
                if (slotBottom) {
                    slotBottom.style.cursor = 'pointer';
                    slotBottom.onclick = () => {
                        const modal = document.getElementById('setChoiceModal');
                        if (modal) modal.classList.remove('active');
                        if (state.pendingSetCallback) {
                            const cb = state.pendingSetCallback;
                            state.pendingSetCallback = null;
                            cb(set.bottomCard, set.topCard);
                        }
                    };
                }
            }

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
        const isKo = (state.lang === 'ko');

        // Translate all data-i18n attributes
        document.querySelectorAll('[data-i18n-ko]').forEach(el => {
            const txt = isKo ? el.getAttribute('data-i18n-ko') : (el.getAttribute('data-i18n-en') || el.getAttribute('data-i18n-ko'));
            if (txt) el.textContent = txt;
        });
        if (document.getElementById('tutorialModal')?.classList.contains('active')) {
            renderTutorialSlidePL();
        }
    
        const prompt = document.getElementById('promptText');
        const turnStatus = document.getElementById('turnStatusBadge');

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
            } else if (state.phase === 'choose_set_card') {
                prompt.innerHTML = `<i class="fa-solid fa-trophy" style="color:var(--gold);"></i> ${isKo ? '<strong>세트 획득!</strong> 팝업창에서 타임라인에 배치할 카드를 선택하세요 (바닥의 내 세트 카드를 직접 클릭해도 됩니다).' : '<strong>SET Claimed!</strong> Select a card in the popup or directly click your set card on the floor to play.'}`;
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

    
    // ============================================================
    // Interactive Tutorial System - Past Lives
    // ============================================================
    const TUTORIAL_STEPS_PL = [
        {
            step: 1,
            title: { ko: '1. 게임 목표 & 7가지 인연', en: '1. Overview & Karmic Connections' },
            desc: {
                ko: '<strong>Past Lives</strong>는 시대를 넘나들며 전생의 인연을 엮어 타임라인을 완성하는 전략 카드 게임입니다.<br>7개 시대(원시~미래)의 카드를 모아 <span class="tut-highlight">긍정 인연은 극대화</span>하고, <span class="tut-highlight">악연과 빚은 지혜롭게 방어</span>하세요! 10라운드 후 총점이 가장 높은 플레이어가 승리합니다.',
                en: 'In <strong>Past Lives</strong>, you reincarnate through 7 distinct eras to weave your karmic timeline.<br>Draft connection cards to <span class="tut-highlight">maximize virtues</span> while <span class="tut-highlight">neutralizing bitter debts</span>! The player with highest karmic score after 10 rounds wins.'
            },
            keyBox: {
                ko: '• <strong>덕망 (긍정 인연)</strong>: 연인 ❤ (+15), 스승 📜 (+12), 친구 🤝 (+10), 조력자 🛡 (+8) — 기준 개수 이상 모으면 대량 득점!<br>• <strong>악업 (부정 인연)</strong>: 라이벌 ⚡ (-8), 빚 💰 (-10), 배신 🗡 (-15) — 타임라인에 남으면 치명적 감점!',
                en: '• <strong>Virtues (Positive)</strong>: Lover ❤ (+15), Teacher 📜 (+12), Friend 🤝 (+10), Helper 🛡 (+8) — big points if set goals are met!<br>• <strong>Debts (Negative)</strong>: Rival ⚡ (-8), Debt 💰 (-10), Betrayal 🗡 (-15) — painful penalties unless mitigated!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-shapes"></i> ${isKo ? '7가지 인연 상징 & 점수 기대치' : '7 Karmic Connection Types & Scoring'}
                    </div>
                    <div class="tut-visual-row">
                        <div class="tut-demo-card" style="border-color:#f43f5e;">
                            <div class="tut-card-era">고대</div>
                            <div class="tut-card-sym" style="color:#f43f5e;">❤</div>
                            <div class="tut-card-val" style="color:#f43f5e;">+15 VP</div>
                            <div style="font-size:0.6rem; text-align:center; color:#94a3b8;">${isKo ? '연인 (3장)' : 'Lover (3x)'}</div>
                        </div>
                        <div class="tut-demo-card" style="border-color:#fbbf24;">
                            <div class="tut-card-era">중세</div>
                            <div class="tut-card-sym" style="color:#fbbf24;">📜</div>
                            <div class="tut-card-val" style="color:#fbbf24;">+12 VP</div>
                            <div style="font-size:0.6rem; text-align:center; color:#94a3b8;">${isKo ? '스승 (3장)' : 'Teacher (3x)'}</div>
                        </div>
                        <div class="tut-demo-card" style="border-color:#10b981;">
                            <div class="tut-card-era">근대</div>
                            <div class="tut-card-sym" style="color:#10b981;">🤝</div>
                            <div class="tut-card-val" style="color:#10b981;">+10 VP</div>
                            <div style="font-size:0.6rem; text-align:center; color:#94a3b8;">${isKo ? '친구 (4장)' : 'Friend (4x)'}</div>
                        </div>
                        <div class="tut-demo-card" style="border-color:#ef4444;">
                            <div class="tut-card-era">미래</div>
                            <div class="tut-card-sym" style="color:#ef4444;">🗡</div>
                            <div class="tut-card-val" style="color:#ef4444;">-15 VP</div>
                            <div style="font-size:0.6rem; text-align:center; color:#f87171;">${isKo ? '배신 (악연)' : 'Betrayal'}</div>
                        </div>
                    </div>
                    <div class="tut-interactive-note">
                        <i class="fa-solid fa-circle-info"></i> ${isKo ? '손패와 타임라인의 카드를 합산하여 세트 점수를 달성합니다.' : 'Hand and timeline cards together contribute toward set thresholds.'}
                    </div>
                </div>
            `
        },
        {
            step: 2,
            title: { ko: '2. 비공개 동시 입찰 (낮은 번호 우선)', en: '2. Sealed Ascending Bids' },
            desc: {
                ko: '매 라운드 바닥에는 인원수만큼 <strong>[2장 1세트]</strong>가 깔립니다. 플레이어들은 손패 4장 중 1장을 비공개로 골라 동시에 공개합니다.<br>이 게임의 가장 독특한 점: <span class="tut-highlight">가장 낮은 번호(이른 연도)를 낸 플레이어가 1순위</span>로 바닥 세트를 선택합니다!',
                en: 'Each round, sets of 2 cards are dealt to the floor. All players choose 1 card from hand secretly and reveal simultaneously.<br>Core twist: <span class="tut-highlight">The player with the lowest card number picks first</span> from the floor sets!'
            },
            keyBox: {
                ko: '• 입찰에 낸 카드는 바닥으로 이동하여 다음 세트 부품이 됩니다.<br>• 원하는 바닥 세트를 먼저 낚아채려면 낮은 번호 카드를 전략적으로 아끼거나 베팅해야 합니다!',
                en: '• Cards used for bidding move to the floor to replenish subsequent sets.<br>• Sacrificing low numbers guarantees you grab the best floor sets before opponents!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-gavel"></i> ${isKo ? '동시 입찰 결과 예시' : 'Simultaneous Bidding Example'}
                    </div>
                    <div class="tut-visual-row">
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#10b981; font-weight:700; margin-bottom:4px;">
                                <i class="fa-solid fa-crown"></i> ${isKo ? '내 입찰 (1순위 선택권!)' : 'Your Bid (1st Pick!)'}
                            </div>
                            <div class="tut-demo-card winner" style="border-color:#10b981; margin:0 auto;">
                                <div class="tut-card-era">원시</div>
                                <div class="tut-card-sym" style="color:#10b981;">🤝</div>
                                <div class="tut-card-val" style="color:#fbbf24; font-size:1.1rem;"># 14</div>
                                <div style="font-size:0.6rem; text-align:center; color:#34d399;">낮은 번호!</div>
                            </div>
                        </div>

                        <div style="font-size:1.3rem; color:#64748b; font-weight:bold;">VS</div>

                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#94a3b8; font-weight:600; margin-bottom:4px;">
                                ${isKo ? '상대 입찰 (2순위)' : 'Opponent Bid (2nd Pick)'}
                            </div>
                            <div class="tut-demo-card" style="opacity:0.75; margin:0 auto;">
                                <div class="tut-card-era">근대</div>
                                <div class="tut-card-sym" style="color:#fbbf24;">📜</div>
                                <div class="tut-card-val" style="color:#cbd5e1; font-size:1.1rem;"># 58</div>
                                <div style="font-size:0.6rem; text-align:center; color:#94a3b8;">높은 번호</div>
                            </div>
                        </div>
                    </div>
                    <div class="tut-interactive-note">
                        <i class="fa-solid fa-check"></i> ${isKo ? '#14가 #58보다 작으므로 내가 바닥의 최고 세트를 먼저 가져옵니다!' : '#14 is lower than #58, so you pick your favorite 2-card set first!'}
                    </div>
                </div>
            `
        },
        {
            step: 3,
            title: { ko: '3. 세트 분배: [1장 타임라인 배치] & [1장 손패]', en: '3. Draft: 1 to Timeline, 1 to Hand' },
            desc: {
                ko: '바닥에서 2장 세트를 가져왔다면:<br>1. <strong>1장은 내 생애 타임라인에 즉시 배치</strong>합니다.<br>2. <strong>다른 1장은 내 손패로 보관</strong>합니다 (손패는 항상 4장으로 유지).<br>타임라인에 카드를 놓을 때는 기본적으로 왼쪽에서 오른쪽으로 <strong>연도가 커지는 오름차순</strong>이어야 합니다!',
                en: 'From your picked 2-card set:<br>1. <strong>Place 1 card immediately into your Karmic Timeline</strong>.<br>2. <strong>Add the other card into your Hand</strong> (maintaining 4 cards in hand).<br>Cards placed on your timeline must be ordered in <strong>strictly ascending order</strong> from left to right!'
            },
            keyBox: {
                ko: '• <strong>생애 타임라인 예시:</strong> [#08 원시] ➔ [#24 중세] ➔ [#42 르네상스] ➔ [#65 현대]<br>• 번호가 맞지 않으면 특수 카드를 쓰거나 손패에 킵해야 하므로 신중하게 세트를 선택하세요!',
                en: '• <strong>Timeline Example:</strong> [#08 Ancient] ➔ [#24 Medieval] ➔ [#42 Renaissance] ➔ [#65 Modern]<br>• If a number does not fit ascending order, you must save it in hand or utilize directional cards!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-code-fork"></i> ${isKo ? '획득한 2장 세트의 운명' : 'Destiny of your 2-card Set'}
                    </div>
                    <div class="tut-visual-row" style="gap:20px;">
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#38bdf8; font-weight:700; margin-bottom:4px;">
                                <i class="fa-solid fa-arrow-down"></i> ${isKo ? '타임라인에 오름차순 배치' : 'Place to Timeline'}
                            </div>
                            <div class="tut-demo-card" style="border-color:#38bdf8; margin:0 auto;">
                                <div class="tut-card-era">중세</div>
                                <div class="tut-card-sym" style="color:#fbbf24;">📜</div>
                                <div class="tut-card-val" style="color:#38bdf8;"># 26</div>
                                <div style="font-size:0.6rem; text-align:center; color:#38bdf8;">타임라인</div>
                            </div>
                        </div>

                        <div style="font-size:1.4rem; color:#f59e0b;">+</div>

                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#a855f7; font-weight:700; margin-bottom:4px;">
                                <i class="fa-solid fa-hand"></i> ${isKo ? '손패로 킵 (다음 입찰용)' : 'Keep to Hand (for next bid)'}
                            </div>
                            <div class="tut-demo-card" style="border-color:#a855f7; margin:0 auto;">
                                <div class="tut-card-era">원시</div>
                                <div class="tut-card-sym" style="color:#f43f5e;">❤</div>
                                <div class="tut-card-val" style="color:#a855f7;"># 09</div>
                                <div style="font-size:0.6rem; text-align:center; color:#a855f7;">손패 보관</div>
                            </div>
                        </div>
                    </div>
                    <div class="tut-interactive-note">
                        <i class="fa-solid fa-circle-check"></i> ${isKo ? '1장은 영구 기록, 1장은 손패에 보관하여 유연하게 전략을 운영합니다.' : '1 locks into your timeline, 1 enriches your hand for future bidding.'}
                    </div>
                </div>
            `
        },
        {
            step: 4,
            title: { ko: '4. 특수 방향 카드 (이웃 카드 효과 제거 & 2배 증폭!)', en: '4. Special Directional Cards (Cancel & 2x Multiplier)' },
            desc: {
                ko: '타임라인에는 숫자 대신 화살표가 있는 특수 카드가 존재합니다! 점수를 뒤집는 최고의 전략 요소입니다.<br>• <strong>`#[✕] ←` / `→ #[✕]` (이웃 카드 효과 제거 6장)</strong>: 화살표 방향 바로 이웃한 카드의 효과와 점수를 <strong>완전 무효화(0점 처리)</strong>합니다! 치명적인 감점(배신, 빚)을 지우는 완벽한 방패!<br>• <strong>`2*# ←` / `→ 2*#` (2배 증폭 4장)</strong>: 이웃한 카드의 점수와 심볼/시대 카운트를 <strong>2배</strong>로 증폭합니다!',
                en: 'Special cards bear directional arrows instead of raw numbers! They offer incredible tactical reversals:<br>• <strong>`#[✕] ←` / `→ #[✕]` (Cancel Neighbor Card)</strong>: Completely nullifies neighbor card score and effect to <strong>0 VP</strong>! Shield yourself against painful debts or wars!<br>• <strong>`2*# ←` / `→ 2*#` (Double Multiplier)</strong>: Multiplies neighbor card value and counts by <strong>2x</strong>!'
            },
            keyBox: {
                ko: '<strong>직접 체험해보세요:</strong> 아래 [🔄 무효화 카드 효과 토글] 버튼을 눌러보세요. 오른쪽의 [#[✕] ←] 카드가 왼쪽의 [-15점 배신]을 0점으로 완벽히 무력화하는 모습을 볼 수 있습니다!',
                en: '<strong>Interactive Playground:</strong> Click the toggle button below. Watch how the [#[✕] ←] card completely neutralizes the -15 VP Betrayal penalty into 0 VP!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> ${isKo ? '무효화 카드 실시간 작동 체험' : 'Interactive Nullification Demonstration'}
                    </div>
                    <div class="tut-visual-row" style="gap:14px;" id="plTutDirectionalRow">
                        <div class="tut-demo-card nullified" id="demoBetrayalCard" style="border-color:#ef4444;">
                            <div class="tut-card-era">중세</div>
                            <div class="tut-card-sym" style="color:#ef4444;">🗡</div>
                            <div class="tut-card-val" id="demoBetrayalVal" style="color:#94a3b8; font-size:0.8rem;">0 VP</div>
                            <div style="font-size:0.58rem; text-align:center; color:#38bdf8;" id="demoBetrayalBadge">${isKo ? '방어 성공!' : 'Nullified!'}</div>
                        </div>

                        <div style="font-size:1.2rem; color:#38bdf8;"><i class="fa-solid fa-shield-halved"></i></div>

                        <div class="tut-demo-card" style="border-color:#38bdf8;">
                            <div class="tut-card-era">특수</div>
                            <div class="tut-card-sym" style="color:#38bdf8; font-size:1.1rem; font-weight:900;">#[✕] ←</div>
                            <div class="tut-card-dir">좌측 무효화</div>
                            <div style="font-size:0.58rem; text-align:center; color:#94a3b8;">${isKo ? '화살표 카드' : 'Arrow Card'}</div>
                        </div>
                    </div>
                    <button type="button" class="tut-interactive-btn" id="btnToggleNullifyDemo">
                        <i class="fa-solid fa-arrows-rotate"></i> ${isKo ? '🔄 무효화 카드 효과 켜기/끄기 토글' : '🔄 Toggle Nullification On/Off'}
                    </button>
                </div>
            `
        },
        {
            step: 5,
            title: { ko: '5. 10R 덱 소진 & 마지막 [비밀 인연 교환]', en: '5. Round 10: Final Secret Karma Exchange' },
            desc: {
                ko: '10라운드가 끝나 덱이 모두 바닥나면 최종 결전이 시작됩니다!<br>이때 모든 플레이어는 손패에 정확히 2장씩을 쥐고 있습니다.<br>플레이어들은 손패 2장 중:<br>• <strong>1장은 상대방에게 비공개로 전달(선물)</strong>하고,<br>• <strong>1장은 자신이 킵</strong>하여 최종 타임라인에 배치합니다!',
                en: 'When the deck depletes at the end of Round 10, the climax begins!<br>At this point, every player holds exactly 2 cards in hand.<br>From your remaining 2 cards:<br>• <strong>Pass 1 card secretly to your opponent</strong>, and<br>• <strong>Keep 1 card for your own final timeline placement</strong>!'
            },
            keyBox: {
                ko: '• <strong>악연 떠넘기기 & 방해 공작:</strong> 상대에게 치명적인 감점 카드나 상대 타임라인의 오름차순을 파괴할 카드를 선물하세요! 반대로 상대가 나에게 보낸 카드가 내 타임라인에 맞지 않으면 불이익이 생길 수 있습니다.',
                en: '• <strong>Sabotage & Deception:</strong> Saddle your opponent with a disastrous penalty card or disrupt their ascending order! Stay alert until the very last card is revealed.'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box">
                    <div style="font-size:0.8rem; font-weight:700; color:#fbbf24; margin-bottom:4px;">
                        <i class="fa-solid fa-gift"></i> ${isKo ? '마지막 비밀 교환의 순간' : 'The Climax: Secret Karma Exchange'}
                    </div>
                    <div class="tut-visual-row" style="gap:24px;">
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#cbd5e1; margin-bottom:4px;">${isKo ? '나의 선택' : 'Your Action'}</div>
                            <div style="padding:10px; border-radius:8px; background:rgba(30,41,59,0.7); border:1px dashed #64748b;">
                                <div style="font-size:0.75rem; color:#ef4444; font-weight:700;">${isKo ? '1장 ➔ 상대에게 비밀 전달' : '1 Card ➔ Pass to Opponent'}</div>
                                <div style="font-size:0.75rem; color:#10b981; font-weight:700; margin-top:4px;">${isKo ? '1장 ➔ 내 타임라인에 킵' : '1 Card ➔ Keep for Timeline'}</div>
                            </div>
                        </div>

                        <div style="font-size:1.5rem; color:#fbbf24;"><i class="fa-solid fa-right-left"></i></div>

                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#cbd5e1; margin-bottom:4px;">${isKo ? '상대의 선택' : 'Opponent Action'}</div>
                            <div style="padding:10px; border-radius:8px; background:rgba(30,41,59,0.7); border:1px dashed #64748b;">
                                <div style="font-size:0.75rem; color:#fbbf24; font-weight:700;">${isKo ? '1장 ➔ 나에게 비밀 선물' : '1 Card ➔ Secret Gift to You'}</div>
                                <div style="font-size:0.75rem; color:#38bdf8; font-weight:700; margin-top:4px;">${isKo ? '1장 ➔ 상대 타임라인에 킵' : '1 Card ➔ Keep in Timeline'}</div>
                            </div>
                        </div>
                    </div>
                    <div class="tut-interactive-note">
                        <i class="fa-solid fa-user-secret"></i> ${isKo ? '비밀 인연 교환으로 마지막 순간 승패가 뒤집힐 수 있습니다!' : 'Secret exchanges create thrilling last-second comebacks!'}
                    </div>
                </div>
            `
        },
        {
            step: 6,
            title: { ko: '6. 점수 계산 & 시대 최다 보유 보너스', en: '6. Scoring & Era Dominance' },
            desc: {
                ko: '게임 종료 시 타임라인과 손패의 모든 카드를 종합하여 최종 승자를 가립니다:<br>1. <strong>인연별 점수</strong>: 충족된 세트는 고득점(+15, +12 등), 미달된 부정 인연은 감점.<br>2. <strong>특수 효과 계산</strong>: 2배 증폭 및 좌우 무효화 적용.<br>3. <strong>시대 최다 보유 보너스 (+10 VP)</strong>: 7개 시대 중 단일 시대에서 가장 많은 카드를 모은 자에게 수여!<br>총점이 가장 높은 플레이어가 승리합니다!',
                en: 'At game end, all cards from both timeline and hand are tallied:<br>1. <strong>Connection Sets</strong>: Fulfill set requirements for massive points; unmet debts deduct points.<br>2. <strong>Directional Multipliers</strong>: 2x boosts and nullifications resolved.<br>3. <strong>Era Majority Bonus (+10 VP)</strong>: The player holding the most cards from any single era wins +10 VP!<br>Highest karmic total claims victory!'
            },
            keyBox: {
                ko: '🎉 <strong>튜토리얼 완료!</strong> 이제 전생의 인연을 엮으러 떠날 준비가 되었습니다. 아래 [게임 시작하기]를 눌러 AI 대전 또는 패스앤플레이를 즐겨보세요!',
                en: '🎉 <strong>Tutorial Complete!</strong> You are ready to weave your karmic destiny. Click [Start Game] below to jump right into action!'
            },
            renderDemo: (isKo) => `
                <div class="tut-visual-box" style="background:linear-gradient(135deg, rgba(245,158,11,0.1), rgba(16,185,129,0.1)); border-color:rgba(245,158,11,0.35);">
                    <div style="font-size:0.95rem; font-weight:800; color:#fbbf24;">
                        <i class="fa-solid fa-trophy"></i> ${isKo ? '준비 완료! 영혼의 완성을 향해!' : 'Ready! Strive for Enlightenment!'}
                    </div>
                    <p style="font-size:0.85rem; color:#e2e8f0; text-align:center; max-width:480px; margin:0;">
                        ${isKo ? '낮은 번호로 바닥 세트를 선점하고, 타임라인을 완성하며, 마지막 심리전까지 승리하세요.' : 'Snatch prime floor sets with low bids, craft an exquisite timeline, and win the psychological endgame.'}
                    </p>
                    <button type="button" class="tut-nav-btn finish" id="btnTutStartGameNow" style="padding:10px 24px; font-size:0.95rem;">
                        <i class="fa-solid fa-play"></i> ${isKo ? '지금 바로 게임 시작하기' : 'Start Playing Now'}
                    </button>
                </div>
            `
        }
    ];

    let currentTutStepPL = 1;
    let nullifyDemoActivePL = true;

    function openTutorialPL(step = 1) {
        currentTutStepPL = Math.max(1, Math.min(step, TUTORIAL_STEPS_PL.length));
        const modal = document.getElementById('tutorialModal');
        if (modal) {
            modal.classList.add('active');
            renderTutorialSlidePL();
        }
    }

    function closeTutorialPL() {
        const modal = document.getElementById('tutorialModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    function renderTutorialSlidePL() {
        const isKo = (state.lang === 'ko');
        const data = TUTORIAL_STEPS_PL[currentTutStepPL - 1];
        if (!data) return;

        // Step Badge
        const stepBadge = document.getElementById('tutStepBadge');
        if (stepBadge) {
            stepBadge.textContent = `Step ${currentTutStepPL} / ${TUTORIAL_STEPS_PL.length}`;
        }

        // Progress Bar
        const barItems = document.querySelectorAll('#tutProgressBar .tut-step-bar-item');
        barItems.forEach((item, idx) => {
            const stepNum = idx + 1;
            item.classList.remove('active', 'completed');
            if (stepNum === currentTutStepPL) item.classList.add('active');
            else if (stepNum < currentTutStepPL) item.classList.add('completed');
        });

        // Body Content
        const body = document.getElementById('tutBody');
        if (body) {
            body.innerHTML = `
                <div class="tut-slide-title">
                    <i class="fa-solid fa-compass" style="color:var(--gold);"></i> ${data.title[isKo ? 'ko' : 'en']}
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
            dots.innerHTML = TUTORIAL_STEPS_PL.map((_, idx) => `
                <div class="tut-step-dot ${idx + 1 === currentTutStepPL ? 'active' : ''}" data-step="${idx + 1}"></div>
            `).join('');
            dots.querySelectorAll('.tut-step-dot').forEach(d => {
                d.onclick = () => {
                    currentTutStepPL = parseInt(d.getAttribute('data-step'), 10);
                    renderTutorialSlidePL();
                };
            });
        }

        // Prev Button
        const btnPrev = document.getElementById('btnTutPrev');
        if (btnPrev) {
            btnPrev.disabled = (currentTutStepPL === 1);
            btnPrev.onclick = () => {
                if (currentTutStepPL > 1) {
                    currentTutStepPL--;
                    renderTutorialSlidePL();
                }
            };
        }

        // Next Button
        const btnNext = document.getElementById('btnTutNext');
        if (btnNext) {
            if (currentTutStepPL === TUTORIAL_STEPS_PL.length) {
                btnNext.className = 'tut-nav-btn finish';
                btnNext.innerHTML = `<i class="fa-solid fa-play"></i> <span>${isKo ? '게임 시작하기' : 'Start Playing'}</span>`;
                btnNext.onclick = () => {
                    closeTutorialPL();
                };
            } else {
                btnNext.className = 'tut-nav-btn next';
                btnNext.innerHTML = `<span>${isKo ? '다음' : 'Next'}</span> <i class="fa-solid fa-arrow-right"></i>`;
                btnNext.onclick = () => {
                    if (currentTutStepPL < TUTORIAL_STEPS_PL.length) {
                        currentTutStepPL++;
                        renderTutorialSlidePL();
                    }
                };
            }
        }

        // Hook up interactive toggle in step 4
        const btnToggle = document.getElementById('btnToggleNullifyDemo');
        if (btnToggle) {
            btnToggle.onclick = () => {
                nullifyDemoActivePL = !nullifyDemoActivePL;
                const card = document.getElementById('demoBetrayalCard');
                const val = document.getElementById('demoBetrayalVal');
                const badge = document.getElementById('demoBetrayalBadge');
                if (card && val && badge) {
                    if (nullifyDemoActivePL) {
                        card.classList.add('nullified');
                        val.textContent = '0 VP';
                        val.style.color = '#94a3b8';
                        badge.textContent = isKo ? '방어 성공!' : 'Nullified!';
                        badge.style.color = '#38bdf8';
                    } else {
                        card.classList.remove('nullified');
                        val.textContent = '-15 VP';
                        val.style.color = '#ef4444';
                        badge.textContent = isKo ? '감점 발생!' : 'Penalty Active!';
                        badge.style.color = '#ef4444';
                    }
                }
            };
        }

        // Hook up Start Game Now button in step 6
        const btnStartNow = document.getElementById('btnTutStartGameNow');
        if (btnStartNow) {
            btnStartNow.onclick = () => {
                closeTutorialPL();
            };
        }
    }

    function setupTutorialEventsPL() {
        const btnTut = document.getElementById('btnTutorial');
        if (btnTut) {
            btnTut.onclick = () => openTutorialPL(1);
        }

        const btnTutModal = document.getElementById('btnOpenTutorialFromModal');
        if (btnTutModal) {
            btnTutModal.onclick = () => {
                const modalNew = document.getElementById('newGameModal');
                if (modalNew) modalNew.classList.remove('active');
                openTutorialPL(1);
            };
        }

        const closeBtn = document.getElementById('closeTutorialModal');
        if (closeBtn) {
            closeBtn.onclick = closeTutorialPL;
        }

        // Progress bar click
        const barItems = document.querySelectorAll('#tutProgressBar .tut-step-bar-item');
        barItems.forEach(item => {
            item.onclick = () => {
                const s = parseInt(item.getAttribute('data-step'), 10);
                if (s) {
                    currentTutStepPL = s;
                    renderTutorialSlidePL();
                }
            };
        });

        // Auto-open via URL parameter ?tutorial=1
        try {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('tutorial') === '1' || urlParams.get('t') === '1') {
                setTimeout(() => openTutorialPL(1), 350);
            }
        } catch (e) {}
    }

    // DOM Ready Initialization
    document.addEventListener('DOMContentLoaded', () => {
        setupModalEvents();
        setupTutorialEventsPL();
        initGame({ playerCount: 3, gameMode: 'ai' });
    });

})();
