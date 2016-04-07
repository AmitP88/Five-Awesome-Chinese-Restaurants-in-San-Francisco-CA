////*MAP*////

//Renders Map on screen
function initMap()
{
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.397, lng: 150.644},
        zoom: 8
    });
};
//A forEach fucntion that uses LocationData to generate multiple markers on the map
//LocationData.forEach(function(location)) {
//    new google.maps(location.title, location.lat, location.lng);

//        var marker = new google.maps.Marker({
//            map: map,
//            draggable: true,
//            animation: google.maps.Animation.DROP,
//            position: "lat" + "," + "lng",
//            title: p[0]
//        });
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
//    }
//}
//    map.fitBounds(bounds);
//}

//google.maps.event.addDomListener(window, 'load', initialize);