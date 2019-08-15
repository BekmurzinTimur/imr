import React from 'react';
import {XYPlot,LineMarkSeries, VerticalGridLines,HorizontalGridLines,XAxis,YAxis} from 'react-vis';

function CountryCard(props) {
    console.log(props.countryInfo);
    let data = {
        Lower: [],
        Median: [],
        Upper: []
    };

    for (let i =0; i<=7; i++) {
        data.Lower.push({ x: '201'+i, y:props.countryInfo.Lower[i]});
        data.Median.push({ x: '201'+i, y:props.countryInfo.Median[i]});
        data.Upper.push({ x: '201'+i, y:props.countryInfo.Upper[i]});
    }
    let yDomainBottom = Math.max(0, Math.min(...props.countryInfo.Lower) - 10);
    let yDomainTop = Math.max(...props.countryInfo.Upper) + 10;
    console.log(yDomainBottom, yDomainTop)

    return <div className="cards_card">
            <h3>{props.countryInfo.name}</h3>
            <XYPlot height={200} width={350} yType="linear" xType="ordinal" className="country_chart" yDomain={[yDomainBottom,yDomainTop]}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <LineMarkSeries data={data.Lower}/>
                <LineMarkSeries data={data.Median}/>
                <LineMarkSeries data={data.Upper}/>
            </XYPlot>
    </div>
}

export default CountryCard;