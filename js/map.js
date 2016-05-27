/////*Model*/////
var Locations = [
    {name: "Capital Restaurant", position: {lat: 37.793945, lng: -122.407079}},
    {name: "Shangri-Li Chinese Vegetarian", position: {lat: 37.763695, lng: -122.479830}},
    {name: "Riverside Seafood Restaurant", position: {lat: 37.738948, lng: -122.479902}},
    {name: "City View Restaurant", position: {lat: 37.794188, lng: -122.404117}},
    {name: "Five Happiness", position: {lat: 37.781281, lng: -122.463974}}
];

//Declared map and infoWindow variables early to be used later downstream

var contentString;

var map;

var infoWindow;

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

/////*VIEWLocations*/////
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
      description: location.description,
      URL: location.URL,
      rating: location.rating,
      icon: 'http://icons.iconarchive.com/icons/pixture/box-container/32/Chinese-icon.png',
      animation: google.maps.Animation.DROP
    });

    location.marker = marker;

    marker.setVisible(true);

  //Pushes each marker into the markers array
    self.markers.push(marker);

      /*client id and client secret for foursquare api*/
        var CLIENT_ID_Foursquare = 'LLZ2Y4XNAN2TO4UN4BOT4YCC3GVPMSG5BVI545HG1ZEMBDRM';
        var CLIENT_SECRET_Foursquare = '0UTHYFC5UAFI5FQEXVAB5WIQREZCLCANHT3LU2FA2O05GW3D';
        
  /*Foursquare api ajax request*/
            $.ajax({
                type: "GET",
                dataType: 'json',
                cache: false,
                url: 'https://api.foursquare.com/v2/venues/explore',
                data: 'limit=1&ll=' + location.lat + ',' + location.lng + '&query=' + location.title + '&client_id=' + CLIENT_ID_Foursquare + '&client_secret=' + CLIENT_SECRET_Foursquare + '&v=20140806&m=foursquare',
                async: true,
                success: function(data) {
                    console.log(data.response);                    
                    /*callback function if succes - Will add the rating received from foursquare to the content of the info window*/
                    location.rating = data.response.groups[0].locations[0].venue.rating;
                    console.log(data.response.photo);                 
                    if (!location.rating) {
                        location.rating = 'No rating in foursquare';
                    }
                    marker.content = '<br><div class="labels">' + '<div class="title">' + location.title + '</div><div class="rating">Foursquare rating: ' + location.rating + '</div><p>' + location.description + '</p>' + '<a href=' + location.URL + '>' + location.URL + '</a>' + '</div>';
               
                },
                error: function(data) {
                    /*callback function if error - an alert will be activaded to notify the user of the error*/
                    console.log("Could not load data from foursquare!");
                }
            });
  });



  //Map info windows to each Location in the markers array
  self.markers.map(function(info) {
     infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    //Add click event to each marker to open info window
    info.addListener('click', function() {
      infoWindow.open(map, this);
      info.setAnimation(google.maps.Animation.BOUNCE); //Markers will bounce when clicked
      setTimeout(function() {
        info.setAnimation(null);
        }, 1500); //Change value to null after 1.5 seconds and stop markers from bouncing
    });
  });

  //Click on Location in list view
  self.listViewClick = function(location) {
    if (location.name) {
      map.setZoom(15); //Zoom map view
      map.panTo(location.position); // Pans the map view to selected marker when list view Location is clicked
      location.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounces marker when list view Location is clicked
      infoWindow.open(map, location.marker); // Opens an info window on correct marker when list Location is clicked
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