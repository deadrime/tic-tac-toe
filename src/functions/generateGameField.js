let generateGameField = () => {
    let gameFields = document.getElementsByClassName('game-field');
    let gameFieldSize = gameFields.length;
    let rowSize = Math.sqrt(gameFields.length);

    for (let i=0,row=-1,column=-1;i<gameFieldSize;++i, column++) {
        if (i%3 === 0) {
            row++;
            column = 0;
        }
        gameFields[i].setAttribute('data-row',row.toString());
        gameFields[i].setAttribute('data-column',column.toString())
    }
};

export default generateGameField;

