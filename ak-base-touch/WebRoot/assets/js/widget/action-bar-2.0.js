/**
 * Action View Class
 * @Require: jQuery
 * @Extend:
 */
!(function(root, factory) {
	'use strict'
  
	if ('function' === typeof define) {
		
		if (define.amd) {
			define(function(require) {
				var $           = require('jquery'),
				    _           = require('lodash'),
					Backbone    = require('backbone'),
					View        = require('backbone.view'),
					AlphabetBar = require('alphabetBar');
				return factory($, _, Backbone, View, AlphabetBar);
			});
		
		} else if (define.cmd) {
			
			define(function(require, exports, module) {
				
				var $         = require('jquery'),
				    _         = require('lodash'),
					Backbone  = require('backbone'),
					View      = require('backbone.view'),
				  AlphabetBar = require('alphabetBar');
				
				return factory($, _, Backbone, View, AlphabetBar);
			});
		}
		
	} else {

		root.ActionBar = factory(root.ActionBar);
	}
	
}(this, function($, _, Backbone, View, AlphabetBar) {
	'use strict'
  	
	var ViewData = {
		form : {
			Remote   : 'remote',
			Local    : 'local',
			Compose  : 'compose'
		} 
	};
	
	var ViewLayout = {
		aliquots : 'aliquots',
		fix      : 'fix'	
	};
	
	var ViewModel = {
		Button					 : 'Button',
		SelectView       		 : 'SelectView',
		DoubleSelectView         : 'DoubleSelectView',
		AplhabetSelectView       : 'AplhabetSelectView',
		AplhabetDoubleSelectView : 'AplhabetDoubleSelectView'
	};
	
	/**
	 * action 元素
	 */
	var ActionElement = ActionElement || function(){};
	
	ActionElement.prototype = {
		 id     	: null,
		 type   	: null,
		 result 	: null,
		 title      : null,
		 digit 	    : null,
		 dataType   : ViewData.form.Remote,
		 submit 	: null,
		 $context 	: null,
		 $dataView  : null,
		 $root : null,
		 $rootContext : null,
		 $node : null,
		 $nodeContext : null,
		 render : null,
		 active : false,
		 selectData : {root : {}, node : {}},
		 store : null,
		 rootStore : null,
		 nodeStore : null,
		 rootResult : null,
		 nodeResult : null,
		 rootDisplayField : null,
		 nodeDisplayField : null,
		 nodesField : null,
		 doLoad : null,
		 doRootSelect : null,
		 doNodeSelect : null,
		 doRenderRootStore : null,
		 loaded : true,
		 rootScroll : null,
		 nodeScroll : null,
		 touchRootEl : null,
		 touchNodeEl : null,
		 alphabetBar : null,
		 icon : null
	}
	
	/**
	 * action 主视图
	 */
	var ActionView = function(){
		this.layout = this.actions = this.view = this.parentNode = null;
		this.style = {color : '#000'};
		this.defaults = null;
		this.defaultDigit = 4;
		this.$main = this.$body = this.$cursor = null;
		this.iscroll = null;
		this.layout = ViewLayout.aliquots;
		this.actionElements = {};
		this.height = 40; // actionbar 默认高度
		this.activeElement = null;//激活的 action element
		this.activeColor = '#d43d3d';
	}
	
	/**
	 * 初始化配置
	 */
	ActionView.prototype.initConfiguration = function(view){
		var self = this;
		this.view = view;
		this.parentNode = view.getAttr('parentNode');
		this.layout     = view.getAttr('layout') || ViewLayout.aliquots;
		this.actions    = view.getAttr('actions');
		var style 		= view.getAttr('style') || {}; $.extend(this.style, style);
		this.defaults   = view.getAttr('defaults') || {};
		this.height      = view.getAttr('height') || this.height;
		this.activeColor = view.getAttr('activeColor') || this.activeColor;
		this.$main = $(this.parentNode);
		this.initView();
		this.initEvent();
		this.initDataLoader();
	}
	
	/**
	 * 初始化主视图样式
	 */
	ActionView.prototype.initViewStyle = function(){
		var style = {height : this.height, lineHeight : this.height+'px'};
		$.extend(style, this.style);
		this.$main.css(style);
	}
	
	/**
	 * 初始化视图
	 */
	ActionView.prototype.initView = function(){
		this.initViewStyle();
		switch(this.layout){
			case ViewLayout.fix      : this.initFixLayout(); break;
			case ViewLayout.aliquots : this.initAliquotsLayout(); break;
			default : this.initAliquotsLayout(); break;
		}
	}
	
	/**
	 * 初始化等分网格视图
	 */
	ActionView.prototype.initAliquotsLayout = function(){
		var self = this;
		this.createBody();
		this.actions.forEach(function(config, i) {
			var el = self.createAliquotsActionElement(config);
			self.injectionViewController(el);
			self.actionElements[config.id] = el;
		});
	}
	
	/**
	 * 初始化固定宽度视图
	 */
	ActionView.prototype.initFixLayout = function(){
		var self = this;
		this.createBody();
		var bodyWidth = 0;
		this.actions.forEach(function(config, i) {
			var el = self.createFixActionElement(config);
			self.actionElements[config.id] = el;
			self.injectionViewController(el);
			bodyWidth += el.width;
		});
		this.$body.css({width:bodyWidth});
		this.createActionViewScroll();
	}
	
	/**
	 * 初始化事件
	 */
	ActionView.prototype.initEvent = function(){
		var self = this;
		$.touchEvent('.am-plugin-actionbar-element' , self.$body, {
			end : function(event){
				var id = event.target.id;
				var el = self.getActionElement(id);
				if(el.render){
					el.render();
				}
			}
		});
	}
	
	/**
	 * 初始化数据加载读取器
	 */
	ActionView.prototype.initDataLoader = function(){
		for(var id in this.actionElements){
			var actionElement = this.actionElements[id];
			if(actionElement.type == ViewModel.Button){
				continue;
			}
			this.initDataLoaderSwitch(actionElement);
		}
	}
 
	ActionView.prototype.initDataLoaderSwitch = function(actionElement){
		switch(actionElement.dataType){
			case ViewData.form.Remote  : this.injectionRemoteLoader(actionElement); break;
			case ViewData.form.Local   : this.injectionLocalLoader(actionElement); break;
			case ViewData.form.Compose : this.injectionComposeLoader(actionElement); break;
			default : break;
		}
	}
	
	ActionView.prototype.getActionElement = function(id){
		var el = this.actionElements[id];
		return el;
	}
	
	/**
	 * 创建ActionBar容器
	 */
	ActionView.prototype.createBody = function(){
		this.$body = $('<div>', { id : 'action-body', 'class' : 'am-plugin-padding0'});
		this.$body.appendTo(this.$main);
	}
	
	/**
	 * 创建元素聚焦游标
	 */
	ActionView.prototype.createElementFocusCursor = function(){
		this.$cursor = $('<div>', {'class' : 'am-plugin-actionbar-cursor'});
		this.$cursor.appendTo(this.$main);
	}
	
	/**
	 * 初始化等分网格Action元素
	 */
	ActionView.prototype.createAliquotsActionElement = function(config){
		var actionElement = new ActionElement();
		$.extend(actionElement, config);
		$.extend(actionElement, this.defaults);
		actionElement.digit = config.digit || this.defaultDigit;
		var defineMeshClass = this.defineMeshClass(actionElement.digit);
		actionElement.$context = $('<div>', {'id' : config.id, 'class' :  defineMeshClass+' am-plugin-actionbar-element am-plugin-padding0'});
		actionElement.$context.text(config.title);
		actionElement.$context.appendTo(this.$body);
		return actionElement;
	}
	
	/**
	 * 初始化固定宽度网格Action元素
	 */
	ActionView.prototype.createFixActionElement = function(config){
		var actionElement = new ActionElement();
		$.extend(actionElement, this.defaults);
		$.extend(actionElement, config);
		actionElement.$context = $('<div>', {'id' : config.id, 'class' : 'am-plugin-actionbar-element am-plugin-padding0', 'style' : 'width :'+actionElement.width + 'px;'});
		actionElement.$context.text(config.title);
		actionElement.$context.appendTo(this.$body);
		return actionElement;
	}
	
	/**
	 * 创建ActionView 
	 */
	ActionView.prototype.createActionViewScroll = function(){
	      this.iscroll = new IScroll(this.parentNode, {
	    	  scrollX: true, 
	    	  scrollY: false,
	    	  mouseWheel: true
	      });
	}
	
	
	/**
	 * 创建action元素数据视图
	 */
	ActionView.prototype.buildActionElementDataView = function(actionElement){
		var self = this;
		var id = actionElement.id;
		var dataView = document.getElementById(id+'-data-view');
		if(dataView === null || dataView === undefined){
			var top = self.height+self.$main.offset().top;
			var style = {top : top};
			actionElement.$dataView = $('<div>', { id : id+'-data-view', 'class' : 'am-plugin-actionbar-container'});
			actionElement.$dataView.css(style);
			actionElement.$dataView.appendTo(document.body);
			self.buildDataViewLayoutRoute(actionElement);
			self.bindRootSelectorPolicy(actionElement);
			self.bindNodeSelectorPolicy(actionElement);
			self.bindRenderRootStorePolicy(actionElement);
		}
	}
	
	/**
	 * 注入视图控制器
	 */
	ActionView.prototype.injectionViewController = function(actionElement){
		switch(actionElement.type){
			case ViewModel.Button             		: this.injectionButtonView(actionElement); break;
			case ViewModel.SelectView	    		: this.injectionSelectView(actionElement); break;
			case ViewModel.DoubleSelectView 		: this.injectionDoubleSelectView(actionElement); break;
			case ViewModel.AplhabetSelectView 	    : this.injectionAplhabetSelectView(actionElement); break;
			case ViewModel.AplhabetDoubleSelectView : this.injectionAplhabetDoubleSelectView(actionElement); break;
			default : break;
		}
	}
	
	/**
	 * 注入按钮视图
	 * @param actionElement
	 */
	ActionView.prototype.injectionButtonView = function(actionElement){
		var self = this;
		actionElement.render = function(){
			self.setActiveElement(this.id);
			if(this.submit && this.active === true){
				this.submit();
			}
		}
	}
	
	/**
	 * 注入单选条件视图
	 * @param actionElement
	 */
	ActionView.prototype.injectionSelectView = function(actionElement){
		var self = this;
		actionElement.render = function(){
			self.buildActionElementDataView(this);
			self.setActiveElement(this.id);
		}
	}
	
	/**
	 * 注入二级联动选择视图
	 * @param actionElement
	 */
	ActionView.prototype.injectionDoubleSelectView = function(actionElement){
		var self = this;
		actionElement.render = function(){
			self.buildActionElementDataView(this);
			self.setActiveElement(this.id);
		}
	}
	
	/**
	 * 注入字母导航单选条件视图
	 * @param actionElement
	 */
	ActionView.prototype.injectionAplhabetSelectView = function(actionElement){
		var self = this;
		actionElement.render = function(){
			self.buildActionElementDataView(this);
			self.setActiveElement(this.id);
		}
	}
	
	/**
	 * 注入字母导航二级联动选择视图
	 * @param actionElement
	 */
	ActionView.prototype.injectionAplhabetDoubleSelectView = function(actionElement){
		var self = this;
		actionElement.render = function(){
			self.buildActionElementDataView(this);
			self.setActiveElement(this.id);
		}
	}
	
	/**
	 * 记录激活的element
	 */
	ActionView.prototype.setActiveElement = function(id){
		var touchElement = this.actionElements[id];
		if(touchElement){
			if(touchElement.active === true){
				this.deactivateElement();
			}else{
				this.deactivateElement();
				this.activeElement = touchElement;
				this.setActiveRoute(touchElement);
				this.loadRoot();
			}
		}
	}
	
	/**
	 * 取消激活的element
	 */
	ActionView.prototype.deactivateElement = function(){
		if(this.activeElement){
			var style = {color : this.style.color};
			this.activeElement.$context.css(style);
			this.activeElement.active = false;
			
			if(this.activeElement.type != ViewModel.Button){
				this.activeElement.$dataView.css({display : 'none'});
				this.activeElement.$dataView.removeClass('am-plugin-actionbar-fadein');
			}
		}
	}
	
	/**
	 * 激活路由处理
	 */
	ActionView.prototype.setActiveRoute = function(touchElement){
		switch(touchElement.type){
			case ViewModel.Button 			  		: this.setActiveButtonRoute(touchElement); break;
			case ViewModel.SelectView 		  		: this.setActiveSelectViewRoute(touchElement); break;
			case ViewModel.DoubleSelectView   		: this.setActiveSelectViewRoute(touchElement); break;
			case ViewModel.AplhabetSelectView 	    : this.setActiveSelectViewRoute(touchElement); break;
			case ViewModel.AplhabetDoubleSelectView : this.setActiveSelectViewRoute(touchElement); break;
		}
	}
	
	/**
	 * 按钮的路由
	 */
	ActionView.prototype.setActiveButtonRoute = function(touchElement){
		var style = {color : this.activeColor};
		touchElement.active = true;
		touchElement.$context.css(style);
	}
	
	/**
	 * 下拉选择路由
	 */
	ActionView.prototype.setActiveSelectViewRoute = function(touchElement){
		var style = {color : this.activeColor};
		touchElement.active = true;
		touchElement.$context.css(style);
		touchElement.$dataView.css({display : 'block'});
		touchElement.$dataView.addClass('am-plugin-actionbar-fadein');
	}
	
	/**
	 * 构建数据视图布局
	 */
	ActionView.prototype.buildDataViewLayoutRoute = function(actionElement){
		switch(actionElement.type){
			case ViewModel.SelectView : this.drawSingleView(actionElement); break;
			case ViewModel.DoubleSelectView : this.drawDualView(actionElement); break;
			case ViewModel.AplhabetSelectView : this.drawSingleView(actionElement); break;
			case ViewModel.AplhabetDoubleSelectView : this.drawDualView(actionElement); break;
		}
	}
	
	/**
	 * 单视图
	 */
	ActionView.prototype.drawSingleView = function(actionElement){ //'.root-context-'+activeElement.id
		actionElement.$root = this.createViewContainer(0, 'am-plugin-actionbar-container-full root-context-'+actionElement.id);
		actionElement.$rootContext = this.createViewContainer(1, null);
		actionElement.$rootContext.appendTo(actionElement.$root);
		actionElement.$root.appendTo(actionElement.$dataView);
	}
	
	/**
	 * 双视图
	 */
	ActionView.prototype.drawDualView = function(actionElement){
		actionElement.$root = this.createViewContainer(0,'am-plugin-actionbar-container-l root-context-'+actionElement.id);
		actionElement.$rootContext = this.createViewContainer(1, null);
		actionElement.$rootContext.appendTo(actionElement.$root);
		actionElement.$root.appendTo(actionElement.$dataView);
		
		actionElement.$node = this.createViewContainer(2,'am-plugin-actionbar-container-r node-context-'+actionElement.id);
		actionElement.$nodeContext = this.createViewContainer(3, null);
		actionElement.$nodeContext.appendTo(actionElement.$node);
		actionElement.$node.appendTo(actionElement.$dataView);
	}
	
	/**
	 * 
	 */
	ActionView.prototype.createViewContainer = function(type, target){
		switch(type){
			case 0 : return $('<div>', {'class' : 'root-view ' + target});
			case 1 : return $('<div>', {'class' : 'root-context', 'id' : target});
			case 2 : return $('<div>', {'class' : 'node-view ' + target});
			case 3 : return $('<div>', {'class' : 'node-context', 'id' : target});
		}
	}
	
	ActionView.prototype.createScroll = function(scrollId){
		return new IScroll(scrollId, {
			click : true
		});
	}
	
	/**
	 * 获取加载主数据的Url
	 */
	ActionView.prototype.getRootUrl = function(){
		var activeElement = this.activeElement;
		var url = activeElement.url;
		if(url instanceof Object){
			return url.root.apiUrl;
		}else{
			return url;
		}
	}
 
	/**
	 * 获取加载节点数据的Url
	 */
	ActionView.prototype.getNodeUrl = function(){
		var activeElement = this.activeElement;
		var url 	= activeElement.url;
		var node	= url.node;
		var nodeUrl	= node.apiUrl;
		this.rootPropertys = node.rootPropertys;
		var params = "?"
		if(node.rootPropertys){
			for(var i = 0; i < node.rootPropertys.length; i++){
				for (var f in node.rootPropertys[i]) {
					params += '&'+f+'='+activeElement.selectData.root[node.rootPropertys[i][f]];
				}
			}
		}
		activeElement.nodeDisplayField = node.displayField;
		activeElement.nodeResult = node.result;
		return nodeUrl+params;
	}
	
	/**
	 * 
	 */
	ActionView.prototype.setRootDisplayField = function(){
		var activeElement = this.activeElement;
		var url = activeElement.url;
		if(url instanceof Object){
			activeElement.rootDisplayField = url.root.displayField;
			activeElement.rootResult = url.root.result;
			activeElement.nodesField = url.root.nodesField;
		}else{
			activeElement.rootDisplayField = activeElement.displayField;
			activeElement.rootResult =activeElement.result;
		}
	}
	
	/**
	 * 设置字母导航组件
	 */
	ActionView.prototype.setAlphabetBar = function(){
		var activeElement = this.activeElement;
		var height = activeElement.$dataView.height();
		var alphabetBar = new AlphabetBar();
		alphabetBar.bindTractionScroll(activeElement.rootScroll);
		alphabetBar.bind$DataView(activeElement.$dataView);
		alphabetBar.renderTo(activeElement.$dataView, height);
		activeElement.alphabetBar = alphabetBar;
	}
	
	
	/**
	 * 设置记录图标
	 */
	ActionView.prototype.setRecordElementIcon = function(actionElement, dataItem, $dataNode){
		if(!actionElement.icon){
			return;
		}
		console.log('ActionView.prototype.setRecordElementIcon');
		var formate    = actionElement.icon.formate;
		var imageField = actionElement.icon.imageField;
		var basePath   = actionElement.icon.basePath;
		var path = dataItem[imageField];
		if(formate){
			path = basePath+formate(path);
		}
		var img = $('<img>', {src : path, style : 'margin-right : 8px; width : 48px; height : 48px;'});
		$dataNode.prepend(img);
	}
	
	
	/**
	 * 绑定渲染主节点数据策略
	 */
	ActionView.prototype.bindRenderRootStorePolicy = function(actionElement){
		var self = this;
		if(actionElement.doRenderRootStore){
			return;
		}
		
		if(self.isAlphabetModelType(actionElement.type) == true){
			actionElement.doRenderRootStore = function(){
				var rootStore    = this.rootStore;
				rootStore.forEach(function(record, i) {
					var $codeWrap  = self.renderMaterialElement(3, record);
					var $codeTag   = self.renderMaterialElement(4, record);
					var $codeTagUl = self.renderMaterialElement(5, record);
					var data = record.data;
					if(data){
						data.forEach(function(dataItem, i) {
							var $dataNode = self.renderMaterialElement(0, dataItem);
							$dataNode.text(dataItem[actionElement.rootDisplayField]);
							$dataNode.appendTo($codeTagUl);
							self.setRecordElementIcon(actionElement, dataItem, $dataNode);
						});
					}
					$codeTagUl.appendTo($codeTag);
					$codeTag.appendTo($codeWrap);
					$codeWrap.appendTo(actionElement.$rootContext);
				});
				self.renderRootAfter();
			}
		}else{
			actionElement.doRenderRootStore = function(){
				var rootStore    = this.rootStore;
				var $rootUl      = self.renderMaterialElement(2, null);
				var $allDataNode = self.renderMaterialElement(1, null);
				$allDataNode.appendTo($rootUl);
				rootStore.forEach(function(record, i) {
					var $dataNode = self.renderMaterialElement(0, record);
					$dataNode.text(record[actionElement.rootDisplayField]);
					$dataNode.appendTo($rootUl);
					self.setRecordElementIcon(actionElement, record, $dataNode);
				});
				$rootUl.appendTo(actionElement.$rootContext);
				self.renderRootAfter(); 
			}
		}
	}
 
	
	/**
	 * 渲染主数据源
	 */
	ActionView.prototype.renderRootStore = function(){
		var activeElement = this.activeElement;
		activeElement.doRenderRootStore();
	}
	
	/**
	 * 渲染节点数据源
	 */
	ActionView.prototype.renderNodeStore = function(){
		var self = this;
		var activeElement = this.activeElement;
		var nodeStore     = activeElement.nodeStore;
		var $nodeUl       = this.renderMaterialElement(2, null);
		var $allDataNode  = this.renderMaterialElement(1, null);
		$allDataNode.appendTo($nodeUl);
		if(nodeStore){
			nodeStore.forEach(function(record, i) {
				var $dataNode = self.renderMaterialElement(0, record);
				$dataNode.text(record[activeElement.nodeDisplayField]);
				$dataNode.appendTo($nodeUl);
			})
		}
		activeElement.$nodeContext.html('');
		$nodeUl.appendTo(activeElement.$nodeContext);
		self.renderNodeAfter();
	}
	
	/**
	 * 素材元素渲染
	 */
	ActionView.prototype.renderMaterialElement = function(type, record){
		switch(type){
			case 0 : return $('<li>', {'data-object' : JSON.stringify(record)});
			case 1 : return $("<li>", {'data-object' : '{id : 0, text : \'全部\', dataType : \'remote\'}', 'data-select' : true, text : '全部'});
			case 2 : return $("<ul>", {'class' : 'warp_context'});
			case 3 : return $("<div>",{ 'id' : 'warp_alphabet_'+record.code, 'class' : 'warp_alphabet_mark'});
			case 4 : return $("<div class='warp_alphabet_title'><li><h2>"+record.code+"</h2></li></div>");
			case 5 : return $("<ul>",{ 'id' : 'warp_u_'+record.code, 'class' : 'warp_context'});
			case 6 : return $("<ul>",{ 'id' : 'warp_u_'+record.code, 'class' : 'warp_context'});
		}
	}
	
	/**
	 * 绑定主节点选择器策略
	 */
	ActionView.prototype.bindRootSelectorPolicy = function(actionElement){
		var self = this;
		if(actionElement.type === ViewModel.SelectView || actionElement.type === ViewModel.AplhabetSelectView){
			actionElement.doRootSelect = function(){
				if(actionElement.submit){
					actionElement.submit(actionElement.selectData);
				}
				self.deactivateElement();
			}
			return;
		}
		if(actionElement.type === ViewModel.DoubleSelectView || actionElement.type === ViewModel.AplhabetDoubleSelectView){
			actionElement.doRootSelect = function(){
				self.loadNode();
			}
			return;
		}
	}
	
	/**
	 * 绑定子节点选择器策略
	 */
	ActionView.prototype.bindNodeSelectorPolicy = function(actionElement){
		var self = this;
		if(actionElement.type === ViewModel.DoubleSelectView || actionElement.type === ViewModel.AplhabetDoubleSelectView){
			actionElement.doNodeSelect = function(){
				if(actionElement.submit){
					actionElement.submit(actionElement.selectData);
				}
				self.deactivateElement();
			}
			return;
		}
	}
	
	/**
	 * @param type
	 */
	ActionView.prototype.isAlphabetModelType = function(type){
		var flag = false;
		switch(type){
			case ViewModel.AplhabetSelectView : flag = true; break;
			case ViewModel.AplhabetDoubleSelectView : flag = true; break;
		}
		return flag;
	}
	
	/**
	 * 
	 * @param el
	 */
	ActionView.prototype.selectedOff = function(el){
		if(!el){
			return;
		}
		el.css('backgroundColor', '#fff');
		el.data('select', true);
	}
	
	/**
	 * 
	 * @param el
	 */
	ActionView.prototype.selectedOn = function(el){
		el.css('backgroundColor', '#ececec');
		el.data('select', true);
		return el.data('object');
	}

	/**
	 * 主节点数据渲染完成后处理过程
	 */
	ActionView.prototype.renderRootAfter = function(){
		var self = this;
		var activeElement = this.activeElement;
		if(!activeElement.rootScroll){
			activeElement.rootScroll = self.createScroll('.root-context-'+activeElement.id);
		}else{
			activeElement.rootScroll.refresh();
		}
		
		if(activeElement.alphabetBar == null && self.isAlphabetModelType(activeElement.type) === true){
			self.setAlphabetBar();
		}
		
		$.touchEvent('.warp_context li', activeElement.$rootContext, {
			start : function(e){
				self.selectedOff(activeElement.touchRootEl);
				activeElement.touchRootEl = $(e.target);
				self.selectedOn(activeElement.touchRootEl);
			},
			move : function(e){
				self.selectedOff(activeElement.touchRootEl);
			},
			end : function(e){
				activeElement.selectData.root = activeElement.touchRootEl.data('object');
				activeElement.doRootSelect();
			}
		});
	}
	
	/**
	 * 子节点数据渲染完成后处理过程
	 */
	ActionView.prototype.renderNodeAfter = function(){
		var self = this;
		var activeElement = this.activeElement;
		if(!activeElement.nodeScroll){
			activeElement.nodeScroll = self.createScroll('.node-context-'+activeElement.id);
		}else{
			activeElement.nodeScroll.refresh();
		}
		
		$.touchEvent('.warp_context li', activeElement.$nodeContext, {
			start : function(e){
				self.selectedOff(activeElement.touchNodeEl);
				activeElement.touchNodeEl = $(e.target);
				self.selectedOn(activeElement.touchNodeEl);
			},
			move : function(e){
				self.selectedOff(activeElement.touchNodeEl);
			},
			end : function(e){
				activeElement.selectData.node = activeElement.touchNodeEl.data('object');
				activeElement.doNodeSelect();
			}
		});
		
	}
 
	/**
	 * 加载主节点
	 */
	ActionView.prototype.loadRoot = function(){
		var self = this;
		var activeElement = this.activeElement;
		if(activeElement.loaded && activeElement.doLoad){
			var timeoutId = setTimeout(function() {
				activeElement.doLoad();
				clearTimeout(timeoutId);
			}, 250);
		}
	}
	
	/**
	 * 加载子节点
	 */
	ActionView.prototype.loadNode = function(){
		console.log('ActionView.prototype.loadNode');
		var self = this;
		var activeElement = this.activeElement;
		var rootData = activeElement.selectData.root;
		console.log(rootData.dataType);
		if(rootData.dataType === ViewData.form.Remote){
			self.loadNodeRemoteData();
		}else{
			self.loadNodeLocalData();
		}
	}
	
	/**
	 * 加载远程数据
	 */
	ActionView.prototype.loadNodeRemoteData = function(){
		console.log('ActionView.prototype.loadNodeRemoteData');
		var self = this;
		var activeElement = this.activeElement;
		var apiUrl = self.getNodeUrl();
		$.getJSON(apiUrl, null, function(data) {
			activeElement.nodeStore = data[activeElement.nodeResult];
			self.renderNodeStore();
		}).error(function() {
			console.log('Ajax Request Error!');
		});
	}
	
	/**
	 * 加载本地数据
	 */
	ActionView.prototype.loadNodeLocalData = function(){
		var self = this;
		var activeElement = this.activeElement;
		var apiUrl = self.getNodeUrl();
		activeElement.nodeStore = activeElement.selectData.root[activeElement.nodesField];
		self.renderNodeStore();
	}
	
	
	/**
	 * 数据类型设置
	 */
	ActionView.prototype.setRecordDataType = function(store, dataType, actionElement){
		var self = this;
		if(store){
			store.forEach(function(record, i) {
				if(self.isAlphabetModelType(actionElement.type)){
					var data = record.data;
					if(data){
						data.forEach(function(dataItem, i) {
							dataItem.dataType = dataType;
						});
					}
				}else{
					record.dataType = dataType;
				}
			});
		}
	}
 
	/**
	 * 远程加载
	 */
	ActionView.prototype.injectionRemoteLoader = function(actionElement){
		var self = this;
		actionElement.doLoad = function(){
			var _this = this;
			var apiUrl = self.getRootUrl();
			self.setRootDisplayField();
			$.getJSON(apiUrl, null, function(data) {
				_this.rootStore = data[_this.rootResult];
				self.setRecordDataType(_this.rootStore, ViewData.form.Remote, actionElement);
				self.renderRootStore();
				_this.loaded = false;
			}).error(function() {
				console.log('Ajax Request Error!');
			});
		}
	}
	
	
	/**
	 * 本地加载
	 */
	ActionView.prototype.injectionLocalLoader = function(actionElement){
		var self = this;
		actionElement.doLoad = function(){
			var _this = this;
			self.setRootDisplayField();
			_this.rootStore = _this.store;
			self.setRecordDataType(_this.rootStore, ViewData.form.Local, actionElement);
			self.renderRootStore();
			_this.loaded = false;
		}
	}
	
	/**
	 * 混合加载
	 */
	ActionView.prototype.injectionComposeLoader = function(actionElement){
		var self = this;
		actionElement.doLoad = function(){
			var _this = this;
			self.setRootDisplayField();
			_this.rootStore = _this.store;
			self.setRecordDataType(_this.rootStore, ViewData.form.Local, actionElement);
			var apiUrl = self.getRootUrl();
			$.getJSON(apiUrl, null, function(data) {
				var store = data[_this.rootResult];
				store.forEach(function(record, i) {
					record.dataType = ViewData.form.Remote;
					_this.rootStore.push(record);
				});
				self.renderRootStore();
				_this.loaded = false;
			}).error(function() {
				console.log('Ajax Request Error!');
			});
		}
	}
 
	/**
	 * 检查网格数量
	 */
	ActionView.prototype.checkMeshSize = function(){
		return (this.meshSize > this.maxMeshSize);
	}
	
	/**
	 * 计算网格平均值
	 */
	ActionView.prototype.averageMeshSize = function(){
		this.defaultDigit = 0;
	}
	
	/**
	 * 按标题长度转化成网格大小
	 */
	ActionView.prototype.convertFontLengthToMeshSize = function(){
		var actionLength = this.actions.length;
	}
	
	/**
	 * 定义网格
	 * @param digit
	 */
	ActionView.prototype.defineMeshClass = function(digit){
		switch(digit){
			case 1 :  return 'am-u-sm-1';
			case 2 :  return 'am-u-sm-2';
			case 3 :  return 'am-u-sm-3';
			case 4 :  return 'am-u-sm-4';
			case 5 :  return 'am-u-sm-5';
			case 6 :  return 'am-u-sm-6';
			case 7 :  return 'am-u-sm-7';
			case 8 :  return 'am-u-sm-8';
			case 9 :  return 'am-u-sm-9';
			case 10 : return 'am-u-sm-10';
			case 11 : return 'am-u-sm-11';
			case 12 : return 'am-u-sm-12';
			default : return 'am-u-sm-12';
		}
	}
	
	/**
	 * 
	 */
	var Model = Backbone.Model.extend({
		idAttribute: '',
		defaults : {}
	});
 
	return View.extend({
		
		id: '',
		
		model: new Model,
		
		attrs: {
			parentNode : null
		},
		
		events: {},
		
		setup: function() {
			var self = this;
			var actionView = new ActionView();
			actionView.initConfiguration(self);
			self.setAttr('actionView', actionView);
		},
		
		setActive : function(id){
			var actionView = this.getAttr('actionView');
			var el = actionView.getActionElement(id);
			if(el.render){
				el.render();
			}
		}
		
	});
}));
 