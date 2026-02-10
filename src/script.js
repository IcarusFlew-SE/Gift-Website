$(document).ready(function () {
    const envelope = $("#envelope");
    const btn_open = $("#open");
    const btn_reset = $("#reset");
    const musicToggle = $("#musicToggle");
    const bgMusic = $("#bgm-audio")[0];
    let musicPlaying = false;
    let isAnimating = false;
    
    envelope.click(function() {
        if (!isAnimating && envelope.hasClass("close")) {
            open();
        }
    });

    btn_open.click(function() {
        open();
    });

    btn_reset.click(function() {
        close();
    });

    function open() {
        isAnimating = true;
        envelope.addClass("animating");
        envelope.addClass("open").removeClass("close");

        btn_open.prop('disabled', true);
        btn_reset.prop('disabled', true);

        setTimeout(function() {
            envelope.css('transform', 'scale(1.02');
            setTimeout(function() {
                envelope.css('transform', 'scale(1)');
            }, 300);
        }, 800);

        setTimeout(function() {
            isAnimating = false;
            envelope.removeClass("animating");
            btn_open.prop('disabled', false);
            btn_reset.prop('disabled', false);
        }, 1500);
    }
    function close() {
        isAnimating = true;
        envelope.addClass("animating");

        envelope.css('transform', 'scale(0.9)');
        setTimeout(function() {
            envelope.css('transform', 'scale(1)');
        }, 300);

        envelope.addClass("close").removeClass("open");

        btn_open.prop('disabled', true);
        btn_reset.prop('disabled', true);

        setTimeout(function() {
            isAnimating = false;
            envelope.removeClass("animating");
            btn_open.prop('disabled', false);
            btn_reset.prop('disabled', false);
        }, 1500);
    }

    globalThis.showPage = function(pageName) {
        $(".page").removeClass("active-page");

        $("#" + pageName).addClass("active-page");

        $(".nav-btn").removeClass("active");
        $(`.nav-btn[data-page="${pageName}"]`).addClass("active");

        window.scrollTo({ top: 0, behavior: 'smooth' });

        createParticles();
    };


    // Music Player
    musicToggle.click(function() {
        if (musicPlaying) {
            bgMusic.pause();
            $(".play-icon").show();
            $(".pause-icon").hide();
            musicPlaying = false;
        } else {
            bgMusic.play().catch(err => {
                console.log("Music can't autoplay:", err);
            });
            $(".play-icon").hide();
            $(".pause-icon").show();
            musicPlaying = true;
        }
    });

    // Loading Animation
    $('body').css('opacity', '0');
    setTimeout(function() {
        $('body').css({
            'opacity': '1',
            'transition': 'opacity 0.5s ease'
        });
    }, 100);

    function createParticles() {
        const particles = $("#particles");
        particles.empty();

        for(let i = 0; i < 0; i++) {
            const particle = $('<div class="particle"></div>');
            particle.css({
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5+ 's',
                animationDuration: (3 + Math.random() * 4) + 's'
            });
            particles.append(particle);
        }
    }

    $(".nav-btn").hover(
        function() {
            if (!$(this).hasClass('active')) {
                $(this).css('transform', 'translateY(-2px)');
            }
        },
        function() {
            if (!$(this).hasClass('active')) {
                $(this).css('transform', 'translateY(0)');
            }
        }
    );
}); 