/////*Model*/////
var Locations = [
		{name: "Capital Restaurant", position: {lat: 37.793945, lng: -122.407079}, id: "4a788bcdf964a520d9e51fe3"},
		{name: "Shangri-Li Chinese Vegetarian", position: {lat: 37.763695, lng: -122.479830}, id: "4b7629aff964a520f0402ee3"},
		{name: "Riverside Seafood Restaurant", position: {lat: 37.738948, lng: -122.479902}, id: "4a918d27f964a520a81a20e3"},
		{name: "City View Restaurant", position: {lat: 37.794188, lng: -122.404117}, id: "4abfdac7f964a5209f9220e3"},
		{name: "Five Happiness", position: {lat: 37.781281, lng: -122.463974}, id: "49eaa620f964a52087661fe3"}
];

//Declared map and infoWindow variables early to be used later downstream
	function contentString(location) {
		"use strict";
		return ('<div id="content">'+ '<div id="siteNotice">'+ '</div>'+ '<h1 id="firstHeading" class="firstHeading">' + location.title + '</h1>'+ '<div id="bodyContent">'+ '<p>' + location.formattedAddress[0] + '<br>' + location.formattedAddress[1] + '<br>' + location.formattedAddress[2] + '<br>' + '</div>'+ '</div>');
	}

var map;

var currentInfoWindow;

//Function that renders the map on screen using the Id "map" as a reference from index.html
	function initMap() {
	"use strict";
		map = new google.maps.Map(document.getElementById("map"), {
			center: {lat: 37.7749, lng: -122.4194},
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false
		});
	}

/////*VIEWMODEL*/////
function ViewModel() {
	"use strict";

	//Declared "this" as self variable so that the same instance of "this" can be used in multiple functions downstream
	var self = this;
	self.markers = [];

	//Copies the values of Locations and stores them in an observable array for knockout listview implementation
	self.Locations = ko.observableArray(Locations);

	//Adds new markers at each location in the self.Locations Array
	self.Locations().forEach(function(location) {
		var marker = new google.maps.Marker({
			position: location.position,
			map: map,
			title: location.title,
			URL: location.shortUrl,
			icon: 'http://icons.iconarchive.com/icons/pixture/box-container/32/Chinese-icon.png',
			animation: google.maps.Animation.DROP
		});

		location.marker = marker;

		marker.setVisible(true);

	//Pushes each marker into the markers array
		self.markers.push(marker);

			/*client id and client secret for foursquare api*/
				var CLIENT_ID_Foursquare = '?client_id=LLZ2Y4XNAN2TO4UN4BOT4YCC3GVPMSG5BVI545HG1ZEMBDRM';
				var CLIENT_SECRET_Foursquare = '&client_secret=0UTHYFC5UAFI5FQEXVAB5WIQREZCLCANHT3LU2FA2O05GW3D';

	/*Foursquare api ajax request*/
						$.ajax({
								type: "GET",
								dataType: 'json',
								cache: false,
								url: 'https://api.foursquare.com/v2/venues/' + location.id + CLIENT_ID_Foursquare + CLIENT_SECRET_Foursquare + '&v=20130815',
								async: true,
								success: function(data) {
										console.log(data.response);
										console.log(data.response.venue.name);
										console.log(data.response.venue.location.formattedAddress);
					//Map info windows to each Location in the markers array
								var infoWindow = new google.maps.InfoWindow({
										content: contentString({title: data.response.venue.name, formattedAddress: data.response.venue.location.formattedAddress})
												});

								location.infoWindow = infoWindow;

								location.marker.addListener('click', function () {
										if (currentInfoWindow !== undefined) {
												currentInfoWindow.close();
										}
										currentInfoWindow = location.infoWindow;
										location.infoWindow.open(map, this);
										// location.infoWindow.setContent(contentString(location));
										location.marker.setAnimation(google.maps.Animation.BOUNCE); //Markers will bounce when clicked
										setTimeout(function () {
												location.marker.setAnimation(null);
										}, 1500); //Change value to null after 1.5 seconds and stop markers from bouncing
								});

										/*callback function if succes - Will add the rating received from foursquare to the content of the info window*/
										if (!data.response) {
												data.response = 'No rating in foursquare';
										}
								},
								error: function(data) {
										/*callback function if error - an alert will be activaded to notify the user of the error*/
										console.log("Could not load data from foursquare!");
								}
						});
	});

	//Click on Location in list view
	self.listViewClick = function(location) {
		if (location.name) {
			map.setZoom(15); //Zoom map view
			map.panTo(location.position); // Pans the map view to selected marker when list view Location is clicked
			location.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounces marker when list view Location is clicked
			 if (currentInfoWindow !== undefined) {
								currentInfoWindow.close();
						}
						currentInfoWindow = location.infoWindow;
						currentInfoWindow.open(map, location.marker); // Opens an info window on correct marker when list Location is clicked
		}
		setTimeout(function() {
			location.marker.setAnimation(null); // End animation on marker after 1.5 seconds
		}, 1500);
	};

	// Stores user input
	self.query = ko.observable('');

//Filter through observableArray and filter results using knockouts utils.arrayFilter();
self.search = ko.computed(function () {
	return ko.utils.arrayFilter(self.Locations(), function (listResult) {
	var result = listResult.name.toLowerCase().indexOf(self.query().toLowerCase());

//If-else statement used to display markers only if they meet search criteria in search bar
	if (result === -1) {
		listResult.marker.setVisible(false);
		} else {
		listResult.marker.setVisible(true);
		}
		return result >= 0;
		});
	});
}