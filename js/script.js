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
        setTimeout(function () {
            $(".welcome-iframe").attr("src", "https://www.youtube.com/embed/wvQEHOyoxJ4");
        }, 400);
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
                $("#theNavbar").collapse("hide");
                $('button[data-target="#theNavbar"]').removeClass("active");
                //old implementation $('button[data-target="#theNavbar"]').trigger("click").removeClass("active");
            });
        } // End if
    });

    //Tooltip
    $('[data-toggle="tooltip"]').tooltip();


    //MAP SECTION
    function initMap(arrayLatLng, departureLocation, arrivalLocation) {
        var map = new google.maps.Map(document.getElementById('mapdraw'), {
            zoom: 15,
            center: {
                lat: departureLocation.lat,
                lng: departureLocation.lng
            },
            mapTypeId: 'roadmap'
        });

        //route
        var routeCoordinates = arrayLatLng;
        var routePath = new google.maps.Polyline({
            path: routeCoordinates,
            geodesic: true,
            strokeColor: '#8e44ad',
            strokeOpacity: 0.7,
            strokeWeight: 4
        });
        routePath.setMap(map);

        //markerDeparture
        var markerDeparture = new google.maps.Marker({
            position: departureLocation,
            map: map,
            label: 'A',
        });
        markerDeparture.setMap(map);

        //markerArrival
        var markerArrival = new google.maps.Marker({
            position: arrivalLocation,
            map: map,
            label: 'B',
        });
        markerArrival.setMap(map);

    }

    //MapRequestForm
    $("#mapForm").on("submit", function (event) {
        event.preventDefault();
        var button = $(this).find("button");
        var loadingMessage = $(".loading-message");
        button.hide();
        loadingMessage.show();
        var mode = $('.transit-option[data-status="activated"]').attr("data-mode");
        $.ajax({
            url: '/getMap?',
            type: "POST",
            data: $(this).serialize() + "&mode=" + mode,
            dataType: "json",
            success: function (data) {

                $(".alert-wrap").hide();
                loadingMessage.hide();
                button.show();
                $(".map-info-row").show();
                $(".map-wrap").show();

                console.log(data);
                $('input[name="departure"]').val(data.routes[0].legs[0].start_address);
                $('input[name="arrival"]').val(data.routes[0].legs[0].end_address);
                var arrayLatLng = data.routes[0].convertedLatLng;
                var departureLocation = data.routes[0].legs[0].start_location;
                var arrivalLocation = data.routes[0].legs[0].end_location;
                var distance = data.routes[0].legs[0].distance.text;
                var duration = data.routes[0].legs[0].duration.text;
                $(".distance-map-info").text(distance);
                $(".duration-map-info").text(duration);
                initMap(arrayLatLng, departureLocation, arrivalLocation);
            },
            error: function (data) {
                console.log(data.responseText);
                var response = data.responseText;
                var message = $('span[class="message"]');
                switch (response) {
                    case "NOT_FOUND":
                        message.text("Street not found");
                        break;
                    case "ZERO_RESULTS":
                        message.text("Try the airport my man"); //EASTER EGG :)
                        break;
                    default:
                        message.text("Unexpected error"); //GESTIRE QUESTO CASO
                }
                loadingMessage.hide();
                button.show();
                $(".alert-wrap").show("low");
                $(".map-info-row").hide();
                $(".map-wrap").hide();
            }
        });
    });

    $(".transit-option").click(function () {
        $('.transit-option[data-status="activated"]').attr("data-status", "deactivated");
        $(this).attr("data-status", "activated");
        $("#mapForm").find("button").click();
    });
});
