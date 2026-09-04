/* ==========================================================================
   Hwantastic Games - Prototype Showcase JavaScript
   Category Filtering & Game Information Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
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

    // 2. Category Filter System
    const filterButtons = document.querySelectorAll('.filter-btn');
    const protoCards = document.querySelectorAll('.proto-grid .proto-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active state on buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            protoCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue || card.classList.contains('teaser-card')) {
                    card.style.display = 'flex';
                    card.style.animation = 'protoFadeIn 0.35s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Modal Functionality
    const infoModal = document.getElementById('tamersInfoModal');
    const btnOpenInfo = document.getElementById('btnTamersInfo');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCloseModalFooter = document.getElementById('btnCloseModalFooter');

    function openModal() {
        if (infoModal) {
            infoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (infoModal) {
            infoModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (btnOpenInfo) btnOpenInfo.addEventListener('click', openModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCloseModalFooter) btnCloseModalFooter.addEventListener('click', closeModal);

    // Close when clicking backdrop
    if (infoModal) {
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && infoModal && infoModal.classList.contains('active')) {
            closeModal();
        }
    });
});
