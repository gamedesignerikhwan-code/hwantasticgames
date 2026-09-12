(function () {
    'use strict';

    const skySymbols = {
        A: ['✦', 'star'],
        B: ['◉', 'planet'],
        C: ['☄', 'comet'],
        D: ['✺', 'nebula'],
        E: ['◎', 'galaxy'],
        X: ['☁', 'cloud']
    };

    function skyCell(value) {
        const cell = value && typeof value === 'object' ? value : { symbols: value };
        const symbols = cell.symbols || '';
        return `<span class="sw-diagram-cell ${cell.state || ''}">${Array.from(symbols).map(symbol => {
            const item = skySymbols[symbol];
            return item ? `<i class="sw-sky-symbol ${item[1]}" aria-hidden="true">${item[0]}</i>` : '';
        }).join('')}</span>`;
    }

    function skyDiagram(cols, rows, cells, options) {
        const settings = options || {};
        const filled = Array.from({ length: cols * rows }, (_, index) => skyCell(cells[index] || ''));
        let overlays = '';
        if (settings.lens) {
            const lens = settings.lens;
            overlays += `<span class="sw-diagram-lens ${lens.tone || 'gold'} ${lens.focus || 'vertex'}" style="--x:${lens.x};--y:${lens.y};--w:${lens.w};--h:${lens.h}"><b>${lens.label}</b></span>`;
        }
        if (settings.taken) {
            overlays += `<span class="sw-focus-taken" style="--x:${settings.taken.x};--y:${settings.taken.y}">×</span>`;
        }
        return `<figure class="sw-rule-figure"><div class="sw-diagram-grid" style="--cols:${cols};--rows:${rows}">${filled.join('')}${overlays}</div><figcaption>${settings.caption || ''}</figcaption></figure>`;
    }

    function diagramRow(items, extraClass) {
        return `<div class="sw-rule-figure-row ${extraClass || ''}">${items.join('')}</div>`;
    }

    function planCard(tag, lens, cells, tone) {
        return `<span class="sw-plan-card"><b class="sw-plan-tag">${tag}</b><span class="sw-plan-lens ${tone}">${lens}</span><span class="sw-plan-tile">${cells.map(skyCell).join('')}</span></span>`;
    }

    function crossDiagram(beforeCaption, afterCaption) {
        return `<div class="sw-cross-diagram"><figure><div>${planCard('A', '◎ ×2', ['BC', 'DX'], 'galaxy')}${planCard('B', '◉ ×1', ['EEA', 'AE'], 'planet')}</div><figcaption>${beforeCaption}</figcaption></figure><span class="sw-cross-arrow" aria-hidden="true">⇄</span><figure><div>${planCard('A', '◎ ×2', ['EEA', 'AE'], 'galaxy')}${planCard('B', '◉ ×1', ['BC', 'DX'], 'planet')}</div><figcaption>${afterCaption}</figcaption></figure></div>`;
    }

    const starter = ['', 'AB', '', '', 'CD', 'E', '', '', '', '', '', ''];
    const fourCells = ['AB', 'AC', 'AD', 'CA', 'AE', 'BA'];
    const scoreBefore = ['AB', 'CD', 'AE', 'BC', 'AE', 'DB', 'AC', '', ''];
    const scoreAfter = ['AB', 'CD', 'AE', 'BC', 'AE', 'DB', 'AC', 'AA', 'AD'];
    const walkBefore = ['', 'DA', 'BD', '', '', 'DC', 'EB', '', '', '', '', ''];
    const walkAfter = ['', 'DA', 'BD', '', '', 'DC', 'EB', '', '', 'DD', 'AD', ''];

    function buildDiagrams(language) {
        const ko = language === 'ko';
        return {
            lenses: diagramRow([
                skyDiagram(2, 1, ['AA', 'AB'], { lens: { x: 0, y: 0, w: 2, h: 1, label: '✦ ×2', focus: 'edge' }, caption: ko ? '<b>2×1, ×2</b> — 모서리 초점, 2칸 시야' : '<b>2×1, ×2</b> — edge focus, 2-cell field' }),
                skyDiagram(2, 2, ['BA', 'BB', 'CB', 'BD'], { lens: { x: 0, y: 0, w: 2, h: 2, label: '◉ ×2', tone: 'violet', focus: 'vertex' }, caption: ko ? '<b>2×2, ×2</b> — 꼭짓점 초점, 4칸 시야' : '<b>2×2, ×2</b> — vertex focus, 4-cell field' }),
                skyDiagram(3, 2, ['CA', 'CC', 'DC', 'CE', 'CB', 'AD'], { lens: { x: 0, y: 0, w: 3, h: 2, label: '☄ ×1', tone: 'coral', focus: 'edge' }, caption: ko ? '<b>3×2, ×1</b> — 모서리 초점, 6칸 시야' : '<b>3×2, ×1</b> — edge focus, 6-cell field' }),
                skyDiagram(3, 3, ['DA', 'DD', 'BC', 'DE', 'DB', 'DA', 'CE', 'DD', 'AB'], { lens: { x: 0, y: 0, w: 3, h: 3, label: '✺ ×1', tone: 'green', focus: 'cell' }, caption: ko ? '<b>3×3, ×1</b> — 칸 초점, 9칸 시야' : '<b>3×3, ×1</b> — cell focus, 9-cell field' })
            ], 'lens-row'),
            placement: diagramRow([
                skyDiagram(4, 3, starter.map((cell, i) => i === 8 ? { symbols: 'BC', state: 'ghost ok' } : i === 9 ? { symbols: 'AE', state: 'ghost ok' } : cell), { caption: ko ? '✓ 가능 — 빈 두 칸, 면으로 접촉' : '✓ Legal — two empty cells, edge contact' }),
                skyDiagram(4, 3, starter.map((cell, i) => i === 5 ? { symbols: 'BC', state: 'ghost bad' } : i === 6 ? { symbols: 'AE', state: 'ghost bad' } : cell), { caption: ko ? '✗ 불가 — 기존 칸과 겹침' : '✗ Illegal — overlaps the chart' }),
                skyDiagram(4, 3, starter.map((cell, i) => i === 10 ? { symbols: 'BC', state: 'ghost bad' } : i === 11 ? { symbols: 'AE', state: 'ghost bad' } : cell), { caption: ko ? '✗ 불가 — 모서리만 접촉' : '✗ Illegal — corner contact only' })
            ]),
            focus: diagramRow([
                skyDiagram(3, 2, fourCells, { lens: { x: 0, y: 0, w: 2, h: 2, label: '✦ ×2', focus: 'vertex' }, caption: ko ? '네 칸이 만나는 꼭짓점에 놓은 렌즈' : 'Lens on the vertex where four cells meet' }),
                skyDiagram(3, 2, fourCells, { lens: { x: 1, y: 0, w: 2, h: 2, label: '◎ ×2', tone: 'violet', focus: 'vertex' }, taken: { x: 1, y: 1 }, caption: ko ? '× 같은 초점은 불가, 겹치는 시야는 가능' : '× Same focus forbidden; overlapping field allowed' })
            ]),
            scoring: diagramRow([
                skyDiagram(3, 3, scoreBefore, { lens: { x: 0, y: 0, w: 3, h: 3, label: '✦ ×1', focus: 'cell' }, caption: ko ? '현재 황금별 4개 = 4점' : '4 Golden Stars now = 4 points' }),
                skyDiagram(3, 3, scoreAfter, { lens: { x: 0, y: 0, w: 3, h: 3, label: '✦ ×1', focus: 'cell' }, caption: ko ? '두 밤 뒤 황금별 7개 = 7점' : 'Two nights later: 7 stars = 7 points' }),
                skyDiagram(2, 1, ['CC', 'CB'], { lens: { x: 0, y: 0, w: 2, h: 1, label: '☄ ×2', tone: 'coral', focus: 'edge' }, caption: ko ? '혜성 3개 × 2 = 6점' : '3 Comets × 2 = 6 points' })
            ]),
            clouds: crossDiagram(
                ko ? 'A의 은하 렌즈와 B의 타일이 필요합니다.' : 'You want A\'s Galaxy lens and B\'s tile.',
                ko ? '표식 1개로 타일을 바꾼 뒤 A를 가져옵니다.' : 'Spend a marker, swap the tiles, then take A.'
            ),
            turn: diagramRow([
                skyDiagram(4, 3, walkBefore, { caption: ko ? '차례를 시작할 때의 별지도' : 'Your chart at the start of the turn' }),
                skyDiagram(4, 3, walkBefore.map((cell, i) => i === 9 ? { symbols: 'DD', state: 'ghost ok' } : i === 10 ? { symbols: 'AD', state: 'ghost ok' } : cell), { caption: ko ? '아래 빈 자리에 타일 놓기' : 'Lay the tile in the lower gap' }),
                skyDiagram(4, 3, walkAfter, { lens: { x: 1, y: 1, w: 2, h: 2, label: '✺ ×2', tone: 'green', focus: 'vertex' }, caption: ko ? '성운 4개 × 2 = 8점' : '4 Nebulae × 2 = 8 points' })
            ])
        };
    }

    const ruleDiagrams = { en: buildDiagrams('en'), ko: buildDiagrams('ko') };

    const modalMarkup = `
        <div class="proto-modal-overlay star-window-rulebook-overlay" id="starWindowRulebookModal" role="dialog" aria-modal="true" aria-labelledby="starWindowRulebookToastTitle" style="display:none;">
        <div class="proto-modal-card star-window-rulebook-toast" id="starWindowRulebookToast">
            <header class="star-window-toast-header">
                <span class="star-window-toast-mark" aria-hidden="true">✦</span>
                <div class="star-window-toast-heading">
                    <span class="star-window-toast-eyebrow"><span class="rb-content-en">Digital game rulebook</span><span class="rb-content-ko" style="display:none;">디지털 게임 규칙서</span></span>
                    <h3 class="star-window-toast-title" id="starWindowRulebookToastTitle">
                        <span class="rb-title-text-en">Star Window — Rulebook</span>
                        <span class="rb-title-text-ko" style="display:none;">천문대의 밤 — 게임 규칙서</span>
                    </h3>
                </div>
                <div class="star-window-toast-actions">
                    <div class="star-window-toast-lang" role="group" aria-label="Rulebook language">
                        <button type="button" class="rb-lang-btn" data-rb-lang="ko" onclick="setRulebookLanguage('ko', 'starWindowRulebookModal')">KO</button>
                        <button type="button" class="rb-lang-btn" data-rb-lang="en" onclick="setRulebookLanguage('en', 'starWindowRulebookModal')">EN</button>
                    </div>
                    <button type="button" class="star-window-toast-close" onclick="closeStarWindowRulebookToast()" aria-label="Close Star Window rulebook"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </header>

            <div class="star-window-toast-body">
                <div class="rb-content-en">
                    <p class="star-window-toast-lead"><strong>Extend your star chart and capture the brightest view.</strong><br>Choose a sky tile and observation lens as one plan, then build your observatory across twelve nights.</p>
                    <div class="star-window-toast-specs"><span>2–4 players</span><span>25–40 minutes</span><span>Ages 10+</span></div>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">01</span> Overview</h4><p>Each player directs a small observatory. Over <strong>twelve nights</strong> you extend a personal star chart with sky tiles, then set observation lenses onto that chart to frame as many of one celestial object as you can.</p><p>The catch is that a lens and the tile it comes with are taken <strong>as a pair</strong>. The tile you want rarely arrives with the lens you want, and the plan you leave behind stays on the table for your opponents.</p><div class="star-window-toast-callout">The observatory with the highest observation score after the twelfth night wins.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">02</span> Components</h4><ul><li><strong>50 sky tiles:</strong> two-cell dominoes; each cell contains 2–3 celestial objects.</li><li><strong>40 observation lenses:</strong> square frames in four sizes; 8 for each object.</li><li><strong>15 prime scopes:</strong> round lenses, all 2×2 fields at ×1; 3 for each object.</li><li><strong>5 observatory charts:</strong> L-shaped, three-cell starting skies.</li><li><strong>20 cloud markers:</strong> gained when placing a tile with a cloud cell.</li></ul></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">03</span> Five celestial objects</h4><div class="star-window-toast-celestials"><span>✦ Golden Star</span><span>◉ Ringed Planet</span><span>☄ Comet</span><span>✺ Nebula</span><span>◎ Galaxy</span><span>☁ Cloud</span></div><p>Golden Star, Ringed Planet, Comet, Nebula, and Galaxy score points. Cloud is a sixth symbol, but never scores; it is used as an item instead.</p></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">04</span> Reading a lens</h4><p>Every lens shows the object it scores, its multiplier, and its field of view. The object symbol is printed on the lens's <strong>focus</strong>, and that focus must lie on your chart.</p><ul><li><strong>Cell focus:</strong> rests on one sky cell.</li><li><strong>Edge focus:</strong> rests on the edge between two cells.</li><li><strong>Vertex focus:</strong> rests where four cells meet.</li></ul>${ruleDiagrams.en.lenses}<p>Rectangular lenses (2×1 and 3×2) may be rotated to either orientation. Square lenses have no meaningful orientation.</p></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">05</span> Setup</h4><ol><li>Each player takes one random <strong>observatory chart</strong> and places it in front of them. This L-shaped sky is the beginning of that player's star chart.</li><li>Count out the number of sky tiles shown for the player count and return the rest to the box without looking at them. This stack is also the game's clock: it runs out exactly when the final night is laid out.</li><li>Use <strong>all 40 observation lenses</strong> and <strong>all 15 prime scopes</strong>, regardless of player count.</li><li>Shuffle the sky tiles into a face-down stack. Shuffle the observation lenses and prime scopes separately into their own stacks.</li><li>Lay out the first <strong>observation plans</strong>. Pair one sky tile with each of one prime scope plus one observation lens per player, making <strong>players + 1 plans</strong>.</li><li>The player who most recently looked at the night sky becomes the first observer.</li></ol><table class="star-window-toast-table"><thead><tr><th>Players</th><th>Sky tiles used</th><th>Returned</th></tr></thead><tbody><tr><td>4</td><td>49</td><td>1</td></tr><tr><td>3</td><td>37</td><td>13</td></tr><tr><td>2</td><td>25</td><td>25</td></tr></tbody></table><div class="star-window-toast-callout">Do not reduce the lens or scope stacks. At most 37 observation lenses and 12 prime scopes are drawn in one game, so there is no need to remove any in advance.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">06</span> A night, step by step</h4><p>Starting with the first observer and continuing clockwise, each player takes one complete turn in the following order.</p><p><strong>1. Take an observation plan</strong><br>Choose one plan on the table and take its sky tile and observation lens together. You may choose <strong>any</strong> plan; the current state of your chart does not restrict your choice. If you take the plan with the <strong>prime scope</strong>, you become first observer next night.</p><p><strong>2. Lay the sky tile</strong><br>Add the tile to your chart. Both cells must cover <strong>empty spaces</strong>, and at least one of them must touch an existing cell <strong>orthogonally</strong>. Touching only diagonally is not allowed. There are no other restrictions: the chart may grow in any shape, and it does not matter whether this placement leaves a focus for the lens taken this night.</p><div class="star-window-toast-callout"><strong>Example 1 — laying a sky tile</strong><br>✓ Legal: both cells are empty and the left cell shares an edge with the chart.<br>✗ Illegal: the tile overlaps a cell already in the chart.<br>✗ Illegal: the tile touches only at a corner; diagonal contact does not count.</div><p><strong>3. Set the observation lens</strong><br>Place the lens so every cell required by its <strong>focus</strong> lies on sky tiles. The rest of the field of view may hang over empty space. Two lenses cannot share the same focus. Apart from that rule and the requirement for tiles under the focus, every focus on the chart is available; fields of view may overlap.</p><div class="star-window-toast-callout"><strong>Example 2 — placing a lens and an occupied focus</strong><br>A Golden Star 2×2 lens is set on a vertex where four cells meet, so its field covers all four cells. A second lens cannot use that same vertex. The vertex one cell to the right is free, however, and may be used even if the two fields overlap. <strong>Overlapping fields are allowed; only a shared focus is forbidden.</strong><br><br>If the chart has <strong>no legal focus at all</strong>, discard the lens to the box. It scores 0. This is a real penalty for careless tile placement, so plan one step ahead before laying the tile.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">07</span> Scoring</h4><p>A lens scores only the celestial object printed on it:</p><div class="star-window-toast-callout"><strong>number of matching objects in the full field of view × the lens multiplier</strong></div><p>Count every matching object across the <strong>entire field of view</strong>, not only at the focus. Any cell where the field hangs over empty space contributes 0 — <em>for now</em>.</p><p>Scores are not fixed. Recount every lens whenever the star chart changes. A tile placed later can enter the field of an older lens and raise its score. Hanging a wide lens over empty sky in advance and filling that sky later is a strong strategy.</p><div class="star-window-toast-callout"><strong>Example 3 — scoring and growing a lens</strong><br>A Golden Star 3×3 ×1 lens is focused on its center cell. There are <strong>4 Golden Stars</strong> in its nine-cell field, so it scores <strong>4 × 1 = 4 points</strong>; the three empty cells score 0 for now.<br><br>Two nights later, two of those empty cells are filled and add <strong>3 Golden Stars</strong>. Without moving anything, the same lens now scores <strong>7 × 1 = 7 points</strong> because the sky around it was filled.<br><br>For comparison, a Comet 2×1 ×2 lens that frames <strong>3 Comets</strong> scores <strong>3 × 2 = 6 points</strong>. A narrow, dense field with a high multiplier can outperform a wider but sparser field.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">08</span> Clouds</h4><p>The cloud symbol never scores and <strong>does not restrict placement in any way</strong>. A focus may rest on a cloud cell, or on an edge or vertex touching a cloud cell.</p><p>Instead, clouds are items. When you add a sky tile containing a cloud cell to your chart, gain <strong>1 cloud marker</strong>. No tile contains two cloud cells, so a single tile can grant at most one marker.</p><p>On your turn, <strong>before taking a plan</strong>, you may spend one cloud marker to <strong>cross two plans</strong>: swap the sky tiles paired with those plans. This lets you combine a desired tile with a desired lens.</p><p>The crossed pairings remain for later players. A cross can therefore improve your own plan and also spoil an opponent's plan. If you have several markers, you may make several crosses in one turn.</p><div class="star-window-toast-callout"><strong>Example 4 — using a cloud marker</strong><br>You want the Galaxy ×2 lens in Plan A, but its tile is useless for your chart; the tile you need is in Plan B. Spend one cloud marker and swap the two tiles. You may now take Plan A with the Galaxy lens and the tile you wanted, while Plan B is left with the tile you rejected.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">09</span> End of a night, and end of the game</h4><p>Once every player has taken a turn, exactly <strong>one plan is left unclaimed</strong>. It is not discarded — it <strong>stays on the table</strong> for the next night.</p><p>Refill the table back up to <strong>players + 1</strong> plans. Exactly one new prime scope enters play each night, so if last night's scope went unclaimed there will briefly be two on the table.</p><p>The player who took the prime scope becomes the first observer. If nobody took one, the first observer does not change.</p><p>After the <strong>twelfth night</strong> the game ends. Add up every lens on your chart. The highest total wins.</p><div class="star-window-toast-callout">If two or more observatories finish on the same score, they share the victory.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">10</span> A full turn</h4><ol><li><strong>The table.</strong> It is your turn on night 4. Four plans are available, including one carrying the prime scope. You hold one cloud marker.</li><li><strong>Cross, or not.</strong> The Nebula ×2 lens would score well on your chart, but its tile does not fit where you need it. You spend your cloud marker to swap that tile with the one from another plan.</li><li><strong>Take.</strong> You take the crossed plan: the Nebula 2×2 ×2 lens with the tile you actually wanted.</li><li><strong>Lay the tile.</strong> You drag it into the gap on your chart's lower edge, rotating it so its nebula-rich cell sits beside the two nebulae already there. Both cells are empty and one touches your chart.</li><li><strong>Set the lens.</strong> That placement has created a vertex where four cells meet, three of them holding nebulae. You set the lens on that vertex: <strong>4 nebulae × 2 = 8 points</strong>.</li><li><strong>Pass on.</strong> Your turn ends. The plan you did not take — and the tile you pushed into it — waits there for the next player.</li></ol><div class="star-window-toast-callout"><strong>Diagram captions from the example:</strong><br>Your chart at the start of the turn.<br>Lay the tile into the lower gap with its nebula-rich cell beside the two existing nebulae.<br>Set the lens on the new vertex for 4 nebulae × 2 = 8 points.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">11</span> Quick reference</h4><dl class="star-window-toast-reference"><dt>A turn</dt><dd>1. take a plan → 2. lay its tile → 3. set its lens</dd><dt>Tile placement</dt><dd>Two empty cells, at least one orthogonally touching your chart</dd><dt>Lens placement</dt><dd>The whole focus on tiles; no two lenses share a focus</dd><dt>Lens score</dt><dd>Matching objects in the full field × multiplier, recounted as the chart grows</dd><dt>No legal focus</dt><dd>The lens is discarded and scores nothing</dd><dt>Cloud marker</dt><dd>Gained by laying a cloud tile; spent before taking to swap two plans' tiles</dd><dt>End of night</dt><dd>The unclaimed plan carries over; refill to players + 1; scope-taker leads</dd><dt>Game end</dt><dd>After night 12, highest total score wins</dd></dl></section>
                </div>

                <div class="rb-content-ko" style="display:none;">
                    <p class="star-window-toast-lead"><strong>하늘 타일을 이어 별지도를 펼치고, 가장 빛나는 장면을 포착하세요.</strong><br>하늘 타일과 관측 렌즈를 하나의 계획으로 가져와 열두 번의 밤 동안 천문대를 완성합니다.</p>
                    <div class="star-window-toast-specs"><span>2–4인</span><span>25–40분</span><span>10세 이상</span></div>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">01</span> 게임 개요</h4><p>각 플레이어는 작은 천문대의 대장이 됩니다. <strong>열두 번의 밤</strong> 동안 하늘 타일을 이어 붙여 자신만의 별지도를 넓히고, 그 위에 관측 렌즈를 놓아 같은 천체를 최대한 많이 담아냅니다.</p><p>핵심은 렌즈와 하늘 타일을 <strong>한 세트로 함께</strong> 가져와야 한다는 점입니다. 원하는 타일이 원하는 렌즈와 짝지어 나오는 경우는 드물고, 내가 남긴 계획은 그대로 상대에게 넘어갑니다.</p><div class="star-window-toast-callout">열두 번째 밤이 끝났을 때 가장 높은 관측 점수를 기록한 천문대가 승리합니다.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">02</span> 구성물</h4><ul><li><strong>하늘 타일 50개:</strong> 두 칸짜리 도미노 모양. 각 칸에 천체가 2~3개 있습니다.</li><li><strong>관측 렌즈 40개:</strong> 네 가지 크기의 사각 관측 프레임. 천체별로 8개씩.</li><li><strong>주 관측경 15개:</strong> 원형 렌즈. 전부 2×2 시야에 ×1, 천체별로 3개씩.</li><li><strong>천문대 별지도 5장:</strong> 각 플레이어가 시작하는 L자 세 칸짜리 하늘.</li><li><strong>구름 표식 20개:</strong> 구름 칸이 있는 타일을 놓을 때 받습니다.</li></ul></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">03</span> 다섯 종류의 천체</h4><div class="star-window-toast-celestials"><span>✦ 황금별</span><span>◉ 고리행성</span><span>☄ 혜성</span><span>✺ 성운</span><span>◎ 은하</span><span>☁ 구름</span></div><p>황금별, 고리행성, 혜성, 성운, 은하는 점수가 됩니다. 구름은 여섯 번째 기호지만 점수가 되지 않으며, 대신 아이템으로 씁니다.</p></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">04</span> 관측 렌즈 읽는 법</h4><p>모든 렌즈에는 관측하는 천체, <strong>배수</strong>, <strong>시야</strong>가 표시됩니다. 천체 기호는 렌즈의 <strong>초점</strong> 위에 인쇄되어 있으며, 이 초점이 별지도 위에 놓여야 합니다.</p><ul><li><strong>칸 초점:</strong> 하늘 칸 하나 위에 놓습니다.</li><li><strong>모서리 초점:</strong> 두 칸 사이의 모서리에 놓습니다.</li><li><strong>꼭짓점 초점:</strong> 네 칸이 만나는 지점에 놓습니다.</li></ul>${ruleDiagrams.ko.lenses}<p>가로세로가 다른 렌즈(2×1, 3×2)는 원하는 방향으로 돌릴 수 있습니다. 2×2와 3×3은 정사각형이라 방향이 의미 없습니다.</p></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">05</span> 게임 준비</h4><ol><li>각자 <strong>천문대 별지도</strong> 1장을 무작위로 받아 앞에 놓습니다. 이 L자 하늘이 별지도의 시작점입니다.</li><li>인원수에 맞는 수만큼 하늘 타일을 세어 두고, <strong>나머지는 보지 않고 상자에 되돌립니다.</strong> 이 더미는 게임의 시계이기도 합니다. 마지막 밤을 펼칠 때 정확히 바닥납니다.</li><li><strong>관측 렌즈 40개</strong>와 <strong>주 관측경 15개</strong>는 인원수와 관계없이 전부 사용합니다.</li><li>하늘 타일을 섞어 뒷면으로 쌓습니다. 관측 렌즈와 주 관측경도 각각 섞어 따로 쌓습니다.</li><li>첫 <strong>관측 계획</strong>을 펼칩니다. 주 관측경 1개와 인원수만큼의 관측 렌즈에 각각 하늘 타일 1장씩을 짝지어 놓습니다. 즉 <strong>인원수 + 1개</strong>의 계획이 됩니다.</li><li>가장 최근에 밤하늘을 올려다본 사람이 첫 관측자가 됩니다.</li></ol><table class="star-window-toast-table"><thead><tr><th>인원</th><th>사용하는 하늘 타일</th><th>되돌리는 수</th></tr></thead><tbody><tr><td>4인</td><td>49</td><td>1</td></tr><tr><td>3인</td><td>37</td><td>13</td></tr><tr><td>2인</td><td>25</td><td>25</td></tr></tbody></table><div class="star-window-toast-callout">관측 렌즈와 주 관측경 더미는 덜어내지 않습니다. 한 게임에서 렌즈는 최대 37개, 주 관측경은 최대 12개까지만 뽑히므로 미리 덜어낼 필요가 없습니다.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">06</span> 한 번의 밤, 단계별 진행</h4><p>첫 관측자부터 시계 방향으로 각자 한 차례씩 진행합니다. 한 차례는 아래 세 단계를 순서대로 밟습니다.</p><p><strong>1. 관측 계획 가져오기</strong><br>테이블의 계획 중 하나를 골라 <strong>하늘 타일과 관측 렌즈를 함께</strong> 가져옵니다. 어떤 계획이든 <strong>자유롭게</strong> 고를 수 있으며, 내 별지도 상태가 선택을 제한하지 않습니다. <strong>주 관측경</strong>이 딸린 계획을 가져오면 다음 밤의 첫 관측자가 됩니다.</p><p><strong>2. 하늘 타일 놓기</strong><br>타일을 내 별지도에 붙입니다. 두 칸 모두 <strong>빈 공간</strong>을 덮어야 하고, 그중 최소 한 칸이 이미 있는 칸과 <strong>상하좌우로</strong> 맞닿아야 합니다. 대각선으로만 닿는 것은 안 됩니다. 그 외에는 아무 제한이 없습니다. 별지도는 어떤 모양으로 자라도 되고, 이번 밤의 렌즈를 놓을 초점이 남는지 여부도 상관없습니다.</p><div class="star-window-toast-callout"><strong>예시 1 — 하늘 타일 놓기</strong><br>✓ 가능: 두 칸 모두 비어 있고, 왼쪽 칸이 별지도와 면으로 맞닿습니다.<br>✗ 불가: 이미 별지도에 있는 칸과 겹칩니다.<br>✗ 불가: 모서리로만 닿습니다. 대각선 접촉은 인정되지 않습니다.</div><p><strong>3. 관측 렌즈 놓기</strong><br>렌즈의 <strong>초점</strong>에 해당하는 칸이 모두 하늘 타일 위에 오도록 놓습니다. 나머지 시야는 빈 공간에 걸쳐도 됩니다. 두 렌즈가 같은 초점을 공유할 수는 없습니다. 그 점과 초점 아래에 타일이 있어야 한다는 점 외에는 별지도의 모든 초점을 쓸 수 있으며, 시야가 겹쳐도 상관없습니다.</p><div class="star-window-toast-callout"><strong>예시 2 — 렌즈 놓기와 이미 찬 초점</strong><br>황금별 2×2 렌즈를 네 칸이 만나는 꼭짓점에 놓았습니다. 시야는 그 네 칸 전부를 덮습니다. 두 번째 렌즈는 같은 꼭짓점을 쓸 수 없습니다. 하지만 한 칸 오른쪽 꼭짓점은 비어 있으니 가능합니다. 시야가 겹쳐도 상관없습니다. <strong>겹치는 시야는 허용되고, 같은 초점만 안 됩니다.</strong><br><br>만약 별지도에 <strong>놓을 수 있는 초점이 하나도 없다면</strong> 그 렌즈는 버립니다. 상자로 되돌아가며 점수가 되지 않습니다. 타일을 생각 없이 놓으면 실제로 일어나는 손해이니, 놓기 전에 한 수 앞을 보세요.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">07</span> 점수 계산</h4><p>렌즈는 자기에게 인쇄된 천체에 대해서만 점수를 냅니다.</p><div class="star-window-toast-callout"><strong>시야 안에 있는 해당 천체의 개수 × 렌즈의 배수</strong></div><p>초점뿐 아니라 <strong>시야 전체</strong>에 걸친 천체를 모두 셉니다. 시야가 빈 공간에 걸친 칸은 그냥 0으로 셉니다. <em>지금은</em> 말이죠.</p><p>점수는 확정되지 않습니다. 별지도가 바뀔 때마다 모든 렌즈를 다시 세므로, 나중에 놓은 타일이 예전 렌즈의 시야 안에 들어가면 그 렌즈의 점수가 올라갑니다. 넓은 렌즈를 빈 하늘에 미리 걸어두고 나중에 채우는 것도 훌륭한 전략입니다.</p><div class="star-window-toast-callout"><strong>예시 3 — 렌즈 점수 세기와 키우기</strong><br>황금별 3×3 ×1 렌즈를 가운데 칸에 초점을 두고 놓았습니다. 9칸 시야 안에 황금별이 <strong>4개</strong> 있으므로 <strong>4 × 1 = 4점</strong>입니다. 빈 세 칸은 아직 0점입니다.<br><br>두 밤 뒤, 그 빈 칸 중 두 칸이 채워지면서 황금별이 <strong>3개</strong> 늘었습니다. 같은 렌즈가 이제 <strong>7 × 1 = 7점</strong>이 됩니다. 아무것도 옮기지 않았고, 하늘이 채워졌을 뿐입니다.<br><br>비교해 보죠. 혜성 2×1 ×2 렌즈가 두 칸에 걸쳐 혜성 <strong>3개</strong>를 담으면 <strong>3 × 2 = 6점</strong>입니다. 배수가 높은 좁고 촘촘한 시야가, 넓지만 성긴 시야보다 나은 경우가 많습니다.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">08</span> 구름</h4><p>구름 기호는 점수가 되지 않으며, <strong>배치를 전혀 제한하지 않습니다.</strong> 구름 칸 위에도, 구름 칸에 닿는 모서리·꼭짓점에도 초점을 놓을 수 있습니다.</p><p>대신 구름은 아이템입니다. 구름 칸이 있는 하늘 타일을 별지도에 놓으면 <strong>구름 표식 1개</strong>를 받습니다. 구름 칸을 두 개 가진 타일은 없으므로 타일 한 장당 최대 1개입니다.</p><p>자기 차례에 계획을 <strong>가져오기 전</strong>, 구름 표식 1개를 내고 <strong>계획 두 개를 교차</strong>시킬 수 있습니다. 두 계획의 하늘 타일이 서로 자리를 바꿉니다. 이제 원하는 타일과 원하는 렌즈를 짝지어 가져올 수 있습니다.</p><p>교차된 짝은 다음 플레이어에게도 그대로 남습니다. 즉 교차는 내 이득을 만드는 수단인 동시에 상대의 계획을 망치는 수단이기도 합니다. 표식이 여러 개면 한 차례에 여러 번 교차할 수 있습니다.</p><div class="star-window-toast-callout"><strong>예시 4 — 구름 표식 사용하기</strong><br>계획 A의 은하 ×2 렌즈가 탐나지만, 딸려 있는 타일은 내 별지도에 쓸모가 없습니다. 정작 필요한 타일은 계획 B에 있습니다.<br><br>구름 표식 1개를 냅니다. 두 타일이 자리를 바꿉니다. 이제 계획 A를 가져오면 은하 렌즈와 원하던 타일을 함께 얻습니다. 계획 B에는 내가 버린 타일이 남습니다.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">09</span> 밤의 끝, 그리고 게임 종료</h4><p>모든 플레이어가 한 차례씩 마치면 계획이 <strong>정확히 하나 남습니다.</strong> 이 계획은 버리지 않고 <strong>테이블에 그대로 둡니다.</strong> 다음 밤으로 이월됩니다.</p><p>계획이 다시 <strong>인원수 + 1개</strong>가 되도록 채웁니다. 매 밤 새 주 관측경이 정확히 하나씩 들어오므로, 지난 밤의 주 관측경이 안 팔렸다면 잠시 두 개가 테이블에 놓일 수 있습니다.</p><p>주 관측경을 가져간 플레이어가 다음 밤의 첫 관측자가 됩니다. 아무도 가져가지 않았다면 첫 관측자는 그대로입니다.</p><p><strong>열두 번째 밤</strong>이 끝나면 게임이 종료됩니다. 별지도 위 모든 렌즈의 점수를 합산하고, 총점이 가장 높은 사람이 승리합니다.</p><div class="star-window-toast-callout">두 곳 이상의 천문대가 같은 점수로 끝나면, 그 천문대들이 승리를 나눠 가집니다.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">10</span> 한 차례 전체 플레이 예시</h4><ol><li><strong>테이블 상황.</strong> 네 번째 밤, 당신의 차례입니다. 계획 4개가 놓여 있고 그중 하나에 주 관측경이 딸려 있습니다. 당신은 구름 표식 1개를 갖고 있습니다.</li><li><strong>교차할까, 말까.</strong> 성운 ×2 렌즈는 내 별지도에서 점수가 잘 나올 것 같은데, 딸린 타일이 필요한 자리에 맞지 않습니다. 구름 표식을 내고 그 타일을 다른 계획의 타일과 맞바꿉니다.</li><li><strong>가져오기.</strong> 교차된 계획을 가져옵니다. 성운 2×2 ×2 렌즈와, 실제로 원하던 타일을 함께 얻었습니다.</li><li><strong>타일 놓기.</strong> 별지도 아래쪽 빈 자리로 끌어와, 성운이 많은 칸이 기존 성운 두 개 옆에 오도록 회전시켜 놓습니다. 두 칸 모두 비어 있고 한 칸이 별지도와 맞닿습니다.</li><li><strong>렌즈 놓기.</strong> 이 배치로 네 칸이 만나는 꼭짓점이 새로 생겼고, 그중 세 칸에 성운이 있습니다. 그 꼭짓점에 렌즈를 놓습니다 — <strong>성운 4개 × 2 = 8점.</strong></li><li><strong>다음 사람에게.</strong> 차례가 끝납니다. 내가 가져가지 않은 계획은, 내가 밀어 넣은 타일과 함께 다음 플레이어를 기다립니다.</li></ol><div class="star-window-toast-callout"><strong>원본 예시 그림의 설명</strong><br>차례를 시작할 때의 별지도.<br>타일 놓기: 별지도 아래쪽 빈 자리로 끌어와, 성운이 많은 칸이 기존 성운 두 개 옆에 오도록 회전시켜 놓습니다. 두 칸 모두 비어 있고 한 칸이 별지도와 맞닿습니다.<br>렌즈 놓기: 이 배치로 네 칸이 만나는 꼭짓점이 새로 생겼고, 그중 세 칸에 성운이 있습니다. 그 꼭짓점에 렌즈를 놓습니다 — 성운 4개 × 2 = 8점.</div></section>

                    <section class="star-window-toast-section"><h4><span class="star-window-toast-no">11</span> 요약</h4><dl class="star-window-toast-reference"><dt>한 차례</dt><dd>1. 계획 가져오기 → 2. 타일 놓기 → 3. 렌즈 놓기</dd><dt>타일 배치</dt><dd>빈 두 칸, 그중 최소 한 칸이 별지도와 상하좌우로 접촉</dd><dt>렌즈 배치</dt><dd>초점 전체가 타일 위에. 두 렌즈가 같은 초점 공유 불가</dd><dt>렌즈 점수</dt><dd>시야 전체의 해당 천체 수 × 배수. 별지도가 자라면 다시 계산</dd><dt>초점이 없으면</dt><dd>렌즈를 버리며 점수가 되지 않음</dd><dt>구름 표식</dt><dd>구름 타일을 놓으면 획득. 가져오기 전에 내면 두 계획의 타일을 맞바꿈</dd><dt>밤의 끝</dt><dd>남은 계획은 이월. 인원수 + 1까지 보충. 주 관측경을 가져간 사람이 선</dd><dt>게임 종료</dt><dd>열두 번째 밤 이후 총점이 가장 높은 사람 승리</dd></dl></section>
                </div>
            </div>

            <footer class="star-window-toast-footer">
                <button type="button" onclick="closeStarWindowRulebookToast()"><span class="rb-content-en">Close</span><span class="rb-content-ko" style="display:none;">닫기</span></button>
                <a href="https://star-window.vercel.app/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> <span class="rb-content-en">Open game</span><span class="rb-content-ko" style="display:none;">게임 열기</span></a>
            </footer>
        </div>
        </div>`;

    const MODAL_ID = 'starWindowRulebookModal';

    function getModal() {
        return document.getElementById(MODAL_ID);
    }

    function insertRulebookDiagrams(modal) {
        ['en', 'ko'].forEach(language => {
            const sections = modal.querySelectorAll(`.rb-content-${language} .star-window-toast-section`);
            if (sections.length < 10) return;
            const diagrams = ruleDiagrams[language];
            sections[5].insertAdjacentHTML('beforeend', diagrams.placement + diagrams.focus);
            sections[6].insertAdjacentHTML('beforeend', diagrams.scoring);
            sections[7].insertAdjacentHTML('beforeend', diagrams.clouds);
            sections[9].insertAdjacentHTML('beforeend', diagrams.turn);
        });
    }

    window.openStarWindowRulebookToast = function () {
        if (!getModal()) return;
        if (typeof window.openModal === 'function') {
            window.openModal(MODAL_ID);
        }
    };

    window.closeStarWindowRulebookToast = function () {
        if (!getModal()) return;
        if (typeof window.closeModal === 'function') {
            window.closeModal(MODAL_ID);
        }
    };

    function init() {
        document.body.insertAdjacentHTML('beforeend', modalMarkup);
        const modal = getModal();
        insertRulebookDiagrams(modal);
        const isKo = document.documentElement.getAttribute('lang') === 'ko';
        if (typeof window.setRulebookLanguage === 'function') {
            window.setRulebookLanguage(isKo ? 'ko' : 'en', MODAL_ID);
        }
        modal.addEventListener('click', function (event) {
            if (event.target === modal) window.closeStarWindowRulebookToast();
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && getModal()?.classList.contains('active')) {
            window.closeStarWindowRulebookToast();
        }
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
