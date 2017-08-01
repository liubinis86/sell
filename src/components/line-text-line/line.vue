<template>
	<div class="line-box">
		<div class="line"></div>
		<div class="text">{{text}}</div>
		<div class="line"></div>
	</div>
</template>

<script>
	export default {
		props: {
			'text': String
		}
	};
</script>

<style>
	.line-box{
		display:flex;
		/* width: 100%; */
		text-align: center;
	}
	.line-box .line{
		flex: 1;
		position: relative;
		top: -6px;
		border-bottom: 1px solid rgba(255, 255, 255, .2);
	}
	.line-box .text{
		padding:0 12px;
	}
</style>
