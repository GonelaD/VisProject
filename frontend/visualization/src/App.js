import './App.css';
import {useState,useEffect} from 'react';
import axios from 'axios';
import NavBar from '../src/components/NavBar';
import HomePage from '../src/components/HomePage';
import ScreePlot from './components/ScreePlot';
import BiPlot from './components/BiPlot';
import ScatterPlotMatrix from './components/ScatterPlotMatrix';

import MdsVariable from './components/MdsVariable';
import barchartimg from './images/barchat.png';
import worldmapimg from './images/worldmap.png'
import pcpimg from './images/pcp.png'
import blankimg from './images/blank.png'

import GeoChart from "../src/components/GeoChart";
import data from "./GeoChart.world.geo.json";
import { YearChart } from './components/YearChart';
import { PieChart } from './components/PieChart';
import ScatterPlot from './components/ScatterPlot';
import Pcp from './components/Pcp';
import { MultipleScatter } from './components/MultipleScatter';
import videobg from './assets/videobg.mov';
import wavebg from './assets/wavebg.mp4';
import final3 from './assets/final3.mp4';

function App() {

  const [state, setState] = useState(0);
  const [dataState, setDataState] = useState();
  const [scree, setScreeState] = useState();
  const [dimensionality, setDimState] = useState();
  const [mdsPcp, setMDSPCP] = useState();
  
  const [csvdata,setCsvdata] = useState();
  const [country,setCountry] = useState("China");
  const [property,setProperty] = useState("Alcohol");
  // const [refresh,setRefresh] = useState(false);
  const [year,setYear] = useState();
  const [val,setVal]= useState();



  function changeCountry(ele){
    console.log("this is triggered",ele);
    setCountry(ele);
  
  }
  
  function changeProperty(ele){
    console.log("enetertee")
    setProperty(ele);
    // setRefresh(!refresh);
  }

  function changeYear(ele1,ele2){
    setYear(ele1);
    setVal(ele2);
  }

  function handleReset(){
    setCountry('China');
    setYear(null);
    setProperty('Alcohol');
  }

  useEffect(()=>{
    console.log("here",property)
    axios({
      method: "GET",
      url:"http://localhost:8000/data"
    }).then((repos) => {
      const allRepos = repos.data;
      console.log("OG",allRepos)
      setCsvdata(allRepos);
      // setScreeState(allRepos);
    });

  },[state,country,property]);
 

  return (
    // <div style={{width:"100em",height:"100em","backgroundColor":"beige"}}>
      <div style={{width:"100%",height:"30em"}}>
        <div className='overlay'>
          <video src={final3} autoPlay loop muted/>
          <div className="content">
            
            <h2 style={{color:"white",marginLeft:"40%",width:"500px"}}>LIFE EXPECTANCY - {country}</h2>
            <br/>
            <button style={{position:"absolute",marginTop:"-45px",right:"10px",top:"-5"}} onClick={handleReset}>Reset</button>
            <div className="box1">
              {country && <PieChart country={country} property={property} changeProperty={changeProperty}/>}
            </div>
            <div className="box2">
              { csvdata && <GeoChart data={data} csvdata={csvdata} country={country} changeCountry={changeCountry} changeProperty={changeProperty} changeYear={changeYear} />}

            </div>
            <div className="box3">
              {country && <YearChart country={country} year={year} changeYear={changeYear} val={val}/>} 
            </div>

            
              <div className='box4'>
                <Pcp country={country} year={year} />
              </div>
              <div className='box5'>
                
                {<MultipleScatter country={country} property={property} />}
                
              </div>

          </div>
        {/* <div className='wrapper'>

          <h3 style={{position:"absolute",marginLeft:"40%",marginTop:"0.1%"}}>LIFE EXPECTANCY - {country}</h3>
          
          <div className="box1">
            {country && <PieChart country={country} changeProperty={changeProperty}/>}
          </div>
          
          <div className="box2">
            { csvdata && <GeoChart data={data} csvdata={csvdata} country={country} changeCountry={changeCountry} />}

          </div>
          <div className="box3">
            {country && <YearChart country={country}/>} 
          </div>
        
        <div>
          <div className='box4'>
            <Pcp country={country} />
          </div>
          <div className='box5'>
            
            {<MultipleScatter country={country} />}
            
          </div>

        </div>



        </div>
         */}
         </div>
          
       
        
         

    </div>
  );
}

export default App;
