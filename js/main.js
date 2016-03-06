/////*MODEL*/////

//Locations for the markers on the map
var LocationData = [
	[37.793945, -122.407079, "Capital Restaurant"],
	[37.763695, -122.479830, "Shangri-Li Chinese Vegetarian"],
	[37.738948, -122.479902, "Riverside Seafood Restaurant"],
	[37.794188, -122.404117, "City View Restaurant"],
	[37.781281, -122.463974, "Five Happiness"]
];

/////*VIEWMODEL*/////

//Renders Map on screen
function initialize()
{
    var map =
        new google.maps.Map(document.getElementById('map-canvas'));
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();

//A for loop that uses LocationData to generate multiple markers on the map
    for (var i in LocationData)
    {
        var p = LocationData[i];
        var latlng = new google.maps.LatLng(p[0], p[1]);
        bounds.extend(latlng);

        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: latlng,
            title: p[2]
        });
        marker.addListener('click', toggleBounce);
//Bounce animation for when the user clicks on a marker
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

//An event listener to display an info window when the user clicks on a marker
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.title);
            infowindow.open(map, this);
        });
    }

    map.fitBounds(bounds);
}

google.maps.event.addDomListener(window, 'load', initialize);