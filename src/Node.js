import React, { Component } from "react";
import "./Node.css";
import zombieImg from "./img/zombie.png";
import humanImg from "./img/human.png";

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
			talking,
			nodeWidth,
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
			 className={`node ${extraClassName} ${(col+1) % 4 ===0 ? 'rightBorderThick':''} ${(row+1) %4 === 0 ? 'bottomBorderThick':''}`
			 } style={{
				 width:nodeWidth,
				height:nodeWidth,
				
			}
			 
			 }>
			{(isZombie) &&
			<img draggable="false" alt = "Zomebie Icon" src = {zombieImg}/>
			}
			{(isHuman) &&
			<img draggable="false" alt = "Human Icon" src = {humanImg}/>
			}
			{(talking !=="" && isHuman) &&
			<div className="node_talk">
			{talking}

			</div>
			}
			</div>
		);
	}
}
export default Node;
