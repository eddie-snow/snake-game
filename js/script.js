const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

const score = document.querySelector('.score--value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const playButton = document.querySelector('.play-btn')

const audio = new Audio('../assets/assets_audio.mp3')

const size = 30

const initialSnakePosition ={ x:270, y:240} // multiplos de 30 (size) de modo a snake nao passar para fora 

let snake =[initialSnakePosition]

const IncrementScore =()=>{
    score.innerText = parseInt(score.innerText) + 10
}

const randomNumber = (min, max) =>{
    return Math.round(Math.random() * (max - min) + min) //nunca vai passar do maximo, e nunca vai ser menor d q minimo
}

const randomPosition = () =>{
    const number = randomNumber(0, canvas.width - size) //1 vai ser = 570, nao pode ser maior do que 570 se nao o quadrado(food) fica de fora
    return Math.round(number/30) * 30 //divide o numero por 30, deixa ele inteiro, desfiz a divisao
}

const randomColor = () =>{
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction //= "up"
let loopId

const drawFood =() =>{

    const {x, y, color} =  food

    ctx.shadowColor = color
    ctx.shadowBlur = 50
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake =() => {
    ctx.fillStyle = "grey"

    snake.forEach((position, index) =>{

        if (index == snake.length - 1){ //if its the last one
            ctx.fillStyle = "#ddd"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
    
}

const moveSnake =() =>{
    if (!direction) return //se nao tiver direcao ele pula para o final da funcao nao executando
    
    const head = snake[snake.length - 1]

    if (direction =='right' ){
        snake.push({ x: head.x + size, y: head.y }) //addicionar novo object
    }
    if (direction =='left' ){
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction =='down' ){
        snake.push({ x: head.x, y: head.y + size })
    }
    if (direction =='up' ){
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift() //remove o primeiro elemento do array
}

const drawGrid =() =>{
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i+=size ) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkEat =() =>{
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        IncrementScore()
        snake.push(head)
        audio.play()

        // food.x = randomPosition(), //ao comer gerar posicao nova x, y e cor
        // food.y = randomPosition(),
        // food.color = randomColor() 

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) =>position.x == x && position.y == y)){ //para gerar comida fora do corpo da cobra
            x = randomPosition()
            y = randomPosition()
        }
        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision =() =>{
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width //- size
    const neckIndex = snake.length - 2 //pq se comercarmos a verificar pela cabesa e nao o pescoço, imediatamente eh colisao
    const wallCollision = 
        (head.x < 0-size || head.x > canvasLimit || head.y < 0-size || head.y > canvasLimit)

    const selfCollision = snake.find((position, index) =>{
        return (index < neckIndex) && (position.x == head.x && position.y == head.y)
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver =()=>{
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(10px)"
}

const gameLoop =() =>{
    clearInterval(loopId) //limpa o numero de loops, de modo a ter certeza q 2 ou mais loops nao estao a rodar em simultaneo
    ctx.clearRect(0, 0, 600, 600) //limpa a tela demodo a dar a ilusao de deslocamento pois o canvas nao limpa a tela
    drawGrid()
    drawFood()
    drawSnake()
    moveSnake()
    checkEat()
    checkCollision()
    loopId = setTimeout(()=>{
        gameLoop()
    }, 300) //espera 300 milisegundos e chame ela mesma
}

gameLoop() //chamando pela primeira vez, iniciando o loop

document.addEventListener("keydown", ({ key }) => {
  
    if ((key == "ArrowRight" || key =="d" || key =="D")&&(direction !="left")){ //direction stuff to make sure it can not go back directly from the direction its coming from
        direction = "right"
    }
    if ((key == "ArrowLeft" || key =="a" || key =="A")&&(direction !="right")){
        direction = "left" 
    }
    if ((key == "ArrowDown" || key =="s" || key =="S")&&(direction !="up")){
        direction = "down" 
    }
    if ((key == "ArrowUp" || key =="w" || key =="W")&&(direction !="down")){
        direction = "up" 
    }
})

playButton.addEventListener("click", ()=>{
    score.innerText = "00"
    menu.style.display ="none"
    canvas.style.filter ="none"

    snake = [initialSnakePosition]
})