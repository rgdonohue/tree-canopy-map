
var map = new L.Map("map", {
    center: [38.04,-84.50],
    zoom: 12
});

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(layer);

//main map

//$.getJSON('https://lfgreenfield.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM lexcouncildistricts_merge', function(data) {
//    mapData(data);
//});

$.getJSON('https://lfgreenfield.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM canopydata_cd_use', function(data) {
    mapData(data);
    console.log(data);
});


var currentAttribute = 'treeCanopyKey',
    currentView = 'current',
    dataLayer;

var allData = {
    treeCanopyKey : {
        current : 'canopy_percent',
        goal : 'goalcanopypercen',
        descrip : 'percent of canopy cover'
    },
    propertyKey : {
        current : 'propvalmillcontribute',
        goal : 'goalpropvalmillcontribute',
        descrip : 'millions of $ contributed to property values, annually'
    },
    pollutantsKey: {
        current: 'airqualitylbspollutants',
        goal: 'goalairqualitylbspollutants',
        descrip : 'lbs of pollutants removed from air, annually'
    },
    stormwaterKey: {
        current: 'runoffmillgallsreduced',
        goal: 'goalrunoffmillgallsreduced',
        descrip : 'millions of gallons of runoff water reduced, annually'
    },
    carbonKey: {
        current: 'carbonstoredsequesttonsannually',
        goal: 'goalcarbonstoredsequesttonsannually',
        descrip: 'tons of carbon stored and sequestered, annually'
    }
}

console.log(allData.treeCanopyKey.descrip);

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
    createPopup();
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
    } else if (currentAttribute == 'pollutantsKey') {
        var lowColor = '#fa9fb5',
            highColor = '#49006a'
    } else if (currentAttribute == 'stormwaterKey') {
        var lowColor = '#a6bddb',
            highColor = '#016c59'
    } else if (currentAttribute == 'carbonKey') {
        var lowColor = '#bdbdbd',
            highColor = '#525252'
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
        createPopup();
    });
    
    $('nav li').on('click', function() {
        currentView = $(this).attr('id');
        
        colorize();
        createPopup();
    });
}
function showInfo() {
    $('.description').fadeOut('slow', function() {
        $('.'+currentAttribute).fadeIn();
    });
    
}

function createPopup() {
    dataLayer.eachLayer(function(layer){
        var props = layer.feature.properties
        
        //current and goal vals displayed
//        var currentVal= layer.feature.properties[allData[currentAttribute].current];
//        var goalVal = layer.feature.properties[allData[currentAttribute].goal];
//    
//        layer.bindPopup("<b>"+"District "+props.district+"</b><br>"+ "current: " + currentVal+"<br>"+ "goal: "+ goalVal);
        
        //just [currentView] vals shown
        var value = layer.feature.properties[allData[currentAttribute][currentView]];
    
        layer.bindPopup("<b>"+"District "+props.district+"</b><br>"+ currentView + " value: " + value);
        
        //hover 
//        layer.bindPopup("<b>"+"District "+props.district+"</b><br>"+ currentView + " value: " + value);
//        layer.on('mouseover', function (e) {
//            this.openPopup();
//        });
//        layer.on('mouseout', function (e) {
//            this.closePopup();
//        });

    });
}

