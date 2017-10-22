import './index.pcss';
import generateGameField from './functions/generateGameField';

generateGameField();

let ws = new WebSocket ('ws://localhost:9001');

let gameBoard = document.getElementById('game');
let gameFields = gameBoard.getElementsByClassName('game-field');
let gameSize = 3;

ws.onmessage = (msg) => {
    //TODO и эту херню тоже в контроллер
    let msgBody = JSON.parse(msg.data);
    console.log(msgBody);
    if (msgBody.type === 'side') {
        console.log(msgBody.data);
    }
    if (msgBody.type === 'turn') {
        let row = msgBody.data.col;
        let col = msgBody.data.row;
        console.log(`Строка ${row}; столбец ${col}`);
        let elNum = row!==0 ? (row*gameSize) + col : col;
        let el = document.createElement('span');
        el.classList.add('turn');
        if (msgBody.data.player ==='x') {
            el.classList.add('turn-cross');
        }
        else {
            el.classList.add('turn-nought');
        }
        gameFields[elNum].appendChild(el);
    }

    if (msgBody.type === 'win') {
        let modal = document.getElementById('modal_win');
        modal.style.display = 'flex';
        let winnerText = msgBody.data ==='Ничья' ? 'Ничья!' : `Победили ${msgBody.data}`;
        let winnerTextDiv = document.getElementById('winner-text');
        winnerTextDiv.innerText = winnerText;
        let rerun = document.getElementById('rerun');
        rerun.onclick = () => {
            modal.style.display = 'none';
            for (let el of gameFields) {
                el.innerHTML = '';
            }
        }
    }
};

const game = document.getElementById('game');

game.addEventListener('click', (event) => {
    if (event.target.hasAttribute('data-row') && event.target.hasAttribute('data-column')) {
        let data = {
            type: 'turn',
            data: {
                row: event.target.getAttribute('data-row'),
                col: event.target.getAttribute('data-column'),
            }
        };
        ws.send(JSON.stringify(data));
    }
});