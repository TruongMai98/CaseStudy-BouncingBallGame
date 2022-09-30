let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

const GAME_BOARD_WIDTH = 480, GAME_BOARD_HEIGHT = 360;
const BALL_RADIUS = 10, GAME_RENDER_SPEED = 10;
const PADDLE_HEIGHT = 10, PADDLE_WIDTH = 85;



let paddleX = GAME_BOARD_WIDTH - PADDLE_WIDTH / 2;
let paddleY = GAME_BOARD_HEIGHT - PADDLE_HEIGHT - 40;
let x = canvas.width;
let y = canvas.height;
let dx = 2;
let dy = -2;
let rightPressed = false;
let leftPressed = false;
let score = 0;

let GameBoard = function (width, height) {
    this.width = width;
    this.height = height;

    this.drawGameBoard = function (canvas) {
        canvas.setAttribute("width", this.width);
        canvas.setAttribute("height", this.height);

    }
}

let Ball = function () {
    this.xCoordinate = x;
    this.yCoordinate = y;
    this.ballRadius = BALL_RADIUS;
    this.ballSpeed = GAME_RENDER_SPEED;
    this.collidePoint = (x - (paddleX + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
    this.angle = this.collidePoint * (Math.PI / 3);


    this.drawBall = function () {
        ctx.beginPath();
        ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = "#7c7c7c";
        ctx.fill();
        ctx.closePath();
    }

    this.moveBall = function () {
        if (x > GAME_BOARD_WIDTH - BALL_RADIUS || x < BALL_RADIUS) {
            dx = -dx;
        }
        if (y >= paddleY - BALL_RADIUS && y < paddleY + PADDLE_HEIGHT + BALL_RADIUS && x >= paddleX - BALL_RADIUS && x < paddleX + PADDLE_WIDTH + BALL_RADIUS) {
            dx = GAME_RENDER_SPEED * Math.sin(this.angle) / 3;
            dy = -GAME_RENDER_SPEED * Math.cos(this.angle) / 3;
        }
        if (y < BALL_RADIUS) {
            dy = -dy;
        } else if (y === paddleY - BALL_RADIUS) {
            if (x >= paddleX && x < paddleX + PADDLE_WIDTH) {
                dy = -dy;
            }
        } else if (y > paddleY) {
            if (y > GAME_BOARD_HEIGHT - PADDLE_HEIGHT) {
                alert("GAME OVER!! \nScore = " + parseInt(score));
                document.location.reload();
                clearInterval(interval);
            }
        }
        x += dx;
        y += dy;
    }

    this.drawScore = function () {
        ctx.font = "16px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText("Score: " + parseInt(score), 8, 20);
        score += 0.01;

    }
}

let Paddle = function () {
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.xPaddleCoordinate = paddleX;
    this.yPaddleCoordinate = paddleY;

    this.drawPaddle = function () {
        ctx.beginPath();
        ctx.rect(paddleX, paddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
    }

    this.keyDownHandler = function (e) {
        if (e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    this.keyUpHandler = function (e) {
        if (e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    this.movePaddle = function () {
        document.addEventListener("keydown", this.keyDownHandler);
        document.addEventListener("keyup", this.keyUpHandler);
        if (rightPressed) {
            paddleX += 3;
            if (paddleX + PADDLE_WIDTH > GAME_BOARD_WIDTH) {
                paddleX = GAME_BOARD_WIDTH - PADDLE_WIDTH;
            }
        } else if (leftPressed) {
            paddleX -= 3;
            if (paddleX < 0) {
                paddleX = 0;
            }
        }

    }

    this.mouseMoveHandler = function (e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < GAME_BOARD_WIDTH) {
            paddleX = relativeX - PADDLE_WIDTH / 2;
        }
    }

    this.moveMouse = function () {
        document.addEventListener("mousemove", this.mouseMoveHandler, false);

    }
}


function drawGame() {
    let ball = new Ball();
    let paddle = new Paddle(240);

    ctx.clearRect(0, 0, GAME_BOARD_WIDTH, canvas.height);

    ball.drawBall();
    ball.moveBall();
    ball.drawScore();

    paddle.drawPaddle();
    paddle.movePaddle();
    paddle.moveMouse();

}

let gameBoard = new GameBoard(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
gameBoard.drawGameBoard(canvas);

const interval = setInterval(drawGame, GAME_RENDER_SPEED);


