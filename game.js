// 獲取畫布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 遊戲常量
const GRID_SIZE = 20;
const SNAKE_COLOR = '#4CAF50';
const FOOD_COLOR = '#FF4444';

// 遊戲狀態
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop = null;
let gameSpeed = 100;

// 初始化遊戲
function initGame() {
    // 初始化蛇的位置（從中間開始）
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    
    // 重置方向和分數
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    updateScore();
    
    // 生成第一個食物
    generateFood();
    
    // 隱藏遊戲結束畫面
    document.getElementById('gameOver').style.display = 'none';
}

// 生成食物
function generateFood() {
    const maxX = canvas.width / GRID_SIZE - 1;
    const maxY = canvas.height / GRID_SIZE - 1;
    
    // 生成隨機位置
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    } while (isOnSnake(newFood)); // 確保食物不會生成在蛇身上
    
    food = newFood;
}

// 檢查位置是否在蛇身上
function isOnSnake(pos) {
    return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
}

// 更新遊戲狀態
function update() {
    // 更新蛇的方向
    direction = nextDirection;
    
    // 計算新的蛇頭位置
    const head = { x: snake[0].x, y: snake[0].y };
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // 檢查是否撞牆
    if (head.x < 0 || head.x >= canvas.width / GRID_SIZE ||
        head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
        gameOver();
        return;
    }
    
    // 檢查是否撞到自己
    if (isOnSnake(head)) {
        gameOver();
        return;
    }
    
    // 將新的頭部加入蛇身
    snake.unshift(head);
    
    // 檢查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
        // 增加遊戲速度
        if (gameSpeed > 50) {
            gameSpeed -= 2;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameStep, gameSpeed);
        }
    } else {
        // 如果沒吃到食物，移除尾巴
        snake.pop();
    }
}

// 繪製遊戲畫面
function draw() {
    // 清空畫布
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 繪製蛇
    ctx.fillStyle = SNAKE_COLOR;
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
    });
    
    // 繪製食物
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(
        food.x * GRID_SIZE + 1,
        food.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
    );
}

// 更新分數顯示
function updateScore() {
    document.getElementById('score').textContent = `分數：${score}`;
    document.getElementById('finalScore').textContent = score;
}

// 遊戲結束處理
function gameOver() {
    clearInterval(gameLoop);
    document.getElementById('gameOver').style.display = 'block';
}

// 遊戲循環步驟
function gameStep() {
    update();
    draw();
}

// 開始新遊戲
function startGame() {
    initGame();
    if (gameLoop) clearInterval(gameLoop);
    gameSpeed = 100;
    gameLoop = setInterval(gameStep, gameSpeed);
}

// 鍵盤控制
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    // 支援方向鍵和WASD
    switch(key) {
        case 'arrowup':
        case 'w':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'arrowdown':
        case 's':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'arrowleft':
        case 'a':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'arrowright':
        case 'd':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});
