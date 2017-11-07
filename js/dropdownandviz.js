
var wavequestions_data = eval(wave_questions); 

var genreateSelector = function(sectionDiv, index) {
	var section_group = document.getElementById(sectionDiv);

	var selectList_sectionlevel = document.createElement("select");
	selectList_sectionlevel.id = "section_dropdown" + index;
	section_group.appendChild(selectList_sectionlevel);
    var unselected_option = document.createElement("option");
    unselected_option.value = "no selected";
    unselected_option.text="no selected";
    selectList_sectionlevel.appendChild(unselected_option);
	for (var sectionkey in wavequestions_data[wave]) {
		    var option = document.createElement("option");
		    option.value = sectionkey;
		    option.text = sectionkey;
		    selectList_sectionlevel.appendChild(option);				 
	}
		
    // $("#" + NAME).change(function () {
        
	$("#section_dropdown" + index).change(function () {        	
		//Create and append select list
		var section = this.value;
		if($("#" + "question_dropdown"+index).length == 0){
			var selectList_questionlevel = document.createElement("select");
			selectList_questionlevel.id = "question_dropdown"+index;
			}
		else{
			var selectList_questionlevel=document.getElementById("question_dropdown"+index);
            $("#question_dropdown"+index).empty();
		}
		selectList_questionlevel.setAttribute("onchange","questionvaluefunction(this)");
		section_group.appendChild(selectList_questionlevel);

		//Create and append the options
		for (var questionkey in wavequestions_data[wave][section]) {
			// for (var section_key in wavequestions_data[wavekey])
		    var option = document.createElement("option");
		    option.value = questionkey;
		    option.text = wavequestions_data[wave][section][questionkey];
		    selectList_questionlevel.appendChild(option);				 
		}
	});
}

var questionvaluefunction=function(obj){
       // $("question_dropdown"+index).empty();
		console.log(obj.value);
	};




var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;



var waveCSVdata=d3.csv.parse(waveCSV,
                            function(d){
                                return d
                            });


var drawPC=function(wavedata, svg, theKeys){


    //var theKeys = ["H1DA1", "H1DA2", "H1DA3", "H1DA4", "H1GH1"];
  

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = theKeys.filter(function(d) {
        return (y[d] = d3.scale.linear()
            .domain(d3.extent(wavedata, function(p) { return +p[d]; }))
            .range([height, 0]));
    }));

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(wavedata)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(wavedata)
        .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
};

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}



$( document ).ready(function() {
    console.log( "ready!" );
    var dropdown_group = document.getElementById("dropdown_group");
    for (var i = 1; i <6; i++) {
        var dropdown_section = document.createElement("div");
        dropdown_section.id= "dropdown_section"+i;
        dropdown_group.appendChild(dropdown_section)
        genreateSelector(dropdown_section.id, i);
    }
    // var dropdown_section1 = document.createElement("div");
    // var dropdown_section2 = document.createElement("div");
    // // var dropdown_section3 = document.createElement("div");
    // // var dropdown_section4 = document.createElement("div");
    // // var dropdown_section5 = document.createElement("div");
    // dropdown_group.appendChild(dropdown_section1)
    // dropdown_group.appendChild(dropdown_section2)

    // genreateSelector("dropdown_group", 1);
    // genreateSelector("dropdown_group", 2);
    // genreateSelector("dropdown_group", 3);
    // genreateSelector("dropdown_group", 4);
    // genreateSelector("dropdown_group", 5);
    
    document.getElementById("dropdown_go_button").addEventListener("click", function(){
        //document.getElementById("demo").innerHTML = "Hello World";
        document.getElementById("pc").innerHTML = "";
        var svg = d3.select("#pc").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var theKeys=[]
        for (var i=1; i<6;i++){
            thekey=$( "#question_dropdown"+i+" option:selected" ).val();
            if(thekey!=null){
                theKeys.push(thekey);
            }
        }
        

        drawPC(waveCSVdata, svg,theKeys);
    });

    
});