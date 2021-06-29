var N = 9;
var board = [];
var h = 1;

for (var i = 0; i < N; i++) {
	board.push([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]);
}

var box = [];

init();

function init(){
	NewBoard();
	box = cloneGrid(board);
	solveSudoku(board, 9);
	start();
}

$('#submit').click(function(){
	if (check()) {
		console.log('Correct!');
		$(this).text('Correct!');
	}
	else {
		$(this).text('Incorrect!!');
	}
});

$('#reset').click(function(){
	reset();
});

$('#hint').click(function(){
	if (h === 1) {
		hint(5);
		$('#no').text(h);
	}
	else if (h === 2) {
		hint(3);
		$('#no').text(h);
	}
	else if (h === 3) {
		hint(1);
		$('#no').text(h);
	}
	h++;
});

$('#solve').click(function(){
	solve();
	h = 4;
});

$('#new').click(function(){
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			board[i][j] = 0;
		}
	}
	NewBoard();
	box = cloneGrid(board);
	h = 1;
	solveSudoku(board, 9);
	start();
	reset();
	$('#reset').prop('disabled',false);
	$('#submit').prop('disabled',false);
	$('#hint').prop('disabled',false);
	$('#check').prop('disabled',false);
	$('#solve').prop('disabled',false);
});

$('#solver').click(function(){
	if ($(this).hasClass('edit')) {
		$('#new').prop('disabled',true);
		$('#reset').prop('disabled',true);
		$('#submit').prop('disabled',true);
		$('#hint').prop('disabled',true);
		$('#check').prop('disabled',true);
		$('#solve').prop('disabled',true);
		$(this).text('Done');
		$('input').prop('disabled', false);
		$('input').val('');
		$('input').css('background-color', 'white');
		$(this).removeClass('edit');
		$(this).addClass('done');
	}
	else {
		//console.log('clicked');
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				var index = '#' + i + j;
				console.log($(index).val());
				if ($(index).val() !== '') {
					board[i][j] = Number($(index).val());
				}
				else {
					board[i][j] = 0;
				}
			}
		}
		if(isValidSudoku(board)){
			box = cloneGrid(board);
			solveSudoku(board, 9);
			start();
			solve();
			$(this).text('Solver');
			$(this).removeClass('done');
			$(this).addClass('edit');
			$('#new').prop('disabled',false);
			
		}
		else{
			alert("NOT A VALID SUDOKU !!!");
			$('input').val('');
		}
		
	}
});

var c = 1;
$('#check').click(function(){
	if (c === 1) {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				var index = '#' + i + j;
				if (Number($(index).val()) !== board[i][j]) {
					$(index).css('color', 'red');
				}
			}
		}
		c = 0;
		$(this).css('background-color', '#6c757d');
		$(this).css('color', 'white');
	}
	else {
		$('input').css('color', 'black');
		c = 1;
		$(this).css('background-color', '');
		$(this).css('color', '');
	}
});

function cloneGrid(grid){
	const newGrid = [
		...grid
	];

	newGrid.forEach(
		(row, rowIndex) =>
			(newGrid[rowIndex] = [
				...row
			])
	);
	return newGrid;
}

function randomNumber(min, max){
	return Math.floor(Math.random() * (max - min) + min);
}

function NewBoard(){
	fillDiagonal();

	solveSudoku(board, N);

	removeKDigits();
}

function start(){
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			var index = '#' + i + j;
			if (box[i][j] !== 0) {
				$(index).val(box[i][j]);
				$(index).prop('disabled', true);
				$(index).css('background-color', '#eff0e6');
			}
		}
	}
}

function reset(){
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			var index = '#' + i + j;
			$(index).css('background-color', 'white');
			if (box[i][j] !== 0) {
				$(index).val(box[i][j]);
				$(index).prop('disabled', true);
				$(index).css('background-color', '#eff0e6');
			}
			else {
				$(index).val('');
				$(index).prop('disabled', false);
			}
		}
	}
	$('#submit').text('Submit');
	h = 1;
	$('#no').text(0);
}

