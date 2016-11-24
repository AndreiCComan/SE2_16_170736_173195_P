$(document).ready(function () {
    /**
     * Listen to scroll to change header opacity class
     */
    function checkScroll() {
        var startY = $('.navbar').height() * 1.25; //The point where the navbar changes in px
        if ($(window).scrollTop() > startY) {
            $('.navbar').addClass("scrolled");
        } else {
            $('.navbar').removeClass("scrolled");
        }
    }

    if ($('.navbar').length > 0) {
        $(window).on("scroll load resize", function () {
            checkScroll();
        });
    }

    $(".navbar-toggle").on("click", function () {
        $(this).toggleClass("active");
    });

    $(window).load(function () {
        $(".preloader").fadeOut("slow");
        $(function () {
            $(".element").typed({
                strings: ["Welcome",
                          "Benvenuto",
                          "Willkommen",
                          "欢迎",
                          "Välkommen",
                          "Bienvenue",
                          "Bem-vindo",
                          "Bun venit",
                          "Powitanie",
                          "Dobrodošli",
                          "Fogadtatás",
                          "добро пожаловать"],
                typeSpeed: 130,
                loop: true
            });
        });
    });

    // SLIDEANIM
    $(window).scroll(function () {
        $(".slideanim").each(function () {
            var pos = $(this).offset().top;
            var winTop = $(window).scrollTop();
            if (pos < winTop + 600) {
                $(this).addClass("slide");
            }
        });
    });

    $(document.body).on("click", ".close-preview", function () {
        var divToClose = $('div[data-status="opened"]');
        divToClose.attr("data-status", "closed")
        divToClose.fadeOut("fast");
    });

    $(document.body).on("click", ".image-selection", function () {
        var divID = $(this).attr("data-id");
        var descriptionPreview = $('div[id="' + divID + '"]');
        descriptionPreview.attr("data-status", "opened");
        descriptionPreview.fadeIn("fast");
    });
});
