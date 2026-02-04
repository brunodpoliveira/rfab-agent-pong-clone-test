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
let ballSpeedY = initialSpeed * (Math.random() * 2 - 1); // Initial random angle
let player1Score = 0;
let player2Score = 0;
const keys = {};

// Speed increase factor per paddle hit
const speedIncrease = 1.1;

// Listen for key presses
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Function to reset ball after scoring
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = initialSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = initialSpeed * (Math.random() * 2 - 1); // Random angle with normal speed
}

// Game loop
function gameLoop() {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    context.fillStyle = '#fff';
    context.fillRect(0, player1Y, paddleWidth, paddleHeight);
    context.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

    // Draw ball
    context.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);

    // Draw scores
    context.font = '30px Arial';
    context.fillText(player1Score, canvas.width / 4, 50);
    context.fillText(player2Score, 3 * canvas.width / 4, 50);

    // Move paddles
    if (keys['w'] && player1Y > 0) player1Y -= 5;
    if (keys['s'] && player1Y < canvas.height - paddleHeight) player1Y += 5;
    if (keys['ArrowUp'] && player2Y > 0) player2Y -= 5;
    if (keys['ArrowDown'] && player2Y < canvas.height - paddleHeight) player2Y += 5;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom
    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX <= paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) {
        // Calculate hit position (from -0.5 to 0.5)
        const hitPos = (ballY - (player1Y + paddleHeight / 2)) / (paddleHeight / 2);
        // Adjust angle: more extreme at edges
        ballSpeedY = hitPos * initialSpeed * 2; // Scale for extreme angles
        ballSpeedX = -ballSpeedX * speedIncrease; // Reverse and increase speed
        ballSpeedY *= speedIncrease;
    } else if (ballX >= canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight) {
        const hitPos = (ballY - (player2Y + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeedY = hitPos * initialSpeed * 2;
        ballSpeedX = -ballSpeedX * speedIncrease;
        ballSpeedY *= speedIncrease;
    }

    // Scoring
    if (ballX < 0) {
        player2Score++;
        resetBall();
    } else if (ballX > canvas.width) {
        player1Score++;
        resetBall();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();