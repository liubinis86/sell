<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img width="64" height="64" :src="seller.avatar" />
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
				<div v-if="seller.supports" class="supports">
					<span class="icon"
					:class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" width="100%"
			height="100%" />
		</div>
		<div v-show="hasDetail" class="detail" transition="fade" >
			<div class="contain-wrapper clearfix">
				<div class="contain">
					<h1 class="title">{{seller.name}}</h1>
					<div class="star-wrapper">
						<star :size="48" :score="seller.score"></star>
					</div>
					<div class="line-wrapper">
						<linetext :text="text"></linetext>
					</div>
					<ul class="detail-supports">
						<li v-for="item in seller.supports" track-by="$index" class="support-item">
							<span class="icon" :class="classMap[seller.supports[$index].type]"></span>
							<span>{{seller.supports[$index].description}}</span>
						</li>
					</ul>
					<div class="line-wrapper">
						<linetext :text="text2"></linetext>
					</div>
					<div class="detail-bulletin">
						<p>{{seller.bulletin}}</p>
					</div>
				</div>
			</div>
			<div class="close-wrapper" @click="hideDetail">
				<i class="icon-close"></i>
			</div>
		</div>
	</div>
</template>
<script>
	import star from 'components/star/star';
	import linetext from 'components/line-text-line/line';

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		components: {
			linetext,
			star
		},
		created() {
			this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
		},
		data() {
			return {
				hasDetail: false,
				text: '优惠信息',
				text2: '商家公告'
			};
		},
		methods: {
			showDetail() {
				this.hasDetail = true;
			},
			hideDetail() {
				this.hasDetail = false;
			}
		}
	};
