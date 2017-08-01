<template>
	<div class="seller" v-el:seller>
		<div class="content">
			<div class="seller-header">
				<div class="header-top border-1px">
					<div class="name">{{seller.name}}</div>
					<star :size="36" :score="seller.score"></star>
					<span class="rating">({{seller.ratingCount}})</span>
					<span class="count">月售{{seller.sellCount}}单</span>
				</div>
				<div class="header-bottom">
					<div class="desc-wrapper">
						<p class="desc">起送价</p>
						<span><span class="detail">{{seller.minPrice}}</span>元</span>
					</div>
					<div class="desc-wrapper">
						<p class="desc">商家配送</p>
						<span><span class="detail">{{seller.deliveryPrice}}</span>元</span>
					</div>
					<div class="desc-wrapper">
						<p class="desc">平均配送时间</p>
						<span><span class="detail">{{seller.deliveryTime}}</span>分钟</span>
					</div>
				</div>
				<div class="collect" @click="toggleCollect">
					<span class="icon-favorite" :class="{'active': favorite}"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<split></split>
			<div class="seller-bulletin border-1px">
				<h1 class="title">公告与活动</h1>
				<span class="bulletin">{{seller.bulletin}}</span>
			</div>
			<div class="seller-supports">
				<ul>
					<li v-for="support in seller.supports" class="support border-1px">
						<i :class="classMap[support.type]"></i>
						<span class="description">{{support.description}}</span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="seller-pics">
				<h1 class="title border-1px">商家实景</h1>
				<div class="pic-wrapper" v-el:pic-wrapper>
					<ul class="pic-list" v-el:pic-list>
					<li v-for="pic in seller.pics" class="pic">
						<img :src="pic" alt="" width="120" height="90" />
					</li>
				</ul>
				</div>
			</div>
			<split></split>
			<div class="seller-info">
				<h1 class="title border-1px">商家信息</h1>
				<ul>
					<li class="info-item border-1px" v-for="info in seller.infos">
						{{info}}
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
	import {saveToLocal, loadFromLocal} from 'common/js/store';

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				favorite: (() => {
					return loadFromLocal(this.seller.id, 'favorite', false);
				})()
			};
		},
		computed: {
			favoriteText () {
				return this.favorite ? '已收藏' : '收藏';
			}
		},
		components: {
			star,
			split
		},
		created() {
			this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
		},
		watch: {
			'seller'() {
				this._initScroll();
				this._initPics();
			}
		},
		ready() {
			this._initScroll();
			this._initPics();
		},
		methods: {
			_initScroll() {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$els.seller, {
					click: true
				});
				} else {
					this.scroll.refresh();
				}
			},
			_initPics() {
				if (this.seller.pics) {
				let picWidth = 120;
				let margin = 6;
				let width = (picWidth + margin) * this.seller.pics.length - margin;
				this.$els.picList.style.width = width + 'px';
				this.$nextTick(() => {
					if (!this.picScroll) {
						this.picScroll = new BScroll(this.$els.picWrapper, {
						scrollX: true,
						eventPassthrough: 'vertical'
						});
					} else {
						this.picScroll.refresh();
					}
				});
				}
			},
			toggleCollect(event) {
				if (!event._constructed) {
					return;
				}
				this.favorite = !this.favorite;
				saveToLocal(this.seller.id, 'favorite', this.favorite);
			}
		}

	};
