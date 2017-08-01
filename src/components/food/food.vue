<template>
	<div v-show="showFlag" class="food" transition="move" v-el:food>
		<div class="food-centent">
			<div class="img-header">
				<img :src="food.image" alt="" />
				<div class="back" @click="hide">
					<i class="icon-arrow_lift"></i>
				</div>
			</div>
			<div class="content">
				<div class="title">{{food.name}}</div>
				<div class="detail">
					<span class="sell-count">月售{{food.sellCount}}份</span>
					<span class="rating">好评率{{food.rating}}</span>
				</div>
				<div class="price">
					<span class="new">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
				</div>
				<div class="cartcontrol-wrapper">
					<cartcontrol :food="food"></cartcontrol>
				</div>
				<div class="buy" v-show="!this.food.count || this.food.count ===0" @click.stop.prevent="addFirst" transition="fade">加入购物车</div>
			</div>
			<split v-show="food.info"></split>
			<div class="info" v-show="food.info">
				<div class="title">商品信息</div>
				<p class="text">{{food.info}}</p>
			</div>
			<split></split>
			<div class="rating">
				<h1 class="title">商品评价</h1>
				<ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
				<ul >
					<li v-show="ratingShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
						<div class="user">
							<span class="name">{{rating.username}}</span>
							<img :src="rating.avatar" alt="" width="12" height="12" class="avatar" />
						</div>
						<div class="time">{{rating.rateTime | formatDate}}</div>
						<div class="text">
							<i :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}"></i>
							<span>{{rating.text}}</span>
						</div>
					</li>
				</ul>
				<div class="norating" v-show="!food.ratings || food.ratings.length === 0">暂无评价</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import Vue from 'vue';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import split from 'components/split/split';
	import ratingselect from 'components/ratingselect/ratingselect';
	import {formatDate} from 'common/js/date.js';

	// const POSITIVE = 0;
	// const NEGATIVE = 1;
	const ALL = 2;

	export default {
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			};
		},
		components: {
			cartcontrol,
			split,
			ratingselect
		},
		methods: {
			show() {
				this.showFlag = true;
				this.selectType = ALL;
				this.onlyContent = false;
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$els.food, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
			},
			hide() {
				this.showFlag = false;
			},
			addFirst(event) {
				if (!event._constructed) {
					return;
				}
				this.$dispatch('cart.add', event.target);
				Vue.set(this.food, 'count', 1);
			},
			ratingShow(type, text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			}
		},
		events: {
			'ratingtype.select'(type) {
				this.selectType = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			'content.toggle'(onlyContent) {
				this.onlyContent = onlyContent;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		}
	};
</script>

<style>
	.food{
		position: fixed;
		left: 0;
		top: 0;
		bottom: 48px;
		z-index: 30;
		width: 100%;
		background-color: #fff;
	}
	.food.move-transition{
		transition: all .2s linear;
		transform: translate3d(0, 0, 0);
	}
	.food.move-enter,
	.food.move-leave{
		transform: translate3d(100%, 0, 0);
	}
	.food .img-header{
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 100%;
	}
	.food .img-header img{
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.food .img-header .back{
		position: absolute;
		top: 10px;
		left: 0;
	}
	.food .img-header .back .icon-arrow_lift{
		display: block;
		padding: 10px;
		font-size: 16px;
		font-weight: 700;
		color: #fff;
	}
	.food .content{
		position:relative;
		padding: 18px;
	}
	.food .content .title{
		line-height: 14px;
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 700;
		color: rgb(7, 17, 27);
	}
	.food .content .detail{
		margin-bottom: 18px;
		line-height: 10px;
		font-size: 0;
	}
	.food .content .detail .sell-count,
	.food .content .detail .rating{
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
	.food .content .detail .sell-count{
		margin-right: 12px;
	}
	.food .content .price{
		line-height: 24px;
	}
	.food .content .price .new{
		font-size: 14px;
		font-weight: 700;
		color: rgb(240, 20, 20);
		margin-right: 8px;
	}
	.food .content .price .old{
		text-decoration: line-through;
		font-size: 10px;
		font-weight: 700;
		color: rgb(147, 153, 159);
	}
	.food .cartcontrol-wrapper{
		position: absolute;
		right: 12px;
		bottom: 12px;
	}
	.food .buy{
		position: absolute;
		right: 18px;
		bottom: 18px;
		z-index: 10;
		height: 24px;
		line-height: 24px;
		padding: 0 12px;
		box-sizing: border-box;
		border-radius: 12px;
		font-size: 10px;
		color: #fff;
		background-color: rgb(0, 160, 220);
	}
	.food .buy.fade-transition{
		transition: all .35s linear;
		opacity: 1;
	}
	.food .buy.fade-enter,
	.food .buy.fade-leave{
		opacity: 0;
	}
	.food .food-centent .info{
		padding: 18px;
	}
	.food .food-centent .info .title{
		line-height: 14px;
		margin-bottom: 6px;
		font-size: 14px;
		color: rgb(7, 17, 27);
	}
	.food .food-centent .info .text{
		line-height: 24px;
		padding: 0 8px;
		font-size: 12px;
		color: rgb(77, 85, 93);
	}
	.food .food-centent .rating{
		padding-top: 18px;
	}
	.food .food-centent .rating .title{
		line-height: 14px;
		margin-left: 18px;
		font-size: 14px;
		color: rgb(7, 17, 27);
	}
	.food .food-centent .rating ul{
		padding: 0 18px;
	}
	.food .food-centent .rating ul .rating-item{
		position: relative;
		padding: 16px 0;
	}
	.food .food-centent .rating ul .rating-item .user{
		position: absolute;
		right: 0;
		top: 16px;
		font-size: 0;
	}
	.food .food-centent .rating ul .rating-item .user .name{
		margin-right: 6px;
		line-height: 12px;
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
	.food .food-centent .rating ul .rating-item .user .avatar{
		border-radius: 50%;
		vertical-align: top;
	}
	.food .food-centent .rating ul .rating-item .time{
		margin-bottom: 6px;
		line-height: 12px;
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
	.food .food-centent .rating ul .rating-item .text span{
		margin-left: 4px;
		line-height: 16px;
		font-size: 12px;
		color: rgb(7, 17, 27);
	}
	.food .food-centent .rating ul .rating-item .text .icon-thumb_up,
	.food .food-centent .rating ul .rating-item .text .icon-thumb_down{
		line-height: 16px;
		font-size: 12px;
	}
	.food .food-centent .rating ul .rating-item .text .icon-thumb_up{
		color: rgb(0, 160, 220);
	}
	.food .food-centent .rating ul .rating-item .text .icon-thumb_down{
		color: rgb(147, 153, 159);
	}
	.food .food-centent .rating .norating{
		padding: 0 18px;
		line-height: 16px;
		font-size: 16px;
		color: rgb(7, 17, 27);
	}
</style>
