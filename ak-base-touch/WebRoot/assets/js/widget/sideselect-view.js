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

				var $        = require('jquery'),
				    _        = require('lodash'),
					Backbone = require('backbone'),
					View     = require('backbone.view'),
					Template = require('template'),
					Sidebar  = require('sidebar');
					
				return factory($, _, Backbone, View, Template, Sidebar);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $        = require('jquery'),
				    _        = require('lodash'),
					Backbone = require('backbone'),
					View     = require('backbone.view'),
					Template = require('template'),
					Sidebar  = require('sidebar');
				
				return factory($, _, Backbone, View, Template, Sidebar);
			});
		}
		
	} else {

		root.scrollView = factory(root.scrollView);
	}
	
}(this, function($, _, Backbone, View, Template, Sidebar) {
	'use strict'

	var Model = Backbone.Model.extend({
		idAttribute: '',
		defaults : {}
	});
	
	var TYPE = {
		single : 'single',
	    multiple : 'multiple',
	    date : 'date',
		grid : 'grid'
	};
	
	function SideSelectConfig(config, sideSelectView){
		this.config = config;
		this.sideSelectView = sideSelectView;
		this.sideView   = null;
		this.dataFormat = null;
		this.title    = this.type = this.data = this.result = this.apiUrl = this.touchTargetId = this.displayField = null;
		this.pattern  = null;
		this.isLoadOnce = true; 
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
	}
	
	/**
	 * TODO
	 */
	SideSelectConfig.prototype.defineDataType = function(){
		switch(this.type){
			case TYPE.single   : return {};
			case TYPE.multiple : return {};
			case TYPE.date     : return {};
			case TYPE.grid 	   : return {};
			default :  return null;
		}
	}
	
	/**
	 * TODO
	 * @param data
	 */
	SideSelectConfig.prototype.setSelectData = function(data){
		this.selectData = data;
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
	 * 校验 日期组件
	 * TODO
	 */
	SideSelectConfig.prototype.dateConfigVerify = function(){
		this.checkTouchTargetId();
	}
	
	/**
	 * 校验 网格列表组件
	 * TODO
	 */
	SideSelectConfig.prototype.gridConfigVerify = function(){
		this.checkTouchTargetId();
	}
	
	/**
	 * TODO
	 */
	SideSelectConfig.prototype.configVerify = function(){
		switch(this.type){
			case TYPE.single   : this.singleConfigVerify(); break;
			case TYPE.multiple : this.multipleConfigVerify(); break;
			case TYPE.date     : this.dateConfigVerify(); break;
			case TYPE.grid     : this.gridConfigVerify(); break;
			default : throw new Error('未指定 config.type 参数值'); break;
		}
	}
	
	/**
	 * 初始化侧边栏视图
	 */
	SideSelectConfig.prototype.initSideView = function(){
		var self = this;
        this.touchEvent(self.$touchEl, null, {
        	
        	start : function(e){
        	},
        	
        	move : function(e){
        	},
        	
        	end : function(e){
        		
        		self.sideView = self.sideView || self.createSideView();
        		/**
        		 * TODO
        		 * 1. 不是二级关联的组件只加载一次数据；
        		 * 2. 绑定从业务场景初始化的参数
        		 * 3. 侧边栏展示 ？ 同步 : 异步， 当前是异步
        		 */
        		var loadFunction = self.assemblyLoadModel();
        		if(loadFunction instanceof Function){
        			loadFunction(self);
        		}
        		self.sideView.open();
        	}
        });
 
	}
	
	/**
	 * 视图初始化时使用selectData 变量赋值
	 * TODO
	 */
	SideSelectConfig.prototype.initSelectedData = function(store){
		if(!this.isJoin()){
			return;
		}
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
	 * 初始化参数
	 * @param data
	 */
	SideSelectConfig.prototype.convertDataToSelectData = function(data){
		
		if(data instanceof Object){
			if(('id' in data) === false){
				throw new Error('参数未指定 id 字段');
			}
			this.selectData[data['id']] = data;
			return;
		}
		
		if(data instanceof Array){
			this.selectData = {};
			for(var i in data){
				if(('id' in data[i]) === false){
					throw new Error('参数未指定 id 字段');
				}
				this.selectData[data[i]['id']] = data[i];
			}
			return;
		}
	}
	
	/**
	 * 初始化赋值
	 * @param data
	 */
	SideSelectConfig.prototype.setData = function(data){
		 this.convertDataToSelectData(data);
	}
	
	
	/**
	 * 构造侧边栏
	 */
	SideSelectConfig.prototype.createSideView = function(){
		switch(this.type){
			case TYPE.single   : return this.createSingleSiderBar();
			case TYPE.multiple : return this.createMultipleSiderBar();
			case TYPE.date     : return null;
			case TYPE.grid     : return null;
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
	SideSelectConfig.prototype.assemblyLoadModel = function(){
		if(this.isJoin()){
			return this.onloadEach;
		}
		if(this.isLoadOnce){
			return this.onloadOnce;
		}
		return null;
	}
	
	/**
	 * 只加载一次
	 */
	SideSelectConfig.prototype.onloadOnce = function(config){
		if(config.isLoadOnce){
			config.onLoad();
			var intervalId = setInterval(function() {
				config.isLoadOnce = false;
				clearInterval(intervalId);
			}, 500);
		}
	}
	
	/**
	 * 每次重新加载
	 */
	SideSelectConfig.prototype.onloadEach = function(config){
		config.onLoad();
	}
	
	
	/**
	 * 加载
	 */
	SideSelectConfig.prototype.onLoad = function(){
		var self = this;
		var apiUrl = this.apiUrl;
		if(this.isJoin()){
			apiUrl = this.formatApiUrl();
		}
		$.getJSON(apiUrl, null, function(data) {
			var store  = data[self.result];
			self.loadAfterRender(store);
			self.initSelectedData(store);
		}).error(function() {
			console.log('Ajax Request Error!');
		});
	}
	
	/**
	 * 格式化 API URL
	 */
	SideSelectConfig.prototype.formatApiUrl = function() {
		
		var parentConfig = this.sideSelectView.getSideSelectConfig(this.join);
		var selectData = parentConfig.selectData;
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
	SideSelectConfig.prototype.isOnloadOnce = function(){
		var self = this;
		var intervalId = setInterval(function() {
			self.isLoadOnce = false;
			clearInterval(intervalId);
		}, 1000);
		return this.isLoadOnce;
	}
	
	
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
		$(origin, guess).bind('touchstart', function(e){
			touchStat = true;
			touch.start(e);
		});
		$(origin, guess).bind('touchmove', function(e){
			touchStat = false;
			touch.move(e);
		});
		$(origin, guess).bind('touchend', function(e){
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
	SideSelectConfig.prototype.loadAfterRender = function(store){
		switch(this.type){
			case TYPE.single   : this.renderOnSingle(store); break;
			case TYPE.multiple : this.renderOnMultiple(store); break;
			case TYPE.date     : break;
			case TYPE.grid     : break;
			default :  break;
		}
	}
	
	/**
	 * 渲染单选侧边栏
	 */
	SideSelectConfig.prototype.renderOnSingle = function(store){
		var self = this;
		var html = this.createSelectDataContext(store);
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
	SideSelectConfig.prototype.renderOnMultiple = function(store){
		var self = this;
		var html = this.createSelectDataContext(store);
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
		var $sidebar = this.sideView.getAttr('sidebar')
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
		 this.$main = null;
		 this.Sidebar = Sidebar;
	}
	
	
	/**
	 * 初始组件构造参数
	 */
	SideSelectView.prototype.initConfiguration = function(view){
		this.view 		= view;
		this.parentNode = view.getAttr('parentNode');
		this.configs = view.getAttr('configs');
		this.$main = $(this.parentNode);
		this.initSideSelectConfigs();
	}
	
	/**
	 * 
	 */
	SideSelectView.prototype.initSideSelectConfigs = function(){
		for (var i = 0; i < this.configs.length; i++) {
			var sideSelectConfig = new SideSelectConfig(this.configs[i], this);
			sideSelectConfig.configVerify();
			this.setSideSelectConfig(sideSelectConfig);
			this.initSideSelectConfigOnSelectEvent(sideSelectConfig);
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
	 * 设置参数
	 */
	SideSelectView.prototype.setData = function(touchTargetId, data){
		var sideSelectConfig = this.getSideSelectConfig(touchTargetId);
		sideSelectConfig.setData(data);
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
 