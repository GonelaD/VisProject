import React, { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import axios from 'axios';

export function YearChart({country}){


    const svgRef = useRef();
    const wrapperRef = useRef();

    const clearBoard=()=>{
        const accessToRef = d3.select(svgRef.current)
        accessToRef.selectAll("svg > *").remove();
    }

    const draw = (data) =>{

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 90, left: 40},
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
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.expectancy)+20])
            .range([ height, 0]);
            svg.append("g")
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.year); })
            .attr("width", x.bandwidth())
            .attr("fill", "#69b3a2")
            // no bar at the beginning thus:
            .attr("height", function(d) { return height - y(0); }) // always equal to 0
            .attr("y", function(d) { return y(0); })

        // Animation
        svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", function(d) { return y(d.expectancy); })
            .attr("height", function(d) { return height - y(d.expectancy); })
            .delay(function(d,i){console.log(i) ; return(i*100)})


    }

    const horizontal = (data) => {

        
        // D3 code here
        var margin = {top: 20, right: 30, bottom: 40, left: 90},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            // .style("background-color","red")
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.expectancy)])
        .range([ 0, width]);
        
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .attr('fill','blue');

        // Y axis
        var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.year; }))
        .padding(.1);
        
        svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr('fill','blue')
        

        //Bars
        svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.year); })
        .attr("width", function(d) { return x(d.expectancy-10); })
        .attr("height", y.bandwidth() )
        // .attr("fill", "#69b3a2")
        .attr("fill","pink")
        .on('click',d=>{
            console.log("here",d)
            
        });



      
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
                    obj.expectancy = ele['Life Expectancy']-40;
                    tmpData.push(obj);
                }
            })
            tmpData = [...tmpData].sort((a,b)=>b.year - a.year)
            clearBoard();
            // horizontal(tmpData);
            draw(tmpData);
            // setScreeState(allRepos);
          });
      

        
        // draw(data);
        
    },[country])
    
    return (
        <div ref={wrapperRef}>
          <svg ref={svgRef} style={{width:"500px",height:"400px"}}>
          </svg>
        </div>
      );
}