</script>
<style>
	.header{
		position: relative;
		color:#fff;
		background-color: rgba(7, 17, 27, .5);
		overflow:hidden;
	}
	.header .content-wrapper{
		position:relative;
		padding:24px 12px 18px 24px;
		font-size:0;
	}
	.header .content-wrapper .avatar{
		display:inline-block;
		vertical-align: top;
		width:64px;
		height:64px;
	}
	.header .content-wrapper .avatar img{
		border-radius: 2px;
	}
	.header .content-wrapper .content{
		vertical-align:top;
		display:inline-block;
		margin-left: 16px;
	}
	.header .content-wrapper .content .title{
		margin-top:2px;
	}
	.header .content-wrapper .content .title .brand{
		display: inline-block;
		width: 30px;
		height: 18px;
		vertical-align:top;
		background-image: url('brand@2x.png');
		background-size: 30px 18px;
		background-repeat: no-repeat;
	}
	.header .content-wrapper .content .title .name{
		vertical-align:top;
		font-size: 16px;
		font-weight: bold;
		line-height: 18px;
		margin-left: 6px;
	}
	.header .content-wrapper .content .description{
		margin-top: 8px;
		font-size: 12px;
		line-height: 12px;
	}
	.header .content-wrapper .content .supports{
		margin: 10px 0 2px 0;

	}
	.header .content-wrapper .content .supports .icon{
		display: inline-block;
		vertical-align:top;
		width:12px;
		height:12px;
		background-size: 12px 12px;
		background-repeat:no-repeat;
	}
	.header .content-wrapper .content .supports .text{
		vertical-align:top;
		font-size: 10px;
		line-height: 12px;
		margin-left:4px;
	}
	.supports .decrease{
		background-image: url('decrease_1@2x.png');
	}
	.supports .discount{
		background-image: url('discount_1@2x.png');
	}
	.supports .guarantee{
		background-image: url('guarantee_1@2x.png');
	}
	.supports .invoice{
		background-image: url('invoice_1@2x.png');
	}
	.supports .special{
		background-image: url('special_1@2x.png');
	}
    .header .content-wrapper .support-count{
    	position: absolute;
    	right: 12px;
    	bottom:14px;
		padding:0 8px;
		height:24px;
		line-height:24px;
		border-radius:14px;
		background-color: rgba(0, 0, 0, .2);
		text-align: center;
    }
    .support-count .count{
     	vertical-align:top;
		font-size:10px;
     }
    .support-count .icon-keyboard_arrow_right{
     	margin-left: 2px;
     	line-height: 24px;
		font-size: 10px;
    }
	.bulletin-wrapper{
		position:relative;
		height:  28px;
		line-height: 28px;
		padding: 0 22px 0 12px;
		background-color: rgba(7, 17, 27, .2);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.bulletin-wrapper .bulletin-title{
		display: inline-block;
		width: 22px;
		height: 12px;
		background-image: url('bulletin@2x.png');
		background-size: 22px 12px;
		background-repeat: no-repeat;
	}
	.bulletin-wrapper .bulletin-text{
		vertical-align:top;
		font-size: 10px;
		margin: 0 4px;
	}
	.bulletin-wrapper .icon-keyboard_arrow_right{
		position: absolute;
		right:12px;
		top:8px;
		font-size:10px;
	}
	.header .background{
		position:absolute;
		left: 0;
		top:0;
		width:100%;
		z-index: -1;
		filter:blur(10px);
	}
	.header .detail{
		position: fixed;
		left: 0;
		top: 0;
		z-index:100;
		width: 100%;
		height: 100%;
		backdrop-filter: blur(10px);
		overflow: auto;
		transition: all .5s;
	}
	.header .detail.fade-transition{
		background-color: rgba(7, 17, 27, .8);
		opacity: 1;
	}
	.header .detail.fade-enter,
	.header .detail.fade-leave{
		opacity: 0;
		background-color: rgba(7, 17, 27, 0);
	}
	.header .detail .contain-wrapper{
		width: 100%;
		min-height: 100%;
	}
	.header .detail .contain-wrapper .contain{
		margin-top: 64px;
		padding-bottom: 52px;
	}
	.header .detail .contain-wrapper .contain .title{
		font-size: 16px;
		font-weight: 700;
		line-height: 16px;
		text-align: center;
	}
	.header .detail .contain-wrapper .contain .star-wrapper{
		margin-top: 18px;
		padding: 2px 0;
		text-align:center;
	}
	.header .detail .contain-wrapper .contain .line-wrapper{
		width: 80%;
		font-size: 14px;
		font-weight:700;
		line-height:14px;
		margin: 30px auto 24px auto;
	}
	.header .detail .contain-wrapper .contain .detail-supports{
		width: 80%;
		margin: 0 auto;
	}
	.header .detail .contain-wrapper .contain .detail-supports .support-item{
		font-size: 0;
		margin-bottom: 12px;
		padding: 0 12px;
	}
	.header .detail .contain-wrapper .contain .detail-supports .support-item:last-child{
		margin-bottom: 0;
	}
	.header .detail .contain-wrapper .contain .detail-supports .icon{
		display: inline-block;
		width: 16px;
		height: 16px;
		margin-right: 6px;
		background-repeat: no-repeat;
		background-size: 16px 16px;
		vertical-align:top;
	}
	.header .detail	.decrease{
		background-image: url('decrease_2@2x.png');
	}
	.header .detail .discount{
		background-image: url('discount_2@2x.png');
	}
	.header .detail .guarantee{
		background-image: url('guarantee_2@2x.png');
	}
	.header .detail .invoice{
		background-image: url('invoice_2@2x.png');
	}
	.header .detail .special{
		background-image: url('special_2@2x.png');
	}
	.header .detail .contain-wrapper .contain .detail-supports span{
		font-size: 14px;
		line-height: 16px;
	}
	.header .detail .contain-wrapper .contain .detail-bulletin{
		width:80%;
		margin: 0 auto;
		padding: 0 12px;
		font-size: 12px;
		line-height: 24px;
	}
	.header .detail .close-wrapper{
		position: relative;
		width: 32px;
		height: 32px;
		margin: -52px auto 0 auto;
		font-size:32px;
		clear: both;
		color: rgba(255, 255, 255, 0.5);
	}
@media (-webkit-min-device-pixel-ratio:3), (min-device-pixel-ratio:3){
	.header .content-wrapper .content .title .brand{
		background-image: url('brand@3x.png');
	}
	.supports .decrease{
		background-image: url('decrease_1@3x.png');
	}
	.supports .discount{
		background-image: url('discount_1@3x.png');
	}
	.supports .guarantee{
		background-image: url('guarantee_1@3x.png');
	}
	.supports .invoice{
		background-image: url('invoice_1@3x.png');
	}
	.supports .special{
		background-image: url('special_1@3x.png');
	}
	.bulletin-wrapper .bulletin-title{
		background-image: url('bulletin@3x.png');
	}
}
</style>
