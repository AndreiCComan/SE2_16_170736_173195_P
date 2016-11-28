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

    //Smooth scrolling
    // Add smooth scrolling to all links in navbar + footer link
    $(".navbar a").on('click', function (event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {

            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 50
            }, 800, function () {
                $('button[data-target="#theNavbar"]').trigger("click").removeClass("active");
            });
        } // End if
    });
});
