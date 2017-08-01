<template>
	<div class="shopping-cart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight': totalCount>0}" >
						<i class="icon-shopping_cart"></i>
					</div>
					<div v-show="totalCount>0" class="num">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
				<div class="deliveryPrice">另需配送费{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click.stop.prevent="pay">
				<div class="minPrice" :class="payEnough">{{payDesc}}</div>
			</div>
		</div>
		<div class="ball-container">
			<div class="ball" v-for=" ball in balls" v-show="ball.show" transition="drop">
				<div class="inner inner-hook"></div>
			</div>
		</div>
		<div class="selectedfood-list" v-show="showList" transition="fold">
			<div class="header">
				<h1 class="title">购物车</h1>
				<span class="empty" @click="empty">清空</span>
			</div>
			<div class="list-content" v-el:list-content>
				<ul>
					<li class="food border-1px" v-for="food in selectFoods">
						<span class="name">{{food.name}}</span>
						<div class="price">
							<span>￥{{food.price*food.count}}</span>
						</div>
						<div class="cartcontrol-wrapper">
							<cartcontrol :food="food"></cartcontrol>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="list-marsk" @click="hideList" v-show="showList" transition="fade"></div>
</template>

<script>
import cartcontrol from 'components/cartcontrol/cartcontrol';
import BScroll from 'better-scroll';

export default {
	data() {
		return {
			balls: [
			{show: false},
			{show: false},
			{show: false},
			{show: false},
			{show: false}
			],
			dropBalls: [],
			fold: false
		};
	},
	components: {
		cartcontrol
	},
	methods: {
		drop(el) {
			for (let i = 0; i < this.balls.length; i++) {
				let ball = this.balls[i];
				if (!ball.show) {
					ball.show = true;
					ball.el = el;
					this.dropBalls.push(ball);
					return;
				}
			}
		},
		toggleList() {
			if (!this.totalCount) {
				return;
			}
			this.fold = !this.fold;
		},
		hideList() {
			this.fold = true;
		},
		empty() {
			this.selectFoods.forEach((food) => {
				food.count = 0;
			});
		},
		pay() {
			if (this.totalPrice < this.minPrice) {
				return;
			}
			window.alert(`您只需要支付${this.totalPrice}元`);
		}
	},
	transitions: {
		drop: {
			beforeEnter(el) {
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						el.style.transform = `translate3d(0,${y}px,0)`;
						let inner = el.querySelectorAll('.inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter(el) {
				/* eslint-disable no-unused-vars */
				// 让浏览器重绘
				let rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.querySelectorAll('.inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
				});
			},
			afterEnter(el) {
				let ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			}
		}
	},
	props: {
		selectFoods: {
			type: Array,
			// vue 定义的数组或者对象，定义默认值必须是函数的形式
			default() {
				return [];
			}
		},
		deliveryPrice: {
			type: Number,
			default: 0
		},
		minPrice: {
			type: Number,
			default: 0
		}
	},
	computed: {
		totalPrice() {
			let total = 0;
			this.selectFoods.forEach((food) => {
				total += food.price * food.count;
			});
			return total;
		},
		totalCount() {
			let count = 0;
			this.selectFoods.forEach((food) => {
				count += food.count;
			});
			return count;
		},
		payDesc() {
			if (this.totalPrice === 0) {
				return `￥${this.minPrice}起送`;
			} else if (this.totalPrice < this.minPrice) {
				let diff = this.minPrice - this.totalPrice;
				return `差${diff}元起送`;
			} else {
				return '去结算';
			}
		},
		payEnough() {
			if (this.totalPrice < this.minPrice) {
				return 'not-enough';
			} else {
				return 'enough';
			}
		},
		showList() {
			if (!this.totalCount) {
				this.fold = true;
				return false;
			}
			let show = !this.fold;
			if (show) {
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$els.listContent, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
			}
			return show;
		}
	}
};
</script>

<style>
	.shopping-cart{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 50;
		width: 100%;
		height: 48px;
	}
	.shopping-cart .content{
		display: flex;
		background-color: #141d27;
		font-size: 0;
		color: rgba(255, 255, 255, .4);
	}
	.shopping-cart .content .content-left{
		flex: 1;
	}
	.shopping-cart .content .content-left .logo-wrapper{
		display: inline-block;
		vertical-align: top;
		position: relative;
		top: -10px;
		margin: 0 12px;
		padding: 6px;
		width: 56px;
		height: 56px;
		box-sizing: border-box;
		border-radius: 50%;
		background-color: #141d27;
	}
	.shopping-cart .content .content-left .logo-wrapper .logo{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		text-align: center;
		background-color: rgba(255, 255, 255, .2);
	}
	.shopping-cart .content .content-left .logo-wrapper .logo.highlight{
		color: #fff;
		background-color: rgb(0, 160, 220);
	}
	.shopping-cart .content .content-left .logo-wrapper .num{
		position: absolute;
		top: 0;
		right: 0;
		width: 24px;
		height: 16px;
		line-height: 16px;
		text-align: center;
		border-radius: 16px;
		font-size: 9px;
		font-weight: 700;
		color: #fff;
		background-color: rgb(240, 20, 20);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
	}
	.shopping-cart .content .content-left .logo-wrapper .logo .icon-shopping_cart{
		font-size: 30px;
		line-height: 44px;
	}
	.shopping-cart .content .content-left .price{
		display: inline-block;
		vertical-align: top;
		margin-top: 12px;
		padding-right: 12px;
		border-right: 1px solid rgba(255, 255, 255, .1);
		font-size: 16px;
		font-weight: 700;
		line-height:24px;
		box-sizing: border-box;
	}
	.shopping-cart .content .content-left .price.highlight{
		color: #fff;
	}
	.shopping-cart .content .content-left .deliveryPrice{
		display: inline-block;
		vertical-align: top;
		padding: 12px 12px 0 12px;
		font-size: 10px;
		line-height: 24px;
	}
	.shopping-cart .content .content-right{
		flex: 0 0 105px;
		width: 105px;
	}
	.shopping-cart .content .content-right .minPrice{
		height: 48px;
		line-height: 48px;
		text-align: center;
		font-size: 12px;
		font-weight: 700;
		background-color: rgba(255, 255, 255, .2);
	}
	.shopping-cart .content .content-right .minPrice.not-enough{
		background-color: rgba(255, 255, 255, .2);
	}
	.shopping-cart .content .content-right .minPrice.enough{
		background-color: #00b43c;
		color: #fff;
	}
	.shopping-cart .ball-container{}
	.shopping-cart .ball-container .ball{
		position: fixed;
		left: 32px;
		bottom: 22px;
		z-index: 200;
	}
	.shopping-cart .ball-container .ball.drop-transition{
		transition: all .4s cubic-bezier(.49, -.29, .75, .41);
	}
	.shopping-cart .ball-container .ball.drop-transition .inner{
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: rgb(0, 160, 220);
		transition: all .4s linear;
	}
	.shopping-cart .selectedfood-list{
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		width: 100%;
	}
	.shopping-cart .selectedfood-list.fold-transition{
		transition: all .4s;
		transform: translate3d(0, -100%, 0);
	}
	.shopping-cart .selectedfood-list.fold-enter,
	.shopping-cart .selectedfood-list.fold-leave{
		transform: translate3d(0, 0, 0);
	}
	.shopping-cart .selectedfood-list .header{
		height:40px;
		line-height: 40px;
		padding: 0 18px;
		border-bottom: 1px solid rgba(7, 17, 27, .1);
		background-color: #f3f5f7;
	}
	.shopping-cart .selectedfood-list .header .title{
		float: left;
		font-size: 14px;
		color: rgb(7, 17, 27);
	}
	.shopping-cart .selectedfood-list .header .empty{
		float: right;
		font-size: 12px;
		color: rgb(0, 160, 220);
	}
	.shopping-cart .selectedfood-list .list-content{
		max-height: 217px;
		padding: 0 18px;
		background-color: #fff;
		overflow: hidden;
	}
	.shopping-cart .selectedfood-list .list-content .food{
		position: relative;
		padding: 12px 0;
		box-sizing: border-box;
	}
	.shopping-cart .selectedfood-list .list-content .food .name{
		line-height: 24px;
		font-size: 14px;
		color: rgb(7, 17, 27);
	}
	.shopping-cart .selectedfood-list .list-content .food .price{
		position: absolute;
		right: 90px;
		bottom: 12px;
		line-height: 24px;
		font-size: 14px;
		font-weight: 700;
		color: rgb(240, 20, 20);
	}
	.shopping-cart .selectedfood-list .list-content .food .cartcontrol-wrapper{
		position: absolute;
		right: 0;
		bottom: 6px;
	}
	.list-marsk{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 40;
		backdrop-filter: blur(10px);
	}
	.list-marsk.fade-transition {
		transition: all .4s;
		opacity: 1;
		background-color: rgba(7, 17, 27, .6);
	}
	.list-marsk.fade-enter,
	.list-marsk.fade-leave{
		opacity: 0;
		background-color: rgba(7, 17, 27, 0);
	}
</style>
