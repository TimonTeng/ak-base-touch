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
 
	<div id="action-bar" class="am-plugin-actionbar"></div>
	
	<div data-am-widget="navbar" class="am-navbar am-cf am-navbar-default " id="">
	      <ul class="am-navbar-nav am-cf am-avg-sm-4">
	          <li data-am-navbar-share>
	            <a href="###" class="">
	                  <span class="am-icon-share-square-o"></span>
	                <span class="am-navbar-label">分享</span>
	            </a>
	          </li>
	          <li data-am-navbar-qrcode>
	            <a href="###" class="">
	                  <span class="am-icon-qrcode"></span>
	                <span class="am-navbar-label">二维码</span>
	            </a>
	          </li>
	      </ul>
	</div>
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
	
		
		require(['jquery', 'amazeui', 'actionBar1'], function($, amazeui, ActionBar){
		
		
			var store = [
				{id : 'all', labelText : '全部'},
				{id : 'works', labelText : '作业最多'},
				{id : 'mostactive', labelText : '最活跃'}
			];
		
			var actionBar = new ActionBar({
				parentNode : '#action-bar',
				actions : [
				   {
					   id 	        : 'view1',
					   title        : '筛选A',
					   type         : 'SelectView',
					   result		: 'data',
					   displayField : 'labelText',
					   url 		    : 'assets/data/compose.json',
					   submit       : function(data){
					  		console.log(JSON.stringify(data));
					   }
					   
				   }
				   ,{
					   id 	        : 'view2',
					   title        : '筛选B',
					   type         : 'SelectView',
					   dataType     : 'local',
					   store        : store,
					   displayField : 'labelText',
					   submit       : function(data){
					   		console.log(JSON.stringify(data));
					   }
					   
				   }
				   ,{
					   id 	        : 'view3',
					   title        : '筛选B',
					   type         : 'SelectView',
					   dataType     : 'local',
					   store        : store,
					   displayField : 'labelText',
					   submit       : function(data){
					   		console.log(JSON.stringify(data));
					   }
					   
				   }
 				   ,{
					   id 	  		: 'view4',
					   title 	    : '品牌',
					   type 		: 'SelectView',
					   result		: 'data',
					   displayField : 'labelText',
					   dataType 	: 'compose',
					   store 		: store,
					   url 		    : 'assets/data/compose.json',
					   submit 	    : function(data){
					   		console.log(JSON.stringify(data));
					   }
				   }
 
				]
			});
			 
		});
	
	</script>
</body>
</html>
