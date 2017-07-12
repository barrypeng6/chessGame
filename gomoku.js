let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// 畫出15x15棋盤
for(let i=0;i<15;i++) {
  context.moveTo(15 + i*30, 15);
  context.lineTo(15 + i*30, 435);
  context.moveTo(15, 15 + i*30);
  context.lineTo(435, 15 + i*30);
}
context.lineWidth = 0.5;
context.stroke();

const PLAYER_TOKEN = 'O';
const COMPUTER_TOKEN = 'X';

let board = [];
for(let i=0;i<15;i++) {
  board[i]=[];
  for(let j=0;j<15;j++) {
    board[i][j] = '';
  }
}

let wins = []; // 贏法數組
// 初始贏法數組 三維陣列
for(let i=0;i<15;i++) {
  wins[i] = [];
  for(let j=0;j<15;j++) {
    wins[i][j] = [];
  }
}

let count = 0;
// 統計橫線
for(let i=0;i<15;i++) {
  for(let j=0;j<11;j++) {
    for(let k=0;k<5;k++) {
      wins[i][j+k][count] = true;
    }
    count++;
  }
}

// 統計縱線
for(let i=0;i<15;i++) {
  for(let j=0;j<11;j++) {
    for(let k=0;k<5;k++) {
      wins[j+k][i][count] = true;
    }
    count++;
  }
}

// 統計斜線
for(let i=0;i<11;i++) {
  for(let j=0;j<11;j++) {
    for(let k=0;k<5;k++) {
      wins[i+k][j+k][count] = true;
    }
    count++;
  }
}

// 統計反斜線
for(let i=0;i<11;i++) {
  for(let j=14;j>3;j--) {
    for(let k=0;k<5;k++) {
      wins[i+k][j-k][count] = true;
    }
    count++;
  }
}
console.log('總贏法數', count);

// 監聽滑鼠點擊
canvas.onclick = function(e) {
  let gameState;
  // 玩家落子
  let i = Math.round(e.offsetX/30)-1;
  let j = Math.round(e.offsetY/30)-1;
  if(board[i][j] === '') {
    // 判斷落子點是否沒下過
    board[i][j] = PLAYER_TOKEN;
    drawOneStep(i, j, PLAYER_TOKEN);
    // gameState = checkGameOver(board);
    // if(gameState === 1) {
    //   document.getElementById("result").innerHTML = "O win!";
    // }
    // 玩家回合結束
    // if(gameState !== 1 && gameState !== 3) {
    //   // 電腦落子
    //
    //   let t0 = performance.now();
    //   let move = moveAI();
    //   let t1 = performance.now();
    //   console.log('%c AI choose:'+ '('+ move.i+','+move.j+')', 'color: red');
    //   console.log('%c AI took ' + (t1 - t0) + ' ms.', 'color: yellow')
    //
    //   board[move.i][move.j] = COMPUTER_TOKEN;
    //   drawOneStep(move.i, move.j, COMPUTER_TOKEN);
    //   gameState = checkGameOver(board);
    //   if(gameState === 2) {
    //     document.getElementById("result").innerHTML = "X win!";
    //   }
    //   // 電腦回合結束
    // }
    // if(gameState === 3) {
    //   document.getElementById("result").innerHTML = "Tie game";
    // }
  }
}

function moveAI() {

  // 單純使用盤面評估函數
  // return stupidAI(board);
  // minmax
  // return minmax(board, 0, COMPUTER_TOKEN);

}

function stupidAI(newBoard) {
  let computerScore=[];
  let userScore=[];
  let max=0;
  let u, v;

  let circleWinPoints = []; // 贏法統計數組
  let crossWinPoints = []; // 贏法統計數組
  // 初始贏法統計數組
  for(let k=0;k<count;k++) {
    circleWinPoints[k] = 0;
    crossWinPoints[k] = 0;
  }

  for(let k=0;k<count;k++) {
    for(let i=0;i<3;i++) {
      for(let j=0;j<3;j++) {
        if(newBoard[i][j] === PLAYER_TOKEN && wins[i][j][k]) {
          circleWinPoints[k]++;
        } else if(newBoard[i][j] === COMPUTER_TOKEN && wins[i][j][k]) {
          crossWinPoints[k]++;
        }
      }
    }
  }

  // 初始
  for(let i=0;i<3;i++) {
    computerScore[i]=[];
    userScore[i]=[];
    for(let j=0;j<3;j++) {
      computerScore[i][j]=0;
      userScore[i][j]=0;
    }
  }

  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++) {
      if(newBoard[i][j]==='') {
        for(let k=0;k<count;k++) {
          if(wins[i][j][k]) {
            // 防守
            if(circleWinPoints[k]===1) {
              userScore[i][j] += 200;
            } else if(circleWinPoints[k]===2) {
              userScore[i][j] += 1000;
            }
            // 進攻
            if(crossWinPoints[k]===1) {
              computerScore[i][j] += 220;
            } else if(crossWinPoints[k]===2) {
              computerScore[i][j] += 5000;
            }
          }
        }

        if(userScore[i][j]>max) {
          max = userScore[i][j];
          u = i;
          v = j;
        } else if (userScore===max) {
          if(computerScore[i][j]>max) {
            max = computerScore[i][j]
            u = i;
            v = j;
          }
        }
        if(computerScore[i][j]>max) {
          max = computerScore[i][j];
          u = i;
          v = j;
        } else if (computerScore===max) {
          if(userScore[i][j]>max) {
            max = userScore[i][j]
            u = i;
            v = j;
          }
        }
        console.log('x:', i, 'y:', j, 'point:', computerScore[i][j] > userScore[i][j] ? computerScore[i][j] : userScore[i][j]);
      }
    }
  }
  return {i: u, j: v};
}

