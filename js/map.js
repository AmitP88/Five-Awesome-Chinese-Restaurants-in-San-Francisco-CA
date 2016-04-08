/////*MODEL*/////

//Locations for the markers on the map
var location = [
	{
    "title": "Capital Restaurant",
    "lat": 37.793945,
    "lng": -122.407079
    },
    {
    "title": "Shangri-Li Chinese Vegetarian",
    "lat": 37.763695,
    "lng": -122.479830
    },
    {
    "title": "Riverside Seafood Restaurant",
    "lat": 37.738948,
    "lng": -122.479902
    },
    {
    "title": "City View Restaurant",
    "lat": 37.794188,
    "lng": -122.404117
    },
    {
    "title": "Five Happiness",
    "lat": 37.781281,
    "lng": -122.463974
    }
];

////*MAP*////

//Renders Map on screen
function initMap()
{
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.7749, lng: -122.4194},
        zoom: 12
    });

//A forEach fucntion that uses LocationData to generate multiple markers on the map

location.forEach(function(location)) {
    var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: location.lat + location.lng,
            title: location.title
        });
    };
};
//        marker.addListener('click', toggleBounce);
//Bounce animation for when the user clicks on a marker
//function toggleBounce() {
//  var self = this;
//  if (this.getAnimation() !== null) {
//    this.setAnimation(null);
//  } else {
//        this.setAnimation(google.maps.Animation.BOUNCE);
//        setTimeout(function() {
//            self.setAnimation(null)
//        }, 1000);
//    }
//};



//An event listener to display an info window when the user clicks on a marker
//        google.maps.event.addListener(marker, 'click', function() {
//            infowindow.setContent(this.title);
//            infowindow.open(map, this);
//        });

//}
//    map.fitBounds(bounds);
//}

google.maps.event.addDomListener(window, 'load', initMap);
