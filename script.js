// Get the canvas element and its context
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Game variables
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
let player1Y = (canvas.height - paddleHeight) / 2;
let player2Y = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 5 * (Math.random() * 2 - 1);
let player1Score = 0;
let player2Score = 0;

// Movement flags
const keys = {};

// Listen for key presses
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Draw everything
function draw() {
    // Clear canvas
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    context.fillStyle = '#fff';
    context.fillRect(20, player1Y, paddleWidth, paddleHeight); // Player 1
    context.fillRect(canvas.width - 30, player2Y, paddleWidth, paddleHeight); // Player 2

    // Draw ball
    context.beginPath();
    context.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    context.fill();

    // Draw scores
    context.font = '30px Arial';
    context.fillText(player1Score, canvas.width / 4, 50);
    context.fillText(player2Score, 3 * canvas.width / 4, 50);
}

// Update game state
function update() {
    // Move paddles
    if (keys['w'] && player1Y > 0) player1Y -= 5;
    if (keys['s'] && player1Y < canvas.height - paddleHeight) player1Y += 5;
    if (keys['ArrowUp'] && player2Y > 0) player2Y -= 5;
    if (keys['ArrowDown'] && player2Y < canvas.height - paddleHeight) player2Y += 5;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball wall collisions
    if (ballY <= 0 || ballY >= canvas.height) ballSpeedY = -ballSpeedY;

    // Ball paddle collisions
    if (ballX <= 30 && ballX >= 20 && ballY >= player1Y && ballY <= player1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX >= canvas.width - 30 && ballX <= canvas.width - 20 && ballY >= player2Y && ballY <= player2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Scoring
    if (ballX < 0) {
        player2Score++;
        resetBall();
    }
    if (ballX > canvas.width) {
        player1Score++;
        resetBall();
    }
}

// Reset ball position
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 5 * (Math.random() * 2 - 1);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();