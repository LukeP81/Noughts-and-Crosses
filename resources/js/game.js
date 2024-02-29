const playingGrid = [];
const vertical = ['top', 'middle', 'bottom'];
const horizontal = ['left', 'centre', 'right'];
for (vpos of vertical) {
    const row = []
    for (hpos of horizontal) {
        row.push(document.getElementsByClassName(`${vpos} ${hpos}`)[0]);
    }
    playingGrid.push(row);
}
const buttonPlayAgain = document.getElementById('play-again');
const buttonReset = document.getElementById('reset');
const textCurrentPlayer = document.getElementById('current-player');
const endMessage = document.getElementById('end-message');

const createWinner = () => {
    return {
        arr: [],
        showWin() {
            winningTiles.arr.forEach(element => element.style.color = "var(--accent-color)")
        }
    }
}

const createPlayer = (symbol, name, displayScore) => {
    return {
        symbol,
        name,
        _score: 0, // Internal storage for the score
        displayScore,

        get score() {
            return this._score;
        },
        set score(value) {
            this._score = value;
            displayScore.innerHTML = `${name}: ${this._score}`;
        }
    }
}

const noughts = createPlayer("O", "Noughts", document.getElementById('nought-score'));
const crosses = createPlayer("X", "Crosses", document.getElementById('crosses-score'));

let currentPlayer = noughts;
let nextPlayer = crosses;
let winningTiles = createWinner()


const addSymbol = event => event.target.innerHTML = `${currentPlayer.symbol}`;

const notEmpty = arr => Boolean(arr[0].innerHTML);
const allSameSymbol = arr => arr.every(element => element.innerHTML === arr[0].innerHTML);
const validMatch = arr => allSameSymbol(arr) && notEmpty(arr)
const seeIfWon = arr => {
    if (!validMatch(arr)) {
        return false
    }
    winningTiles.arr = winningTiles.arr.concat(arr)
    return true;
}

const transpose = arr => arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
const mainDiagonal = arr => arr.map((row, i) => row[i]);
const secondaryDiagonal = arr => arr.map((row, i) => row[arr.length - 1 - i]);

const checkRows = arr => arr.some(row => seeIfWon(row));
const checkColumns = arr => checkRows(transpose(arr));
const checkDiagonals = arr => seeIfWon(mainDiagonal(arr)) || seeIfWon(secondaryDiagonal(arr))

const checkWin = arr => checkRows(arr) || checkColumns(arr) || checkDiagonals(arr);

const updateCurrentPlayer = () => {
    wasPlaying = currentPlayer;
    currentPlayer = nextPlayer;
    nextPlayer = wasPlaying;
    textCurrentPlayer.innerHTML = `Current Player: ${currentPlayer.symbol}`
};

const gridDisabled = state => playingGrid.forEach(row => row.forEach(element => element.disabled = state));

const checkValidtile = tile => tile.innerHTML;

const boardFull = arr => arr.every(row => row.every(element => Boolean(element.innerHTML)))


const tileChosen = (event) => {
    if (checkValidtile(event.target)) {
        return;
    }

    addSymbol(event);

    if (checkWin(playingGrid)) {
        currentPlayer.score++;
        buttonPlayAgain.style.display = 'block';
        gridDisabled(true);
        endMessage.style.display = 'block';
        endMessage.innerHTML = `${currentPlayer.name} Wins`;
        winningTiles.showWin();
        return;
    }

    if (boardFull(playingGrid)) {
        buttonPlayAgain.style.display = 'block'
        endMessage.style.display = 'block';
        endMessage.innerHTML = `Nobody Wins`;
        gridDisabled(true);
        return;
    }

    updateCurrentPlayer()
}


playingGrid.forEach(row => row.forEach(tile => tile.addEventListener('click', tileChosen)));


const refreshBoard = () => {
    playingGrid.forEach(row => row.forEach(element => element.innerHTML = ""))
    playingGrid.forEach(row => row.forEach(element => element.style.color = "var(--background-color)"))
    gridDisabled(false);
    endMessage.style.display = 'none';
    buttonPlayAgain.style.display = 'none';
    winningTiles = createWinner();
    updateCurrentPlayer()
}

const playAgain = () => {
    refreshBoard()
    updateCurrentPlayer()
}

buttonPlayAgain.addEventListener('click', refreshBoard)

const resetGame = () => {
    refreshBoard()
    noughts.score = 0;
    crosses.score = 0;
    currentPlayer = noughts;
    nextPlayer = crosses;
    textCurrentPlayer.innerHTML = `Current Player: ${currentPlayer.symbol}`
}

buttonReset.addEventListener('click', resetGame)