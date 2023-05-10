import React, { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";

export function BarChart({csvdata,country,changeCountry}){

    // const [selectedCountry,setSelectedCountry] = useState(country);

    const svgRef = useRef();
    const wrapperRef = useRef();

    const clearBoard=()=>{
        const accessToRef = d3.select(svgRef.current)
        accessToRef.selectAll("svg > *").remove();
    }

    const horizontal = (data,min,max) => {

        // console.log("inside",selectedCountry)
        var colorScale = d3.scaleLinear().domain([min,max]).range(['#ffdacc','#ff6b33'])
        // D3 code here
        var margin = {top: 20, right: 30, bottom: 40, left: 90},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
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
        .domain(data.map(function(d) { return d.country; }))
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
        .attr("y", function(d) { return y(d.country); })
        .attr("width", function(d) { return x(d.expectancy); })
        .attr("height", y.bandwidth() )
        // .attr("fill", "#69b3a2")
        .attr("fill",d=>{
            if(d.country == country)return "green";
            return colorScale(d.expectancy);
        })
        .on('click',d=>{
            console.log("here",d)
            // setSelectedCountry(d.country)
            changeCountry(d.country)
        });



      
    }

    

    useEffect(()=>{
        console.log("here",country)
        clearBoard();
        let data = []
        for(var i=0;i<csvdata.country.length;i++){
            let obj = {};
            obj.country = csvdata.country[i];
            obj.expectancy = csvdata.expectancy[i];
            data.push(obj);
        }

        var min=100000
         var max = -100000
         
         for(var i=0;i<csvdata.expectancy.length;i++){
             if(csvdata.expectancy[i]<min){
                 min = csvdata.expectancy[i];
             }
             if(csvdata.expectancy[i]>min){
                 max = csvdata.expectancy[i];
             }
         }

        data = [...data].sort((a,b)=>b.expectancy - a.expectancy)
        horizontal(data,min,max);
        // draw(data);
        
    },[csvdata,country])
    
    return (
        <div ref={wrapperRef}>
          <svg ref={svgRef} style={{width:"500px",height:"400px"}}>
          </svg>
        </div>
      );
}