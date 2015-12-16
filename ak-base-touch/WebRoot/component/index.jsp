<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  	<title>ListView</title>
  	<link rel="stylesheet" href="${ctx}/assets/css/amazeui.css"/>
</head>

<body>
	<div class="am-panel am-panel-primary">
	  <div class="am-panel-hd">组件列表</div>
	  <div class="am-panel-bd">
		<ul class="am-list am-list-border">
			<li><a href="ActionBar.html">Action Bar</a></li>
			<li><a href="ActionBar-Demo1.html">ActionBar-Demo1</a></li>
			<li><a href="ActionBar-DoubleSelectView.html">ActionBar-DoubleSelectView</a></li>
			<li><a href="ListView.html">ListView</a></li>
			<li><a href="PivotListView.html">PivotListView</a></li>
		</ul>
	  </div>
	</div>
</body>
</html>
