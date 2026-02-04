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
let initialSpeed = 5;
let ballSpeedX = initialSpeed * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = initialSpeed * (Math.random() * 2 - 1); // Random initial angle
let player1Score = 0;
let player2Score = 0;
const paddleSpeed = 15; // Increased from 7 to make paddles faster
let upArrowPressed = false;
let downArrowPressed = false;
let wPressed = false;
let sPressed = false;

// Key event listeners
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') upArrowPressed = true;
    if (event.key === 'ArrowDown') downArrowPressed = true;
    if (event.key === 'w' || event.key === 'W') wPressed = true;
    if (event.key === 's' || event.key === 'S') sPressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') upArrowPressed = false;
    if (event.key === 'ArrowDown') downArrowPressed = false;
    if (event.key === 'w' || event.key === 'W') wPressed = false;
    if (event.key === 's' || event.key === 'S') sPressed = false;
});

// Function to draw everything
function draw() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    context.fillStyle = '#fff';
    context.fillRect(0, player1Y, paddleWidth, paddleHeight);
    context.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

    // Draw ball
    context.beginPath();
    context.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    context.fill();

    // Draw scores
    context.font = '30px Arial';
    context.fillText(player1Score, canvas.width / 4, 50);
    context.fillText(player2Score, (3 * canvas.width) / 4, 50);
}

// Function to update game state
function update() {
    // Move player 1 paddle (W/S keys)
    if (wPressed && player1Y > 0) player1Y -= paddleSpeed;
    if (sPressed && player1Y < canvas.height - paddleHeight) player1Y += paddleSpeed;

    // Move player 2 paddle (arrow keys)
    if (upArrowPressed && player2Y > 0) player2Y -= paddleSpeed;
    if (downArrowPressed && player2Y < canvas.height - paddleHeight) player2Y += paddleSpeed;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX - ballSize < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) {
        // Calculate hit position on paddle (from -0.5 to 0.5)
        const hitPos = (ballY - (player1Y + paddleHeight / 2)) / (paddleHeight / 2);
        // Adjust angle based on hit position
        const angle = hitPos * (Math.PI / 3); // Max 60 degrees
        // Calculate new speeds, preserving and increasing magnitude
        const currentSpeed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
        const newSpeed = currentSpeed + 1; // Increase velocity
        ballSpeedX = newSpeed * Math.cos(angle);
        ballSpeedY = newSpeed * Math.sin(angle);
        ballSpeedX = -ballSpeedX; // Reverse direction
    } else if (ballX + ballSize > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight) {
        const hitPos = (ballY - (player2Y + paddleHeight / 2)) / (paddleHeight / 2);
        const angle = hitPos * (Math.PI / 3);
        const currentSpeed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
        const newSpeed = currentSpeed + 1; // Increase velocity
        ballSpeedX = newSpeed * Math.cos(angle);
        ballSpeedY = newSpeed * Math.sin(angle);
        ballSpeedX = -ballSpeedX; // Reverse direction for player 2
    }

    // Scoring and reset
    if (ballX - ballSize < 0) {
        player2Score++;
        resetBall();
    } else if (ballX + ballSize > canvas.width) {
        player1Score++;
        resetBall();
    }
}

// Function to reset ball after score
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = initialSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = initialSpeed * (Math.random() * 2 - 1); // Random angle at initial speed
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();