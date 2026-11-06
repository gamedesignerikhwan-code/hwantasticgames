/**
 * ============================================================================
 * Hwantastic Games - DevLog Board Comments & Nested Replies System
 * In-Page, Non-Popup, LocalStorage Persistence with Multi-Tab Sync
 * Supports: Root Comments, Nested Replies (대댓글), Likes, Password Deletion
 * ============================================================================
 */

(function () {
    'use strict';

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
                if (Array.isArray(parsed)) {
                    // Filter out any legacy sample/seed comments so only genuine user comments remain
                    const cleaned = parsed.filter(c => {
                        const id = String(c.id || '');
                        return !id.startsWith('c_august_') && 
                               !id.startsWith('c_july_') && 
                               !id.startsWith('c_june_') && 
                               !id.startsWith('c_web_') && 
                               !id.startsWith('c_bal_') && 
                               !id.startsWith('c_con_') && 
                               !id.startsWith('c_stm_');
                    });
                    if (cleaned.length !== parsed.length) {
                        saveComments(postId, cleaned);
                    }
                    return cleaned;
                }
            }
        } catch (e) {
            console.warn('Failed to parse comments from localStorage:', e);
        }

        return [];
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
