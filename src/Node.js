import React, { Component } from "react";
import "./Node.css";
//Yay this file is called Node.js


class Node extends Component {
	render() {
		const {
			row,
			col,
			isZombie,
			isHuman,
			isDeadHuman,
			isZombieSense,
			isWall,
			isZombiePath,
		} = this.props;
		var extraClassName =
			isHuman ? 'node_human'
				: isZombie ? 'node_zombie'
					: isDeadHuman ? 'node_dead_human'
						: isWall ? 'node_wall'
							: isZombiePath?'node_zombiePath'
							: isZombieSense ? 'node_zombieSense'
							: '';
		return (
			<div 
			onMouseDown={()=>this.props.onMouseDown(row,col)}
			onMouseUp={()=>this.props.onMouseUp()}
			onMouseEnter={()=>this.props.onMouseEnter(row,col)}
			//onClick={() => this.props.onMouseClick(row,col,false)}
			 className={`node ${extraClassName}`}>
				

			</div>
		);
	}
}
export default Node;