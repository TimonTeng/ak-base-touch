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
  	<link rel="stylesheet" href="${ctx}/assets/css/lib/amazeui.plugin.css?321"/>
  	
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
		 
		require(['jquery', 'amazeui', 'sideSelectView', 'scrollView', 'sideGridView', 'sideFormView'], function($, amazeui, SideSelectView, ScrollView, SideGridView, SideFormView){
		
			var scrollView = new ScrollView({
				parentNode : '#viewport',
				style : {
					top : '50px',
					backgroundColor : 'white'
				}
			});
			
			
			//我的技能表单
			var mySkillFormView = new SideFormView({
				 title : {
				 	add  : '添加技能',
				 	edit : '编辑技能',
				 	info : '技能详情' 
				 },
				 template : 'assets/template/demo/skill-form.tpl',
				 //apiUrl   : '', //异步加载表单，后续开发
				 //result   : '', //TODO 异步加载表单参数
				 sideSelectView : new SideSelectView({
					initial : 'false',
					configs : [
					 	{
					 		title : '技能选择',
					 		touchTargetId : 'title',
					 		type   	      : 'single', //默认：single, type = (single、multiple)
					 		loadOnce 	  :  true,    //是否每次打开视图都重新加载远程数据 ， true 只会加载1次
					 		result 	      : 'data',
					 		apiUrl        : 'assets/data/skill.json',
					 		displayField  : 'name',
					 		onSelect : function(selectObject){
					 			 $('label', $("#title").parent()).text(selectObject.name);
					 		},
					 		renderText : function(selectObject){ // 调用 SideFormView.initSelectDataText(); 统一触发
					 		
					 		}
					 	}
					]
				 }), 
				 
				 onloadAfter : function(formObject){ // 渲染表单数据后执行
				 	//console.log(JSON.stringify(formObject));
				 },
				 
				 onSubmit : function(formObject){ // 提交后执行
				 	console.log(JSON.stringify(formObject));
				 	if(mySkillFormView.getState() == 'add'){
				 		//mySkillGridView.addStoreRecord(formObject); //添加记录
				 	}
				 	
				 	if(mySkillFormView.getState() == 'edit'){
				 		//mySkillGridView.updateStoreRecord(formObject);
				 	}
				 	
				 	//mySkillGridView.reload();//重新加载数据
				 }
			});
			
			//我的技能列表
			var mySkillGridView = new SideGridView({
 
	 			title : '我的技能',
	 			
	 			touchTargetId : 'mySkill',
	 			
	 			plugins : [
	 				{
	 					title : '添加技能',
	 					icon : 'icon_add',
						touch : function(e){
							mySkillFormView.loadNewForm();
						}				 					
	 				}
	 			],
	 			
	 			//enabledHeader : false, 后续开发
	 			
	 			columns : [
					{
						type : 'string',
						text : '技能',
						field : 'title',
						display : true,
						digit : 5
					}, {
						type : 'number',
						text : '周期(月)',
						field : 'month',
						display : true,
						digit : 5
					}, {
						type : 'boolean',
						text : '启用',
						field : 'enabled',
						display : false,
						digit : 2
					}, {
						type : 'action',
						text : '编辑',
						actions : ['edit'],
						display : true,
						digit : 2
					} 
				],
				
				data : [ {
					id : '1',
					title : 'java',
					month : '84',
					enabled : true
				}, {
					id : '2',
					title : 'swift',
					month : '84',
					enabled : true
				}, {
					id : '3',
					title : 'oracle',
					month : '84',
					enabled : true
				}, {
					id : '4',
					title : 'javascript',
					month : '84',
					enabled : true
				}, {
					id : '5',
					title : 'css',
					month : '84',
					enabled : true
				}, {
					id : '6',
					title : 'linux',
					month : '84',
					enabled : true
				} ],

				onloadAfter : function(store) { // 渲染表单数据后执行

				},

				editAction : function(record) {
					//mySkillFormView.loadForm(record);
					
					//alert(record.get('title'));
					
					mySkillFormView.loadForm(record.data);
				},

				deleteAction : function(record) {

				},

				infoAction : function(record) {

				},

				onSubmit : function() { //确认按钮
					console.log('从 Grid View 返回');
				}

			});

			//选项视图
			var sideSelectView = new SideSelectView({
				parentNode : '#form',
				configs : [
						{
							title : '省份选择',
							touchTargetId : 'province',
							type : 'single', //默认：single, type = (single、multiple)
							result : 'data',
							apiUrl : 'assets/data/side-select-province.json',
							displayField : 'name',
							onSelect : function(selectObject) {
								$('label', $("#province").parent()).text(selectObject.name);
							},
							renderText : function(selectObject){
								alert(JSON.stringify(selectObject));
							}
						},
						{
							title : '城市选择',
							touchTargetId : 'city',
							type : 'single', //默认：single, type = (single、multiple)
							result : 'data',
							apiUrl : 'assets/data/side-select-city.json',
							displayField : 'name',
							join : 'province',
							joinPropertys : {
								'id' : 'provinceId'
							},
							onSelect : function(selectObject) {
								$('label', $("#city").parent()).text(selectObject.name);
							},
						    renderText : function(selectObject){
							
							}
						},
						{
							title : '区县选择',
							touchTargetId : 'district',
							type : 'single', //默认：single, type = (single、multiple)
							result : 'data',
							apiUrl : 'assets/data/side-select-district.json',
							displayField : 'name',
							join : 'city',
							joinPropertys : {
								'id' : 'cityId'
							},
							onSelect : function(selectObject) {
								$('label', $("#district").parent()).text(selectObject.name);
							},
						    renderText : function(selectObject){
								alert(JSON.stringify(selectObject));
							}
						},
						{
							title : '我喜爱的网站',
							touchTargetId : 'webSide',
							type : 'multiple', //默认：single, type = (single、multiple)
							result : 'data',
							apiUrl : 'assets/data/website.json?123',
							loadOnce : true,
							displayField : 'name',
							onSelect : function(selectObject) { // selectObject @ Array
								var names = new Array();
								selectObject.forEach(function(elt, i) {
									names.push(elt.name);
								});
								$('label', $("#webSide").parent()).text(names.join(','));
							},
						    renderText : function(selectObject){
							
							}
						}
/* 						, {
							title : '我的生日',
							touchTargetId : 'birthday',
							type : 'date', //默认：type = (single、multiple、date)
							pattern : 'yyyy-MM-dd',
							onSelect : function(selectObject) {
								console.log(selectObject);
							}
						} */
						]
			});

			sideSelectView.setSelectOptionValue('province', {id : 1});
			sideSelectView.setSelectOptionValue('city', {id : 1});
			sideSelectView.setSelectOptionValue('district', {id : 1});
			
			sideSelectView.initSelectDataText();

			//初始参数
			//sideSelectView.setData('province', {id : 1});
			//sideSelectView.setData('webSide', [{id : 1}, {id : 2}]);
			//mySkillGridView.setData([{},{},.,.,.,.]);
			
		});
	</script>
</body>
</html>
