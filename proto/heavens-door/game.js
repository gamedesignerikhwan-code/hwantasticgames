(function () {
    'use strict';

    // Game Constants
    const SYMBOLS = ['triangle', 'trapezoid', 'square', 'circle', 'star', 'hexagon'];
    const COLORS = ['black', 'red', 'yellow', 'green', 'blue', 'purple', 'gray', 'white'];
    
    const SYMBOL_NAMES = {
        en: { triangle: 'Triangle', trapezoid: 'Trapezoid', square: 'Square', circle: 'Circle', star: 'Star', hexagon: 'Hexagon' },
        ko: { triangle: '삼각형', trapezoid: '사다리꼴', square: '정사각형', circle: '원', star: '별', hexagon: '육각형' }
    };

    const SYMBOL_ICONS = {
        triangle: '▲',
        trapezoid: '⏢',
        square: '■',
        circle: '●',
        star: '★',
        hexagon: '⬢'
    };

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
        } else if (type === 'win') {
            [440, 554, 659, 880].forEach((f, i) => {
                setTimeout(() => playTone(f, 'triangle', 0.35, 0.14), i * 120);
            });
        }
    }

    // State
    const state = {
        lang: 'ko',
        soundEnabled: true,
        playerCount: 2, // 2P (Player vs AI)
        scoringMode: 'mixed', // 'A', 'B', or 'mixed'
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
                name: isHuman ? (state.lang === 'ko' ? '나 (플레이어)' : 'You (Player)') : `AI ${i}`,
                isHuman,
                // Board columns: ordered list of symbol placements { symbol, ruleType: 'A'|'B', tiles: [] }
                columns: [],
                combos: [],
                duplicates: [],
                totalScore: 0
            });
        }

        const deck = createTileDeck();

        // Stacking Setup based on player count
        // 2P: Layer 0 (6x5, 30 tiles), Layer 1 (5x4, 20 tiles)
        // 3P: Layer 0 (7x6, 42 tiles), Layer 1 (6x5, 30 tiles)
        // 4P: Layer 0 (7x6, 42 tiles), Layer 1 (6x5, 30 tiles), Layer 2 (5x4, 20 tiles)
        let layerConfigs;
        if (state.playerCount === 2) {
            layerConfigs = [
                { rows: 6, cols: 5 }, // Layer 0
                { rows: 5, cols: 4 }  // Layer 1 (Top)
            ];
        } else if (state.playerCount === 3) {
            layerConfigs = [
                { rows: 7, cols: 6 },
                { rows: 6, cols: 5 }
            ];
        } else {
            layerConfigs = [
                { rows: 7, cols: 6 },
                { rows: 6, cols: 5 },
                { rows: 5, cols: 4 }
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
            // 1 tile to player's normal board, 1 tile under COMBO tile
            addTileToPlayerBoard(player, tile1);
            player.combos.push(tile2);
            postTurnCheck();
            return;
        }

        playSound('match');

        // Check if both tiles introduce NEW symbols not yet on the player board
        const hasSymbol1 = player.columns.some(col => col.symbol === tile1.symbol);
        const hasSymbol2 = player.columns.some(col => col.symbol === tile2.symbol);

        if (!hasSymbol1 && !hasSymbol2 && tile1.symbol !== tile2.symbol && player.isHuman && player.columns.length < 5) {
            // Need player to decide which goes on left side (Rule 2)
            state.pendingDraft = { player, tile1, tile2 };
            showSymbolOrderModal(tile1, tile2);
            return;
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
                let ruleType = state.scoringMode;
                if (ruleType === 'mixed') {
                    ruleType = preferredRuleType || (Math.random() < 0.5 ? 'A' : 'B');
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
                        pts = 2 * count * p.combos.length;
                    } else {
                        pts = count * (p.combos.length * p.duplicates.length);
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
                        // Tiles in rightmost column (col index 5, or last col)
                        const lastCol = p.columns[p.columns.length - 1];
                        const rightColCount = lastCol ? lastCol.tiles.length : 0;
                        pts = count * rightColCount;
                    }
                } else if (col.symbol === 'star') {
                    const myStars = starCounts[pIdx];
                    if (isTypeA) {
                        // Sole majority
                        const tied = starCounts.filter(s => s === maxStars).length > 1;
                        pts = (myStars === maxStars && !tied && myStars > 0) ? 50 : 0;
                    } else {
                        // Not the fewest
                        const isFewest = (myStars === minStars);
                        pts = !isFewest ? 25 : 0;
                    }
                } else if (col.symbol === 'hexagon') {
                    const myHex = hexCounts[pIdx];
                    if (isTypeA) {
                        const threshold = (state.playerCount === 2 ? 4 : (state.playerCount === 3 ? 5 : 6));
                        const targetPts = (state.playerCount === 2 ? 44 : (state.playerCount === 3 ? 55 : 66));
                        pts = (myHex >= threshold) ? targetPts : 0;
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
    function showSymbolOrderModal(tile1, tile2) {
        const modal = document.getElementById('choiceModal');
        const container = document.getElementById('choiceOptionsGrid');
        if (!modal || !container) return;

        const isKo = (state.lang === 'ko');
        document.getElementById('choiceModalTitle').textContent = isKo ? '첫 배치 순서 결정' : 'First Symbol Order Choice';
        document.getElementById('choiceModalDesc').textContent = isKo ? 
            '새로운 두 종류의 기호가 동시에 획득되었습니다. 개인 보드의 왼쪽에 먼저 놓을 기호를 선택하세요.' :
            'Two new symbols were acquired simultaneously. Choose which symbol to place to the left on your board.';

        container.innerHTML = `
            <button type="button" class="btn-choice" id="btnOrder1">
                <span style="font-size: 1.8rem;">${SYMBOL_ICONS[tile1.symbol]}</span>
                <span>${SYMBOL_NAMES[state.lang][tile1.symbol]} (좌측)</span>
            </button>
            <button type="button" class="btn-choice" id="btnOrder2">
                <span style="font-size: 1.8rem;">${SYMBOL_ICONS[tile2.symbol]}</span>
                <span>${SYMBOL_NAMES[state.lang][tile2.symbol]} (좌측)</span>
            </button>
        `;

        document.getElementById('btnOrder1').onclick = () => {
            modal.classList.remove('active');
            addTileToPlayerBoard(state.pendingDraft.player, tile1);
            addTileToPlayerBoard(state.pendingDraft.player, tile2);
            state.pendingDraft = null;
            postTurnCheck();
        };

        document.getElementById('btnOrder2').onclick = () => {
            modal.classList.remove('active');
            addTileToPlayerBoard(state.pendingDraft.player, tile2);
            addTileToPlayerBoard(state.pendingDraft.player, tile1);
            state.pendingDraft = null;
            postTurnCheck();
        };

        modal.classList.add('active');
    }

    // Modal: Victory screen
    function showVictoryModal() {
        const modal = document.getElementById('victoryModal');
        const list = document.getElementById('victoryScoresList');
        if (!modal || !list) return;

        const isKo = (state.lang === 'ko');
        const sorted = [...state.players].sort((a, b) => b.totalScore - a.totalScore);
        const winner = sorted[0];

        document.getElementById('victoryWinnerTitle').textContent = isKo ? 
            `🎉 ${winner.name} 승리! (${winner.totalScore}점)` :
            `🎉 ${winner.name} Wins! (${winner.totalScore} pts)`;

        list.innerHTML = sorted.map((p, idx) => `
            <div class="score-row ${idx === 0 ? 'winner' : ''}">
                <div>
                    <strong style="font-size: 1.05rem; display:block;">${p.name}</strong>
                    <div class="score-breakdown-details">
                        <span>${isKo ? '기호' : 'Symbols'}: ${p.scoreBreakdown.symbolPoints}pt</span>
                        <span>${isKo ? '세트' : 'Set'}: ${p.scoreBreakdown.setBonus}pt</span>
                        <span>${isKo ? '콤보' : 'Combo'}: ${p.scoreBreakdown.comboPts}pt</span>
                        <span>${isKo ? '중복' : 'Dupl'}: ${p.scoreBreakdown.duplicatePts}pt</span>
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

        // Status bar
        const badge = document.getElementById('turnStatusBadge');
        const activeP = state.players[state.activePlayerIndex];
        if (badge && activeP) {
            badge.className = `status-badge ${activeP.isHuman ? '' : 'ai-turn'}`;
            const turnText = isKo ? `턴 ${state.turn}/${state.maxTurns}` : `Turn ${state.turn}/${state.maxTurns}`;
            const playerText = activeP.isHuman ? (isKo ? '내 차례' : 'Your Turn') : (isKo ? `${activeP.name} 생각 중...` : `${activeP.name} Thinking...`);
            badge.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ${turnText} · ${playerText}`;
        }

        // Prompt Banner
        const promptEl = document.getElementById('promptText');
        if (promptEl) {
            if (state.gameOver) {
                promptEl.innerHTML = isKo ? '<i class="fa-solid fa-flag-checkered"></i> 게임이 종료되었습니다!' : '<i class="fa-solid fa-flag-checkered"></i> Game Over!';
            } else if (!activeP.isHuman) {
                promptEl.innerHTML = isKo ? '<i class="fa-solid fa-robot"></i> AI가 최적의 조합을 선택하고 있습니다...' : '<i class="fa-solid fa-robot"></i> AI is evaluating the best pair...';
            } else if (!state.selectedTile) {
                promptEl.innerHTML = isKo ? 
                    '<i class="fa-solid fa-hand-pointer"></i> 첫 번째 타일을 선택하세요 (외곽에 노출된 앞면 타일)' :
                    '<i class="fa-solid fa-hand-pointer"></i> Select your 1st tile (exposed border tile)';
            } else {
                promptEl.innerHTML = isKo ? 
                    `<i class="fa-solid fa-link"></i> 두 번째 타일을 선택하세요 (선택한 타일과 <strong>색상</strong> 또는 <strong>기호</strong>가 같은 타일)` :
                    `<i class="fa-solid fa-link"></i> Select your 2nd tile (must match <strong>Color</strong> or <strong>Symbol</strong>)`;
            }
        }

        // Render 3D Pyramid Board
        renderPyramid();

        // Render Personal Boards
        renderPlayers();
    }

    function renderPyramid() {
        const stage = document.getElementById('pyramidGridWrap');
        if (!stage) return;
        stage.innerHTML = '';

        const tileSize = window.innerWidth <= 768 ? 40 : 54;
        const tileGap = window.innerWidth <= 768 ? 4 : 6;
        const stride = tileSize + tileGap;

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

                    if (!tile.faceUp) {
                        el.classList.add('face-down');
                    } else {
                        el.innerHTML = renderSymbolSvg(tile.symbol);
                    }

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

                    colsHtml += `
                        <div class="pb-symbol-col">
                            <div class="pb-scoring-tile type-${col.ruleType.toLowerCase()}">
                                <span class="pb-rule-badge">${col.ruleType}</span>
                                <div class="pb-symbol-mark">${icon}</div>
                                <div class="pb-col-score">${pts} pt</div>
                            </div>
                            <span class="pb-bonus-indicator">+${setVal} VP</span>
                            <div class="pb-tile-stack">
                                ${col.tiles.map(t => `
                                    <div class="mini-tile tile-color-${t.color}" title="${t.color} ${col.symbol}">
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

        // New game settings modal
        const btnNew = document.getElementById('btnNewGame');
        const modalNew = document.getElementById('newGameModal');
        const closeNew = document.getElementById('closeNewGameModal');
        const btnStart = document.getElementById('btnStartNewGame');

        if (btnNew && modalNew) btnNew.onclick = () => modalNew.classList.add('active');
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
                initGame({ playerCount: state.playerCount, scoringMode: state.scoringMode });
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
        const btnLang = document.getElementById('btnLangSwitch');
        if (btnLang) {
            btnLang.onclick = () => {
                state.lang = (state.lang === 'ko' ? 'en' : 'ko');
                btnLang.textContent = (state.lang === 'ko' ? 'EN' : '한국어');
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
    }

    function updateStaticTexts() {
        const isKo = (state.lang === 'ko');
        document.title = isKo ? "헤븐스 도어 (Heaven's Door) | 환상적인 게임즈" : "Heaven's Door | Hwantastic Games";
        document.querySelectorAll('[data-i18n-ko]').forEach(el => {
            el.innerHTML = isKo ? el.getAttribute('data-i18n-ko') : el.getAttribute('data-i18n-en');
        });
    }

    // Startup
    window.addEventListener('DOMContentLoaded', () => {
        setupModalEvents();
        updateStaticTexts();
        initGame({ playerCount: 2, scoringMode: 'mixed' });
    });

})();
