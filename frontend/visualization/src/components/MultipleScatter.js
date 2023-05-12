import React, { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import axios from 'axios';

export function MultipleScatter({country,property}){


    const svgRef = useRef();
    const wrapperRef = useRef();
    const [selectedProp,setSelectedProp] = useState();
    const [data,setData] = useState();

    const clearBoard=()=>{
        const accessToRef = d3.select(svgRef.current)
        accessToRef.selectAll("svg > *").remove();
    }

    const draw = (data) =>{

        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 30, bottom: 90, left: 40},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // Add X axis --> it is a date format
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d.label; }))
        .padding(0.2);
        
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

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
                .call(d3.axisLeft(y));


            
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("fill","white")
            .selectAll("text")
            .attr("fill","white");

        // Initialize line with group a
            var line = svg
                .append('g')
                .append("path")
                .datum(data)
                .attr("d", d3.line()
                    .x(function(d) { return x(+d.label) })
                    .y(function(d) { return y(+d.expectancy) })
                )
                .attr("stroke", "white")
                .style("stroke-width", 4)
                .style("fill", "none")

        // Initialize dots with group a
        var dot = svg
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", function(d) { return x(+d.label) })
            .attr("cy", function(d) { return y(+d.expectancy) })
            .attr("r", 7)
            .style("fill", "#69b3a2")



          
        
         
            
            



    }


    

    useEffect(()=>{
        console.log("Selected prop",selectedProp)
        axios({
            method: "GET",
            url:"http://localhost:8000/getMultipleData"
          }).then((repos) => {
            const allRepos = repos.data;
            let parsedResponse = JSON.parse(allRepos);
            let tmpData = [];
            parsedResponse.forEach((ele)=>{
                if(ele.Country==country){
                    let obj = {};
                    obj.label= ele.Year;
                    obj.expectancy = ele[property];
                
                    tmpData.push(obj);
                }
            })
            console.log("multiple",tmpData)
            tmpData = [...tmpData].sort((a,b)=>a.label - b.label)
            // setData(data);
            // if(!selectedProp){
                setSelectedProp(property);
            // }
            
            clearBoard();
            draw(tmpData)

            // horizontal(tmpData);
            
            // setScreeState(allRepos);
          });
      

        
        // draw(data);
        
    },[country,property])

    useEffect(()=>{
        axios({
            method: "GET",
            url:"http://localhost:8000/getMultipleData"
          }).then((repos) => {
            const allRepos = repos.data;
            let parsedResponse = JSON.parse(allRepos);
            let tmpData = [];
            parsedResponse.forEach((ele)=>{
                if(ele.Country==country){
                    let obj = {};
                    obj.label= ele.Year;
                    obj.expectancy = ele[selectedProp];
                
                    tmpData.push(obj);
                }
            })
            console.log("multiple",tmpData)
            tmpData = [...tmpData].sort((a,b)=>a.label - b.label)
           
            clearBoard();
            draw(tmpData)

            // horizontal(tmpData);
            
            // setScreeState(allRepos);
          });

    },[selectedProp])

   

    const handleChange = (ele)=>{

        console.log("seke",ele.target.value);
        setSelectedProp(ele.target.value);
    }

    const columns = [ 'Adult Mortality',
    'Infant deaths', 'Alcohol', 'Hepatitis B', 'Measles', 'BMI',
    'Under-five deaths', 'Polio', 'Total expenditure', 'Diphtheria']

    var list_col = columns.map((ele)=>{
        return <option value={ele}>{ele}</option>
    })
    
    return (
        <div ref={wrapperRef} style={{backgroundColor:"#101c3c",height:"420px"}}>
            <div>
                
                <select value={selectedProp?selectedProp:property} onChange={(ele)=>handleChange(ele)}>

                    {list_col}
                </select>

            </div>


          <svg ref={svgRef} style={{width:"500px",height:"400px"}}>
          </svg>
          <h3 style={{"color":"white","marginLeft":"25%",marginTop:"-10%",position:"relative"}}>{selectedProp} Vs Life-Expectancy</h3>
        </div>
      );
}