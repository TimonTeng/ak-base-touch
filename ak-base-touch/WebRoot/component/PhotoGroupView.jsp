<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>PhotoGroupView</title>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.css"/>
  	<link rel="stylesheet" href="${ctx}/assets/css/lib/amazeui.plugin.css"/>
<style type="text/css">
 
.context img{
	width: 100%;
	margin-top: 20px;
	cursor: pointer;
}

</style>
</head>

<body>

<div id="ScrollView" class="am-plugin-scrollview">
	<div>
		<ul class="context" photoGroup>
			<li><img src="${ctx}/assets/i/photos/Fishing-Boats-HDR-BW-1920-x1080.jpg" data-object="{id : 1, text : '和这种奢华跑车的接触总是感觉非常短暂，但也给我们留下了深刻的印象。阿斯顿马丁不是一款追求速度的跑车，同时也没有暴躁的脾气，但其拥有的品位、舒适也是其他跑车所不能给予的。阿斯顿马丁依旧是那个纯正的英国顶级跑车，其实坐在车内，我想得最多的是自己的举止如何符合绅士的定义，虽然我知道我还达不到那个阶层，但真正拥有它的朋友，应该都是名副其实的绅士。', like : 101}" photoElement photo-original="${ctx}/assets/i/photos/Fishing-Boats-HDR-BW-1920-x1080.jpg"></li>
			<li><img src="${ctx}/assets/i/photos/1.jpg" data-object="{id : 2, text : '尾部呈现出的鸭尾造型，是马丁车型的另一个传统设计，这不但看起来十分优雅，同时在高速时也能提供必要的下压力。 ', like : 110}" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/2.jpg" data-object="{id : 3, text : '众所周知，一般的豪华车内饰会使用真皮和木饰这两种材质，并点缀以金属，马丁的车型为了突出运动性，着重使用金属和真皮，并且为了突出质感，一些旋钮运用整个金属打造。但仅有这些并不能突出它的与众不同，因此马丁的设计师们想到了水晶。', like : 102}" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/3.jpg" data-object="{id : 4, text : '马丁的车型不缺乏识别性，这点从进气格栅、车灯、散热孔等方面都可见得。', like : 12}" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/4.png" data-object="{id : 5, text : '虽然阿斯顿马丁历史悠久，但因为数量稀有，大家对它的印象可能还停留在电影中的特工座驾上。这对于需求量飞速增长的国内超级跑车市场，未必是件好事，毕竟邦德不会告诉大家Rapide是定位于四门GT跑车，而V8 Vantage从价格上说，是它的入门车型。', like : 103}" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/5.jpg" data-object="{id : 6, text : '发动机的分量肯定不轻，但它被放在前轴靠后的位置，同时变速箱后置，致使85%的车重都集中在前后轴之间。', like : 100}" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/IMG_4275.PNG" data-object="{id : 7, text : '1阿斯顿·马丁DB9用于包裹内饰的真皮全部由手动缝制而成，而实木饰板也是手工打造的，原因就是技艺精湛的工人做出的成品要远比程序化的机器制造的好很多。', like : 13}" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/IMG_4279.PNG" data-object="{id : 8, text : '2阿斯顿·马丁DB9给人的第一印象肯定是深刻的，尽管看上去和捷豹的某些车型有点类似，但这不妨碍DB9成为经典，因为它才是被效仿的对象。从车身尺寸来说，DB9可以算是大型GT跑车，2745mm的轴距已经达到一般中型车的水平，但我们并不对后排空间抱太大希望，那不是应该被特别留意的地方。', like : 1}" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/IMG_4280.PNG" data-object="{id : 9, text : '3007曾是男性的终极梦想，邦德的选择也会成为当时全世界男人的渴望。有了007这样的大牌明星宠爱，来自于名门的埃斯顿·马丁DB9从出厂的第一天起，就已经充满了传奇色彩。DB9的车身在用料上已经竭尽奢侈之能，而发动机强大的排气声浪，又是一种优雅与野蛮的巧妙融合。作为詹姆斯·邦德的御用座驾，DB9毫无悬念地获得了上层社会的宠爱。', like : 13}" photoElement></li>
		</ul>
		<ul class="context" photoGroup>
			<li><img src="${ctx}/assets/i/photos/Fishing-Boats-HDR-BW-1920-x1080.jpg" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/1.jpg" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/2.jpg" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/3.jpg" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/4.png" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/5.jpg" photoElement></li>
		</ul>
	</div>
</div>

	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
		 
		require(['jquery', 'photoGroupView', 'scrollView'], function($, PhotoGroupView, ScrollView){
		
			var photoGroupView = new PhotoGroupView({
				parentNode : 'photoGroupView',
				menu : [
					{
					   title : '分享到朋友圈',
					   handler : function(element){
					   		console.log('分享到朋友圈');
					   		console.log(element.src);
					   }
					},
					{
					   title : '分享到朋友',
					   handler : function(element){
							console.log('分享到朋友');
							console.log(element.src);
					   }
					},
					{
					   title : '收藏',
					   handler : function(element){
							console.log('收藏');
							console.log(element.src);
					   }
					},
					{
					   title : '销毁',
					   handler : function(element){
							 photoGroupView.destory();
					   }
					}
				] 
				,plugins : {
				
 					contextField : 'text',
 					
 					items : [
						{
					  		id : 'reply1',
					  		digit : 1
						},
						{
					  		id : 'reply2',
					  		digit : 2,
					  		cssClass : 'icon_heart',
					  		touch :  function(event, object){
					  			console.log('touch reply2'+JSON.stringify(object));
					  		},
					  		render : function(element, object){
					  			console.log('render reply2');
					  		}
						},
						{
					  		id : 'reply3',
					  		digit : 2,
					  		cssClass : 'icon_message',
					  		touch :  function(event, object){
					  			console.log('reply3'+JSON.stringify(object));
					  		},
					  		render : function(element, object){
					  			console.log('render reply3');
					  		}
						},	
						{
					  		id : 'reply4',
					  		digit : 3,
					  		cssClass : '',
					  		touch :  function(event, object){
					  			console.log('reply4'+JSON.stringify(object));
					  		},
					  		render : function(element, object){
					  			console.log('render reply4');
					  			element.text('点赞:'+object.like);
					  		}
						}			
 					]
				}
			});
		
			var scrollView = new ScrollView({
			     parentNode : '#ScrollView'
		    });
		    
		    
		    $.touchEvent('[photoElement]', document.body, {
		    	end : function(event){
		    		photoGroupView.show(event.target);
		    	}
		    });
		    
 
		});
	
	</script>
</body>
</html>
