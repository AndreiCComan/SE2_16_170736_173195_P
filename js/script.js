// Wait for the document to be ready
$(document).ready(function () {

	//Activate navbar toggle and tooltip
	activateToggle();
	activateTooltip();

	//Check scoll position in order to change navbar background color
	if ($('.navbar').length > 0) {
		$(window).on("scroll load resize", function () {
			checkScroll();
		});
	}

	//After page loaded all content remove preloader
	$(window).load(function () {
		showContentPage();
	});

	//Check scroll position in order to show content with slide in animation
	$(window).scroll(function () {
		checkSlideInAnimation();
	});

	//Smooth scrolling animation
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

	//After department click hide attention message, 
	//then show corresponding department content and update the arrival input
	$('a[data-goto="map"]').click(function () {
		var street = $(this).attr("data-street");
		var inputArrival = $('input[name="arrival"]');
		inputArrival.val(street);
		$(".info-message").hide();
		$(".info-content").show();
	});

	//After get position icon call the getLocation function
	$('.get-position').click(function () {
		$(this).hide();
		$(".loading-position").show();
		getLocation();
	});

	//Activate or deactivate the transit mode
	$(".transit-option").click(function () {
		$('.transit-option[data-status="activated"]').attr("data-status", "deactivated");
		$(this).attr("data-status", "activated");
		$("#mapForm").find("button").click();
	});

	//Open department info fullscreen preview
	$(document.body).on("click", ".image-selection", function () {
		var divID = $(this).attr("data-id");
		var descriptionPreview = $('div[id="' + divID + '"]');
		descriptionPreview.attr("data-status", "opened");
		descriptionPreview.fadeIn("fast");
	});

	//Close department info fullscreen preview
	$(document.body).on("click", ".close-preview", function () {
		var divToClose = $('div[data-status="opened"]');
		divToClose.attr("data-status", "closed")
		divToClose.fadeOut("fast");
	});

	//Map request form
	$("#mapForm").on("submit", function (event) {
		
		//Do not immediately submit the form
		event.preventDefault();

		//Some DOM reference
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

		//Asynchronous call to the server
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
						message.text("You should check the airport :)"); //EASTER EGG :)
						break;
					case "ServiceDirectionsUnavailable":
						message.text("Google Directions service is not available. Please try again later.");
						break;
					default:
						message.text("Unexpected error. Please reload the page.");
				}
				loadingMessage.hide();
				button.show();
				alertWrap.show("low");
				mapInfoRow.hide();
				mapWrap.hide();
			}
		});
	});
});

/**FUNCTIONS SECTION
 */

//Navbar background switch
function checkScroll() {
	var startY = $('.navbar').height() * 1.25;
	if ($(window).scrollTop() > startY) {
		$('.navbar').addClass("scrolled");
	} else {
		$('.navbar').removeClass("scrolled");
	}
}

//Toggle activation
function activateToggle() {
	$(".navbar-toggle").on("click", function () {
		$(this).toggleClass("active");
	});
}

//Tooltip activation
function activateTooltip() {
	$('[data-toggle="tooltip"]').tooltip();
}

//Welcome message
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

//Slide in animation
function checkSlideInAnimation() {
	$(".slideanim").each(function () {
		var pos = $(this).offset().top;
		var winTop = $(window).scrollTop();
		if (pos < winTop + 600) {
			$(this).addClass("slide");
		}
	});
}

//Create map within the page
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

//Geolocation
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successUpdateForm, showError);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

//Geolocation success function
function successUpdateForm(position) {
	$(".loading-position").hide();
	$(".get-position").show();
	var inputDeparture = $('input[name="departure"]');
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	$.ajax({
		url: '/getUserLocation?',
		type: "POST",
		data: '&latitude=' + latitude + "&longitude=" + longitude,
		dataType: "json",
		success: function (data) {
			inputDeparture.val(data.address);
		},
		error: function (data) {
			console.log(data.responseText);
			var response = data.responseText;
			var message = $('span[class="message"]');
			switch (response) {
				case "ServiceGeocodingUnavailable":
					message.text("Google Geocoding service is not available. Please try again later.");
					break;
				default:
					message.text("Unexpected error. Please reload the page.");
			}
			alertWrap.show("low");
		}
	});
}

//Geolocation error function
function showError(error) {
	console.log(error);
	var alertWrap = $(".alert-wrap");
	$(".get-position").show();
	$(".loading-position").hide();
	var message = $('span[class="message"]');
	switch (error.code) {
		case 1: //PERMISSION_DENIED
			message.text("It seems that you have not given permission to the website to locate you. You should fill in the form manually.");
			alertWrap.show("low");
			break;
		case 2: //POSITION_UNAVAILABLE
			message.text("The server was unable to locate you. Please try again later or fill in the form manually.");
			alertWrap.show("low");
			break;
		case 3: //TIMEOUT
			message.text("Your request took too much time. Please try again later.");
			alertWrap.show("low");
			break;
		default:
			message.text("Unexpected error. Please reload the page.");	
	}
}
