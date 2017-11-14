
var wavequestions_data = eval(wave_questions); 

var genreateSelector = function(sectionDiv, index,wave) {
    var section_group = document.getElementById(sectionDiv);

    var selectList_sectionlevel = document.createElement("select");
    selectList_sectionlevel.id = "section_dropdown" + index;
    section_group.appendChild(selectList_sectionlevel);
    var unselected_option = document.createElement("option");
    unselected_option.value = "no selected";
    unselected_option.text="no selected";
    selectList_sectionlevel.appendChild(unselected_option);
    selectList_sectionlevel.setAttribute("onchange","questionvaluefunction(this,"+index+",'"+wave+"','"+sectionDiv+"')")
    for (var sectionkey in wavequestions_data[wave]) {
            var option = document.createElement("option");
            option.value = sectionkey;
            option.text = sectionkey;
            selectList_sectionlevel.appendChild(option);                 
    }
        
    // $("#" + NAME).change(function () {
        
    // $("#section_dropdown" + index).change();
}

var sessionvaluefunction=function(obj,index,dropdown_wavediv){
    var dropdown_wavediv = document.getElementById(dropdown_wavediv)
    var dropdown_section = document.createElement("div");
    var wave=obj.value;
    dropdown_section.id= "dropdown_section_div"+index;
    dropdown_wavediv.appendChild(dropdown_section);
    genreateSelector(dropdown_section.id, index,wave);
}

var questionvaluefunction=function(obj,index,wave,section_dropdown){
       // $("question_dropdown"+index).empty();
                
        //Create and append select list
        var section = obj.value;
        if($("#" + "question_dropdown"+index).length == 0){
            var selectList_questionlevel = document.createElement("select");
            selectList_questionlevel.id = "question_dropdown"+index;
            }
        else{
            var selectList_questionlevel=document.getElementById("question_dropdown"+index);
            $("#question_dropdown"+index).empty();
        }
        // selectList_questionlevel.setAttribute("onchange","questionvaluefunction(this)");
        var section_dropdown=document.getElementById(section_dropdown);
        section_dropdown.appendChild(selectList_questionlevel);

        //Create and append the options
        for (var questionkey in wavequestions_data[wave][section]) {
            // for (var section_key in wavequestions_data[wavekey])
            var option = document.createElement("option");
            option.value = questionkey;
            option.text = wavequestions_data[wave][section][questionkey];
            selectList_questionlevel.appendChild(option);                
        }
      
    };




var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 1350 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand().range([0, width], 1),
    y = {},
    dragging = {};


var line = d3.line(),
    // axis = d3.axisLeft(),
    background,
    foreground;



// var waveCSVdata=d3.csvParse(waveCSV,
//                             function(d){
//                                 return d
//                             });

var loadCSV = function (dataFileName, callback) {
    d3.csv(dataFileName,function(data) {
        if (callback != undefined) {
            callback(data);
        }
    });
}

