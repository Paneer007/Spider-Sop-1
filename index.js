let guessWord = ''
let userWord = '_'
let lives=0
let userKeys=[]
let score=0;
const listOfKeys=[
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
]
let topScore= localStorage.getItem('TopScore')
if(topScore==null){
    localStorage.setItem('TopScore',0)
    topScore=0
}
//https://random-words-api.vercel.app/word
const HomePageEvLst =()=>{
    const gameButton = document.getElementById("gameButton")
    gameButton.addEventListener('click',startGame)
}
const updateWord=()=>{
    const text = document.querySelectorAll(".letterBox")
    for(let i=0;i<userWord.length;i++){
        text[i].textContent=userWord.charAt(i)
    }
    updateStick()
}
const getWord=async()=>{
    let wordRes = await fetch('https://random-word-api.herokuapp.com/word')
    let word = await wordRes.json()
    guessWord= word[0]
    userWord=userWord.repeat(guessWord.length)
    return null
}
const makeMainLayout =()=>{
    const root = document.getElementById("root")
    root.innerHTML=''
    const titleBod = document.createElement('div')
    const DescBod = document.createElement('div') // serves as desc and game bod
    root.appendChild(titleBod)
    root.appendChild(DescBod)
    titleBod.className="titleBod"
    DescBod.className="DescBod"
    const titleDesc = document.createElement('h1')
    const RuleHeader = document.createElement('h2')
    const GameDesc = document.createElement('p')
    const gameButton = document.createElement('button')
    titleBod.appendChild(titleDesc)
    DescBod.appendChild(RuleHeader)
    DescBod.appendChild(GameDesc)
    DescBod.appendChild(gameButton)
    titleDesc.className='titleDesc'
    RuleHeader.className='RuleHeader'
    GameDesc.className='GameDesc'
    gameButton.className="gameButton"
    titleBod.id="titleBod"
    DescBod.id="DescBod"
    titleDesc.id='titleDesc'
    RuleHeader.id='RuleHeader'
    GameDesc.id='GameDesc'
    gameButton.id="gameButton"
}
const fillLayout=()=>{
    const titleBod= document.getElementById('titleDesc')
    const RuleHeader = document.getElementById('RuleHeader')
    const GameDesc = document.getElementById("GameDesc")
    const gameButton = document.getElementById("gameButton")
    titleBod.textContent='Hangman'
    RuleHeader.textContent="Rules"
    GameDesc.innerHTML=`Hangman is a popular word guessing game where the player attempts to
    build an unknown word by guessing one letter at a time. The game ends after a
    certain number of incorrect attempts (lost) or if the player guesses the correct
    word (win)
    <br>
    You start with 6 lives in a given game and you lose a life if you guess wrong.
    Each time you lose a life, a part of hangman gets drawn on the screen. Your object is to get all the words right without get hangman drawn
    <br>
    Score in a given round is no of lives left x no of correct words. For example if you have 5 lives and enter the correct letter which appears 3 times, your score would be existing Score + 5*3 
    <br>
    Enough rules, lets start playing !
    `
    gameButton.textContent="Start Game"
}
const clearLayout=()=>{
    window.removeEventListener('keypress',TakeUserInput)
    const keys = document.querySelectorAll('.keyDiv')
    keys.forEach(x=>x.removeEventListener('click',TakeUserScreenInput))
    const DescBod = document.getElementById('DescBod')
    DescBod.innerHTML=''
}
const updateWordP=()=>{
    const wordP=document.getElementById('WordP')
    for(let i =0;i<userWord.length;i++){
        const letterBox = document.createElement('div')
        wordP.appendChild(letterBox)
        letterBox.className="letterBox"
        letterBox.textContent=userWord[i]
    }
}
const updateLayout=()=>{
    const DescBod = document.getElementById('DescBod')
    const WordDiv = document.createElement('div')
    const GameDiv = document.createElement('div')
    const StickManDiv = document.createElement('canvas')
    const wordList = document.createElement('div')
    const ScoreDiv = document.createElement('div')
    const WordP= document.createElement('div')
    DescBod.appendChild(WordDiv)
    DescBod.appendChild(GameDiv)
    GameDiv.appendChild(StickManDiv)
    GameDiv.appendChild(wordList)
    DescBod.appendChild(ScoreDiv)
    WordDiv.appendChild(WordP)
    GameDiv.id="GameDiv"
    StickManDiv.id="StickManDiv"
    ScoreDiv.id="ScoreDiv"
    WordDiv.id="WordDiv"
    WordP.id="WordP"
    wordList.id="wordList"
    StickManDiv.width=500
    StickManDiv.height=500
    updateWordP()
}
const updateScore=(points)=>{
    score+=lives*points
}
const updateUserWord=(key)=>{
    let updatedString=""
    let countS=0
    for(let j=0;j<guessWord.length;j++){
        if(guessWord[j]==key){
            countS+=1;
            updatedString+=`${key}`
        }else{
            updatedString+=`${userWord[j]}`
        }
    }
    userWord=updatedString
    updateScore(countS)
    updateWord()
}
const gameOverScreenLayout=()=>{
    const resultDiv = document.getElementById("ScoreDiv")
    const resultText = document.createElement('p')
    resultDiv.appendChild(resultText)
    resultText.id="resultText"
}
const gameOverScreenText=(win)=>{
    const scoreDiv = document.getElementById('ScoreDiv')
    const gameOver= document.createElement('p')
    const resultDiv= document.createElement('div')
    const nature=document.createElement('p')
    const scoreP=document.createElement('p')
    const topScoreP = document.createElement('p')
    const startAgain=document.createElement('button')
    scoreDiv.appendChild(gameOver)
    scoreDiv.appendChild(resultDiv)
    resultDiv.appendChild(nature)
    if(!win){
        const theRightWord = document.createElement('p')
        scoreDiv.appendChild(theRightWord)
        theRightWord.innerText=`the right word: ${guessWord}`
    }else{
        resultDiv.appendChild(scoreP)
        scoreP.textContent=`your score: ${score}`
        resultDiv.appendChild(topScoreP)
        if(score>topScore){
            topScore=score
            localStorage.setItem('TopScore',score)
        }
        topScoreP.textContent=`Top Score: ${topScore}`
        topScoreP.className="TopScoreText"
    }
    scoreDiv.appendChild(startAgain)
    nature.textContent=win?"You Win":"You Lose"
    nature.className="nature"
    gameOver.className="GameOverText"
    gameOver.textContent="GameOver"
    startAgain.textContent="Start Again"
    startAgain.className="gameButton"
    startAgain.addEventListener('click',startGame)
}
const gameOverScreen=(win=false)=>{
    gameOverEventRemove()
    gameOverScreenText(win)
}
const gameOverEventRemove=()=>{
    window.removeEventListener('keypress',TakeUserInput)
    const keyList = document.querySelectorAll('.keyDiv')
    keyList.forEach(x=>x.removeEventListener('click',TakeUserScreenInput))
}
const updateStick =()=>{
    const canvas = document.getElementById('StickManDiv')
    const ctx= canvas.getContext('2d')
    switch(lives){
        case 6:
            ctx.fillRect(50,50,240,10)
            ctx.fillRect(50,50,10,350)
            ctx.fillRect(10,400,100,10)
            ctx.fillRect(290,50,10,40)
            break;
        case 5:
            ctx.fillRect(50,50,240,10)
            ctx.fillRect(50,50,10,350)
            ctx.fillRect(10,400,100,10)
            ctx.fillRect(290,50,10,40)
            ctx.beginPath()
            ctx.arc(295,140,50,0,2*Math.PI)
            ctx.stroke()
            break;
        case 4:
            ctx.fillRect(50,50,240,10)
            ctx.fillRect(50,50,10,350)
            ctx.fillRect(10,400,100,10)
            ctx.fillRect(290,50,10,40)
            ctx.beginPath()
            ctx.arc(295,140,50,0,2*Math.PI)
            ctx.stroke()
            ctx.fillRect(290,190,10,100)
            break;
        case 3:
            ctx.fillRect(50,50,240,10)
            ctx.fillRect(50,50,10,350)
            ctx.fillRect(10,400,100,10)
            ctx.fillRect(290,50,10,40)
            ctx.beginPath()
            ctx.arc(295,140,50,0,2*Math.PI)
            ctx.stroke()
            ctx.fillRect(290,190,10,100)
            ctx.translate(290,290)
            ctx.rotate(-30*Math.PI/180)
            ctx.fillRect(0,0,10,100)
            ctx.translate(0,0)
            ctx.rotate(30*Math.PI/180)
            ctx.setTransform(1,0,0,1,0,0)
            break;
        case 2:
            ctx.fillRect(50,50,240,10)
            ctx.fillRect(50,50,10,350)
            ctx.fillRect(10,400,100,10)
            ctx.fillRect(290,50,10,40)
            ctx.beginPath()
            ctx.arc(295,140,50,0,2*Math.PI)
            ctx.stroke()
            ctx.fillRect(290,190,10,100)
            ctx.translate(290,290)
            ctx.rotate(-30*Math.PI/180)
            ctx.fillRect(0,0,10,100)
            ctx.rotate(60*Math.PI/180)
            ctx.fillRect(0,0,10,100)     
            ctx.translate(0,0)
            ctx.rotate(-60*Math.PI/180)
            ctx.setTransform(1,0,0,1,0,0)           
            break;
        case 1:
            ctx.fillRect(50,50,240,10)
            ctx.fillRect(50,50,10,350)
            ctx.fillRect(10,400,100,10)
            ctx.fillRect(290,50,10,40)
            ctx.beginPath()
            ctx.arc(295,140,50,0,2*Math.PI)
            ctx.stroke()
            ctx.fillRect(290,190,10,100)
            ctx.translate(290,290)
            ctx.rotate(-30*Math.PI/180)
            ctx.fillRect(0,0,10,100)
            ctx.rotate(60*Math.PI/180)
            ctx.fillRect(0,0,10,100)     
            ctx.translate(0,0)
            ctx.rotate(-60*Math.PI/180)
            ctx.setTransform(1,0,0,1,0,0)
            ctx.translate(290,210)
            ctx.rotate(-30*Math.PI/180)
            ctx.fillRect(0,0,10,100)
            ctx.translate(0,0)
            ctx.rotate(30*Math.PI/180)
            ctx.setTransform(1,0,0,1,0,0)
            break;
        case 0:
            ctx.fillRect(50,50,240,10)
            ctx.fillRect(50,50,10,350)
            ctx.fillRect(10,400,100,10)
            ctx.fillRect(290,50,10,40)
            ctx.beginPath()
            ctx.arc(295,140,50,0,2*Math.PI)
            ctx.stroke()
            ctx.fillRect(290,190,10,100)
            ctx.translate(290,290)
            ctx.rotate(-30*Math.PI/180)
            ctx.fillRect(0,0,10,100)
            ctx.rotate(60*Math.PI/180)
            ctx.fillRect(0,0,10,100)     
            ctx.translate(0,0)
            ctx.rotate(-60*Math.PI/180)
            ctx.setTransform(1,0,0,1,0,0)
            ctx.translate(290,210)
            ctx.rotate(-30*Math.PI/180)
            ctx.fillRect(0,0,10,100)
            ctx.rotate(60*Math.PI/180)
            ctx.fillRect(0,0,10,100)
            ctx.rotate(30*Math.PI/180)
            ctx.setTransform(1,0,0,1,0,0)
            gameOverScreen()
            break;
        }
    }
