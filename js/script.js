$(document).ready(function () {
	//Activate navbar toggle and tooltip
	activateToggle();
	activateTooltip();

	if ($('.navbar').length > 0) {
		$(window).on("scroll load resize", function () {
			checkScroll();
		});
	}

	$(window).load(function () {
		showContentPage();
	});

	$(window).scroll(function () {
		checkSlideInAnimation();
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
	$('.navbar a, a[data-goto]').on('click', function (event) {
		if (this.hash !== "") {
			event.preventDefault();
			var hash = this.hash;
			$('html, body').animate({
				scrollTop: $(hash).offset().top - 50
			}, 800, function () {
				$("#theNavbar").collapse("hide");
				$('button[data-target="#theNavbar"]').removeClass("active");
			});
		}
	});

	$('a[data-goto="map"]').click(function () {
		var street = $(this).attr("data-street");
		var inputArrival = $('input[name="arrival"]');
		inputArrival.val(street);
		$(".info-message").hide();
		$(".info-content").show();
	});

	$('.get-position').click(function () {
		$(this).hide();
		$(".loading-position").show();
		getLocation();
	});

	//MapRequestForm
	$("#mapForm").on("submit", function (event) {

		event.preventDefault();

		var button = $(this).find("button");
		var loadingMessage = $(".loading-message");
		var mode = $('.transit-option[data-status="activated"]').attr("data-mode");
		var alertWrap = $(".alert-wrap");
		var mapInfoRow = $(".map-info-row");
		var mapWrap = $(".map-wrap");
		var inputDeparture = $('input[name="departure"]');
		var inputArrival = $('input[name="arrival"]');
		var distanceMapInfo = $(".distance-map-info");
		var durationMapInfo = $(".duration-map-info");
		var activatedTransitOption = $('.transit-option[data-status="activated"]');
		var busResultWrap = $(".bus-result-wrap");
		var noteFake = $(".noteFake");
		button.hide();
		loadingMessage.show();

		$.ajax({
			url: '/getMap?',
			type: "POST",
			data: $(this).serialize() + "&mode=" + mode,
			dataType: "json",
			success: function (data) {
				console.log(data);

				var polyline = data.polyline;
				var departureLocation = data.departureLocation;
				var arrivalLocation = data.arrivalLocation;
				var routeDistance = data.routeDistance;
				var routeDuration = data.routeDuration;

				alertWrap.hide();
				loadingMessage.hide();
				button.show();
				mapInfoRow.show();
				mapWrap.show();

				inputDeparture.val(data.departureAddress);
				inputArrival.val(data.arrivalAddress);
				distanceMapInfo.text(routeDistance);
				durationMapInfo.text(routeDuration);

				if (activatedTransitOption.attr("data-mode") === "transit") {
					busResultWrap.slideDown(300);
					noteFake.slideDown(300);
				} else {
					busResultWrap.slideUp(300);
					noteFake.slideUp(300);
				}

				setTimeout(function () {
					initMap(polyline, departureLocation, arrivalLocation);
				}, 350);
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
				alertWrap.show("low");
				mapInfoRow.hide();
				mapWrap.hide();
			}
		});
	});

	$(".transit-option").click(function () {
		$('.transit-option[data-status="activated"]').attr("data-status", "deactivated");
		$(this).attr("data-status", "activated");
		$("#mapForm").find("button").click();
	});
});

//FUNCTIONS SECTION
function checkScroll() {
	var startY = $('.navbar').height() * 1.25;
	if ($(window).scrollTop() > startY) {
		$('.navbar').addClass("scrolled");
	} else {
		$('.navbar').removeClass("scrolled");
	}
}

function activateToggle() {
	$(".navbar-toggle").on("click", function () {
		$(this).toggleClass("active");
	});
}

function activateTooltip() {
	$('[data-toggle="tooltip"]').tooltip();
}

function showContentPage() {
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
                          "Fogadtatás"
                         ],
			typeSpeed: 130,
			loop: true
		});
	});
	setTimeout(function () {
		$(".welcome-iframe").attr("src", "https://www.youtube.com/embed/wvQEHOyoxJ4");
	}, 400);
}

function checkSlideInAnimation() {
	$(".slideanim").each(function () {
		var pos = $(this).offset().top;
		var winTop = $(window).scrollTop();
		if (pos < winTop + 600) {
			$(this).addClass("slide");
		}
	});
}

function initMap(polyline, departureLocation, arrivalLocation) {
	var map = new google.maps.Map(document.getElementById('mapdraw'), {
		zoom: 15,
		center: {
			lat: departureLocation.lat,
			lng: departureLocation.lng
		},
		mapTypeId: 'roadmap'
	});

	//route
	var routePath = new google.maps.Polyline({
		path: polyline,
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

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(updateForm, showError);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

function updateForm(position) {
	$(".loading-position").hide();
	$(".get-position").show();
	var inputDeparture = $('input[name="departure"]');
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	//alert(position.coords.latitude + " " + position.coords.longitude);
	$.ajax({
		url: '/getUserLocation?',
		type: "POST",
		data: '&latitude=' + latitude + "&longitude=" + longitude,
		dataType: "json",
		success: function (data) {
			inputDeparture.val(data.address);
		},
		error: function (data) {
			console.log(data);
		}
	});
}

function showError(error) {
	var message = $('span[class="message"]');
	switch (error.code) {
		case error.PERMISSION_DENIED:
			message.val("User denied the request for Geolocation.");
			message.show();
			break;
		case error.POSITION_UNAVAILABLE:
			message.val("Location information is unavailable.");
			message.show()
			break;
		case error.TIMEOUT:
			message.val("The request to get user location timed out.");
			message.show()
			break;
		case error.UNKNOWN_ERROR:
			message.val("An unknown error occurred.");
			message.show();
			break;
	}
}
