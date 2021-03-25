'use strict'
const SMILEY = '😃';
const SAD = '😌';
const WINNER = '👑';
const FLAG = '🚩';
const BOMB = '💣';

var gBoard;
var gMinesCells = [];

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
            strHtml += `<td id="${tdId}" data-i="${i}" data-j="${j}"class="${className}" onclick="cellClicked(this, ${i},${j})">
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


function renderAllMines(i, j) {
    for (var idx = 0; idx < gMinesCells.length; idx++) {
        renderCell(gMinesCells[idx].i, gMinesCells[idx].j, BOMB);
    }
    var elMineSelected = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elMineSelected.style.backgroundColor = 'red';
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        gGame.isOn = true;
        addMines(i, j);
        // need to add timer
    }
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    console.log('elCell', elCell);
    gBoard[i][j].isShown = true;
    gBoard[i][j].isMarked = true;
    console.log('cellData', i, j);
    if (!gBoard[i][j].isMine) {
        setMinesNegsCount(i, j);
        renderCell(i, j, gBoard[i][j].minesAroundCount);
    }
    else {
        renderAllMines(i, j);
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
