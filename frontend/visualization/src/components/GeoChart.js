import { geoMercator, geoPath, max } from "d3";
import React,{ useEffect, useRef, useState } from "react";
import {select,scaleLinear} from "d3";

// import useResizeObserver from "./useResizeObserver";

function GeoChart({data,csvdata,country,changeCountry}){
    
    
    const svgRef = useRef(null);
    const wrapperRef = useRef();

    // const [selectedCountry,setSelectedCountry] = useState(country);

    // console.log("data",data.features[0])

    const clearBoard=()=>{
        const accessToRef = select(svgRef.current)
        accessToRef.selectAll("svg > *").remove();
    }

    const draw = ()=>{

         // const accessToRef = select(svgRef.current);
         const width=800;
         const height = 450;
 
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
         
        var colorScale = scaleLinear().domain([min,max]).range(['#ffdacc','#ff6b33'])
 
         const projection = geoMercator().fitSize([width,height],data);
 
         const pathGenerator = geoPath().projection(projection);
 
         const tooltip = select('.tooltip');
 
         // accessToRef.selectAll(".country")
         // .data(data.features)
         // .append("path")
         // .attr("class", "country")
         // .attr("d", feature => pathGenerator(feature));
         const accessToRef = select(svgRef.current)
                                     .attr("height",height)
                                     .attr("width",width)
                                    //  .style("background-color","#006699")
                                     // .attr("transform", "translate(" + margin_left + "," + margin_top + ")");
         accessToRef.selectAll(".country")
                     .data(data.features)
                     .enter()
                         .append('path')
                         .attr('class','country')
                         .attr('d', feature=> {
                             return pathGenerator(feature)
                         })
                         .attr("fill",feature => {
                             var req_name = feature.properties.name;
                             var index = -1;
                             for(var i=0;i<csvdata.country.length;i++){
                                 if(csvdata.country[i]==req_name){
                                    //  console.log("yes");
                                     index = i;
                                     break;
                                 }
                             }
                            //  console.log("dele",selectedCountry)
                             if(index==-1)return "#ccc";
                             if(req_name==country)return "green";
                             
                             return colorScale(csvdata.expectancy[index])
                         })
                        //  .on('mouseover',(feature) =>{
                 
                        //      console.log("mouse over",feature)
                        //      var req_name = feature.properties.name;
                        //      var index = -1;
                        //      for(var i=0;i<csvdata.country.length;i++){
                        //          if(csvdata.country[i]==req_name){
                        //              console.log("yes");
                        //              index = i;
                        //              break;
                        //          }
                        //      }
                        //      if(index!=-1){
                        //         return tooltip
                        //          .style('opacity', 1)
                        //          .html(csvdata.expectancy[index]) // Replace with your desired tooltip content
                        //          // .style('left', `${event.pageX}px`)
                        //          // .style('top', `${event.pageY}px`);
                        //      }
                             
                        //  })
                         // .on('mouseout', () => {
                         //     // Hide the tooltip when mouse leaves the country
                         //    return tooltip.style('opacity', 0);
                         //   })
                           .on('click', (feature) => {
                            //  console.log("event",feature)
                             var req_name = feature.properties.name;
                             if (csvdata.country.includes(req_name)) {
                               // Perform actions when a clickable country is clicked
                               if(country==req_name){
                                changeCountry(null)
                               }
                               else{
                                changeCountry(req_name);
                               }
                                // setSelectedCountry(req_name);
                                
                               
                              
                             }
                         });

    }

    useEffect(()=>{

        // console.log("inside use effect");
        clearBoard();
        draw();   

    },[data,country])


    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
          <svg ref={svgRef}></svg>
        </div>
      );

}


export default GeoChart;