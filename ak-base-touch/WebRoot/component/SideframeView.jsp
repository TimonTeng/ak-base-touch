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
			<a href="#title-link" class=""> SideFrame View </a>
		</h1>

		<div class="am-header-right am-header-nav">
			<a href="#right-link" class="" onclick="sideFrameView.openUrl('/ak-sw-p2pm/brandAssignment.html', '.app-nav-logo');"> <i
				class="am-header-icon am-icon-bars"></i>
			</a>
		</div>
		
	</header>
	 
	 <iframe width="100%" height="100%" src="http://www.uni020.com/mobile/" scrolling="no"></iframe>
	 
	 
	 
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
		var sideFrameView = null;
		require(['jquery', 'amazeui', 'sideFrameView'], function($, amazeui, SideFrameView){
		 	sideFrameView = new SideFrameView({
		 		url : '${ctx}/SideframeView.html' 
		 	});
		});
	
	</script>
</body>
</html>