var drawPC=function(wavedata, svg, theKeys){
    
    thePotValueOfPC = {};
    // Extract the list of dimensions and create a scale for each.
    dimensions = theKeys.filter(function(d) {
        return (y[d] = d3.scaleLinear()
            .domain(d3.extent(wavedata, function(p) { 
                if (thePotValueOfPC[d] == undefined) {
                    thePotValueOfPC[d] = {'max':parseFloat(p[d]), 'min':parseFloat(p[d])};
                }

                if (thePotValueOfPC[d].max < parseFloat(p[d])) {
                    thePotValueOfPC[d].max = parseFloat(p[d]);
                } else if (thePotValueOfPC[d].min > parseFloat(p[d])) {
                    thePotValueOfPC[d].min = parseFloat(p[d]);
                }

                return +p[d];
            }))
            .range([height, 0]));
    });
    x.domain(dimensions)

    // Add grey background lines for context.
    background = svg.append("svg:g")
        .attr("class", "background")
        .selectAll("path")
        .data(wavedata)
        .enter().append("svg:path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("svg:g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(wavedata)
        .enter().append("svg:path")
        .attr("d", path)
        .style("stroke-opacity", "0.05");

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("svg:g")
        .attr("class", "dimension")
        .attr("transform", function(d) { 
            return "translate(" + x(d) + ")"; 
        });

    // Add an axis and title.
    g.append("svg:g")
        .attr("class", "axis")
        .each(function(d) { 
            d3.select(this).call(d3.axisRight(y[d]));
        })
        // .each(function(d) { d3.select(this).call( d3.axisLeft(y[d]) ); })
        .append("svg:text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .attr("x", 13)
        .attr("fill", "#000")
        // .each(function(d) {
        //     // 
        //     this.attr("onclick", "alert('" + d + "')")
        // })

        
        // .text(String);
        .text(function(d) { return d; });


    g.append("svg:g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(d.brush = 
            d3.brushY(y[d])
            .extent([[-10,0], [10,height]])
            .on("start", brushstart)
            .on("brush", brush)
            .on("end", brush)
        )
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
};


// Returns the path for a given data point.
function path(d) {
    return line(dimensions.map(function(p) { 
        return [x(p), y[p](d[p])]; 
    }));
}

// Handles a brush event, toggling the display of foreground lines.

function brushstart() {
    d3.event.sourceEvent.stopPropagation();
    foreground.style("display", "none");


}


function pcBrushCompare(dim, val, extent) {

    var difference = thePotValueOfPC[dim].max - thePotValueOfPC[dim].min;

    var e0 = parseFloat(difference) - (parseFloat(difference / height) * parseFloat(extent[0])) + thePotValueOfPC[dim].min;
    var e1 = parseFloat(difference) - (parseFloat(difference / height) * parseFloat(extent[1])) + thePotValueOfPC[dim].min;

    return e1 <= parseFloat(val) && parseFloat(val) <= e0;
}


function brush() {


    var actives = [];
    d3.selectAll(".brush")
      .filter(function(d) {
        return d3.brushSelection(this);
      })
      .each(function(d) {
        actives.push({
          dimension: d,
          extent: d3.brushSelection(this)
        });
      });

    foreground.style("display", function(d) {
        return actives.every(function(p, i) {
            return pcBrushCompare(p.dimension, d[p.dimension], p.extent);
        }) ? null : "none";
    });
}

$( document ).ready(function() {
    console.log( "ready!" );
    var dropdown_group = document.getElementById("dropdown_group");
    for (var i = 1; i <6; i++) {
        // var dropdown_section = document.createElement("div");
        // dropdown_section.id= "dropdown_section"+i;
        // dropdown_group.appendChild(dropdown_section)
        // genreateSelector(dropdown_section.id, i);

        var dropdown_wave=document.createElement("div");
        dropdown_wave.id="dropdown_wave"+i
        dropdown_group.appendChild(dropdown_wave)
        var selectList_wavelevel = document.createElement("select");
        selectList_wavelevel.id = "wave_dropdownlist" + i;
        dropdown_wave.appendChild(selectList_wavelevel)
        var unselected_option = document.createElement("option");
        unselected_option.value = "no selected";
        unselected_option.text="no selected";
        selectList_wavelevel.appendChild(unselected_option)
        selectList_wavelevel.setAttribute("onchange","sessionvaluefunction(this,"+i+",'dropdown_wave" + i+"')");
        for(var j=1;j<5;j++){
            var wave_option = document.createElement("option");
            wave_option.value = "wave_"+j;
            wave_option.text="wave_"+j;
            selectList_wavelevel.appendChild(wave_option)
        }


    }

    document.getElementById("dropdown_go_button").addEventListener("click", function(){
        document.getElementById("pc").innerHTML = "";
        document.getElementById("w1").innerHTML = "";
        //d3.selectAll("svg>*").remove();
        var parallelCoordinatesSVG = d3.select("#pc").append("svg")
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

        var classIn = ["C_CRP"];
        var sizeIn = 230;
        var scatterPlotId = "#w1";

        loadCSV("../data/cross_wave_v2.csv", function(data) {
            drawPC(data, parallelCoordinatesSVG, theKeys);
            SC = DrawSC();
            SC.drawScatterPlotMatrix(data, scatterPlotId, theKeys, classIn, sizeIn);
        });
    });
});