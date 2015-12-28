/**
 * Sideframe Class
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
	
	function SideFrameView(){
		this.url = this.view =null;
		this.$title = this.$body = this.$frame = null;
	}
	
	SideFrameView.prototype.assembly = function(){
		
		var self = this;
		this.close();
		this.$frame.appendTo(this.$body);
		this.$body.appendTo(document.body);
		
		if(this.style){
			this.$body.css(this.style);
		}
 
	}
	
	SideFrameView.prototype.createTitle = function(){
		
	}
	
	SideFrameView.prototype.createBody = function(){
		this.$body = $('<div>', {
			'class' : 'am-plugin-sidebar'
		});
	}
	
	SideFrameView.prototype.createFrame = function(){
		
		var self = this;
		this.$frame = $('<iframe>', {
			'id' : 'side-frame-view',
			'width'     : '100%',
			'height'    : '100%',
			'scrolling' : 'no'
		});
	}
 
	/**
	 * 初始化配置
	 */
	SideFrameView.prototype.initConfiguration = function(view){
		this.view       = view;
		this.title      = view.getAttr('title');
		this.style      = view.getAttr('style') || {};
		this.url	    = view.getAttr('url');
		
		this.createBody();
		this.createFrame();
		this.assembly();
	}
	
	/**
	 * 打开url
	 */
	SideFrameView.prototype.openUrl = function(url, closeTarget){
		var self = this;
		var url = url || this.url;
		this.$frame.get(0).onload = function(){
			self.open();
			var intervalId = setInterval(function() {
				if(!self.$frame.get(0).contentWindow.document.parentWindow){
					self.$frame.get(0).contentWindow.document.parentWindow = window;
					window.SideFrameView = self;
					clearInterval(intervalId);
				}
			}, 500);
		}
		url = (url.indexOf('?') != -1)  ? url+'&v='+new Date() : url+'?v='+new Date(); 
		this.$frame.attr('src', url);
	}
	
	/**
	 * 关闭绑定的窗口
	 */
	SideFrameView.prototype.bindClose = function(returnElement){
		var self = this;
		$(returnElement).bind('touchend', function(){
			self.close();
		});
	}
	
	
	/**
	 * 打开
	 */
	SideFrameView.prototype.open = function(){
		var self = this;
		var transform = {
				'display' : 'block',
				'transition-duration' : '.2s',
				'transition-timing-function' : 'linear',
				'transform' : 'translate(0px, 0px)'
		};
		this.$body.css('display', 'block');
		var timeoutId = setTimeout(function() {
			self.$body.css(transform);
			clearTimeout(timeoutId);
		}, 100);
	}
	
	/**
	 * 关闭
	 */
	SideFrameView.prototype.close = function(){
		var self = this;
		this.$frame.get(0).onload = null;
		var x = document.body.clientWidth;
		var transform = { 
				'transition-duration' : '.2s',
				'transition-timing-function' : 'linear',
				'transform' : 'translate('+x+'px, 0px)'
		};
		this.$body.css(transform);
		
		var timeoutId = setTimeout(function() {
			self.$body.css('display', 'none');
			clearTimeout(timeoutId);
		}, 500);
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
			var sideFrameView = new SideFrameView();
			sideFrameView.initConfiguration(self);
			self.setAttr('sideFrameView', sideFrameView);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		},
		
		open : function(closeTarget) {
			var sideFrameView = this.getAttr('sideFrameView');
			sideFrameView.openUrl(null, closeTarget);
		},
		
		openUrl : function(url, closeTarget){
			var sideFrameView = this.getAttr('sideFrameView');
			sideFrameView.openUrl(url, closeTarget);
		}
		
	});
}));
 