import React from "react";

class Location extends React.Component {
  
  render() {
    return (
      //opens the chosen menu opition marker
      <li 
        role="button"        
        tabIndex="3"      
        onClick={this.props.openWindow.bind(this, this.props.data.marker)}
      >
        {this.props.data.longname}
      </li>
    );
  }
}

export default Location;
