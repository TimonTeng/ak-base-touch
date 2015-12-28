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
	<header class="am-plugin-header"></header>
	 
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
		 
		require(['jquery', 'amazeui', 'headerNavigate'], function($, amazeui, HeaderNavigate){
			
			var headerNavigate = new HeaderNavigate({
			
				title : '品牌U记'
				
				, style : {
					backgroundColor : '#fff'
				}
				
				, left : {
					iconClass : 'icon_return',
					event : {
						'touchend' : function(){
						
						}
					}
				}
/* 				, right : {
				
					iconClass : 'icon_return',
					
					event : {
					
						'touchend' : function(){
							alert(123);
						}
					}
				} */
			});
			
			 	 
		});
	
	</script>
</body>
</html>
