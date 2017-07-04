// 井字遊戲 無ai

let isCircle = true;
let board = [];
let wins = []; // 贏法數組
let circleWinPoints = []; // 贏法統計數組
let crossWinPoints = []; // 贏法統計數組
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

/* 統計橫線
第一種贏法
wins[0][0][0]
wins[0][1][0]
wins[0][2][0]
第二種贏法
wins[1][0][1]
wins[1][1][1]
wins[1][2][1]
...
*/
for(let i=0;i<3;i++) {
  for(let j=0;j<3;j++) {
      wins[i][j][count] = true;
  }
  count++;
}

/* 統計縱線
第四種贏法
wins[0][0][3]
wins[1][0][3]
wins[2][0][3]
第五種贏法
wins[0][0][4]
wins[1][0][4]
wins[2][0][4]
...
*/
for(let i=0;i<3;i++) {
  for(let j=0;j<3;j++) {
      wins[j][i][count] = true;
  }
  count++;
}

/* 統計斜線
第七種贏法
wins[0][0][6]
wins[1][1][6]
wins[2][2][6]
*/
for(let i=0;i<3;i++) {
  wins[i][i][count] = true;
}
count++;
/*
第八種贏法
wins[0][2][7]
wins[1][1][7]
wins[2][0][7]
*/
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

  console.log(isCircle ? 'O:' : 'X:',i, j);

  if(board[i][j] === 0) {

    oneStep(i, j, isCircle);

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
    // 攻守交換
    isCircle = !isCircle;
  }
}
