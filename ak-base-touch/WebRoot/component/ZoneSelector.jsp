<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>ZoneSelector</title>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.css"/>
  	<link rel="stylesheet" href="${ctx}/assets/css/lib/amazeui.plugin.css"/>
  	<style type="text/css">
  		.console {
  			z-index: 9999;
  			width: 100%;
  			height: 65px;
  			position: fixed;
  			bottom : 0;
  			background-color: black;
  			color: lime;
  		}
  	
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
			<a href="#title-link" class=""> ZoneSelector </a>
		</h1>

		<div class="am-header-right am-header-nav">
			<a href="#right-link" class="" > <i
				class="am-header-icon am-icon-bars"></i>
			</a>
		</div>
		
	</header>
	<div class="console"></div>
	
	
	<form class="am-form">
	  <fieldset>
	    <div class="am-form-group">
	      <label for="doc-ipt-email-1" id="CitySelector">城市选择</label>
	    </div>
<!-- 	
	    <div class="am-form-group">
	      <label for="doc-ipt-pwd-1">省市区选择</label>
	      <input type="text" class="" placeholder="点击选择省市区">
	    </div>
	  -->
	  </fieldset>
	</form>
	
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
		 
		require(['jquery', 'amazeui', 'zoneSelector'], function($, amazeui, ZoneSelector){
			 	
			 	var zoneSelector = new ZoneSelector({
			 		title : '城市选择',
			 		type : 'ProvinceCity',  //Province,City,ProvinceCity,ProvinceCityDistrict
			 		province : {
			 			apiUrl : '${dataCtx}/ak-sw-p2pm/provinceByAlphabetSeq.html',
			 			displayField : 'provinceName',
			 			result : 'data'
			 		},
			 	 
			 		city : {
			 			apiUrl : '${dataCtx}/ak-sw-p2pm/foundProvinceCity.html',
			 			//apiUrl : '${dataCtx}/ak-sw-p2pm/cityByAlphabetSeq.html',
			 			displayField : 'cityName',
			 			result : 'data',
			 			parentQueryName : 'id'
			 		},
			 		
			 		district : {
			 			apiUrl : '${dataCtx}/ak-sw-p2pm/foundCityDistrict.html',
			 			displayField : 'districtName',
			 			result : 'data',
			   			parentQueryName : 'id'
			 		},
			 		
			 		submit : function(data){
			 		 	console.log(JSON.stringify(data));
			 		}
			 	});
			 	
			 	$('#CitySelector').bind('touchend', function(){
			 		zoneSelector.open();
			 	});
			 	
		});
	
	</script>
</body>
</html>
