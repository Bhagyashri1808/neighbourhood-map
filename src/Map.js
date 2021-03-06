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
    showPlaces:false
  }

  showList = ()=>{
    this.setState({showPlaces:!this.state.showPlaces});
  }

  componentDidMount() {
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
        id: place.id,
        vicinity: place.vicinity
      });

      this.markers.push(marker);
      placesArray.push(marker);
    //  infoWindow= new window.google.maps.InfoWindow();
      marker.addListener('click', ()=> this.populateInfoWindow(marker));

      }

      populateInfoWindow(marker) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
        if (infoWindow.marker !== marker) {
          infoWindow.marker = marker;

          infoWindow.open(marker.getMap(), marker);
          // Make sure the marker property is cleared if the infoWindow is closed.
          infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
            marker.setAnimation(null);
          });

          var clientId = "2AHAMTQRBXZ5PWY22MJWIXWB4RRJAFFT1GA3BDHVRXTPC4D0";
          var clientSecret = "0KQNI2JNXDNXLFWODRYOJGTMP3Q04ZXB5XAOFAAQLNOSBT2C";
          var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20180731&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
          console.log(url);
          fetch(url)
          .then(
            function (response) {
              if (response.status !== 200) {
                infoWindow.setContent("No data found for this location");
                return;
              }

              // Examine the text in the response
              response.json().then(function (data) {
                var venue=data.response.venues[0];
                var content=`<div id="iw-container">
                <div class="iw-title">
                <div>
                <img src=${venue.categories[0].icon.prefix}64${venue.categories[0].icon.suffix} alt="${venue.name}" height="44" width="44">
                </div>
                <h3>${venue.name}</h3>
                </div>
                <div class="iw-content">
                <p>${venue.location.formattedAddress.join('<br>')}</p>
                </div>
                <div class="iw-bottom-gradient"></div>
                </div>`

                infoWindow.setContent(content);
              });
            }
          )
          .catch(function (err) {
            infoWindow.setContent("No data found for this location");
          });

        }
      }

  render() {
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
