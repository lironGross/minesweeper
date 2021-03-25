function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


// var rightMouseClicked = false;

// function handleMouseDown(e) {
//   //e.button describes the mouse button that was clicked
//   // 0 is left, 1 is middle, 2 is right
//   if (e.button === 2) {
//       console.log('rightMouseClicked');

 
//   }
// }

// document.addEventListener('mousedown', handleMouseDown);
