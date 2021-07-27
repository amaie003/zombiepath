function oneClosestNeighbor(node, nodeArr) {
  if (nodeArr.length===0){return null;}
  const x = node.row;
  const y = node.col;
  var lowestDistance = Infinity;
  var lowestIndex = -1;
  for (let i = 0; i < nodeArr.length; i++) {
    const lx = nodeArr[i].row;
    const ly = nodeArr[i].col;
    const dx = lx - x;
    const dy = ly - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < lowestDistance) {
      lowestDistance = distance;
      lowestIndex = i;
    }
  }
  return nodeArr[lowestIndex];
}

function getShortestPath(current){
    const shortest = [];
    shortest.unshift(current);
    while(current.previousNode !== null){
        current = current.previousNode;
        shortest.unshift(current);
    }
    return shortest;
}


export function aStar(grid,start,humans){
var checkedArr= [];
var open_set = [];
var count = 0;
var end = oneClosestNeighbor(start,humans);
if (end === null){return ({arr:checkedArr,shortest:[]});}
open_set.push({f:0,count:0,node:start});
start.distance=0;
start.fdistance = h(start,end);


while(open_set.length>0){
    var currentInd = 0;
    var smallestF = Infinity;
    for (let i = 0;i<open_set.length;i++){
        if (open_set[i].f<smallestF){
            smallestF = open_set[i].f;
            currentInd = i;
        }
    } 
    const current = open_set[currentInd]["node"];



    open_set.splice(currentInd, 1);
    if (current === end){
        const shortest = getShortestPath(end);

        return {arr:checkedArr,shortest:shortest};
    }
    var neighbors = getNeighbors(current,grid);
    for (let i =0;i<neighbors.length;i++){
        const neighbor = neighbors[i];
        var tempG = current.distance + 1;
        if (tempG<neighbor.distance){
            neighbor.previousNode = current;
            neighbor.distance = tempG;
            neighbor.fdistance = tempG + h(neighbor,end);
            var inSet = false;
            for (let j = 0;j<open_set.length;j++){
                if (open_set[j].node === neighbor){
                    inSet = true;
                }
            }
            if (inSet === false){
                count++;
                open_set.push({f:neighbor.fdistance,count:count,node:neighbor});
                
                
            }
        }
    }
    if (current !== start){checkedArr.push(current);}
}
return {arr:checkedArr,shortest:[]};

}
function getNeighbors(node,grid){
var neighbors = [];
const x = node.row;
const y = node.col;
var d = [{dx:1,dy:0},{dx:0,dy:1},{dx:-1,dy:0},{dx:0,dy:-1}];
    for (let i = 0;i<d.length;i++){
        var lx = x+d[i].dx;
        var ly = y+d[i].dy;
        if (lx>=0&&lx<grid.length&&ly>=0&&ly<grid[0].length){
            if (!grid[lx][ly].isWall){
                neighbors.push(grid[lx][ly]);
            }
        } 
    }
    return neighbors;
}

function h (n1,n2){
    const x1 = n1.row;
    const y1 = n1.col;
    const x2 = n2.row;
    const y2 = n2.col;
    return (Math.abs(x1-x2)+Math.abs(y1-y2));
}