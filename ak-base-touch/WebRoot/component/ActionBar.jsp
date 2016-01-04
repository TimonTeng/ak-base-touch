<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>ActionBar</title>
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
			<a href="#title-link" class=""> ActionBar </a>
		</h1>

		<div class="am-header-right am-header-nav">
			<a href="#right-link" class=""> <i
				class="am-header-icon am-icon-bars"></i>
			</a>
		</div>
	</header>
	
	
	<div id="action-bar" class="nav am-g"></div>
	
	<div id="wrapper" class="am-plugin-listviwe"></div>
	
 
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
	
		
		require(['jquery', 'amazeui', 'actionBar', 'listView'], function($, amazeui, ActionBar, ListView){
		
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
					   title : '品牌',
					   type : 'AplhabetDoubleSelectView',
					   url : {
					   		root : {
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/appClubBrandList.html'
					   		},
					   		node : {
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/appClubBrandModalList.html',
					   			rootPropertys : [
					   				{'brandId' : 'id'},
					   				{'name'    : 'name'}
					   			]
					   		}
					   },
					   submit : function(data){
					   		 data = {rootValue : {id :'' , name : ''}, nodeValue : {}}
					   
					   
					   		 lisView.reload({
					   		 	'id' : data.rootValue.id
					   		 });
					   }
				   },
 				   {
					   id : 'view3',
					   title : '智能',
					   type : 'AplhabetSelectView',
					   url : '${dataCtx}/ak-sw-p2pm/appClubBrandList.html',
					   submit : function(data){
					   		 
					   }
				   }
				]
			}).render();
			
 
			 
		});
	
	</script>
</body>
</html>
