import React, { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import axios from 'axios';

export function PieChart({country,property,changeProperty}){


    const svgRef = useRef();
    const wrapperRef = useRef();

    const clearBoard=()=>{
        const accessToRef = d3.select(svgRef.current)
        accessToRef.selectAll("svg > *").remove();
    }

    const draw = (data) =>{

        // set the dimensions and margins of the graph
        var width = 450,
        height = 350,
        margin = 40

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = Math.min(width, height) / 2;

        // append the svg object to the div called 'my_dataviz'
        var svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("margin-top","10%")
            .style("margin-left","-8%")
            // .style("background-color","pink")
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        
            // .attr("style", "outline: thin solid black;")
        // svg.style('border', '1px solid black');
           
       

       // set the color scale
        // var color = d3.scaleOrdinal()
        //     .domain(data)
        //     .range(d3.schemeSet2);

        // Compute the position of each group on the pie:
        var pie = d3.pie().value(function(d) {return d.value+10; })
        console.log("here pie pie",pie)

        
        // Now I know that group A goes from 0 degrees to x degrees and so on.

        // shape helper to build arcs:
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

            // svg.append("text").transition().duration(1000).attr("text-anchor", "middle").attr("transform", "translate("+ (17) +","+(height/2)+")rotate(-90)").style("font", "16px times").style("font-family","Verdana, sans-serif").text("MDS 2");
   

            
    
        // Generate the pie slices
    const slices = svg
        .selectAll('path')
        .data(pie(data))
        .enter()
            .append('path')

   

    // var colorScale = d3.scaleLinear().domain([min,max]).range(['#ffdacc','#ff6b33'])
    // var colorScale = ['coral','#69b3a2','#008B8B','#00FA9A','royalblue']
    var colorScale=["#ee9236","#c4b4cc","#7468a8","#eae2a2","#a36435"]

  

    // Set the attributes for the slices
    slices
        .attr('d', arcGenerator)
        .attr('fill',(d,i)=>{
            console.log("color",d)
            if(d.data.label == property) return "green"
            return colorScale[i];
        })
        // .attr('fill', (d, i) => d3.schemeCategory10[i])
        .attr('stroke', '#fff')
        .on('mouseover',(d)=>{
            console.log("mouse over",d);
            // Calculate the percentage
            const percent = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
            svg
                .append('text')
                .attr('class', 'tooltip')
                
                .attr('x', -45)
                .attr('y', -30)
                .text(`${percent.toFixed(2)}%`)
                .style("fill","black")
                .style("border","solid")
                .style("font-size","20px")
                .attr('transform', function() {
                const centroid = arcGenerator.centroid(d);
                return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
                });
        })
        .on('mouseout',(d)=>{
            svg.select('.tooltip').remove();
        })
        .on('click',(d)=>{
            console.log("clicked",d.data.label);
            changeProperty(d.data.label);
        })

       
        
    // Append text labels to the slices 
        svg
            .selectAll('text')
            .data(pie(data))
            .enter()
            .append('text')
            .attr('transform', function(d) {
            const centroid = arcGenerator.centroid(d);
            return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
            })
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .text(function(d) {
            return  d.data.label;
            })
            .style('fill', 'black')
            .style("font-size","11px");

        
        // svg.append("g")
        // .append("text")
        // .text("Pie Chart")
        // .style("fill","white")
        // .attr("x",0)
        // .attr("y",-130)  

        


    }

   

    

    useEffect(()=>{
        console.log("pie chart")
        axios({
            method: "GET",
            url:"http://localhost:8000/getPieData"
          }).then((repos) => {
            const allRepos = repos.data;
            let parsedResponse = JSON.parse(allRepos);
            let tmpData = [];
            let cols =['Adult Mortality','Infant deaths','Under-five deaths']
    
            parsedResponse.forEach((ele)=>{
                if(ele.Country==country){
                   
                    console.log("here pie",ele)
                    for(var key in ele){
                        if(cols.includes(key)){

                            let obj = {};
                            obj.label = key;
                            obj.value = ele[key];
                            tmpData.push(obj);
                        }
                        
                    }
                }
            })
            console.log("tmp data",tmpData)
            tmpData = [...tmpData].sort((a,b)=>a.value - b.value)
            // tmpData = tmpData.slice(0, 5);
            // console.log("properyu",tmpData[4])
            // changeProperty(tmpData[4].label);
            
            clearBoard();
            
            draw(tmpData);
            // setScreeState(allRepos);
          });
      

        
        // draw(data);
        
    },[country,property])
    
    return (
        <div ref={wrapperRef} style={{backgroundColor:"#101c3c",height:"450px"}} >
          <svg ref={svgRef} >
          </svg>
          <h3 style={{"color":"white","marginLeft":"28%",marginTop:"3%",position:"relative"}}>Influence of Deaths</h3>
        </div>
      );
}