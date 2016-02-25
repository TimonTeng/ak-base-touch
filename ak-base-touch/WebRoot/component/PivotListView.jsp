<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>PivotListView</title>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.css"/>
  	<link rel="stylesheet" href="${ctx}/assets/css/lib/amazeui.plugin.css"/>
  	
  <style>

  </style>
  	
</head>

<body>
	<header data-am-widget="header" class="am-header am-header-default">
		<div class="am-header-left am-header-nav">
			<a href="#left-link" class="">
				<i class="am-header-icon am-icon-home"></i>
			</a>
		</div>

		<h1 class="am-header-title">
			<a href="#title-link" class=""> PivotListView </a>
		</h1>

		<div class="am-header-right am-header-nav">
			<a href="#right-link" class="" onclick="listView.reload();"> <i
				class="am-header-icon am-icon-bars"></i>
			</a>
		</div>
	</header>
	
	<div id="ScrollView" class="am-plugin-scrollview">
		<div id="context">
			<div id="pivolist1"></div>
			<h1>h1 标题1</h1>
			<div id="pivolist2"></div>
		</div>
	</div>
	
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
		
		require(['jquery', 'amazeui', 'listView', 'scrollView'], function($, amazeui, ListView, ScrollView){
		
			var scrollView = new ScrollView({
			     parentNode : '#ScrollView',
			     style : {
			     	top : '80px'
			     }
		    });
			
 			var pivolist1 = new ListView({
			 	parentNode : '#pivolist1',
			 	type : 'pivot',
			 	template : 'assets/template/demo/assignment-list.tpl?v='+new Date(),
			 	apiUrl : 'http://test.uni020.com/mobile/appHomeworkListMessage.html',
			 	doLoad : 'true', //初始化ListView 时是否加载数据 ,默认为true, true：加载， false:不加载 
				page : {
					result          : 'form',   // 服务应用返回列表集合 在json属性键值 , set load data collection in json field
					pageNo          : 1,    // 开始页码
					pageSize        : 20, // 每页记录数量
					pageNoField     : 'paramForm.pageNum',   // 服务应用接收pageNo 变量名
					pageSizeField   : 'paramForm.pageSize',	// 服务应用接收pageSize 变量名
					pageTotalField  : 'lastPageNumber'    // 服务应用返回pageTotal 在json中的属性键值
				},
				scrollView : scrollView
				
			});
			 
			var pivolist2 = new ListView({
			 	parentNode : '#pivolist2',
			 	type : 'pivot',
			 	template : 'assets/template/demo/assignment-list.tpl?v='+new Date(),
			 	apiUrl : 'http://test.uni020.com/mobile/appHomeworkListMessage.html',
			 	doLoad : 'true', //初始化ListView 时是否加载数据 ,默认为true, true：加载， false:不加载 
				page : {
					result          : 'form',   // 服务应用返回列表集合 在json属性键值 , set load data collection in json field
					pageNo          : 1,    // 开始页码
					pageSize        : 20, // 每页记录数量
					pageNoField     : 'paramForm.pageNum',   // 服务应用接收pageNo 变量名
					pageSizeField   : 'paramForm.pageSize',	// 服务应用接收pageSize 变量名
					pageTotalField  : 'lastPageNumber'    // 服务应用返回pageTotal 在json中的属性键值
				},
				scrollView : scrollView
			 });
			 
			 
		});
	
	</script>
</body>
</html>
