const sample = [
    {
    event: 'Zevent 2020',
    value: 6.98,
    },
    {
    event: 'Zevent 2019',
    value: 4.58,
    },
    {
    event: 'Zevent 2018',
    value: 1.33,
    },
    {
    event: 'Zevent 2017',
    value: 0.59,
    },
    {
    event: 'AGDQ 2020',
    value: 3.31,
    },
    {
    event: 'AGDQ 2019',
    value: 2.39,
    },
    {
    event: 'AGDQ 2018',
    value: 2.26,
    },
    {
    event: 'AGDQ 2017',
    value: 2.22,
    },
    {
    event: 'SGDQ 2020',
    value: 2.34,
    },
    {
    event: 'SGDQ 2019',
    value: 3.03,
    },
    {
    event: 'SGDQ 2018',
    value: 2.16,
    },
    {
    event: 'SGDQ 2017',
    value: 1.79,
    }
];



const margin = 60;
const width = 1000 - 2*margin;
const height = 600 - 2*margin;

const svg_bar = d3.select('#bar_chart');

const bar_chart = svg_bar.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

//BAR CHART

//Axe Y

const axe_yScale = d3.scaleLinear()
    .range([height, 0]) //defini la range divisée entre les values de domain
    .domain([0,10]);

bar_chart.append('g')
    .call(d3.axisLeft(axe_yScale));

//Axe X

const axe_xScale = d3.scaleBand()
    .range([0, width])
    .domain(sample.map((s) => s.event))
    .padding(0.2);

bar_chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(axe_xScale));

// Grille

// chart.append('g') //Barres Verticales
//   .attr('class', 'grid')
//   .attr('transform', `translate(0, ${height})`)
//   .call(d3.axisBottom()
//     .scale(axe_xScale)
//     .tickSize(-height, 0, 0)
//     .tickFormat(''))

bar_chart.append('g') //Barres Horizontales
    .attr('class', 'grid')
    .call(d3.axisLeft()
    .scale(axe_yScale)
    .tickSize(-width, 0, 0)
    .tickFormat(''))

// Barres

BarreGroup = bar_chart.selectAll() //Crée un rectangle pour chaque membre de l'array
    .data(sample) // determine quel élément du DOM doit etre modifié
    .enter() // Pour pas que ça bug si jamais il manque des éléments si la data est plus grande que le selectAll
    .append('g')

BarreGroup
.append('rect')
    .attr('class', 'bar')
    .attr('x', (s) => axe_xScale(s.event))
    .attr('y', (s) => axe_yScale(s.value))
    .attr('height', (s) => height - axe_yScale(s.value))
    .attr('width', axe_xScale.bandwidth())
    .on('mouseenter', function (s, i) {
    d3.select(this)
    .transition()
    .duration(300)
    .attr('opacity', 0.6)
    .attr('x', (i) => axe_xScale(i.event) - 5)
    .attr('width', axe_xScale.bandwidth() + 10)
    d3.select(this.parentNode).append('text')
        .attr('class', 'value')
        .attr('x', (i) => axe_xScale(i.event) + axe_xScale.bandwidth() / 2)
        .attr('y', (i) => axe_yScale(i.value) + 20)
        .attr('text-anchor', 'middle')
        .text((i) => `${i.value}`)

    
    // const y = axe_yScale(s.value)

    // chart.append('line')
    // .attr('class', 'limite')
    // .attr('x1', 0)
    // .attr('y1', y)
    // .attr('x2', width)
    // .attr('y2', y)
    // .attr('stroke', 'red')
    })

    .on('mouseleave', function () {
    d3.selectAll('.value')
        .attr('opacity', 1)

    d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (s) => axe_xScale(s.event))
        .attr('width', axe_xScale.bandwidth())

    //chart.selectAll('.limite').remove()
    bar_chart.selectAll('.value').remove()
    })      

// Texte

svg_bar.append('text') //Légende
    .attr('x', -(height/2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Montant récolté en Million de Dollar')

svg_bar.append('text') //Titre
    .attr('x', width/2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Evenements caritatifs')

// LINE CHART

const svg_line = d3.select('#line_chart')

const line_chart = svg_line.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

//Axe Y

const axe_yScale_line = d3.scaleLinear()
    .range([height, 0]) //defini la range divisée entre les values de domain
    .domain([0,10]);

line_chart.append('g')
    .call(d3.axisLeft(axe_yScale));

//Axe X

const axe_xScale_line = d3.scaleBand()
    .range([0, width])
    .domain(sample.map((s) => s.event))
    .padding(0.2);

line_chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(axe_xScale));

// Grille

// chart.append('g') //Barres Verticales
//   .attr('class', 'grid')
//   .attr('transform', `translate(0, ${height})`)
//   .call(d3.axisBottom()
//     .scale(axe_xScale)
//     .tickSize(-height, 0, 0)
//     .tickFormat(''))

line_chart.append('g') //Barres Horizontales
.attr('class', 'grid')
.call(d3.axisLeft()
.scale(axe_yScale)
.tickSize(-width, 0, 0)
.tickFormat(''))

// PIE CHART

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

const duration = 600
const radius = 100
var color = d3.scaleOrdinal().range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]);

var pie = d3.pie()
    .value(function(d) { return d.count; })
    .sort(null);

var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

const svg_pie = d3.select("#pie_chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

var tooltip = d3.select('#pie_chart')
    .append('div')
    .attr('class', 'tooltip')

tooltip.append('div')
    .attr('class', 'label')

tooltip.append('div')
    .attr('class', 'count')

tooltip.append('div')
    .attr('class', 'percent')

dataset.forEach(function(d) {
    d.count = +d.count; //calcule count total
    d.enabled = true; //aide a track quels elements sont check
})

var path = svg_pie.selectAll('path')
    .data(pie(dataset)) // Associe la data avec le path
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) { return color(d.data.label); }) //color scale
    .each(function(d) {this._current - d;}); //Smooth animation

path.on('mouseover', function(d) {
    var total = d3.sum(dataset.map(function(d) {
        return (d.enable) ? d.count : 0; //check si enabled est a true
    }));
    var percent = Math.round(1000 * d.data.count / total) /10; // Calcule le pourcentlabel
    tooltip.select('.label').html(d.data.label); // Set le label
    tooltip.select('.count').html('$'+ d.data.count); // Set le count
    tooltip.select('.percent').html(percent + '%'); // Set le pourcentlabel calculé au dessus
    tooltip.style('display', 'block'); //Affiche le tout
});

path.on('mouseout', function() {
    tooltip.style('display', 'none')
})

path.on('mousemove', function(d) {                 
    tooltip.style('top', (d3.event.layerY + 10) + 'px') // Toujours 10 en dessous du curseur
      .style('left', (d3.event.layerX + 10) + 'px'); // Toujours 10 pixel a droite du curseur
});