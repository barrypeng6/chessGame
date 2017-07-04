


let bw = true; // 黑先
let chessBoard=[];

for(let i=0;i<15;i++) {
  chessBoard[i]=[];
  for(let j=0;j<15;j++) {
    chessBoard[i][j] = 0;
  }
}


let chess = document.getElementById("chess-1");
let context = chess.getContext("2d");
// 畫出15x15棋盤
for(let i=0;i<15;i++) {
  context.moveTo(15 + i*30, 15);
  context.lineTo(15 + i*30, 435);
  context.moveTo(15, 15 + i*30);
  context.lineTo(435, 15 + i*30);
}
context.lineWidth = 0.5;
context.stroke();

// 一步棋
const oneStep = function(i, j, bw) {
  // 畫棋子
  context.beginPath();
  context.arc(15 + i*30, 15 + j*30, 12, 0, 2*Math.PI);
  context.closePath();
  // 棋子顏色的漸層
  let gradient = context.createRadialGradient(15 + i*30, 15 + j*30, 1, 15 + i*30, 15 + j*30, 10);
  if(bw) {
    // 為黑棋 bw === true
    gradient.addColorStop(0,"grey");
    gradient.addColorStop(1,"black");
    chessBoard[i][j] = 1;
  } else {
    // 為白棋 bw === false
    gradient.addColorStop(0,"white");
    gradient.addColorStop(1,"lightgrey");
    chessBoard[i][j] = 2;
  }
  context.fillStyle = gradient;
  context.fill();
}

// 監聽滑鼠點擊
chess.onclick = function(e) {
  let i = Math.round(e.offsetX/30)-1;
  let j = Math.round(e.offsetY/30)-1;
  console.log(bw ? '黑棋：' : '白棋：', i, j);
  if(chessBoard[i][j] === 0) {
    oneStep(i, j, bw);
    // 換邊
    bw = !bw;
  }
}
