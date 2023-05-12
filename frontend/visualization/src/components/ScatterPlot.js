import React,{useEffect,useRef,useState} from 'react';
import * as d3 from 'd3';
import '../css/ScatterPlot.css';
import axios from 'axios';

//  const ScatterPlot = (props) => {

//     let scatterRef = useRef(null);
//     const [state, setState] = useState();
//     let data= props.data;
//     let width = 500;
//     let height = 400;
//     const margin_left=100;
//     const margin_right=30;
//     const margin_top=20;
//     const margin_bottom=100;
//     const effective_width= width - margin_left - margin_right;
//     const effective_height= height - margin_top - margin_bottom;
//     let xData ; 
//     let yData ; 
//     let color ; 
//     const colormap=["red","blue","black","green"];
//     useEffect(()=>{
//         axios.get('http://localhost:8000/mds_data').then((repos) => {
//             const allRepos = repos.data;
//             let parsedResponse = JSON.parse(allRepos);
//             let tempState = {'first':parsedResponse['first'],'second':parsedResponse['second'],'color':parsedResponse['color']};
//             setState(tempState);
//             clearBoard();
//             draw();
//       });
//         clearBoard();
//         //draw();
//     },[props]);

//     useEffect(()=>{
//         clearBoard();
//         draw();
//     },[state])

//     const clearBoard=()=>{
//         const accessToRef = d3.select(scatterRef.current)
//         accessToRef.selectAll("svg > *").remove();
//     }

//     const draw =() =>{
//         if(state!=undefined)
//         {
//              xData = state.first;
//             yData = state.second;
//         }
//         if(xData!=undefined && yData!=undefined)
//         {
//             const accessToRef = d3.select(scatterRef.current)
//                                     .attr("height",height)
//                                     .attr("width",width)
//                                     .style("background-color","#f5f5f5")
//                                     .append("g")
//                                     .attr("transform", "translate(" + margin_left + "," + margin_top + ")");

//             var xAxis= d3.scaleLinear()
//                         .domain([d3.min(Object.keys(xData), function(d) { return 1.2*xData[d] }), d3.max(Object.keys(xData), function(d) { return 1.2*xData[d] })])
//                         .range([ 0, effective_width ]);
            
//             accessToRef.append("g")
//                     .attr("transform", "translate(0," + effective_height + ")")
//                     .call(d3.axisBottom(xAxis))
//                     .call(g => g.append("text")
//                         .style("font-size", "18px")
//                         .attr("x", effective_width/2)
//                         .attr("y", -margin_top+80)
//                         .attr("fill", "blue")
//                         .attr("text-anchor", "start")
//                         .text("Component 1"));
            
//             var yAxis = d3.scaleLinear()
//                     .domain([d3.min(Object.keys(yData), function(d) { return 1.2*yData[d] }), d3.max(Object.keys(yData), function(d) { return 1.2*yData[d] })])
//                     .range([ effective_height, 0]);

//             accessToRef.append("g")
//                 .call(d3.axisLeft(yAxis))
//                 .call(g => g.append("text")
//                     .style("font-size", "18px")
//                     .attr("x", -effective_height/2+100)
//                     .attr("y", -margin_left+20)
//                     .attr("fill", "red")
//                     .attr("text-anchor", "end")
//                     .attr("transform", "rotate(-90)")
//                     .text("Component 2"));
            
//             accessToRef.append('g')
//                 .selectAll("dot")
//                 .data(Object.keys(xData))
//                 .enter()
//                     .append("circle")
//                     .attr("cx", function (d) { return xAxis(xData[d])  })
//                     .attr("cy", function (d) { return yAxis(yData[d]) } )
//                     .attr("r", 3)
//                     .style("fill", function (d) { return colormap[state.color[d]]})   ;
//         }
// }
//     return(
//         <div>
//             <br/><br/><br/>
//             {
//               state ? <div>
                
//                 <svg ref={scatterRef}></svg>
                
//               </div>: <div > Loading .... </div>
//             }
//         </div>
//     );

// };



export default function ScatterPlot({country,property}){


    const svgRef = useRef();
    const wrapperRef = useRef();

    const clearBoard=()=>{
        const accessToRef = d3.select(svgRef.current)
        accessToRef.selectAll("svg > *").remove();
    }

    const draw = (data) =>{

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 380 - margin.top - margin.bottom;


        // append the svg object to the body of the page
        var svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


       
        // Add X axis
        var x = d3.scaleLinear()
            .domain([d3.min(data, data=>data.label), d3.max(data,data => data.label)])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .attr("fill","white")
            .selectAll('text')
            .attr("fill","white");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([d3.min(data,data => data.label), d3.max(data,data => data.label)])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("fill","white")
            .selectAll('text')
            .attr("fill","white");

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function (d) { return x(d.label); } )
                .attr("cy", function (d) { return y(d.expectancy); } )
                .attr("r", 3)
                .style("fill", "cyan")


    }

    

    

    useEffect(()=>{
        console.log("label chart",property)
        axios({
            method: "GET",
            url:"http://localhost:8000/getAllData"
          }).then((repos) => {
            const allRepos = repos.data;
            let parsedResponse = JSON.parse(allRepos);
            let tmpData = [];
            parsedResponse.forEach((ele)=>{
                // if(ele.Country==country){
                    let obj = {};
                    obj.label = ele[property];
                    obj.expectancy = ele['Life Expectancy'];
                    tmpData.push(obj);
                // }
            })
            tmpData = [...tmpData].sort((a,b)=>b.label - a.label)
            console.log("svatter",tmpData)
            clearBoard();
            // horizontal(tmpData);
            draw(tmpData);
            // setScreeState(allRepos);
          });
      

        
        // draw(data);
        
    },[country,property])
    
    return (
        <div ref={wrapperRef} style={{backgroundColor:"#101c3c"}}>
          <svg ref={svgRef} style={{width:"500px",height:"395px"}}>
          </svg>
        </div>
      );
}


