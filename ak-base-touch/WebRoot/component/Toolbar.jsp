<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>Toolbar</title>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.css"/>
  	<link rel="stylesheet" href="${ctx}/assets/css/lib/amazeui.plugin.css"/>
</head>

<body>

	<script type="text/javascript">
		 window.mainPath = '${ctx}'; 
	</script>
	<script src="${ctx}/assets/js/lib/require.js"></script>
	<script src="${ctx}/assets/js/src/config.js"></script>
	<script type="text/javascript">
		 
		require(['jquery', 'toolbar'], function($, Toolbar){
			
			 var toolbar = new Toolbar({ // 一定是固定在底部, 组件使用amaziui等分网格
				  id     : 'pageToolbar',
				  width  : '100%',
				  height : '49px',
/* 				  style  : {
				  	 backgroundColor : 'red'
				  }, */
				  items : [
				  	{
				  		id : 'reply1',
				  		digit : 8,
				  		cssClass : '',
				  		html : "<input type='text' class='am-form-field am-round'/>",
				  		touch :  function(event){
				  		}
				  	},
				  	{
				  		id : 'reply2',
				  		digit : 2,
				  		cssClass : '',
				  		html : "<i class='am-icon-comment am-icon-md'></i>",
				  		touch :  function(event){
				  			alert();
				  		}
				  	},
				  	{
				  		id : 'reply3',
				  		digit : 2,
				  		cssClass : '',
				  		html : "<i class='am-icon-thumbs-o-up am-icon-md'></i>",
				  		touch :  function(event){
				  			alert();
				  		}
				  	}
				  ]
			 }); 
		});
	
	</script>
</body>
</html>
