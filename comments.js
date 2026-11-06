/**
 * ============================================================================
 * Hwantastic Games - DevLog Board Comments & Nested Replies System
 * In-Page, Non-Popup, LocalStorage Persistence with Multi-Tab Sync
 * Supports: Root Comments, Nested Replies (대댓글), Likes, Password Deletion
 * ============================================================================
 */

(function () {
    'use strict';

    // Seed / Initial comments for each devlog article
    const SEED_COMMENTS = {
        devlog_august: [
            {
                id: 'c_august_1',
                author: '인디게임지망생',
                password: 'pass',
                text: '레딧 피드백을 맞고 좌절하기보다, 자신이 디렉터로서 무엇을 놓쳤는지 객관적으로 돌아보신 점이 정말 인상적입니다. Claude-Codex-Antigravity 3중 오케스트레이션 과정도 1인 인디 개발자에게 아주 실질적인 팁이네요!',
                createdAt: Date.now() - 1000 * 60 * 60 * 28, // 28 hours ago
                likes: 8,
                isAuthor: false,
                replies: [
                    {
                        id: 'r_august_1_1',
                        author: 'Hwantastic Games',
                        password: 'pass',
                        text: '좋게 봐주셔서 감사합니다! 당시엔 아침에 레딧 열어보고 머리가 하얘졌지만, 지금 돌이켜보면 그때 솔직한 피드백을 맞은 게 천운이었던 것 같습니다. 계속 다듬어 나가겠습니다!',
                        createdAt: Date.now() - 1000 * 60 * 60 * 20,
                        likes: 5,
                        isAuthor: true
                    }
                ]
            },
            {
                id: 'c_august_2',
                author: '보드게이머',
                password: 'pass',
                text: '바뀐 아트워크가 훨씬 깔끔하고 게임의 본질인 카드 퍼즐성에 집중하기 좋아 보입니다. 스팀 넥스트 페스트 데모 기대하겠습니다!',
                createdAt: Date.now() - 1000 * 60 * 60 * 14,
                likes: 4,
                isAuthor: false,
                replies: []
            }
        ],
        devlog_july: [
            {
                id: 'c_july_1',
                author: '카드게임마니아',
                password: 'pass',
                text: '16개 언어 로컬라이징이라니 혼자서 대단하십니다... 스팀 개발자 등록 축하드려요!',
                createdAt: Date.now() - 1000 * 60 * 60 * 36,
                likes: 6,
                isAuthor: false,
                replies: [
                    {
                        id: 'r_july_1_1',
                        author: 'Hwantastic Games',
                        password: 'pass',
                        text: '감사합니다! AI 툴들 덕분에 방대한 언어 지원도 혼자서 해낼 수 있었습니다. 번역 퀄리티도 데모 기간 동안 꼼꼼히 점검할 예정입니다.',
                        createdAt: Date.now() - 1000 * 60 * 60 * 24,
                        likes: 4,
                        isAuthor: true
                    }
                ]
            }
        ],
        devlog_june: [
            {
                id: 'c_june_1',
                author: '트릭테이킹팬',
                password: 'pass',
                text: '10년 동안 보드게임을 만드신 분이 디지털 인디 게임으로 도전하시는 거군요. 룰 메커니즘이 탄탄할 수밖에 없겠습니다.',
                createdAt: Date.now() - 1000 * 60 * 60 * 48,
                likes: 7,
                isAuthor: false,
                replies: [
                    {
                        id: 'r_june_1_1',
                        author: 'Hwantastic Games',
                        password: 'pass',
                        text: '보드게임에서 쌓은 오픈 핸드 디터미니즘 감각을 비디오 게임에 녹여내는 중입니다. 응원 감사합니다!',
                        createdAt: Date.now() - 1000 * 60 * 60 * 30,
                        likes: 5,
                        isAuthor: true
                    }
                ]
            }
        ],
        devlog_website: [
            {
                id: 'c_web_1',
                author: '웹디자이너',
                password: 'pass',
                text: '메가크릿(Mega Crit) 사이트 느낌의 따뜻한 베이지 톤앤매너가 너무 예쁩니다. 개발 일지 계속 올려주세요!',
                createdAt: Date.now() - 1000 * 60 * 60 * 52,
                likes: 5,
                isAuthor: false,
                replies: [
                    {
                        id: 'r_web_1_1',
                        author: 'Hwantastic Games',
                        password: 'pass',
                        text: '웹사이트 분위기 마음에 들어해 주셔서 기쁩니다! 개발 과정과 고민들을 솔직하게 기록해 둘게요.',
                        createdAt: Date.now() - 1000 * 60 * 60 * 40,
                        likes: 3,
                        isAuthor: true
                    }
                ]
            }
        ],
        devlog_balancing: [
            {
                id: 'c_bal_1',
                author: '퍼즐러',
                password: 'pass',
                text: '10개 덱마다 고유 특수 카드가 들어가는 거면 밸런스 잡기가 정말 까다로우셨을 텐데 대단합니다.',
                createdAt: Date.now() - 1000 * 60 * 60 * 42,
                likes: 4,
                isAuthor: false,
                replies: []
            }
        ],
        devlog_concept: [
            {
                id: 'c_con_1',
                author: '전략게이머',
                password: 'pass',
                text: '트릭테이킹에 완전 공개 정보 퍼즐을 결합한 아이디어가 신선하네요.',
                createdAt: Date.now() - 1000 * 60 * 60 * 45,
                likes: 3,
                isAuthor: false,
                replies: []
            }
        ],
        devlog_steam: [
            {
                id: 'c_stm_1',
                author: '스팀유저',
                password: 'pass',
                text: '스팀 클라우드 세이브와 업적 연동 완료 축하드립니다!',
                createdAt: Date.now() - 1000 * 60 * 60 * 40,
                likes: 5,
                isAuthor: false,
                replies: []
            }
        ]
    };

    // Color palette for user avatar circles based on string hash
    const AVATAR_COLORS = [
        ['#e8734a', '#ffffff'],
        ['#5a9e8f', '#ffffff'],
        ['#9e8ec0', '#ffffff'],
        ['#c75b7a', '#ffffff'],
        ['#d97706', '#ffffff'],
        ['#2563eb', '#ffffff'],
        ['#059669', '#ffffff'],
        ['#7c3aed', '#ffffff']
    ];

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function getAvatarColors(name) {
        const idx = hashString(name || '익명') % AVATAR_COLORS.length;
        return AVATAR_COLORS[idx];
    }

    function formatTime(timestamp) {
        if (!timestamp) return '';
        const now = Date.now();
        const diffMs = now - timestamp;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffMin < 1) return '방금 전';
        if (diffMin < 60) return `${diffMin}분 전`;
        if (diffHour < 24) return `${diffHour}시간 전`;
        if (diffDay < 7) return `${diffDay}일 전`;

        const d = new Date(timestamp);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const date = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${date} ${hour}:${min}`;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Determine current post ID
    function getPostId() {
        const container = document.getElementById('devlogCommentsSection');
        if (container && container.getAttribute('data-post-id')) {
            return container.getAttribute('data-post-id');
        }
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop().replace(/\.html$/, '');
        return filename || 'devlog_general';
    }

    // Storage Key
    function getStorageKey(postId) {
        return `hwantastic_comments_${postId}`;
    }

    // Liked Store Key (in sessionStorage so users can like/unlike per session)
    function getLikedKey(postId) {
        return `hwantastic_liked_${postId}`;
    }

    function loadComments(postId) {
        const key = getStorageKey(postId);
        try {
            const raw = localStorage.getItem(key);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {
            console.warn('Failed to parse comments from localStorage:', e);
        }

        // Return seed comments if available, or empty array
        const seeds = SEED_COMMENTS[postId] ? JSON.parse(JSON.stringify(SEED_COMMENTS[postId])) : [];
        saveComments(postId, seeds);
        return seeds;
    }

    function saveComments(postId, comments) {
        const key = getStorageKey(postId);
        try {
            localStorage.setItem(key, JSON.stringify(comments));
        } catch (e) {
            console.error('Failed to save comments to localStorage:', e);
        }
    }

    function getLikedSet(postId) {
        try {
            const raw = sessionStorage.getItem(getLikedKey(postId));
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch (e) {
            return new Set();
        }
    }

    function saveLikedSet(postId, set) {
        try {
            sessionStorage.setItem(getLikedKey(postId), JSON.stringify(Array.from(set)));
        } catch (e) {}
    }

    function isAuthorName(name) {
        if (!name) return false;
        const normalized = name.trim().toLowerCase();
        return (
            normalized === 'hwantastic games' ||
            normalized === 'hwantastic' ||
            normalized === '이환' ||
            normalized === '작성자' ||
            normalized === 'gamedesigner'
        );
    }

    function getTotalCommentsCount(comments) {
        let count = 0;
        comments.forEach(c => {
            count += 1;
            if (c.replies && Array.isArray(c.replies)) {
                count += c.replies.length;
            }
        });
        return count;
    }

    // Main Component Class
    class DevLogCommentsApp {
        constructor(mountEl, postId) {
            this.mountEl = mountEl;
            this.postId = postId;
            this.comments = loadComments(postId);
            this.likedSet = getLikedSet(postId);
            this.activeReplyBoxId = null; // ID of comment where reply box is open
            this.activeDeleteBoxId = null; // ID of comment/reply where delete prompt is open

            this.init();
        }

        init() {
            this.render();

            // Listen to multi-tab storage sync
            window.addEventListener('storage', (e) => {
                if (e.key === getStorageKey(this.postId)) {
                    this.comments = loadComments(this.postId);
                    this.renderListOnly();
                }
            });
        }

        render() {
            const totalCount = getTotalCommentsCount(this.comments);
            const savedNickname = localStorage.getItem('hwantastic_commenter_name') || '';

            this.mountEl.innerHTML = `
                <div class="comments-card-container">
                    <!-- Header -->
                    <div class="comments-section-header">
                        <div class="comments-header-left">
                            <i class="fa-solid fa-comments comments-header-icon"></i>
                            <h3 class="comments-header-title">댓글</h3>
                            <span class="comments-count-pill" id="commentsCountPill">${totalCount}</span>
                        </div>
                        <div class="comments-header-sub">
                            자유롭게 피드백과 소감을 남겨주세요 (답글/대댓글 지원)
                        </div>
                    </div>

                    <!-- Main New Comment Form -->
                    <form class="comment-write-form" id="mainCommentForm">
                        <div class="comment-form-meta-row">
                            <div class="comment-input-wrap">
                                <i class="fa-solid fa-user"></i>
                                <input type="text" class="comment-meta-input" id="mainCommentAuthor" 
                                       placeholder="닉네임 (Nickname)" value="${escapeHtml(savedNickname)}" maxlength="20" required>
                            </div>
                            <div class="comment-input-wrap">
                                <i class="fa-solid fa-lock"></i>
                                <input type="password" class="comment-meta-input" id="mainCommentPassword" 
                                       placeholder="비밀번호 (삭제용 4자리)" maxlength="20" required>
                            </div>
                        </div>
                        <div class="comment-textarea-wrap">
                            <textarea class="comment-textarea" id="mainCommentText" 
                                      placeholder="DevLog에 대한 생각이나 질문을 남겨주세요..." rows="3" required></textarea>
                        </div>
                        <div class="comment-form-bottom-row">
                            <span class="comment-form-hint">
                                <i class="fa-regular fa-lightbulb"></i> 타인을 존중하는 따뜻한 댓글을 남겨주세요.
                            </span>
                            <button type="submit" class="comment-submit-btn" id="btnSubmitMainComment">
                                <i class="fa-solid fa-paper-plane"></i>
                                <span>댓글 등록</span>
                            </button>
                        </div>
                    </form>

                    <!-- Comments List -->
                    <div class="comments-list-stream" id="commentsListStream">
                        <!-- Rendered by renderListOnly -->
                    </div>
                </div>
            `;

            this.renderListOnly();
            this.bindMainForm();
        }

        renderListOnly() {
            const stream = document.getElementById('commentsListStream');
            const pill = document.getElementById('commentsCountPill');
            if (pill) pill.textContent = getTotalCommentsCount(this.comments);
            if (!stream) return;

            if (this.comments.length === 0) {
                stream.innerHTML = `
                    <div class="comments-empty-state">
                        <i class="fa-regular fa-comment-dots"></i>
                        <p>첫 번째 댓글의 주인공이 되어보세요!</p>
                    </div>
                `;
                return;
            }

            stream.innerHTML = this.comments.map(c => this.renderCommentItem(c)).join('');
            this.bindItemEvents();
        }

        renderCommentItem(comment) {
            const [bg, fg] = getAvatarColors(comment.author);
            const isLiked = this.likedSet.has(comment.id);
            const hasReplies = comment.replies && comment.replies.length > 0;
            const isReplying = this.activeReplyBoxId === comment.id;
            const isDeleting = this.activeDeleteBoxId === comment.id;
            const savedNickname = localStorage.getItem('hwantastic_commenter_name') || '';

            return `
                <div class="comment-thread" data-comment-id="${comment.id}">
                    <!-- Root Comment Card -->
                    <div class="comment-bubble-card">
                        <div class="comment-avatar" style="background:${bg}; color:${fg};">
                            ${escapeHtml(comment.author.charAt(0).toUpperCase())}
                        </div>
                        <div class="comment-content-area">
                            <div class="comment-top-row">
                                <div class="comment-author-meta">
                                    <span class="comment-author-name">${escapeHtml(comment.author)}</span>
                                    ${(comment.isAuthor || isAuthorName(comment.author)) ? '<span class="author-tag-badge"><i class="fa-solid fa-star"></i> 작성자</span>' : ''}
                                    <span class="comment-timestamp">${formatTime(comment.createdAt)}</span>
                                </div>
                            </div>

                            <div class="comment-body-text">
                                ${escapeHtml(comment.text).replace(/\n/g, '<br>')}
                            </div>

                            <!-- Comment Action Buttons -->
                            <div class="comment-action-bar">
                                <button type="button" class="btn-comment-action btn-like-action ${isLiked ? 'liked' : ''}" data-action="like" data-id="${comment.id}">
                                    <i class="${isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
                                    <span>${comment.likes || 0}</span>
                                </button>
                                <button type="button" class="btn-comment-action btn-reply-toggle" data-action="toggle-reply" data-id="${comment.id}">
                                    <i class="fa-solid fa-reply"></i>
                                    <span>답글</span>
                                    ${hasReplies ? `<span class="reply-count-tag">${comment.replies.length}</span>` : ''}
                                </button>
                                <button type="button" class="btn-comment-action btn-delete-action" data-action="toggle-delete" data-id="${comment.id}">
                                    <i class="fa-regular fa-trash-can"></i>
                                    <span>삭제</span>
                                </button>
                            </div>

                            <!-- Inline Delete Password Prompt -->
                            ${isDeleting ? `
                                <div class="inline-delete-box" id="deleteBox_${comment.id}">
                                    <span class="inline-delete-label"><i class="fa-solid fa-key"></i> 삭제 비밀번호:</span>
                                    <input type="password" class="inline-delete-input" id="deletePwInput_${comment.id}" placeholder="비밀번호" maxlength="20">
                                    <button type="button" class="btn-delete-confirm" data-action="confirm-delete" data-id="${comment.id}">삭제 확인</button>
                                    <button type="button" class="btn-delete-cancel" data-action="cancel-delete">취소</button>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Inline Reply Form (Shown when replying to this comment) -->
                    ${isReplying ? `
                        <div class="nested-reply-form-wrap" id="replyFormWrap_${comment.id}">
                            <div class="nested-reply-arrow-guide"><i class="fa-solid fa-turn-up fa-rotate-90"></i></div>
                            <form class="comment-write-form nested-reply-form" data-parent-id="${comment.id}">
                                <div class="nested-reply-to-tag">
                                    <i class="fa-solid fa-at"></i> <strong>${escapeHtml(comment.author)}</strong>님에게 대댓글 작성
                                </div>
                                <div class="comment-form-meta-row">
                                    <div class="comment-input-wrap">
                                        <i class="fa-solid fa-user"></i>
                                        <input type="text" class="comment-meta-input reply-author-input" 
                                               placeholder="닉네임 (Nickname)" value="${escapeHtml(savedNickname)}" maxlength="20" required>
                                    </div>
                                    <div class="comment-input-wrap">
                                        <i class="fa-solid fa-lock"></i>
                                        <input type="password" class="comment-meta-input reply-password-input" 
                                               placeholder="비밀번호 (삭제용 4자리)" maxlength="20" required>
                                    </div>
                                </div>
                                <div class="comment-textarea-wrap">
                                    <textarea class="comment-textarea reply-text-input" 
                                              placeholder="대댓글 내용을 입력하세요..." rows="2" required></textarea>
                                </div>
                                <div class="nested-reply-actions-row">
                                    <button type="button" class="btn-cancel-reply" data-action="cancel-reply">취소</button>
                                    <button type="submit" class="comment-submit-btn btn-sm">
                                        <i class="fa-solid fa-paper-plane"></i>
                                        <span>대댓글 등록</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    ` : ''}

                    <!-- Nested Replies Stream (대댓글 목록) -->
                    ${hasReplies ? `
                        <div class="nested-replies-stream">
                            ${comment.replies.map(r => this.renderReplyItem(comment.id, r)).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        renderReplyItem(parentId, reply) {
            const [bg, fg] = getAvatarColors(reply.author);
            const isLiked = this.likedSet.has(reply.id);
            const isDeleting = this.activeDeleteBoxId === reply.id;

            return `
                <div class="nested-reply-item" data-reply-id="${reply.id}">
                    <div class="reply-corner-guide"><i class="fa-solid fa-turn-up fa-rotate-90"></i></div>
                    <div class="comment-bubble-card reply-bubble-card">
                        <div class="comment-avatar avatar-sm" style="background:${bg}; color:${fg};">
                            ${escapeHtml(reply.author.charAt(0).toUpperCase())}
                        </div>
                        <div class="comment-content-area">
                            <div class="comment-top-row">
                                <div class="comment-author-meta">
                                    <span class="comment-author-name">${escapeHtml(reply.author)}</span>
                                    ${(reply.isAuthor || isAuthorName(reply.author)) ? '<span class="author-tag-badge"><i class="fa-solid fa-star"></i> 작성자</span>' : ''}
                                    <span class="comment-timestamp">${formatTime(reply.createdAt)}</span>
                                </div>
                            </div>

                            <div class="comment-body-text">
                                ${escapeHtml(reply.text).replace(/\n/g, '<br>')}
                            </div>

                            <div class="comment-action-bar">
                                <button type="button" class="btn-comment-action btn-like-action ${isLiked ? 'liked' : ''}" data-action="like-reply" data-parent-id="${parentId}" data-id="${reply.id}">
                                    <i class="${isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
                                    <span>${reply.likes || 0}</span>
                                </button>
                                <button type="button" class="btn-comment-action btn-delete-action" data-action="toggle-delete" data-id="${reply.id}">
                                    <i class="fa-regular fa-trash-can"></i>
                                    <span>삭제</span>
                                </button>
                            </div>

                            <!-- Inline Delete Password Prompt for Reply -->
                            ${isDeleting ? `
                                <div class="inline-delete-box" id="deleteBox_${reply.id}">
                                    <span class="inline-delete-label"><i class="fa-solid fa-key"></i> 삭제 비밀번호:</span>
                                    <input type="password" class="inline-delete-input" id="deletePwInput_${reply.id}" placeholder="비밀번호" maxlength="20">
                                    <button type="button" class="btn-delete-confirm" data-action="confirm-delete-reply" data-parent-id="${parentId}" data-id="${reply.id}">삭제 확인</button>
                                    <button type="button" class="btn-delete-cancel" data-action="cancel-delete">취소</button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        bindMainForm() {
            const form = document.getElementById('mainCommentForm');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const authorInput = document.getElementById('mainCommentAuthor');
                const pwInput = document.getElementById('mainCommentPassword');
                const textInput = document.getElementById('mainCommentText');

                const author = authorInput ? authorInput.value.trim() : '';
                const password = pwInput ? pwInput.value.trim() : '';
                const text = textInput ? textInput.value.trim() : '';

                if (!author || !password || !text) {
                    alert('닉네임, 비밀번호, 댓글 내용을 모두 입력해 주세요.');
                    return;
                }

                // Remember nickname
                localStorage.setItem('hwantastic_commenter_name', author);

                const newComment = {
                    id: 'c_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                    author: author,
                    password: password,
                    text: text,
                    createdAt: Date.now(),
                    likes: 0,
                    isAuthor: isAuthorName(author),
                    replies: []
                };

                this.comments.unshift(newComment);
                saveComments(this.postId, this.comments);

                textInput.value = '';
                pwInput.value = '';

                this.renderListOnly();
                this.showNotice('댓글이 성공적으로 등록되었습니다!');
            });
        }

        bindItemEvents() {
            const stream = document.getElementById('commentsListStream');
            if (!stream) return;

            // Delegate click actions
            stream.onclick = (e) => {
                const target = e.target.closest('button');
                if (!target) return;
                const action = target.getAttribute('data-action');
                if (!action) return;

                if (action === 'toggle-reply') {
                    const id = target.getAttribute('data-id');
                    this.activeReplyBoxId = (this.activeReplyBoxId === id) ? null : id;
                    this.activeDeleteBoxId = null;
                    this.renderListOnly();
                    if (this.activeReplyBoxId) {
                        const replyBox = document.getElementById(`replyFormWrap_${id}`);
                        if (replyBox) {
                            const ta = replyBox.querySelector('.reply-text-input');
                            if (ta) ta.focus();
                        }
                    }
                } else if (action === 'cancel-reply') {
                    this.activeReplyBoxId = null;
                    this.renderListOnly();
                } else if (action === 'toggle-delete') {
                    const id = target.getAttribute('data-id');
                    this.activeDeleteBoxId = (this.activeDeleteBoxId === id) ? null : id;
                    this.activeReplyBoxId = null;
                    this.renderListOnly();
                    if (this.activeDeleteBoxId) {
                        const pwInput = document.getElementById(`deletePwInput_${id}`);
                        if (pwInput) pwInput.focus();
                    }
                } else if (action === 'cancel-delete') {
                    this.activeDeleteBoxId = null;
                    this.renderListOnly();
                } else if (action === 'like') {
                    const id = target.getAttribute('data-id');
                    this.toggleLike(id, null);
                } else if (action === 'like-reply') {
                    const id = target.getAttribute('data-id');
                    const parentId = target.getAttribute('data-parent-id');
                    this.toggleLike(id, parentId);
                } else if (action === 'confirm-delete') {
                    const id = target.getAttribute('data-id');
                    this.executeDeleteRoot(id);
                } else if (action === 'confirm-delete-reply') {
                    const id = target.getAttribute('data-id');
                    const parentId = target.getAttribute('data-parent-id');
                    this.executeDeleteReply(parentId, id);
                }
            };

            // Delegate submit on nested reply forms
            stream.querySelectorAll('.nested-reply-form').forEach(form => {
                form.onsubmit = (e) => {
                    e.preventDefault();
                    const parentId = form.getAttribute('data-parent-id');
                    const authorInput = form.querySelector('.reply-author-input');
                    const pwInput = form.querySelector('.reply-password-input');
                    const textInput = form.querySelector('.reply-text-input');

                    const author = authorInput ? authorInput.value.trim() : '';
                    const password = pwInput ? pwInput.value.trim() : '';
                    const text = textInput ? textInput.value.trim() : '';

                    if (!author || !password || !text) {
                        alert('닉네임, 비밀번호, 대댓글 내용을 모두 입력해 주세요.');
                        return;
                    }

                    localStorage.setItem('hwantastic_commenter_name', author);

                    const parentComment = this.comments.find(c => c.id === parentId);
                    if (!parentComment) return;

                    if (!parentComment.replies) parentComment.replies = [];

                    const newReply = {
                        id: 'r_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                        author: author,
                        password: password,
                        text: text,
                        createdAt: Date.now(),
                        likes: 0,
                        isAuthor: isAuthorName(author)
                    };

                    parentComment.replies.push(newReply);
                    saveComments(this.postId, this.comments);

                    this.activeReplyBoxId = null;
                    this.renderListOnly();
                    this.showNotice('대댓글이 등록되었습니다!');
                };
            });
        }

        toggleLike(targetId, parentId) {
            let targetObj = null;
            if (!parentId) {
                targetObj = this.comments.find(c => c.id === targetId);
            } else {
                const parent = this.comments.find(c => c.id === parentId);
                if (parent && parent.replies) {
                    targetObj = parent.replies.find(r => r.id === targetId);
                }
            }

            if (!targetObj) return;

            if (this.likedSet.has(targetId)) {
                this.likedSet.delete(targetId);
                targetObj.likes = Math.max(0, (targetObj.likes || 1) - 1);
            } else {
                this.likedSet.add(targetId);
                targetObj.likes = (targetObj.likes || 0) + 1;
            }

            saveLikedSet(this.postId, this.likedSet);
            saveComments(this.postId, this.comments);
            this.renderListOnly();
        }

        executeDeleteRoot(commentId) {
            const input = document.getElementById(`deletePwInput_${commentId}`);
            const inputPw = input ? input.value.trim() : '';
            const comment = this.comments.find(c => c.id === commentId);

            if (!comment) return;

            const isMaster = (inputPw === 'admin' || inputPw === 'hwantastic');
            if (comment.password !== inputPw && !isMaster) {
                alert('비밀번호가 일치하지 않습니다.');
                if (input) input.focus();
                return;
            }

            // If it has replies, mark as deleted or delete if no replies
            if (comment.replies && comment.replies.length > 0) {
                comment.text = '(작성자에 의해 삭제된 댓글입니다.)';
                comment.author = '삭제됨';
                comment.password = 'DELETED_' + Date.now();
            } else {
                this.comments = this.comments.filter(c => c.id !== commentId);
            }

            saveComments(this.postId, this.comments);
            this.activeDeleteBoxId = null;
            this.renderListOnly();
            this.showNotice('댓글이 삭제되었습니다.');
        }

        executeDeleteReply(parentId, replyId) {
            const input = document.getElementById(`deletePwInput_${replyId}`);
            const inputPw = input ? input.value.trim() : '';
            const parent = this.comments.find(c => c.id === parentId);
            if (!parent || !parent.replies) return;

            const reply = parent.replies.find(r => r.id === replyId);
            if (!reply) return;

            const isMaster = (inputPw === 'admin' || inputPw === 'hwantastic');
            if (reply.password !== inputPw && !isMaster) {
                alert('비밀번호가 일치하지 않습니다.');
                if (input) input.focus();
                return;
            }

            parent.replies = parent.replies.filter(r => r.id !== replyId);
            saveComments(this.postId, this.comments);
            this.activeDeleteBoxId = null;
            this.renderListOnly();
            this.showNotice('대댓글이 삭제되었습니다.');
        }

        showNotice(msg) {
            let toast = document.createElement('div');
            toast.className = 'comments-toast-notice';
            toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapeHtml(msg)}`;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('visible');
            }, 10);

            setTimeout(() => {
                toast.classList.remove('visible');
                setTimeout(() => toast.remove(), 350);
            }, 2500);
        }
    }

    // Auto Mount on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        const mount = document.getElementById('devlogCommentsSection');
        if (mount) {
            const postId = getPostId();
            new DevLogCommentsApp(mount, postId);
        }
    });

})();
