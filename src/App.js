import React from 'react';
import './App.scss';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, VerticalBarSeries,VerticalGridLines,HorizontalGridLines,XAxis,YAxis} from 'react-vis';
import MortalityRateRaw from './Assets/mortality_rate.json';
import Header from './Header/Header';
import Info from './Info/Info';
let mortality_rate = [[],[],[],[],[],[],[],[]];
let data = [];
let countryData = []; // Array of countrys for block Info

for (let j = 0; j <= 7; j++) {
  for (let i = 0; i < MortalityRateRaw.length; i++) {
    let index = Math.floor(i/3);
    mortality_rate[j][index] = {};
  }
}

for (let j = 0; j <= 7; j++) {
  for (let i = 0; i < MortalityRateRaw.length; i++)
  {
    let index = Math.floor(i/3);
    mortality_rate[j][index][ MortalityRateRaw[i]['Uncertainty bounds*']] = MortalityRateRaw[i]['201' + j];
    mortality_rate[j][index].ISOcode = MortalityRateRaw[i]["ISO Code"];
    mortality_rate[j][index].name = MortalityRateRaw[i]["Country Name"];
  }
}

let currentIMRSample = [];

const setCurrentArray = (year) => {
  let yearIndex = year - 2010;
  for (let i = 0; i < mortality_rate[yearIndex].length; i++)
  {
    currentIMRSample[i] = Object.assign(mortality_rate[yearIndex][i]);
  }
}
const setData = (array, filters) => {

  data = [];
  for (let i = 0; i < array.length; i++)
  { 
    data[i] = {x: array[i].ISOcode, y: array[i][filters.Uncertainty], name: array[i].name};
  }
}

const filterArray = (array, contains) => {
  let filteredArray = [];
  contains = contains.toLowerCase();
  filteredArray = array.filter(function (item) {
    let lowercaseItem = item.name.toLowerCase();

    return lowercaseItem.includes(contains);
  });
  return filteredArray;
}


class App extends React.Component{
  constructor() {
    super();
    this.state = {
      index: 0,
      curFilters: {
        Uncertainty: 'Median',
        Year: '2010',
        Sort: 'Name',
        Search: ''
    }
    };
  }
  updateTips = (newFilters) => {
    this.setState({curFilters: newFilters});
  }  

  sortSample = (sortType) => {
    setCurrentArray(this.state.curFilters.Year);
    currentIMRSample = Object.assign([], filterArray(currentIMRSample, this.state.curFilters.Search));
    let Uncertainty = this.state.curFilters.Uncertainty;
    if (sortType === "ascending")
    currentIMRSample.sort(function(a,b) {
      return a[Uncertainty] - b[Uncertainty];
    }); else
    if (sortType === "descending") 
    currentIMRSample.sort(function(a,b) {
      return b[Uncertainty] - a[Uncertainty];
    }); 
    if (sortType === "name") {
      currentIMRSample.sort(function(a, b){
      var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
      if (nameA < nameB) //sort string ascending
        return -1 
      if (nameA > nameB)
        return 1
      return 0 //default return value (no sorting)
    })
    }
  }

  //Info block
  
  addCountry = (index) => {
    if (countryData.length < 11)
    countryData.push(currentIMRSample[index]);
  }

render() {
  const { index } = this.state;
  this.sortSample(this.state.curFilters.Sort);
  setData(currentIMRSample, this.state.curFilters);
  return (
    <div className="App">
      <Header updateTips={this.updateTips}/>
      <div className="chart_wrapper">
        <XYPlot height={250} width={Math.max(200,30.61*currentIMRSample.length) } xType="ordinal" className="main_chart" yDomain={[0, 145]}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries data={data} 
           onNearestX={(d, {index}) => this.setState({ index })}
           onValueClick={(datapoint, event)=>{this.addCountry(index)}}
          />
        </XYPlot>
      </div>
      {<Info countryInfo={currentIMRSample[index]} countryData={countryData}/>}
    </div>
  );
}
}

export default App;
