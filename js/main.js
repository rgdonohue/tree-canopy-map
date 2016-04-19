var map = new L.Map("map", {
    center: [38.04,-84.50],
    zoom: 12
});

var chartStyles = {
    barStrokeWidth : 5,
    barValueSpacing : 3,
    barShowStroke : false,
    scaleShowGridLines : false, 
    showScale : false
}

var carbonContext = document.getElementById("carbon").getContext("2d");
var propvalsContext = document.getElementById("prop-vals").getContext("2d");
var pollutantsContext = document.getElementById("pollutants").getContext("2d");
var stormwaterContext = document.getElementById("stormwater").getContext("2d");

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(layer);

$.getJSON('https://lfgreenfield.cartodb.com/api/v2/sql?format=JSON&q=SELECT * FROM lexcouncildistricts_merge', function(data) {
  
    data.rows.sort(function(a,b) {
     
      return a.district - b.district;
    
    })
    
    console.log(data);
    
    buildCarbonChart(data);
    buildPropChart(data);
    buildPollutantsChart(data);
    buildStormwaterChart(data);
    
});
   
//   carbon chart
function buildCarbonChart(dataObject) {

    var currentData = [],
           goalData = [],
           labels = [];

    dataObject.rows.forEach(function(d,i) {
           labels.push("District"+d.district);
           currentData.push(Number(d.cdcalcs_carbonstoredsequesttonsannually));
           goalData.push(Number(d.cdcalcs_goalcarbonstoredsequesttonsannually));
    });

    var data = {
        labels: labels,
        datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(183, 203, 255, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(183, 203, 255, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: currentData
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(220,220,220, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: goalData
                }
            ]
        };
    
    var carbonChart = new Chart(carbonContext).Bar(data, chartStyles);
    
    $('#carbon').on('mousemove', function(e){
            try {
                var activeBar = carbonChart.getBarsAtEvent(e);
                console.log(activeBar);
                highlightDistrict(activeBar[0].label);
            } 
            catch(e) {
                console.log(e);

            }
        });
    $('#carbon').on('mouseout', function(e){ 
            dehighlightDistrict();
        });

}

//prop vals chart 
function buildPropChart(dataObject) {
    
    console.log("here");

    var currentData = [],
           goalData = [],
           labels = [];

    dataObject.rows.forEach(function(d,i) {
           labels.push("District"+d.district);
           currentData.push(Number(d.cdcalcs_propvalmillcontribute));
           goalData.push(Number(d.cdcalcs_goalpovvalmillcontribute
));
    });

    console.log(currentData);
    console.log(goalData);
    console.log(labels);
    
    var data = {
        labels: labels,
        datasets: [
                {
                    label: "Current",
                    fillColor: "rgba(160, 60, 58, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(160, 60, 58, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: currentData
                },
                {
                    label: "Goal",
                    fillColor: "rgba(209, 106, 37, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(209, 106, 37, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: goalData
                }
            ]
        };
    
    var propChart = new Chart(propvalsContext).Bar(data, chartStyles);     
    
    $('#prop-vals').on('mousemove', function(e){
            try {
                var activeBar = propChart.getBarsAtEvent(e);
                console.log(activeBar);
                highlightDistrict(activeBar[0].label);
            } catch(e) {
                console.log(e);

            }
        });
    $('#prop-vals').on('mouseout', function(e){ 
            dehighlightDistrict();
        });

}

//pollutants chart 
function buildPollutantsChart(dataObject) {

    var currentData = [],
           goalData = [],
           labels = [];

    dataObject.rows.forEach(function(d,i) {
           labels.push("District"+d.district);
           currentData.push(Number(d.cdcalcs_airqualitylbspollutants));
           goalData.push(Number(d.cdcalcs_goalairqualitylbspollutants));
    });

    var data = {
        labels: labels,
        datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(171, 18, 201, 1)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(171, 18, 201, 0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: currentData
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(204, 68, 235, 1)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(204, 68, 235, 0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: goalData
                }
            ]
        };
    
    var pollutantsChart = new Chart(pollutantsContext).Bar(data, chartStyles);
    
    $('#pollutants').on('mousemove', function(e){
            try {
                var activeBar = pollutantsChart.getBarsAtEvent(e);
                console.log(activeBar);
                highlightDistrict(activeBar[0].label);
            } 
            catch(e) {
                console.log(e);

            }
        });
    $('#pollutants').on('mouseout', function(e){ 
            dehighlightDistrict();
        });

}

//stormwater chart
function buildStormwaterChart(dataObject) {

    var currentData = [],
           goalData = [],
           labels = [];

    dataObject.rows.forEach(function(d,i) {
           labels.push("District"+d.district);
           currentData.push(Number(d.cdcalcs_runoffgallsreduced));
           goalData.push(Number(d.cdcalcs_goalrunoffgallsreduced));
    });

    var data = {
        labels: labels,
        datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(58, 60, 218, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(58, 60, 218, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: currentData
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(14, 165, 255, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(14, 165, 255, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: goalData
                }
            ]
        };
    
    var stormwaterChart = new Chart(stormwaterContext).Bar(data, chartStyles);
    
    $('#stormwater').on('mousemove', function(e){
            try {
                var activeBar = stormwaterChart.getBarsAtEvent(e);
                console.log(activeBar);
                highlightDistrict(activeBar[0].label);
            } 
            catch(e) {
                console.log(e);

            }
        });
    $('#stormwater').on('mouseout', function(e){ 
            dehighlightDistrict();
        });

}



//main map

$.getJSON('https://lfgreenfield.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM lexcouncildistricts_merge', function(data) {
    mapData(data);
});

var currentAttribute = 'canopy_percent',
    dataLayer;

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
    
    colorize(dataLayer);
}

function colorize(dataLayer) {
    
    var values = getValues(dataLayer);
    
    dataLayer.eachLayer(function(l) {
        
       l.setStyle({
           fillColor: getColor(l.feature.properties[currentAttribute], values),
           fillOpacity: .8
       }) 
    });
}

function getValues(dataLayer) {
    var values = [];
    dataLayer.eachLayer(function(l) {
       values.push(l.feature.properties[currentAttribute]);
    });
    return values.sort(function(a,b) {
        return a - b;  
    }); 
}
    
function getColor(v, values) {
   
    var s = d3.scale.linear();
    s.domain([values[0],values[values.length-1]]);
    s.range(['#e5f5e0','#006d2c'])
    return s(v);
    
}

function highlightDistrict(disNum) {
    console.log(disNum)
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

