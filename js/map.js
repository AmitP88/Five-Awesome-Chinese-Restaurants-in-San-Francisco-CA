/////*MODEL*/////
var Locations = [
    {name: "Capital Restaurant", position: {lat: 37.793945, lng: -122.407079}},
    {name: "Shangri-Li Chinese Vegetarian", position: {lat: 37.763695, lng: -122.479830}},
    {name: "Riverside Seafood Restaurant", position: {lat: 37.738948, lng: -122.479902}},
    {name: "City View Restaurant", position: {lat: 37.794188, lng: -122.404117}},
    {name: "Five Happiness", position: {lat: 37.781281, lng: -122.463974}}
];

//Variable for infowindow content
var content = "(Insert Yelp! API info here)";

//Declared map and infoWindow variables early to be used later downstream

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
      title: location.name,
      icon: 'http://icons.iconarchive.com/icons/pixture/box-container/32/Chinese-icon.png',
      animation: google.maps.Animation.DROP
    });

    location.marker = marker;

    marker.setVisible(true);

  //Pushes each marker into the markers array
    self.markers.push(marker);
  });

  //Map info windows to each item in the markers array
  self.markers.map(function(info) {
     infoWindow = new google.maps.InfoWindow({
      content: content
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

  //Click on item in list view
  self.listViewClick = function(location) {
    if (location.name) {
      map.setZoom(15); //Zoom map view
      map.panTo(location.position); // Pans the map view to selected marker when list view item is clicked
      location.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounces marker when list view item is clicked
      infoWindow.open(map, location.marker); // Opens an info window on correct marker when list item is clicked
    }
    setTimeout(function() {
      location.marker.setAnimation(null); // End animation on marker after 1.5 seconds
    }, 1500);
  };

  // Stores user input
  self.query = ko.observable('');

  //Filter through observableArray and filter results using knockouts utils.arrayFilter();
self.search = ko.computed (function () {
    var query = self.query().toLowerCase();
     return ko.utilis.arrayFilter(self.Locations(),function(listResult) {

     var result = listResult.name.toLowerCase().indexOf(query);

     if (result!== listResult.name.toLowerCase().indexOf(query))
     { return listResult.marker.setVisible(false); } else {
       return listResult.marker.setVisible(true);
     }
   });
 });
}