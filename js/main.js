////*Model*////

//Identify place information in an array
var markers = [
{
  "title": 'Capital Restaurant',
  "lat": '37.793945',
  "lng": '-122.407079',
  "description": 'Capital Restaurant'
},
{
  "title": 'Shangri-Li Chinese Vegetarian',
  "lat": '37.763695',
  "lng": '-122.479830',
  "description": 'Shangri-Li Chinese Vegetarian'
},
{
  "title": 'Riverside Seafood Restaurant',
  "lat": '37.738948',
  "lng": '-122.479902',
  "description": 'Riverside Seafood Restaurant'
},
{
  "title": 'City View Restaurant',
  "lat": '37.794188',
  "lng": '-122.404117',
  "description": 'City View Restaurant'
},
{
  "title": 'Five Happiness',
  "lat": '37.781281',
  "lng": '-122.463974',
  "description": 'Five Happiness'
}
];

//Renders Map on screen

function LoadMap() {
  var mapOptions = {
    center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  };

window.onload = function() {
  LoadMap();
};

//Object for creating new locations
var Place = function (data) {
  this.title = ko.observable(data.title);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.description = ko.observable(data.description);
};

////*View Model*////

//Object creating the ViewModel
var ViewModel = function (){
  var self = this;

  //creates array for the locations to be held
  this.PlaceList = ko.observableArray([]);

  //pushes the initial locations into the location list array as new Location objects
  markers.forEach(function(markerItem){
    self.PlaceList.push(new Place(markerItem));
  });

  //sets the current location to the first location in the locationList array
  this.currentPlace = ko.observable(this.PlaceList()[0]);

  //sets the current location to the location clicked and binds markers to location click
  this.setLocation = function (clickedLocation){
    self.currentLocation(clickedLocation);
    google.maps.event.trigger(clickedLocation.marker, 'click');
  };
};


//Renders Search Bar with Autocomplete feature on screen
  var acOptions = {
    types: ['establishment']
};
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),acOptions);
  autocomplete.bindTo('bounds',map);

//Creates Infowindow object for Markers
  var infoWindow = new google.maps.InfoWindow();

//Create observable array for markers
  //self.markerArray = ko.observableArray(markers);

//Creates multiple Markers
  for (var i=0; i < markers.length; i++) {
    var data = markers[i];
    var myLatlng = new google.maps.LatLng(data.lat, data.lng);
    var marker = new google.maps.Marker({
      position: myLatlng,
      setMap: map,
      title: data.title,
      animation: google.maps.Animation.DROP
    });
  };

    //Attach click event to the marker.
    (function (marker, data) {
      google.maps.event.addListener(marker, "click", function (e) {
        //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
          infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.description + "</div>");
            infoWindow.open(map, marker);
                });
            })(marker, data);

    //Creates event listener to resize the map and remain centered in response to a window resize
      google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
  });

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        infoWindow.close();
        var place = autocomplete.getPlace();
        if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
        } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
        };


  //Adds Info windows to markers
  marker.setPosition(place.geometry.location);
  infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
  infoWindow.open(map, marker);
  google.maps.event.addListener(marker,'click',function(e){
    infoWindow.open(map, marker);
  });
});