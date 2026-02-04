// Get the canvas element and its context
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Game variables
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const paddleSpeed = 10; // Increased from likely previous value for faster movement
let player1Y = (canvas.height - paddleHeight) / 2;
let player2Y = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let initialSpeed = 5;
let ballSpeedX = initialSpeed * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = initialSpeed * (Math.random() - 0.5) * 2; // random initial Y speed
let player1Score = 0;
let player2Score = 0;

// Keyboard controls
const keys = {};
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Update game state
function update() {
    // Move paddles
    if (keys['w'] && player1Y > 0) player1Y -= paddleSpeed;
    if (keys['s'] && player1Y < canvas.height - paddleHeight) player1Y += paddleSpeed;
    if (keys['ArrowUp'] && player2Y > 0) player2Y -= paddleSpeed;
    if (keys['ArrowDown'] && player2Y < canvas.height - paddleHeight) player2Y += paddleSpeed;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom
    if (ballY - ballSize / 2 <= 0 || ballY + ballSize / 2 >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    // Player 1 paddle collision
    if (ballX - ballSize / 2 <= paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight && ballSpeedX < 0) {
        let relativeIntersectY = (player1Y + (paddleHeight / 2)) - ballY;
        let normalized = relativeIntersectY / (paddleHeight / 2);
        let angle = normalized * (Math.PI / 4); // max 45 degrees

        // Calculate current speed magnitude
        let currentSpeed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);

        // Apply new direction without resetting speed
        ballSpeedX = currentSpeed * Math.cos(angle);
        ballSpeedY = -currentSpeed * Math.sin(angle); // Negative for direction, adjust based on hit

        // Increase speed by 10% after direction change
        currentSpeed *= 1.1;
        ballSpeedX = currentSpeed * Math.cos(angle);
        ballSpeedY = -currentSpeed * Math.sin(angle);
    }

    // Player 2 paddle collision
    if (ballX + ballSize / 2 >= canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight && ballSpeedX > 0) {
        let relativeIntersectY = (player2Y + (paddleHeight / 2)) - ballY;
        let normalized = relativeIntersectY / (paddleHeight / 2);
        let angle = normalized * (Math.PI / 4); // max 45 degrees

        // Calculate current speed magnitude
        let currentSpeed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);

        // Apply new direction without resetting speed
        ballSpeedX = -currentSpeed * Math.cos(angle);
        ballSpeedY = -currentSpeed * Math.sin(angle); // Adjust based on hit

        // Increase speed by 10% after direction change
        currentSpeed *= 1.1;
        ballSpeedX = -currentSpeed * Math.cos(angle);
        ballSpeedY = -currentSpeed * Math.sin(angle);
    }

    // Scoring
    if (ballX - ballSize / 2 <= 0) {
        player2Score++;
        resetBall();
    } else if (ballX + ballSize / 2 >= canvas.width) {
        player1Score++;
        resetBall();
    }
}

// Reset ball on score
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = initialSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = initialSpeed * (Math.random() - 0.5) * 2; // random angle with initial speed
}

// Draw game
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fff';
    // Paddles
    context.fillRect(0, player1Y, paddleWidth, paddleHeight);
    context.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);
    // Ball
    context.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
    // Scores
    context.font = '30px Arial';
    context.fillText(player1Score, canvas.width / 4, 50);
    context.fillText(player2Score, 3 * canvas.width / 4, 50);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();