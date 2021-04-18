// ------------------------------------------- Bien trong Action-----------------------------------
let SelectedType;
let playerTurn = 2;
let pickedPlace;
let direction;
let AIlevel;
let isNewGame;
let numberLoad;
//-------------------------------------------------------------------------------------------------

// cai dat huong di
function setDirection(obj) {
    if (pickedPlace < 5) {
        if (obj.id == 'left') {
            direction = 'inverse'
        } else {
            direction = 'follow'
        }
    } else {
        if (obj.id == 'right') {
            direction = 'inverse'
        } else {
            direction = 'follow'
        }
    }
}

// doi turn
function swapTurn() {
    if (playerTurn == 1) {
        playerTurn = 2; new PlayGround(true).setTurnButton(playerTurn)
    }
    else {
        playerTurn = 1; new PlayGround(true).setTurnButton(playerTurn)
    }
}

// hanh dong moi turn
async function oneMove() {
    let playGround = new PlayGround(true)
    await playGround.playGroundAction(pickedPlace, direction, playerTurn)
    swapTurn();
    playGround.lostPeople(playerTurn)
    let x = playGround.endGame();
    if(x){
        changeDivFromTo('playground','ending')
        let player1End = document.getElementById('player1End')
        let player2End = document.getElementById('player2End')

        let score1 = Number(document.getElementById('player1_score').innerHTML)
        let score2 = Number(document.getElementById('player2_score').innerHTML)

        player1End.innerHTML = 'PLAYER 1 SCORE <br><br>' + score1
        player2End.innerHTML = 'PLAYER 2 SCORE <br><br>' + score2

        let thongbao = document.getElementById('whoWin')
        if(score2 > score1){
            thongbao.innerHTML = 'PLAYER 2 THANG'
        }else if(score1 > score2){
            thongbao.innerHTML = 'PLAYER 1 THANG'
        }else{
            thongbao.innerHTML = 'Hoa'
        }
    }
}

// khi bam nut di chuyen
async function actionWhenClick(obj) {
    setDirection(obj)
    await oneMove()

    if (SelectedType == 'pve') {
        // console.log('chay ai');
        new PlayGround(true).setTurnButton(0)
        let level;
        if (AIlevel == 'easy') {
            level = new AI().easyAI();
        } else {
            level = await new AI().nomalAI();
        }

        pickedPlace = level[0]
        direction = level[1]
        // console.log('bien nay nay:' +pickedPlace,direction);
        // console.log('ai den day');

        setTimeout(async function () {
            await oneMove()
        }, 3000);
    }
}

// khi bat dau game moi (new game)
function playANewGame() {
    new PlayGround(true).newGame()
    playerTurn = 2;
    document.getElementById('player1_score').innerHTML = 0
    document.getElementById('player2_score').innerHTML = 0
}

function saveGame() {
    let saveObj = {
        typex: SelectedType,
        arr: new PlayGround().getArr(),
        turn: playerTurn,
        pl1Score: document.getElementById('player1_score').innerHTML,
        pl2Score: document.getElementById('player2_score').innerHTML,
        AI: AIlevel
    }
    console.log(SelectedType);

    localStorage.setItem(numberLoad, JSON.stringify(saveObj))
}

function loadGame() {
    let saveObj = JSON.parse(localStorage.getItem(numberLoad))
    new PlayGround().loadGame(saveObj.arr)
    playerTurn = saveObj.turn
    document.getElementById('player1_score').innerHTML = saveObj.pl1Score
    document.getElementById('player2_score').innerHTML = saveObj.pl2Score
    AIlevel = saveObj.AI
    SelectedType = saveObj.typex
    new PlayGround().setTurnButton(playerTurn)
    // console.log(playerTurn);
}

function gotoLoad() {
    let load;
    let data;
    for (let i = 1; i <= 3; i++) {
        load = 'load_' + i + '_btn'
        data = JSON.parse(localStorage.getItem(load))
        // console.log(data)
        if (data != null) {
            document.getElementById(load+'-data').innerHTML ="  Player 1:"+ data.pl1Score + '<br>' + "  Player 2:"+ data.pl2Score
        } else {
            document.getElementById(load+'-data').innerHTML = 'empty'
        }
    }
}
//----------------------------------------------- HAM BO TRO NUT BAM -------------------------------------------------------

//------------Change Group Button------------
function apearDiv(id) {
    let x = document.getElementById(id)
    x.classList.toggle('container')
    x.classList.toggle('ground-disappear')
}

function changeDivFromTo(id1, id2) {
    document.getElementById(id1).classList.toggle('vanishing')

    setTimeout(() => {
        document.getElementById(id1).classList.toggle('vanishing')
        apearDiv(id1)
        apearDiv(id2)
    }, 1000)
}

function removeArrow() {
    let left = document.getElementById('left')
    let right = document.getElementById('right')

    if (left != null) {
        left.parentElement.removeChild(left)
        right.parentElement.removeChild(right)
    }
}

function addArrow(obj) {
    let left = document.createElement('button')
    let right = document.createElement('button')

    left.id = 'left'
    right.id = 'right'

    left.addEventListener('click', () => {
        actionWhenClick(left)
        removeArrow()
    })
    right.addEventListener('click', () => {
        actionWhenClick(right)
        removeArrow()
    })

    let btn = document.getElementById(obj.id)
    btn.appendChild(left)
    btn.appendChild(right)
}
//-------------Play Game Button --------------

