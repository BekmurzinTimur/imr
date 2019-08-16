import React from 'react';
import './App.scss';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, VerticalBarSeries,VerticalGridLines,HorizontalGridLines,XAxis,YAxis, DiscreteColorLegend} from 'react-vis';
import MortalityRateRaw from './Assets/mortality_rate.json';
import Header from './Header/Header';
import Info from './Info/Info';
import CountryCard from './CountryCard/CountryCard';


let data = []; // array to pass to VerticalBarSeries.


// Reordering data into new array in a more convinient way
let mortality_rate = [[],[],[],[],[],[],[],[]]; 
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
// currentIMRSample - filtered array that contains only chosen year and uncertainty bounds
let currentIMRSample = [];

const setCurrentArray = (year) => {
  let yearIndex = year - 2010;
  for (let i = 0; i < mortality_rate[yearIndex].length; i++)
  {
    currentIMRSample[i] = Object.assign(mortality_rate[yearIndex][i]);
  }
}
// Parse data for VerticalBarSeries element
const setData = (array, filters) => {

  data = [];
  for (let i = 0; i < array.length; i++)
  { 
    data[i] = {x: array[i].ISOcode, y: array[i][filters.Uncertainty], name: array[i].name};
  }
}
// Filter sample that contains only string that had been typed into search textfield
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
      index: 0, // Index of hovered bar
      curFilters: {
        Uncertainty: 'Median',
        Year: '2010',
        Sort: 'Name',
        Search: ''
    },
      visualization1: true, // switch to second visualization if false
      cardFilter: '' // search filter for second visualization
    };
  }

  updateFilters = (newFilters) => {
    this.setState({curFilters: newFilters});
  }  

  
  sortSample = (sortType) => {
    // Get data into temporary array so we can filter it w/o losing data
    setCurrentArray(this.state.curFilters.Year); 
    // Apply search filter
    currentIMRSample = Object.assign([], filterArray(currentIMRSample, this.state.curFilters.Search));
    // Sort what is left
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

  toggleVisualization = () => {
    const oldState = this.state.visualization1;
    this.setState({visualization1: !oldState});
  }
  // Viz #2
  //Make an object that contains all information about single country
  collectCountryInfo = (index) => {
    let countryInfo = {
      Lower: [],
      Median: [],
      Upper: [],
      ISOcode: mortality_rate[0][index].ISOcode,
      name: mortality_rate[0][index].name
    }
    for (let i = 0; i <= 7; i++)
    {
      countryInfo.Lower[i] = mortality_rate[i][index].Lower;
      countryInfo.Median[i] = mortality_rate[i][index].Median;
      countryInfo.Upper[i] = mortality_rate[i][index].Upper;
    }
    return countryInfo;
  }

  makeCards = () => {
    let searchKey = this.state.cardFilter.toLowerCase();
    let rows = [];
    if (this.state.visualization1 === false)
    {
      for (let i = 0; i < 196; i++) {
        //Apply search filter. If passes - add card
        let countryName = mortality_rate[0][i].name.toLowerCase()
        if (countryName.includes(searchKey))
        rows.push(<CountryCard key={i} countryInfo={this.collectCountryInfo(i)}/>);
      }
    }
    return <div className="cards_wrapepr">{rows}</div>
  }
  // Make inout for card search
  cardSearch = () => {
    return (<div>
      <label htmlFor="cardsearch">Search
        <input value={this.state.cardFilter} className="active_element" type="text" placeholder="Type country name" id="cardsearch" onChange={(e) => {
          this.setState({cardFilter: e.target.value});
        }}></input>
      </label>
    </div>)
  }

render() {
  const { index } = this.state; 
  this.sortSample(this.state.curFilters.Sort);
  setData(currentIMRSample, this.state.curFilters);
  // Make bar different color when hovered
  const dataWithColor = data.map((d, i) => ({...d, color: Number(i !== index)}));
  return (
    <div className="App">
      <button className='toggle_button active_element' onClick={this.toggleVisualization}>Toggle visualization</button>
      {/*Conditionaly render visualization */}
      {this.state.visualization1 === true ? <div>
        <Header updateFilters={this.updateFilters}/>
        <div className="chart_wrapper">
          <XYPlot 
           height={250} 
           width={Math.max(200,30.61*currentIMRSample.length)}
           xType="ordinal" 
           yDomain={[0, 145]}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <VerticalBarSeries 
            data={dataWithColor} 
            //Get index of hovered element
            onNearestX={(d, {index}) => this.setState({ index })}
            />
          </XYPlot>
        </div>
        <Info countryInfo={currentIMRSample[index]}/>
        </div>
        : <div>
          {/*Second visualization */}
          <h1>Infant Mortality Rate</h1>
          {this.cardSearch()}
          <DiscreteColorLegend 
                items={[{title: 'Lower', strokeWidth:4}, 
                {title: 'Median', strokeWidth:4}, 
                {title: 'Upper', strokeWidth:4}]}
                orientation="horizontal"/>
          {this.makeCards()}
        </div> 
      }
    </div>
  );
}
}

export default App;
