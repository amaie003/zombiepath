import React, { Component } from "react";
import "./Nav.css";


class Nav extends Component {
  render() {
    return (
      <div className="navigationContainer">
        <div className="mainTitleContainer">
          <div className="navTitleContainer">
            <div className="navTitle">ZombieRun </div>
          </div>
          <div className="navTitleContainer">
            <div className="subTitle">Pathfinding Simulation</div>
          </div>
        </div>
      </div>
    );
  }
}
export default Nav;
