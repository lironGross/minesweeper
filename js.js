'use strict'
const SMILEY = '😃';
const SAD = '😌';
const WINNER = '🥳';
const FLAG = '🚩';
const BOMB = '💣';

var gBoard;
var gMinesCells = [];
var gTimer;
var totalSeconds = 0;
var gSmiley = document.querySelector('h1.smiley span');
var gElBtn = document.querySelectorAll('.board td');

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
    renderBoard();
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
    gMinesCells = [];
    gGame.isOn = false;
    totalSeconds = 0;
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    var elText = document.querySelector('h1.result span');
    elText.innerText = ' ';
    gSmiley.innerText = SMILEY;
    init();
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
            var className = (gBoard[i][j].isMine) ? 'mine' : 'safe';
            var cell = (className === 'mine') ? BOMB : '';
            var tdId = `cell-${i}-${j}`;
            strHtml += `<td id="${tdId}" data-i="${i}" data-j="${j}"class="${className}" onclick="cellClicked(this, ${i},${j})" oncontextmenu="myFunction(this, ${i},${j})">
            ${cell}  </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHtml;
}




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
            elCell.innerText = '';
        }
    }
}



function cellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        gTimer = setInterval(timer, 1000);
        gGame.isOn = true;
        addMines(i, j);
        gSmiley.innerText = (SMILEY);
    }
    sumForVictory(i, j)
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    setMinesNegsCount(i, j);
    if (!gBoard[i][j].isMine) {
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
    gBoard[iIdx][jIdx].minesAroundCount = minesAroundCount;
}


function renderCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.innerHTML = value;
}

function renderAllMines(i, j) {
    for (var idx = 0; idx < gMinesCells.length; idx++) {
        renderCell(gMinesCells[idx].i, gMinesCells[idx].j, BOMB);
    }
    var elMineSelected = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elMineSelected.style.backgroundColor = 'red';
}

function timer() {
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

/////////////////////////////////////////MOUSE CLICKS

function myFunction(elCell, i, j) {
    if  (!gGame.isOn){
        gTimer = setInterval(timer, 1000);
        gGame.isOn = true;
        addMines(i, j);
    }
    var cellI = i
    var cellJ = j
    renderCell(i, j, FLAG)
    sumForVictory(i, j);
    gBoard[cellI][cellJ].isMarked = true
    }
document.oncontextmenu = function () {
    return false;
}


var sumClickedCell = 0

function onmouseup(i, j) {
    if (window.event.which == 1) {//code for left click
        if (!gBoard[i][j].isShown && (!gBoard[i][j].isMarked)) {
            gBoard[i][j].isShown = true;
            gGame.shownCount++
        }
    }
    else if (window.event.which == 3) {//code for right click
        if (!gBoard[i][j].isMarked&& (!gBoard[i][j].isShown)){
            gGame.markedCount++
        }
    }
    sumClickedCell = gGame.shownCount + gGame.markedCount;
    return sumClickedCell;
}


/////////////////////////////////////////////////////////
function gameOver() {
    clearInterval(gTimer);
    gSmiley.innerText = (SAD);
    var elText = document.querySelector('h1.result span')
    elText.innerText = 'GAME OVER 💣';
    // document.querySelector('table').setAttribute('disabled', true);

}



function sumForVictory(i, j) {
    var sum = onmouseup(i, j);
    if (sum === gLevel.SIZE * gLevel.SIZE) {
        victory()
    }
}


function victory() {
    clearInterval(gTimer);
    gSmiley.innerText = (WINNER);
   var elText = document.querySelector('h1.result span');
   elText.innerText = 'victory 👑';
   gElBtn.disable = true;
}


