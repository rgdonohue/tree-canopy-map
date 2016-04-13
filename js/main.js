var map = new L.Map("map", {
    center: [38.04,-84.50],
    zoom: 12
});

var carbonContext = document.getElementById("carbon").getContext("2d");

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(layer);

$.getJSON('https://lfgreenfield.cartodb.com/api/v2/sql?format=JSON&q=SELECT * FROM lexcouncildistricts_merge', function(data) {
  
   data.rows.sort(function(a,b) {
     
      return a.district - b.district;
   })
   
   var currentData = [],
       goalData = [],
       labels = [];
   
   data.rows.forEach(function(d,i) {
       labels.push("District"+d.district);
       currentData.push(Number(d.cdcalcs_carbonstoredsequesttonsannually));
       goalData.push(Number(d.cdcalcs_goalcarbonstoredsequesttonsannually));
   });
    
    var data = {
    labels: labels,
    datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: currentData
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: goalData
            }
        ]
    };
    var carbonChart = new Chart(carbonContext).Bar(data, {
          barStrokeWidth : 5,
          barValueSpacing : 3,
          barShowStroke : false,
          scaleShowGridLines : false, 
          showScale : false
    });
    $('#carbon').on('mousemove', function(e){
        try {
            var activeBar = carbonChart.getBarsAtEvent(e);
            highlightDistrict(activeBar[0].label);
        } catch(e) {
            console.log(e);
          
        }
    });
    $('#carbon').on('mouseout', function(e){ 
        dehighlightDistrict();
    });
   
});

$.getJSON('https://rgdonohue.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM cartodb_query', function(data) {
    mapData(data);
});

var currentAttribute = 'canopy_per',
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

