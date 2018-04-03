// initialize the variables we need
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'
var my_map; // this will hold the map
var my_map_options; // this will hold the options we'll use to create the map
var my_center = new google.maps.LatLng(51.512344, -0.090985); // center of map
var my_markers = [];
// we use this in the main loop below to hold the markers
// this one is strange.  In google maps, there is usually only one
// infowindow object -- its content and position change when you click on a
// marker.  This is counterintuitive, but we need to live with it.
var infowindow = new google.maps.InfoWindow({content: ""});
var legendHTML = "<h1>Legend</h1>";

// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers
var blueURL = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
var redURL = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
var red_markers = [];
var blue_markers = [];

// this is for fun, if you want it.  With this powerful feature you can add arbitrary
// data layers to your map.  It's cool. Learn more at:
// https://developers.google.com/maps/documentation/javascript/datalayer#load_geojson
var myGeoJSON= {
  "type":"FeatureCollection",
  "features":
  [{"type":"Feature",
    "properties":{myColor: 'red'},
    "myColor" : "red",
    "geometry":{"type":"Polygon",
                "coordinates":[[[-85.60546875,49.03786794532644],[-96.6796875,40.713955826286046],
                                [-79.62890625,37.71859032558816],[-81.2109375,49.26780455063753],
                                [-85.60546875,49.03786794532644]]]}},

   {"type":"Feature",
    "properties":{myColor: 'green'},
    "myColor" : "green",
     "geometry":{"type":"Polygon",
                 "coordinates":[[[-113.203125,58.35563036280967],[-114.78515624999999,51.944264879028765],
                                 [-101.6015625,51.944264879028765],[-112.32421875,58.263287052486035],
                                 [-113.203125,58.35563036280967]]]
                }}]};


/* a function that will run when the page loads.  It creates the map
 and the initial marker.  If you want to create more markers, do it here. */