</script>
<style>
	.seller{
		position: absolute;
		top: 174px;
		left: 0;
		bottom: 0;
		width: 100%;
		overflow: hidden;
	}
	.seller .seller-header{
		position: relative;
		padding: 0 18px;
	}
	.seller .seller-header .header-top{
		padding: 18px 0;
		font-size: 0;
	}
	.seller .seller-header .header-top .name{
		line-height: 14px;
		font-size: 14px;
		color: rgb(7, 17, 27);
		margin-bottom: 8px;
	}
	.seller .seller-header .header-top .star{
		display: inline-block;
		vertical-align: top;
		margin-right: 8px;
		line-height: 18px;
	}
	.seller .seller-header .header-top .rating,
	.seller .seller-header .header-top .count{
		display: inline-block;
		vertical-align: top;
		line-height: 18px;
		font-size: 10px;
		color: rgb(77, 85, 93);
	}
	.seller .seller-header .header-top .count{
		margin-left: 12px;
	}
	.seller .seller-header .header-bottom{
		display: flex;
		padding: 18px 0;
	}
	.seller .seller-header .header-bottom .desc-wrapper{
		flex: 1;
		display: inline-block;
		text-align: center;
		font-size: 0;
		border-right: 1px solid rgba(7, 17, 27, .1);
	}
	.seller .seller-header .header-bottom .desc-wrapper:last-child{
		border: none;
	}
	.seller .seller-header .header-bottom .desc-wrapper .desc{
		line-height: 10px;
		font-size: 10px;
		color: rgb(147, 153, 159);
		margin-bottom: 4px;
	}
	.seller .seller-header .header-bottom .desc-wrapper span{
		line-height: 24px;
		font-size: 10px;
		color: rgb(7, 17, 27);
	}
	.seller .seller-header .header-bottom .desc-wrapper .detail{
		font-size: 24px;
	}
	.seller .seller-header .collect{
		position: absolute;
		top: 18px;
		right: 11px;
		width: 50px;
		text-align: center;
	}
	.seller .seller-header .collect .icon-favorite{
		display: block;
		/* margin-left: 3px; */
		line-height: 24px;
		font-size: 24px;
		color: #d4d6d9;
	}
	.seller .seller-header .collect .icon-favorite.active{
		color: rgb(240, 20, 20);
	}
	.seller .seller-header .collect .text{
		margin-top: 4px;
		line-height: 10px;
		font-size: 10px;
		color: rgb(77, 85, 93);
	}
	.seller .seller-bulletin{
		padding: 18px  18px 16px;
	}
	.seller .seller-bulletin .title{
		line-height: 14px;
		color: rgb(7, 17, 27);
		font-size: 14px;
	}
	.seller .seller-bulletin .bulletin{
		display: inline-block;
		padding:  0 12px;
		margin-top: 8px;
		line-height: 24px;
		font-size: 12px;
		color: rgb(240, 20, 20);
	}
	.seller .seller-supports {
		padding: 0 18px;
	}
	.seller .seller-supports .support{
		padding: 16px 12px;
	}
	.seller .seller-supports .support:last-child::after{
		border: none;
	}
	.seller .seller-supports .support i{
		display: inline-block;
		vertical-align: top;
		width: 16px;
		height: 16px;
		background-size: 16px 16px;
		background-repeat: no-repeat;
	}
	.seller .seller-supports .support .description{
		line-height: 16px;
		font-size: 12px;
		color: rgb(7, 17, 27);
	}
	.seller .seller-supports .support .decrease{
		background-image: url('decrease_4@2x.png');
	}
	.seller .seller-supports .support .discount{
		background-image: url('discount_4@2x.png');
	}
	.seller .seller-supports .support .guarantee{
		background-image: url('guarantee_4@2x.png');
	}
	.seller .seller-supports .support .invoice{
		background-image: url('invoice_4@2x.png');
	}
	.seller .seller-supports .support .special{
		background-image: url('special_4@2x.png');
	}
	.seller .seller-pics{
		padding: 18px;
	}
	.seller .seller-pics .title{
		margin-bottom: 12px;
		line-height: 14px;
		color: rgb(7, 17, 27);
		font-size: 14px;
	}
	.seller .seller-pics .pic-wrapper{
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
	}
	.seller .seller-pics .pic-wrapper .pic-list{
		font-size: 0;
	}
	.seller .seller-pics .pic-wrapper .pic-list .pic{
		display: inline-block;
		margin-right: 6px;
		width: 120px;
		height: 90px;
	}
	.seller .seller-pics .pic-wrapper .pic-list .pic:last-child{
		margin: 0;
	}
	.seller .seller-info{
		padding: 18px 18px 0 18px;
		color: rgb(7, 17, 27);
	}
	.seller .seller-info .title{
		padding-bottom: 12px;
		line-height: 14px;
		font-size: 14px;
	}
	.seller .seller-info .info-item{
		padding: 16px 12px;
		line-height: 16px;
		font-size: 12px;
	}
	.seller .seller-info .info-item:last-child::after{
		border: none;
	}
@media (-webkit-min-device-pixel-ratio:3), (min-device-pixel-ratio:3){
	.seller .seller-supports .support .decrease{
		background-image: url('decrease_4@3x.png');
	}
	.seller .seller-supports .support .discount{
		background-image: url('discount_4@3x.png');
	}
	.seller .seller-supports .support .guarantee{
		background-image: url('guarantee_4@3x.png');
	}
	.seller .seller-supports .support .invoice{
		background-image: url('invoice_4@3x.png');
	}
	.seller .seller-supports .support .special{
		background-image: url('special_4@3x.png');
	}
}
</style>
