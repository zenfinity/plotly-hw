//Connect to data
//when running locally, start server first: python -m http.server
const source = "./data/samples.json";

var request = new XMLHttpRequest();
request.open("GET", source, false);
request.send(null)
var sampleData = JSON.parse(request.responseText);

//console.log(sampleData);

//Read in samples; dropdown id: selDataset
var dropdownMenu = d3.select("#selDataset");
// Assign the value of the dropdown menu option to a variable
//var dataset = dropdownMenu.property("value");
sampleData.names.forEach(element => {
    dropdownMenu.append("option")
        .property("value", element)
        .text(element);
});

function buildBar(sourceData, updatedValue) {
    //will pass sampleData.samples

    //Only assign data from updated selection
    var individual =  sourceData.filter((sample) => sample.id == updatedValue)[0];
    // [{sample_values...}]
    //console.log(individual);

    var xData = [];
    var yData = []; 

    //Only display first 10 values
    for(i = 0; i < 10; i++){
        xData[i] = individual.sample_values[i];
        yData[i] = `OTU ${individual.otu_ids[i]}`;
    }

    //console.log(`X ${xData}`);
    //console.log(`Y ${yData}`);

    var data = [{
        type: 'bar',
        x: xData,
        y: yData,
        orientation: 'h'
    }];

    var layout = {
        title: `Top Ten OTUs`,
        //...don't know why displaying descending order in chart
        //autorange: "reversed"
    };

    Plotly.newPlot("bar", data, layout);

};

function buildBubble(sourceData, updatedValue){
    /*Use otu_ids for the x values.
    Use sample_values for the y values.
    Use sample_values for the marker size.
    Use otu_ids for the marker colors.
    Use otu_labels for the text values.*/

    //will pass sampleData.samples

    var individual =  sourceData.filter((sample) => sample.id == updatedValue)[0];
    // [{sample_values...}]

    var xData = individual.otu_ids;
    var yData = individual.sample_values;

    var data = [{
        x: xData,
        y: yData,
        mode: 'markers',
        marker: {
            size: yData
        }     
    }];

    var layout = {
        title: `OTU Size Compare`,
        //...don't know why displaying descending order in chart
        //autorange: "reversed"
        showlegend: false,
        xaxis: {
            title: 'OTU ID'
        },
        yaxis: {
            title: 'Sample Value'
        }
    };

    Plotly.newPlot("bubble", data, layout);
    //console.log(individual);
};

function buildDemoData(sourceData, updatedValue){
    //clear existing
    d3.select('#ulDemo')
    .selectAll("ul")
    .remove();
    
    //will pass sampleData.metadata

    var individual =  sourceData.filter((metadata) => metadata.id == updatedValue)[0];

    //console.log(individual);
    // console.log(`ID ${individual.id}`);
    // console.log(`Ethnicity ${individual.ethnicity}`);
    // console.log(`Gender ${individual.gender}`);
    // console.log(`Age ${individual.age}`);
    // console.log(`Location ${individual.location}`);

    let metaData = [`ID: ${individual.id}`,
                    `Ethnicity: ${individual.ethnicity}`,
                    `Gender: ${individual.gender}`,
                    `Age: ${individual.age}`,
                    `Location: ${individual.location}`
                    ];

    //console.log(metaData);
    //console.log(ulID);

    var ul = d3.select('#ulDemo').append('ul');

	ul.selectAll('li')
	.data(metaData)
	.enter()
    .append('li')
    .text(function(d) {
        return d;
    })
	.html(String);
};

function optionChanged(newValue) {
    buildBar(sampleData.samples, newValue);
    buildBubble(sampleData.samples, newValue);
    buildDemoData(sampleData.metadata, newValue);
};

//initialize page
optionChanged("940");



