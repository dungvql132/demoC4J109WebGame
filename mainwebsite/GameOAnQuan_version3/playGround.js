let x = 0;
function wait(ms){
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve('resolved');
        },ms);
    });
}

function addBut(id){
    // console.log('them anh');
    let btn = document.getElementById(id)
    let but = document.createElement("div")

    but.id = 'but-img'

    btn.parentElement.appendChild(but)
}

function removeBut(id){
    // console.log('huy anh');
    let btn = document.getElementById(id)
    let but = document.getElementById('but-img')
    btn.parentElement.removeChild(but)
}

class PlayGround {
    // cac loai bien
    stoneStore;
    arrStoneStore;
    active;
    constructor(active) {
        this.stoneStore = [];
        this.arrStoneStore = [];
        for (let i = 0; i < 12; i++) {
            this.stoneStore.push(document.getElementById('btn_' + i));
            this.arrStoneStore.push(this.stoneStore[i].innerHTML);
        }
        this.active = active;
    }
    //-------------------------------------------- Ham Bo Tro (khong lien quan den luot choi) ----------------------------------------
    // hàm cài đặt ảnh theo giá trị đá VV
    getArr(){
        return this.arrStoneStore.slice(0)
    }

    setStoneImg(place) {
        let number = Number(this.stoneStore[place].innerHTML)
        let kind;
        if (place == 11) {
            kind = 'url(img_OAQ/quanTrai/'
            if (number > 12) number = 12
        } else if (place == 5) {
            kind = 'url(img_OAQ/quanPhai/'
            if (number > 12) number = 12
        } else {
            kind = 'url(img_OAQ/dan/'
            if (number > 8) number = 8
        }
        this.stoneStore[place].style.backgroundImage = kind + number + '.jpg)'
    }

    // nhặt đá ( đặt lại hình ảnh và số về số number) VV
    async takeTheStone(place) {
        let takedStone = this.stoneStore[place].innerHTML
        this.arrStoneStore[place] = '0'
        if (this.active) {
            addBut(this.stoneStore[place].id)
            await wait(600); 
            removeBut(this.stoneStore[place].id)
            this.stoneStore[place].innerHTML = '0'
            this.setStoneImg(place)
    // ---------------------------------------------------------------------------------------------------------------------------
            
        }
        return takedStone;
    }

    // tăng ô đá thêm 1 đơn vị và đổi ảnh
    async increaseStone(place) {
        // console.log('tang da');
        if (this.active) {
            addBut(this.stoneStore[place].id)
            await wait(800); 
            removeBut(this.stoneStore[place].id)

            this.stoneStore[place].innerHTML = Number(this.stoneStore[place].innerHTML) + 1
            this.setStoneImg(place)
            
            // ---------------------------------------------------------------------------------------------------------------------
        }
        this.arrStoneStore[place] = Number(this.arrStoneStore[place]) + 1
    }

    // vị trí kế tiếp VV
    nextPlace(place, direction) {
        if (direction == 'follow') {
            if (place == 11) {
                return 0
            } else {
                return place + 1;
            }
        } else {
            if (place == 0) {
                return 11
            } else {
                return place - 1
            }
        }
    }

    // ăn đá VV
    async eatTheStone(place, direction) {
        let result = 0;
        for (; ;) {
            if (this.arrStoneStore[place] == '0') {
                place = this.nextPlace(place, direction)
                if (this.arrStoneStore[place] != '0') {
                    result += Number(this.arrStoneStore[place])
                    await this.takeTheStone(place, 0)
                    place = this.nextPlace(place, direction)
                } else {
                    return result
                }
            } else {
                return result
            }
        }
    }

    // kiểm tra trạng thái: có thể rải đá tiếp, ăn đá, chững
    //(trả về 0 nếu ăn đá)(trả về 1 nếu rải đá)(trả về 2 nếu chững)
    check(place) {
        if (this.arrStoneStore[place] == '0') {
            return 0
        } else {
            if (place == 11 || place == 5) {
                return 2
            } else {
                return 1
            }
        }
    }

    // rải đá và chia đá VV
    async spreadTheStone(place, direction) {
        let ok;
        let takedStone;
        for (; ;) {
            // console.log(x++);
            takedStone = await this.takeTheStone(place, 0)
            // console.log('da nhat:'+ takedStone)
            for (let i = 0; i < takedStone; i++) {
                place = this.nextPlace(place, direction)
                await this.increaseStone(place)
                // console.log('vao day');
            }

            place = this.nextPlace(place, direction)
            ok = this.check(place)
            if (ok == 0) {
                return await this.eatTheStone(place, direction)
            } else if (ok == 2) {
                return 0
            }
        }
    }

