import React, { Component } from "react";
import "./PlayGround.css";
import Node from './Node'

class PlayGround extends Component {

	constructor(props){
	super(props);

	
	this.container = React.createRef();
	var screen = window.innerWidth;
	screen = screen > 1500 ? 1500:screen<1050?1050:screen;

	var width = Math.floor((screen-32)/this.props.nodePerRow);
	this.state={nodeWidth:width};

	window.addEventListener("resize", ()=>{
		if(this.container.current !== undefined && this.container.current !== null ){

			var nodeWidth = Math.floor(this.container.current.offsetWidth/this.props.nodePerRow);
			if (nodeWidth>1500){nodeWidth=1500;}
			this.setState({nodeWidth:nodeWidth});
		
		}
	});

	

	}
	
	

	render() {
		const { grid, editMode, nodeClicked } = this.props;
	
	
		
		
		return (
			<div className="playground">
				<div className="playgroundContent" ref = {this.container}>
					<div className="toolBar">
						<div className="leftButtonsContainer">
						<button className={`${this.props.inProgress?'startButtonDown' :'startButton' }`} onClick={() => this.props.start()}> Start</button>
						<button className={`${this.props.inProgress||this.props.algDropDown?'presetButtonDown' :'presetButton algButton' }`} onClick={() => this.props.toggleAlgDropDown()}> {this.props.alg=== 0? "Dijkstra Algorithm":this.props.alg=== 1?"A* Algorithm":"" }</button>

						<button className={`${this.props.inProgress||this.props.dropDown?'presetButtonDown' :'presetButton' }`} onClick={() => this.props.toggleDropDown()}> Presets</button>

						<nav className={`dropDownAlg ${this.props.algDropDown ? '' : 'hidden'}`}>
							<ul className="dropDown-nav">
								<li className="nav-item">
									
									<button  onClick={() => this.props.setAlg(0)} className="nav-item-content">
									Dijkstra Algorithm
									</button>
								
								</li>
								<li className="nav-item">
							
								<button  onClick={() => this.props.setAlg(1)} className="nav-item-content">
								"A* Algorithm"
								</button>
									

								
								</li>
								
							</ul>
						</nav>


						<nav className={`dropDown ${this.props.dropDown ? '' : 'hidden'}`}>
							<ul className="dropDown-nav">
								<li className="nav-item">
									
									<button  onClick={() => this.props.setDefaultBoard(0,0)} className="nav-item-content">
									A Wall
									</button>
								
								</li>
								<li className="nav-item">
							
								<button  onClick={() => this.props.setDefaultBoard(1,0)} className="nav-item-content">
									More Walls
								</button>
									

								
								</li>
								<li className="nav-item">
								
								<button  onClick={() => this.props.setDefaultBoard(2,0)} className="nav-item-content">
									Office
								</button>
								
								</li>
							</ul>
						</nav>
						</div>
						<div className="addObjectToolBox">
							<div className="toolBoxTitle">Add Objects:</div>

							<button className={editMode === 0 ? "toolButtonDown" : "toolButtonUp"} onClick={() => this.props.addObject(0)}>Human</button>
							<button className={editMode === 1 ? "toolButtonDown" : "toolButtonUp"}onClick={() => this.props.addObject(1)}>Zombie</button>
							<button className={editMode === 2 ? "toolButtonDown" : "toolButtonUp"}onClick={() => this.props.addObject(2)}>Wall</button>
							<button className="toolButtonUp" onClick={() => this.props.initializeBoard()}>Clear</button>

								
							</div>
					</div>
					<div className="gridContainer">
						<div className="grid" onMouseLeave={()=>{this.props.onPlayGroundMouseOut()}}>
							{grid.map((row, rowIdx) => {
								return (
									<div key={rowIdx} className="row" style = {{height:this.state.nodeWidth}}>
										{row.map((node, nodeIdx) => {
											const { row, col, isHuman, isZombie, isWall, isDeadHuman, isZombieSense, isZombiePath} = node;
											return (
												<Node
													key={nodeIdx}
													row={row}
													col={col}
													nodeWidth={this.state.nodeWidth}
													isHuman={isHuman}
													onMouseDown={this.props.onMouseDown}
													onMouseUp={this.props.onMouseUp}
													onMouseEnter={this.props.onMouseEnter}
													isZombie={isZombie}
													isWall={isWall}
													isDeadHuman={isDeadHuman}
													mouseIsPressed={false}
													isZombieSense={isZombieSense}
													onMouseClick={nodeClicked}
													isZombiePath={isZombiePath}
													></Node>
											);
										})}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default PlayGround;
