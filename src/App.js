import React, { Component } from "react";
import "./App.css";
import TheMenu from "./TheMenu";
import { slide as Menu } from 'react-burger-menu'
class App extends Component {

  constructor(props) {
    super(props);    
    this.state = {
// An array of objects that contains the locations that the name & address will display in menu & lat,lng that set to marker
      alllocations: [
  {
    "name": "Kingdom Tower",
    "address": "King Fahd Rd, Al Olaya",
    "latitude": 24.711574,
    "longitude": 46.674750
  },
  {
    "name": "McDonald's",
    "address": "Al Urubah Rd, Al Wurud، Al Wurud",
    "latitude": 24.713455,
    "longitude": 46.673602
  },
  {
    "name": "Pizza Hut",
    "address": "Al Urubah Rd, Al Wurud، Al Wurud",
    "latitude": 24.714089,
    "longitude": 46.677185
  },
  {
    "name": "STARBUCKS COFFEE",
    "address": "Oruba Street، Al Wurud",
    "latitude": 24.714966,
    "longitude": 46.677808
  },
  {
    "name": "RedTag",
    "address": "Olaya St, Al Wurud",
    "latitude": 24.714664,
    "longitude":46.674975
  }
   
],};     
    this.initMap = this.initMap.bind(this);
    this.openWindow = this.openWindow.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
  }

  componentDidMount() {
    // Connect the initMap() to the global window 
    window.initMap = this.initMap;
    // load the Google Maps script    
    loadMapJS(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBCVKyVNHu4vBSkeaebRW6W9svK05GCHek&callback=initMap"
    );
  }

  // Initialise the map   

  initMap() {
    let self = this;

    let themap = document.getElementById("map");
// set the map size to fit the window perfictly
    themap.style.height = window.innerHeight + "px";
    themap.style.width = window.innerWidth + "px";
// set the map's charecterstics 
    let map = new window.google.maps.Map(themap, {
      center: { lat: 24.713552, lng: 46.675296 },
      zoom: 17,
      disableDefaultUI: true,
      styles: [ //set style to a dark themed one
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#142970'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#000000'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#000000'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    });
// creat the infowindow & add a listner to call closeWindow() when closed
    let InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      self.closeWindow();
    });

    this.setState({
      map: map,
      infowindow: InfoWindow
    });

// creat a marker fo each location in the alllocations array with animations       
    let alllocations = [];

    this.state.alllocations.forEach(function(location) {
      
      let marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng( location.latitude, location.longitude),
        animation: window.google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        map: map
      });
// add listner when marker clicked Opens InfoWindow
      marker.addListener("click", function() {
        self.openWindow(marker);
      });
let longname = location.name + " - " + location.address;
      location.longname = longname;
      location.marker = marker;
      alllocations.push(location);
    });
    this.setState({
      alllocations: alllocations
    });
  }//end of init()
 
 // methode responsiable of Opening the infowindows of  markers  
  openWindow(marker) {
    this.closeWindow();
    this.state.infowindow.open(this.state.map, marker);
    // change marker color to indicate wich one is choosen
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
    this.setState({prevmarker: marker}); 
    this.getMarkerInfo(marker);
  }

 // methode responsiable of closing the infowindows of  markers  
  closeWindow() {
    if (this.state.prevmarker) {
      this.state.prevmarker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
    }
    this.setState({prevmarker: ""});
    this.state.infowindow.close();
  }

  // methode taking care of getting info of locations (using foursquare)
  getMarkerInfo(marker) {
    let self = this;
    //api keys of foursquare 
    let clientId = "NNGLU0EP04XRCRB1AWK3SRO2MTUOBRTYMD1DZKWXRKZ20NAU";
    let clientSecret = "A4N4NZF4SQDT0QUZBJF5Z1LHWJSPM1XVSXM5N2WNDMXCSSLX";
    let url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
    fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sadly, data couldn't be found");
                        return;
                    }

                    
                    response.json().then(function (data) { // the text that will display in infowindow if seccede
                        let location_data = data.response.venues[0];                        
                        let locationName = `<h3>${location_data.name}</h3>`;
                        let street = `<p>${location_data.location.formattedAddress[0]}</p>`;
                        let verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                        let More = '<a  href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More!!</a>' 
                        let sponser = `<h6>Powered by Foursquare</h6>`
                        self.state.infowindow.setContent(locationName  + street  + verified + More + sponser);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sadly, data couldn't be found");
            });
  }



  render() {
    return (// making menu using 'react-burger-menu'
      <div>  
      <Menu right noOverlay  
            role="navigation"  
            isOpen={ true }
            customBurgerIcon={ <img  
                               className= "bm-burger-button" 
                               src="http://www.stickpng.com/assets/images/588a64d2d06f6719692a2d0e.png" 
                               aria-details="menu-icon" alt="menu-icon" 
                               tabIndex="0" /> }  >
      <main id="page-wrap" role="main" >
        <TheMenu
          key="LL"
          alllocations={this.state.alllocations}
          openWindow={this.openWindow}
          closeWindow={this.closeWindow}/>
        </main>
        </Menu>
        <div id="map"  role="map"/>
      </div>
    );
  }
}

export default App;

// Load the google maps asynchronously 

function loadMapJS(src) {
  let ref = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror =  () => {
    document.write("Map couldn't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}
