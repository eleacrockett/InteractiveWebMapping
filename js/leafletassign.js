// This script demonstrates some simple things one can do with leaflet.js


var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);


// create global variables we can use for layer controls
var subwayLinesGeoJSON;
var neighborhoodsGeoJSON;
var publicschoolsGeoJson; 


// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
// let's add the subway lines
$.getJSON( "geojson/MTA_subway_lines.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var subwayLines = data;

    // style for subway lines
    var subwayStyle = {
        "color": "#a5a5a5",
        "weight": 2,
        "opacity": 0.80
    };

    // function that binds popup data to subway lines
    var subwayClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup(feature.properties.Line);
    }

    // using L.geojson add subway lines to map
    subwayLinesGeoJSON = L.geoJson(subwayLines, {
        style: subwayStyle,
        onEachFeature: subwayClick
    }).addTo(map);

});


// let's add pawn shops data
$.getJSON( "geojson/public_schools.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var publicschools = data;
	
	console.log(publicschools);

    // pawn shop dots
    var publicschoolPointToLayer = function (feature, latlng){
        var publicschoolMarker = L.circle(latlng, 100, {
            stroke: false,
            fillColor: '#54278f',
            fillOpacity: 1
        });
        
        return publicschoolMarker;  
    }

    var publicschoolClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>School:</strong> " + feature.properties.schoolname + "<br /><strong>Principal:</strong> " + feature.properties.principal);
    }

    publicschoolsGeoJSON = L.geoJson(publicschools, {
        pointToLayer: publicschoolPointToLayer,
        onEachFeature: publicschoolClick
    }).addTo(map);


});


// let's add neighborhood data
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;

    console.log(neighborhoods);

    // neighborhood choropleth map
    // let's use % in poverty to color the neighborhood map
    var povertyStyle = function (feature){
        var value = feature.properties.PovertyPer;
        var fillColor = null;
        if(value >= 0 && value <=0.1){
            fillColor = "#006d2c";
        }
        if(value >0.1 && value <=0.15){
            fillColor = "#2ca25f";
        }
        if(value >0.15 && value<=0.2){
            fillColor = "#66c2a4";
        }
        if(value > 0.2 && value <=0.3){
            fillColor = "#99d8c9";
        }
        if(value > 0.3 && value <=0.4) { 
            fillColor = "#ccece6";
        }
        if(value > 0.4) { 
            fillColor = "#edf8fb";
        }

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.5,
            fillColor: fillColor
        };

        return style;
    }

    var povertyClick = function (feature, layer) {
        var percent = feature.properties.PovertyPer * 100;
        percent = percent.toFixed(0);
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Percent in Poverty: </strong>" + percent + "%");
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: povertyStyle,
        onEachFeature: povertyClick
    }).addTo(map);


    // create layer controls
    createLayerControls(); 

});


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
    };

    var overlayMaps = {
        "Public Schools": publicschoolsGeoJSON,
        "Subway Lines": subwayLinesGeoJSON,
        "Povery Map": neighborhoodsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}







