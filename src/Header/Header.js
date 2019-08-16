import React from 'react';

let initialFiltersPassed = false;

let curFilters = {
    Uncertainty: 'Median',
    Year: '2010',
    Sort: 'Name',
    Search: ''
}

function Header(props) {
    // Pass current filters at the start
    if (!initialFiltersPassed) {
        props.updateFilters(curFilters);
        initialFiltersPassed = true;
    }
    
    const updateCurFilters = (filter,event) => {
        curFilters[filter] = event.target.value;
        props.updateFilters(curFilters);
    }

    return (
      <div className="header">
        <h1>Infant Mortality Rate</h1>
        <nav className="nav">
            <label key="label_year" htmlFor="select_year">Year    
                <select key="select_year" className="active_element" id="select_year"  defaultValue={curFilters.Year}
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
            <label key="label_uncertainty" htmlFor="select_uncertainty">Uncertainty bounds
                <select key="select_uncertainty" className="active_element" id="select_uncertainty" defaultValue={curFilters.Uncertainty} 
                onChange={(event) => updateCurFilters('Uncertainty', event)}>
                    <option value="Lower">Lower</option>
                    <option value="Median">Median</option>
                    <option value="Upper">Upper</option>
                </select>
            </label>
            <label htmlFor="select_sort">Sort
                <select className="active_element" id="select_sort" defaultValue={curFilters.Sort}
                onChange={(event) => updateCurFilters('Sort', event)}>
                    <option value="name">Name</option>
                    <option value="descending">Descending</option>
                    <option value="ascending">Ascending</option>
                </select>
            </label>
            <label htmlFor="filter_name">Search 
                <input className="active_element" type="text" placeholder="Type Country Name" defaultValue={curFilters.Search}
                onChange={(event) => updateCurFilters('Search', event)}></input>
            </label>
        </nav>
      </div>
    );
  }
export default Header;