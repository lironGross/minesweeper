'use strict'
const SMILEY = '😃';
const SAD = '😌';
const WINNER = '👑';
const FLAG = '🚩';
const BOMB = '💣';

var gBoard;
var gMinesCells = [];
var gTimer;
var totalSeconds = 0;

var gLevel = {
    SIZE: 4,
    MINES: 2
};


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() {
    gBoard = buildBoard();
    console.log('gBoard', gBoard);
    renderBoard()

}

function chooseLevel(elBtn) {
    var level = elBtn.getAttribute('data-level');
    if (level === '16') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
    }
    if (level === '64') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
    }
    if (level === '144') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
    }
    gMinesCells= [];
    gGame.isOn = false;
    totalSeconds = 0;
    init()  
}


function buildBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell;
        }
    }
    return board;
}



function renderBoard() {
    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        var row = gBoard[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            // figure class name
            var className = (gBoard[i][j].isMine) ? 'mine' : 'safe';
            var cell = (className === 'mine') ? BOMB : '';
            var tdId = `cell-${i}-${j}`;
            strHtml += `<td id="${tdId}" data-i="${i}" data-j="${j}"class="${className}" onclick="cellClicked(this, ${i},${j})" onmousedown="cellMouseDown(e,this, ${i},${j})">
            ${cell}  </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHtml;

}



// render new Ball to the board
function addMines(i, j) {
    var counter = 0;
    while (counter < gLevel.MINES) {
        var cellI = getRandomInt(0, gLevel.SIZE);
        var cellJ = getRandomInt(0, gLevel.SIZE);
        if (!(cellI === i && cellJ === j)) {
            counter++;
            gMinesCells.push({ i: cellI, j: cellJ });
            //MODEL
            gBoard[cellI][cellJ].isMine = true;
            //DOM
            var elCell = document.querySelector((`[data-i="${cellI}"][data-j="${cellJ}"]`));
            elCell.innerText = ''
        }
    }
}




function cellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        gGame.isOn = true;
        addMines(i, j);
        gTimer = setInterval(timer, 1000);
    }
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    console.log('elCell', elCell);
    gBoard[i][j].isShown = true;
    gBoard[i][j].isMarked = true;
    console.log('cellData', i, j);
    if (!gBoard[i][j].isMine) {
        gGame.isShown++
        setMinesNegsCount(i, j);
        renderCell(i, j, gBoard[i][j].minesAroundCount);
    }
    else {
        renderAllMines(i, j);
        gameOver();
    }
}


function setMinesNegsCount(iIdx, jIdx) {
    var minesAroundCount = 0;
    for (var i = iIdx - 1; i <= iIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
            if (i === iIdx && j === jIdx) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isMine) {
                minesAroundCount++
            }
        }
    }
    console.log('gBoard', gBoard);
    console.log('minesAroundCount', minesAroundCount);
    gBoard[iIdx][jIdx].minesAroundCount = minesAroundCount;
}




function renderCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.innerHTML = value;
}
function gameOver() {
    clearInterval(gTimer)
    document.querySelector('h1.over').style.display = 'block'

}


function renderAllMines(i, j) {
    for (var idx = 0; idx < gMinesCells.length; idx++) {
        renderCell(gMinesCells[idx].i, gMinesCells[idx].j, BOMB);
    }
    var elMineSelected = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elMineSelected.style.backgroundColor = 'red';
}

function timer(){
    ++totalSeconds;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);
    if (minute < 10)
        minute = "0" + minute;
    if (seconds < 10)
        seconds = "0" + seconds;
    document.getElementById("timer").innerHTML = minute + ":" + seconds;
}


// btn.addEventListener('contextmenu', (elCellFlag) => {
//     e.preventDefault();
// });

// // show the mouse event message
// btn.addEventListener('mouseup', (e) => {
//     let msg = document.querySelector('#message');
//     switch (e.button) {{
//         case 2:
//             msg.textContent = FLAG;
//             break;
      
//     }
// });


// function cellMarked(elCellFlag){
// var elCellFlag = document.getElementById('#right-click');
// console.log('elCellFlag',elCellFlag);

// var rightMouseClicked = false;

// function cellMarked(elCellFlag) {
//   //elCellFlag.button describes the mouse button that was clicked
//   // 0 is left, 1 is middle, 2 is right
//   if (elCellFlag.button === 2) {
//     rightMouseClicked = true;
//   } else if (elCellFlag.button === 0) {  
// cellClicked()
//     if (rightMouseClicked) {
//       console.log('hello');
//       //code
//     }
//   }
//   console.log(rightMouseClicked);
// }

function cellMouseDown(e) {
    console.log({e});
  if (e.button === 2) {
    rightMouseClicked = false;
    console.log({rightMouseClicked,i,j});
  }
}

// document.addEventListener('mousedown', handleMouseDown);