function hint(n){
	var t = 0;

	while (t < n) {
		var i = randomNumber(0, 9);
		var j = randomNumber(0, 9);
		var index = '#' + i + j;
		if ($(index).val() !== '') {
			continue;
		}
		t++;
		$(index).val(board[i][j]);
		$(index).prop('disabled', true);
		$(index).css('background-color', '#e3cd86');
	}
}

function solve(){
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			var index = '#' + i + j;
			if (box[i][j] === 0) {
				$(index).val(board[i][j]);
				$(index).prop('disabled', true);
				$(index).css('background-color', '#bad8e0');
			}
		}
	}
}

function check(){
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			var index = '#' + i + j;
			if (Number($(index).val()) !== board[i][j]) {
				return false;
			}
		}
	}
	return true;
}

function isSafe(board, row, col, num){
	for (var d = 0; d < board.length; d++) {
		if (board[row][d] == num) {
			return false;
		}
	}

	for (var r = 0; r < board.length; r++) {
		if (board[r][col] == num) {
			return false;
		}
	}

	var sqrt = 3;
	var boxRowStart = row - row % sqrt;
	var boxColStart = col - col % sqrt;

	for (var r = boxRowStart; r < boxRowStart + sqrt; r++) {
		for (var d = boxColStart; d < boxColStart + sqrt; d++) {
			if (board[r][d] == num) {
				return false;
			}
		}
	}

	return true;
}

function isValid(board, i, j){
	var rows = 0, cols = 0;
	for(var k = 0; k < N; k++){
		if(board[k][j] == board[i][j]) cols++;
		if(board[i][k] == board[i][j]) rows++;
	}
	if(cols != 1 || rows != 1) return false;
	cols = 0;
	var ss = 3;
	var sc = j - j%ss;
	var sr = i - i%ss;
	for(var u = 0; u < ss; u++){
		for(var v = 0; v < ss; v++){
			if(board[u + sr][v + sc] == board[i][j]) cols++;
		}
	}
	if(cols != 1) return false;
	return true;
}
function isValidSudoku(board) {
	for(var i = 0; i < N; i++){
		for(var j = 0; j < N; j++){
			if(board[i][j] != '0' && !isValid(board, i ,j)) return false;   
		}
	}
	return true;
}

function solveSudoku(board, n){
	var row = -1;
	var col = -1;
	var isEmpty = true;
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			if (board[i][j] == 0) {
				row = i;
				col = j;

				isEmpty = false;
				break;
			}
		}
		if (!isEmpty) {
			break;
		}
	}

	if (isEmpty) {
		return true;
	}

	for (var num = 1; num <= n; num++) {
		if (isSafe(board, row, col, num)) {
			board[row][col] = num;
			if (solveSudoku(board, n)) {
				return true;
			}
			else {
				board[row][col] = 0;
			}
		}
	}
	return false;
}

function print(board, N){
	for (var r = 0; r < N; r++) {
		for (var d = 0; d < N; d++) {
			console.log(board[r][d]);
			console.log(' ');
		}
		console.log('\n');

		if ((r + 1) % 3 == 0) {
			console.log('');
		}
	}
}

function fillDiagonal(){
	for (var i = 0; i < N; i = i + 3) fillBox(i, i);
}

function unUsedInBox(rowStart, colStart, num){
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (board[rowStart + i][colStart + j] == num) return false;
		}
	}
	return true;
}

function fillBox(row, col){
	var num;
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			do {
				num = randomNumber(1, 10);
			} while (!unUsedInBox(row, col, num));

			board[row + i][col + j] = num;
		}
	}
}

function removeKDigits(){
	var count = 55;
	while (count !== 0) {
		var cellId = randomNumber(0, 81);

		var i = Math.floor(cellId / 9);
		var j = cellId % 9;

		if (board[i][j] !== 0) {
			count--;
			board[i][j] = 0;
		}
	}
}
