import './App.css';
import {useState,useEffect} from 'react';
import axios from 'axios';
import NavBar from '../src/components/NavBar';
import HomePage from '../src/components/HomePage';
import ScreePlot from './components/ScreePlot';
import BiPlot from './components/BiPlot';
import ScatterPlotMatrix from './components/ScatterPlotMatrix';
import ScatterPlot from './components/ScatterPlot';
import Pcp from './components/Pcp';
import MdsVariable from './components/MdsVariable';
import barchartimg from './images/barchat.png';
import worldmapimg from './images/worldmap.png'
import pcpimg from './images/pcp.png'
import blankimg from './images/blank.png'

import GeoChart from "../src/components/GeoChart";
import data from "./GeoChart.world.geo.json";
import { BarChart } from './components/BarChart';
import { YearChart } from './components/YearChart';

function App() {

  const [state, setState] = useState(0);
  const [dataState, setDataState] = useState();
  const [scree, setScreeState] = useState();
  const [dimensionality, setDimState] = useState();
  const [mdsPcp, setMDSPCP] = useState();
  
  const [csvdata,setCsvdata] = useState();
  const [country,setCountry] = useState(null);


  function changeCountry(ele){
    console.log("this is triggered",ele);
    setCountry(ele);
  
  }
  



  let numerical;
  let categorical;

  const selectChart=(chartN)=>{
    setState(chartN);
  };

  const updatePCP=(arr)=>{
    setMDSPCP(arr);
  };

  const selDimNumber=(n)=>{
    setDimState(n);
  };

  useEffect(()=>{

    axios({
      method: "GET",
      url:"http://localhost:8000/data"
    }).then((repos) => {
      const allRepos = repos.data;
      console.log("OG",allRepos)
      setCsvdata(allRepos);
      // setScreeState(allRepos);
    });

  },[state,country]);
 

  return (
    // <div style={{width:"100em",height:"100em","backgroundColor":"beige"}}>
      <div style={{width:"100%",height:"60em",backgroundColor:"beige"}}>
        <div className="header"> <center><b> LIFE EXPECTANCY</b></center></div>
        
        <div className="box2">
          { csvdata && <GeoChart data={data} csvdata={csvdata} country={country} changeCountry={changeCountry} />}

        </div>
        <div className="box1">
          {!country && csvdata && <BarChart csvdata={csvdata} country={country} changeCountry={changeCountry}/>}
          {country && <YearChart country={country}/>} 
        </div>
        <div>
          <Pcp country={country} />
        </div>
        
         
          
        
        
     
       
      {/* <br/>
      <br/>
      
      <div class="wrapper">
        <div className="box1" style={{backgroundColor:"red"}}>
          <img style={{maxWidth:"100%",height:"400px"}} src={barchartimg} />
        </div>
        <div className="box2">
          <img style={{maxWidth:"100%",height:"400px"}} src={worldmapimg} />
        </div>
        <div className="box1">
          <img style={{maxWidth:"100%",height:"400px"}} src={blankimg} />
        </div>
      </div>
      <br/>
      <br/>
      <div class="wrapper">
        <div className="box1" style={{backgroundColor:"red"}}>
          <img style={{maxWidth:"100%",height:"400px"}} src={blankimg} />
        </div>
        <div className="box2">
          <img style={{maxWidth:"100%",height:"400px"}} src={pcpimg} />
        </div>
        <div className="box1">
          <img style={{maxWidth:"100%",height:"400px"}} src={blankimg} />
        </div>
      </div> */}
      
      {/* <div className="pcp_chart_img">
        <img style={{width:"100px"}} src={pcpimg} />
      </div>
      <div className="blank_chart_img">
        <img style={{width:"30%"}} src={blankimg} />
      </div> */}
        {/* <div className="header"> <center><b> New York Housing Units by Building</b></center></div>
          <center>
            <NavBar changeChart={selectChart}/>
          </center>
          <div className="home">
            {state===0 ? <HomePage numeric={numerical} categoric={categorical} /> :<div/>}
          </div>
          <center>
            {state===1 ? <ScreePlot changeDim={selDimNumber} />  : <div/>}
            {state===2 ? <BiPlot/> : <div/>}
            {state===3 ? <ScatterPlotMatrix dimensionality={dimensionality}/> : <div/>}
            {state===4 ? <ScatterPlot /> : <div/>}
            {state===5 ? <MdsVariable updateStatePCP={updatePCP}/> : <div/>}
            {state===6 ? <Pcp /> : <div/>}
          </center> */}
          {/* <WorldMap /> */}
    </div>
  );
}

export default App;