function initializeMap() {
    my_map_options = {
        center:  my_center, // to change this value, change my_center above
        zoom: 12,  // higher is closer-up
        mapTypeId: google.maps.MapTypeId.HYBRID // you can also use TERRAIN, STREETMAP, SATELLITE
    };

    // this one line creates the actual map
    my_map = new google.maps.Map(document.getElementById("map_canvas"),
                                 my_map_options);
    // this is an *array* that holds all the marker info
    var all_my_markers =
            [{position: new google.maps.LatLng(51.498802,-0.118350),
              map: my_map,
              icon: blueURL, // this sets the image that represents the marker in the map to the one
                             // located at the URL which is given by the variable blueURL, see above
              title: "St. Thomas's Hospital",
              window_content: "<h1>St. Thomas's Hopsital</h1><br><p><img src=\'https://i.pinimg.com/originals/aa/92/9a/aa929ac63db2167d353fbe5e25b06046.jpg'</p><p> Initially dissolved in 1539, due to King Henry VIII's Act of Supremacy that confescated all church property, separating church and state. Founded in 1100 and reinstated in 1551. </p>"
             },
             {position: new google.maps.LatLng(51.516763,-0.098675),
              map: my_map,
              icon: blueURL, // this sets the image that represents the marker in the map
              title: "St. Bartholomew's Hospital",
              window_content: "<h1>St. Bartholemew's Hospital</h1><br><p><img src=\'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/StBart.jpg/250px-StBart.jpg'</p><p>One of the latter Royal Hospitals, located just North of the City's borders, here there began an emphasis on gardens, and outdoor space for patients. Founded in 1123, and was refounded in 1546 by King Henry I, a plague year.</p>"
            },
            {position: new google.maps.LatLng(51.380922,-0.028995),
             map: my_map,
             icon: blueURL, // this sets the image that represents the marker in the map
             title: "Bethlem Hospital",
             window_content: "<h1>Bethlem Hospital</h1><br><p><img src= \'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Most_of_Bethlehem_Hospital_by_William_Henry_Toms_for_William_Maitland%27s_History_of_London%2C_published_1739.jpg/220px-Most_of_Bethlehem_Hospital_by_William_Henry_Toms_for_William_Maitland%27s_History_of_London%2C_published_1739.jpg'></p><p>Known as 'Bedlam' Hospital during the time, one of the only hospitals in London to treat syphilis patients during the 16th and 17th Century. Founded in 1247 and in 1337 as a hospital, Bedlam was one of the first Royal Hopsitals reinstated after the dissolution of the Monasteries, in 1546.</p>"
           },
           {position: new google.maps.LatLng(51.544976,-0.116053),
             map: my_map,
             icon: blueURL, // this sets the image that represents the marker in the map to the one
                            // located at the URL which is given by the variable blueURL, see above
             title: "BrideWell Hospital and Prison",
             window_content: "<h1>BrideWell</h1><br><p><img src=\'https://www.londonlives.org/static/images/ProspectofBridewell.jpg'</p> <p> Both hospital and prison, solidified ideas of illness and evil and punishment for criminality or 'loose morals,' BridwWell is a testiment to the period's mentality on illness. Bridewell was established in a former Royal Palace in London in 1553.</p>"
            },
            {position: new google.maps.LatLng(51.512344, -0.090985),
              map: my_map,
              icon: redURL, // this sets the image that represents the marker in the map to the one
                             // located at the URL which is given by the variable blueURL, see above
              title: "City of London",
              window_content: "<h1>London Center 16th Century</h1><br><p><img src=\'https://www.uni-due.de/SHE/LondonTudor.JPG'</p><p> What is now known as the City of London, this area used to be the focal point of London, until the end of the 17th century when emmigration to London grew too much for the city, expanding to include Westminster.</p>"
            }];

    for (j = 0; j < all_my_markers.length; j++) {
        var marker =  new google.maps.Marker({
            position: all_my_markers[j].position,
            map: my_map,
            icon: all_my_markers[j].icon,
            title: all_my_markers[j].title,
            window_content: all_my_markers[j].window_content});

        // this next line is ugly, and you should change it to be prettier.
        // be careful not to introduce syntax errors though.
        //can hide the desc and photos of legend in css
      legendHTML +=
        "<div class=\"pointer\" onclick=\"locateMarker(my_markers[" + j + "])\"> " +
          marker.title + "</div>";
        marker.info = new google.maps.InfoWindow({content: marker.window_content});
        var listener = google.maps.event.addListener(marker, 'click', function() {
            // if you want to allow multiple info windows, uncomment the next line
            // and comment out the two lines that follow it
            //this.info.open(this.map, this);
            infowindow.setContent (this.window_content);
            infowindow.open(my_map, this);
        });
        my_markers.push({marker:marker, listener:listener});
        if (all_my_markers[j].icon == blueURL ) {
            blue_markers.push({marker:marker, listener:listener});
        } else if (all_my_markers[j].icon == redURL ) {
            red_markers.push({marker:marker, listener:listener});
        }

    }
    document.getElementById("map_legend").innerHTML = legendHTML;
  my_map.data.addGeoJson(myGeoJSON);

  var romeCircle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    // in general, we always have to *set the map* when we
    // add features.
    map: my_map,
    center: {"lat": 51.512344, "lng":-0.090985},
    radius: 2000,
    window_content: "<h4>Rough Perimeter of Early Modern London</h4>"
  });
  my_map.data.setStyle(function (feature) {
    var thisColor = feature.getProperty("myColor");
    return {
      fillColor: thisColor,
      strokeColor: thisColor,
      strokeWeight: 5
    };

});
}

// this hides all markers in the array
// passed to it, by attaching them to
// an empty object (instead of a real map)
function hideMarkers (marker_array) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(null);
    }
}
// by contrast, this attaches all the markers to
// a real map object, so they reappear
function showMarkers (marker_array, map) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(map);
    }
}

//global variable to track state of markers

var markersHidden = false;

function toggleMarkers (marker_array, map) {
  for (var j in marker_array) {
    if (markersHidden) {
      marker_array[j].marker.setMap(map);
    } else {
      marker_array[j].marker.setMap(null);
    }
  }
  markersHidden = !markersHidden;
}


// I added this for fun.  It allows you to trigger the infowindow
// from outside the map.
function locateMarker (marker) {
    console.log(marker);
    my_map.panTo(marker.marker.position);
    google.maps.event.trigger(marker.marker, 'click');
}
