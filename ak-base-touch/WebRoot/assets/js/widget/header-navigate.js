/**
 * Header Navigate Class
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

		root.HeaderNavigate = factory(root.HeaderNavigate);
	}
	
}(this, function($, _, Backbone, View, Template) {
	'use strict'
	
	function HeaderNavigate(){
		this.title = this.left = this.right = null;
		this.$header = this.$left = this.$right = this.$title = null;
		this.view = null;
	}
 
	HeaderNavigate.prototype.createHeader = function(){
		var self = this;
		this.$left = $('<div>', {
			'class' : 'am-plugin-header-left'
		});
		
		if(this.left){
			
			if(this.left.iconClass){
				this.$leftIcon = $('<i>', {
					'class' : ''+this.left.iconClass
				});
				this.$leftIcon.appendTo(this.$left);
			}
			
			if(this.left.isSideFrameView){
				var intervalId = setInterval(function() {
					if(document.parentWindow){
						document.parentWindow.SideFrameView.bindClose(self.$left);
						clearInterval(intervalId);
					}
				}, 300);
			}else if(this.left.event){
				for ( var eventName in this.left.event) {
					$(this.$left).bind(eventName, this.left.event[eventName]);
				}
			}
 
		}
		
		
		this.$right = $('<div>', {
			'class' : 'am-plugin-header-right'
		});
		
		if(this.right){
			
			if(this.right.iconClass){
				this.$rightIcon = $('<i>', {
					'class' : ''+this.right.iconClass
				});
				this.$rightIcon.appendTo(this.$right);
			}
			
			if(this.right.event){
				for ( var eventName in this.right.event) {
					$(this.$right).bind(eventName, this.right.event[eventName]);
				}
			}
			
		}
		
		this.$title = $('<h1>', {
			'class' : 'am-plugin-header-title'
		});
		
		this.$title.text(this.title);
		
		this.$title.appendTo($('.am-plugin-header', document.body));
		this.$right.appendTo($('.am-plugin-header', document.body));
		this.$left.appendTo($('.am-plugin-header', document.body));
		
		if(this.style){
			$('.am-plugin-header', document.body).css(this.style);
		}
	}
	
	/**
	 * 初始化配置
	 */
	HeaderNavigate.prototype.initConfiguration = function(view){
		this.view       = view;
		this.title      = view.getAttr('title');
		this.style      = view.getAttr('style');
		this.left       = view.getAttr('left');
		this.right      = view.getAttr('right');
		this.createHeader();
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
			var headerNavigate = new HeaderNavigate();
			headerNavigate.initConfiguration(self);
			self.setAttr('headerNavigate', headerNavigate);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		} 
	});
}));
 