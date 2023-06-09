import React,{useEffect,useRef,useState} from 'react';
import * as d3 from 'd3';
import '../css/ScatterPlot.css';
import axios from 'axios';
import '../css/Pcp.css';
import { count, packSiblings } from 'd3';

 const Pcp = ({country,year}) => {
    let scatterRef = useRef(null);
    const [state, setState] = useState();
    const [dimensions, setDimensions] = useState();
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 1000 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    var y = {};
    var dragging = {};
    var line = d3.line();
    var background_lines,foreground_lines;
    var tempDims;
    // const colormap=["red","blue","black","green"];
    const create_dimensions=(tempState)=>{
        let dimensionz =[];
        let tempObj={};
        Object.keys(tempState[0]).map(function(key,index){
            if(key!='color'){
                if(typeof tempState[0][key] ==="number")
                {
                    tempObj={
                        name: key,
                        scale: d3.scaleLinear().range([height, 0]),
                        type: "number"
                    };
                }
                else
                {
                    tempObj={
                        name: key,
                        scale: d3.scaleBand().range([0, height]),
                        type: "string"
                    };
                }
                dimensionz.push(tempObj);
            }
        });
        setDimensions(dimensionz);
        tempDims=dimensionz;
    }

   
    var x;

    useEffect(()=>{
        // if(props.readFromMDSV==undefined || mdsPcpButton==false){
            axios.get('http://localhost:8000/pcp').then((repos) => {
                const allRepos = repos.data;
                let parsedResponse = JSON.parse(allRepos);
                console.log("country",country)
                console.log("before",parsedResponse)
                let tmpData = []
                var i =0;
                if(year){
                    parsedResponse.forEach((ele)=>{
                        if( ele.Year == year && i<20){
                            i=i+1;
                            tmpData.push(ele);
                        }
                        
                    })
                }
                else{
                    parsedResponse.forEach((ele)=>{
                       
                        if(ele.Country==country){
                            tmpData.push(ele);
                        }
                    })

                }
                
               

                console.log("filtered data",tmpData)
                parsedResponse = tmpData.length>0 ? tmpData : parsedResponse

                let tempState = parsedResponse;
                
                console.log("data",tempState)
                
                var no_of_dimensions = Object.keys(parsedResponse[0]).length - 1;
                create_dimensions(parsedResponse);
                    tempDims.forEach(function(dimension) {
                        dimension.scale.domain(dimension.type === "number"
                            ? d3.extent(parsedResponse, function(d) { return +d[dimension.name]; })
                            : parsedResponse.map(function(d) { return d[dimension.name]; }).sort());
                    });
                setState(tempState);
                clearBoard();
                draw();
            });
       
    },[country,year]);

    useEffect(()=>{
        clearBoard();
        draw();
    },[state,dimensions,country]);

    const clearBoard=()=>{
        const accessToRef = d3.select(scatterRef.current);
        accessToRef.selectAll("svg > *").remove();
    }


    const coordinate=(d)=>{
        var v = dragging[d.name];
        return v == null ? x(d.name) : v;
    }

    const transition=(g)=>{
        return g.transition().duration(500);
    }

    const path=(d)=>{
        return line(dimensions.map(function(dimension) {
            var draggingV = dragging[dimension.name];
            var xpoint = draggingV == undefined ? x(dimension.name) : draggingV;
            let ypoint = dimension.type==="string" ? dimension.scale(d[dimension.name]) + dimension.scale.bandwidth()/2 : dimension.scale(d[dimension.name]);
            return [xpoint, ypoint];
        }));
    }
            
     const brushstart=()=>{
            d3.event.sourceEvent.stopPropagation();
    };

    const brush=(svg)=>{
        var actives = [];
        svg.selectAll(".brush")
            .filter(function (d) {
                return d3.brushSelection(this);
            })
            .each(function (key) {
                actives.push({
                    dimension: key,
                    extent: d3.brushSelection(this)
                });
            });
        if (actives.length === 0) {
            foreground_lines.style("display", null);
        } else {
            foreground_lines.style("display", function (d) {
                return actives.every(function (brushObj) {
                    return brushObj.extent[0] <= brushObj.dimension.scale(d[brushObj.dimension.name]) && brushObj.dimension.scale(d[brushObj.dimension.name]) <= brushObj.extent[1];
                }) ? null : "none";
            });
        }
    }

   

    const draw =() =>{

        if(state!=undefined){
            x = d3.scalePoint()
                    .domain(dimensions.map(function(d) { return d.name; }))
                    .range([0, width]);

            var svg = d3.select(scatterRef.current)
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            if(state!=undefined){
                background_lines = svg.append("g")
                                .attr("class", "background")
                                .selectAll("path")
                                .data(state)
                                .enter()
                                .append("path")
                                .attr("d", path);
            
                foreground_lines = svg.append("g")
                                .attr("class", "foreground")
                                .selectAll("path")
                                .data(state)
                                .enter().append("path")
                                .attr("d", path)
                                .style("stroke",function(d){return "#a5a86a"});
            
                var g = svg.selectAll(".dimension")
                            .data(dimensions)
                            .enter().append("g")
                            .attr("class", "dimension")
                            .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; })
                            .call(d3.drag()
                            .on("start", function(d) {
                                    dragging[d.name] = x(d.name);
                                    background_lines.attr("visibility","hidden");
        
                                    })
                            .on("drag", function(d) {
                                dragging[d.name] = Math.min(width, Math.max(0, d3.event.x));
                                foreground_lines.attr("d", path);
                                dimensions.sort(function(a, b) { return coordinate(a) - coordinate(b); });
                                x.domain(dimensions.map(function(d) { return d.name; }));
                                g.attr("transform", function(d) { return "translate(" + coordinate(d) + ")"; })
                            })
                            .on("end", function(d) {
                                delete dragging[d.name];
                                transition(d3.select(this)).attr("transform", "translate(" + x(d.name) + ")");
                                transition(foreground_lines).attr("d", path);
                                background_lines
                                    .attr("d", path)
                                    .transition()
                                    // .delay(500)
                                    .duration(0)
                                    .attr("visibility", null)
                                    
                            })
                        );
                
                g.append("g")
                .attr("class", "axis")
                .each(function(d) { 
                    d3.select(this)
                    .call(d3.axisLeft()
                    .scale(d.scale));
                 })
                .append("text")
                .style("text-anchor", "middle")
                .attr("class", "axis-label")
                .attr("y", -19)
                // .style("fill","black")
                .style("font-size",7)
                .text(function(d) { return d.name; });
                
                g.append("g")
                    .attr("class", "brush")
                    .each(function(d)
                    {
                        d3.select(this)
                        .call(d.scale.brush = d3.brushY().extent([[-10,0],[10,height]])
                        .on("start", brushstart)
                        .on("brush", function(d){brush(svg)})
                        .on("end", function(d){brush(svg)}));
                    })
                    .selectAll("rect")
                    .attr("x", -8)
                    .attr("width", 16);
            }
        }
    }
    return(
        <div>
           {
              state ? <div style={{backgroundColor:"#101c3c"}}>
                  <svg ref={scatterRef}></svg>
                  <h3 style={{"color":"white","marginLeft":"32%",marginTop:"-4%",position:"relative"}}>Parallel Co-ordinate Plot</h3>
                  <br/>
                  </div> : <div />
            }
            
        </div>
    );

};
export default Pcp;


