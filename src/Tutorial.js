import React, { Component } from "react";
import "./Tutorial.css";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import coverImg from "./img/zombieRunCoverTrans.png";
import algButton from "./img/algButton.png"
import mapButton from "./img/mapButtons.png";
import addObject from "./img/addObject.png";

class Tutorial extends Component {
  render() {
    const { popUp, width, height } = this.props;
    return (
      <div
        className="tutorialContainer"
        style={{
          width: width,
          height: height,
          left: window.innerWidth / 2 - width / 2,
          top: window.innerHeight / 2 - height / 2,
        }}
      >
        <div className="topBarContainer">
          <div className="popUpPageNumber">Page {popUp+1} / 4</div>
          <IconContext.Provider value={{ className: "exitIcon" }}>
            <ImCross onClick={()=>this.props.togglePopup(-1)} />
          </IconContext.Provider>
        </div>

        {popUp === 0 && 
        <div className="tutorialContentContainer">
            <h1 > Welcome to ZombieRun</h1>
            <p >
                Zombie Run is a pathfinding algorithm visulization and simulation App. 
            </p>
            <hr/>
                <p>
                In this tutorial, we will explore the features to compare pathfinding algorithms and make your custom simulation maps.  
            </p>
            <img src={coverImg} width="250px" alt={"ZombieRun Cover"}/>
        </div>
         }
     {popUp === 1 && 
        <div className="tutorialContentContainer">
            <h1 > Pathfinding Algorithms</h1>
            <p >
                A Pathfinding Algorithm attampts to find the path with shortest cost/distance from one location to another. However, not all algorithms guarantee the absolute shortest path.  These algorithms are commonly used for areas like Gaming and GPS.
            </p>
            <hr/>
        
                <p>
            Click the button below to switch Algorithms       
            </p>
            <img src={algButton} width="300px"  alt={"Algorithm Button Tutorial"}/>
        </div>
         }
        {popUp === 2 && 
        <div className="tutorialContentContainer">
            <h1 > Try Preset Maps</h1>
            <p >
               Want to see the algorithms work on different maps?
            </p>
            <hr/>
        
                <p>
            Use the menu below to try a map preset       
            </p>
            <img src={mapButton} width="250px"  alt={"Preset Map Button Tutorial "}/>
        </div>
         }
    {popUp === 3 && 
        <div className="tutorialContentContainer">
            <h1 > Customization</h1>
            <p >
              Place your own walls, humans, or zombie whereever you want!
            </p>
            <hr/>
        
                <p>
            First select what you want to place down, then click on or drag on a location to place it!   
            </p>
            <img src={addObject} width="400px"  alt={"Algorithm Button Tutorial Img"}/>
        </div>
         }


        <div className="popUpButtonBar">
       
        {popUp > 0 && (
          <div className="popUpButtonContainer">
            <button className="popUpButton" style={{backgroundColor:"rgb(80,80,80)"}} onClick={()=>this.props.togglePopup(popUp-1)}> Back</button>
          </div>
        )}
        {popUp < 3 && (
          <div className="popUpButtonContainer">
            <button className="popUpButton" onClick={()=>this.props.togglePopup(popUp+1)}> Next</button>
          </div>
            )}
       
         {popUp === 3 && (
          <div className="popUpButtonContainer">
            <button className="popUpButton" onClick={()=>this.props.togglePopup(-1)}> Finish</button>
          </div>
        )}
        </div>
      </div>
    );
  }
}
export default Tutorial;
