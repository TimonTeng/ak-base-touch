<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>ActionBar2</title>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.css"/>
  	<link rel="stylesheet" href="${ctx}/assets/css/lib/amazeui.plugin.css"/>
</head>

<body>
 
	<div id="action-bar" class="am-plugin-actionbar"></div>
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
	
		
		require(['jquery', 'amazeui', 'actionBar2'], function($, amazeui, ActionBar){
		
			var store = [
				{id : 'works', labelText : '作业最多'},
				{id : 'mostactive', labelText : '最活跃'}
			];
			
			var doubleStore = [
				{id : 'works', labelText : '奥迪', nodes : [
					{id : '1', name : 'A3'},
					{id : '2', name : 'A4'},
					{id : '3', name : 'A5'},
					{id : '4', name : 'A6'}
				]},
				{id : 'mostactive', labelText : '奔驰', nodes : [
					{id : '1', name : 'CLK'},
					{id : '2', name : 'GLA'},
					{id : '3', name : 'GLK'},
					{id : '4', name : 'GLE'}
				]},
				{id : 'mostactive', labelText : '雷克萨斯', nodes : [
					{id : '1', name : 'CT200'},
					{id : '2', name : 'IS300'},
					{id : '3', name : 'ES250'},
					{id : '4', name : 'GS250'}
				]}
			];
			
		
			var actionBar = new ActionBar({
				parentNode : '#action-bar',
				layout : 'fix', //可选值 ： aliquots(等分网格)/fix(固定值)
				defaults : {
					width : 100
				},
				style : {
					backgroundColor : '#009a61',
					color : '#FFF' 
				},
				activeColor : '#fde393',
				actions : [
				   {
					   id 	        : 'demo1',
					   title        : 'SV_R',
					   type         : 'SelectView',
					   result		: 'data',
					   displayField : 'labelText',
					   url 		    : 'assets/data/compose.json',
					   submit       : function(data){
					  		console.log(JSON.stringify(data));
					   }
				   }
				   ,{
					   id 	        : 'demo2',
					   title        : 'SV_L',
					   type         : 'SelectView',
					   dataType     : 'local',
					   store        : store,
					   displayField : 'labelText',
					   submit       : function(data){
					   		console.log(JSON.stringify(data));
					   }
				   }
				   ,{
					   id 	        : 'demo3',
					   title        : 'SV_C',
					   type         : 'SelectView',
					   result		: 'data',
					   displayField : 'labelText',
					   dataType 	: 'compose',
					   store 		: store,
					   url 		    : 'assets/data/compose.json',
					   submit 	    : function(data){
					   		console.log(JSON.stringify(data));
					   }
				   }
 				   ,{
					   id 	  		: 'demo4',
					   title 	    : 'DSV_R',
					   type 		: 'DoubleSelectView',
					   url 			: {
					   		root : {
					   			displayField : 'labelText',
					   			result : 'data',
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/appHomeworkLabelFirstLevelList.html'
					   		},
					   		node : {
					   			displayField : '',
					   			result : 'data',
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/appHomeworkLabelSecondLevelList.html',
					   			rootPropertys : [
					   				{'labelId' : 'id'}
					   			]
					   		}
					   },
					   submit 	    : function(data){
					   		console.log(JSON.stringify(data));
					   }
				   }
 				   ,{
					   id 	  		: 'demo5',
					   title 	    : 'DSV_L',
					   type 		: 'DoubleSelectView',
					   dataType     : 'local',
					   store        : doubleStore,
					   url 		    : {
					   		root : {
					   			nodesField   : 'nodes',
					   			displayField : 'labelText'
					   		},
					   		node : {
					   			displayField : 'name'
					   		}
					   },
					   submit 	    : function(data){
					   		console.log(JSON.stringify(data));
					   }
				   }
 				   ,{
					   id 	  		: 'demo6',
					   title 	    : 'DSV_C',
					   type 		: 'DoubleSelectView',
					   dataType     : 'compose',
					   store        : doubleStore,
					   url 		    : {
					   		root : {
					   			nodesField   : 'nodes',
					   			displayField : 'labelText',
					   			result : 'data',
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/appHomeworkLabelFirstLevelList.html'
					   		},
					   		node : {
					   			displayField : 'name',
							   	result : 'data',
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/appHomeworkLabelSecondLevelList.html',
					   			rootPropertys : [
					   				{'labelId' : 'id'}
					   			]
					   		}
					   },
					   submit 	    : function(data){
					   		console.log(JSON.stringify(data));
					   }
				   }
 				   ,{
					   id     		: 'demo7',
					   title  	    : 'ASV',
					   type   	    : 'AplhabetSelectView',
					   result       : 'data',
					   displayField : 'provinceName',
					   url          : '${dataCtx}/ak-sw-p2pm/provinceByAlphabetSeq.html',
					   submit 	    : function(data){
					   		console.log(JSON.stringify(data));
					   }
				   }
 				   ,{
					   id     		: 'demo8',
					   title  	    : 'ADSV',
					   type   	    : 'AplhabetDoubleSelectView',
					   url 			: {
					   		root : {
					   			displayField : 'provinceName',
					   			result : 'data',
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/provinceByAlphabetSeq.html'
					   		},
					   		node : {
					   			displayField : 'cityName',
					   			result : 'data',
					   			apiUrl : '${dataCtx}/ak-sw-p2pm/foundProvinceCity.html',
					   			rootPropertys : [
					   				{'id' : 'id'}
					   			]
					   		}
					   },
					   submit 	    : function(data){
					   		console.log(JSON.stringify(data));
					   }
				   }
 				   ,{
					   id     		: 'demo9',
					   title  	    : 'ASV_ICON',
					   type   	    : 'AplhabetSelectView',
					   result       : 'data',
					   displayField : 'provinceName',
					   url          : '${dataCtx}/ak-sw-p2pm/provinceByAlphabetSeq.html',
					   submit 	    : function(data){
					   		console.log(JSON.stringify(data));
					   },
					   icon         : {
					   		basePath   : 'http://car0.autoimg.cn',
					   		imageField : 'image',
							formate    : function(path){
								path = '/logo/brand/50/130131578038733348.jpg';
								return path;
							}					   		
					   }
				   }
 				   ,{
					   id 	  		: 'demo10',
					   title 	    : 'Button',
					   type 		: 'Button',
					   submit 	    : function(){
					   		console.log('is button');
					   }
				   }
				]
			});
			
			
			//actionBar.setActive('demo6');
			 
		});
	
	</script>
</body>
</html>
