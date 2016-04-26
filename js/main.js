
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

console.log(allData[currentAttribute].descrip);

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
//    drawLegend();
//    updateLegend();
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
    s.range([lowColor,highColor]);
//    console.log(s(v));
    
    //updateLegend(s(v));
    
    
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
        var description = allData[currentAttribute].descrip;
//        console.log(description);
        
        //current and goal vals displayed
        
//        var currentVal= layer.feature.properties[allData[currentAttribute].current];
//        var goalVal = layer.feature.properties[allData[currentAttribute].goal];
//    
//        layer.bindPopup("<b>"+"District "+props.district+"</b><br>"+ description+ "<br>"+ "current: " + currentVal+"<br>"+ "goal: "+ goalVal);
        
        //just [currentView] vals shown
        
        var value = layer.feature.properties[allData[currentAttribute][currentView]];
//    
//        layer.bindPopup("<b>"+"District "+props.district+"</b><br>"+ description + "<br>"+ currentView + " value: " + value);
        
        //hover 
        
        //layer.bindPopup("<b>"+"District "+props.district+"</b><br>"+ description+ "<br>"+ currentView + " value: " + value);
        
        var infoWindow = $('#hover-window');
        layer.on('mouseover', function (e) {
            var props = this.feature.properties,
                value = this.feature.properties[allData[currentAttribute][currentView]];
      
            infoWindow.show();
            infoWindow.html("<b>"+"District "+props.district+"</b><br>"+ description+ "<br>"+ currentView + " value: " + value);
            $(document).mousemove(function(e){
                // first offset from the mouse position of the info window
                infoWindow.css({"left": e.pageX + 6, "top": e.pageY - infoWindow.height() - 15}); 

                // if it crashes into the top, flip it lower right
                if(infoWindow.offset().top < 4) {
                    infoWindow.css({"top": e.pageY + 15});
                }
                // do the same for crashing into the right
                if(infoWindow.offset().left + infoWindow.width() >= $(document).width() - 40) {
                    infoWindow.css({"left": e.pageX - infoWindow.width() - 30});
                }
            });
        });
        layer.on('mouseout', function(e) {
             infoWindow.hide();
        });
    });
}

function drawLegend() {

    //set control position
    var legend = L.control({position: 'topright'});

    //cues for when legend is adding to map: div created
    legend.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'legend');

        return div;
    };

    legend.addTo(map);
}

function updateLegend(scale) {
    
    var legend = $('.legend').html("<h3>" + allData[currentAttribute].descrip +  "</h3><ul>");
    console.log(scale[0][4]);
    
    for (var i in scale) {

        //append=populating legend
        legend.append('<li><span style="background:' + i + '"></span> ' +'</li>');
//        legend.append('<li><span style="background:' + color + '"></span> ' +
//                    (scale[i]).toLocaleString() + ' &mdash; ' +
//                      (scale[i+1]).toLocaleString() + "%" + '</li>');
    }

    legend.append("</ul>");
    
}

