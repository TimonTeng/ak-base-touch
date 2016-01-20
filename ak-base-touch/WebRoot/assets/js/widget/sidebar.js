/**
 * Sidebar Class
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
					Template = require('template');
					
				return factory($, _, Backbone, View, Template);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $        = require('jquery'),
				    _        = require('lodash'),
					Backbone = require('backbone'),
					View     = require('backbone.view'),
					Template = require('template');
				
				return factory($, _, Backbone, View, Template);
			});
		}
		
	} else {

		root.scrollView = factory(root.scrollView);
	}
	
}(this, function($, _, Backbone, View, Template) {
	'use strict'
	
	function Sidebar(){
		
		this.id = this.level = this.title = this.returnIcon = null;
		this.$body = this.$header = this.$context = this.$left = this.$right = this.$title = null;
		this.view = this.parentView = null;
	}
	
	Sidebar.prototype.assembly = function(){
		
		var self = this;
		this.setActivateOff();
		
		this.$header.appendTo(this.$body);
		this.$context.appendTo(this.$body);
		this.$body.appendTo(document.body);
		
		if(this.style){
			this.$body.css(this.style);
		}
		
		$(this.$left).click(function(){
			self.close();
		});
		$(this.$right).click(function(){
			self.submit();
		});
	}
	
	Sidebar.prototype.createContext = function(){
		this.$context = $('<div>', {
			'id'    : 'am-plugin-sidebar-context'+this.id,
			'class' : 'am-plugin-sidebar-context'
		});
	}
	
	Sidebar.prototype.createBody = function(){
		this.$body = $('<div>', {
			'class' : 'am-plugin-sidebar'
		});
		this.$body.css('display' , 'none');
	}
	
	Sidebar.prototype.createHeader = function(){
		
		this.$return_i = $('<i>', {
			'class' : ''+this.returnIcon
		});
		
		this.$left = $('<div>', {
			'class' : 'am-plugin-sidebar-header-left'
		});
		
		this.$return_i.appendTo(this.$left);
		
		this.$right = $('<div>', {
			'class' : 'am-plugin-sidebar-header-right'
		});
		
		this.$right.text('确定');
		
		this.$title = $('<h1>', {
			'class' : 'am-plugin-sidebar-header-title'
		})
		
		this.$title.text(this.title);
		
		this.$header = $('<header>', {
			'class' : 'am-plugin-sidebar-header'
		});
		
		this.$left.appendTo(this.$header);
		this.$right.appendTo(this.$header);
		this.$title.appendTo(this.$header);
	}
 
	
	/**
	 * 初始化配置
	 */
	Sidebar.prototype.initConfiguration = function(view){
		this.view       = view;
		this.title      = view.getAttr('title');
		this.level      = view.getAttr('level');
		this.returnIcon = view.getAttr('returnIcon');
		this.style      = view.getAttr('style');
		this.parentView = view.getAttr('parentView');
		this.id 		= view.getAttr('id') ? '-'+view.getAttr('id') : '';
		
		this.createBody();
		this.createHeader();
		this.createContext();
		this.assembly();
	}
	
	/**
	 * 标题设置
	 * @param title
	 */
	Sidebar.prototype.setTitle = function(title){
		this.$title.text(title);
	}
	
	/**
	 * 激活
	 */
	Sidebar.prototype.setActivateOn = function(){
		var transform = {
				'transition-duration' : '.2s',
				'transition-timing-function' : 'linear',
				'transform' : 'translate(0px, 0px)'
		};
		this.$body.css(transform);
	}
	
	/**
	 * 关闭
	 */
	Sidebar.prototype.setActivateOff = function(){
		var self = this;
		var x = document.body.clientWidth;
		var transform = { 
				'transition-duration' : '.2s',
				'transition-timing-function' : 'linear',
				'transform' : 'translate('+x+'px, 0px)'
		};
		this.$body.css(transform);
	}
	
	/**
	 * 打开
	 */
	Sidebar.prototype.open = function(){
		var self = this;
		this.$body.css('display', 'block');
		var timeoutId = setTimeout(function() {
			self.setActivateOn();
			self.correctView();
			clearTimeout(timeoutId);
		}, 250);
	}
	
	/**
	 * 关闭
	 */
	Sidebar.prototype.close = function(){
		var self = this;
		self.setActivateOff();
		var timeoutId = setTimeout(function() {
			self.$body.css('display' , 'none');
			clearTimeout(timeoutId);
		}, 250);
		
	}
	
	
	/**
	 * 提交
	 */
	Sidebar.prototype.submit = function(){
		var self = this;
		var submit = self.view.getAttr('submit');
		if(submit){
			submit();
			var parentView = this.parentView || null;
			var returnAfter = parentView ? parentView.getAttr('returnAfter') : null;
			if(parentView && returnAfter){
				returnAfter();
			}
		}
		this.close();
	}
	
 
	/**
	 * 纠正视图
	 */
	Sidebar.prototype.correctView = function(){
		var self = this;
        var size = 5;
        var zindex = self.$body.css('zIndex');
        var intervalId = setInterval(function() {
        	self.$body.css('zIndex', zindex++);
        	if((--size) === 0){
        		clearInterval(intervalId);
        	}
        }, 100);
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
 
		setup: function() {
			
			var self = this;
			var parentNode = self.getAttr('parentNode');
			
			var sidebar = new Sidebar();
			sidebar.initConfiguration(self);
			self.setAttr('sidebar', sidebar);
	        
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		},
		
		correctView : function(){
			var sidebar = this.getAttr('sidebar');
			sidebar.correctView();
		},
		
		open : function() {
			var sidebar = this.getAttr('sidebar');
			var onOpen = this.getAttr('onOpen') || undefined;
			if(onOpen){
				onOpen();
			}
			sidebar.open();
		},
		
		submit : function() {
			
		},
		
		hide : function() {
			
		},
		
		/**
		 * 追加内容
		 */
		appendHtml : function(html){
			var sidebar = this.getAttr('sidebar');
			sidebar.$context.append(html);
		},
		
		/**
		 * 装入html
		 */
		html : function(html){
			var sidebar = this.getAttr('sidebar');
			sidebar.$context.html(html);
		},
		
		/**
		 * 标题设置
		 */
		setTitle : function(title){
			var sidebar = this.getAttr('sidebar');
			sidebar.setTitle(title);
		}
	});
}));
 