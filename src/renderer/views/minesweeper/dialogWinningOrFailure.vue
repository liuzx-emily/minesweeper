<style lang="scss" scoped>
	.message {
		text-align: center;
		font-size: 16px;
	}
	.dialog-footer {
		text-align: center;
		.el-button {
			padding: 7px 10px 3px;
			line-height: normal;
		}
	}
</style>
<template>
	<el-dialog title="" :visible.sync="dialogVisible" width="300px">
		<div class="message">{{message}}</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="playAgain">再来一局</el-button>
			<!-- <el-button type="primary" @click="$router.push('/home')">换个游戏</el-button>
			<el-button type="danger">退出</el-button> -->
		</div>
	</el-dialog>
</template>
<script>
	export default {
		data() {
			return {
				dialogVisible: false,
				message: "",
			};
		},
		methods: {
			open(message) {
				this.message = message;
				this.dialogVisible = true;
			},
			playAgain() {
				this.dialogVisible = false;
				this.$parent.openDialog_selectModeBeforeGameStart();
			}
		}
	};
</script>