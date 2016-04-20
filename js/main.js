var map = new L.Map("map", {
    center: [38.04,-84.50],
    zoom: 12
});

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(layer);

//main map

$.getJSON('https://lfgreenfield.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM lexcouncildistricts_merge', function(data) {
    mapData(data);
});

var currentAttribute = 'treeCanopyKey',
    currentView = 'current',
    dataLayer;

var allData = {
    treeCanopyKey : {
        current : 'canopy_percent',
        goal : 'cdcalcs_goalcanopyacrespercent'
    },
    propertyKey : {
        current : 'cdcalcs_propvalmillcontribute',
        goal : 'cdcalcs_goalpovvalmillcontribute'
    }
}

// goal for property cdcalcs_goalpovvalmillcontribute

function mapData(data) {
    
    dataLayer = L.geoJson(data, {
        style : function(l) {
            return {
                fillColor: 'green',
                opacity: 1,
                fillOpacity: 1,
                width: 1,
                color: 'white'
            }
        }
    }).addTo(map);
    
    
    colorize();
    buildUI();
}

function colorize() {
   
    var values = getValues(dataLayer);
    console.log(values);
    dataLayer.eachLayer(function(l) {
        
       l.setStyle({
           fillColor: getColor(l.feature.properties[allData[currentAttribute][currentView]], values),
           fillOpacity: .8
       }) 
    });
}

function getValues(layers) {
    
    var values = [];
    layers.eachLayer(function(l) {
       values.push(Number(l.feature.properties[allData[currentAttribute][currentView]]));
    });
    return values.sort(function(a,b) {
        return a - b;  
    }); 
}
    
function getColor(v, values) {
 
    if(currentAttribute == 'treeCanopyKey') {
        var lowColor = '#e5f5e0',
            highColor = '#006d2c'
    } else if (currentAttribute == 'propertyKey') {
     
        var lowColor = '#fee391',
            highColor = '#993404'
    }
    
    var s = d3.scale.linear();
    s.domain([values[0],values[values.length-1]]);
    s.range([lowColor,highColor])
    return s(v);
    
}

function highlightDistrict(disNum) {
    
    dataLayer.eachLayer(function(layer) {
        if(disNum === "District"+layer.feature.properties.district) {
            layer.setStyle({
                color: 'yellow'
            });
            layer.bringToFront();
        } else {
            layer.setStyle({
                color: 'white'
            })
        }
    });
}
        
function dehighlightDistrict() {
     dataLayer.eachLayer(function(layer) {
         layer.setStyle({
                color: 'white'
            });
     });
         
}

function buildUI() {
    $("#charts label").on('click', function() {
        currentAttribute = $(this).attr('data-key');
        colorize();
        showInfo();
    });
    
    $('nav li').on('click', function() {
        currentView = $(this).attr('id');
        
        colorize();
    });
}
function showInfo() {
    $('.description').fadeOut('slow', function() {
        $('.'+currentAttribute).fadeIn();
    });
    
}

