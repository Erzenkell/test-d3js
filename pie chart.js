// define data
var dataset = [
    {
        label: "36+",
        count:400,
    },
    {
        label: "24-36",
        count:5400,        
    },
    {
        label: "18-24",
        count:11200,          
    },
    {
        label: "-18",
        count:3000,          
    }
  ];

// taille chart
var width = 1200;
var height = 800;
var radius = Math.min(width, height) / 2;

// Dimension legende
var legendRectSize = 25; // Taille carré colorés de la légende
var legendSpacing = 6; // Espace entre les carrés

//color scale
var color = d3.scaleOrdinal().range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]);

var svg = d3.select('#chart') 
  .append('svg')
  .attr('width', width) 
  .attr('height', height) 
  .append('g') 
  .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

var arc = d3.arc()
  .innerRadius(radius - 100)
  .outerRadius(radius); // Taille de la chart

var pie = d3.pie() // Début et fin des angles des segments
  .value(function(d) { return d.count; }) // Extrait les nombres e chaque entrée de notre data
  .sort(null); // par default les valeurs sont triés par ordre descroissant on cancel ça en mettant a null

// define tooltip
var tooltip = d3.select('#chart') 
  .append('div')                                  
  .attr('class', 'tooltip'); 

tooltip.append('div')                          
  .attr('class', 'label');                       

tooltip.append('div')                    
  .attr('class', 'count');                   

tooltip.append('div')   
  .attr('class', 'percent'); 

dataset.forEach(function(d) {
  d.count = +d.count; // calcule le total en naviguant dans la data
  d.enabled = true; // Permet de track quelle entrée est check
});

// creating the chart
var path = svg.selectAll('path')
  .data(pie(dataset)) //Associe le set de data avec le path qu'on créé
  .enter() //crée un placeholder pour chaque valeur
  .append('path') // remplace les placeholders avec les elements du path
  .attr('d', arc) // Défini 'd' avec l'arc
  .attr('fill', function(d) { return color(d.data.label); }) // use color scale to define fill of each label in dataset
  .each(function(d) { this._current - d; }); // creates a smooth animation for each track

// mouse event handlers are attached to path so they need to come after its definition
path.on('mouseover', function(d) {  // when mouse enters div      
 var total = d3.sum(dataset.map(function(d) { // calculate the total number of tickets in the dataset         
  return (d.enabled) ? d.count : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase                                      
  }));                                                      
 var percent = Math.round(1000 * d.data.count / total) / 10; // calculate percent
 tooltip.select('.label').html(d.data.label); // set current label           
 tooltip.select('.count').html(d.data.count); // set current count            
 tooltip.select('.percent').html(percent + '%'); // set percent calculated above          
 tooltip.style('display', 'block'); // set display                     
});                                                           

path.on('mouseout', function() { // when mouse leaves div                        
  tooltip.style('display', 'none'); // hide tooltip for that element
 });

path.on('mousemove', function(d) { // when mouse moves                  
  tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
    .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
  });

// define legend
var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
  .data(color.domain()) // refers to an array of labels from our dataset
  .enter() // creates placeholder
  .append('g') // replace placeholders with g elements
  .attr('class', 'legend') // each g is given a legend class
  .attr('transform', function(d, i) {                   
    var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
    var offset =  height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
    var horz = 18 * legendRectSize; // the legend is shifted to the left to make room for the text
    var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
      return 'translate(' + horz + ',' + vert + ')'; //return translation       
   });

// adding colored squares to legend
legend.append('rect') // append rectangle squares to legend                                   
  .attr('width', legendRectSize) // width of rect size is defined above                        
  .attr('height', legendRectSize) // height of rect size is defined above                      
  .style('fill', color) // each fill is passed a color
  .style('stroke', color) // each stroke is passed a color
  .on('click', function(label) {
    var rect = d3.select(this); // this refers to the colored squared just clicked
    var enabled = true; // set enabled true to default
    var totalEnabled = d3.sum(dataset.map(function(d) { // can't disable all options
      return (d.enabled) ? 1 : 0; // return 1 for each enabled entry. and summing it up
    }));

    if (rect.attr('class') === 'disabled') { // if class is disabled
      rect.attr('class', ''); // remove class disabled
    } else { // else
      if (totalEnabled < 2) return; // if less than two labels are flagged, exit
      rect.attr('class', 'disabled'); // otherwise flag the square disabled
      enabled = false; // set enabled to false
    }

    pie.value(function(d) { 
      if (d.label === label) d.enabled = enabled; // if entry label matches legend label
        return (d.enabled) ? d.count : 0; // update enabled property and return count or 0 based on the entry's status
    });

    path = path.data(pie(dataset)); // update pie with new data

    path.transition() // transition of redrawn pie
      .duration(750) // 
      .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
        var interpolate = d3.interpolate(this._current, d); // this = current path element
        this._current = interpolate(0); // interpolate between current value and the new value of 'd'
        return function(t) {
          return arc(interpolate(t));
        };
      });
  });

// adding text to legend
legend.append('text')                                    
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; }); // return label