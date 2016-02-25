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
			<li><img src="${ctx}/assets/i/photos/Fishing-Boats-HDR-BW-1920-x1080.jpg" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/1.jpg" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/2.jpg" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/3.jpg" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/4.png" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/5.jpg" photoElement></li>
			<li><img src="${ctx}/assets/i/photos/IMG_4275.PNG" photoElement></li>
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
					   title : '举报',
					   handler : function(element){
							console.log('举报');
							console.log(element.src);
					   }
					}
				]
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
