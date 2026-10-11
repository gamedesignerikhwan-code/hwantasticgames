/* ==========================================================================
   Hwantastic Games - Hearts Extreme Layout JavaScript
   Tab Navigation Switcher, Deck Switcher, DevLog Modals, Screenshot Lightbox
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const siteNavigation = document.getElementById('siteNavigation');

    if (mobileToggle && siteNavigation) {
        mobileToggle.addEventListener('click', () => {
            siteNavigation.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (siteNavigation.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Tab Navigation System (Tab-Switching UI without smooth scroll jump)
    const navTabLinks = document.querySelectorAll('[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function resolveTabId(rawId) {
        if (!rawId) return 'home';
        const id = rawId.toLowerCase();
        if (id === 'home') return 'home';
        if (id === 'games' || id === 'videogames' || id === 'video-games') return 'videogames';
        if (id === 'community') return 'contact';
        return id;
    }

    function switchTab(tabId) {
        tabId = resolveTabId(tabId) || 'home';
        const targetPanel = document.getElementById(`tab-${tabId}`);
        if (!targetPanel) return;

        // Hide all tab panels
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
        });

        // Activate target tab panel
        targetPanel.classList.add('active');

        // Update active class on navigation links
        document.querySelectorAll('.primary-menu .nav-link').forEach(link => {
            const dataTab = link.getAttribute('data-tab');
            if (dataTab) {
                const linkTab = resolveTabId(dataTab);
                if (linkTab === tabId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            } else {
                // External/separate page links (e.g. boardgames.html) should never be active on tab switch
                link.classList.remove('active');
            }
        });

        // Scroll to top when switching views
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => window.scrollTo(0, 0), 10);

        // Close mobile nav menu if open
        if (siteNavigation && siteNavigation.classList.contains('active')) {
            siteNavigation.classList.remove('active');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        }
    }

    // Attach click listeners to all tab nav links
    navTabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const tabId = link.getAttribute('data-tab');
            if (tabId) {
                e.preventDefault();
                const resolved = resolveTabId(tabId);
                switchTab(resolved);
                if (resolved === 'home') {
                    history.pushState(null, '', window.location.pathname);
                } else {
                    history.pushState(null, '', `#${resolved}`);
                }
            }
        });
    });

    // Check URL hash on page load (e.g. #news or #videogames)
    const initialHash = window.location.hash.replace('#', '');
    const resolvedInitial = resolveTabId(initialHash);
    if (resolvedInitial && document.getElementById(`tab-${resolvedInitial}`)) {
        switchTab(resolvedInitial);
        window.scrollTo(0, 0);
        setTimeout(() => window.scrollTo(0, 0), 50);
    } else {
        switchTab('home');
        window.scrollTo(0, 0);
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '');
        switchTab(resolveTabId(hash) || 'home');
        window.scrollTo(0, 0);
    });

    // 3. Steam Wishlist Counter & Click Handler
    let count = 18420;
    const wishlistElem = document.getElementById('wishlistCount');
    const btnWishlistHero = document.getElementById('btnWishlistHero');
    const btnWishlistMain = document.getElementById('btnWishlistMain');

    function handleWishlistClick(e) {
        count++;
        if (wishlistElem) {
            wishlistElem.innerText = count.toLocaleString();
            wishlistElem.style.color = 'var(--neon-pink)';
            wishlistElem.style.transform = 'scale(1.2)';
            setTimeout(() => {
                wishlistElem.style.color = 'var(--text-main)';
                wishlistElem.style.transform = 'scale(1)';
            }, 300);
        }

        showToast("✨ Thank you for wishlisting Hearts Extreme on Steam!");
    }

    if (btnWishlistHero) btnWishlistHero.addEventListener('click', handleWishlistClick);
    if (btnWishlistMain) btnWishlistMain.addEventListener('click', handleWishlistClick);

    // Toast Notification Helper
    function showToast(message) {
        let toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `<i class="fa-brands fa-steam"></i> ${message}`;
        
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: 'var(--steam-gradient)',
            border: '1px solid var(--steam-accent)',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            zIndex: '3000',
            fontFamily: 'var(--font-body)',
            fontWeight: '600',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.4s ease'
        });

        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // 4. Deck Showcase Tabs Data & Real Image Assets
    const deckData = {
        base: {
            title: "Base Deck",
            desc: "Standard 4-suit deck (♠, ♦, ♥, ♣) with cards ranked 1 through 13. Spades (♠) serve as the permanent Trump suit to introduce core trick-taking mechanics.",
            suits: "4 Suits (♠ ♦ ♥ ♣)",
            trump: "Spades (♠)",
            special: "Standard Numerals",
            image: "assets/store_assets/screenshot_2_lobby_deck_select.png"
        },
        space: {
            title: "Space Deck",
            desc: "A 5-suit deck introducing the Star (★) suit. Although Star cards only rank from 1 to 4, they function as absolute supreme Trumps over all other suits.",
            suits: "5 Suits (★ ♠ ♦ ♥ ♣)",
            trump: "Stars (★)",
            special: "★1 ~ ★4 Absolute Trumps",
            image: "assets/store_assets/screenshot_4_gameplay_6p_space.png"
        },
        rainbow: {
            title: "Rainbow Deck",
            desc: "An unpredictable 7-suit deck featuring Star, Spade, Diamond, Heart, Club, Circle, and Square suits (ranks 1-7). Keeps your tactical foresight sharp.",
            suits: "7 Distinct Suits",
            trump: "Changes per Round",
            special: "↑ (Inversion), ↓ (Down), X (Nullify)",
            image: "assets/promo_shots/021_S04_ingame_initial.png"
        },
        trio: {
            title: "Trio Deck",
            desc: "A fast-paced 3-suit deck with ranks scaling up to 15. Features score-multiplier modifier cards (M*2) that double trick scores instantly.",
            suits: "3 Suits (♦ ♥ ♣)",
            trump: "No Trump",
            special: "↑ (Inversion), M*2 (Double Score)",
            image: "assets/store_assets/screenshot_3_gameplay_4p.png"
        },
        heart: {
            title: "Heart Mono Deck",
            desc: "A grueling mode played entirely with a single suit: Hearts (♥). Without suit-following restrictions, victory rests entirely on card ranks and modifier timing.",
            suits: "1 Suit (♥ Mono Heart)",
            trump: "Hearts (♥)",
            special: "X*2 (Double Nullify)",
            image: "assets/promo_shots/033_S07_deck_4_Base_Deck.png"
        }
    };

    const tabBtns = document.querySelectorAll('.deck-tab-btn');
    const deckTitle = document.getElementById('deckTitle');
    const deckDesc = document.getElementById('deckDesc');
    const deckSuits = document.getElementById('deckSuits');
    const deckTrump = document.getElementById('deckTrump');
    const deckSpecial = document.getElementById('deckSpecial');
    const deckImg = document.getElementById('deckImg');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const key = btn.dataset.deck;
            const data = deckData[key];

            if (data && deckTitle) {
                deckTitle.innerText = data.title;
                deckDesc.innerText = data.desc;
                deckSuits.innerText = data.suits;
                deckTrump.innerText = data.trump;
                deckSpecial.innerText = data.special;

                if (deckImg && data.image) {
                    deckImg.style.opacity = '0';
                    setTimeout(() => {
                        deckImg.src = data.image;
                        deckImg.style.opacity = '1';
                    }, 150);
                }
            }
        });
    });

    // 5. Screenshot Gallery Lightbox Viewer
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.dataset.src;
            const title = item.dataset.title;

            if (lightboxModal && lightboxImg) {
                lightboxImg.src = src;
                if (lightboxTitle) lightboxTitle.innerText = title;
                lightboxModal.classList.add('active');
            }
        });
    });

    if (lightboxClose && lightboxModal) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }

    // 6. DevLog Modal Data & Handler
    // News cards link to standalone devlog_*.html pages; no card uses the modal any more.
    const devlogData = {};

    const devlogModal = document.getElementById('devlogModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    document.querySelectorAll('.read-log-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.news-block');
            const logId = card ? card.dataset.log : null;
            const log = devlogData[logId];

            if (log && modalBody && devlogModal) {
                modalBody.innerHTML = `
                    <div style="margin-bottom: 20px;">
                        <span style="color: var(--neon-pink); font-family: var(--font-heading); font-weight:700; font-size:0.85rem;">${log.category} · ${log.date}</span>
                        <h2 style="font-family: var(--font-heading); font-size:1.6rem; margin-top:8px;">${log.title}</h2>
                    </div>
                    <div style="line-height:1.7; color: var(--text-muted);">
                        ${log.content}
                    </div>
                `;
                devlogModal.classList.add('active');
            }
        });
    });

    if (modalClose && devlogModal) {
        modalClose.addEventListener('click', () => {
            devlogModal.classList.remove('active');
        });

        devlogModal.addEventListener('click', (e) => {
            if (e.target === devlogModal) {
                devlogModal.classList.remove('active');
            }
        });
    }

    // 7. Contact Form Handler (Direct FormSubmit HTML Submission)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Message...';
            }
        });
    }

    // 8. Preview Key Request Form Handler (Real Email Submission + Mailto Pre-fill)
    const previewKeyForm = document.getElementById('previewKeyForm');
    if (previewKeyForm) {
        previewKeyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('pkName').value.trim();
            const email = document.getElementById('pkEmail').value.trim();
            const typeElem = document.getElementById('pkType');
            const typeText = typeElem ? typeElem.options[typeElem.selectedIndex].text : 'Media Coverage';
            const channelElem = document.getElementById('pkChannel');
            const channel = channelElem ? channelElem.value.trim() : '';

            const submitBtn = previewKeyForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...';
            }

            try {
                await fetch('https://formsubmit.co/ajax/hwantasticgames@gmail.com', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        coverage_type: typeText,
                        channel_link: channel,
                        _subject: `[Hearts Extreme Preview Key Request] ${name} (${typeText})`
                    })
                });
            } catch (err) {
                console.warn('FormSubmit background dispatch note:', err);
            }

            const mailtoSubject = encodeURIComponent(`[Preview Key Request] Hearts Extreme - ${name}`);
            const mailtoBody = encodeURIComponent(`Preview Key Request Details:\nOutlet / Name: ${name}\nEmail: ${email}\nCoverage Type: ${typeText}\nChannel: ${channel}`);
            const mailtoUrl = `mailto:hwantasticgames@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            showToast(`🔑 Thank you ${name}! Opening mail app to send preview key request to hwantasticgames@gmail.com...`);
            
            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 600);

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-key"></i> Request Preview Key';
            }
            previewKeyForm.reset();
        });
    }

    // 9. Mega Crit Style Tag Filtering for News Cards
    const tagFilters = document.querySelectorAll('#tag-filters .styled-tag');
    const newsCards = document.querySelectorAll('.news-card');

    if (tagFilters.length > 0 && newsCards.length > 0) {
        tagFilters.forEach(filterBtn => {
            filterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedTag = filterBtn.getAttribute('data-tag');

                tagFilters.forEach(btn => btn.classList.remove('active'));
                filterBtn.classList.add('active');

                newsCards.forEach(card => {
                    const cardTags = card.getAttribute('data-tags') || '';
                    if (selectedTag === 'all' || cardTags.includes(selectedTag)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

});

