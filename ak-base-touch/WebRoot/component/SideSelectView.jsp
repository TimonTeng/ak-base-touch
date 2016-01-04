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
  	<link rel="stylesheet" href="${ctx}/assets/css/lib/amazeui.plugin.css"/>
  	
  	<style type="text/css">
  		.list{
  			width: 100%;
  		}
  		
  		.list li{
  			height: 45px;
  			line-height: 45px;
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
			text-align: left;
			line-height: 45px;
			padding-left: 10px;
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
					<li>省：<label>空</label><i class="am-icon-chevron-right" id="province"><input type="hidden" name="" /></i></li>
					<li>市：<label>空</label><i class="am-icon-chevron-right" id="city"><input type="hidden" name="" /></i></li>
					<li>区：<label>空</label><i class="am-icon-chevron-right" id="district"><input type="hidden" name="" /></i></li>
					<li>我喜欢的网站：<label>空</label><i class="am-icon-chevron-right" id="webSide"><input type="hidden" name="" /></i></li>
					<li>我的生日：<label></label><i class="am-icon-chevron-right" id="birthday"><input type="hidden" name="" /></i></li>
					<li><input type="text" name="" class="am-form-field am-round" placeholder="姓名" /></li>
					<li><textarea rows="1" cols="10" class="am-form-field am-round" placeholder="签名"></textarea></li>
					<li>我的开发技能：<label></label><i class="am-icon-chevron-right" id='mySkill'><input type="hidden" name="" /></i></li>
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
				 parentNode : '#form',
				 configs : [
				 	{
				 		title : '省份选择',
				 		touchTargetId : 'province',
				 		type   	      : 'single', //默认：single, type = (single、multiple、date、grid)
				 		result 	      : 'data',
				 		apiUrl        : 'assets/data/side-select-province.json',
				 		displayField  : 'name',
				 		onSelect : function(selectObject){
				 			//alert(JSON.stringify(selectObject));
				 			$('label', $("#province").parent()).text(selectObject.name);
				 			//console.log($('label', $("#province").parent()).html());
				 		}
				 	},
				 	{
				 		title : '城市选择',
				 		touchTargetId : 'city',
				 		type   		  : 'single', //默认：single, type = (single、multiple、date、grid)
				 		result 		  : 'data',
				 		apiUrl 		  : 'assets/data/side-select-city.json',
				 		displayField  : 'name',
				 		join 		  : 'province',
				 		joinPropertys : {
				 			'id' : 'provinceId'
				 		},
				 		onSelect : function(selectObject){
				 			$('label', $("#city").parent()).text(selectObject.name);
				 		}
				 	},
				 	{
				 		title : '区县选择',
				 		touchTargetId : 'district',
				 		type   		  : 'single', //默认：single, type = (single、multiple、date、grid)
				 		result 		  : 'data',
				 		apiUrl 		  : 'assets/data/side-select-district.json',
				 		displayField  : 'name',
				 		join 		  : 'city',
				 		joinPropertys : {
				 			'id' : 'cityId'
				 		},
				 		onSelect : function(selectObject){
				 			$('label', $("#district").parent()).text(selectObject.name);
				 		}
				 	},
				 	{
				 		title : '我喜爱的网站',
				 		touchTargetId : 'webSide',
				 		type   		  : 'multiple', //默认：single, type = (single、multiple、date、grid)
				 		result 		  : 'data',
				 		apiUrl 		  : 'assets/data/website.json?123',
				 		displayField  : 'name',
				 		onSelect : function(selectObject){
				 			var names = new Array();
				 			selectObject.forEach(function(elt, i) {
				 				names.push(elt.name);
				 			});
				 			$('label', $("#webSide").parent()).text(names.join(','));
				 			
				 		}
				 	},
				 	{
				 		title : '我的生日',
				 		touchTargetId : 'birthday',
				 		type          : 'date',     //默认：type = (single、multiple、date、grid)
				 		pattern       : 'yyyy-MM-dd',
				 		onSelect : function(selectObject){
				 			console.log(selectObject);
				 		}
				 	},
				 	{
				 		title : '我的技能',
				 		touchTargetId : 'mySkill',
				 		type          : 'grid',     //默认：type = (single、multiple、date、grid)
				 		onSelect : function(selectObject){
				 			console.log(selectObject);
				 		}
				 	}
				 ]
			});
 
			//sideSelectView.setData('mySkill', [{id : 1},{id :2}]);
			//sideSelectView.setData('province', {id : 1});
 
		});
	
	</script>
</body>
</html>
