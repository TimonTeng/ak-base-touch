/**
 * Context View Class
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
	
	function ContextView(){
		
		this.items = this.view = this.loadComplete = this.scrollView = null;
		
		this.contextItems = [];
		
	    this.$parentNode = null;
		
		this.threads = 0;
		
	}
	
	ContextView.prototype.initConfiguration = function(view){
		this.view = view;
		this.scrollView   = view.getAttr('scrollView');
		this.contextItems = view.getAttr('items') || [];
		this.loadComplete  = view.getAttr('loadComplete');
		var parentNode    = view.getAttr('parentNode');
		this.$parentNode  = $(parentNode);
		
		if(this.contextItems.length === 0){
			 throw Error('ContextView attribute items unspecified');
			 return;
		}
 
		if(this.$parentNode.length === 0){
			 throw Error('ContextView attribute parentNode unspecified');
			 return;
		}
 
		if(!this.scrollView){
			 throw Error('ContextView attribute scrollView unspecified');
			 return;
		}
 
		this.init();
	}
	
	/**
	 * 初始化
	 */
	ContextView.prototype.init = function(){
		this.renderComplete();
		for(var i = 0; i < this.contextItems.length; i++) {
			var config =  this.contextItems[i];
			this.loadContext(config, i);
		}
	}
	
	/**
	 * 渲染完成后执行
	 */
	ContextView.prototype.renderComplete = function(){
		
		var self = this;
		if(!self.renderAfter){
			return;
		}
		var intervalId =  setInterval(function() {
			if(self.threads == self.contextItems.length){
				self.loadComplete();
				self.scrollView.refresh();
				clearInterval(intervalId);
			}
		}, 1000);
	}
	
	/**
	 * 渲染完成后执行
	 */
	ContextView.prototype.renderItemComplete = function(){
		++this.threads;
	}
	
	/**
	 * 
	 * 构造内容元素
	 */
	ContextView.prototype.createContextElement = function(config, index){
		var id = config.id || 'am-plugin-context-view'+index;
		return $('<div>', {
			id : id
		});
	}
	
	/**
	 * 渲染内容
	 */
	ContextView.prototype.renderContext = function(config, data){
		var path     = config.template;
		var template = Template.compile(path, data);
		return template;
	}
	
	
	/**
	 * 加载内容
	 * @param config
	 */
	ContextView.prototype.loadContext = function(config, index){
		if(!config.result){
			 throw Error('ContextView.items config.result attribute unspecified');
			 return;
		}
		var self = this;
        $.getJSON(config.apiUrl).then(function(data) {
        	var html = self.renderContext(config, data[config.result]);
    		var $contextElement = self.createContextElement(config, index);
    		$contextElement.html(html);
    		$contextElement.appendTo(self.$parentNode);
    		if(config.renderAfter){
    			config.renderAfter($contextElement);
    		}
    		self.renderItemComplete();
        }, function() {
            console.log('ContextView.loadContext Error...')
        });
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
		
		events: {},
		
		setup: function() {
			var self = this;
			var contextView = new ContextView();
			contextView.initConfiguration(self);
			self.setAttr('contextView', contextView);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		}
	});
}));
 