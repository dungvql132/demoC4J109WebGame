//-----------------Menu---------------
let page = 1;
// Nut Start o Menu
function menuStartBtn() {
    changeDivFromTo('menu', 'menu_selectedtype')
    playANewGame()
    isNewGame = true;
}

function menuLoadBtn() {
    isNewGame = false;
    gotoLoad()
    changeDivFromTo('menu', 'menu_loading')
}

function menuInsBtn(){
    changeDivFromTo('menu','instruction')
    page = 1;
    apearDiv('rule1')
}
//------------------Menu Selected Type----------------

function menuSelectedTypeBtn(obj) {
    SelectedType = obj.id.split('_')[2];
    if (SelectedType == 'pvp') {
        changeDivFromTo('menu_selectedtype', 'playground')
    } else {
        changeDivFromTo('menu_selectedtype', 'menu_loading')
        gotoLoad()
    }
}

function menuSelectedTypeBack() {
    changeDivFromTo('menu_selectedtype', 'menu')
}

function selectLevel(obj) {
    AIlevel = obj.split('_')[1]

}

// ------------------Menu Load Game----------------------
function loadingBtn(obj) {
    numberLoad = obj.id
    if (isNewGame) {
        changeDivFromTo('menu_loading', 'selectedtype_level')
    } else {
        if (localStorage.getItem(numberLoad) != null) {
            changeDivFromTo('menu_loading', 'playground')
            loadGame();
        } else {

        }
    }
}

function selectLoadingBack() {
    changeDivFromTo('menu_loading', 'menu')
}

function deleteLoad(obj){
    let id_data = obj.id.split('-')[0]
    localStorage.removeItem(id_data)
    gotoLoad()
}

// ------------------Select Level------------------------

function selectLevelBtn(obj) {
    changeDivFromTo('selectedtype_level', 'playground')
    AIlevel = obj.id.split('_')[1]
    // console.log(AIlevel)
}

function selectLevelBack() {
    changeDivFromTo('selectedtype_level', 'menu')
}

//-------------------Play Ground-------------------------

async function move(obj) {
    await actionWhenClick(obj)
}

function peopleClick(obj) {
    if(obj.innerHTML == '0'){
        return
    }
    let number = Number(obj.id.slice(4));
    let btn = document.getElementById(obj.id)
    if (pickedPlace != number) {
        removeArrow();
        addArrow(btn.parentElement);
        pickedPlace = number;
    } else {
        removeArrow();
        pickedPlace = -1;
    }
}

function playgroundMenuBack() {
    location.reload()
}

function saveGameBtn() {
    saveGame()
}

// ------------------ending------------------
function endingBtn(){
    changeDivFromTo('ending','menu')
}

// -------------------menu instruction------------------
function instructionBack(){
    changeDivFromTo('instruction','menu')
    apearDiv('rule'+page)
}

function nextInfor(obj){
    if(obj.id == 'next'){
        if(page < 3){
            apearDiv('rule'+page)
            page++;
            apearDiv('rule'+page)
        }else{
            return
        }
    }else{
        if(page >1){
            apearDiv('rule'+page)
            page--;
            apearDiv('rule'+page)
        }else{
            return
        }
    }
}