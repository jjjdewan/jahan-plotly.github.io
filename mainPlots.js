// Function to create metadata
//
function createMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var myMetadata = data.metadata;
    // Using filter() to get data sample using sample object id
    //
    var myResultArray = myMetadata.filter(sampleObj => sampleObj.id == sample);

    // Initalize result with myResultArray[0]
    //
    var myResult = myResultArray[0];

    // Using d3 to select "#sample-metadata" 
    //
    var myPANEL = d3.select("#sample-metadata");

    // Now, clear existing metadata using ".html" 
    //
    myPANEL.html("");

    // Using forEach Object.entries() with forEach function to add key, value pair to the myPANEL 
    // Using D3 to appeded data ro the panel from metadata with [key, value] pair
    //
    Object.entries(myResult).forEach(([key, value]) => {
      myPANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    // BONUS section: Create Gauge Chart
    //
    createGauge(myResult.wfreq);
  });
}

// Function to create charts
//
function createCharts(sample) {
  d3.json("samples.json").then((data) => {
    // variables to define samples, result array and result
    //
    var samples = data.samples;
    var myResultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = myResultArray[0];

    // Define OTU ID, labels and sample values 
    //
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    
    // ---------------------------------------------------------------------------
    // Create Bubble Chart here using Plotly
    //---------------------------------------------------------------------------
    //
    // Bubble layout: non-data-related visual attributes: title, annotations, etc.
    var bubblePlotLayout = {
      title: "<b>Bubble Chart for each OTU Sample </b>",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };

    // Bubble data to be plotted 
    //
    var bubblePlotData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    // Plot Bubble Chart Now
    //
    Plotly.newPlot("bubble", bubblePlotData, bubblePlotLayout);
     
    //---------------------------------------------------------------------------
    // Create Bar Chart using Plotly
    //---------------------------------------------------------------------------
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Operational Taxonomic Units(OTUs)",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Initialize the dataset
// 
function initData() {
  //  select an element from dropdown menu
  //
  var selector = d3.select("#selDataset");

  // Select sample name to populate the data
  //
  d3.json("samples.json").then((data) => {
    var mySampleNames = data.names;
    // append data for each sample
    mySampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get first sample from the list to generate initial plots
    //
    var myFirstSample = mySampleNames[0];
    createCharts(myFirstSample);
    createMetadata(myFirstSample);
  });
}

//  
// Function: fetchNewData() to get new data for a selcted sample
//
function fetchNewData(newSample) {
  // Get new data based on slected sample and plot charts
  //
  createCharts(newSample);
  createMetadata(newSample);
}

// Initialize the dataset
//
initData();
