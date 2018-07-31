import React, { Component } from "react";
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

export default class DataList extends Component {

    state={
      query:''
    }

    updateQuery = (query) => {
    this.setState({ query: query.trim() })
    }

  render(){
    const rows=[];
    let placesArray;
    const { query } = this.state
    const {places,populateInfoWindow,map} = this.props;


    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      placesArray = places.filter((place) => {
        if(match.test(place.title)){
            if(!place.getMap()){
              place.setMap(map);
            }
          return place;
        }
        else {
          place.setMap(null);
        }
      })
    } else {
      placesArray = this.props.places;
      placesArray.map((place) =>place.setMap(map))
    }

    placesArray.sort(sortBy('title'))

    placesArray.forEach((place)=>{
      rows.push(<li role="menuitem" key={place.id} className="select-search-box__option select-search-box__row" onClick={() => populateInfoWindow(place)}>
      <span tabIndex='0'>{place.title}</span>
      </li>)
    })
    return(

      <div className="select-search-box select-search-box--multiple  select-search-box--focus select-search-box--select">
      <input className="select-search-box__search" type="text" placeholder="Search Places" onChange={(event)=> this.updateQuery(event.target.value)}/>
              <div className="select-search-box__select select-search-box__select--display">
                  <ul role='menu' className="select-search-box__options">
                      {rows}
                  </ul>
              </div>
          </div>

    );
  }

}
