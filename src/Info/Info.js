import React from 'react'; 
import {XYPlot, LineMarkSeries,VerticalGridLines,HorizontalGridLines,XAxis,YAxis, Borders} from 'react-vis';

function Info(props) {
    let CountryName = "Blank";
    let yDomainBottom = 0;
    let yDomainTop= 0;
    let countryData = [];
    let myData = [
        {x: 'Lower', y: 0},
        {x: 'Median', y: 0},
        {x: 'Upper', y: 0},
    ];

    let myData2 = [
      {x: 'Lower', y: 0},
      {x: 'Median', y: 0},
      {x: 'Upper', y: 0},
  ];
    if (props.countryData !== undefined)    
    countryData = Object.assign([], props.countryData);

    if (props.countryInfo !== undefined)
    { 
      CountryName = props.countryInfo.name;
      yDomainBottom = props.countryInfo.Lower;
      yDomainTop = props.countryInfo.Upper;
      myData = [
          {x: 'Lower', y: props.countryInfo.Lower},
          {x: 'Median', y: props.countryInfo.Median},
          {x: 'Upper', y: props.countryInfo.Upper},
      ];
    }

    let LineSeries = (<div>{ countryData.map(country => {
      let newData = [
        {x: 'Lower', y: country.Lower},
        {x: 'Median', y: country.Median},
        {x: 'Upper', y: country.Upper},
      ]

      return //<LineMarkSeries data={newData} />
    })
    }</div>)

    return (
      <div className="info_wrapper">
          <h2>{CountryName}</h2>
            <XYPlot height={200} width={350} yType="linear" xType="ordinal" className="country_chart" yDomain={[yDomainBottom,yDomainTop]}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <Borders style={{
                  bottom: {fill: '#fff'},
                  left: {fill: '#fff'},
                  right: {fill: '#fff'},
                  top: {fill: '#fff'}
                }}/>
                <XAxis />
                <YAxis />
                <LineMarkSeries data={myData} 
                className="linemark-series-example"/>
                <LineMarkSeries data={myData2} 
                className="linemark-series-example-2"/>
            </XYPlot>
      </div>
    );
  }
export default Info;