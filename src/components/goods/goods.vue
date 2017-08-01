<template>
	<div class="goods">
		<div class="menu-wrapper" v-el:menu-wrapper>
			<ul>
				<li v-for="item in goods" class="menu-item" :class="{'current':currentIndex === $index}" @click="selectMenu($index,$event)">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" v-el:foods-wrapper>
			<ul>
				<li class="foods-list foods-list-hook" v-for="item in goods">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li class="foods-item border-1px" @click="selectFood(food,$event)" v-for="food in item.foods">
							<div class="icon">
								<img width="57" height="57" :src="food.icon" alt="" />
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售份{{food.sellCount}}</span><span>好评率{{food.rating}}</span>
								</div>
								<div class="price">
									<span class="new">￥{{food.price}}</span><span v-show="food.oldPrice"class="old">￥{{food.oldPrice}}</span>
								</div>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food"></cartcontrol>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopping-cart v-ref:shopping-cart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shopping-cart>
	</div>
	<food :food="selectedFood" v-ref:food></food>
</template>
<script>
	import BScroll from 'better-scroll';
	import shoppingCart from 'components/shoppingCart/shoppingCart';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import food from 'components/food/food';

	const ERR_OK = 0;

	export default{
		props: {
				seller: {
					type: Object
				}
		},
		data() {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				selectedFood: {}
			};
		},
		components: {
			shoppingCart,
			cartcontrol,
			food
		},
		computed: {
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
				let myfood = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							myfood.push(food);
						}
					});
				});
				return myfood;
			}
		},
		created() {
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					this.$nextTick(() => {
						this._initScroll();
						this._calculateHeight();
					});
				}
			});
			this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
		},
		methods: {
			selectMenu(index, event) {
				// 兼容原生点击事件。防止触发两次。 event._constructed是better-scroll特有属性
				if (!event._constructed) {
					return;
				}
				let foodsList = this.$els.foodsWrapper.getElementsByClassName('foods-list-hook');
				let el = foodsList[index];
				// scrollToElement滚动到指定元素。better-scroll内置方法
				this.foodsScroll.scrollToElement(el, 300, 0, 0);
			},
			selectFood(food, event) {
				if (!event._constructed) {
					return;
				}
				this.selectedFood = food;
				this.$refs.food.show();
			},
			_drop(target) {
				// 体验优化、让动画异步执行
				this.$nextTick(() => {
					this.$refs.shoppingCart.drop(target);
				});
			},
			// 初始化better-scroll
			_initScroll() {
				this.menuScroll = new BScroll(this.$els.menuWrapper, {
					// click: true是否派发click事件
					click: true,
					probeType: 3
				});
				this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
					// probeType: 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
					probeType: 3,
					click: true
				});
				this.foodsScroll.on('scroll', (pos) => {
				// pos.y为负值且为浮点型数
				this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			_calculateHeight() {
				let foodsList = this.$els.foodsWrapper.getElementsByClassName('foods-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodsList.length; i++) {
					let item = foodsList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			}
		},
		events: {
			'cart.add'(target) {
			this._drop(target);
			}
		}
	};
</script>
<style>
	.goods{
		display:flex;
		position:absolute;
		top: 176px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
	}
	.goods .menu-wrapper{
		flex: 0 0 80px;
		width: 80px;
		background-color: #f3f5f7;
	}
	.goods .menu-wrapper .menu-item{
		display:table;
		width: 56px;
		height: 54px;
		line-height: 14px;
		padding: 0 12px;
	}
	.goods .menu-wrapper .menu-item.current{
		position: relative;
		z-index: 10;
		margin-top: -1px;
		border-left: 4px solid rgb(0, 160, 220);;
		background-color: #fff;
		font-weight: 700;
	}
	.goods .menu-wrapper .menu-item.current .text::after{
		display: none;
	}
	.goods .menu-wrapper .menu-item .text{
		font-size: 12px;
		display: table-cell;
		width: 56px;
		vertical-align: middle;
	}
	.goods .menu-wrapper .menu-item .icon{
		vertical-align: top;
		display: inline-block;
		width: 12px;
		height: 12px;
		margin-right: 2px;
		background-size: 12px 12px;
		background-repeat: no-repeat;
	}
	.menu-item .decrease{
		background-image: url('decrease_3@2x.png');
	}
	.menu-item .discount{
		background-image: url('discount_3@2x.png');
	}
	.menu-item .guarantee{
		background-image: url('guarantee_3@2x.png');
	}
	.menu-item .invoice{
		background-image: url('invoice_3@2x.png');
	}
	.menu-item .special{
		background-image: url('special_3@2x.png');
	}
	.goods .foods-wrapper{
		flex: 1;
	}
	.goods .foods-wrapper .title{
		font-size: 12px;
		color: rgb(147, 153, 159);
		height: 26px;
		line-height: 26px;
		background-color: #f3f5f7;
		padding-left: 14px;
		border-left: 2px solid	#d9dde1;
	}
	.goods .foods-wrapper .foods-item{
		display: flex;
		margin: 18px;
		padding-bottom: 18px;
	}
	.goods .foods-wrapper .foods-item:last-child{
		margin-bottom: 0;
	}
	.goods .foods-wrapper .foods-item:last-child::after{
		display:none;
	}
	.goods .foods-wrapper .foods-item .icon{
		display: inline-block;
		width: 57px;
		height: 57px;
		margin-right: 10px;
	}
	.goods .foods-wrapper .foods-item .content .name{
		font-size: 14px;
		line-height: 14px;
		padding-top: 2px;
		color: rgb(7, 17, 27);
	}
	.goods .foods-wrapper .foods-item .content .desc,
	.goods .foods-wrapper .foods-item .content .extra{
		font-size: 10px;
		line-height: 10px;
		color: rgb(147, 153, 159);
	}
	.goods .foods-wrapper .foods-item .content .desc{
		line-height: 12px;
		margin: 8px 0;
	}
	.goods .foods-wrapper .foods-item .content .extra .count{
		margin-right: 12px;
	}
	.goods .foods-wrapper .foods-item .content .price{
		font-size: 10px;
		line-height: 24px;
	}
	.goods .foods-wrapper .foods-item .content .price .new{
		font-size: 14px;
		font-weight: 700;
		color: rgb(240, 20, 20);
	}
	.goods .foods-wrapper .foods-item .content .price .old{
		text-decoration: line-through;
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
	.goods .foods-wrapper .foods-item .cartcontrol-wrapper{
		position:absolute;
		bottom: 0;
		right: 0;
	}
@media (-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio){
	.menu-item .decrease{
		background-image: url('decrease_3@3x.png');
	}
	.menu-item .discount{
		background-image: url('discount_3@3x.png');
	}
	.menu-item .guarantee{
		background-image: url('guarantee_3@3x.png');
	}
	.menu-item .invoice{
		background-image: url('invoice_3@3x.png');
	}
	.menu-item .special{
		background-image: url('special_3@3x.png');
	}
}
</style>
