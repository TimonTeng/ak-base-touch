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
		this.sideView = null;
		this.title = this.type = this.data = this.result = this.apiUrl = this.touchTargetId = this.displayField = null;
		this.pattern = null;
		this.join = this.joinPropertys = null;
		this.$touchEl = null;
		this.initConfig();
	}
	
	SideSelectConfig.prototype.initConfig = function(){
		this.title = this.config.title || '';
		this.type = this.config.type || TYPE.sigle;
		this.selectData = {};
		this.result = this.config.result || 'form';
		this.apiUrl = this.config.apiUrl || undefined;
		this.touchTargetId = this.config.touchTargetId || undefined;
		this.displayField = this.config.displayField || undefined;
		this.join = this.config.join || undefined;
		this.joinPropertys =this.config.joinPropertys || undefined;
		
	}
	

	SideSelectConfig.prototype.setSelectData = function(data){
		this.selectData = data;
	}
	
	
	/**
	 * 
	 */
	SideSelectConfig.prototype.checkTouchTargetId = function(){
		var $touchEl = this.$touchEl = $('#'+this.touchTargetId);
		if($touchEl.length === 0){
			throw new Error('找不到指定 '+this.touchTargetId+' id element');
		}
	}
	
	
	/**
	 * 校验
	 */
	SideSelectConfig.prototype.singleConfigVerify = function(){
		this.checkTouchTargetId();
	}
	
	SideSelectConfig.prototype.multipleConfigVerify = function(){
		this.checkTouchTargetId();
	}
	
	SideSelectConfig.prototype.dateConfigVerify = function(){
		this.checkTouchTargetId();
	}
	
	SideSelectConfig.prototype.gridConfigVerify = function(){
		this.checkTouchTargetId();
	}
	
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
	 * 
	 */
	SideSelectConfig.prototype.initSideView = function(){
		
		var self  = this;
		var touch = false;
		
		$(this.$touchEl).bind('touchstart', function(e){
				touch = true;
		});
		
		$(this.$touchEl).bind('touchmove', function(e){
				touch = false;
		});
		
		$(this.$touchEl).bind('touchend', function(e){
			if(touch){
				self.sideView = self.sideView || self.createSideView();
				self.sideView.open();
			}
		});
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
	 * 
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
		this.onLoad();
		return siderView;
	}
	
	SideSelectConfig.prototype.createMultipleSiderBar = function(){
		var self = this;
		return new this.sideSelectView.Sidebar({
		 		title : self.title,
		 		returnIcon : 'icon_return',
		 		style : {
		 			zIndex : 3999
		 		},
		 		submit : function(){
		 			self.onSelect();
		 		} 
		});
	}
	
	
	/**
	 * 
	 */
	SideSelectConfig.prototype.onSelect = function(){
		if(this.config.onSelect){
			this.config.onSelect(this.selectData);
		}
	}
	
	/**
	 * 加载
	 */
	SideSelectConfig.prototype.onLoad = function(){
		var self = this;
		$.getJSON(this.apiUrl, null, function(data) {
			var store  = data[self.result];
			self.loadAfterRender(store);
		}).error(function() {
			console.log('Ajax Request Error!');
		});
	}
	
	
	SideSelectConfig.prototype.addScroll = function(scrollParentNode){
		new $.AMUI.iScroll(scrollParentNode, {
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
	}
	
	
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
	 * 
	 */
	SideSelectConfig.prototype.renderOnSingle = function(store){
		var self = this;
		var wrap   = $("<div>",{ 'id' : 'warp_root', 'class' : 'warp_mark'});
		var wrapUl = $("<ul>",{ 'id' : 'warp_ul_root', 'class' : 'warp_context'});
		wrapUl.appendTo(wrap);
        for (var i = 0; i < store.length; i++) {
        	var storeElement = store[i];
			var node = $("<li>", {'data-object' : JSON.stringify(storeElement), 'data-select' : false});
			node.text(storeElement[self.displayField]);
			node.appendTo(wrapUl);
		}
        this.sideView.html(wrap);
        this.addScroll('#am-plugin-sidebar-context-'+this.touchTargetId);
        
        
        this.touchEvent('li', wrap, {
        	
        	start : function(e){
        		 $('li', wrap).css('backgroundColor', '#fff');
        		 $(e.target).css('backgroundColor', '#ececec');
        	},
        	
        	move : function(e){
        		 $('li', wrap).css('backgroundColor', '#fff');
        	},
        	
        	end : function(e){
        		var data = $(e.target).data('object');
        		self.setSelectData(data);
        	}
        });
        
	}

	
	
	/**
	 * 
	 */
	SideSelectConfig.prototype.renderOnMultiple = function(){
		
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
		
	return View.extend({
		
		id: '',
		
		model: new Model,
		
		attrs: {
			parentNode : null
		},
		
		events: {
			
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
 