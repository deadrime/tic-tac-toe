let WebSocketServer = require('ws').Server;

class krestiki {
    constructor() {
        this.wss = new WebSocketServer({port: 9001});
        this.clients = {};
        this.gameField = [];
        this.gameSize = 3;
        this.currentPlayer = '';
        this.currentTurn = 1;

        this.lastPlayer = 0;

        this.initGameField();
        this.addEvents();
    }
    initGameField() {
        for(let i=0; i<this.gameSize; i++){
            this.gameField[i] = [];
            for(let j=0; j<this.gameSize; j++){
                this.gameField[i][j] = '';
            }
        }
        return this.gameField;
    }
    getCurrentPlayer(id) { // чередование ходов
        if (!this.currentPlayer) {
            let msg = {
                type: 'side',
                data: 'X'
            };
            this.clients[id].send(JSON.stringify(msg));
            this.currentPlayer = 'x';
            this.lastPlayer = id;
            return 'x';
        }
        else if (this.currentPlayer ==='x') {
            this.currentPlayer = '0';
            return '0';
        }
        else {
            this.currentPlayer = 'x';
            return 'x';
        }
    }
    sendMessageToAll(msg) {
        for (let key in this.clients) {
            this.clients[key].send(JSON.stringify(msg));
        }
    }
    checkWin() { // лютый хардкод
        console.log(this.gameField);
        console.log('текущий ход', this.currentTurn);
        if (this.currentTurn === this.gameSize * this.gameSize) return 'Ничья'; // проверка на ничью
        for(let i=0; i<3; i++) {
            let outBoi = this.gameField[i][0] !== '';
            if (outBoi && this.gameField[i][0] === this.gameField[i][1] && this.gameField[i][0] === this.gameField[i][2])
                return this.gameField[i][0];
        }
        for(let i=0; i<3; i++) {
            let outBoi = this.gameField[0][i] !== '';
            if (outBoi && this.gameField[0][i] === this.gameField[1][i] && this.gameField[0][i] === this.gameField[2][i])
                return this.gameField[0][i];
        }
        if(this.gameField[0][0] !== '' && this.gameField[0][0]===this.gameField[1][1] && this.gameField[1][1]===this.gameField[2][2])
            return this.gameField[0][0];
        if(this.gameField[0][2] !== '' && this.gameField[0][2]===this.gameField[1][1] && this.gameField[1][1]===this.gameField[2][0])
            return this.gameField[0][2];
        return false
    }
    addEvents() {
        this.wss.on('connection', (ws) => {
            let id = Math.random();
            this.clients[id] = ws;
            console.log("новое соединение ",id);
            ws.on('message', (message) => {
                message = JSON.parse(message);
                console.log(`Новое сообщение: тип ${message.type}`);

                if (message.type === 'turn') { // TODO - в отдельный контроллер
                    if (id === this.lastPlayer) { // один игрок не может сделать два хода подряд
                        return;
                    }
                    else {
                        this.lastPlayer = id;
                    }
                    this.currentTurn++;
                    let col = parseInt(message.data.row);
                    let row = parseInt(message.data.col);
                    console.log(col,row);
                    let currentPlayer = this.getCurrentPlayer(id);
                    this.gameField[row][col] = currentPlayer;

                    let msg = {
                        type: 'turn',
                        data: {
                            type: 'turn',
                            col: col,
                            row: row,
                            player: currentPlayer
                        }
                    };
                    this.sendMessageToAll(msg);

                    let isWin = this.checkWin();
                    if (this.checkWin()) {
                        msg  = {
                            type: 'win',
                            data: isWin
                        };
                        this.sendMessageToAll(msg);
                        this.currentTurn = 1;
                        this.currentPlayer = '';
                        this.gameField = this.initGameField();
                    }
                }

            });
            ws.on('close', () => {
                this.currentTurn = 1;
                this.currentPlayer = '';
                this.gameField = this.initGameField();
                console.log('соединение закрыто ' + id);
                // TODO - если один выходит - оповестить об этом
                delete this.clients[id];
            });
        });
    }
}

new krestiki();
