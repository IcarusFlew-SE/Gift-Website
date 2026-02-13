$(document).ready(function() {
    
    /* ==========================================
       CONFIGURATION & STATE MANAGEMENT
    ========================================== */
    
    // Application State
    const State = {
        isAnimating: false,
        musicPlaying: false,
        currentPage: 'home',
        album: {
            currentPage: 1,
            totalPages: 5,
            currentView: 'album'
        },
        slideshow: {
            index: 0,
            interval: null,
            isPlaying: false
        }
    };

    // DOM Element References (cached for better performance)
    const Elements = {
        // Letter
        envelope: $('#envelope'),
        btnOpen: $('#open'),
        btnReset: $('#reset'),
        
        // Music
        musicToggle: $('#musicToggle'),
        bgMusic: $('#bgMusic')[0],
        playIcon: $('.play-icon'),
        pauseIcon: $('.pause-icon'),
        
        // Album
        prevPage: $('#prevPage'),
        nextPage: $('#nextPage'),
        currentPageSpan: $('.current-page'),
        totalPagesSpan: $('.total-pages'),
        
        // Navigation
        navBtns: $('.nav-btn'),
        pages: $('.page'),
        
        // Particles
        particles: $('#particles')
    };

    
    /* ==========================================
       PAGE NAVIGATION
    ========================================== */
    
    /**
     * Navigate to a specific page
     * @param {string: pageName} - The ID of the page to show
     */
    function showPage(pageName) {
        // Remove active state from all pages
        Elements.pages.removeClass('active-page');
        
        // Activate the selected page
        $('#' + pageName).addClass('active-page');
        
        // Update navigation buttons
        Elements.navBtns.removeClass('active');
        Elements.navBtns.filter(`[data-page="${pageName}"]`).addClass('active');
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update state
        State.currentPage = pageName;
        
        // Refresh particles
        createParticles();
    }

    // Attach click handlers to navigation buttons
    Elements.navBtns.on('click', function() {
        const page = $(this).data('page');
        showPage(page);
    });

    
    /* ==========================================
       MUSIC PLAYER
    ========================================== */
    
    /**
     * Toggle background music play/pause
     */
    function toggleMusic() {
        if (State.musicPlaying) {
            Elements.bgMusic.pause();
            Elements.playIcon.show();
            Elements.pauseIcon.hide();
            State.musicPlaying = false;
        } else {
            // Handle autoplay restrictions gracefully
            Elements.bgMusic.play().catch(err => {
                console.warn('Music autoplay blocked by browser:', err);
            });
            Elements.playIcon.hide();
            Elements.pauseIcon.show();
            State.musicPlaying = true;
        }
    }

    Elements.musicToggle.on('click', toggleMusic);

    
    /* ==========================================
       ENVELOPE & LETTER ANIMATIONS
    ========================================== */
    
    /**
     * Open the envelope and reveal the letter
     */
    function openLetter() {
        if (State.isAnimating) return;
        
        State.isAnimating = true;
        Elements.envelope.addClass('animating open').removeClass('close');
        
        // Disable buttons during animation
        Elements.btnOpen.prop('disabled', true);
        Elements.btnReset.prop('disabled', true);
        
        // Subtle bounce effect as letter extends
        setTimeout(() => {
            Elements.envelope.css('transform', 'scale(1.01)');
            setTimeout(() => {
                Elements.envelope.css('transform', 'scale(1)');
            }, 300);
        }, 800);
        
        // Re-enable buttons after animation completes
        setTimeout(() => {
            State.isAnimating = false;
            Elements.envelope.removeClass('animating');
            Elements.btnOpen.prop('disabled', false);
            Elements.btnReset.prop('disabled', false);
        }, 2000);
    }

    /**
     * Close the letter and seal the envelope
     */
    function closeLetter() {
        if (State.isAnimating) return;
        
        State.isAnimating = true;
        Elements.envelope.addClass('animating');
        
        // Slight compression as letter slides back
        Elements.envelope.css('transform', 'scale(0.99)');
        setTimeout(() => {
            Elements.envelope.css('transform', 'scale(1)');
        }, 300);
        
        Elements.envelope.addClass('close').removeClass('open');
        
        // Disable buttons during animation
        Elements.btnOpen.prop('disabled', true);
        Elements.btnReset.prop('disabled', true);
        
        // Re-enable buttons after animation completes
        setTimeout(() => {
            State.isAnimating = false;
            Elements.envelope.removeClass('animating');
            Elements.btnOpen.prop('disabled', false);
            Elements.btnReset.prop('disabled', false);
        }, 1500);
    }

    // Letter button event handlers
    Elements.envelope.on('click', function() {
        if (!State.isAnimating && Elements.envelope.hasClass('close')) {
            openLetter();
        }
    });

    Elements.btnOpen.on('click', function(e) {
        e.preventDefault();
        if (!State.isAnimating && Elements.envelope.hasClass('close')) {
            openLetter();
        }
    });

    Elements.btnReset.on('click', function(e) {
        e.preventDefault();
        if (!State.isAnimating && Elements.envelope.hasClass('open')) {
            closeLetter();
        }
    });

    
    /* ==========================================
       FLOWERS ANIMATION
    ========================================== */
    
    /** Make flowers bloom with sparkle effects **/
    function bloomFlowers() {
        const $flowers = $('.flower');
        
        $flowers.each(function(index) {
            const $flower = $(this);
            
            // Stagger the animation
            setTimeout(() => {
                // Add bloom animation class
                $flower.addClass('blooming');
                
                // Create sparkles
                createSparkles($flower);
                
                // Remove bloom class after animation
                setTimeout(() => {
                    $flower.removeClass('blooming');
                }, 800);
            }, index * 120);
        });
    }

    /**
     * Create sparkle effects around an element
     * @param {jQuery} $element - The element to sparkle around
     * @param {number} amount - Number of sparkles to create
     */
    function createSparkles($element, amount = 6) {
        const offset = $element.offset();
        const $container = $element.parent();
        
        for (let i = 0; i < amount; i++) {
            const sparkle = $('<div class="sparkle">✨</div>');
            
            // Random position offsets
            const randomX = (Math.random() - 0.5) * 80;
            const randomY = (Math.random() - 1) * 100;
            
            sparkle.css({
                position: 'absolute',
                left: offset.left - $container.offset().left + $element.width() / 2 + 'px',
                top: offset.top - $container.offset().top + 'px',
                fontSize: '20px',
                pointerEvents: 'none',
                animation: `sparkleOut 0.8s ease-out forwards`,
                '--x': randomX + 'px',
                '--y': randomY + 'px',
                opacity: 0
            });
            
            $container.append(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => sparkle.remove(), 800);
        }
    }

    // Add sparkle animation to CSS dynamically
    $('<style>').text(`
        @keyframes sparkleOut {
            0% {
                transform: translate(0, 0) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(var(--x), var(--y)) scale(1);
                opacity: 0;
            }
        }
        .flower.blooming {
            animation: bloom 0.8s ease-out;
        }
        @keyframes bloom {
            0% { transform: scale(1); }
            50% { transform: scale(1.3) rotate(10deg); }
            100% { transform: scale(1.1) rotate(0deg); }
        }
    `).appendTo('head');

    // Attach bloom button handler
    $('.bloom-btn').on('click', bloomFlowers);

    
    /* ==========================================
       PHOTO ALBUM
    ========================================== */
    
    /**
     * Navigate to a specific album page
     * @param {number} newPage - The page number to show
     */
    function updateAlbumPage(newPage) {
        if (newPage < 1 || newPage > State.album.totalPages) return;
        
        // Hide current page with fade out
        $(`.album-page[data-page="${State.album.currentPage}"]`).removeClass('active');
        
        // Show new page with fade in
        setTimeout(() => {
            State.album.currentPage = newPage;
            $(`.album-page[data-page="${State.album.currentPage}"]`).addClass('active');
            Elements.currentPageSpan.text(State.album.currentPage);
            
            // Update button states
            Elements.prevPage.prop('disabled', State.album.currentPage === 1);
            Elements.nextPage.prop('disabled', State.album.currentPage === State.album.totalPages);
            
            // Visual feedback for disabled state
            Elements.prevPage.css('opacity', State.album.currentPage === 1 ? '0.4' : '1');
            Elements.nextPage.css('opacity', State.album.currentPage === State.album.totalPages ? '0.4' : '1');
        }, 300);
    }

    // Album navigation handlers
    Elements.prevPage.on('click', function() {
        if (State.album.currentPage > 1) {
            updateAlbumPage(State.album.currentPage - 1);
            createPageFlipEffect('left');
        }
    });

    Elements.nextPage.on('click', function() {
        if (State.album.currentPage < State.album.totalPages) {
            updateAlbumPage(State.album.currentPage + 1);
            createPageFlipEffect('right');
        }
    });

    /**
     * Create visual feedback for page flipping
     * @param {string} direction - 'left' or 'right'
     */
    function createPageFlipEffect(direction) {
        const icon = direction === 'right' ? '📖' : '📕';
        const $indicator = $(`<div class="page-flip-indicator">${icon}</div>`);
        
        $indicator.css({
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '100px',
            opacity: '0',
            animation: 'pageFlipPop 0.5s ease-out',
            pointerEvents: 'none',
            zIndex: '10000'
        });
        
        $('body').append($indicator);
        setTimeout(() => $indicator.remove(), 500);
    }

    // Add page flip animation
    $('<style>').text(`
        @keyframes pageFlipPop {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `).appendTo('head');

    
    /* ==========================================
       PHOTO MODAL
    ========================================== */
    
    /**
     * Open photo in modal view
     */
    function openPhotoModal(event) {
        event.stopPropagation();

        const $modal = $('#photoModal');
        const $img = $(this).find('img');
        const $caption = $(this).find('.polaroid-caption');
        const $polaroid = $(this);
        
        $('#modalImage').attr('src', $img.attr('src')).attr('alt', $img.attr('alt'));
        $('#modalCaption').text($caption.text());
        
        // Show modal
        $modal.addClass('active').fadeIn(300);
        
        // Prevent body scroll
        $('body').css('overflow', 'hidden');

        // Add bounce effect to clicked photo
        $polaroid.css('transform', 'scale(0.95)');
        setTimeout(() => {
            $polaroid.css('transform', '');
        }, 200);
    }

    /**
     * Close photo modal
     */
    function closePhotoModal() {
        const $modal = $('#photoModal');

        $modal.removeClass('active').fadeOut(300);

        $('body').css('overflow', '');
    }

    // Modal event handlers
    $('.polaroid').on('click', openPhotoModal);
    $('.modal-close').on('click', closePhotoModal);
    
    $('#photoModal').on('click', function(e) {
        if (e.target === this) {
            closePhotoModal();
        }
    });
    
    $('.modal-content').on('click', function(e) {
        e.stopPropagation(); // Prevent modal close when clicking image
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#photoModal').hasClass('active')) {
            closePhotoModal();
        }
    })

    
    /* ==========================================
       VIEW MODE SWITCHING
    ========================================== */
    
    /**
     * Switch between album, grid, and slideshow views
     * @param {string} viewMode - 'album', 'grid', or 'slideshow'
     */
    function switchView(viewMode) {
        if (viewMode === State.album.currentView) return;
        
        // Update active button
        $('.view-btn').removeClass('active');
        $(`.view-btn[data-view="${viewMode}"]`).addClass('active');
        
        // Hide all views
        $('.album-book, .grid-view, .slideshow-view, .album-controls').hide();
        
        // Show selected view
        State.album.currentView = viewMode;
        
        switch(viewMode) {
            case 'album':
                $('.album-book, .album-controls').fadeIn(500);
                break;
            case 'grid':
                populateGridView();
                $('.grid-view').fadeIn(500);
                break;
            case 'slideshow':
                initSlideshow();
                $('.slideshow-view').fadeIn(500);
                break;
        }
    }

    /**
     * Populate grid view with all photos
     */
    function populateGridView() {
        const $grid = $('.grid-gallery');
        $grid.empty();
        
        $('.album-book .polaroid').each(function() {
            const $clone = $(this).clone();
            $clone.css({
                'transform': 'rotate(0deg)',
                'margin': '0'
            });
            $clone.on('click', openPhotoModal);
            $grid.append($clone);
        });
    }

    /**
     * Initialize slideshow functionality
     */
    function initSlideshow() {
        const $photos = $('.album-book .polaroid');
        State.slideshow.index = 0;
        
        function showSlide(index) {
            State.slideshow.index = (index + $photos.length) % $photos.length;
            const $photo = $photos.eq(State.slideshow.index);
            
            $('.slideshow-photo').attr('src', $photo.find('img').attr('src'));
            $('.slideshow-caption').text($photo.find('.polaroid-caption').text());
            
            // Transition effect
            $('.slideshow-photo').css({
                'opacity': '0',
                'transform': 'scale(0.9)'
            });
            setTimeout(() => {
                $('.slideshow-photo').css({
                    'opacity': '1',
                    'transform': 'scale(1)',
                    'transition': 'all 0.5s ease'
                });
            }, 50);
        }

        function startSlideshow() {
            State.slideshow.isPlaying = true;
            $('.slideshow-play').text('⏸');
            State.slideshow.interval = setInterval(() => {
                showSlide(State.slideshow.index + 1);
            }, 3000);
        }

        function stopSlideshow() {
            State.slideshow.isPlaying = false;
            $('.slideshow-play').text('▶');
            clearInterval(State.slideshow.interval);
        }

        // Show first slide
        showSlide(0);

        // Control handlers
        $('.slideshow-control.prev').off('click').on('click', () => {
            showSlide(State.slideshow.index - 1);
            stopSlideshow();
        });

        $('.slideshow-control.next').off('click').on('click', () => {
            showSlide(State.slideshow.index + 1);
            stopSlideshow();
        });

        $('.slideshow-play').off('click').on('click', function() {
            if (State.slideshow.isPlaying) {
                stopSlideshow();
            } else {
                startSlideshow();
            }
        });
    }

    // View mode button handlers
    $('.view-btn').on('click', function() {
        const view = $(this).data('view');
        switchView(view);
    });

    
    /* ==========================================
       PARTICLE EFFECTS
    ========================================== */
    
    /**
     * Create floating particle effects
     * @param {number} count - Number of particles to create
     */
    function createParticles(count = 30) {
        Elements.particles.empty();
        
        for (let i = 0; i < count; i++) {
            const $particle = $('<div class="particle"></div>');
            
            $particle.css({
                left: Math.random() * 100 + '%',
                animationDuration: (6 + Math.random() * 6) + 's',
                animationDelay: Math.random() * 5 + 's'
            });
            
            Elements.particles.append($particle);
        }
    }

    
    /* ==========================================
       KEYBOARD SHORTCUTS
    ========================================== */
    
    $(document).on('keydown', function(e) {
        // Letter controls
        if (e.key === 'o' || e.key === 'O') {
            if (State.currentPage === 'letter' && Elements.envelope.hasClass('close') && !State.isAnimating) {
                openLetter();
            }
        }
        if (e.key === 'c' || e.key === 'C') {
            if (State.currentPage === 'letter' && Elements.envelope.hasClass('open') && !State.isAnimating) {
                closeLetter();
            }
        }
        
        // Music control
        if (e.key === 'm' || e.key === 'M') {
            toggleMusic();
        }
        
        // Page navigation
        if (e.key >= '1' && e.key <= '4') {
            const pages = ['home', 'letter', 'photos', 'flowers'];
            showPage(pages[parseInt(e.key) - 1]);
        }
        
        // Album navigation
        if (State.currentPage === 'photos' && State.album.currentView === 'album') {
            if (e.key === 'ArrowLeft') {
                Elements.prevPage.click();
            } else if (e.key === 'ArrowRight') {
                Elements.nextPage.click();
            }
        }
    });

    
    /* ==========================================
       CURSOR TRAIL EFFECT
    ========================================== */
    
    let lastTrail = 0;
    
    $(document).on('mousemove', function(e) {
        const now = Date.now();
        
        // Throttle trail creation
        if (now - lastTrail > 80 && Math.random() > 0.6) {
            lastTrail = now;
            
            const $heart = $('<div class="heart-trail">💕</div>');
            $heart.css({
                position: 'fixed',
                left: e.pageX + 'px',
                top: e.pageY + 'px',
                fontSize: '12px',
                pointerEvents: 'none',
                zIndex: 9999,
                animation: 'fadeOut 1s ease-out forwards'
            });
            
            $('body').append($heart);
            setTimeout(() => $heart.remove(), 1000);
        }
    });

    // Add fadeOut animation
    $('<style>').text(`
        @keyframes fadeOut {
            0% {
                opacity: 1;
                transform: translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateY(-30px);
            }
        }
    `).appendTo('head');

    
    /* ==========================================
       SCROLL ANIMATIONS
    ========================================== */
    
    /**
     * Reveal elements on scroll
     */
    function revealOnScroll() {
        const elements = $('.magic-card, .flower-message');
        
        elements.each(function() {
            const elementTop = $(this).offset().top;
            const windowBottom = $(globalThis).scrollTop() + $(globalThis).height();
            
            if (elementTop < windowBottom - 100) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }
        });
    }

    // Initialize scroll animation elements
    $('.magic-card, .flower-message').css({
        'opacity': '0',
        'transform': 'translateY(30px)',
        'transition': 'all 0.6s ease'
    });

    $(globalThis).on('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    
    /* ==========================================
       INITIALIZATION
    ========================================== */
    
    // Create initial particles
    createParticles();
    
    // Page load fade-in
    $('body').css('opacity', '0');
    setTimeout(() => {
        $('body').css({
            'opacity': '1',
            'transition': 'opacity 0.5s ease'
        });
    }, 100);
    
    // Console welcome message
    console.log('%c💕 Welcome to Our Love Story! 💕', 'color: #d9534f; font-size: 20px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts:', 'color: #666; font-size: 14px;');
    console.log('%c• Press 1-4: Navigate pages', 'color: #666; font-size: 12px;');
    console.log('%c• Press O: Open letter', 'color: #666; font-size: 12px;');
    console.log('%c• Press C: Close letter', 'color: #666; font-size: 12px;');
    console.log('%c• Press M: Toggle music', 'color: #666; font-size: 12px;');
    console.log('%c• Arrow keys: Navigate album', 'color: #666; font-size: 12px;');
    
    console.log('💝 Valentine\'s Website Loaded Successfully!');
});