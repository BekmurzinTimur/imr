import React from 'react';

let initialFiltersPassed = false;

let curFilters = {
    Uncertainty: 'Median',
    Year: '2010',
    Sort: 'Name',
    Search: ''
}

function Header(props) {
    if (!initialFiltersPassed) {
        props.updateTips(curFilters);
        initialFiltersPassed = true;
    }
    const updateCurFilters = (filter,event) => {
        curFilters[filter] = event.target.value;
        props.updateTips(curFilters);
    }

    return (
      <div className="header">
        <h1>Infant Mortality Rate</h1>
        <nav className="nav">
            <label htmlFor="select_uncertainty">Uncertainty
                <select id="select_uncertainty" defaultValue="Median" 
                onChange={(event) => updateCurFilters('Uncertainty', event)}>
                    <option value="Lower">Lower</option>
                    <option value="Median">Median</option>
                    <option value="Upper">Upper</option>
                </select>
            </label>
            <label htmlFor="select_uncertainty">Year    
                <select id="select_year" 
                onChange={(event) => updateCurFilters('Year', event)}>
                    <option value="2010">2010</option>
                    <option value="2011">2011</option>
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                </select>
            </label>
            <label htmlFor="select_sort">Sort
                <select id="select_sort" 
                onChange={(event) => updateCurFilters('Sort', event)}>
                    <option value="name">Name</option>
                    <option value="descending">Descending</option>
                    <option value="ascending">Ascending</option>
                </select>
            </label>
            <label htmlFor="filter_name">Filter 
                <input type="text" placeholder="Type Country Name" 
                onChange={(event) => updateCurFilters('Search', event)}></input>
            </label>
        </nav>
      </div>
    );
  }
export default Header;