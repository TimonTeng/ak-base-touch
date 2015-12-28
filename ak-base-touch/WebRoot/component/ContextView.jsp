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
			<a href="#title-link" class="">ContextView</a>
		</h1>

		<div class="am-header-right am-header-nav">
			<a href="#right-link" class="" onclick=""> <i
				class="am-header-icon am-icon-bars"></i>
			</a>
		</div>
		
		
		<div id="scrollview" class="am-plugin-scrollview">
			<div>
				<div id="contextView" class="am-plugin-context-view"></div>
			</div>
		</div>
		
		
	</header>
	 
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<%-- 
	<div class="doc-code demo-highlight">
		<pre>
			<code class="xml">
			
				require(['jquery', 'amazeui', 'contextView'], function($, amazeui, ContextView){
					 	 
			 	var contextView = new ContextView({
			 		parentNode : '#contextView',
			 		items : [
			 			{
			 				id : 'item1',
			 				template : 'xxxxx.tpl',
			 				apiUrl : '',
			 				result : 'form',
					 		renderAfter : function(contextElement){
					 		
					 		}
			 			},
			 			{
			 				id : 'item2',
			 				template : 'xxxxx.tpl',
			 				apiUrl : '',
			 				result : 'data',
					 		renderAfter : function(contextElement){
					 		
					 		}
			 			},
			 			{
			 				id : 'item3',
			 				template : 'xxxxx.tpl',
			 				apiUrl : '',
			 				result : 'form',
						 	renderAfter : function(contextElement){
					 		
					 		}
			 			}
			 		],
			 		
			 		renderAfter : function(){
			 		
			 		},
			 		
			 		scrollView : null
			 	});
				});
			
			</code>		
		</pre>
	</div>
	 --%>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
		 
		require(['jquery', 'amazeui', 'contextView', 'scrollView'], function($, amazeui, ContextView, ScrollView){
		
				var ScrollView = new ScrollView({
					parentNod : 'scrollview',
					style : {
						top : '50px'
					}
				});
		
			 	 
			 	var contextView = new ContextView({
			 		parentNode : '#contextView',
			 		items : [
			 			{
			 				id : 'item1',
			 				template : 'assets/template/list-view.tpl',
			 				apiUrl : 'assets/data/context-view.json',
			 				result : 'data',
					 		renderAfter : function(contextElement){
					 		
					 		}
			 			}
			 		],
			 		
			 		renderAfter : function(){
			 		
			 		},
			 		
			 		scrollView : null
			 	});
		});
	
	</script>
</body>
</html>
