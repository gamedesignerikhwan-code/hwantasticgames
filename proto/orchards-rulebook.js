(function () {
    'use strict';

    // ── Components used by the rulebook's worked examples ───────────────────
    // Ported from the game itself (https://orchards-boardgame.vercel.app) so
    // the diagrams below show the very tiles players see at the table.
    const COLORS = {
        R: { en: 'Apple', ko: '사과', emoji: '🍎', hex: '#E64A58' },
        Y: { en: 'Banana', ko: '바나나', emoji: '🍌', hex: '#F2C94C' },
        G: { en: 'Pear', ko: '배', emoji: '🍐', hex: '#27AE60' },
        B: { en: 'Blueberry', ko: '블루베리', emoji: '🫐', hex: '#2D9CDB' },
        W: { en: 'Grape', ko: '포도', emoji: '🍇', hex: '#9B59B6' },
        S: { en: 'Scarecrow', ko: '허수아비', emoji: '🎃', hex: '#5D4037' }
    };

    const EXAMPLE_TILES = {
        15: { id: 15, type: 'terrain', color1: 'R', color2: 'Y', workers1: 1, workers2: 1 },
        18: { id: 18, type: 'terrain', color1: 'R', color2: 'G', workers1: 1, workers2: 1 },
        34: { id: 34, type: 'crop', crops: { R: 1, G: 1 } },
        37: { id: 37, type: 'crop', crops: { R: 1, B: 1 } },
        43: { id: 43, type: 'crop', crops: { G: 1, B: 1 } },
        55: { id: 55, type: 'crop', crops: { R: 2, S: 1 } },
        56: { id: 56, type: 'terrain', color1: 'R', color2: 'Y', workers1: 3, workers2: 2 },
        59: { id: 59, type: 'crop', crops: { Y: 2, S: 1 } },
        62: { id: 62, type: 'crop', crops: { R: 1, G: 2 } },
        68: { id: 68, type: 'crop', crops: { W: 2, S: 1 } },
        75: { id: 75, type: 'terrain', color1: 'B', color2: 'Y', workers1: 3, workers2: 2 },
        80: { id: 80, type: 'terrain', color1: 'W', color2: 'B', workers1: 3, workers2: 2 },
        89: { id: 89, type: 'crop', crops: { W: 3, S: 1 } }
    };

    const TILE_BADGE = {
        en: { terrain: 'Terrain', crop: 'Crop' },
        ko: { terrain: '지형', crop: '작물' }
    };

    const MEEPLE_SVG = '<svg class="meeple-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,2 C13.65,2 15,3.35 15,5 C15,6.2 14.28,7.24 13.25,7.72 L16.5,10.5 C17.3,11.2 17.5,12.3 17,13.1 L15.5,15.5 L17.5,21 C17.8,21.8 17.2,22 16.5,22 L13.5,22 L12,17.5 L10.5,22 L7.5,22 C6.8,22 6.2,21.8 6.5,21 L8.5,15.5 L7,13.1 C6.5,12.3 6.7,11.2 7.5,10.5 L10.75,7.72 C9.72,7.24 9,6.2 9,5 C9,3.35 10.35,2 12,2 Z" fill="#FFFFFF" stroke="rgba(0,0,0,0.55)" stroke-width="1.2" stroke-linejoin="round"/></svg>';

    function renderWhiteMeeples(count) {
        if (!count || count <= 0) return '';
        return `<div class="worker-meeple-group count-${count}">${MEEPLE_SVG.repeat(count)}</div>`;
    }

    function renderRulebookCard(tileId, lang, selected) {
        const tile = EXAMPLE_TILES[tileId];
        if (!tile) return '';
        const badge = TILE_BADGE[lang] || TILE_BADGE.en;
        const selectedClass = selected ? ' selected' : '';

        if (tile.type === 'terrain') {
            return `
                <div class="tile-card${selectedClass} terrain-card" data-tile-id="${tile.id}" data-mode="display-only">
                    <div class="tile-card-inner">
                        <div class="tile-card-split">
                            <div class="card-half card-half-top pattern-${tile.color1}">${renderWhiteMeeples(tile.workers1)}</div>
                            <div class="card-half card-half-bottom pattern-${tile.color2}">${renderWhiteMeeples(tile.workers2)}</div>
                        </div>
                    </div>
                    <div class="tile-card-footer">
                        <span class="tile-type-badge terrain-badge">${badge.terrain}</span>
                        <span class="tile-id">#${tile.id}</span>
                    </div>
                </div>`;
        }

        const cropIcons = Object.entries(tile.crops).map(([color, count]) =>
            `<span class="crop-icon pattern-${color}" style="background:${COLORS[color].hex}">${COLORS[color].emoji}</span>`.repeat(count)
        ).join('');

        return `
            <div class="tile-card${selectedClass} crop-card" data-tile-id="${tile.id}" data-mode="display-only">
                <div class="tile-card-inner crop-card-inner">
                    <div class="crop-icons-grid">${cropIcons}</div>
                </div>
                <div class="tile-card-footer">
                    <span class="tile-type-badge crop-badge">${badge.crop}</span>
                    <span class="tile-id">#${tile.id}</span>
                </div>
            </div>`;
    }

    function renderRulebookTerrain(tileId, rotation, tokens, tokenPosition) {
        const tile = EXAMPLE_TILES[tileId];
        if (!tile || tile.type !== 'terrain') return '';
        const tokenHtml = (tokens || []).map(color => {
            const info = COLORS[color];
            return `<span class="rule-piece-token pattern-${color}" title="${info.en}">${info.emoji}</span>`;
        }).join('');

        return `
            <div class="rule-board-piece">
                <div class="rule-terrain-square">
                    <div class="tile-split" style="transform:rotate(${rotation * 90}deg)">
                        <div class="tile-half tile-half-top pattern-${tile.color1}">${renderWhiteMeeples(tile.workers1)}</div>
                        <div class="tile-half tile-half-bottom pattern-${tile.color2}">${renderWhiteMeeples(tile.workers2)}</div>
                    </div>
                    ${tokenHtml ? `<div class="rule-piece-tokens ${tokenPosition}">${tokenHtml}</div>` : ''}
                    <span class="rule-piece-id">#${tile.id}</span>
                </div>
            </div>`;
    }

    function buildRulebookExample(type, lang) {
        const ko = lang === 'ko';
        const label = ko ? '플레이 예제' : 'Play example';

        if (type === 'draft') {
            return `
                <figure class="rule-play-example">
                    <figcaption><span>${label} 1</span><strong>${ko ? '1장을 남기고 나머지를 왼쪽으로 전달' : 'Keep one tile, pass the rest left'}</strong></figcaption>
                    <div class="rule-example-card-row rule-draft-cards">
                        ${[18, 34, 55, 68, 80].map(id => renderRulebookCard(id, lang, id === 34)).join('')}
                    </div>
                    <div class="rule-example-outcome">
                        <b>${ko ? '#34 선택' : 'Keep #34'}</b><span>→</span><span>${ko ? '나머지 4장을 왼쪽 플레이어에게 전달' : 'Pass the other 4 tiles to the player on your left'}</span>
                    </div>
                </figure>`;
        }

        if (type === 'bidding') {
            const bids = [[15, ko ? '나' : 'You', ko ? '1순위' : '1st'], [37, 'Mina', ko ? '2순위' : '2nd'], [59, 'Bot', ko ? '3순위' : '3rd']];
            return `
                <figure class="rule-play-example">
                    <figcaption><span>${label} 2</span><strong>${ko ? '낮은 번호가 시장을 먼저 선택' : 'The lowest number drafts first'}</strong></figcaption>
                    <div class="rule-example-subtitle">${ko ? '공개된 입찰' : 'Revealed bids'}</div>
                    <div class="rule-bid-lane">
                        ${bids.map(([id, name, order]) => `
                        <div class="rule-bid-entry ${id === 15 ? 'is-first' : ''}"><span class="rule-bid-order">${order}</span>${renderRulebookCard(id, lang)}<strong>${name}</strong></div>`).join('')}
                    </div>
                    <div class="rule-example-subtitle">${ko ? '시장 5장' : 'Five-tile market'}</div>
                    <div class="rule-example-card-row rule-market-example">
                        ${[43, 56, 62, 75, 89].map(id => renderRulebookCard(id, lang, id === 56)).join('')}
                    </div>
                    <div class="rule-example-outcome">
                        <b>${ko ? '#15로 1순위' : '#15 wins first choice'}</b><span>→</span><span>${ko ? '시장에서 #56을 손패로 가져오고, 입찰한 #15를 지금 사용합니다.' : 'Take #56 into your hand, then play the submitted #15 now.'}</span>
                    </div>
                </figure>`;
        }

        if (type === 'harvest') {
            return `
                <figure class="rule-play-example">
                    <figcaption><span>${label} 3</span><strong>${ko ? '작물 #55를 사용해 수확' : 'Harvest with crop tile #55'}</strong></figcaption>
                    <div class="rule-harvest-flow">
                        <div class="rule-example-single-card">${renderRulebookCard(55, lang)}</div>
                        <span class="rule-flow-arrow">→</span>
                        <div class="rule-token-bank" aria-label="${ko ? '사과 둘, 허수아비 하나' : 'two apples and one scarecrow'}">
                            <span class="rule-piece-token pattern-R">🍎</span><span class="rule-piece-token pattern-R">🍎</span><span class="rule-piece-token pattern-S">🎃</span>
                        </div>
                        <span class="rule-flow-arrow">→</span>
                        <div class="rule-connected-board">
                            ${renderRulebookTerrain(56, 1, ['R', 'R', 'S'], 'top-right')}
                            ${renderRulebookTerrain(18, 0, ['R'], 'top-left')}
                        </div>
                    </div>
                    <div class="rule-example-outcome"><b>${ko ? '색상 확인' : 'Match colors'}</b><span>→</span><span>${ko ? '사과는 빨간 지형에, 허수아비는 원하는 지형에 놓습니다. 오른쪽의 사과 1개는 이전 라운드에 놓은 토큰입니다.' : 'Apples go on red terrain; the scarecrow may go on either terrain. The apple on the right was placed in an earlier round.'}</span></div>
                </figure>`;
        }

        if (type === 'scoring') {
            return `
                <figure class="rule-play-example rule-score-scene">
                    <figcaption><span>${label} 4</span><strong>${ko ? '연결 과수원 하나를 계산' : 'Score one connected orchard'}</strong></figcaption>
                    <div class="rule-score-worked">
                        <div class="rule-connected-board rule-connected-board-large">
                            ${renderRulebookTerrain(56, 1, ['R', 'R', 'S'], 'top-right')}
                            ${renderRulebookTerrain(18, 0, ['R'], 'top-left')}
                        </div>
                        <div class="rule-score-math">
                            <div><span>${ko ? '기본 일꾼' : 'Printed workers'}</span><strong>3 + 1</strong></div>
                            <div><span>${ko ? '허수아비' : 'Scarecrow'}</span><strong>+ 1</strong></div>
                            <div><span>${ko ? '사과' : 'Apples'}</span><strong>× 3</strong></div>
                            <div class="is-total"><span>${ko ? '과수원 점수' : 'Orchard score'}</span><strong>15</strong></div>
                        </div>
                    </div>
                    <p class="rule-example-caption">${ko ? '빨간 지형이 맞닿은 변으로 연결되어 하나의 2타일 과수원입니다. 일꾼은 3 + 1 + 허수아비 1 = 5명, 사과는 3개이므로 5 × 3 = 15점입니다.' : 'The red halves meet across a shared edge, forming one 2-tile orchard. It has 3 + 1 printed workers, 1 scarecrow, and 3 apples: 5 × 3 = 15 points.'}</p>
                </figure>`;
        }

        return '';
    }

    const modalMarkup = `
        <div class="proto-modal-overlay" id="orchardsRulebookModal" role="dialog" aria-modal="true" style="display:none;">
        <div class="proto-modal-card rulebook-modal-card orchards-rulebook-modal-card">
            <div class="proto-modal-header">
                <div class="proto-modal-title">
                    <i class="fa-solid fa-apple-whole" style="color: #477544;"></i>
                    <span class="rb-title-text-en">Orchards — Complete Rulebook</span>
                    <span class="rb-title-text-ko" style="display:none;">오차드 — 전체 규칙서</span>
                </div>
                <div class="rulebook-header-actions">
                    <div class="rb-lang-toggle" role="group" aria-label="Rulebook language toggle">
                        <button type="button" class="rb-lang-btn" data-rb-lang="ko" onclick="setRulebookLanguage('ko', 'orchardsRulebookModal')">KO</button>
                        <button type="button" class="rb-lang-btn" data-rb-lang="en" onclick="setRulebookLanguage('en', 'orchardsRulebookModal')">EN</button>
                    </div>
                    <button type="button" class="proto-modal-close" onclick="closeModal('orchardsRulebookModal')" aria-label="Close rulebook modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <div class="proto-modal-body rulebook-body">
                <div class="rb-content-en">
                    <nav class="rulebook-nav-bar" aria-label="Rulebook sections">
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-en-overview')" class="rb-nav-link"><i class="fa-solid fa-circle-info"></i> 1. Overview</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-en-components')" class="rb-nav-link"><i class="fa-solid fa-shapes"></i> 2. Components</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-en-setup')" class="rb-nav-link"><i class="fa-solid fa-sliders"></i> 3. Setup</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-en-draft')" class="rb-nav-link"><i class="fa-solid fa-hand-pointer"></i> 4. Initial draft</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-en-round')" class="rb-nav-link"><i class="fa-solid fa-play"></i> 5. Round flow</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-en-placement')" class="rb-nav-link"><i class="fa-solid fa-seedling"></i> 6. Playing tiles</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-en-end')" class="rb-nav-link"><i class="fa-solid fa-flag-checkered"></i> 7. Game end</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-en-scoring')" class="rb-nav-link"><i class="fa-solid fa-star"></i> 8. Scoring</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-en-reference')" class="rb-nav-link"><i class="fa-solid fa-bookmark"></i> Quick reference</a>
                    </nav>

                    <div class="rb-intro-banner"><strong>Grow a connected orchard. Harvest at the perfect moment.</strong> Use the number on every tile as a blind bid, draft from the shared market, then turn that bid into a growing orchard or a fresh harvest.</div>

                    <div class="rb-specs-grid">
                        <div class="rb-spec-item">
                            <i class="fa-solid fa-users rb-spec-icon"></i>
                            <div class="rb-spec-label">Players</div>
                            <div class="rb-spec-value">2–5 Players</div>
                        </div>
                        <div class="rb-spec-item">
                            <i class="fa-solid fa-hourglass-half rb-spec-icon"></i>
                            <div class="rb-spec-label">Play Time</div>
                            <div class="rb-spec-value">30 Minutes</div>
                        </div>
                        <div class="rb-spec-item">
                            <i class="fa-solid fa-child-reaching rb-spec-icon"></i>
                            <div class="rb-spec-label">Age</div>
                            <div class="rb-spec-value">8+ Age</div>
                        </div>
                    </div>

                    <section class="rb-section" id="rules-en-overview">
                        <h3 class="rb-section-title"><i class="fa-solid fa-circle-info"></i> 01. Overview & objective</h3>
                        <p>You are building a productive orchard from five terrain types. Terrain brings workers; crop tiles bring fruit. At game end, each connected orchard scores <strong>workers × fruit</strong>. The player with the highest total score wins.</p>
                    </section>

                    <section class="rb-section" id="rules-en-components">
                        <h3 class="rb-section-title"><i class="fa-solid fa-shapes"></i> 02. Components</h3>
                        <div class="component-grid">
                              <div class="component-card"><span class="component-icon terrain-icon" aria-hidden="true"></span><strong>50 terrain tiles</strong><small>Two diagonal color halves and 1-5 workers in total.</small></div>
                              <div class="component-card"><span class="component-icon">🧺</span><strong>40 crop tiles</strong><small>Each provides 1-4 fruit and/or scarecrow tokens.</small></div>
                              <div class="component-card component-wide"><span class="component-icon">🍎</span><strong>106 tokens</strong><small>15 Apple · 17 Banana · 19 Pear · 21 Blueberry · 23 Grape · 11 Scarecrow</small></div>
                            </div>
                            <div class="rule-note"><strong>Tile numbers matter.</strong> Every tile has a unique number from 1 to 90. Lower numbers act earlier when bids are revealed.</div>
                    </section>

                    <section class="rb-section" id="rules-en-setup">
                        <h3 class="rb-section-title"><i class="fa-solid fa-sliders"></i> 03. Setup</h3>
                        <ol class="rule-list">
                              <li>Randomly remove tiles according to player count. Return them unseen.</li>
                              <li>Deal <strong>5 tiles</strong> to each player.</li>
                              <li>Place the remaining tiles face down as the deck and keep all tokens within reach.</li>
                            </ol>
                            <table class="setup-table"><thead><tr><th>Players</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><th>Remove</th><td>15</td><td>10</td><td>5</td><td>0</td></tr></tbody></table>
                    </section>

                    <section class="rb-section" id="rules-en-draft">
                        <h3 class="rb-section-title"><i class="fa-solid fa-hand-pointer"></i> 04. Initial hand draft</h3>
                        <p>Everyone chooses 1 tile from their 5-tile hand and keeps it. Pass all remaining tiles to the player on your left. Repeat until everyone has kept 4 tiles. The single unchosen tile left in each packet is removed from the game.</p><div class="rule-callout">You begin round 1 with exactly <strong>4 tiles in hand</strong>.</div><div class="rule-example-mount" data-rule-example="draft"></div>
                    </section>

                    <section class="rb-section" id="rules-en-round">
                        <h3 class="rb-section-title"><i class="fa-solid fa-play"></i> 05. Round flow</h3>
                        <p>The game has <strong>13 rounds</strong>. Complete these steps in order:</p>
                            <div class="round-flow">
                              <div><b>1</b><span><strong>Reveal the market</strong><small>Reveal 5 tiles from the deck.</small></span></div>
                              <div><b>2</b><span><strong>Bid secretly</strong><small>Each player chooses 1 tile from hand. This tile will also be played this round.</small></span></div>
                              <div><b>3</b><span><strong>Reveal & order</strong><small>Reveal together. Lowest tile number goes first, then continue upward.</small></span></div>
                              <div><b>4</b><span><strong>Draft</strong><small>In bid order, take 1 tile from the market into your hand.</small></span></div>
                              <div><b>5</b><span><strong>Play bids</strong><small>In the same order, resolve the tile each player submitted.</small></span></div>
                            </div>
                            <div class="rule-note"><strong>Hand size stays at 4.</strong> You bid one tile and draft one replacement every round.</div><div class="rule-example-mount" data-rule-example="bidding"></div>
                    </section>

                    <section class="rb-section" id="rules-en-placement">
                        <h3 class="rb-section-title"><i class="fa-solid fa-seedling"></i> 06. Playing tiles</h3>
                        <div class="tile-rule-grid">
                              <div class="tile-rule-card terrain-rule"><span>🌿</span><div><h4>Terrain tile</h4><ul><li>Your first terrain tile may be placed in any open space.</li><li>Every later terrain tile must share an edge with a tile already in your orchard. Diagonal contact is not enough.</li><li>You may rotate it in 90° steps before placing it. Colors do not need to match.</li></ul></div></div>
                              <div class="tile-rule-card crop-rule"><span>🧺</span><div><h4>Crop tile</h4><ul><li>Discard the crop tile and take every token shown on it.</li><li>Place each fruit on a terrain half of the matching color. Any number of tokens may share a half.</li><li>If a token has no matching terrain, it is discarded.</li></ul></div></div>
                              <div class="tile-rule-card scarecrow-rule"><span>🎃</span><div><h4>Scarecrow</h4><ul><li>May be placed on any terrain color.</li><li>Counts as <strong>+1 worker</strong> in that connected orchard; it is not fruit.</li></ul></div></div>
                            </div>
                            <div class="rule-warning"><strong>Early crop risk:</strong> If you play a crop before you have matching terrain, its fruit may be lost.</div><div class="rule-example-mount" data-rule-example="harvest"></div>
                    </section>

                    <section class="rb-section" id="rules-en-end">
                        <h3 class="rb-section-title"><i class="fa-solid fa-flag-checkered"></i> 07. Final play & game end</h3>
                        <p>After round 13, each player still has 4 tiles. Choose <strong>one</strong> final tile and play it normally. Discard the other 3. Once every final tile and its tokens have been resolved, proceed to scoring.</p>
                    </section>

                    <section class="rb-section" id="rules-en-scoring">
                        <h3 class="rb-section-title"><i class="fa-solid fa-star"></i> 08. Scoring</h3>
                        <h4>A. Connected-orchard points</h4>
                            <p>A connected orchard is a group of same-color terrain halves connected through shared edges. Rotated diagonal halves only connect where that colored half actually reaches the shared edge.</p>
                            <div class="score-formula"><span>Workers</span><b>×</b><span>Fruit</span><b>=</b><strong>Points</strong></div>
                            <p>Score every connected orchard separately, then add them together. Scarecrows are included in the worker total.</p>
                            <div class="rule-example-mount" data-rule-example="scoring"></div>
                            <h4>B. Largest-orchard bonus</h4>
                            <p>For each of the five colors, compare every player’s largest connected orchard by its <strong>number of terrain tiles</strong>. A sole leader gains <strong>10 points</strong>. If tied for largest, every tied player gains <strong>7 points</strong>. No bonus is awarded when nobody has that color.</p>
                            <h4>C. Victory</h4>
                            <p>Add all connected-orchard points and all largest-orchard bonuses. The highest total score wins.</p>
                    </section>

                    <section class="rb-section" id="rules-en-reference">
                        <h3 class="rb-section-title"><i class="fa-solid fa-bookmark"></i> Quick reference</h3>
                        <div class="quick-grid"><span>Market</span><strong>5 tiles</strong><span>Starting hand</span><strong>4 after draft</strong><span>Rounds</span><strong>13 + 1 final play</strong><span>Bid order</span><strong>Lowest number first</strong><span>Orchard score</span><strong>Workers × fruit</strong><span>Largest orchard</span><strong>10 / tied 7</strong></div>
                            <details><summary>What counts as connected?</summary><p>Only same-colored halves meeting across a shared edge. Corners never connect, and the rotated diagonal determines which edges each half touches.</p></details>
                            <details><summary>Does the market tile get played immediately?</summary><p>No. The market tile goes into your hand. The tile you submitted as your bid is the one played this round.</p></details>
                            <details><summary>Can I save a crop token for later?</summary><p>No. Resolve every token from the crop tile immediately; place it legally or discard it.</p></details>
                    </section>
                </div>

                <div class="rb-content-ko" style="display:none;">
                    <nav class="rulebook-nav-bar" aria-label="Rulebook sections">
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-ko-overview')" class="rb-nav-link"><i class="fa-solid fa-circle-info"></i> 1. 게임 개요</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-ko-components')" class="rb-nav-link"><i class="fa-solid fa-shapes"></i> 2. 구성물</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-ko-setup')" class="rb-nav-link"><i class="fa-solid fa-sliders"></i> 3. 게임 준비</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-ko-draft')" class="rb-nav-link"><i class="fa-solid fa-hand-pointer"></i> 4. 초기 드래프트</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-ko-round')" class="rb-nav-link"><i class="fa-solid fa-play"></i> 5. 라운드 진행</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-ko-placement')" class="rb-nav-link"><i class="fa-solid fa-seedling"></i> 6. 타일 사용</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-ko-end')" class="rb-nav-link"><i class="fa-solid fa-flag-checkered"></i> 7. 게임 종료</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-ko-scoring')" class="rb-nav-link"><i class="fa-solid fa-star"></i> 8. 점수 계산</a>
                        <a href="javascript:void(0)" onclick="scrollRulebookSection('rules-ko-reference')" class="rb-nav-link"><i class="fa-solid fa-bookmark"></i> 빠른 참조</a>
                    </nav>

                    <div class="rb-intro-banner"><strong>과수원을 연결하고, 가장 좋은 순간에 수확하세요.</strong> 타일의 고유 번호로 비공개 입찰하고, 공동 시장에서 타일을 가져온 뒤, 입찰에 사용한 타일로 과수원을 넓히거나 과일을 수확합니다.</div>

                    <div class="rb-specs-grid">
                        <div class="rb-spec-item">
                            <i class="fa-solid fa-users rb-spec-icon"></i>
                            <div class="rb-spec-label">인원</div>
                            <div class="rb-spec-value">2–5 인</div>
                        </div>
                        <div class="rb-spec-item">
                            <i class="fa-solid fa-hourglass-half rb-spec-icon"></i>
                            <div class="rb-spec-label">소요 시간</div>
                            <div class="rb-spec-value">30 분</div>
                        </div>
                        <div class="rb-spec-item">
                            <i class="fa-solid fa-child-reaching rb-spec-icon"></i>
                            <div class="rb-spec-label">연령</div>
                            <div class="rb-spec-value">8+ 연령</div>
                        </div>
                    </div>

                    <section class="rb-section" id="rules-ko-overview">
                        <h3 class="rb-section-title"><i class="fa-solid fa-circle-info"></i> 01. 게임 개요와 목표</h3>
                        <p>다섯 종류의 지형을 연결해 풍성한 과수원을 만듭니다. 지형 타일은 일꾼을, 작물 타일은 과일을 제공합니다. 게임이 끝나면 연결된 과수원마다 <strong>일꾼 × 과일</strong>로 점수를 얻으며, 총점이 가장 높은 플레이어가 승리합니다.</p>
                    </section>

                    <section class="rb-section" id="rules-ko-components">
                        <h3 class="rb-section-title"><i class="fa-solid fa-shapes"></i> 02. 구성물</h3>
                        <div class="component-grid">
                              <div class="component-card"><span class="component-icon terrain-icon" aria-hidden="true"></span><strong>지형 타일 50장</strong><small>대각선으로 나뉜 두 색 지형과 총 1-5명의 일꾼.</small></div>
                              <div class="component-card"><span class="component-icon">🧺</span><strong>작물 타일 40장</strong><small>과일 및 허수아비 토큰 1-4개를 제공합니다.</small></div>
                              <div class="component-card component-wide"><span class="component-icon">🍎</span><strong>토큰 106개</strong><small>사과 15 · 바나나 17 · 배 19 · 블루베리 21 · 포도 23 · 허수아비 11</small></div>
                            </div>
                            <div class="rule-note"><strong>타일 번호가 중요합니다.</strong> 모든 타일에는 1부터 90까지 서로 다른 번호가 있으며, 낮은 번호일수록 입찰 공개 후 먼저 행동합니다.</div>
                    </section>

                    <section class="rb-section" id="rules-ko-setup">
                        <h3 class="rb-section-title"><i class="fa-solid fa-sliders"></i> 03. 게임 준비</h3>
                        <ol class="rule-list">
                              <li>플레이어 수에 맞춰 타일을 무작위로 제거하고, 내용을 보지 않은 채 게임에서 제외합니다.</li>
                              <li>각 플레이어에게 타일을 <strong>5장씩</strong> 나눠 줍니다.</li>
                              <li>남은 타일은 뒷면으로 덱을 만들고, 모든 토큰을 손이 닿는 곳에 둡니다.</li>
                            </ol>
                            <table class="setup-table"><thead><tr><th>인원</th><th>2인</th><th>3인</th><th>4인</th><th>5인</th></tr></thead><tbody><tr><th>제거</th><td>15장</td><td>10장</td><td>5장</td><td>0장</td></tr></tbody></table>
                    </section>

                    <section class="rb-section" id="rules-ko-draft">
                        <h3 class="rb-section-title"><i class="fa-solid fa-hand-pointer"></i> 04. 초기 손패 드래프트</h3>
                        <p>모두 자신의 5장 중 1장을 골라 보관한 뒤, 남은 타일을 왼쪽 플레이어에게 전달합니다. 모두가 4장을 확보할 때까지 반복합니다. 각 묶음에 마지막으로 남은 선택되지 않은 1장은 게임에서 제거합니다.</p><div class="rule-callout">1라운드는 정확히 <strong>4장의 손패</strong>로 시작합니다.</div><div class="rule-example-mount" data-rule-example="draft"></div>
                    </section>

                    <section class="rb-section" id="rules-ko-round">
                        <h3 class="rb-section-title"><i class="fa-solid fa-play"></i> 05. 라운드 진행</h3>
                        <p>게임은 <strong>13라운드</strong> 동안 진행합니다. 매 라운드 아래 순서를 따릅니다.</p>
                            <div class="round-flow">
                              <div><b>1</b><span><strong>시장 공개</strong><small>덱에서 타일 5장을 공개합니다.</small></span></div>
                              <div><b>2</b><span><strong>비공개 입찰</strong><small>각자 손패 1장을 고릅니다. 이 타일은 이번 라운드에 실제로 사용됩니다.</small></span></div>
                              <div><b>3</b><span><strong>동시 공개와 순서 결정</strong><small>모두 공개한 뒤 타일 번호가 낮은 플레이어부터 차례를 정합니다.</small></span></div>
                              <div><b>4</b><span><strong>시장 드래프트</strong><small>정해진 순서대로 시장에서 타일 1장을 손패에 가져옵니다.</small></span></div>
                              <div><b>5</b><span><strong>입찰 타일 사용</strong><small>같은 순서대로 자신이 입찰에 낸 타일을 해결합니다.</small></span></div>
                            </div>
                            <div class="rule-note"><strong>손패는 계속 4장입니다.</strong> 매 라운드 1장을 입찰하고 시장에서 1장을 보충합니다.</div><div class="rule-example-mount" data-rule-example="bidding"></div>
                    </section>

                    <section class="rb-section" id="rules-ko-placement">
                        <h3 class="rb-section-title"><i class="fa-solid fa-seedling"></i> 06. 타일 사용</h3>
                        <div class="tile-rule-grid">
                              <div class="tile-rule-card terrain-rule"><span>🌿</span><div><h4>지형 타일</h4><ul><li>첫 지형 타일은 비어 있는 아무 칸에 놓을 수 있습니다.</li><li>두 번째 타일부터는 이미 놓인 타일과 변으로 맞닿아야 합니다. 모서리만 닿는 대각선 배치는 연결이 아닙니다.</li><li>놓기 전에 90° 단위로 회전할 수 있습니다. 맞닿는 지형의 색은 같지 않아도 됩니다.</li></ul></div></div>
                              <div class="tile-rule-card crop-rule"><span>🧺</span><div><h4>작물 타일</h4><ul><li>작물 타일을 버리고, 표시된 토큰을 모두 가져옵니다.</li><li>각 과일은 같은 색 지형의 반쪽에 놓습니다. 한 지형 반쪽에 여러 토큰을 놓을 수 있습니다.</li><li>일치하는 지형이 없는 토큰은 버립니다.</li></ul></div></div>
                              <div class="tile-rule-card scarecrow-rule"><span>🎃</span><div><h4>허수아비</h4><ul><li>아무 색 지형에나 놓을 수 있습니다.</li><li>그 연결 과수원에서 <strong>일꾼 +1</strong>로 계산하며, 과일 수에는 포함하지 않습니다.</li></ul></div></div>
                            </div>
                            <div class="rule-warning"><strong>초반 작물 주의:</strong> 같은 색 지형을 아직 놓지 않았다면 수확한 과일을 잃을 수 있습니다.</div><div class="rule-example-mount" data-rule-example="harvest"></div>
                    </section>

                    <section class="rb-section" id="rules-ko-end">
                        <h3 class="rb-section-title"><i class="fa-solid fa-flag-checkered"></i> 07. 마지막 타일과 게임 종료</h3>
                        <p>13라운드가 끝나면 각 플레이어의 손에는 여전히 타일 4장이 있습니다. 그중 <strong>1장만</strong> 골라 일반 규칙대로 사용하고, 나머지 3장은 버립니다. 모두 마지막 타일과 그 토큰을 해결하면 점수를 계산합니다.</p>
                    </section>

                    <section class="rb-section" id="rules-ko-scoring">
                        <h3 class="rb-section-title"><i class="fa-solid fa-star"></i> 08. 점수 계산</h3>
                        <h4>A. 연결 과수원 점수</h4>
                            <p>연결 과수원은 같은 색 지형의 반쪽들이 서로 맞닿은 변을 통해 이어진 묶음입니다. 회전된 대각선 지형은 해당 색 반쪽이 실제로 닿는 변에서만 연결됩니다.</p>
                            <div class="score-formula"><span>일꾼</span><b>×</b><span>과일</span><b>=</b><strong>점수</strong></div>
                            <p>연결 과수원마다 별도로 계산한 뒤 모두 더합니다. 허수아비는 일꾼 수에 포함합니다.</p>
                            <div class="rule-example-mount" data-rule-example="scoring"></div>
                            <h4>B. 가장 큰 과수원 보너스</h4>
                            <p>다섯 색마다 각 플레이어의 가장 큰 연결 과수원을 <strong>포함된 지형 타일 수</strong>로 비교합니다. 단독 1위는 <strong>10점</strong>, 공동 1위는 해당 플레이어 모두 <strong>7점</strong>을 얻습니다. 누구도 해당 색 지형이 없다면 보너스가 없습니다.</p>
                            <h4>C. 승리</h4>
                            <p>모든 연결 과수원 점수와 가장 큰 과수원 보너스를 합칩니다. 총점이 가장 높은 플레이어가 승리합니다.</p>
                    </section>

                    <section class="rb-section" id="rules-ko-reference">
                        <h3 class="rb-section-title"><i class="fa-solid fa-bookmark"></i> 빠른 참조</h3>
                        <div class="quick-grid"><span>시장</span><strong>타일 5장</strong><span>시작 손패</span><strong>드래프트 후 4장</strong><span>진행</span><strong>13라운드 + 마지막 1장</strong><span>행동 순서</span><strong>낮은 번호부터</strong><span>과수원 점수</span><strong>일꾼 × 과일</strong><span>가장 큰 과수원</span><strong>10점 / 공동 7점</strong></div>
                            <details><summary>어디까지 연결된 과수원인가요?</summary><p>같은 색 지형 반쪽이 변으로 직접 맞닿아야 합니다. 모서리는 연결되지 않으며, 타일을 회전한 방향에 따라 각 대각선 반쪽이 닿는 변도 달라집니다.</p></details>
                            <details><summary>시장에서 가져온 타일을 바로 사용하나요?</summary><p>아닙니다. 시장 타일은 손패로 들어갑니다. 이번 라운드에 사용하는 것은 입찰에 제출한 타일입니다.</p></details>
                            <details><summary>작물 토큰을 다음 라운드까지 보관할 수 있나요?</summary><p>아닙니다. 작물 타일의 모든 토큰을 즉시 해결해 합법적으로 배치하거나 버려야 합니다.</p></details>
                    </section>
                </div>
            </div>

            <div class="proto-modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('orchardsRulebookModal')"><span class="rb-content-en">Close</span><span class="rb-content-ko" style="display:none;">닫기</span></button>
                <a href="https://orchards-boardgame.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-play-proto" style="padding: 9px 18px;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> <span class="rb-content-en">Play Now</span><span class="rb-content-ko" style="display:none;">지금 플레이</span>
                </a>
            </div>
        </div>
        </div>`;

    const MODAL_ID = 'orchardsRulebookModal';

    function getModal() {
        return document.getElementById(MODAL_ID);
    }

    function renderExamples(modal) {
        [['en', 'rb-content-en'], ['ko', 'rb-content-ko']].forEach(([lang, cls]) => {
            modal.querySelectorAll(`.${cls} [data-rule-example]`).forEach(mount => {
                mount.innerHTML = buildRulebookExample(mount.dataset.ruleExample, lang);
            });
        });
    }

    window.openOrchardsRulebookToast = function () {
        if (!getModal()) return;
        if (typeof window.openModal === 'function') {
            window.openModal(MODAL_ID);
        }
    };

    window.closeOrchardsRulebookToast = function () {
        if (!getModal()) return;
        if (typeof window.closeModal === 'function') {
            window.closeModal(MODAL_ID);
        }
    };

    function init() {
        document.body.insertAdjacentHTML('beforeend', modalMarkup);
        const modal = getModal();
        renderExamples(modal);
        const isKo = document.documentElement.getAttribute('lang') === 'ko';
        if (typeof window.setRulebookLanguage === 'function') {
            window.setRulebookLanguage(isKo ? 'ko' : 'en', MODAL_ID);
        }
        modal.addEventListener('click', function (event) {
            if (event.target === modal) window.closeOrchardsRulebookToast();
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && getModal()?.classList.contains('active')) {
            window.closeOrchardsRulebookToast();
        }
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
