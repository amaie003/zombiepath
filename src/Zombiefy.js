import React, { Component } from "react";
import "./Zombiefy.css";
import Nav from "./Nav";
import PlayGround from "./PlayGround";
import { dijkstra, getNodesInShortestPathOrder } from "./dijktra";
import {office,wall,moreWall} from "./PresetMaps";

class Zombiefy extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      editMode: -1,
      zombie: { row: -1, col: -1 },
      clock: 0,
      mouseDown: false,
      inProgress: false,
      dropDown:false
    };
    this.nodeClicked = this.nodeClicked.bind(this);
  }
  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 14; row++) {
      const currentRow = [];
      for (let col = 0; col < 36; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  start = () => {
    //get Arrays for first turn
    if (this.state.inProgress === true) {
      return;
    }

    if(this.state.zombie.row===-1||this.state.zombie.col===-1){
      alert("Wow There is No Zombie on The Playground! Add one From the 'Add Object' Section?");
      return;
    }
    this.setState({ inProgress: true });

    var visited = dijkstra(
      this.state.grid,
      this.state.grid[this.state.zombie.row][this.state.zombie.col],
      0
    );
    var shortestPath = this.getShortestPath(visited);
    this.senseObject(visited, shortestPath, 0);



  };

  getShortestPath = (visited) => {
    var nodesInShortestPathOrder = [];

    if (visited.length >= 1 && visited[visited.length - 1].isHuman === true) {
      nodesInShortestPathOrder = getNodesInShortestPathOrder(
        visited[visited.length - 1]
      );
    } else {
      this.setState({ inProgress: false });
    }
    return nodesInShortestPathOrder;
  };

  moveZombie = (grid, fX, fY, dX, dY) => {
    if (fX === -1 || fY === -1) {
      return grid;
    }
    const start = grid[fX][fY];
    const to = grid[dX][dY];
    if (!start.isZombie) {
      return grid;
    }
    const oldNode = {
      ...start,
      isZombie: false,
    };
    var newNode = {
      ...to,
      isZombie: true,
      isWall: false,
    };
    if (newNode.isHuman) {
      newNode = {
        ...newNode,
        isHuman: false,
        isDeadHuman: true,
      };
    }
    grid[fX][fY] = oldNode;
    grid[dX][dY] = newNode;
    return grid;
  };

  clearSense = (grid) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        var node = grid[i][j];
        if (
          node.isZombieSense ||
          node.isZombiePath ||
          node.distance !== Infinity
        ) {
          const newNode = {
            ...node,
            isZombieSense: false,
            isZombiePath: false,
            isVisited: false,
            distance: Infinity,
            previousNode: null,
          };
          grid[node.row][node.col] = newNode;
        }
      }
    }

    return grid;
  };

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        this.setState(
          ({ grid }) => {
            const node = nodesInShortestPathOrder[i];
            let newNode = Object.assign({}, node);
            newNode.isZombieSense = false;
            newNode.isZombiePath = true;

            grid[node.row][node.col] = newNode;

            return { grid: grid };
          },
          () => {
            if (i === nodesInShortestPathOrder.length - 1) {
              setTimeout(() => {
                this.moveBoard();
              }, 800);
            }
          }
        );
      }, 10 * i);
    }
  }
  moveBoard = () => {
    this.zombieMoveThrough();
  };

  zombieMoveThrough = () => {
    var visited = dijkstra(
      this.state.grid,
      this.state.grid[this.state.zombie.row][this.state.zombie.col],
      0
    );
    var shortestPath = this.getShortestPath(visited);

    setTimeout(() => {
      this.setState(({ grid, zombie, clock }) => {
        var newClock = clock + 1;
        if (newClock === 5) {
          newClock = 0;
        }
        var newGrid = grid.slice();
        newGrid = this.clearSense(newGrid);
        var newZombie = { row: zombie.row, col: zombie.col };
        visited = dijkstra(grid, grid[zombie.row][zombie.col], 0);
        shortestPath = this.getShortestPath(visited);

        if (shortestPath === []) {
          return;
        }

        for (let i = 1; i < shortestPath.length; i++) {
          if (!shortestPath[i].isHuman) {
            var newItem = {
              ...shortestPath[i],
              isZombiePath: true,
              isDeadHuman: false,
            };
            newGrid[newItem.row][newItem.col] = newItem;
          }
        }
        if (shortestPath.length >= 2) {
          newGrid = this.moveZombie(
            newGrid,
            shortestPath[0].row,
            shortestPath[0].col,
            shortestPath[1].row,
            shortestPath[1].col
          );
          newZombie = { row: shortestPath[1].row, col: shortestPath[1].col };
        }

        if (newClock === 4) {
          var humans = this.getAllHuman(grid);
          grid = this.HumanMove(grid, humans);
        }
        return { grid: newGrid, zombie: newZombie, clock: newClock };
      });
      if (shortestPath.length > 0) {
        this.zombieMoveThrough();
      }
    }, 150);
  };

  getAllHuman = (grid) => {
    var human = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        var item = grid[i][j];
        if (item.isHuman) {
          human.push(item);
        }
      }
    }
    
    return human;
  };
  HumanMove = (grid, humans) => {
    for (let i = 0; i < humans.length; i++) {
      var human = humans[i];
      var x = human.row;
      var y = human.col;
      var possibleMoves = [];
      var offsets = [
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: -1, dy: 0 },
      ];
      for (let j = 0; j < offsets.length; j++) {
        var dx = offsets[j].dx;
        var dy = offsets[j].dy;
        if (
          x + dx >= 0 &&
          x + dx < grid.length &&
          y + dy >= 0 &&
          y + dy < grid[0].length
        ) {
          var newNode = grid[x + offsets[j].dx][y + offsets[j].dy];
          if (!newNode.isWall && !newNode.isZombie && !newNode.isHuman) {
            possibleMoves.push(newNode);
          }
        }
      }
      if (possibleMoves.length === 0) {
        return;
      }
      var randomNode =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      var oldNode = {
        ...human,
        isHuman: false,
      };
      var newNode2 = {
        ...randomNode,
        isHuman: true,
      };
      grid[x][y] = oldNode;
      grid[randomNode.row][randomNode.col] = newNode2;
    }
    return grid;
  };

  senseObject(visitedNodesInOrder, nodesInShortestPathOrder, type) {
    for (let i = 0; i < visitedNodesInOrder.length; i = i + 15) {
      this.senseTimer = setTimeout(() => {
        this.setState(
          ({ grid }) => {
            for (let j = i; j < i + 15; j++) {
              if (j >= visitedNodesInOrder.length) {
                break;
              }
              const node = visitedNodesInOrder[j];
              let newNode = Object.assign({}, node);
              newNode.isVisited = false;
              newNode.distance = Infinity;
              if (type === 0) {
                if (
                  !newNode.isHuman &&
                  !newNode.isZombie &&
                  !newNode.isDeadHuman
                ) {
                  newNode.isZombieSense = true;
                }
              }
              grid[node.row][node.col] = newNode;
            }

            return { grid: grid };
          },
          () => {
            if (i + 15 >= visitedNodesInOrder.length) {
              setTimeout(() => {
                this.animateShortestPath(nodesInShortestPathOrder);
              }, 10);
            }
          }
        );
      }, 15 * i);
    }
  }

  onMouseDown = (x, y) => {
    this.setState({ mouseDown: true });

    this.nodeClicked(x, y, false);
  };
  onMouseEnter = (x, y) => {
    if (!this.state.mouseDown) {
      return;
    }

    this.nodeClicked(x, y, true);
  };

  onPlayGroundMouseOut = () => {
    this.setState({ mouseDown: false });
  };

  onMouseUp = () => {
    this.setState({ mouseDown: false });
  };

  getAllWalls = ()=>{
    var result = [];
    for (let j = 0; j < this.state.grid[0].length;j++){
    for (let i = 0; i < this.state.grid.length;i++){
      
          if( this.state.grid[i][j].isWall){
            result.push([this.state.grid[i][j].row,this.state.grid[i][j].col]);
          }
      }
    }
    const arr = result;
    var outer = "";
    for(let i = 0;i<arr.length;i++){
        
      const x = arr[i][0];
      const y = arr[i][1];
      outer = outer + "["+x.toString()+","+y.toString()+"],";
    }
    console.log(outer);
    console.log(outer.length);


  }


  nodeClicked = (row, col, onOnly) => {
   

    if (this.state.inProgress === true) {
      return;
    }
    //this.getAllWalls();


    if (this.state.editMode === -1) {
      alert("Please First Select Which Object To Add From Tool Box Above!");
      return;
    }
    this.setState((previousState) => {
      const { grid, zombie, editMode } = previousState;

      var newGrid = grid.slice();
      var newZombie = { row: zombie.row, col: zombie.col };

      newGrid = this.clearSense(newGrid);
      const node = newGrid[row][col];
      let isZombie = editMode === 1 && (!node.isZombie || onOnly);

      var isHuman = editMode === 0 && (!node.isHuman || onOnly);
      var isWall = editMode === 2 && (!node.isWall || onOnly);
      if (isZombie) {
        if (zombie.row !== -1 && zombie.col !== -1) {
          const oldZombieNode = newGrid[zombie.row][zombie.col];
          const newZombieNode = {
            ...oldZombieNode,
            isZombie: false,
            isHuman: false,
            isDeadHuman: false,
          };

          newGrid[zombie.row][zombie.col] = newZombieNode;
        }
        newZombie = { row: row, col: col };
      }

      const newNode = {
        ...node,
        isWall: isWall,
        isZombie: isZombie,
        isHuman: isHuman,
        isZombieSense: false,
      };

      newGrid[row][col] = newNode;

      const newState = { ...previousState, grid: newGrid, zombie: newZombie };
      return newState;
    });
  };

  createNode = (col, row) => {
    return {
      col,
      row,
      isZombie: false,
      isHuman: false,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      isZombieSense: false,
      isDeadHuman: false,
      previousNode: null,
      isZombiePath: false,
    };
  };
  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState(
      {
        grid: grid,
      },
      () => {
        setTimeout(() => {
		
				this.setDefaultBoard(0,0);
		
         
        }, 600);
      }
    );
  }

  addObjectModeChange = (type) => {
    if (this.state.editMode === type) {
      this.setState({ editMode: -1 });
    } else {
      this.setState({ editMode: type });
    }
  };





  setDefaultBoard = (map,i) => {
    
    this.setState({inProgress:true, dropDown:false},()=>{
    var wallCoord = [];
    var humanCoord =  [];
    var zombieCoord =  [];

    if (map === 2){
    wallCoord = office()["walls"];
    humanCoord = office()["humans"];
    zombieCoord = office()["zombie"];
    }
    else if (map === 0){
      wallCoord = wall()["walls"];
      humanCoord = wall()["humans"];
      zombieCoord = wall()["zombie"];
    }else if (map === 1){
      wallCoord = moreWall()["walls"];
      humanCoord = moreWall()["humans"];
      zombieCoord = moreWall()["zombie"];
    }
    if (i < wallCoord.length) {
      this.setState(
        ({ grid }) => {
          
          var newGrid = grid.slice();
          if (i === 0){
            newGrid = this.getInitialGrid();
          }
          const oldPiece = newGrid[wallCoord[i][0]][wallCoord[i][1]];
          const newPiece = {
            ...oldPiece,
            isWall: true,
          };
          newGrid[wallCoord[i][0]][wallCoord[i][1]] = newPiece;
          return { grid: newGrid };
        },
        () => {
		setTimeout(()=>{this.setDefaultBoard(map,i+1)},100)
		}
      );
    }
    if (i >= wallCoord.length && i< wallCoord.length+humanCoord.length) {
      
        this.setState(({ grid }) => {
          const newGrid = grid.slice();
		     const oldPiece = newGrid[humanCoord[i-wallCoord.length][0]][humanCoord[i-wallCoord.length][1]];
          const newPiece = {
            ...oldPiece,
            isHuman: true,
          };
		  newGrid[humanCoord[i-wallCoord.length][0]][humanCoord[i-wallCoord.length][1]]=newPiece;
          return { grid: newGrid };
        },()=>{
			setTimeout(()=>{this.setDefaultBoard(map,i+1)},120)
		});
     

    }
    if (i === wallCoord.length+humanCoord.length) {
     setTimeout(()=>{
        this.setState(({ grid }) => {
          const newGrid = grid.slice();
          const oldPiece = newGrid[zombieCoord[0]][zombieCoord[1]];

          const newPiece = {
            ...oldPiece,
            isZombie: true,
          };
		  
		  newGrid[zombieCoord[0]][zombieCoord[1]]=newPiece;
		
          return { grid: newGrid,zombie:{row:zombieCoord[0],col:zombieCoord[1]} };
        },()=>{
			this.setState({inProgress:false});
	
  
  
  
    });
  },500)    
    }
  
  });
  };

  toggleDropDown=()=>{
    if (this.state.inProgress===true && this.state.dropDown===false){return;}
    this.setState(({dropDown})=>{
      return({
      dropDown:!dropDown
    })
    });
  }

  initializeBoard = () => {
    if (this.state.inProgress === true) {
      return;
    }
    const grid = this.getInitialGrid();
    this.setState({ grid: grid,zombie:{row:-1,col:-1}});
  };

  render() {
    return (
      <div className="base">
        <Nav />

        <PlayGround
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onPlayGroundMouseOut={this.onPlayGroundMouseOut}
          onMouseEnter={this.onMouseEnter}
          nodeClicked={this.nodeClicked}
          editMode={this.state.editMode}
          addObject={this.addObjectModeChange}
          initializeBoard={this.initializeBoard}
          start={this.start}
          inProgress = {this.state.inProgress}
          grid={this.state.grid}
          dropDown = {this.state.dropDown}

          setDefaultBoard = {this.setDefaultBoard}
          toggleDropDown = {this.toggleDropDown}
        />
      </div>
    );
  }
}
export default Zombiefy;
