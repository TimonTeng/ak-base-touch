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
			<a href="#title-link" class=""> Pivot and Waterfall </a>
		</h1>

		<div class="am-header-right am-header-nav">
			<a href="#right-link" class="" onclick="listView.reload();"> <i
				class="am-header-icon am-icon-bars"></i>
			</a>
		</div>
	</header>
	
	<div id="action-bar" class="nav am-g"></div>
	
    <div id="ScrollView" class="am-plugin-scrollview">
		<div id="context">
			<div id="pivolist1"></div>
			<h1>h1 标题1</h1>
			<div id="pivolist2"></div>
		</div>
	</div>
	
	<div id="wrapper-listview1" class="am-plugin-listview"></div>
	
	<div id="wrapper-listview2" class="am-plugin-listview"></div>
	
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
	
		
		
		require(['jquery', 'amazeui', 'actionBar', 'listView', 'scrollView'], function($, amazeui, ActionBar, ListView, ScrollView){
		
			var actionBar = new ActionBar({
				parentNode : '#action-bar',
				actions : [
				   {
					   id : 'view1',
					   title : '筛选',
					   type : 'DoubleSelectView',
					   url : {
					   		root : {
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/appHomeworkLabelFirstLevelList.html'
					   		},
					   		node : {
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/appHomeworkLabelSecondLevelList.html',
					   			rootPropertys : [
					   				{'labelId' : 'id'}
					   			]
					   		}
					   },
					   submit : function(data){
					   		  
					   }
				   },	
 				   {
					   id : 'view2',
					   title : 'Pivot',
					   type : 'Button',
					   submit : function(data){
					   		 scrollView.onActivate(true);
					   		 listview1.onActivate(false);
					   }
				   },
 				   {
					   id : 'view3',
					   title : 'Waterfall',
					   type : 'Button',
					   submit : function(){
					   		 scrollView.onActivate(false);
					   		 listview1.onActivate(true);
					   }
				   }
				]
			}).render();
 
			var scrollView = new ScrollView({
			     parentNode : '#ScrollView',
			     style : {
			     	top : '80px'
			     }
		    });
			
 			var pivolist1 = new ListView({
			 	parentNode : '#pivolist1',
			 	type : 'pivot',
			 	template : 'assets/template/list-view.tpl?v='+new Date(),
			 	apiUrl : '${dataCtx}/ak-sw-p2pm/appClubHotestListMessage.html',
			 	params : {
				
			 	},
				page : {
					result          : 'form',   // 服务应用返回列表集合 在json属性键值 , set load data collection in json field
					pageNo          : 1,    // 开始页码
					pageSize        : 20, // 每页记录数量
					pageNoField     : 'pageNum',   // 服务应用接收pageNo 变量名
					pageSizeField   : 'pageSize',	// 服务应用接收pageSize 变量名
					pageTotalField  : 'lastPageNumber'    // 服务应用返回pageTotal 在json中的属性键值
				},
				scrollView : scrollView
				
			});
			 
			var pivolist2 = new ListView({
			 	parentNode : '#pivolist2',
			 	type : 'pivot',
			 	template : 'assets/template/list-view.tpl?v='+new Date(),
			 	apiUrl : '${dataCtx}/ak-sw-p2pm/appClubHotestListMessage.html',
			 	params : {
				
			 	},
				page : {
					result          : 'form',   // 服务应用返回列表集合 在json属性键值 , set load data collection in json field
					pageNo          : 1,    // 开始页码
					pageSize        : 20, // 每页记录数量
					pageNoField     : 'pageNum',   // 服务应用接收pageNo 变量名
					pageSizeField   : 'pageSize',	// 服务应用接收pageSize 变量名
					pageTotalField  : 'lastPageNumber'    // 服务应用返回pageTotal 在json中的属性键值
				},
				scrollView : scrollView
			});
			 
			 
			var listview1 = new ListView({
			 	parentNode : '#wrapper-listview1',
			 	template : 'assets/template/list-view.tpl',
			 	apiUrl : '${dataCtx}/ak-sw-p2pm/appClubHotestListMessage.html',
			 	style : {
			 		top : '80px'
			 	},
			 	activate : 'false',
				page : {
					result          : 'form',   // 服务应用返回列表集合 在json属性键值 , set load data collection in json field
					pageNo          : 1,    // 开始页码
					pageSize        : 20, // 每页记录数量
					pageNoField     : 'pageNum',   // 服务应用接收pageNo 变量名
					pageSizeField   : 'pageSize',	// 服务应用接收pageSize 变量名
					pageTotalField  : 'lastPageNumber'    // 服务应用返回pageTotal 在json中的属性键值
				}
			});
/* 			
  			var listview2 = new ListView({
			 	parentNode : '#wrapper-listview2',
			 	template : 'assets/template/list-view.tpl',
			 	apiUrl : '${dataCtx}/ak-sw-p2pm/appClubHotestListMessage.html',
			 	style : {
			 		top : '80px'
			 	},
				page : {
					result          : 'form',   // 服务应用返回列表集合 在json属性键值 , set load data collection in json field
					pageNo          : 1,    // 开始页码
					pageSize        : 20, // 每页记录数量
					pageNoField     : 'pageNum',   // 服务应用接收pageNo 变量名
					pageSizeField   : 'pageSize',	// 服务应用接收pageSize 变量名
					pageTotalField  : 'lastPageNumber'    // 服务应用返回pageTotal 在json中的属性键值
				}
			});  
			  */
			 
			 
		});
	
	</script>
</body>
</html>