    // ham cai dat so da va anh ve 1
    backToOneStone(place) {
        if (this.active) {
            this.stoneStore[place].innerHTML = '1'
            this.setStoneImg(place)
        }
        this.arrStoneStore[place] = '1'
    }

    // khi ket thuc
    endGame() {
        let turn;
        if (this.stoneStore[5].innerHTML == '0' && this.stoneStore[11].innerHTML == '0') {
            turn = 1
            for (let i = 0; i < 5; i++) { this.addscore(turn, this.arrStoneStore[i]) }

            turn = 2
            for (let i = 6; i < 11; i++) { this.addscore(turn, this.arrStoneStore[i]) }
            return true
        }return false
    }

    // khi vao van moi (new Game)
    newGame() {
        for (let i = 0; i < 12; i++) {
            this.stoneStore[i].innerHTML = 5
            this.arrStoneStore[i] = 5
            this.setStoneImg(i)
        }
        this.setTurnButton(2)
    }

    // khi vao van cu (load Game)
    loadGame(arr) {
        for (let i = 0; i < 12; i++) {
            this.stoneStore[i].innerHTML = arr[i]
            this.arrStoneStore[i] = arr[i]
            this.setStoneImg(i)
        }
    }

    //------------------------------------- Ham Dieu Khien (co lien quan den luot) -------------------------------------

    addscore(turn, score) {
        // console.log(turn);
        // console.log('player' + turn + '_score');
        let player = document.getElementById('player' + turn + '_score')
        // console.log(player);
        player.innerHTML = Number(player.innerHTML) + Number(score)
    }

    // mat dan
    lostPeople(turn) {
        let start, end
        if (turn == '2') { start = 6; end = 11 }
        else { start = 0; end = 5 }

        for (let i = start; i < end; i++) {
            if (this.arrStoneStore[i] != '0') { return false }
        }

        for (let i = start; i < end; i++) {
            this.backToOneStone(i);
        }
        this.addscore(turn, -5)
    }

    async playGroundAction(place, direction, turn) {
        this.setTurnButton(0)
        let score = await this.spreadTheStone(place, direction)
        this.addscore(turn, score)
    }

    // cài đặt nút không được bấm
    // (1 nếu player1 được bấm)(2 nếu player2 được bấm)
    // (0 nếu trong quá trình chia đá)
    setTurnButton(turn) {
        if (turn == 0) {
            for (let i = 0; i < 12; i++) {
                this.stoneStore[i].disabled = true; 
                this.stoneStore[i].classList.add('black')
                this.stoneStore[i].classList.remove('peopleHover')
                }
        } else if (turn == 2) {
            for (let i = 0; i < 5; i++) {
                this.stoneStore[i].disabled = true;
                this.stoneStore[i].classList.add('black')
                this.stoneStore[i].classList.remove('peopleHover')
            }
            for (let i = 6; i < 11; i++) {
                this.stoneStore[i].disabled = false;
                this.stoneStore[i].classList.add('peopleHover')
                this.stoneStore[i].classList.remove('black')
            }
        } else if (turn == 1) {
            for (let i = 0; i < 5; i++) {
                this.stoneStore[i].disabled = false;
                this.stoneStore[i].classList.add('peopleHover')
                this.stoneStore[i].classList.remove('black')
            }
            for (let i = 6; i < 11; i++) {
                this.stoneStore[i].disabled = true;
                this.stoneStore[i].classList.add('black')
                this.stoneStore[i].classList.remove('peopleHover')
            }
        }
    }
}

let a = new PlayGround(true)

class AI {
    constructor() {

    }

    easyAI() {
        let direction = Math.floor(Math.random() * 2)
        if (direction == 0) {
            direction = 'follow'
        } else {
            direction = 'reverse'
        }

        let place = Math.floor(Math.random() * 5)
        let number = document.getElementById('btn_' + place).innerHTML

        for (; ;) {
            if (number == '0') {
                place = Math.floor(Math.random() * 5)
                number = document.getElementById('btn_' + place).innerHTML
            } else {
                break;
            }
        }
        console.log(place, direction);

        return [place, direction]
    }

    async nomalAI() {
        let result = []
        for (let i = 0; i < 5; i++) {
            if (new PlayGround().arrStoneStore[i] == '0') {
                result.push(-1)
                result.push(-1)
            } else {
                result.push(await new PlayGround(false).spreadTheStone(i, 'follow'))
                result.push(await new PlayGround(false).spreadTheStone(i, 'reverse'))
            }
        }

        let max = 0;
        let place;
        let direction;
        for(let i =0; i < result.length ; i++){
            if(result[i] >= max){
                place = Math.floor(i/2)
                if(i%2 == 0){
                    direction = 'follow'
                }else{
                    direction = 'reverse'
                }
            }
        }
        return [place, direction]
    }
}