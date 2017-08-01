<template>
	<div class="ratings" v-el:ratings>
		<div class="content">
			<div class="overview border-1px">
				<div class="overview-left">
					<div class="scroe">{{seller.score}}</div>
					<div class="text">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="desc">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="desc">商品评分</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="deliveryTime">
						<span class="desc">送达时间</span>
						<span class="time">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-show="ratingShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item border-1px">
						<div class="avatar">
							<img :src="rating.avatar" alt="" width="28" height="28" />
						</div>
						<div class="content">
							<h1 class="username">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star :size="36" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="time">{{rating.rateTime | formatDate}}</div>
							<div class="recommend" v-show="rating.recommend &&rating.recommend !==''">
								<i :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}"></i>
								<span v-for="food in rating.recommend">{{food}}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import BScroll from 'better-scroll';
	import star from 'components/star/star';
	import split from 'components/split/split';
	import ratingselect from 'components/ratingselect/ratingselect';
	import {formatDate} from 'common/js/date.js';

	const ALL = 2;
	const ERR_OK = 0;

	export default{
		data() {
			return {
				selectType: ALL,
				onlyContent: true,
				ratings: []
			};
		},
		created() {
			this.$http.get('/api/ratings/').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.ratings = response.data;
					this.$nextTick(() => {
						this.scroll = new BScroll(this.$els.ratings, {
							click: true
						});
					});
				}
			});
		},
		props: {
			seller: {
				type: Object
			}
		},
		components: {
			star,
			split,
			ratingselect
		},
		methods: {
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
	.ratings{
		position: absolute;
		top: 174px;
		left: 0;
		bottom: 0;
		width: 100%;
		overflow: hidden;
	}
	.ratings .overview{
		display: flex;
		padding: 18px 0;
	}
	.ratings .overview .overview-left{
		flex: 0 0 137px;
		width: 137px;
		text-align: center;
		border-right: 1px solid rgba(7, 17, 27, .1);
	}
	.ratings .overview .overview-left .scroe{
		line-height: 28px;
		font-size: 24px;
		color: rgb(255, 153, 0);
	}
	.ratings .overview .overview-left .text{
		margin: 6px 0 8px 0;
		line-height: 12px;
		font-size: 12px;
		color: rgb(7, 17, 27);
	}
	.ratings .overview .overview-left .rank{
		line-height: 10px;
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
	.ratings .overview .overview-right{
		flex: 1;
		padding: 0 12px;
	}
	.ratings .overview .overview-right .score-wrapper{
		margin-bottom: 8px;
		font-size: 0;
	}
	.ratings .overview .overview-right .score-wrapper .desc,
	.ratings .overview .overview-right .score-wrapper .score{
		display: inline-block;
		vertical-align: top;
		line-height: 18px;
		font-size: 12px;
		color: rgb(7, 17, 27);
	}
	.ratings .overview .overview-right .score-wrapper .star{
		display: inline-block;
		vertical-align: top;
		margin: 0 12px;
	}
	.ratings .overview .overview-right .score-wrapper .score {
		color: rgb(255, 153, 0);
	}
	.ratings .overview .overview-right .deliveryTime{
		font-size: 0;
	}
	.ratings .overview .overview-right .deliveryTime .desc{
		line-height: 18px;
		font-size: 12px;
		color: rgb(7, 17, 27);
		margin-right: 12px;
	}
	.ratings .overview .overview-right .deliveryTime .time{
		line-height: 18px;
		font-size: 12px;
		color: rgb(147, 153, 159);
	}
	.ratings .rating-wrapper{
		padding: 0 18px;
	}
	.ratings .rating-wrapper .rating-item{
		display: flex;
		padding: 18px 0;
	}
	.ratings .rating-wrapper .rating-item .avatar{
		flex: 0 0 28px;
		width: 28px;
		margin-right: 12px;
	}
	.ratings .rating-wrapper .rating-item .avatar img{
		border-radius: 50%;
	}
	.ratings .rating-wrapper .rating-item .content{
		position: relative;
		flex: 1;
	}
	.ratings .rating-wrapper .rating-item .content .username{
		margin-bottom: 4px;
		line-height: 12px;
		font-size: 10px;
		color: rgb(7, 17, 27);
	}
	.ratings .rating-wrapper .rating-item .content .star-wrapper{
		margin-bottom: 6px;
		font-size: 0;
	}
	.ratings .rating-wrapper .rating-item .content .star-wrapper .star{
		display: inline-block;
		vertical-align: top;
		margin-right: 6px;
		line-height: 12px;
	}
	.ratings .rating-wrapper .rating-item .content .star-wrapper .delivery{
		display: inline-block;
		vertical-align: top;
		line-height: 18px;
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
	.ratings .rating-wrapper .rating-item .content .text{
		margin-bottom: 8px;
		line-height: 18px;
		font-size: 12px;
		color: rgb(7, 17, 27);
	}
	.ratings .rating-wrapper .rating-item .content .time{
		position: absolute;
		right: 0;
		top: 0;
		line-height: 12px;
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
	.ratings .rating-wrapper .rating-item .content .recommend {
		font-size: 0;
	}
	.ratings .rating-wrapper .rating-item .content .recommend span{
		display: inline-block;
		vertical-align: top;
		margin-right: 8px;
		margin-bottom: 4px;
		padding: 0 6px;
		border: 1px solid rgba(7, 17, 27, .1);
		border-radius: 2px;
		line-height: 16px;
		font-size: 9px;
		color: rgb(147, 153, 159);
	}
	.ratings .rating-wrapper .rating-item .content .recommend .icon-thumb_up,
	.ratings .rating-wrapper .rating-item .content .recommend .icon-thumb_down{
		line-height: 16px;
		font-size: 12px;
		margin-right: 8px;
	}
	.ratings .rating-wrapper .rating-item .content .recommend .icon-thumb_up{
		color: rgb(0, 160, 220);
	}
	.ratings .rating-wrapper .rating-item .content .recommend .icon-thumb_down{
		color: rgb(147, 153, 159);
	}
</style>
