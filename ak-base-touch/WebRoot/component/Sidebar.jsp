<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>Sidebar</title>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.css"/>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.plugin.css"/>
</head>

<body>
	<header data-am-widget="header" class="am-header am-header-default">
	
		<div class="am-header-left am-header-nav">
			<a href="#left-link" class="">
				<i class="am-header-icon am-icon-home"></i>
			</a>
		</div>

		<h1 class="am-header-title">
			<a href="#title-link" class=""> Amaze UI </a>
		</h1>

		<div class="am-header-right am-header-nav">
			<a href="#right-link" class="" onclick="sidebar1.open();"> <i
				class="am-header-icon am-icon-bars"></i>
			</a>
		</div>
		
	</header>
	 
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
		var sidebar1= sidebar2 = null;
		require(['jquery', 'amazeui', 'sidebar'], function($, amazeui, Sidebar){
			 	
			 	sidebar1 = new Sidebar({
			 	
			 		title : '发布活动',
			 		
			 		returnIcon : 'icon_return',
			 		
			 		style : {
			 			zIndex : 200
			 		},
			 		
			 		submit : function(){
			 			alert('sidebar1');
			 		},
			 		
			 		returnAfter : function(){ //当下级 sidebar确认返回时执行
					 	$('.addAward').click(function(){
					 		sidebar2.open();
					 	});
			 		}
			 	});
			 	
 			 	sidebar2 = new Sidebar({
			 		
			 		title : '添加奖品',
			 		
			 		returnIcon : 'icon_return',
			 		
			 		style : {
			 			zIndex : 201
			 		},
			 		
			 		submit : function(){
			 			alert('sidebar2');
			 			sidebar1.appendHtml("<button class='addAward'>添加奖品2</button>");
			 		},
			 		
			 		returnAfter : function(){ //当下级 sideba 确认返回时执行
			 		
			 		},
			 		
			 		parentView : sidebar1
			 	}); 
			 	
			 	sidebar1.html("<button class='addAward'>添加奖品1</button>");
			 	
			 	$('.addAward').click(function(){
			 		sidebar2.open();
			 	});
			 	
		});
	
	</script>
</body>
</html>
