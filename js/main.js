
var map = new L.Map("map", {
    center: [38.04,-84.54],
    zoom: 12
});

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(layer);

$.getJSON('https://lfgreenfield.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM canopydata_cd_use', function(data) {
    mapData(data);
});


var currentAttribute = 'treeCanopyKey',
    currentView = 'current',
    dataLayer;

var allData = {
    treeCanopyKey : {
        current : 'canopy_percent',
        goal : 'goalcanopypercen',
        descrip : 'percent of canopy cover',
        lowColor: '#e5f5e0',
        highColor: '#006d2c'
    },
    propertyKey : {
        current : 'propvalmillcontribute',
        goal : 'goalpropvalmillcontribute',
        descrip : 'millions of $ contributed to property values, annually',
        lowColor: '#fee391',
        highColor: '#993404'
    },
    pollutantsKey: {
        current: 'airqualitylbspollutants',
        goal: 'goalairqualitylbspollutants',
        descrip : 'lbs of pollutants removed from air, annually',
        lowColor: '#fa9fb5',
        highColor: '#49006a'
    },
    stormwaterKey: {
        current: 'runoffmillgallsreduced',
        goal: 'goalrunoffmillgallsreduced',
        descrip : 'millions of gallons of runoff water reduced, annually',
        lowColor: '#a6bddb',
        highColor: '#016c59'
    },
    carbonKey: {
        current: 'carbonstoredsequesttonsannually',
        goal: 'goalcarbonstoredsequesttonsannually',
        descrip: 'tons of carbon stored and sequestered, annually',
        lowColor: '#bdbdbd',
        highColor: '#525252'
    }
}

//console.log(allData[currentAttribute].descrip);

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
    
    

    buildUI();
    createPopup();
    drawLegend();
    colorize();

}

function colorize() {
   
    var values = getValues(dataLayer);
   
    dataLayer.eachLayer(function(l) {
        
       l.setStyle({
           fillColor: getColor(l.feature.properties[allData[currentAttribute][currentView]], values),
           fillOpacity: .8
       }) 
    });
    
    updateLegend(values);
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

  
    var s = d3.scale.log();
    s.domain([values[0],values[values.length-1]]);
    s.range([allData[currentAttribute].lowColor,allData[currentAttribute].highColor]);
    
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
    
    $('button').on('click', function() {
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

        var div = L.DomUtil.get('legend');

        return div;
    };

    legend.addTo(map);
    
}

function updateLegend(values) {

    var s = d3.scale.log();
    s.domain([values[0],values[values.length-1]]);
    s.range([allData[currentAttribute].lowColor,allData[currentAttribute].highColor]);
 
    var legend = $('#legend h3').text(allData[currentAttribute].descrip);
    
    d3.select('#legend svg').append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(0,20)");

    var legendLinear = d3.legend.color()
      .ascending(true)
      .scale(s);

    d3.select(".legendLinear")
      .call(legendLinear);

    }

