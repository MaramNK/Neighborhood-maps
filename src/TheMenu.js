 import React, { Component } from "react";
import Location from "./Location";

class TheMenu extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      locations: "",
      searched: "",
      suggestions: true
    };

    this.filterLocations = this.filterLocations.bind(this);
  }

 // The methode that filters the menu
  filterLocations(event) {
    this.props.closeWindow();
    const { value } = event.target;
    let locations = [];
    this.props.alllocations.forEach(function(location) {
      // matches the searched term with any match,and use toLowerCase() so the search wont be case senstive
      if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {        
       
        locations.push(location);
        location.marker.setVisible(true);
      }  //end if  
      else {
        location.marker.setVisible(false);
      } //end else
    });

    this.setState({
      locations: locations,
      searched: value
    });
  } // end filterlocations()

  componentWillMount() {
    this.setState({
      locations: this.props.alllocations
    });
  }

   whynotclosemenu(){
alert("You can close the menu from the red icon (top left) to see the location better");



   }
  render() {
    let locationlist = this.state.locations.map(function(listItem, index) {
      return (
        <Location
          key={index}
          openWindow={this.props.openWindow.bind(this)}
          data={listItem}
        />
      );
    }, this);

    return (
      <div>
        <input  
          role="search"        
          type="text"
          placeholder="Filter the locations here"
          value={this.state.searched}
          onChange={this.filterLocations}
          tabIndex="1"
        />
        <ul role="list" tabIndex="2" onClick={this.whynotclosemenu } >
          {this.state.suggestions && locationlist}
        </ul>
        <hr/>
        <footer role="contentinfo"><p>My Neighborhood Map Project</p><p> By Maram Al-Khatib</p></footer>
      </div>
    );
  }
}

export default TheMenu;
