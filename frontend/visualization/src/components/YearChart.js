import React, { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import axios from 'axios';
import { greatestIndex } from 'd3';

export function YearChart({country,year,changeYear,val}){


    const svgRef = useRef();
    const wrapperRef = useRef();


    const clearBoard=()=>{
        const accessToRef = d3.select(svgRef.current)
        accessToRef.selectAll("svg > *").remove();
    }

    const draw = (data) =>{

        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 30, bottom: 90, left: 40},
        width = 460 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // X axis
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(data.map(function(d) { return d.year; }))
            .padding(0.2);

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("fill","white")
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .attr("fill","white");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.expectancy)+10])
            .range([ height, 0])

            
            
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("fill","white")
            .selectAll("text")
            .attr("fill","white");


            function onMouseOver(d, i) {
                // d3.select(this).attr('class', 'highlight');
                // d3.select(this)
                //     .transition()
                //     .duration(200)
                //     .attr('width', x.bandwidth() + 5)
                //     .attr("y", function() { return 10; })
                //     .attr("height", function() { return height -y(i) ; });
        
                svg.append("text")
                    .attr('class', 'tooltip')
                    .text("hello")
                    .attr('x',(ele)=>{
                        console.log("x-val",ele,x(d.year),x(i));
                        x(d.year);
                    })
                    .attr('y',height-y(d.expectancy)+50)
                    .style('fill','white')
                    // .attr('x', function() {
                    //     return x(d);
                    // })
                    // .attr('y', function() {
                    //     return y(binValArray[i]) - 15;
                    // })
                    // .text(function() {
                    //     return [+binValArray[i]];
                    // });
            }
        
            function onMouseOut(d, i) {
                // d3.select(this).attr('class', 'bar');
                // d3.select(this)
                //     .transition()
                //     .duration(200)
                //     .attr('width', x.bandwidth())
                //     .attr("y", function() { return y(binValArray[i]); })
                //     .attr("height", function() { return height - y(binValArray[i]); });
        
                d3.selectAll('.tooltip')
                    .remove()
            }

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.year); })
            .attr("width", x.bandwidth())
            .attr("fill", (d)=>{
                if(d.year == year){
                    return "green";
                }
                return "#ee9236"
            })
            // no bar at the beginning thus:
            .attr("height", function(d) { return height - y(0); }) // always equal to 0
            .attr("y", function(d) { return y(0); })
            .on("click",(d)=>{
                console.log("clicked",d);
                
                if(d.year == year){
                    changeYear(null,null);
                    // setVal(null);
                }
                else{
                    changeYear(d.year,d.expectancy);
                    // setVal(d.expectancy);
                }
                
            })
            // .on("mouseover",onMouseOver)
            // .on("mouseout",onMouseOut)
            
            

        // Animation
        svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", function(d) { return y(d.expectancy); })
            .attr("height", function(d) { return height - y(d.expectancy); })
            .delay(function(d,i){console.log(i) ; return(i*100)})


    }


    

    useEffect(()=>{
        console.log("year chart")
        axios({
            method: "GET",
            url:"http://localhost:8000/getAllData"
          }).then((repos) => {
            const allRepos = repos.data;
            let parsedResponse = JSON.parse(allRepos);
            let tmpData = [];
            parsedResponse.forEach((ele)=>{
                if(ele.Country==country){
                    let obj = {};
                    obj.year = ele.Year;
                    obj.expectancy = ele['Life Expectancy'];
                    tmpData.push(obj);
                }
            })
            tmpData = [...tmpData].sort((a,b)=>a.year - b.year)
            clearBoard();
            // horizontal(tmpData);
            draw(tmpData);
            // setScreeState(allRepos);
          });
      

        
        // draw(data);
        
    },[country,year])
    
    return (
        <div ref={wrapperRef} style={{backgroundColor:"#101c3c",height:"450px"}}>
          <svg ref={svgRef} style={{width:"500px",height:"400px"}}>
          </svg>
          <h3 style={{"color":"white","marginLeft":"25%",marginTop:"0%",position:"relative"}}>Year Vs Life-Expectancy - {val}</h3>
        </div>
      );
}