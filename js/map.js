/////*MODEL*/////

//Locations for the markers on the map
var locations = [
	{
    name: "Capital Restaurant",
    position: {
        lat: 37.793945,
        lng: -122.407079
        }
    },
    {
    name: "Shangri-Li Chinese Vegetarian",
    position: {
        lat: 37.763695,
        lng: -122.479830
        }
    },
    {
    name: "Riverside Seafood Restaurant",
    position: {
        lat: 37.738948,
        lng: -122.479902
        }
    },
    {
    name: "City View Restaurant",
    position: {
        lat: 37.794188,
        lng: -122.404117
        }
    },
    {
    name: "Five Happiness",
    position: {
        lat: 37.781281,
        lng: -122.463974
        }
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

locations.forEach(function(locations) {
    var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: locations.position,
            title: locations.name
        });
    location.markerData = marker;
    });
         marker.addListener('click', toggleBounce);
//Bounce animation for when the user clicks on a marker
function toggleBounce() {
  var self = this;
  if (this.getAnimation() !== null) {
    this.setAnimation(null);
  } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.setAnimation(null)
                    }, 1000);
    }
};

//An event listener to display an info window when the user clicks on a marker
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.title);
            infowindow.open(map, this);
        });

    map.fitBounds(bounds);
};