/**
 * SideSelect View Class
 * @Require: jQuery
 * @Extend:
 */
!(function(root, factory) {
	'use strict'
  
	if ('function' === typeof define) {
		
		if (define.amd) {
		
			define(function(require) {

				var $        	 = require('jquery'),
				    _        	 = require('lodash'),
					Backbone 	 = require('backbone'),
					View     	 = require('backbone.view'),
					Template 	 = require('template'),
					Sidebar  	 = require('sidebar'),
					SideGridView = require('sideGridView');
					
				return factory($, _, Backbone, View, Template, Sidebar, SideGridView);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $        	 = require('jquery'),
				    _        	 = require('lodash'),
					Backbone 	 = require('backbone'),
					View     	 = require('backbone.view'),
					Template 	 = require('template'),
					Sidebar  	 = require('sidebar'),
					SideGridView = require('sideGridView');
				
				return factory($, _, Backbone, View, Template, Sidebar, SideGridView);
			});
		}
		
	} else {

		root.scrollView = factory(root.scrollView);
	}
	
}(this, function($, _, Backbone, View, Template, Sidebar, SideGridView) {
	'use strict'

	var Model = Backbone.Model.extend({
		idAttribute: '',
		defaults : {}
	});
	
	var TYPE = {
		single : 'single',
	    multiple : 'multiple',
	    date : 'date'
	};
	
	function SideSelectConfig(config, sideSelectView){
		this.config = config;
		this.sideSelectView = sideSelectView;
		this.sideView   = null;
		this.dataFormat = null;
		this.title    = this.type = this.data = this.result = this.apiUrl = this.touchTargetId = this.displayField = null;
		this.loadOnce     = true;  // true:只加载1次, false:每次打开界面重新加载
		this.loadComplate = false; // 经加载完成状态
		this.loadComplateCallBack = null; //加载完成回调方法
		this.renderText   = null;
		this.touchDisplay = null; //触摸展示接口
		this.join     = this.joinPropertys = null;
		this.$touchEl = null;
		this.initConfig();
	}
	
	/**
	 * TODO
	 */
	SideSelectConfig.prototype.initConfig = function(){
		this.title 	        = this.config.title || '';
		this.type 		    = this.config.type || TYPE.sigle;
		this.selectData 	= this.defineDataType();
		this.result 	    = this.config.result || 'form';
		this.apiUrl 	    = this.config.apiUrl || undefined;
		this.touchTargetId  = this.config.touchTargetId || undefined;
		this.displayField   = this.config.displayField || undefined;
		this.join           = this.config.join || undefined;
		this.joinPropertys  = this.config.joinPropertys || undefined;
		this.loadOnce       = ('loadOnce' in this.config) ? this.config.loadOnce : this.loadOnce;
		this.renderText     = this.config.renderText || undefined;
	}
	
	/**
	 * TODO
	 */
	SideSelectConfig.prototype.defineDataType = function(){
		switch(this.type){
			case TYPE.single   : return {};
			case TYPE.multiple : return {};
			default :  return null;
		}
	}
 
	
	/**
	 * TODO
	 * @param key
	 * @param value
	 */
	SideSelectConfig.prototype.putSelectData = function(key, value){
		this.selectData[key] = value;
	}
	
	/**
	 * TODO
	 * @param key
	 */
	SideSelectConfig.prototype.delSelectData = function(key){
		delete this.selectData[key];
	}
	
	/**
	 * TODO
	 */
	SideSelectConfig.prototype.checkTouchTargetId = function(){
		var $touchEl = this.$touchEl = $('#'+this.touchTargetId);
		if($touchEl.length === 0){
			throw new Error('找不到指定 '+this.touchTargetId+' id element');
		}
	}
	
	/**
	 * 校验 侧边栏单选组件参数
	 */
	SideSelectConfig.prototype.singleConfigVerify = function(){
		this.checkTouchTargetId();
		this.dataFormat = this.selectDataToObject;
	}
	
	/**
	 * 校验 侧边栏多选组件参数
	 * TODO
	 */
	SideSelectConfig.prototype.multipleConfigVerify = function(){
		this.checkTouchTargetId();
		this.dataFormat = this.selectDataToArray;
	}
 
	
	/**
	 * TODO
	 */
	SideSelectConfig.prototype.configVerify = function(){
		switch(this.type){
			case TYPE.single   : this.singleConfigVerify(); break;
			case TYPE.multiple : this.multipleConfigVerify(); break;
			default : throw new Error('未指定 config.type 参数值'); break;
		}
	}
	
	/**
	 * 初始化侧边栏视图
	 */
	SideSelectConfig.prototype.initSideView = function(){
		
		var self = this;
		
		self.touchDisplay = self.sideSelectView.createTouchDisplayLoadPolicy(this);
		
		if(self.touchDisplay == null){
			throw new Error('SideSelectConfig  createTouchDisplayLoadPolicy, 创建展示选项卡加载数据接口失败');
		}
		
        this.touchEvent(self.$touchEl, null, {
        	
        	start : function(e){
        	},
        	
        	move : function(e){
        	},
        	
        	end : function(e){
        		
        		self.sideView = self.sideView || self.createSideView();
        		self.touchDisplay(self);
        		
//        		/**
//        		 * TODO
//        		 * 1. 不是二级关联的组件只加载一次数据；
//        		 * 2. 绑定从业务场景初始化的数据
//        		 * 3. 侧边栏展示 ？ 同步 : 异步； 当前是异步
//        		 */
//        		var loadFunction = self.assemblyLoadModel();
//        		if(loadFunction instanceof Function){
//        			loadFunction(self);
//        		}
//        		self.sideView.open();
        	}
        });
 
	}
	
	/**
	 * 重新绑定触摸事件
	 */
	SideSelectConfig.prototype.repeatBindTouchEvent = function(){
		var self     = this;
		self.checkTouchTargetId();
		self.touchEvent(self.$touchEl, null, {
        	
        	start : function(e){
        	},
        	
        	move : function(e){
        	},
        	
        	end : function(e){
        		self.touchDisplay(self);
        	}
        });
	}
	
	/**
	 * 视图初始化时使用selectData 变量赋值
	 * TODO
	 */
//	SideSelectConfig.prototype.initSelectedData = function(store){
//		if(!this.isJoin()){
//			return;
//		}
//		this.setSelectedValue();
//	}
	
	/**
	 * 设置选中的值
	 */
	SideSelectConfig.prototype.setSelectedValue = function(){
		var self = this;
		var $sidebar = this.sideView.getAttr('sidebar');
		for(var f in this.selectData){
			var target = $('li[data-key='+f+']', $sidebar.$context);
			target = target.get(0) || null;
			if(target){
				this.selectedOn(target);
			}
		}
	}
	
	
	/**
	 * 加载父元素选中第一个参数
	 */
	SideSelectConfig.prototype.getParentFirstSelectData = function(){
		var parentConfig = this.sideSelectView.getSideSelectConfig(this.join);
		var selectData = parentConfig.selectData;
		var firstData = null;
		for(var index in selectData){
			firstData = selectData[index];
			break;
		}
		return firstData;
	}
	
	/**
	 * 初始化参数
	 * @param data
	 */
	SideSelectConfig.prototype.convertDataToSelectData = function(data){
		
		var self = this;
		if(data instanceof Object){
			if(('id' in data) === false){
				throw new Error('参数未指定 id 字段');
			}
			this.selectData[data['id']] = data;
			return;
		}
		
		if(data instanceof Array){
			this.selectData = {};
			data.forEach(function(item, i) {
				if(('id' in item) === false){
					throw new Error('参数未指定 id 字段');
				}
				self.selectData[item['id']] = item;
			});
			return;
		}
	}
	
	/**
	 * 初始化赋值
	 * @param data
	 */
	SideSelectConfig.prototype.setSelectOptionData = function(data){
		 this.convertDataToSelectData(data);
		 if(this.isJoin() && (this.data == null || this.data.length == 0)){
			 alert('编辑模式  初始化 加载');
			 var parentSelectData = this.getParentFirstSelectData();
			 var apiUrl = this.formatApiUrlByObject(parentSelectData);
			 this.sideSelectView.onloadRemoteData(apiUrl, this);
		 }
	}
	
	/**
	 * 构造侧边栏
	 */
	SideSelectConfig.prototype.createSideView = function(){
		switch(this.type){
			case TYPE.single   : return this.createSingleSiderBar();
			case TYPE.multiple : return this.createMultipleSiderBar();
			default : return null;
		}
	}
	
	/**
	 * 单选视图
	 */
	SideSelectConfig.prototype.createSingleSiderBar = function(){
		var self = this;
		var siderView = new this.sideSelectView.Sidebar({
			id : self.touchTargetId,
	 		title : self.title,
	 		returnIcon : 'icon_return',
	 		style : {
	 			zIndex : 3999
	 		},
	 		submit : function(){
	 			self.onSelect();
	 		} 
		});
		return siderView;
	}
	
	/**
	 * 多选视图
	 * @returns
	 */
	SideSelectConfig.prototype.createMultipleSiderBar = function(){
		var self = this;
		var siderView = new this.sideSelectView.Sidebar({
			id : self.touchTargetId,
	 		title : self.title,
	 		returnIcon : 'icon_return',
	 		style : {
	 			zIndex : 3999
	 		},
	 		submit : function(){
	 			self.onSelect();
	 		} 
		});
		return siderView;
	}
 
	/**
	 * 选中回调
	 */
	SideSelectConfig.prototype.onSelect = function(){
		if(this.config.onSelect){
			this.config.onSelect(this.dataFormat());
		}
	}
	
	/**
	 * 装配加载模型
	 */
//	SideSelectConfig.prototype.assemblyLoadModel = function(){
//		switch(this.type){
//			case TYPE.single   : return this.LoadModel();
//			case TYPE.multiple : return this.LoadModel();
//			case TYPE.date     : return null;
//			default : return null;
//		}
//		return null;
//	}
	
	/**
	 * 数据加载模型
	 * @returns
	 */
//	SideSelectConfig.prototype.LoadModel = function(){
//		if (this.isJoin()) {
//			return this.onloadEach;
//		}
//		if (this.isLoadOnce) {
//			return this.onloadOnce;
//		}
//	}
	
	/**
	 * 只加载一次
	 */
//	SideSelectConfig.prototype.onloadOnce = function(config){
//		if(config.isLoadOnce){
//			config.onLoad();
//			var intervalId = setInterval(function() {
//				config.isLoadOnce = false;
//				clearInterval(intervalId);
//			}, 500);
//		}
//	}
	
	/**
	 * 每次重新加载
	 */
//	SideSelectConfig.prototype.onloadEach = function(config){
//		config.onLoad();
//	}
	
	/**
	 * 加载
	 */
//	SideSelectConfig.prototype.onLoad = function(){
//		var self = this;
//		var apiUrl = this.apiUrl;
//		if(this.isJoin()){
//			apiUrl = this.formatApiUrl();
//		}
//		$.getJSON(apiUrl, null, function(data) {
//			var store  = data[self.result];
//			self.loadAfterRender(store);
//			self.initSelectedData(store);
//		}).error(function() {
//			console.log('Ajax Request Error!');
//		});
//	}
	
	/**
	 * 格式化 API URL
	 */
	SideSelectConfig.prototype.formatApiUrl = function() {
		if(!this.isJoin()){
			return this.apiUrl;
		}
		var parentConfig = this.sideSelectView.getSideSelectConfig(this.join);
		var selectData = parentConfig.selectData;
        return this.formatApiUrlByObject(selectData);
	}
	
	/**
	 * 格式化 API URL
	 */
	SideSelectConfig.prototype.formatApiUrlByObject = function(selectData) {
		var queries = [];
		for (var key in this.joinPropertys) {
			if (this.joinPropertys[key]) {
				queries.push('&'+this.joinPropertys[key] + '=' + selectData[key]);
			}
		}
		return this.apiUrl + '?' + queries.join('&');
	}
	
	/**
	 * 是否存在级联条件
	 */
	SideSelectConfig.prototype.isJoin = function(){
		var parentConfig = this.sideSelectView.getSideSelectConfig(this.join);
		if(parentConfig){
			return true;
		}
		return false;
	}
	
	/**
	 * 只加载一次
	 */
//	SideSelectConfig.prototype.isOnloadOnce = function(){
//		var self = this;
//		var intervalId = setInterval(function() {
//			self.isLoadOnce = false;
//			clearInterval(intervalId);
//		}, 1000);
//		return this.isLoadOnce;
//	}
	
	
	/**
	 * 添加滚动事件
	 * @param scrollParentNode
	 */
	SideSelectConfig.prototype.addScroll = function(scrollParentNode){
		new $.AMUI.iScroll(scrollParentNode, {
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
	}
	
	/**
	 * 选中的数据转为Object
	 */
	SideSelectConfig.prototype.selectDataToObject = function(){
		var data = {};
		for (var f in this.selectData) {
			data = this.selectData[f];
			break;
		}
		return data;
	}
	
	/**
	 *  选中的数据转为Array
	 */
	SideSelectConfig.prototype.selectDataToArray = function(){
		var data = new Array();
		for (var f in this.selectData) {
			data.push(this.selectData[f]);
		}
		return data;
	}
	
	/**
	 * 公共触摸事件
	 * 
	 */
	SideSelectConfig.prototype.touchEvent = function(origin, range, touch){
		var guess = range || document.body;
		var touchStat = false;
		$(origin, guess).unbind('touchstart').bind('touchstart', function(e){
			touchStat = true;
			touch.start(e);
		});
		$(origin, guess).unbind('touchmove').bind('touchmove', function(e){
			touchStat = false;
			touch.move(e);
		});
		$(origin, guess).unbind('touchend').bind('touchend', function(e){
			if(touchStat){
				touch.end(e);
			}
		});
	}
	
	
	/**
	 * 
	 * @param store
	 * @returns
	 */
	SideSelectConfig.prototype.createSelectDataContext = function(store){
		var self = this;
		var context = $("<div>", {'id' : 'warp_root', 'class' : 'warp_mark'});
		var wrapUl  = $("<ul>", {'id' : 'warp_ul_root', 'class' : 'warp_context'});
		wrapUl.appendTo(context);
		store.forEach(function(storeElement, index) {
			var node = $("<li>", {'data-object' : JSON.stringify(storeElement), 'data-key' : storeElement['id']});
			node.text(storeElement[self.displayField]);
			node.appendTo(wrapUl);
		});
        return context;
	}
	
	
	/**
	 * 数据加载后渲染
	 */
	SideSelectConfig.prototype.loadAfterRender = function(html){
		switch(this.type){
			case TYPE.single   : this.renderOnSingle(html); break;
			case TYPE.multiple : this.renderOnMultiple(html); break;
			default :  break;
		}
	}
	
	/**
	 * 
	 */
	SideSelectConfig.prototype.renderSelectOptionText = function(){
		
		if(this.renderText){
			this.renderText(this.selectData);
		}
	}
	
	/**
	 * 渲染单选侧边栏
	 */
	SideSelectConfig.prototype.renderOnSingle = function(html){
		var self = this;
		this.sideView.html(html);
        this.addScroll('#am-plugin-sidebar-context-'+this.touchTargetId);
        this.touchEvent('li', html, {
        	start : function(e){
        		self.selectedAllOff();
        		self.selectedOn(e.target);
        	},
	       	move : function(e){
	       		self.selectedOff(e.target);
	       	},
	       	end : function(e){
	       	}
        });
        
	}
	
	/**
	 *  渲染多选侧边栏
	 */
	SideSelectConfig.prototype.renderOnMultiple = function(html){
		var self = this;
		this.sideView.html(html);
        this.addScroll('#am-plugin-sidebar-context-'+this.touchTargetId);
        this.touchEvent('li', html, {
        	start : function(e){
        		var selected = e.target.getAttribute('selected');
        		(!selected) ? self.selectedOn(e.target) : self.selectedOff(e.target);
        	},
        	move : function(e){
        		self.selectedOff(e.target);
        	},
        	end : function(e){
        	}
        });
	}
	
	/**
	 * 全部取消
	 */
	SideSelectConfig.prototype.selectedAllOff = function(){
		var $sidebar = this.sideView.getAttr('sidebar');
		$('[selected]', $sidebar.$context).css('backgroundColor', '#fff');
		this.selectData = {};
	}
	
	/**
	 * 取消选择
	 */
	SideSelectConfig.prototype.selectedOff = function(target){
		var data = $(target).data('object');
		target.style.backgroundColor = '#fff';
		target.removeAttribute('selected');
		this.delSelectData(data['id']);
	}
	
	/**
	 * 选中
	 */
	SideSelectConfig.prototype.selectedOn = function(target){
		var data = $(target).data('object');
		target.style.backgroundColor = '#ececec';
		target.setAttribute('selected', true);
		this.putSelectData(data['id'], data);
	}
	
	/**
	 * 
	 */
	function SideSelectView(){
		 this.parentNode = this.configs = this.view = null;
		 this.sideSelectConfigs = {};
		 this.Sidebar = Sidebar;
		 this.initial = true;
		 this.$main   = null;
	}
	
	/**
	 * 判断加载条件
	 */
	SideSelectView.prototype.loadConfiguration = function(config){
		
		var configuration = {
			apiUrl : config.apiUrl,
			flag : true
		};
		
		if(!config.isJoin()){ 
			//非级联选项
			return configuration;
		}
		
		var selectData = JSON.stringify(config.selectData);
		//级联条件
		if(selectData === '{}'){ //级联选项未选中参数
			$.extend(configuration, {flag : false});
		}else{
			$.extend(configuration, {flag : config.formatApiUrl()});
		}
		return configuration;
	}
	
	
	/**
	 * 远程数据加载
	 * 只存储JSON
	 */
	SideSelectView.prototype.onload = function(config){
		var configuration = this.loadConfiguration(config);
		console.log(configuration.apiUrl +': load = '+ configuration.flag);
		if(configuration.flag){
			this.onloadRemoteData(configuration.apiUrl, config);
		}
	}
	
	/**
	 * TODO
	 * @param apiUrl
	 * @param config
	 */
	SideSelectView.prototype.onloadRemoteData = function(apiUrl, config){
		$.getJSON(apiUrl, null, function(data) {
			config.data = data[config.result];
			config.loadComplate = true;
			if(config.loadComplateCallBack){
				config.loadComplateCallBack();
			}
		}).error(function() {
			console.log('Ajax Request Error!');
		});
	}
	
	/**
	 * 渲染选项
	 */
	SideSelectView.prototype.renderSelectOptionDom = function(config){
		var $context = $("<div>", {'id' : 'warp_root', 'class' : 'warp_mark'});
		var $wrapUl  = $("<ul>", {'id' : 'warp_ul_root', 'class' : 'warp_context'});
		$wrapUl.appendTo($context);
		config.data.forEach(function(item, index) {
			var $option = $("<li>", {'data-object' : JSON.stringify(item), 'data-key' : item['id']});
			$option.text(item[config.displayField]);
			$option.appendTo($wrapUl);
		});
        return $context;
	}
	
	/**
	 * 初始组件构造参数
	 */
	SideSelectView.prototype.initConfiguration = function(view){
		this.view 		= view;
		this.parentNode = view.getAttr('parentNode');
		this.configs    = view.getAttr('configs');
		this.initial    = this.convertBool(view.getAttr('initial')) || this.initial;
		this.$main = $(this.parentNode);
		this.init = false;
		
		if(this.initial == true){
			this.initSideSelectConfigs();
		}
	}
	
	/**
	 * 找到触摸元素重新定位触摸事件
	 */
	SideSelectView.prototype.repeatBindTouchEvent = function(){
		for(var f in this.sideSelectConfigs){
			this.sideSelectConfigs[f].repeatBindTouchEvent();
		}
	}
	
	/**
	 * 
	 * @param op
	 * @returns
	 */
	SideSelectView.prototype.convertBool = function(op){
		switch(op){
			case 'false' : return new Boolean(false);
			case 'true'  : return new Boolean(true);
 		}
		return undefined;
	}
	
	/**
	 * 判断策略类型
	 */
	SideSelectView.prototype.analyzingPolicy = function(config){
		var op = 'a';
		if(config.loadOnce == true){
			op = 'a'; //非级联 单次加载远程
		}else{
			op = 'b'; //非级联 每次远程加载数据
		}
		
		if(config.isJoin()){//级联选项卡
			op = 'c';
		}
		switch(op){
			case 'a' : return 'a';
			case 'b' : return 'b';
			case 'c' : return 'c';
		}
		return null;
	}
	
	/**
	 * 加载策略
	 */
	SideSelectView.prototype.createTouchDisplayLoadPolicy = function(config){
		
		var self = this;
		
		/**
		 * 只加载一次
		 */
		var onloadOnceTouchDisplay = function(config){
			var html = config.sideSelectView.renderSelectOptionDom(config);
			config.loadAfterRender(html)
			config.setSelectedValue();
			config.sideView.open();
		}
		
		/**
		 * 每次加载
		 */
		var onloadEachTouchDisplay = function(config){
			//console.log('onloadEachTouchDisplay');
			config.loadComplateCallBack = function(){
				var html = config.sideSelectView.renderSelectOptionDom(config);
				config.loadAfterRender(html)
				config.setSelectedValue();
				config.sideView.open();
			}
			
			var apiUrl = config.formatApiUrl();
			config.sideSelectView.onloadRemoteData(apiUrl, config);
		}
		
		/**
		 * 级联加载
		 */
		var onloadCascadeTouchDisplay = function(){
			config.loadComplateCallBack = function(){
				var html = config.sideSelectView.renderSelectOptionDom(config);
				config.loadAfterRender(html)
				config.setSelectedValue();
				config.sideView.open();
			}
			
			var apiUrl = config.formatApiUrl();
			config.sideSelectView.onloadRemoteData(apiUrl, config);
		}
		
		var op = this.analyzingPolicy(config);
		switch(op){
			case 'a' : return onloadOnceTouchDisplay;
			case 'b' : return onloadEachTouchDisplay;
			case 'c' : return onloadCascadeTouchDisplay;
			default : return null;
		}
	}
	
	/**
	 * 初始化配置
	 */
	SideSelectView.prototype.initSideSelectConfigs = function(){
		
		if(this.init === true){
			this.repeatBindTouchEvent();
			return;
		}
		
		for (var i = 0; i < this.configs.length; i++) {
			var sideSelectConfig = new SideSelectConfig(this.configs[i], this);
			sideSelectConfig.configVerify();
			this.setSideSelectConfig(sideSelectConfig);
			this.onload(sideSelectConfig);
			this.initSideSelectConfigOnSelectEvent(sideSelectConfig);
			this.init = true;
		}
	}
	
	/**
	 * 
	 */
	SideSelectView.prototype.initSideSelectConfigOnSelectEvent = function(sideSelectConfig){
		sideSelectConfig.initSideView();
	}
	
	/**
	 * 
	 */
	SideSelectView.prototype.getSideSelectConfig = function(touchTargetId){
		return this.sideSelectConfigs[touchTargetId] || null;
	}
	
	/**
	 * 
	 */
	SideSelectView.prototype.setSideSelectConfig = function(sideSelectConfig){
		this.sideSelectConfigs[sideSelectConfig.touchTargetId] = sideSelectConfig;
	}
	
	/**
	 * 设置选中的参数
	 * @param touchTargetId
	 * @param value
	 */
	SideSelectView.prototype.setSelectOptionValue = function(touchTargetId, value){
		var sideSelectConfig = this.getSideSelectConfig(touchTargetId);
		sideSelectConfig.setSelectOptionData(value);
	}
	
	/**
	 * TODO
	 */
	SideSelectView.prototype.initSelectDataText = function(){
		var sideSelectConfigs = this.sideSelectConfigs;
		for(var touchTargetId in sideSelectConfigs){
			var config = sideSelectConfigs[touchTargetId];
			config.renderSelectOptionText();
		}
	}
		
	return View.extend({
		
		id: '',
		
		model: new Model,
		
		attrs: {
			parentNode : null
		},
		
		events: {
			
		},
		
		setData : function(touchTargetId, data){
			var sideSelectView = this.getAttr('sideSelectView');
			sideSelectView.setData(touchTargetId, data);
		},
		
		initSideSelectConfigs : function(){
			var sideSelectView = this.getAttr('sideSelectView');
			sideSelectView.initSideSelectConfigs();
		},
		
		setSelectOptionValue : function(touchTargetId, value){
			var sideSelectView = this.getAttr('sideSelectView');
			sideSelectView.setSelectOptionValue(touchTargetId, value);
		},
 
		initSelectDataText : function(){
			var sideSelectView = this.getAttr('sideSelectView');
			sideSelectView.initSelectDataText();
		},
		
		setup: function() {
			var self = this;
			var sideSelectView = new SideSelectView();
			sideSelectView.initConfiguration(self);
			self.setAttr('sideSelectView', sideSelectView);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		}
		
	});
}));
 