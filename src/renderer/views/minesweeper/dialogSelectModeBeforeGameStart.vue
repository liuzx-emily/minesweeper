<style lang="scss" scoped>
	.message {
		text-align: center;
		font-size: 16px;
	}
	.modes {
		text-align: center;
		.el-button {
			display: block;
			margin: 15px auto 0;
			padding: 8px 40px 6px;
		}
	}
</style>
<template>
	<el-dialog title="" :visible.sync="dialogVisible" width="300px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
		<div class="message">请选择游戏难度：</div>
		<div class="modes">
			<el-button type="primary" @click="selectMode(o)" v-for="o in list" :key="o.label">{{o.label}}</el-button>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		data() {
			return {
				dialogVisible: false,
				list: [
					{ label: "初级", settings: { width: 9, height: 9, count: 10 } },
					{ label: "中级", settings: { width: 16, height: 16, count: 40 } },
					{ label: "高级", settings: { width: 30, height: 16, count: 99 } },
				],
				cb: null
			};
		},
		methods: {
			open(cb) {
				this.dialogVisible = true;
				this.cb = cb;
			},
			selectMode(o) {
				this.dialogVisible = false;
				this.cb(o.settings)
			}
		}
	};
</script>