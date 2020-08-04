<template>
	<div class="game-container" :class="{gameover:isGameOver,gamesuccess:isGameSuccess}" :style="{'--row-cell-count':settings.width}">
		<section style="text-align:center;margin-bottom:20px">
			<el-button type="primary" @click="openDialog_selectModeBeforeGameStart">再来一局</el-button>
		</section>
		<section v-if="game">
			<header>
				<span class="left-mines-count">
					<img src="./assets/mine.svg" alt="">
					{{isGameOver?0:settings.count-flaggedCount}}</span>
				<span class="title">
					扫雷
				</span>
				<span class="time">
					<img src="./assets/clock.svg" alt="">{{gameTime}}
				</span>
			</header>
			<section class="board">
				<!-- 这里的 row col 都从1开始，所以用的时候要手动减1 -->
				<section v-for="row in settings.height" :key="row" class="board-row">
					<section v-for="col in settings.width" :key="col" class="board-cell" @mouseup="e=>{handleCellMouseUp(e,row,col)}" @mousedown="e=>{handleCellMouseDown(e,row,col)}" :class="{
            isOpen:getCell(row,col).isOpen,
            isFlag:getCell(row,col).isFlag,
            isMine:getCell(row,col).isMine,
          }">
						<img src="./assets/flag.svg" class="icon icon-flag">
						<img src="./assets/flag-wrong.svg" class="icon icon-flag-wrong">
						<img src="./assets/mine.svg" class="icon icon-mine">
						<span class="nearbyMinesCount" v-if="getCell(row,col).showNearbyMinesCount">{{getCell(row,col).nearbyMinesCount}}</span>
					</section>
				</section>
			</section>
		</section>
		<dialogWinningOrFailure ref="dialogWinningOrFailure"></dialogWinningOrFailure>
		<dialogSelectModeBeforeGameStart ref="dialogSelectModeBeforeGameStart"></dialogSelectModeBeforeGameStart>
	</div>
</template>

<script>
	import dialogWinningOrFailure from './dialogWinningOrFailure.vue'
	import dialogSelectModeBeforeGameStart from './dialogSelectModeBeforeGameStart.vue'
	import Game from './js/Game'

	export default {
		components: { dialogWinningOrFailure, dialogSelectModeBeforeGameStart },
		computed: {
			isGameOver() {
				if (this.game) {
					return this.game.isGameOver;
				} else {
					return false;
				}
			},
			isGameSuccess() {
				if (this.game) {
					return this.game.isGameSuccess;
				} else {
					return false;
				}
			},
			flaggedCount() {
				if (this.game) {
					return this.game.flaggedCount;
				} else {
					return 0;
				}
			}
		},
		watch: {
			isGameOver(val) {
				if (val) {
					this.$refs.dialogWinningOrFailure.open("踩到雷了，游戏失败！")
				}
			},
			isGameSuccess(val) {
				if (val) {
					this.$refs.dialogWinningOrFailure.open("游戏成功！")
				}
			}
		},
		data() {
			return {
				// 
				settings: {
					width: 4,
					height: 4,
					count: 2,
				},
				game: null,
				gameTime: 0,
				mousePressCount: 0,
			}
		},
		mounted() {
			this.openDialog_selectModeBeforeGameStart();
		},
		methods: {
			getGameTime() {
				if (!this.game || !this.game.gameStartTime) {
					setTimeout(() => this.getGameTime(), 1000);
					return 0;
				}
				let end;
				if (this.isGameOver || this.isGameSuccess) {
					end = this.game.gameEndTime;
				} else {
					end = +new Date();
					setTimeout(() => this.getGameTime(), 1000);
				}
				const sec = Math.ceil((end - this.game.gameStartTime) / 1000);
				this.gameTime = sec;
			},
			openDialog_selectModeBeforeGameStart() {
				this.$refs.dialogSelectModeBeforeGameStart.open(settings => {
					this.settings.width = settings.width;
					this.settings.height = settings.height;
					this.settings.count = settings.count;
					this.startGame();
				})
			},
			startGame() {
				this.gameTime = 0;
				this.game = new Game({
					width: this.settings.width,
					height: this.settings.height,
					count: this.settings.count,
				});
				this.getGameTime();
			},
			// 出现 down down up up 说明是，有多个鼠标按键同时放了
			handleCellMouseDown(e, row, col) {
				this.mousePressCount += 1;
			},
			handleCellMouseUp(e, row, col) {
				if (this.isGameOver) {
					return;
				}
				if (this.mousePressCount === 1) {
					// 按了一个！
					if (e.button === 0) {
						// 按左键
						this.game.clickCell(row - 1, col - 1);
					} else if (e.button === 2) {
						// 按右键
						this.game.rightClickCell(row - 1, col - 1);
					}
				} else if (this.mousePressCount === 2) {
					// 同时按了两个！
					if (e.buttons === 2) {
						// 同时按左右键
						this.game.doubleClickCell(row - 1, col - 1);
					}
				}
				this.mousePressCount = 0;
			},
			getCell(row, col) {
				return this.game.cells[(row - 1) * this.settings.width + (col - 1)];
			}
		}
	}
</script>
<style lang="scss" scoped>
	.el-button {
		padding: 4px 10px 3px;
		line-height: normal;
	}
	.game-container {
		$cell-size: 30px;
		// --row-cell-count: 3;
		width: calc(var(--row-cell-count) * #{$cell-size});
		margin: 0 auto;
		header {
			display: flex;
			display: flex;
			height: 30px;
			line-height: 30px;
			.left-mines-count, .time {
				flex: 0 0 70px;
				font-size: 18px;
				text-align: left;
				img {
					width: 18px;
					margin-right: 5px;
					position: relative;
					top: 2px;
				}
			}
			.title {
				flex: 1 1 80%;
				text-align: center;
				font-size: 20px;
			}
			.time {
				text-align: right;
				img {
					width: 19px;
          top: 3px;
				}
			}
		}
		.board {
			border-top: 1px solid #ddd;
			.board-row {
				display: flex;
				justify-content: space-around;
				border-right: 1px solid #ddd;
				border-bottom: 1px solid #ddd;
				.board-cell {
					width: $cell-size;
					height: $cell-size;
					text-align: center;
					border-left: 1px solid #ddd;
					position: relative;
					.nearbyMinesCount {
						display: none;
						height: $cell-size;
						line-height: $cell-size;
					}
					.icon {
						opacity: 0;
						position: absolute;
						width: 60%;
						height: 60%;
						top: 20%;
						left: 20%;
					}
				}
				.board-cell.isOpen {
					background: #e5e5e5;
					.nearbyMinesCount {
						display: block;
					}
				}
				.board-cell:not(.isOpen) {
					&::before {
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						border: 4px solid #eee;
						border-right-color: #aaa;
						border-bottom-color: #aaa;
						content: "";
						display: inline-block;
						background: #ddd;
					}
				}
				.board-cell.isFlag {
					.icon-flag {
						opacity: 1;
					}
				}
			}
		}
		&.gameover {
			.board-cell.isMine {
				.icon-mine {
					opacity: 1;
				}
			}
			// 踩到的雷
			.board-cell.isMine.isOpen {
				background: rgba(255, 0, 0, 0.75);
			}
		}
	}
</style>