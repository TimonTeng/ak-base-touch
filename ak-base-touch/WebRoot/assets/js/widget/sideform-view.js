/**
 * SideForm View Class
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
					Sidebar  = require('sidebar'),
					Template = require('template');
					
				return factory($, _, Backbone, View, Template, Sidebar);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $        = require('jquery'),
				    _        = require('lodash'),
					Backbone = require('backbone'),
					View     = require('backbone.view'),
					Sidebar  = require('sidebar'),
					Template = require('template');
				
				return factory($, _, Backbone, View, Template, Sidebar);
			});
		}
		
	} else {

		root.scrollView = factory(root.scrollView);
	}
	
}(this, function($, _, Backbone, View, Template, Sidebar) {
	'use strict'
	
	function SideFormView() {
		this.touchTargetId = this.view =this.sideView = this.view =  this.data = this.title = null;
		this.$touchEl = this.$context = null;
	}
	
	/**
	 * 初始化视图配置
	 */
	SideFormView.prototype.initConfiguration = function(view){
		this.view = view;
		this.title   	   = view.getAttr('title') || null;
		this.data    	   = view.getAttr('data') || [];
		this.touchTargetId = view.getAttr('touchTargetId') || null;
		
		this.initFormView();
	}
	
	/**
	 * 公共触摸事件
	 * 
	 */
	SideFormView.prototype.touchEvent = function(origin, range, touch){
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
	 */
	SideFormView.prototype.initFormView = function(){
		this.createSiderView();
	}
	
	/**
	 * 创建侧边栏
	 */
	SideFormView.prototype.createSiderView = function(){
		var self = this;
		this.sideView = new Sidebar({
	 		title : self.title,
	 		returnIcon : 'icon_return',
	 		style : {
	 			zIndex : 3129
	 		},
	 		submit : function(){
	 			 
	 		} 
		});
		
		var $sidebar = this.sideView.getAttr('sidebar');
		
		this.$context = $sidebar.$context;
	}
	
	/**
	 * 创建列头
	 */
	SideFormView.prototype.createGridHeader = function(){
		
	}
	
	/**
	 * 创建数据内容
	 */
	SideFormView.prototype.createGridColumnContext = function(){
		
	}
	
	/**
	 * 
	 */
	SideFormView.prototype.onload = function(){
		
	}
	
	/**
	 * 加载静态数据
	 */
	SideFormView.prototype.onloadData = function(){
		
	}
	
	/**
	 * 打开侧边栏
	 */
	SideFormView.prototype.open = function(){
		this.sideView.open();
	}
	
	/**
	 * 打开新的表单
	 */
	SideFormView.prototype.openNewForm = function(){
		
	}
	

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
		
		events: {
			
		},
		
		open : function(closeTarget) {
			var sideFormView = this.getAttr('sideFormView');
			sideFormView.open();
		},
		
		openNewForm : function(){
			var sideFormView = this.getAttr('sideFormView');
			sideFormView.open();
		},
		
		onload : function(){
			
		},
 
		setup: function() {
			
			var self = this;
			var sideFormView = new SideFormView();
			sideFormView.initConfiguration(self);
			self.setAttr('sideFormView', sideFormView);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		}
		
	});
}));
 