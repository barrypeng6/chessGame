// 井字遊戲 ai 單使用函數評估函數

let isCircle = true; // 人類：true, 電腦：false，人類先：初始為true
let board = [];
let wins = []; // 贏法數組
let circleWinPoints = []; // 贏法統計數組
let crossWinPoints = []; // 贏法統計數組
let simCircleWinPoints = []; // 贏法統計模擬數組
let simCrossWinPoints = []; // 贏法統計模擬數組
let over = false;

for(let i=0;i<3;i++) {
  board[i]=[];
  for(let j=0;j<3;j++) {
    board[i][j] = 0;
  }
}

// 初始贏法數組 三維陣列
for(let i=0;i<3;i++) {
  wins[i] = [];
  for(let j=0;j<3;j++) {
    wins[i][j] = [];
  }
}

let count = 0;
for(let i=0;i<3;i++) {
  for(let j=0;j<3;j++) {
      wins[i][j][count] = true;
  }
  count++;
}
for(let i=0;i<3;i++) {
  for(let j=0;j<3;j++) {
      wins[j][i][count] = true;
  }
  count++;
}
for(let i=0;i<3;i++) {
  wins[i][i][count] = true;
}
count++;
for(let i=0;i<3;i++) {
  wins[i][2-i][count] = true;
}
count++;

console.log('總贏法數', count);

// 初始贏法統計數組
for(let k=0;k<count;k++) {
  circleWinPoints[k] = 0;
  crossWinPoints[k] = 0;
}

// 初始贏法統計模擬數組
for(let k=0;k<count;k++) {
  simCircleWinPoints[k] = 0;
  simCrossWinPoints[k] = 0;
}


let ttt = document.getElementById("tic-tac-toe");
let context = ttt.getContext("2d");

// 畫出九宮格
for(let i=0;i<4;i++) {
  context.moveTo(i*60, 0);
  context.lineTo(i*60, 180);
  context.moveTo(0, i*60);
  context.lineTo(180, i*60);
}
context.lineWidth = 0.5;
context.stroke();

const oneStep = function(i, j, isCircle) {
  console.log(isCircle ? 'user:' : 'AI:',i, j);
  if(isCircle) {
    // 畫圈圈
    context.beginPath();
    context.arc(i*60 + 30, j*60 + 30, 20, 0, 2*Math.PI);
    context.closePath();
    board[i][j] = 1
  } else {
    // 畫叉叉
    context.moveTo(i*60 + 15, j*60 + 15);
    context.lineTo(i*60 + 45, j*60 + 45);
    context.moveTo(i*60 + 45, j*60 + 15);
    context.lineTo(i*60 + 15, j*60 + 45);
    board[i][j] = 2
  }
  context.lineWidth = 1;
  context.stroke();
}

// 監聽滑鼠點擊
ttt.onclick = function(e) {
  if(over) {
    return
  }
  let i = Math.floor(e.offsetX/60);
  let j = Math.floor(e.offsetY/60);

  if(board[i][j] === 0) {
    oneStep(i, j, isCircle);
    calWinPoints(i, j);
    isCircle = !isCircle; // 攻守交換

    if(!over) {
      computerAI();
      isCircle = !isCircle;
    }
  }
  // console.table(board);
}

// 最大最小搜尋演算法
const computerAI = function() {

  let simulateBoard = board;

  let depth = 0;
  for(let i=0;i<3;i++) {
    for(let j=0;j<3;j++) {
      if(simulateBoard[i][j]===0) {
        depth++;
      }
    }
  }

  let point = minMax(simulateBoard, depth, isCircle);

  oneStep(u, v, isCircle);
  calWinPoints(u, v);
}

const minMax = function(node, depth, player) {
  console.table('目前盤面', node);
  console.log('目前深度:', depth, 'player:', player);

  calWinPoints(i,j)

  if( depth === 0 ) {

    return winPoint // 盤面評估分數( 1: 電腦贏  0: 和局  -1: 人類贏 )
  }
  if( player === true ) { // 電腦 find Max
    let bestValue = -2;
    for(let i=0;i<3;i++) {
      for(let j=0;j<3;j++) {
        if(node[i][j]===0) {
          node[i][j] = 2
          value = minMax( node, depth-1,  false);  // 往下搜尋
          bestValue = max( value, bestValue );  // 找最大值
        }
      }
    }
    return bestValue;
  }
  else if( player === false ){ // 人類 find min
    let bestValue = 2;
    for(let i=0;i<3;i++) {
      for(let j=0;j<3;j++) {
        if(node[i][j]===0) {
          node[i][j] = 1
          value = minMax( node, depth-1, true )  // 往下搜尋
          bestValue = min( value, bestValue )  // 找最小值
        }
      }
    }
    return bestValue;
  }
}

const calWinPoints = function(i, j) {
  for(let k=0;k<count;k++) {
    if(wins[i][j][k]) {
      if(isCircle) {
        // 統計圈圈贏法數組的分數
        circleWinPoints[k]++;
        //crossWinPoints[k] = 4; // 令一方就無此贏法
        if(circleWinPoints[k]===3) {
          document.getElementById("result").innerHTML = "O win!";
          over = true
        }
      } else {
        // 統計叉叉贏法數組的分數
        crossWinPoints[k]++;
        //circleWinPoints[k] = 4; // 令一方就無此贏法
        if(crossWinPoints[k]===3) {
          document.getElementById("result").innerHTML = "X win!";
          over = true
        }
      }
    }
  }
}
