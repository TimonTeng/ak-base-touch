<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>SideSelectView</title>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.css"/>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.plugin.css"/>
  	
  	<style type="text/css">
  		.list{
  			width: 100%;
  		}
  		
  		.list li{
  			height: 45px;
  			line-height: 45px;
  			background-color: silver;
  			margin-top: 10px;
  			text-align: right;
  			padding-right: 20px;
  			cursor: pointer;
  		}
  		
  		.list label {
  	 		background-color: #bacb9d; 
			width: 50%; 
			height: 45px;
			float: right;
			margin-right: 50px;
  		}
  		
  		.list i{
  			float: right;
  			position: absolute;
  			width: 49px;
  			height: 45px;
  			right: 0;
  			background-color: #bacb9d;
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
			<a href="#title-link" class=""> SideSelect View </a>
		</h1>

		<div class="am-header-right am-header-nav">
			<a href="#right-link" class=""> 
				<i class="am-header-icon am-icon-bars"></i>
			</a>
		</div>
		
	</header>
	
	<div id="viewport" class="am-plugin-scrollview">
		<div>
			<div id="form" class="list">
				<ul>
					<li>省：<label></label><i class="am-icon-chevron-right" id="webSide"><input type="hidden" name="" /></i></li>
					<li>市：<label></label><i class="am-icon-chevron-right" id="webSide"><input type="hidden" name="" /></i></li>
					<li>区：<label></label><i class="am-icon-chevron-right" id="webSide"><input type="hidden" name="" /></i></li>
					<li>我喜欢的网站：<label></label><i class="am-icon-chevron-right" id="city"><input type="hidden" name="" /></i></li>
					<li>我的生日：<label></label><i class="am-icon-chevron-right" id="birthday"><input type="hidden" name="" /></i></li>
					<li>姓名：<input type="text" name="" /></li>
					<li>签名：<textarea rows="1" cols="10"></textarea></li>
					<li>我的开发技能：<label></label><i class="am-icon-chevron-right" ><input type="hidden" name="" /></i></li>
				</ul>
			</div>
		</div>
	</div>
	
 
	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
		 
		require(['jquery', 'amazeui', 'sideSelectView', 'scrollView'], function($, amazeui, SideSelectView, ScrollView){
		
			var scrollView = new ScrollView({
				parentNode : '#viewport',
				style : {
					top : '50px',
					backgroundColor : 'white'
				}
			});
		
			var sideSelectView = new SideSelectView({
				 parentNode : 'form',
				 columns : [
				 	{
				 		id           : 'province',
				 		type   	     : 'single', //默认：single, type = (single、multiple)
				 		result 	     : 'data',
				 		apiUrl       : 'assets/data/side-select-province.json',
				 		displayField : 'name'
				 	},
				 	{
				 		id  		 : 'city',
				 		type   		 : 'single', //默认：single, type = (single、multiple)
				 		result 		 : 'data',
				 		apiUrl 		 : 'assets/data/side-select-city.json',
				 		displayField : 'name',
				 		join 		 : 'province',
				 		joinPropertys: [{
				 			'id' : 'provinceId'
				 		}]
				 	},
				 	{
				 		id  		 : 'district',
				 		type   		 : 'single', //默认：single, type = (single、multiple)
				 		result 		 : 'data',
				 		apiUrl 		 : 'assets/data/side-select-district.json',
				 		displayField : 'name',
				 		join 		 : 'city',
				 		joinPropertys: [{
				 			'id' : 'cityId'
				 		}]
				 	},
				 	{
				 		id     		 : 'webSide',
				 		type   		 : 'multiple', //默认：single, type = (single、multiple)
				 		result 		 : 'data',
				 		apiUrl 		 : 'assets/data/website.json',
				 		displayField : 'name'
				 	},
				 	{
				 		id  : 'birthday',
				 		type : 'date',
				 		pattern : 'yyyy-MM-dd'
				 	}
				 ]
			});
 
		});
	
	</script>
</body>
</html>