function minmax(newBoard, depth, player) {

  const gameState = checkGameOver(newBoard);
  if(gameState === 0) {
    // not over

    let values = [];

    for(let i=0;i<3;i++) {
      for(let j=0;j<3;j++) {
        const boardCopy = newBoard.reduce(function(a, e) {
          // console.log(a);
          const newE = e.slice();
          // console.log(newE);
          a.push(newE);
          return a;
        }, []);
        if(boardCopy[i][j] !== '') continue;
        boardCopy[i][j] = player;
        const value = minmax(boardCopy, depth+1, player === PLAYER_TOKEN ? COMPUTER_TOKEN : PLAYER_TOKEN);
        values.push({
          cost: value,
          cell: {i: i, j: j}
        });
      }
    }

    if(player === COMPUTER_TOKEN) {
      const max = values.reduce(function(max, v) {
        if(v.cost > max.cost) {
          return v;
        }
        return max;
      }, {cost: -Infinity, cell: {i: 0, j: 0}});
      // console.log(max);
      if(depth === 0) {
        values.forEach(function(v) {
          console.log('('+v.cell.i+','+v.cell.j+') :'+v.cost);
        })
        return max.cell;
      } else {
        return max.cost;
      }
    } else {
      const min = values.reduce(function(min, v) {
        if(v.cost < min.cost) {
          return v;
        }
        return min;
      }, {cost: Infinity, cell: {i: 0, j: 0}});
      // console.log(min);
      if(depth === 0) {
        return min.cell;
      } else {
        return min.cost;
      }
    }


  } else if(gameState === 1) {
    // PLAYER win
    return depth - 10;
  } else if(gameState === 2) {
    // COMPUTER win
    return 10 - depth;
  } else if(gameState === 3) {
    // tie game
    return 0;
  }

}

function checkGameOver(newBoard) {
  // 勝負判斷
  // return gameState:
  // 0: NOT OVER
  // 1: PLAYER WIN
  // 2: COMPUTER WIN

  let circleWinPoints = []; // 贏法統計數組
  let crossWinPoints = []; // 贏法統計數組
  // 初始贏法統計數組
  for(let k=0;k<count;k++) {
    circleWinPoints[k] = 0;
    crossWinPoints[k] = 0;
  }

  for(let k=0;k<count;k++) {
    for(let i=0;i<3;i++) {
      for(let j=0;j<3;j++) {
        if(newBoard[i][j] === PLAYER_TOKEN && wins[i][j][k]) {
          circleWinPoints[k]++;
          if(circleWinPoints[k]===3) {
            return 1;
          }
        } else if(newBoard[i][j] === COMPUTER_TOKEN && wins[i][j][k]) {
          crossWinPoints[k]++;
          if(crossWinPoints[k]===3) {
            return 2;
          }
        }
      }
    }
  }

  for(let i=0;i<3;i++) {
    for(let j=0;j<3;j++) {
      if(newBoard[i][j] === '') {
        return 0;
      }
    }
  }
  // tie game
  return 3;
}

function drawOneStep(i, j, player) {
  // 畫棋子
  context.beginPath();
  context.arc(15 + i*30, 15 + j*30, 12, 0, 2*Math.PI);
  context.closePath();
  let gradient = context.createRadialGradient(15 + i*30, 15 + j*30, 1, 15 + i*30, 15 + j*30, 10);
  if(player === PLAYER_TOKEN) {
    // 為黑棋
    gradient.addColorStop(0,"grey");
    gradient.addColorStop(1,"black");
  } else if(player === COMPUTER_TOKEN){
    // 為白棋
    gradient.addColorStop(0,"white");
    gradient.addColorStop(1,"lightgrey");
  }
  context.fillStyle = gradient;
  context.fill();
}
