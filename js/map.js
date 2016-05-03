/////*MODEL*/////
var initialLocations = [
    {name: "Capital Restaurant", position: {lat: 37.793945, lng: -122.407079}},
    {name: "Shangri-Li Chinese Vegetarian", position: {lat: 37.763695, lng: -122.479830}},
    {name: "Riverside Seafood Restaurant", position: {lat: 37.738948, lng: -122.479902}},
    {name: "City View Restaurant", position: {lat: 37.794188, lng: -122.404117}},
    {name: "Five Happiness", position: {lat: 37.781281, lng: -122.463974}}
];

//Variable for infowindow content
var content = "(Insert Yelp! API info here)";

//Declared map, marker, and infoWindow variables to be used later downstream

var map;

var infoWindow;

//Function that renders the map on screen using the Id "map" as a reference
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 37.7749, lng: -122.4194},
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
};

/////*VIEWMODEL*/////
function ViewModel() {

  // tells the view model what to do when a change occurs
  function restaurantLocation(name, position) {

  var marker;

  this.name = ko.observable(value.name);
  this.position = ko.observable(value.lat);
  };

  var self = this;
  self.markers = [];

  //Copies the values of initialLocations and stores them in sortedLocations(); observableArray
  self.sortedLocations = ko.observableArray(initialLocations);

  //Adds new markers at each location in the initialLocations Array
  self.sortedLocations().forEach(function(location) {
    marker = new google.maps.Marker({
      position: location.position,
      map: map,
      title: location.name,
      icon: 'http://icons.iconarchive.com/icons/pixture/box-container/32/Chinese-icon.png',
      animation: google.maps.Animation.DROP
    });

    location.marker = marker;

  //Pushes each marker into the markers array
    this.markers.push(marker);
  });

  //Map info windows to each item in the markers array
  self.markers.map(function(info) {
    infoWindow = new google.maps.InfoWindow({
      content: content
    });
    //Add click event to each marker to open info window
    info.addListener('click', function() {
      infoWindow.open(map, this),
        info.setAnimation(google.maps.Animation.BOUNCE) //Markers will bounce when clicked
      setTimeout(function() {
        info.setAnimation(null)
      }, 2000); //Change value to null after 2 seconds and stop markers from bouncing
    });

  });

  //Click on item in list view
  self.listViewClick = function(restaurant) {
    if (restaurant.name) {
      map.setZoom(15); //Zoom map view
      map.panTo(restaurant.position); // Pan to correct marker when list view item is clicked
      restaurant.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounce marker when list view item is clicked
      infoWindow.open(map, restaurant.marker); // Open info window on correct marker when list item is clicked
    }
    setTimeout(function() {
      restaurant.marker.setAnimation(null); // End animation on marker after 2 seconds
    }, 2000);
  };

  // Stores user input
  self.query = ko.observable('');

  //Filter through observableArray and filter results using knockouts utils.arrayFilter();
  self.search = ko.computed(function() {
    return ko.utils.arrayFilter(self.sortedLocations(), function(listResult) {
      return listResult.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
  });
};

$(document).ready(function() {
  initMap();
  ko.applyBindings(ViewModel());
});