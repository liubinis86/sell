<template>
	<div class="cartcontrol">
		<div class="cart-decrease" @click.stop.prevent="decreaseCart" v-show="food.count>0" transition="move">
			<div class="inner icon-remove_circle_outline"></div>
		</div>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script>
import Vue from 'vue';

export default {
	props: {
		food: {
			type: Object
		}
	},
	methods: {
		addCart(event) {
			if (!event._constructed) {
				return;
			}
			if (!this.food.count) {
				Vue.set(this.food, 'count', 1);
			} else {
				this.food.count ++;
			}
			this.$dispatch('cart.add', event.target);
		},
		decreaseCart(event) {
			if (!event._constructed) {
				return;
			}
			if (this.food.count > 0) {
				this.food.count --;
			}
		}
	}
};
</script>

<style>
	.cartcontrol{
		font-size: 0;
	}
	.cartcontrol .cart-decrease{
		display: inline-block;
		transition: all .3s linear;
	}
	.cartcontrol .cart-decrease.move-transition{
		transform: translate3d(0, 0, 0);
	}
	.cartcontrol .cart-decrease.move-transition .inner{
		transform: rotate(0);
	}
	.cartcontrol .cart-decrease.move-enter,
	.cartcontrol .cart-decrease.move-leave{
		transform: translate3d(24px, 0, 0);
	}
	.cartcontrol .cart-decrease.move-enter .inner,
	.cartcontrol .cart-decrease.move-leave .inner{
		transform: rotate(180deg);
	}
	.cartcontrol .cart-decrease .inner{
		display: inline-block;
		padding: 6px;
		line-height: 24px;
		font-size: 24px;
		color: rgb(0, 160, 220);
		transition: all .3s linear;
	}
	.cartcontrol .cart-count{
		display: inline-block;
		vertical-align: top;
		width: 12px;
		padding-top: 6px;
		line-height: 24px;
		font-size: 10px;
		text-align: center;
		color: rgb(143, 153, 159);
	}
	.cartcontrol .cart-add{
		display: inline-block;
		padding: 6px;
		line-height: 24px;
		font-size: 24px;
		color: rgb(0, 160, 220);
	}
</style>