const manGetsHanged=()=>{
    lives--;
    updateStick()
}
const updateColorCorrect=(key)=>{
    let keys = document.querySelectorAll('.keyDiv')
    keys= Array.from(keys)
    let finalKey = keys.find(x=>x.dataset.alphaVal==key)
    finalKey.style.backgroundColor='green'
}
const updateColorIncorrect=(key)=>{
    let keys = document.querySelectorAll('.keyDiv')
    keys= Array.from(keys)
    let finalKey = keys.find(x=>x.dataset.alphaVal==key)
    finalKey.style.backgroundColor='red'
}
const checkIfPresentInWord=(key)=>{
    if(guessWord.includes(key)){
        updateColorCorrect(key)
        updateUserWord(key)
        if(guessWord==userWord)[
            gameOverScreen(true)
        ]
    }else{
        updateColorIncorrect(key)
        manGetsHanged()
    }
}
const TakeUserInput=(e)=>{
    let key = e.key
    key=key.toLowerCase()
    if(userKeys.includes(key)){
        return
    }
    userKeys.push(key)
    if('a'<=key && key<='z'){
        checkIfPresentInWord(key)
    }else{
        null
    }
}
const TakeUserScreenInput=(e)=>{
    let key = e.target.textContent
    key=key.toLowerCase()
    if(userKeys.includes(key)){
        return
    }
    userKeys.push(key)
    if('a'<=key && key<='z'){
        checkIfPresentInWord(key)
    }else{
        null
    }
}
const registerUserKey=()=>{
    window.addEventListener('keypress',TakeUserInput)    
}
const fillUpdatedLayout=()=>{
    const GameDiv= document.getElementById('GameDiv')
    const StickManDiv = document.getElementById('StickManDiv')
    const WordDiv = document.getElementById("WordDiv")
    const WordP= document.getElementById("WordP")
    const wordList=document.getElementById('wordList')
    for(let i=0;i<listOfKeys.length;i++){
        const row=document.createElement('div')
        wordList.appendChild(row)
        row.id=`row ${i}`
        row.dataset.id=`row ${i}`
        row.className="keyRow"
        for(let j=0;j<listOfKeys[i].length;j++){
            const keyDiv = document.createElement('div')
            keyDiv.textContent=listOfKeys[i][j]
            keyDiv.dataset.row=i
            keyDiv.dataset.col=j
            keyDiv.dataset.alphaVal=listOfKeys[i][j]
            keyDiv.className="keyDiv"
            row.appendChild(keyDiv)
            keyDiv.addEventListener('click',TakeUserScreenInput)
        }
    }
}
const startGame=async ()=>{
    lives=6
    userKeys=[]
    guessWord=""
    userWord="_"
    score=0
    clearLayout()
    await getWord()
    updateLayout()
    fillUpdatedLayout()
    updateWord()
    registerUserKey()
}
const main=()=>{
    makeMainLayout()
    fillLayout()
    HomePageEvLst()
    //oi so make layout and rules , then start game cuz life is easier that way
}
main()