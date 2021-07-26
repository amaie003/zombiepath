import React, { Component } from "react";
import "./PlayGround.css";
import Node from './Node'

class PlayGround extends Component {



	render() {
		const { grid, editMode, nodeClicked } = this.props;

		return (
			<div className="playground">
				<div className="playgroundContent">
					<div className="toolBar">
						<button className="toolButtonUp startButton" onClick={() => this.props.start()}> Start</button>
						
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
									<div key={rowIdx} className="row">
										{row.map((node, nodeIdx) => {
											const { row, col, isHuman, isZombie, isWall, isDeadHuman, isZombieSense, isZombiePath} = node;
											return (
												<Node
													key={nodeIdx}
													row={row}
													col={col}
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
