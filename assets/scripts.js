class Block {
	constructor(game, x, y) {
		this.game = game;
		this.bottomLeft = [x, y];
		this.bottomRight = [x + 100, y];
		this.topLeft = [x, y + 20];
		this.topRight = [x + 100, y + 20];
		this.element = document.createElement("div");
		this.element.classList.add("block");
		this.draw();
		this.game.board.element.appendChild(this.element);
	}
	draw() {
		this.element.style.left = this.bottomLeft[0] + "px";
		this.element.style.bottom = this.bottomLeft[1] + "px";
	}
}

class Board {
	constructor() {
		this.width = 560;
		this.height = 300;
		this.element = document.querySelector(".board");
	}
}

class Display {
	constructor() {
		this.score = 0;
		this.element = document.querySelector(".display");
	}
	update() {
		this.element.innerHTML = "SCORE: " + this.score;
	}
}

class User {
	constructor(game) {
		this.game = game;
		this.position = [230, 10];
		this.element = document.createElement("div");
		this.element.classList.add("user");
		this.draw();
		this.game.board.element.appendChild(this.element);
	}
	draw() {
		this.element.style.left = this.position[0] + "px";
		this.element.style.bottom = this.position[1] + "px";
	}
	update(e) {
		switch (e.key) {
			case " ":
				if (!this.game.started) {
					this.game.started = true;
					this.game.display.update();
				}
				break;
			case "ArrowLeft":
				if (this.game.started && this.position[0] > 0) {
					this.position[0] -= 10;
					this.draw();
				}
				break;
			case "ArrowRight":
				if (
					this.game.started &&
					this.position[0] < this.game.board.width - 100
				) {
					this.position[0] += 10;
					this.draw();
				}
				break;
		}
	}
}

class Ball {
	constructor(game) {
		this.game = game;
		this.position = [270, 40];
		this.direction = [-2, 2];
		this.diameter = 20;
		this.element = document.createElement("div");
		this.element.classList.add("ball");
		this.draw();
		this.game.board.element.appendChild(this.element);
	}
	draw() {
		this.element.style.left = this.position[0] + "px";
		this.element.style.bottom = this.position[1] + "px";
	}
	turn() {
		if (this.direction[0] === 2 && this.direction[1] === 2) {
			this.direction[1] = -2;
		} else if (this.direction[0] === 2 && this.direction[1] === -2) {
			this.direction[0] = -2;
		} else if (this.direction[0] === -2 && this.direction[1] === -2) {
			this.direction[1] = 2;
		} else if (this.direction[0] === -2 && this.direction[1] === 2) {
			this.direction[0] = 2;
		}
	}
	update() {
		if (this.game.started) {
			this.position[0] += this.direction[0];
			this.position[1] += this.direction[1];
			this.draw();
			this.game.update();
		}
	}
}

class Game {
	constructor() {
		this.started = false;
		this.board = new Board();
		this.display = new Display();
		this.user = new User(this);
		document.addEventListener("keydown", (e) => {
			this.user.update(e);
		});
		this.blocks = [
			new Block(this, 10, 270),
			new Block(this, 120, 270),
			new Block(this, 230, 270),
			new Block(this, 340, 270),
			new Block(this, 450, 270),
			new Block(this, 10, 240),
			new Block(this, 120, 240),
			new Block(this, 230, 240),
			new Block(this, 340, 240),
			new Block(this, 450, 240),
			new Block(this, 10, 210),
			new Block(this, 120, 210),
			new Block(this, 230, 210),
			new Block(this, 340, 210),
			new Block(this, 450, 210),
		];
		this.ball = new Ball(this);
		this.intervalId = setInterval(() => {
			this.ball.update();
		}, 20);
	}
	update() {
		for (let i = 0; i < this.blocks.length; i++) {
			if (
				this.ball.position[0] > this.blocks[i].bottomLeft[0] &&
				this.ball.position[0] < this.blocks[i].bottomRight[0] &&
				this.ball.position[1] + this.ball.diameter >
					this.blocks[i].bottomLeft[1] &&
				this.ball.position[1] < this.blocks[i].topLeft[1]
			) {
				const blocks = Array.from(document.querySelectorAll(".block"));
				blocks[i].classList.remove("block");
				this.blocks.splice(i, 1);
				this.ball.turn();
				this.display.score++;
				this.display.update();
				if (this.blocks.length === 0) {
					clearInterval(this.intervalId);
					this.display.element.innerHTML = "YOU WIN!";
					document.removeEventListener("keydown", (e) => {
						this.user.update(e);
					});
				}
			}
		}
		if (
			this.ball.position[0] >= this.board.width - this.ball.diameter ||
			this.ball.position[1] >= this.board.height - this.ball.diameter ||
			this.ball.position[0] <= 0
		) {
			this.ball.turn();
		}
		if (
			this.ball.position[0] > this.user.position[0] &&
			this.ball.position[0] < this.user.position[0] + 100 &&
			this.ball.position[1] > this.user.position[1] &&
			this.ball.position[1] < this.user.position[1] + 20
		) {
			this.ball.turn();
		}
		if (this.ball.position[1] <= 0) {
			clearInterval(this.intervalId);
			this.display.element.innerHTML = "YOU LOSE! SCORE: " + this.display.score;
			document.removeEventListener("keydown", (e) => {
				this.user.update(e);
			});
		}
	}
}

const game = new Game();
