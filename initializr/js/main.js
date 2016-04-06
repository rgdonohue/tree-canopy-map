var map = new L.Map("map", {
    center: [38.04,-84.50],
    zoom: 12
});

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(layer);


$.getJSON('https://rgdonohue.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM cartodb_query', function(data) {
    mapData(data);
});

currentAttribute = 'canopy_per';

function mapData(data) {
    var dataLayer = L.geoJson(data, {
        style : function(l) {
            return {
                fillColor: 'green',
                opacity: 1,
                fillOpacity: 1,
                color: 'white'
            }
        }
    }).addTo(map);
    
    colorize(dataLayer);
}

function colorize(dataLayer) {
    
    var values = getValues(dataLayer);
    
    dataLayer.eachLayer(function(l) {
        console.log(l);
       l.setStyle({
           fillOpacity: getColor(l.feature.properties[currentAttribute], values)
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
    s.domain([values[0],values.pop()]);
    s.range([.2,.8])
    return s(v);
    
}

