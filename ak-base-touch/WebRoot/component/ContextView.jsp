<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>ContextView</title>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.css"/>
  	<link rel="stylesheet" href="${ctx}/assets/css/lib/amazeui.plugin.css"/>
</head>

<body>
	<header data-am-widget="header" class="am-header am-header-default">
	
		<div class="am-header-left am-header-nav">
			<a href="#left-link" class="">
				<i class="am-header-icon am-icon-home"></i>
			</a>
		</div>

		<h1 class="am-header-title">
			<a href="#title-link" class="">ContextView</a>
		</h1>

		<div class="am-header-right am-header-nav">
			<a href="#right-link" class="" onclick="contextView.reloadAll();"> <i
				class="am-header-icon am-icon-bars"></i>
			</a>
		</div>
	</header>
	
	<div id="scrollview" class="am-plugin-scrollview">
		<div>
			<div id="contextView" class="am-plugin-context-view"></div>
		</div>
	</div>
	 
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
	
		var contextView = null;
		 
		require(['jquery', 'amazeui', 'contextView', 'scrollView'], function($, amazeui, ContextView, ScrollView){
		
				var scrollView = new ScrollView({
					parentNode : '#scrollview',
					style : {
						top : '50px'
					}
				});
		
			 	contextView = new ContextView({
			 	
			 		parentNode : '#contextView',
			 		
			 		items : [
			 			{
			 				id : 'form',
			 				templateOnly : true,
			 				template : 'assets/template/list-view.tpl?v='+new Date(),
			 				apiUrl : 'assets/data/context-view.json?v='+new Date(),
			 				result : 'data',
					 		renderAfter : function(contextElement){ //contextElement = item1 Element
					 		
					 		}
			 			},
			 			{
			 				id : 'item1',
			 				template : 'assets/template/list-view.tpl?v='+new Date(),
			 				apiUrl : 'assets/data/context-view.json?v='+new Date(),
			 				result : 'data',
					 		renderAfter : function(contextElement){ //contextElement = item1 Element
					 		
					 		}
			 			},
			 			{
			 				id : 'item2',
			 				template : 'assets/template/list-view.tpl?v='+new Date(),
			 				apiUrl : 'assets/data/context-view.json?v='+new Date(),
			 				result : 'data',
					 		renderAfter : function(contextElement){ //contextElement = item2 Element
					 		
					 		}
			 			},
			 			{
			 				id : 'item3',
			 				template : 'assets/template/list-view.tpl?v='+new Date(),
			 				apiUrl : 'assets/data/context-view.json?v='+new Date(),
			 				result : 'data',
					 		renderAfter : function(contextElement){ //contextElement = item3 Element
					 		
					 		}
			 			}
			 		],
			 		
			 		loadComplete : function(){ //加载完成
  						
			 		},
			 		
			 		scrollView : scrollView
			 	});
		});
	
	</script>
</body>
</html>
