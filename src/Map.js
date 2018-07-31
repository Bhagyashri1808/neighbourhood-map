import React, { Component } from "react";
import DataList from "./dataList";

const infoWindow= new window.google.maps.InfoWindow();
export default class Map extends Component {
  constructor(){
    super();
    this.markers=[];

  }

  state={
    places:[],
    showPlaces:true
  }

  showList = ()=>{
    this.setState({showPlaces:!this.state.showPlaces});
  }

  componentDidMount() {
    console.log('now i am here');
    this.map = new window.google.maps.Map(this.refs.map, {
      center: { lat: -37.8207879, lng: 144.9561307 },
      zoom: 17,
      mapTypeId: "roadmap"
    });

        this.getPlaces(this.map);
  }


  getPlaces = (map) => {
    let placeService = new window.google.maps.places.PlacesService(map);
    var tribeca = {lat: -37.82064, lng: 144.958325};
    var request = {
      location: tribeca,
      radius: '500',
      type: ['restaurant','park','zoo']
    };
    const places=[];
    placeService.nearbySearch(request, (results,status)=>{
      var self=this;
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
       results.map((result)=>self.createMarker(result,places));
      }
      self.setState({places});
    });
  }

  createMarker(place,placesArray) {
      // Create a marker per location, and put into markers array.
       var marker = new window.google.maps.Marker({
        position: place.geometry.location,
        title: place.name,
        map:this.map,
        animation: window.google.maps.Animation.DROP,
        id: place.id
      });

      this.markers.push(marker);
      placesArray.push(marker);
    //  infoWindow= new window.google.maps.InfoWindow();
      marker.addListener('click', ()=> this.populateInfoWindow(marker));
      }

      populateInfoWindow(marker) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infoWindow.marker !== marker) {
          infoWindow.marker = marker;
          infoWindow.setContent('<div>' + marker.title + '</div>');
          infoWindow.open(marker.getMap(), marker);
          // Make sure the marker property is cleared if the infoWindow is closed.
          infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
          });
        }
      }

  render() {
    console.log('i am here');
    return (
      <div className='main-container'>
        
          {this.state.showPlaces?<DataList places={this.state.places} populateInfoWindow={this.populateInfoWindow} map={this.map}/>:''}

        <div className='map-container'>
          <div className='top'><span className="fas fa-bars" onClick={()=>this.showList()} aria-label="Collapse side panel" tabIndex='0'></span></div>
          <div ref="map" aria-label="Map" role="application" className='google-map'/>
        </div>
      </div>
    );
  }
}
